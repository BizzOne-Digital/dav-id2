import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getBookableHunts } from "@/lib/hunts/syncCatalogHunts";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";

export const metadata: Metadata = buildPageMetadata({
  title: "Book Your Hunt",
  description: "Reserve your Music City scavenger hunt in minutes—pick a hunt, team size, and date.",
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
        subtitle="Four steps—pick your group size, name your team (or corporate squads), then checkout securely."
        backgroundImage={PAGE_HERO_IMAGES.booking}
      />
      <div className="site-x page-y">
        <BookingWizard hunts={hunts} initialHuntSlug={initialHuntSlug} />
      </div>
    </PageTransition>
  );
}
