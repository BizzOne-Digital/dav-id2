import { NextResponse } from "next/server";
import { z } from "zod";
import { findBookingByEmail, findBookingByReference } from "@/lib/play/resolve-play-code";

const emailOnlySchema = z.object({
  email: z.string().email(),
});

const referenceSchema = z.object({
  email: z.string().email(),
  reference: z.string().min(4).max(32),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const withRef = referenceSchema.safeParse(json);
    if (withRef.success) {
      const result = await findBookingByReference(withRef.data.reference, withRef.data.email);
      if (!result.ok) {
        return NextResponse.json({ success: false, error: result.error }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        bookingId: result.bookingId,
        bookingReference: result.bookingReference,
      });
    }

    const emailOnly = emailOnlySchema.safeParse(json);
    if (!emailOnly.success) {
      return NextResponse.json(
        { success: false, error: emailOnly.error.issues[0]?.message ?? "Enter your checkout email" },
        { status: 400 }
      );
    }

    const result = await findBookingByEmail(emailOnly.data.email);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      bookingReference: result.bookingReference,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Could not find booking" }, { status: 500 });
  }
}
