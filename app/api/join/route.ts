import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { joinTeamByCode } from "@/lib/actions/game";
import { PLAY_WINDOW_EXPIRED_MESSAGE } from "@/lib/game/playWindow";

const bodySchema = z.object({
  joinCode: z.string().min(4).max(12),
  displayName: z.string().min(2).max(80),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await joinTeamByCode({
      ...parsed.data,
      userId: session?.user?.id,
    });

    if (!result.success) {
      const status = result.error === PLAY_WINDOW_EXPIRED_MESSAGE ? 403 : 404;
      return NextResponse.json({ success: false, error: result.error }, { status });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: "Join failed" }, { status: 500 });
  }
}
