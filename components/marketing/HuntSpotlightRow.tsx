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

      <Card className="flex h-full min-h-[280px] flex-col items-center justify-center border-gold/30 bg-gradient-to-b from-gold/10 to-charcoal/80 px-6 py-10 text-center sm:min-h-[320px]">
        <BrandLogo
          variant="header"
          className="!h-16 !w-[min(70vw,11rem)] sm:!h-20 sm:!w-[14rem] md:!mx-auto md:!h-[5.5rem] md:!w-[17rem]"
        />
        <p className="mt-6 font-[family-name:var(--font-caveat)] text-3xl text-gold sm:text-4xl">
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
