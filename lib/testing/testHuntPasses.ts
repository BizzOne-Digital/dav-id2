/**
 * QA passes: one join code + lobby per catalog hunt (never shared across hunts).
 * Run via `npm run test-passes` with ALLOW_TEST_PASSES=1.
 */

import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession, Hunt, Team, User } from "@/lib/models";
import { syncCatalogHuntsToDb } from "@/lib/hunts/syncCatalogHunts";
import { CATALOG_HUNTS } from "@/lib/site/huntCatalog";
import { generateSessionCode } from "@/lib/utils";
import { computePlayExpiresAt } from "@/lib/game/playWindow";

const TEST_CAPTAIN_EMAIL = "qa-captain@musiccityscavengerhunt.test";
const TEST_PASS_PREFIX = "QA"; // join codes QA0001 … QA0008 (unique per hunt)

export type TestHuntPass = {
  huntSlug: string;
  huntTitle: string;
  joinCode: string;
  bookingReference: string;
  sessionId: string;
  lobbyUrl: string;
};

function joinCodeForIndex(i: number): string {
  return `${TEST_PASS_PREFIX}${String(i + 1).padStart(4, "0")}`;
}

export async function issueTestPassesForAllHunts(
  appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
): Promise<TestHuntPass[]> {
  if (process.env.ALLOW_TEST_PASSES !== "1") {
    throw new Error("Set ALLOW_TEST_PASSES=1 to create QA hunt passes.");
  }

  await connectDB();
  await syncCatalogHuntsToDb();

  let captain = await User.findOne({ email: TEST_CAPTAIN_EMAIL });
  if (!captain) {
    captain = await User.create({
      email: TEST_CAPTAIN_EMAIL,
      name: "QA Captain",
      role: "customer",
    });
  }
  const captainId = new mongoose.Types.ObjectId(String(captain._id));

  const playExpiresAt = computePlayExpiresAt(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const results: TestHuntPass[] = [];

  for (let i = 0; i < CATALOG_HUNTS.length; i++) {
    const catalog = CATALOG_HUNTS[i];
    const hunt = await Hunt.findOne({ slug: catalog.slug, status: "published" });
    if (!hunt) continue;

    const joinCode = joinCodeForIndex(i);
    const bookingReference = `TEST-${catalog.slug}`;

    let booking = await Booking.findOne({ bookingReference });
    if (!booking) {
      booking = await Booking.create({
        huntId: hunt._id,
        userId: captainId,
        groupType: "friends",
        playerCount: 4,
        captainEmail: TEST_CAPTAIN_EMAIL,
        captainName: "QA Captain",
        teamName: `QA ${catalog.title}`,
        teamColor: "GOLD",
        status: "confirmed",
        bookingReference,
        playExpiresAt,
        startWindow: "flexible",
      });
    } else {
      booking.huntId = new mongoose.Types.ObjectId(String(hunt._id));
      booking.status = "confirmed";
      booking.playExpiresAt = playExpiresAt;
      await booking.save();
    }

    let team = await Team.findOne({ bookingId: booking._id });
    if (!team) {
      const teamNumber = (await Team.countDocuments()) + 1;
      team = await Team.create({
        name: `QA ${catalog.title}`,
        color: "GOLD",
        number: teamNumber,
        displayId: `QA-${String(i + 1).padStart(2, "0")}`,
        captainId,
        joinCode,
        playerCount: 4,
        bookingId: booking._id,
      });
      booking.teamId = new mongoose.Types.ObjectId(String(team._id));
      await booking.save();
    } else {
      team.joinCode = joinCode;
      team.name = `QA ${catalog.title}`;
      await team.save();
    }

    let session = await GameSession.findOne({ bookingId: booking._id, teamId: team._id });
    if (!session) {
      session = await GameSession.create({
        sessionCode: generateSessionCode(),
        teamId: team._id,
        bookingId: booking._id,
        huntId: hunt._id,
        status: "lobby",
        groupType: "friends",
        playExpiresAt,
      });
    } else {
      session.huntId = new mongoose.Types.ObjectId(String(hunt._id));
      session.playExpiresAt = playExpiresAt;
      session.status = "lobby";
      await session.save();
    }

    const sessionId = String(session._id);
    results.push({
      huntSlug: catalog.slug,
      huntTitle: catalog.title,
      joinCode,
      bookingReference,
      sessionId,
      lobbyUrl: `${appUrl.replace(/\/$/, "")}/game/lobby/${sessionId}?code=${encodeURIComponent(joinCode)}`,
    });
  }

  return results;
}
