"use server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import {
  Booking,
  Challenge,
  Completion,
  GameSession,
  LeaderboardEntry,
  Location,
  RouteManifest,
  RouteRecipe,
  Submission,
  Team,
  TeamMember,
  Certificate,
} from "@/lib/models";
import { generateRoute } from "@/lib/routing/route-generator";
import { isAnswerCorrect } from "@/lib/game/answer";
import {
  isPlayWindowExpired,
  PLAY_WINDOW_EXPIRED_MESSAGE,
  resolvePlayExpiresAt,
} from "@/lib/game/playWindow";
import { calculatePoints, getNashvilleRank } from "@/lib/scoring/ranks";
import { signCompletion, verifyCompletionSignature } from "@/lib/verification/completion";
import { generateCompletionNumber, slugify } from "@/lib/utils";
import crypto from "crypto";
import { z } from "zod";

async function loadPlayWindowExpiry(
  session: { bookingId?: unknown; playExpiresAt?: Date | null },
  bookingId?: unknown
) {
  const id = bookingId ?? session.bookingId;
  const booking =
    id && mongoose.Types.ObjectId.isValid(String(id))
      ? await Booking.findById(id)
          .select("playExpiresAt updatedAt createdAt status")
          .lean()
      : null;
  return resolvePlayExpiresAt(session, booking);
}

export async function buildRouteManifestForSession(sessionId: string) {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new Error("Invalid session");
  }

  const session = await GameSession.findById(sessionId);
  if (!session) throw new Error("Session not found");

  const playExpiresAt = await loadPlayWindowExpiry(session);
  if (isPlayWindowExpired(playExpiresAt)) {
    throw new Error(PLAY_WINDOW_EXPIRED_MESSAGE);
  }

  const existing = await RouteManifest.findOne({ sessionId: session._id });
  if (existing) return existing;

  const booking = session.bookingId ? await Booking.findById(session.bookingId).lean() : null;
  const groupType = session.groupType || booking?.groupType || "friends";

  const recipe = await RouteRecipe.findOne({ groupType, active: true }).lean();
  if (!recipe) {
    throw new Error("No active route recipe for this group type");
  }

  const locations = await Location.find({
    status: { $in: ["active", "crowded"] },
  }).lean();

  const { seed, stops } = generateRoute({
    sessionId: session._id.toString(),
    teamId: session.teamId.toString(),
    groupType,
    youngestAge: booking?.youngestAge ?? undefined,
    alcoholFree: booking?.alcoholFree ?? undefined,
    accessibilityNotes: booking?.accessibilityNotes ?? undefined,
    locations,
    recipe,
  });

  if (!stops.length) {
    throw new Error("Could not generate route — check locations and recipe");
  }

  const manifestStops = [];
  for (const stop of stops) {
    const challenge = await Challenge.findOne({
      locationId: stop.locationId,
      active: true,
    })
      .sort({ version: -1 })
      .lean();
    const location = locations.find((l) => l._id.toString() === stop.locationId);

    manifestStops.push({
      order: stop.order,
      locationId: stop.locationId,
      challengeId: challenge?._id,
      challengeVersion: challenge?.version ?? 1,
      locationVersion: location?.version ?? 1,
      status: stop.order === 0 ? "active" : "locked",
    });
  }

  const manifest = await RouteManifest.create({
    sessionId: session._id,
    seed,
    ruleVersion: recipe.version ?? 1,
    stops: manifestStops,
    startLocationId: manifestStops[0]?.locationId,
    finishLocationId: manifestStops[manifestStops.length - 1]?.locationId,
  });

  session.routeSeed = seed;
  session.ruleVersion = recipe.version ?? 1;
  session.status = "active";
  session.startedAt = new Date();
  session.currentStopIndex = 0;
  await session.save();

  return manifest;
}

const submitSchema = z.object({
  sessionId: z.string().min(1),
  stopIndex: z.number().int().min(0),
  answer: z.string().max(500).optional(),
  hintUsed: z.boolean().optional(),
});

