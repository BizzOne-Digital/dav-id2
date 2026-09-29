import Link from "next/link";
import Image from "next/image";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Image
        src={MARKETING_IMAGES.broadway.src}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-charcoal/88" aria-hidden />
      <div className="relative mb-4 flex w-full max-w-md items-center justify-between gap-4 px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-cream/15 bg-charcoal/60 px-3 py-2 text-sm font-medium text-cream hover:border-gold/40 hover:text-gold"
        >
          ← Home
        </Link>
        <Link href="/join" className="text-sm font-medium text-cream/75 hover:text-gold">
          Join a team
        </Link>
      </div>
      <Link
        href="/"
        className="relative mb-6 text-center font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-gold hover:text-gold/90"
      >
        Music City Scavenger Hunt
      </Link>
      <div className="relative w-full max-w-md rounded-2xl border border-cream/10 bg-charcoal/80 p-1 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
