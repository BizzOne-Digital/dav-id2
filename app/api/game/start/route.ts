import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/connect";
import { GameSession, Team } from "@/lib/models";
import { buildRouteManifestForSession } from "@/lib/actions/game";
import { canCaptainStartSession } from "@/lib/game/captain-access";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  joinCode: z.string().min(4).max(12).optional(),
});

export async function POST(request: Request) {
  try {
    const authSession = await auth();

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
    const allowed = canCaptainStartSession({
      userId: authSession?.user?.id,
      userRole: authSession?.user?.role,
      teamCaptainId: team?.captainId?.toString(),
      teamJoinCode: team?.joinCode,
      providedJoinCode: parsed.data.joinCode,
    });
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Enter your team join code to start (from your confirmation page), or sign in with the email you used at checkout.",
        },
        { status: 403 }
      );
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