export type SubmitChallengeResult =
  | {
      success: true;
      correct: true;
      pointsAwarded: number;
      displayNumber: string;
      signature: string;
      nextStopIndex: number | null;
    }
  | { success: true; correct: false; attempts: number; message: string }
  | { success: false; error: string };

export async function verifyAndSubmitChallenge(
  input: z.infer<typeof submitSchema>
): Promise<SubmitChallengeResult> {
  const parsed = submitSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await connectDB();
  const { sessionId, stopIndex, answer, hintUsed } = parsed.data;

  const session = await GameSession.findById(sessionId);
  if (!session || session.status !== "active") {
    return { success: false, error: "Session not active" };
  }

  const playExpiresAt = await loadPlayWindowExpiry(session);
  if (isPlayWindowExpired(playExpiresAt)) {
    return { success: false, error: PLAY_WINDOW_EXPIRED_MESSAGE };
  }

  const manifest = await RouteManifest.findOne({ sessionId: session._id });
  if (!manifest?.stops?.[stopIndex]) {
    return { success: false, error: "Invalid stop" };
  }

  const stop = manifest.stops[stopIndex];
  if (stop.status !== "active") {
    return { success: false, error: "This stop is not active yet" };
  }

  const challenge = stop.challengeId
    ? await Challenge.findById(stop.challengeId).lean()
    : null;
  if (!challenge) {
    return { success: false, error: "Challenge not found" };
  }

  let submission = await Submission.findOne({
    sessionId: session._id,
    stopIndex,
    challengeId: challenge._id,
  });

  if (!submission) {
    submission = await Submission.create({
      sessionId: session._id,
      teamId: session.teamId,
      stopIndex,
      challengeId: challenge._id,
      attempts: 0,
      hintUsed: hintUsed ?? false,
    });
  }

  if (submission.status === "accepted") {
    const completion = await Completion.findOne({
      sessionId: session._id,
      stopIndex,
    }).lean();
    return {
      success: true,
      correct: true,
      pointsAwarded: submission.pointsAwarded ?? 0,
      displayNumber: completion?.displayNumber ?? "",
      signature: completion?.signature ?? "",
      nextStopIndex: stopIndex + 1 < manifest.stops.length ? stopIndex + 1 : null,
    };
  }

  const attempts = (submission.attempts ?? 0) + 1;
  submission.attempts = attempts;
  if (hintUsed) submission.hintUsed = true;

  const correct = isAnswerCorrect(answer ?? "", challenge.answer, challenge.acceptedVariants);
  if (!correct) {
    submission.status = "rejected";
    await submission.save();
    const limit = challenge.attemptLimit ?? 5;
    if (attempts >= limit) {
      return {
        success: true,
        correct: false,
        attempts,
        message: "Maximum attempts reached. Contact support for a hint.",
      };
    }
    return {
      success: true,
      correct: false,
      attempts,
      message: "Not quite — try again!",
    };
  }

  const pointsAwarded = calculatePoints(challenge.basePoints ?? 300, {
    hintUsed: submission.hintUsed,
    hintPenalty: challenge.hintPenalty ?? 50,
    wrongAttempts: Math.max(0, attempts - 1),
  });

  submission.status = "accepted";
  submission.pointsAwarded = pointsAwarded;
  submission.answer = answer;
  await submission.save();

  const displayNumber = generateCompletionNumber();
  const signature = signCompletion({
    teamId: session.teamId.toString(),
    sessionId: session._id.toString(),
    stopIndex,
    challengeId: challenge._id.toString(),
    displayNumber,
  });

  await Completion.findOneAndUpdate(
    { sessionId: session._id, stopIndex },
    {
      sessionId: session._id,
      teamId: session.teamId,
      stopIndex,
      locationId: stop.locationId,
      challengeId: challenge._id,
      challengeVersion: stop.challengeVersion,
      displayNumber,
      signature,
      points: pointsAwarded,
    },
    { upsert: true, new: true }
  );

  stop.status = "completed";
  manifest.stops[stopIndex] = stop;

  const nextIndex = stopIndex + 1;
  let nextStopIndex: number | null = null;
  if (nextIndex < manifest.stops.length) {
    manifest.stops[nextIndex].status = "active";
    nextStopIndex = nextIndex;
    session.currentStopIndex = nextIndex;
  }

  session.score = (session.score ?? 0) + pointsAwarded;
  session.completedStops = (session.completedStops ?? 0) + 1;
  await manifest.save();
  await session.save();

  return {
    success: true,
    correct: true,
    pointsAwarded,
    displayNumber,
    signature,
    nextStopIndex,
  };
}

