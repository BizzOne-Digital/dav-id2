/**
 * Quick Stripe connectivity check. Run: npx tsx scripts/verify-stripe.ts
 * Does not create charges or checkout sessions.
 */
import Stripe from "stripe";

async function main() {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

  if (!secret) {
    console.error("Missing STRIPE_SECRET_KEY in environment (.env.local).");
    process.exit(1);
  }
  if (!publishable?.startsWith("pk_")) {
    console.error("Missing or invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
    process.exit(1);
  }
  if (secret.startsWith("pk_")) {
    console.error("STRIPE_SECRET_KEY must not be a publishable (pk_) key.");
    process.exit(1);
  }

  const stripe = new Stripe(secret, { typescript: true });

  try {
    await stripe.balance.retrieve();
    console.log("Stripe secret key OK (balance retrieved).");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe API error:", message);
    if (message.includes("permission") || secret.startsWith("rk_")) {
      console.error(
        "If using rk_live_ restricted key, enable at least: Balance read, Checkout Sessions read/write."
      );
    }
    process.exit(1);
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    console.warn(
      "STRIPE_WEBHOOK_SECRET is empty — add it after creating the production webhook endpoint."
    );
  } else {
    console.log("STRIPE_WEBHOOK_SECRET is set.");
  }
}

main();
