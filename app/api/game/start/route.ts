import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/connect";
import { isAdminRole } from "@/lib/constants/roles";
import { GameSession, Team } from "@/lib/models";
import { buildRouteManifestForSession } from "@/lib/actions/game";

const bodySchema = z.object({
  sessionId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const gameSession = await GameSession.findById(parsed.data.sessionId);
    if (!gameSession) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    const team = await Team.findById(gameSession.teamId).lean();
    const isCaptain = team?.captainId?.toString() === session.user.id;
    if (!isCaptain && !isAdminRole(session.user.role)) {
      return NextResponse.json({ success: false, error: "Only the team captain can start" }, { status: 403 });
    }

    const manifest = await buildRouteManifestForSession(parsed.data.sessionId);

    return NextResponse.json({
      success: true,
      sessionId: gameSession._id.toString(),
      status: "active",
      stopCount: manifest.stops?.length ?? 0,
      seed: manifest.seed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start game";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