function buildVaultCode(completions: { stopIndex?: number | null; displayNumber: string }[]): string {
  return completions
    .sort((a, b) => (a.stopIndex ?? 0) - (b.stopIndex ?? 0))
    .map((c) => c.displayNumber)
    .join("-");
}

const finishSchema = z.object({
  sessionId: z.string().min(1),
  vaultCode: z.string().min(1).max(200),
});

export type FinishGameResult =
  | {
      success: true;
      certificateId: string;
      certificateIds: string[];
      verificationSlug: string;
      rankTitle: string;
      finalScore: number;
    }
  | { success: false; error: string };

export async function finishGameSession(
  input: z.infer<typeof finishSchema>
): Promise<FinishGameResult> {
  const parsed = finishSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await connectDB();
  const session = await GameSession.findById(parsed.data.sessionId);
  if (!session) return { success: false, error: "Session not found" };
  if (session.status === "finished") {
    const existing = await Certificate.find({ sessionId: session._id }).sort({ ticketIndex: 1 }).lean();
    if (existing.length) {
      const first = existing[0];
      return {
        success: true,
        certificateId: first.certificateId,
        certificateIds: existing.map((c) => c.certificateId),
        verificationSlug: first.verificationSlug ?? "",
        rankTitle: first.rankTitle ?? getNashvilleRank(session.score ?? 0),
        finalScore: first.finalScore ?? session.score ?? 0,
      };
    }
  }

  const manifest = await RouteManifest.findOne({ sessionId: session._id });
  const totalStops = manifest?.stops?.length ?? 0;
  const completions = await Completion.find({
    sessionId: session._id,
    revoked: { $ne: true },
  }).lean();

  if (completions.length < totalStops) {
    return { success: false, error: "Complete all stops before unlocking the vault" };
  }

  for (const c of completions) {
    const valid = verifyCompletionSignature(
      {
        teamId: session.teamId.toString(),
        sessionId: session._id.toString(),
        stopIndex: c.stopIndex ?? 0,
        challengeId: c.challengeId?.toString() ?? "",
        displayNumber: c.displayNumber,
      },
      c.signature
    );
    if (!valid) {
      return { success: false, error: "Completion verification failed" };
    }
  }

  const expectedVault = buildVaultCode(completions);
  if (normalizeVault(parsed.data.vaultCode) !== normalizeVault(expectedVault)) {
    return { success: false, error: "Incorrect vault code" };
  }

  const team = await Team.findById(session.teamId).lean();
  const booking = session.bookingId ? await Booking.findById(session.bookingId).lean() : null;
  const rankTitle = getNashvilleRank(session.score ?? 0);
  session.status = "finished";
  session.finishedAt = new Date();
  session.finalRankTitle = rankTitle;
  await session.save();

  const members = await TeamMember.find({ teamId: session.teamId }).sort({ createdAt: 1 }).lean();
  const paidSeats = Math.max(1, booking?.playerCount ?? team?.playerCount ?? members.length ?? 1);
  const roster = (booking?.playerRoster ?? []).filter((n): n is string => !!n?.trim());

  const recipients: { name: string; teamMemberId?: string }[] = [];
  for (let i = 0; i < paidSeats; i++) {
    const member = members[i];
    const name =
      member?.displayName?.trim() ||
      roster[i]?.trim() ||
      (i === 0 ? booking?.captainName?.trim() : "") ||
      `Player ${i + 1}`;
    recipients.push({
      name,
      teamMemberId: member?._id?.toString(),
    });
  }

  await Certificate.deleteMany({ sessionId: session._id });

  const certificateIds: string[] = [];
  const baseSlug = slugify(team?.name ?? "team");

  for (let i = 0; i < recipients.length; i++) {
    const ticketNum = i + 1;
    const certificateId = `NSH-CERT-${crypto.randomBytes(3).toString("hex").toUpperCase()}-${ticketNum}`;
    const verificationSlug = `${baseSlug}-t${ticketNum}-${crypto.randomBytes(2).toString("hex")}`;
    certificateIds.push(certificateId);
    await Certificate.create({
      sessionId: session._id,
      teamId: session.teamId,
      certificateId,
      teamName: team?.name,
      playerDisplayName: recipients[i].name,
      teamMemberId: recipients[i].teamMemberId,
      ticketIndex: ticketNum,
      finalScore: session.score,
      rankTitle,
      verificationSlug,
    });
  }

  const primaryId = certificateIds[0] ?? "";
  let verificationSlug = "";
  if (primaryId) {
    const first = await Certificate.findOne({ certificateId: primaryId }).lean();
    verificationSlug = first?.verificationSlug ?? "";
  }

  await LeaderboardEntry.findOneAndUpdate(
    { sessionId: session._id },
    {
      sessionId: session._id,
      teamId: session.teamId,
      teamName: team?.name,
      teamDisplayId: team?.displayId,
      score: session.score,
      completedStops: session.completedStops,
      activeElapsedSeconds: session.activeElapsedSeconds,
      scope: "public",
      locked: false,
    },
    { upsert: true, new: true }
  );

  return {
    success: true,
    certificateId: primaryId,
    certificateIds,
    verificationSlug,
    rankTitle,
    finalScore: session.score ?? 0,
  };
}

