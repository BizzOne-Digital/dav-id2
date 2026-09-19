import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db/connect";
import { Order, PaymentEvent } from "@/lib/models";
import { getStripe } from "@/lib/payments/stripe";
import { fulfillOrder } from "@/lib/payments/fulfill-order";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const rawBody = await request.text();

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await connectDB();

    const existing = await PaymentEvent.findOne({ stripeEventId: event.id }).lean();
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    await PaymentEvent.create({
      type: event.type,
      stripeEventId: event.id,
      payload: event.data.object,
    });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;
      if (!bookingId) {
        return NextResponse.json({ received: true, warning: "No bookingId in metadata" });
      }

      const amountCents = session.amount_total ?? 0;
      const result = await fulfillOrder({
        bookingId,
        amountCents,
        currency: session.currency ?? "usd",
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        userId: session.client_reference_id ?? undefined,
      });

      const order = await Order.findById(result.orderId);
      if (order && session.payment_intent) {
        order.stripePaymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent.id;
        await order.save();
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
