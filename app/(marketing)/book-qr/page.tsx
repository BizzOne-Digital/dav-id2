import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { Card } from "@/components/ui/Card";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { BOOK_QR_IMAGE_PATH, BOOK_QR_URL } from "@/lib/site/bookQr";
import { PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";

export const metadata: Metadata = buildPageMetadata({
  title: "Book QR",
  description:
    "Scan to open Music City Scavenger Hunt—book your downtown adventure from any phone.",
  path: "/book-qr",
});

export default function BookQrPage() {
  return (
    <PageTransition>
      <PageHero
        title="Book your hunt"
        subtitle="Scan the code to open our site and reserve your adventure in minutes."
        backgroundImage={PAGE_HERO_IMAGES.booking}
      />
      <div className="site-x page-y mx-auto max-w-lg">
        <Card className="flex flex-col items-center text-center">
          <p className="text-sm text-cream/70">
            Point your camera at the QR code below. No app install required.
          </p>
          <div className="mt-8 rounded-2xl border border-gold/30 bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <Image
              src={BOOK_QR_IMAGE_PATH}
              alt={`QR code linking to ${BOOK_QR_URL}`}
              width={1024}
              height={1024}
              className="size-64 sm:size-72"
              priority
            />
          </div>
          <p className="mt-6 break-all text-sm font-medium text-gold">{BOOK_QR_URL}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={BOOK_QR_IMAGE_PATH}
              download="music-city-scavenger-hunt-book-qr.png"
              className="inline-flex rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              Download PNG
            </a>
            <Link
              href="/booking"
              className="inline-flex rounded-lg bg-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-charcoal transition-transform hover:scale-[1.02]"
            >
              Book online
            </Link>
          </div>
          <p className="mt-6 text-xs text-cream/50">
            Print this page or the PNG for brochures, flyers, and event signage.
          </p>
        </Card>
      </div>
    </PageTransition>
  );
}
