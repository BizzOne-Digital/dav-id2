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
    <div className="mb-8 grid gap-5 sm:mb-10 sm:gap-6 lg:grid-cols-3 lg:items-stretch">
      <div className="min-h-full min-w-0">
        <HuntTypeCard hunt={bachelorette} priority />
      </div>

      <Card className="flex h-full min-h-[280px] min-w-0 flex-col items-center justify-start border-gold/30 bg-gradient-to-b from-gold/10 to-charcoal/80 px-6 pb-8 pt-5 text-center sm:min-h-[320px] sm:pt-6 sm:pb-9">
        <div className="flex w-full justify-center">
          <BrandLogo variant="spotlight" className="w-full max-w-[19rem] sm:max-w-[22rem]" />
        </div>
        <div className="mt-4 flex w-full max-w-xs flex-col items-center sm:mt-5">
          <p className="font-[family-name:var(--font-caveat)] text-3xl text-gold sm:text-4xl">
            Let&apos;s play today!!
          </p>
        <p className="mt-3 text-sm leading-relaxed text-cream/70">
          Book your squad, pick single group or competition, and hit Broadway.
        </p>
        <Button href="/booking" variant="primary" magnetic className="mt-6 w-full">
          Book your hunt
        </Button>
        <Link href="/booking?type=bachelorette" className="mt-3 text-sm font-semibold text-gold hover:underline">
          Bachelorette booking →
        </Link>
        </div>
      </Card>

      <div className="min-h-full min-w-0">
        <HuntTypeCard hunt={corporate} />
      </div>
    </div>
  );
}
