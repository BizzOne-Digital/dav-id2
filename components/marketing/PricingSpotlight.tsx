import Image from "next/image";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import {
  DEFAULT_STANDARD_PRICE_CENTS,
  VOLUME_PRICING_SUMMARY,
} from "@/lib/pricing/resolve-price";
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
    <section id="pricing" className="section-surface-light section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          surface="light"
          eyebrow="Pricing"
          title="Simple, transparent rates"
          subtitle="What you see here comes straight from our live booking settings—no surprise fees at the door."
        />

        <div className="mt-8 grid items-center gap-8 sm:mt-10 lg:grid-cols-2 lg:gap-10">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border-4 border-charcoal shadow-[8px_8px_0_#101216]">
            <Image
              src={MARKETING_IMAGES.hotChicken.src}
              alt={MARKETING_IMAGES.hotChicken.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
          </div>

          <Card className="border-charcoal/15 bg-white p-8 text-charcoal shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-orange">{planName}</p>
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-bold text-charcoal">{formatCurrency(priceCents)}</span>
              <span className="text-charcoal/60">/ person</span>
            </p>
            <p className="mt-2 text-sm text-charcoal/65">
              {pricingGroupSizeSummary(minPlayers, duration)}
            </p>
            <p className="mt-1 text-sm font-medium text-charcoal/80">{VOLUME_PRICING_SUMMARY}</p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{description}</p>

            <ul className="mt-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm">
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
