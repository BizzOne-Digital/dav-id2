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
      <Link
        href="/"
        className="relative mb-8 font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-gold"
      >
        Nashville Scavenger Hunt
      </Link>
      <div className="relative w-full max-w-md rounded-2xl border border-cream/10 bg-charcoal/80 p-1 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
