import { NextResponse } from "next/server";
import { z } from "zod";
import { resolvePlayCode } from "@/lib/play/resolve-play-code";

const bodySchema = z.object({
  joinCode: z.string().min(4).max(12),
  role: z.enum(["captain", "teammate"]),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const result = await resolvePlayCode(parsed.data.joinCode, parsed.data.role);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, error: "Lookup failed" }, { status: 500 });
  }
}
