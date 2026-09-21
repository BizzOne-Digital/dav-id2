import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models/Hunt";
import { PricingPlan } from "@/lib/models/PricingPlan";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";

export const metadata: Metadata = buildPageMetadata({
  title: "Book Your Hunt",
  description: "Reserve your Nashville scavenger hunt in minutes—pick a hunt, team size, and date.",
  path: "/booking",
});

type PageProps = { searchParams: Promise<{ hunt?: string }> };

export default async function BookingPage({ searchParams }: PageProps) {
  const { hunt: initialHuntSlug } = await searchParams;

  let hunts: Array<{
    _id: string;
    slug: string;
    title: string;
    minimumPlayers: number;
    pricePerPersonCents: number;
    pricingPlanId?: string;
  }> = [];

  let defaultPrice = 2995;

  try {
    await connectDB();
    const plan = await PricingPlan.findOne({ isDefault: true, active: true }).lean();
    if (plan?.pricePerPersonCents) defaultPrice = plan.pricePerPersonCents;

    const rows = await Hunt.find({ status: "published" }).sort({ featured: -1, title: 1 }).lean();
    hunts = rows.map((h) => ({
      _id: String(h._id),
      slug: h.slug,
      title: h.title,
      minimumPlayers: h.minimumPlayers ?? 1,
      pricePerPersonCents: h.pricePerPersonCents ?? defaultPrice,
      pricingPlanId: h.pricingPlanId ? String(h.pricingPlanId) : undefined,
    }));
  } catch {
    hunts = [];
  }

  const huntOptions = hunts.map((h) => ({
    id: h._id,
    slug: h.slug,
    title: h.title,
    minimumPlayers: h.minimumPlayers,
    pricePerPersonCents: h.pricePerPersonCents,
  }));

  return (
    <PageTransition>
      <PageHero
        eyebrow="Reservations"
        title="Book your hunt"
        subtitle="Four steps—pick your group size, name your team (or corporate squads), then checkout securely."
        backgroundImage={PAGE_HERO_IMAGES.booking}
      />
      <div className="site-x page-y">
        <BookingWizard hunts={huntOptions} initialHuntSlug={initialHuntSlug} />
      </div>
    </PageTransition>
  );
}
