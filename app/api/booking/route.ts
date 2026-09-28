import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { Booking, Hunt } from "@/lib/models";
import { generateBookingReference } from "@/lib/utils";
import { syncCatalogHuntsToDb } from "@/lib/hunts/syncCatalogHunts";
import { missingServerEnv, registrationUnavailableMessage } from "@/lib/env/required";
import { BOOKING_FLEXIBLE_START_WINDOW } from "@/lib/site/bookingFlex";

export const runtime = "nodejs";

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
  playFormat: z.enum(["single_group", "competition"]).optional(),
  emergencyConsent: z.boolean().optional(),
  referralCode: z.string().max(50).optional(),
  promoCode: z.string().max(50).optional(),
  userId: z.string().optional(),
});

function mapBookingError(err: unknown): { status: number; message: string } {
  const code =
    err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
  if (code === "ENOTFOUND" || (err instanceof Error && err.message.includes("ENOTFOUND"))) {
    return {
      status: 503,
      message:
        "Database host not found. In Vercel, set MONGODB_URI to the exact connection string from MongoDB Atlas (Connect → Drivers)—check the cluster hostname for typos.",
    };
  }
  if (err instanceof Error && err.message.includes("MONGODB_URI")) {
    return { status: 503, message: registrationUnavailableMessage(["MONGODB_URI"]) };
  }
  if (err && typeof err === "object" && "name" in err && err.name === "ValidationError") {
    return { status: 400, message: "Please check your booking details and try again." };
  }
  if (err && typeof err === "object" && "code" in err && (err as { code?: number }).code === 11000) {
    return { status: 409, message: "This booking session already exists—refresh and try again." };
  }
  return { status: 500, message: "Failed to save booking" };
}

export async function POST(request: Request) {
  const missingDb = missingServerEnv(["MONGODB_URI"]);
  if (missingDb.length) {
    console.error("[booking] Missing env:", missingDb.join(", "));
    return NextResponse.json(
      { success: false, error: registrationUnavailableMessage(missingDb) },
      { status: 503 }
    );
  }

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

    if (data.huntSlug || !data.bookingId) {
      try {
        await syncCatalogHuntsToDb();
      } catch (syncErr) {
        console.error("[booking] catalog sync", syncErr);
      }
    }

    let huntId = data.huntId;
    if (!huntId && data.huntSlug) {
      const hunt = await Hunt.findOne({ slug: data.huntSlug, status: "published" }).lean();
      huntId = hunt?._id?.toString();
    }
    if (!huntId && !data.bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: data.huntSlug
            ? `Hunt "${data.huntSlug}" is not available. Refresh the page or pick another hunt.`
            : "Select a hunt to continue.",
        },
        { status: 400 }
      );
    }

    let booking = data.bookingId ? await Booking.findById(data.bookingId) : null;

    if (!booking && data.idempotencyKey) {
      booking = await Booking.findOne({ idempotencyKey: data.idempotencyKey });
    }

    const patch: Record<string, unknown> = { status: "draft" };
    if (huntId) patch.huntId = new mongoose.Types.ObjectId(huntId);
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
    if (data.playFormat) patch.playFormat = data.playFormat;
    if (data.emergencyConsent !== undefined) patch.emergencyConsent = data.emergencyConsent;
    if (data.referralCode) patch.referralCode = data.referralCode;
    if (data.promoCode) patch.promoCode = data.promoCode;
    if (data.userId) patch.userId = data.userId;
    if (data.idempotencyKey) patch.idempotencyKey = data.idempotencyKey;

    if (!booking) {
      if (!huntId || !data.groupType || data.playerCount === undefined) {
        return NextResponse.json(
          {
            success: false,
            error: "New bookings require a hunt, group type, and player count",
          },
          { status: 400 }
        );
      }

      booking = await Booking.create({
        ...patch,
        huntId: new mongoose.Types.ObjectId(huntId),
        groupType: data.groupType,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : new Date(),
        startWindow: data.startWindow ?? BOOKING_FLEXIBLE_START_WINDOW,
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
    const mapped = mapBookingError(err);
    return NextResponse.json({ success: false, error: mapped.message }, { status: mapped.status });
  }
}
