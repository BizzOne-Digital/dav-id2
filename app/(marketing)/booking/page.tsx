import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getBookableHunts } from "@/lib/hunts/syncCatalogHunts";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";

export const metadata: Metadata = buildPageMetadata({
  title: "Book Your Hunt",
  description:
    "Reserve your Music City scavenger hunt in minutes—pick a hunt and tickets. Your play window starts at checkout.",
  path: "/booking",
});

type PageProps = { searchParams: Promise<{ hunt?: string }> };

export default async function BookingPage({ searchParams }: PageProps) {
  const { hunt: initialHuntSlug } = await searchParams;
  const hunts = await getBookableHunts();

  return (
    <PageTransition>
      <PageHero
        eyebrow="Reservations"
        title="Book your hunt"
        subtitle="Four steps—choose your hunt and tickets, set up your team, then checkout when you are ready to play. Your 72-hour window begins at payment, not on an optional visit date."
        backgroundImage={PAGE_HERO_IMAGES.booking}
      />
      <div className="site-x page-y">
        <BookingWizard hunts={hunts} initialHuntSlug={initialHuntSlug} />
      </div>
    </PageTransition>
  );
}
