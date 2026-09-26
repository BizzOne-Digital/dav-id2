"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Camera, Guitar, UtensilsCrossed } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { BRAND_COPY } from "@/lib/site/brandCopy";
import {
  DEFAULT_STANDARD_PRICE_CENTS,
  DEFAULT_VOLUME_MIN_PLAYERS,
  DEFAULT_VOLUME_PRICE_CENTS,
} from "@/lib/pricing/resolve-price";

type PromoFlyerSectionProps = {
  pricePerPersonCents?: number;
};

const STOPS = [
  { icon: Building2, label: "Landmarks", color: "text-denim" },
  { icon: Guitar, label: "Honky-tonks", color: "text-crimson" },
  { icon: UtensilsCrossed, label: "Restaurants", color: "text-gold" },
  { icon: Camera, label: "Photo & video challenges", color: "text-crimson" },
];

export function PromoFlyerSection({ pricePerPersonCents = DEFAULT_STANDARD_PRICE_CENTS }: PromoFlyerSectionProps) {
  const flyer = BRAND_COPY.promoFlyer;

  return (
    <section
      id="music-city-challenge"
      className="section-y relative overflow-hidden border-y border-gold/25 bg-gradient-to-br from-[#243552] via-[#1e2430] to-[#3a2230]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(242,182,50,0.15), transparent 45%), radial-gradient(circle at 80% 70%, rgba(169,50,38,0.12), transparent 40%)",
        }}
        aria-hidden
      />

      <div className="site-x relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Official experience"
          title={BRAND_COPY.challengeEyebrow}
          subtitle={BRAND_COPY.tagline}
        />

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <Link
            href="/booking"
            className="group relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border-2 border-gold/50 bg-black shadow-[0_0_48px_rgba(242,182,50,0.35)] transition-transform hover:scale-[1.01] lg:max-w-none"
          >
            <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
              <Image
                src={flyer.src}
                alt={flyer.alt}
                fill
                className="object-contain object-center brightness-[1.08] contrast-[1.05] saturate-[1.12]"
                sizes="(max-width:1024px) 90vw, 540px"
                priority={false}
              />
            </div>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent py-4 text-center text-sm font-semibold uppercase tracking-wider text-gold opacity-0 transition-opacity group-hover:opacity-100">
              Tap to book
            </span>
          </Link>

          <div className="text-cream">
            <p className="font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-gold sm:text-3xl">
              {BRAND_COPY.actionLine}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-cream/80 sm:text-base">{BRAND_COPY.audiences}</p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {STOPS.map(({ icon: Icon, label, color }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-cream/10 bg-cream/5 px-4 py-3"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-charcoal/80">
                    <Icon className={`size-5 ${color}`} aria-hidden />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-gold/30 bg-gold/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-[family-name:var(--font-bebas)] text-4xl text-gold">
                  {formatCurrency(pricePerPersonCents)}
                  <span className="ml-2 text-lg text-cream/80">/ person</span>
                </p>
                <p className="mt-1 text-sm text-cream/70">
                  {BRAND_COPY.groupDiscountLine} — {formatCurrency(DEFAULT_VOLUME_PRICE_CENTS)}/person at{" "}
                  {DEFAULT_VOLUME_MIN_PLAYERS}+ players
                </p>
              </div>
              <Button href="/booking" variant="primary" className="shrink-0 gap-2 !text-charcoal">
                {BRAND_COPY.bookCta}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
