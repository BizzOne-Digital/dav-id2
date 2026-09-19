import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Booking, Hunt, PricingPlan } from "@/lib/models";
import { createCheckoutSession } from "@/lib/payments/stripe";
import { fulfillOrder } from "@/lib/payments/fulfill-order";
import { resolvePricePerPersonCents } from "@/lib/pricing/resolve-price";

const bodySchema = z.object({
  bookingId: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    await connectDB();
    const booking = await Booking.findById(parsed.data.bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const hunt = await Hunt.findById(booking.huntId).lean();
    let basePriceCents = hunt?.pricePerPersonCents;
    let volumePriceCents: number | undefined;
    let volumeMinPlayers: number | undefined;
    if (hunt?.pricingPlanId) {
      const plan = await PricingPlan.findById(hunt.pricingPlanId).lean();
      if (plan?.pricePerPersonCents) basePriceCents = plan.pricePerPersonCents;
      if (plan?.volumePricePerPersonCents != null) volumePriceCents = plan.volumePricePerPersonCents;
      if (plan?.volumeMinPlayers != null) volumeMinPlayers = plan.volumeMinPlayers;
    }

    const pricePerPersonCents = resolvePricePerPersonCents({
      playerCount: booking.playerCount,
      groupType: booking.groupType,
      basePriceCents,
      volumePriceCents,
      volumeMinPlayers,
    });

    const amountCents = pricePerPersonCents * booking.playerCount;
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const successUrl = parsed.data.successUrl ?? `${origin}/booking/success?bookingId=${booking._id}`;
    const cancelUrl = parsed.data.cancelUrl ?? `${origin}/booking?cancelled=1`;

    const lineItems = [
      {
        label: `${hunt?.title ?? "Scavenger Hunt"} (${booking.playerCount} players @ $${(pricePerPersonCents / 100).toFixed(2)}/pp)`,
        quantity: booking.playerCount,
        unitAmountCents: pricePerPersonCents,
      },
    ];

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey && process.env.NODE_ENV === "development") {
      const fulfilled = await fulfillOrder({
        bookingId: booking._id.toString(),
        amountCents,
        userId: booking.userId?.toString(),
        lineItems,
      });
      return NextResponse.json({
        success: true,
        mode: "dev",
        amountCents,
        ...fulfilled,
      });
    }

    const session = await createCheckoutSession({
      bookingId: booking._id.toString(),
      amountCents,
      customerEmail: booking.captainEmail ?? undefined,
      lineItems,
      successUrl,
      cancelUrl,
    });

    booking.status = "pending_payment";
    await booking.save();

    return NextResponse.json({
      success: true,
      mode: "stripe",
      sessionId: session.sessionId,
      url: session.url,
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ success: false, error: "Checkout failed" }, { status: 500 });
  }
}
