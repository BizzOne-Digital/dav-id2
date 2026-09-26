import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { Button } from "@/components/ui/Button";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { BOOK_QR_URL } from "@/lib/site/bookQr";

export const metadata: Metadata = buildPageMetadata({
  title: "Book QR Code",
  description: "Scan to book the Music City scavenger hunt.",
  path: "/book-qr",
});

type PageProps = { searchParams: Promise<{ url?: string }> };

export default async function BookQrPage({ searchParams }: PageProps) {
  const { url: customUrl } = await searchParams;
  const bookingUrl = customUrl?.startsWith("http") ? customUrl : BOOK_QR_URL;
  const qrSrc = `/api/marketing/qr?url=${encodeURIComponent(bookingUrl)}`;

  return (
    <PageTransition>
      <div className="site-x page-y mx-auto max-w-lg text-center text-cream">
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Book your hunt</h1>
        <p className="mt-2 text-sm text-cream/70">
          Print or share this QR for posters, flyers, and partner counters.
        </p>

        <div className="mx-auto mt-8 inline-block rounded-2xl border-4 border-gold/40 bg-cream p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR code linking to booking" width={280} height={280} className="size-[280px]" />
        </div>

        <p className="mt-6 break-all text-xs text-cream/55">{bookingUrl}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={qrSrc}
            download="music-city-scavenger-hunt-book-qr.svg"
            className="inline-flex rounded-lg border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            Download QR
          </a>
          <Button href="/booking" variant="primary">
            Open booking page
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
