"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  CirclePlay,
  Clock,
  Gift,
  MapPin,
  Search,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";
import { DEFAULT_STANDARD_PRICE_CENTS } from "@/lib/pricing/resolve-price";
import { BRAND_COPY } from "@/lib/site/brandCopy";
import type { MarketingPricing, MarketingSettings } from "@/components/marketing/types";

type HeroProps = {
  settings: MarketingSettings;
  pricing?: MarketingPricing | null;
};

function HeroRouteOverlay({ animate }: { animate: boolean }) {
  const path =
    "M 80 520 Q 200 480 320 440 T 520 380 Q 640 340 760 300 T 980 220 Q 1100 180 1180 160";

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <filter id="routeGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="#F2B632"
        strokeWidth="3"
        strokeDasharray="8 10"
        strokeLinecap="round"
        filter="url(#routeGlow)"
        initial={animate ? { pathLength: 0, opacity: 0.5 } : { pathLength: 1, opacity: 0.95 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      {[
        { cx: 320, cy: 440 },
        { cx: 760, cy: 300 },
        { cx: 1180, cy: 160 },
      ].map((pin, i) => (
        <motion.g
          key={`pin-${i}`}
          initial={animate ? { scale: 0, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 + i * 0.15 }}
        >
          <path
            d={`M ${pin.cx} ${pin.cy} c -8 -14 -14 -22 -14 -32 a 14 14 0 1 1 28 0 c 0 10 -6 18 -14 32 z`}
            fill="#A93226"
            stroke="#fff"
            strokeWidth="1.5"
          />
          <circle cx={pin.cx} cy={pin.cy - 18} r="5" fill="#fff" />
        </motion.g>
      ))}
      {animate && (
        <motion.circle r="6" fill="#F2B632" filter="url(#routeGlow)">
          <animateMotion dur="10s" repeatCount="indefinite" path={path} />
        </motion.circle>
      )}
    </svg>
  );
}

function PolaroidCard({
  title,
  icon: Icon,
  rotate,
  delay,
}: {
  title: string;
  icon: typeof Search;
  rotate: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className="w-[92px] rounded-sm bg-cream p-1.5 pb-6 shadow-2xl min-[380px]:w-[100px] sm:w-[130px] sm:p-2 sm:pb-8 lg:w-[150px]"
    >
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-charcoal/90">
        <Icon className="size-8 text-gold" strokeWidth={1.5} />
      </div>
      <p className="mt-2 text-center font-[family-name:var(--font-bebas)] text-sm tracking-wide text-charcoal">{title}</p>
    </motion.div>
  );
}

export function Hero({ settings, pricing }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const hero = settings.hero ?? {};
  const headline =
    hero.headline?.trim() ||
    settings.tagline?.trim() ||
    "Explore. Discover. Compete. Create Memories.";
  const subheadline =
    hero.subheadline ??
    "Turn downtown Nashville into your personal game board. Solve clues, complete challenges, earn points and create unforgettable memories.";
  const ctaPrimary = hero.ctaPrimary ?? "Book Your Hunt";
  const ctaSecondary = hero.ctaSecondary ?? "Preview a Challenge";
  const heroBg = hero.backgroundImage?.trim()
    ? resolvePublicImageUrl(hero.backgroundImage)
    : "/images/hero-nashville.jpg";
  const heroBgUnoptimized = heroBg.startsWith("/api/uploads/");

  const priceCents = pricing?.pricePerPersonCents ?? settings.defaultPricePerPersonCents ?? DEFAULT_STANDARD_PRICE_CENTS;
  const minPlayers = pricing?.minimumPlayers ?? settings.minimumPlayers ?? 4;
  const duration = pricing?.durationLabel ?? `${settings.typicalDurationHours ?? "2–3"} hours`;

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <Image
        src={heroBg}
        alt=""
        fill
        priority
        unoptimized={heroBgUnoptimized}
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-black/40" aria-hidden />

      <HeroRouteOverlay animate={!reduceMotion} />

      <div className="relative site-x mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center pb-20 pt-[calc(6.75rem+var(--safe-top))] sm:pb-24 sm:pt-[calc(7.75rem+var(--safe-top))] lg:pb-20 lg:pt-[calc(9.5rem+var(--safe-top))]">
        <div className="grid flex-1 items-center gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:text-sm">
              <Star className="size-4 fill-gold text-gold" aria-hidden />
              {BRAND_COPY.challengeEyebrow}
            </p>

            <h1 className="hero-headline-distressed text-balance font-[family-name:var(--font-bebas)] text-[1.85rem] leading-[0.95] tracking-wide text-white min-[380px]:text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[5.25rem]">
              {headline}
            </h1>

            <p className="mt-3 font-[family-name:var(--font-bebas)] text-lg tracking-wide text-gold/95 sm:text-xl">
              {BRAND_COPY.actionLine}
            </p>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg">{subheadline}</p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-3">
              <Link href="/booking" className="hero-cta-primary inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold uppercase tracking-wider text-charcoal sm:w-auto sm:px-6 sm:py-3.5">
                <CalendarDays className="size-5" aria-hidden />
                {ctaPrimary}
              </Link>
              <Link
                href="/#challenge-preview"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-white/70 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:border-gold hover:bg-white/10 sm:w-auto sm:px-6 sm:py-3.5"
              >
                <CirclePlay className="size-5" aria-hidden />
                {ctaSecondary}
              </Link>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:mt-8 sm:flex sm:flex-row sm:flex-wrap sm:gap-4">
              <li className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-crimson shadow-lg">
                  <MapPin className="size-5 text-white" aria-hidden />
                </span>
                <span className="font-[family-name:var(--font-bebas)] text-lg leading-tight text-white sm:text-xl">
                  <span className="text-gold">{formatCurrency(priceCents)}</span>
                  <br />
                  <span className="text-sm text-white/80">Per Person</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-denim shadow-lg">
                  <Users className="size-5 text-white" aria-hidden />
                </span>
                <span className="font-[family-name:var(--font-bebas)] text-lg leading-tight text-white sm:text-xl">
                  Minimum {minPlayers} Players
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-olive shadow-lg">
                  <Clock className="size-5 text-white" aria-hidden />
                </span>
                <span className="font-[family-name:var(--font-bebas)] text-lg leading-tight text-white sm:text-xl">
                  {duration.replace(/hours/i, "Hours")}
                </span>
              </li>
            </ul>
          </motion.div>

          <div className="relative mt-4 min-h-[120px] sm:mt-6 sm:min-h-[140px] lg:mt-0 lg:min-h-[320px]">
            <div className="flex justify-center gap-1.5 sm:gap-2 lg:absolute lg:right-0 lg:top-8 lg:justify-end lg:gap-3">
              <PolaroidCard title="Solve Clues" icon={Search} rotate="-6deg" delay={0.55} />
              <PolaroidCard title="Earn Points" icon={Trophy} rotate="4deg" delay={0.65} />
              <PolaroidCard title="Win Prizes" icon={Gift} rotate="-3deg" delay={0.75} />
            </div>

            <motion.div
              initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
              className="absolute -bottom-1 right-0 flex size-20 flex-col items-center justify-center rounded-full border-[3px] border-gold bg-charcoal/90 shadow-[0_0_40px_rgba(242,182,50,0.35)] sm:size-24 lg:bottom-4 lg:right-8 lg:size-28"
            >
              <span className="font-[family-name:var(--font-bebas)] text-2xl text-gold">{formatCurrency(priceCents)}</span>
              <span className="text-[10px] uppercase tracking-widest text-cream/70">/ Person</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-hidden
        >
          <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
            <div className="mx-auto h-2 w-1 rounded-full bg-gold" />
          </div>
        </motion.div>
      </div>

      <p className="sr-only">All you need is a smartphone and a sense of adventure.</p>
    </section>
  );
}
