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
import { heroGroupSizeLabel, resolveMinPlayers } from "@/lib/site/groupSizeCopy";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import type { MarketingPricing, MarketingSettings } from "@/components/marketing/types";

const HERO_TAGLINE = "Explore. Discover. Compete. Create Memories.";

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
        stroke="#c9932a"
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
        <motion.circle r="6" fill="#c9932a" filter="url(#routeGlow)">
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
      <p className="mt-2 text-center font-[family-name:var(--font-bebas)] text-sm tracking-wide text-charcoal">
        {title}
      </p>
    </motion.div>
  );
}

export function Hero({ settings, pricing }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const hero = settings.hero ?? {};
  const subheadline =
    hero.subheadline ??
    "Turn downtown Nashville into your personal game board. Solve locally inspired clues, complete creative challenges, earn points, climb the leaderboard, and create unforgettable Music City memories.";
  const ctaPrimary = hero.ctaPrimary ?? "Book Your Hunt";
  const ctaSecondary = hero.ctaSecondary ?? "Preview a Challenge";
  const heroBg = hero.backgroundImage?.trim()
    ? resolvePublicImageUrl(hero.backgroundImage)
    : "/images/hero-nashville.jpg";
  const heroBgUnoptimized = heroBg.startsWith("/api/uploads/");

  const priceCents =
    pricing?.pricePerPersonCents ?? settings.defaultPricePerPersonCents ?? DEFAULT_STANDARD_PRICE_CENTS;
  const minPlayers = resolveMinPlayers(pricing?.minimumPlayers, settings.minimumPlayers);
  const duration = pricing?.durationLabel ?? `${settings.typicalDurationHours ?? "2–3"} hours`;

  return (
    <section className="relative min-h-[85dvh] overflow-hidden sm:min-h-[88dvh] lg:min-h-[90dvh]">
      <Image
        src={heroBg}
        alt=""
        fill
        priority
        unoptimized={heroBgUnoptimized}
        className="object-cover object-center brightness-[1.1] contrast-[1.03] saturate-[1.05]"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/22 to-black/5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-black/22"
        aria-hidden
      />

      <HeroRouteOverlay animate={!reduceMotion} />

      <div className="relative site-x mx-auto max-w-[1400px] pb-14 pt-[calc(2.5rem+var(--safe-top))] sm:pb-16 sm:pt-[calc(2.625rem+var(--safe-top))] lg:pb-14">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.92fr)_1.08fr] lg:gap-8 xl:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-xl lg:max-w-[520px]"
          >
            <div className="translate-x-[0.25in] -translate-y-[0.125in]">
              <p className="mb-1.5 flex items-center justify-start gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold sm:mb-2 sm:text-sm">
                <Star className="size-4 fill-gold text-gold" aria-hidden />
                The Ultimate Music City Adventure
              </p>

              <div className="flex justify-start">
                <BrandLogo logoUrl={settings.logoUrl} variant="hero" />
              </div>
            </div>

            <p className="mt-4 max-w-xl text-left text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg">
              {subheadline}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-start sm:gap-3">
              <Link
                href="/booking"
                className="hero-cta-primary inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold uppercase tracking-wider text-charcoal sm:w-auto sm:px-6 sm:py-3.5"
              >
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

            <ul className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3 sm:mt-8 sm:flex sm:flex-row sm:flex-wrap sm:justify-start sm:gap-4">
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
                  {heroGroupSizeLabel(minPlayers)}
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

          <div className="relative mt-4 w-full sm:mt-6 lg:mt-0 lg:flex lg:flex-col lg:items-end lg:self-end lg:pb-2">
            <div className="flex justify-center gap-1.5 sm:gap-2 lg:justify-end lg:gap-3">
              <PolaroidCard title="Solve Clues" icon={Search} rotate="-6deg" delay={0.55} />
              <PolaroidCard title="Earn Points" icon={Trophy} rotate="4deg" delay={0.65} />
              <PolaroidCard title="Win Prizes" icon={Gift} rotate="-3deg" delay={0.75} />
            </div>

            <h1 className="hero-headline-distressed mt-5 max-w-md text-balance text-center font-[family-name:var(--font-bebas)] text-[1.65rem] leading-[0.95] tracking-wide text-white min-[380px]:text-2xl sm:mt-6 sm:text-3xl md:text-4xl lg:mt-4 lg:text-right lg:text-[2.35rem]">
              {HERO_TAGLINE}
            </h1>
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

      <p className="sr-only">{HERO_TAGLINE}</p>
    </section>
  );
}