function normalizeVault(code: string): string {
  return code.trim().replace(/\s+/g, "");
}

const joinSchema = z.object({
  joinCode: z.string().min(4).max(12),
  displayName: z.string().min(2).max(80),
  userId: z.string().optional(),
});

export async function joinTeamByCode(input: z.infer<typeof joinSchema>) {
  const parsed = joinSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await connectDB();
  const team = await Team.findOne({ joinCode: parsed.data.joinCode });
  if (!team) {
    return { success: false as const, error: "Invalid join code" };
  }

  const playExpiresAt = await loadPlayWindowExpiry({}, team.bookingId);
  if (isPlayWindowExpired(playExpiresAt)) {
    return { success: false as const, error: PLAY_WINDOW_EXPIRED_MESSAGE };
  }

  const memberCount = await TeamMember.countDocuments({ teamId: team._id });
  const seatLimit = team.playerCount ?? 4;
  if (memberCount >= seatLimit) {
    return {
      success: false as const,
      error: `This team is full (${seatLimit} tickets). Ask the captain to confirm player count or book additional tickets.`,
    };
  }

  const memberFilter = parsed.data.userId
    ? { teamId: team._id, userId: new mongoose.Types.ObjectId(parsed.data.userId) }
    : { teamId: team._id, displayName: parsed.data.displayName };

  const existing = await TeamMember.findOne(memberFilter);
  if (!existing) {
    await TeamMember.create({
      teamId: team._id,
      userId: parsed.data.userId ? new mongoose.Types.ObjectId(parsed.data.userId) : undefined,
      displayName: parsed.data.displayName,
      role: "player",
      rulesAccepted: true,
    });
  }

  const session = await GameSession.findOne({ teamId: team._id }).sort({ createdAt: -1 });

  return {
    success: true as const,
    teamId: team._id.toString(),
    teamName: team.name,
    displayId: team.displayId,
    sessionId: session?._id.toString(),
  };
}
