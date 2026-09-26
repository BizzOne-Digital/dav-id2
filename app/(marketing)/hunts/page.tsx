import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { HuntSpotlightRow } from "@/components/marketing/HuntSpotlightRow";
import { HuntTypesGrid, pickSpotlightHunts } from "@/components/marketing/HuntTypesGrid";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPublicHuntListings } from "@/lib/site/getPublicHuntListings";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import { PRICING_HEADLINE } from "@/lib/site/pricingCopy";

export const metadata: Metadata = buildPageMetadata({
  title: "Scavenger Hunts",
  description:
    "Browse downtown Music City scavenger hunts for families, bachelorettes, corporate teams, and date nights.",
  path: "/hunts",
});

export default async function HuntsPage() {
  const hunts = await getPublicHuntListings();
  const { bachelorette, corporate, rest } = pickSpotlightHunts(hunts);

  return (
    <PageTransition>
      <PageHero
        eyebrow="Experiences"
        title="Choose your Music City hunt"
        subtitle="Every route is walkable, phone-friendly, and packed with Music City stories."
        className="border-b border-cream/10 py-5 sm:py-6"
      />

      <div className="site-x mx-auto max-w-5xl pt-4 sm:pt-5">
        <MarketingPhoto
          src={MARKETING_IMAGES.broadway.src}
          alt={MARKETING_IMAGES.broadway.alt}
          aspect="wide"
          priority
          sizes="1024px"
          className="mb-6 sm:mb-8"
        />
      </div>

      <div className="site-x mx-auto max-w-7xl pb-12 sm:pb-14">
        <p className="mx-auto mb-5 max-w-2xl text-center text-sm leading-relaxed text-cream/75 sm:mb-7 sm:text-base">
          Pick a signature route below—{PRICING_HEADLINE.toLowerCase()}. Same hunt engine, tuned for how your group
          plays.
        </p>

        {bachelorette && corporate ? (
          <HuntSpotlightRow bachelorette={bachelorette} corporate={corporate} />
        ) : null}

        <HuntTypesGrid hunts={rest} />
        <div className="mt-8 text-center sm:mt-10">
          <Button href="/booking" variant="primary" magnetic>
            Book your hunt
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
