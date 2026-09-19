import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { GameSession, Team } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const sessions = await GameSession.find({
    status: { $in: ["lobby", "active", "paused"] },
  })
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();

  const teamIds = sessions.map((s) => s.teamId?.toString()).filter(Boolean);
  const teams = await Team.find({ _id: { $in: teamIds } })
    .select("name displayId joinCode color")
    .lean();
  const teamMap = new Map(teams.map((t) => [t._id.toString(), t]));

  const live = sessions.map((s) => ({
    id: s._id.toString(),
    sessionCode: s.sessionCode,
    status: s.status,
    score: s.score,
    completedStops: s.completedStops,
    currentStopIndex: s.currentStopIndex,
    startedAt: s.startedAt,
    team: teamMap.get(s.teamId?.toString() ?? "") ?? null,
  }));

  return NextResponse.json({ success: true, sessions: live });
}
