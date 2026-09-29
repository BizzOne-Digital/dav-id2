import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession, Team } from "@/lib/models";
import { ensureBookingPlayReady } from "@/lib/payments/ensure-booking-ready";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("bookingId");
  const sessionId = searchParams.get("session_id");

  if (!bookingId) {
    return NextResponse.json({ success: false, error: "bookingId required" }, { status: 400 });
  }

  try {
    await ensureBookingPlayReady(bookingId, sessionId);
    await connectDB();

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const teams = await Team.find({ bookingId: booking._id }).sort({ number: 1 }).lean();
    const sessions = await GameSession.find({ bookingId: booking._id }).lean();
    const sessionByTeam = new Map(sessions.map((s) => [String(s.teamId), s]));

    return NextResponse.json({
      success: true,
      bookingReference: booking.bookingReference,
      status: booking.status,
      teams: teams.map((t) => ({
        id: String(t._id),
        name: t.name,
        color: t.color,
        joinCode: t.joinCode,
        sessionId: sessionByTeam.get(String(t._id))?._id
          ? String(sessionByTeam.get(String(t._id))!._id)
          : null,
      })),
    });
  } catch (err) {
    console.error("[booking/confirmation]", err);
    return NextResponse.json({ success: false, error: "Could not load confirmation" }, { status: 500 });
  }
}
