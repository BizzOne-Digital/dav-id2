import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Booking, Hunt } from "@/lib/models";
import { generateBookingReference } from "@/lib/utils";

const draftSchema = z.object({
  step: z.enum(["details", "team", "preferences", "review"]),
  bookingId: z.string().optional(),
  idempotencyKey: z.string().optional(),
  huntSlug: z.string().optional(),
  huntId: z.string().optional(),
  groupType: z.string().min(1).optional(),
  scheduledDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  startWindow: z.string().optional(),
  playerCount: z.number().int().min(1).max(100).optional(),
  youngestAge: z.number().int().min(0).max(120).optional(),
  accessibilityNotes: z.string().max(2000).optional(),
  alcoholFree: z.boolean().optional(),
  indoorOutdoorPref: z.string().optional(),
  walkingPref: z.string().optional(),
  startArea: z.string().optional(),
  finishArea: z.string().optional(),
  teamName: z.string().max(120).optional(),
  captainName: z.string().max(120).optional(),
  captainEmail: z.string().email().optional(),
  captainPhone: z.string().max(30).optional(),
  teamColor: z.enum(["BLUE", "GOLD", "GREEN", "PINK", "RED", "CYAN"]).optional(),
  playerRoster: z.array(z.string().max(80)).max(100).optional(),
  squads: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        color: z.enum(["BLUE", "GOLD", "GREEN", "PINK", "RED", "CYAN"]),
        playerCount: z.number().int().min(1).max(100),
      })
    )
    .max(6)
    .optional(),
  emergencyConsent: z.boolean().optional(),
  referralCode: z.string().max(50).optional(),
  promoCode: z.string().max(50).optional(),
  userId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = draftSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const data = parsed.data;

    let huntId = data.huntId;
    if (!huntId && data.huntSlug) {
      const hunt = await Hunt.findOne({ slug: data.huntSlug }).lean();
      huntId = hunt?._id?.toString();
    }
    if (!huntId && !data.bookingId) {
      return NextResponse.json(
        { success: false, error: "huntId or huntSlug is required for a new booking" },
        { status: 400 }
      );
    }

    let booking = data.bookingId ? await Booking.findById(data.bookingId) : null;

    if (!booking && data.idempotencyKey) {
      booking = await Booking.findOne({ idempotencyKey: data.idempotencyKey });
    }

    const patch: Record<string, unknown> = { status: "draft" };
    if (huntId) patch.huntId = huntId;
    if (data.groupType) patch.groupType = data.groupType;
    if (data.scheduledDate) patch.scheduledDate = new Date(data.scheduledDate);
    if (data.startWindow) patch.startWindow = data.startWindow;
    if (data.playerCount !== undefined) patch.playerCount = data.playerCount;
    if (data.youngestAge !== undefined) patch.youngestAge = data.youngestAge;
    if (data.accessibilityNotes !== undefined) patch.accessibilityNotes = data.accessibilityNotes;
    if (data.alcoholFree !== undefined) patch.alcoholFree = data.alcoholFree;
    if (data.indoorOutdoorPref) patch.indoorOutdoorPref = data.indoorOutdoorPref;
    if (data.walkingPref) patch.walkingPref = data.walkingPref;
    if (data.startArea) patch.startArea = data.startArea;
    if (data.finishArea) patch.finishArea = data.finishArea;
    if (data.teamName) patch.teamName = data.teamName;
    if (data.captainName) patch.captainName = data.captainName;
    if (data.captainEmail) patch.captainEmail = data.captainEmail.toLowerCase();
    if (data.captainPhone) patch.captainPhone = data.captainPhone;
    if (data.teamColor) patch.teamColor = data.teamColor;
    if (data.playerRoster) patch.playerRoster = data.playerRoster.map((n) => n.trim()).filter(Boolean);
    if (data.squads) patch.squads = data.squads;
    if (data.emergencyConsent !== undefined) patch.emergencyConsent = data.emergencyConsent;
    if (data.referralCode) patch.referralCode = data.referralCode;
    if (data.promoCode) patch.promoCode = data.promoCode;
    if (data.userId) patch.userId = data.userId;
    if (data.idempotencyKey) patch.idempotencyKey = data.idempotencyKey;

    if (!booking) {
      if (!huntId || !data.groupType || !data.scheduledDate || !data.startWindow || !data.playerCount) {
        return NextResponse.json(
          {
            success: false,
            error:
              "New bookings require huntId, groupType, scheduledDate, startWindow, and playerCount",
          },
          { status: 400 }
        );
      }

      booking = await Booking.create({
        ...patch,
        huntId,
        groupType: data.groupType,
        scheduledDate: new Date(data.scheduledDate),
        startWindow: data.startWindow,
        playerCount: data.playerCount,
        bookingReference: generateBookingReference(),
      });
    } else {
      Object.assign(booking, patch);
      if (!booking.bookingReference) {
        booking.bookingReference = generateBookingReference();
      }
      await booking.save();
    }

    return NextResponse.json({
      success: true,
      step: data.step,
      booking: {
        id: booking._id.toString(),
        bookingReference: booking.bookingReference,
        status: booking.status,
        huntId: booking.huntId.toString(),
        groupType: booking.groupType,
        scheduledDate: booking.scheduledDate,
        startWindow: booking.startWindow,
        playerCount: booking.playerCount,
        teamName: booking.teamName,
        captainEmail: booking.captainEmail,
      },
    });
  } catch (err) {
    console.error("[booking]", err);
    return NextResponse.json({ success: false, error: "Failed to save booking" }, { status: 500 });
  }
}
