"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import type { MarketingPricing, MarketingSettings } from "@/components/marketing/types";

type HeroProps = {
  settings: MarketingSettings;
  pricing?: MarketingPricing | null;
};

export function Hero(_props: HeroProps) {
  const poster = MARKETING_IMAGES.promoPoster;

  return (
    <section className="relative bg-[#0a0c10] pt-2 sm:pt-3">
      <div className="site-x mx-auto w-full max-w-[520px] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-[960px]">
        <Link
          href="/booking"
          className="group relative block overflow-hidden rounded-xl border border-gold/20 shadow-[0_8px_48px_rgba(0,0,0,0.45)] sm:rounded-2xl"
          aria-label="Book your Nashville scavenger hunt adventure"
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            priority
            className="h-auto w-full object-contain transition-[filter] duration-300 group-hover:brightness-[1.03]"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 90vw, 960px"
          />
        </Link>

        <div className="mt-5 flex flex-col items-stretch gap-3 pb-6 sm:mt-6 sm:flex-row sm:justify-center sm:pb-8">
          <Link
            href="/booking"
            className="hero-cta-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold uppercase tracking-wider text-charcoal shadow-[0_4px_28px_rgba(242,182,50,0.5)] sm:w-auto sm:min-w-[280px] sm:text-base"
          >
            <CalendarDays className="size-5 shrink-0" aria-hidden />
            Book Your Adventure
          </Link>
          <Link
            href="/#challenge-preview"
            className="inline-flex w-full items-center justify-center rounded-xl border-2 border-cream/25 bg-cream/5 px-6 py-4 text-sm font-bold uppercase tracking-wider text-cream backdrop-blur-sm transition-colors hover:border-gold/50 hover:bg-cream/10 sm:w-auto sm:min-w-[200px]"
          >
            Preview a Challenge
          </Link>
        </div>
      </div>
    </section>
  );
}
