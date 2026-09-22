import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { HuntTypeCard } from "@/components/marketing/HuntTypeCard";
import type { PublicHuntListing } from "@/lib/site/huntCatalog";

type HuntSpotlightRowProps = {
  bachelorette: PublicHuntListing;
  corporate: PublicHuntListing;
};

export function HuntSpotlightRow({ bachelorette, corporate }: HuntSpotlightRowProps) {
  return (
    <div className="mb-8 grid gap-5 sm:mb-10 sm:gap-6 lg:grid-cols-3">
      <div className="min-h-full">
        <HuntTypeCard hunt={bachelorette} priority />
      </div>

      <Card className="flex h-full min-h-[280px] flex-col items-center justify-start border-gold/30 bg-gradient-to-b from-gold/10 to-charcoal/80 px-6 pb-8 pt-5 text-center sm:min-h-[320px] sm:pt-6 sm:pb-9">
        <BrandLogo
          variant="header"
          imageAlign="center"
          className="mx-auto !h-24 !w-[min(78vw,16.5rem)] sm:!h-[7.5rem] sm:!w-[21rem] md:!h-[8.25rem] md:!w-[25.5rem]"
        />
        <p className="mt-4 font-[family-name:var(--font-caveat)] text-3xl text-gold sm:mt-5 sm:text-4xl">
          Let&apos;s play today!!
        </p>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
          Book your squad, pick single group or competition, and hit Broadway.
        </p>
        <Button href="/booking" variant="primary" magnetic className="mt-6 w-full max-w-xs">
          Book your hunt
        </Button>
        <Link href="/booking?type=bachelorette" className="mt-3 text-sm font-semibold text-gold hover:underline">
          Bachelorette booking →
        </Link>
      </Card>

      <div className="min-h-full">
        <HuntTypeCard hunt={corporate} />
      </div>
    </div>
  );
}
