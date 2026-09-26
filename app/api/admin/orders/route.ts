import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Order, Booking } from "@/lib/models";
import { requireAdminApi } from "@/lib/auth/require-admin";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin.error) return admin.error;

  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200).lean();
  const bookingIds = orders.map((o) => o.bookingId?.toString()).filter(Boolean);
  const bookings = await Booking.find({ _id: { $in: bookingIds } })
    .select("teamName captainEmail scheduledDate status bookingReference")
    .lean();
  const bookingMap = new Map(bookings.map((b) => [b._id.toString(), b]));

  const enriched = orders.map((order) => ({
    ...order,
    booking: bookingMap.get(order.bookingId?.toString() ?? "") ?? null,
  }));

  return NextResponse.json({ success: true, orders: enriched });
}
