import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db/connect";
import { PaymentEvent } from "@/lib/models";
import { getStripe } from "@/lib/payments/stripe";
import { confirmCheckoutSession } from "@/lib/payments/confirm-checkout-session";

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
      const confirm = await confirmCheckoutSession(session.id);
      if (!confirm.fulfilled) {
        return NextResponse.json({ received: true, warning: confirm.reason });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook]", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
