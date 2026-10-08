import { NextResponse } from "next/server";
import { z } from "zod";
import { findBookingByReference } from "@/lib/play/resolve-play-code";

const bodySchema = z.object({
  reference: z.string().min(4).max(32),
  email: z.string().email(),
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

    const result = await findBookingByReference(parsed.data.reference, parsed.data.email);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({ success: true, bookingId: result.bookingId, bookingReference: result.bookingReference });
  } catch {
    return NextResponse.json({ success: false, error: "Could not find booking" }, { status: 500 });
  }
}
