import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function normalizeSecretKey(raw: string | undefined): string | undefined {
  const key = raw?.trim();
  if (!key) return undefined;
  if (key.startsWith("pk_")) {
    console.error(
      "[stripe] STRIPE_SECRET_KEY looks like a publishable key (pk_). Use sk_live_/sk_test_ or a restricted rk_live_ key."
    );
    return undefined;
  }
  if (!key.startsWith("sk_") && !key.startsWith("rk_")) {
    console.error("[stripe] STRIPE_SECRET_KEY must start with sk_ or rk_.");
    return undefined;
  }
  return key;
}

export function getStripe(): Stripe | null {
  const key = normalizeSecretKey(process.env.STRIPE_SECRET_KEY);
  if (!key) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(key, {
      typescript: true,
    });
  }
  return stripeInstance;
}

export function getStripePublishableKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!key?.startsWith("pk_")) return undefined;
  return key;
}

export function isStripeConfigured(): boolean {
  return getStripe() != null && getStripePublishableKey() != null;
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
