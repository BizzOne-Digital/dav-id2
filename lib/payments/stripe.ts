import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

export type CheckoutSessionParams = {
  bookingId: string;
  amountCents: number;
  currency?: string;
  customerEmail?: string;
  lineItems: { label: string; quantity: number; unitAmountCents: number }[];
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<{ sessionId: string; url: string | null }> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items: params.lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: params.currency ?? "usd",
        unit_amount: item.unitAmountCents,
        product_data: { name: item.label },
      },
    })),
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      bookingId: params.bookingId,
      ...params.metadata,
    },
  });

  return { sessionId: session.id, url: session.url };
}
