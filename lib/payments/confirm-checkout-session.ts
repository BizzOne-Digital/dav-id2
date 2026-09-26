import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { fulfillOrder } from "@/lib/payments/fulfill-order";

function paymentIntentId(session: Stripe.Checkout.Session): string | undefined {
  const pi = session.payment_intent;
  if (!pi) return undefined;
  return typeof pi === "string" ? pi : pi.id;
}

/** Idempotent: safe to call from success page and from webhooks. */
export async function confirmCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { fulfilled: false as const, reason: "not_paid" as const };
  }

  const bookingId = session.metadata?.bookingId;
  if (!bookingId) {
    return { fulfilled: false as const, reason: "missing_booking" as const };
  }

  const amountCents = session.amount_total ?? 0;

  const result = await fulfillOrder({
    bookingId,
    amountCents,
    currency: session.currency ?? "usd",
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntentId(session),
    userId: session.client_reference_id ?? undefined,
  });

  return { fulfilled: true as const, ...result };
}
