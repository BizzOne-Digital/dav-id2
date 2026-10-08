import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession, Team, TeamMember } from "@/lib/models";
import {
  isPlayWindowExpired,
  PLAY_WINDOW_EXPIRED_MESSAGE,
  resolvePlayExpiresAt,
} from "@/lib/game/playWindow";

export type PlayRole = "captain" | "teammate";

export function normalizeJoinCode(raw: string) {
  return raw.replace(/\s/g, "").toUpperCase();
}

export function normalizeBookingReference(raw: string) {
  const trimmed = raw.trim().toUpperCase();
  if (/^BK-/.test(trimmed)) return trimmed;
  if (/^BK/.test(trimmed)) return `BK-${trimmed.slice(2)}`;
  return `BK-${trimmed}`;
}

export async function resolvePlayCode(joinCode: string, role: PlayRole) {
  const normalized = normalizeJoinCode(joinCode);
  if (!/^[A-Z0-9]{4,12}$/.test(normalized)) {
    return { ok: false as const, error: "Enter your 6-digit hunt code (letters and numbers)." };
  }

  await connectDB();
  const team = await Team.findOne({ joinCode: normalized }).lean();
  if (!team) {
    return { ok: false as const, error: "We could not find that code. Check the 6-digit code from your confirmation email or captain." };
  }

  const booking =
    team.bookingId && mongoose.Types.ObjectId.isValid(String(team.bookingId))
      ? await Booking.findById(team.bookingId)
          .select("playExpiresAt updatedAt createdAt status")
          .lean()
      : null;

  const session = await GameSession.findOne({ teamId: team._id }).sort({ createdAt: -1 }).lean();
  if (!session) {
    return {
      ok: false as const,
      error: "Your hunt is still being set up. Wait a minute and try again, or use Find my booking below.",
    };
  }

  const playExpiresAt = resolvePlayExpiresAt(session, booking);
  if (isPlayWindowExpired(playExpiresAt)) {
    return { ok: false as const, error: PLAY_WINDOW_EXPIRED_MESSAGE };
  }

  const sessionId = String(session._id);
  const seatLimit = team.playerCount ?? 4;
  const memberCount = await TeamMember.countDocuments({ teamId: team._id });

  const meta = {
    teamName: team.name,
    joinCode: team.joinCode,
    sessionId,
    seatLimit,
    memberCount,
    sessionStatus: session.status as string,
    bookingId: team.bookingId ? String(team.bookingId) : undefined,
  };

  if (session.status === "active" || session.status === "paused") {
    return {
      ok: true as const,
      action: "resume" as const,
      path: `/game/play/${sessionId}`,
      ...meta,
    };
  }
  if (session.status === "finished" || session.status === "review") {
    return {
      ok: true as const,
      action: "finish" as const,
      path: `/game/finish/${sessionId}`,
      ...meta,
    };
  }

  if (role === "captain" || seatLimit === 1) {
    return {
      ok: true as const,
      action: "lobby" as const,
      path: `/game/lobby/${sessionId}?code=${encodeURIComponent(team.joinCode)}`,
      ...meta,
    };
  }

  if (memberCount >= seatLimit) {
    return {
      ok: true as const,
      action: "lobby" as const,
      path: `/game/lobby/${sessionId}?code=${encodeURIComponent(team.joinCode)}`,
      message: "This team is full. If you are the captain, open the lobby below.",
      ...meta,
    };
  }

  return { ok: true as const, action: "join" as const, path: null, ...meta };
}

export async function findBookingByEmail(email: string) {
  const emailTrimmed = email.trim();
  if (!emailTrimmed.includes("@")) {
    return { ok: false as const, error: "Enter the email you used at checkout." };
  }

  await connectDB();
  const escaped = emailTrimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const bookings = await Booking.find({
    captainEmail: { $regex: new RegExp(`^${escaped}$`, "i") },
    status: { $in: ["confirmed", "completed"] },
  })
    .sort({ createdAt: -1 })
    .limit(8)
    .select("_id bookingReference playExpiresAt updatedAt createdAt status")
    .lean();

  for (const booking of bookings) {
    if (!isPlayWindowExpired(resolvePlayExpiresAt({}, booking))) {
      return {
        ok: true as const,
        bookingId: String(booking._id),
        bookingReference: booking.bookingReference,
      };
    }
  }

  if (bookings.length > 0) {
    return {
      ok: false as const,
      error: "We found a booking for that email, but the 72-hour play window has ended. Book again to play.",
    };
  }

  return {
    ok: false as const,
    error: "No active booking for that email. Try another email or use your 6-digit hunt code.",
  };
}

export async function findBookingByReference(reference: string, email: string) {
  const bookingReference = normalizeBookingReference(reference);
  const emailTrimmed = email.trim();
  if (!emailTrimmed.includes("@")) {
    return { ok: false as const, error: "Enter the email you used at checkout." };
  }

  await connectDB();
  const escaped = emailTrimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const booking = await Booking.findOne({
    bookingReference,
    captainEmail: { $regex: new RegExp(`^${escaped}$`, "i") },
    status: { $in: ["confirmed", "completed"] },
  })
    .select("_id bookingReference")
    .lean();

  if (!booking) {
    return {
      ok: false as const,
      error: "No booking found. Check your BK- reference and checkout email, or contact support.",
    };
  }

  return {
    ok: true as const,
    bookingId: String(booking._id),
    bookingReference: booking.bookingReference,
  };
}
