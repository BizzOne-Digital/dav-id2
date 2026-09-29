import { connectDB } from "@/lib/db/connect";
import { Booking, Order, Team } from "@/lib/models";
import { confirmCheckoutSession } from "@/lib/payments/confirm-checkout-session";
import { fulfillOrder } from "@/lib/payments/fulfill-order";
import { getStripe } from "@/lib/payments/stripe";

/** Idempotent: after Stripe payment, ensure teams + join codes exist for the booking. */
export async function ensureBookingPlayReady(
  bookingId: string,
  stripeSessionId?: string | null
): Promise<void> {
  await connectDB();
  const booking = await Booking.findById(bookingId);
  if (!booking) return;

  const existingTeams = await Team.countDocuments({ bookingId: booking._id });
  if (existingTeams > 0) return;

  if (stripeSessionId) {
    try {
      const stripe = getStripe();
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
        const email =
          session.customer_details?.email?.toLowerCase() ??
          session.customer_email?.toLowerCase();
        if (email && !booking.captainEmail) {
          booking.captainEmail = email;
          await booking.save();
        }
      }
      await confirmCheckoutSession(stripeSessionId);
    } catch (err) {
      console.error("[ensureBookingPlayReady] Stripe confirm failed", err);
    }
  }

  const teamsAfterConfirm = await Team.countDocuments({ bookingId: booking._id });
  if (teamsAfterConfirm > 0) return;

  const order = await Order.findOne({ bookingId: booking._id, paymentStatus: "paid" }).sort({
    createdAt: -1,
  });
  if (!order) return;

  try {
    await fulfillOrder({
      bookingId,
      amountCents: order.amountCents,
      currency: order.currency ?? "usd",
      stripeSessionId: order.stripeSessionId ?? undefined,
      stripePaymentIntentId: order.stripePaymentIntentId ?? undefined,
      userId: order.userId?.toString(),
    });
  } catch (err) {
    console.error("[ensureBookingPlayReady] fulfill retry failed", err);
  }
}
