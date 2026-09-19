import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

function GuitarV({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 48"
      className={cn("inline-block h-[0.85em] w-auto align-baseline text-gold", className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M16 2c-2 0-3.5 1.5-3.5 3.5v6c0 1 .5 2 1.2 2.6L8 22v18c0 3.3 3.6 6 8 6s8-2.7 8-6V22l-5.7-7.9c.7-.6 1.2-1.6 1.2-2.6v-6C19.5 3.5 18 2 16 2zm0 4c.6 0 1 .4 1 1v5h-2v-5c0-.6.4-1 1-1z"
      />
      <ellipse cx="16" cy="38" rx="7" ry="5" fill="#101216" opacity="0.35" />
    </svg>
  );
}

type BrandLogoProps = {
  logoUrl?: string | null;
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ logoUrl, className, compact }: BrandLogoProps) {
  if (logoUrl) {
    return (
      <Link href="/" className={cn("relative block h-10 w-36 sm:h-12 sm:w-44 md:h-14 md:w-52", className)}>
        <Image src={logoUrl} alt="Nashville Scavenger Hunt" fill className="object-contain object-left" priority unoptimized={logoUrl.startsWith("/api/uploads/")} />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("group flex items-start gap-1", className)}>
      <div className="leading-none">
        <div
          className={cn(
            "flex flex-wrap items-end gap-0 font-[family-name:var(--font-bebas)] uppercase tracking-[0.04em] text-white",
            compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-[1.65rem] md:text-3xl"
          )}
        >
          <span>NASH</span>
          <GuitarV />
          <span>ILLE</span>
        </div>
        <div
          className={cn(
            "mt-0.5 flex items-center gap-1 font-[family-name:var(--font-caveat)] font-bold text-gold",
            compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl md:text-[1.75rem]"
          )}
        >
          <span className="neon-gold">Scavenger Hunt</span>
          <MapPin className="size-4 shrink-0 fill-crimson text-crimson sm:size-5" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
