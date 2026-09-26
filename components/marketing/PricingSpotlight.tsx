import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import { DEFAULT_STANDARD_PRICE_CENTS } from "@/lib/pricing/resolve-price";
import {
  CORPORATE_PRICING_NOTE,
  PRICING_SUBLINE,
} from "@/lib/site/pricingCopy";
import {
  pricingGroupSizeSummary,
  resolveMinPlayers,
  standardPricingDescription,
} from "@/lib/site/groupSizeCopy";
import type { MarketingPricing, MarketingSettings } from "@/components/marketing/types";

const DEFAULT_FEATURES = [
  "Full hunt access for every player",
  "Live leaderboard & scoring",
  "Photo challenge gallery",
  "Email support on event day",
  "Custom team names & join codes",
];

type PricingSpotlightProps = {
  settings: MarketingSettings;
  pricing?: MarketingPricing | null;
};

export function PricingSpotlight({ settings, pricing }: PricingSpotlightProps) {
  const priceCents =
    pricing?.pricePerPersonCents ?? settings.defaultPricePerPersonCents ?? DEFAULT_STANDARD_PRICE_CENTS;
  const minPlayers = resolveMinPlayers(pricing?.minimumPlayers, settings.minimumPlayers);
  const duration =
    pricing?.durationLabel ??
    (settings.typicalDurationHours ? `${settings.typicalDurationHours} hours` : "2–3 hours");
  const planName = pricing?.name ?? "Standard Hunt";
  const features =
    pricing?.features && pricing.features.length > 0 ? pricing.features : DEFAULT_FEATURES;
  const description =
    pricing?.description ?? standardPricingDescription(minPlayers);

  return (
    <section id="pricing" className="border-y border-cream/10 bg-[#12161e] section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent rates"
          subtitle="What you see here comes straight from our live booking settings—no surprise fees at the door."
        />

        <div className="mt-8 grid items-center gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-10">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-gold/25 shadow-[0_12px_48px_rgba(0,0,0,0.45)]">
            <Image
              src={MARKETING_IMAGES.hotChicken.src}
              alt={MARKETING_IMAGES.hotChicken.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
          </div>

          <Card className="border-cream/15 bg-charcoal/90 p-8 text-cream shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold">{planName}</p>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-cream">{formatCurrency(priceCents)}</span>
              <span className="text-cream/60">/ person</span>
            </p>
            <p className="mt-2 text-sm text-cream/70">
              {pricingGroupSizeSummary(minPlayers, duration)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">{PRICING_SUBLINE}</p>
            <p className="mt-3 text-xs leading-relaxed text-cream/50">{CORPORATE_PRICING_NOTE}</p>
            <p className="mt-4 text-sm leading-relaxed text-cream/65">{description}</p>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-cream/85">
                  <Check className="size-5 shrink-0 text-gold" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>

            <Button href="/booking" variant="primary" magnetic className="mt-10 w-full !text-charcoal">
              Book your hunt
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
