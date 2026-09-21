import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageTransition } from "@/components/motion/PageTransition";
import { Button } from "@/components/ui/Button";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import { BRAND_COPY } from "@/lib/site/brandCopy";
import { buildPageMetadata } from "@/lib/site/buildMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Virtual Brochure",
  description: "Nashville Scavenger Hunt overview — pricing, teams, and how to book.",
  path: "/brochure",
});

export default function BrochurePage() {
  const poster = MARKETING_IMAGES.promoPoster;

  return (
    <PageTransition>
      <div className="site-x page-y mx-auto max-w-3xl text-cream">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Virtual brochure</p>
        <h1 className="mt-2 font-[family-name:var(--font-bebas)] text-4xl text-gold sm:text-5xl">
          {BRAND_COPY.challengeEyebrow}
        </h1>
        <p className="mt-3 text-lg text-cream/85">{BRAND_COPY.actionLine}</p>
        <p className="mt-2 text-sm text-cream/70">{BRAND_COPY.audiences}</p>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold/30">
          <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} className="h-auto w-full" />
        </div>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-cream/80">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl text-gold">Tickets & teams</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>One paid ticket per person competing on the leaderboard.</li>
            <li>Singles & couples: one booking for 1–2 players; larger groups buy per-player tickets.</li>
            <li>Corporate events: every participant needs an individual ticket—solo or on a named/color-coded team.</li>
            <li>One completion certificate issued per ticket when you finish the hunt.</li>
          </ul>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/booking" variant="primary" className="flex-1">
            Book your hunt
          </Button>
          <Button href="/book-qr" variant="secondary" className="flex-1">
            Booking QR code
          </Button>
        </div>

        <p className="mt-8 text-center text-xs text-cream/50">
          Share this page:{" "}
          <Link href="/brochure" className="text-gold hover:underline">
            NashvilleScavengerHunt.com/brochure
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
