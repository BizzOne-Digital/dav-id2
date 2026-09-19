import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { verifyAndSubmitChallenge } from "@/lib/actions/game";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  stopIndex: z.number().int().min(0),
  answer: z.string().max(500).optional(),
  hintUsed: z.boolean().optional(),
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

    const result = await verifyAndSubmitChallenge(parsed.data);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, error: "Submission failed" }, { status: 500 });
  }
}
