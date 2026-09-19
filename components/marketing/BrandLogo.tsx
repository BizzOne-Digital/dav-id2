import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

/** Primary site logo (neon marquee artwork). Admin upload overrides via logoUrl. */
export const SITE_LOGO_PATH = "/images/nashville-logo.jpg";

type BrandLogoProps = {
  logoUrl?: string | null;
  className?: string;
  /** header = nav bar; footer = larger brand block */
  variant?: "header" | "footer";
  /** Bigger + brighter treatment on the home page header */
  homeHero?: boolean;
};

const sizeByVariant = {
  header:
    "relative block h-14 w-[min(52vw,10.5rem)] sm:h-16 sm:w-[12rem] md:h-[4.25rem] md:w-[14rem] lg:h-20 lg:w-[16rem]",
  headerHome:
    "relative block h-16 w-[min(58vw,11.5rem)] sm:h-[4.25rem] sm:w-[13.5rem] md:h-20 md:w-[16rem] lg:h-[5.25rem] lg:w-[19rem]",
  footer:
    "relative block h-32 w-[min(100%,20rem)] sm:h-40 sm:w-[24rem] md:h-44 md:w-[28rem] lg:h-48 lg:w-[30rem]",
} as const;

export function BrandLogo({ logoUrl, className, variant = "header", homeHero }: BrandLogoProps) {
  const raw = logoUrl?.trim() ? logoUrl : SITE_LOGO_PATH;
  const src = raw.startsWith("/images/") || raw.startsWith("/api/uploads/") ? raw : resolvePublicImageUrl(raw);
  const unoptimized = src.startsWith("/api/uploads/");
  const sizeKey = variant === "header" && homeHero ? "headerHome" : variant;

  return (
    <Link
      href="/"
      className={cn(sizeByVariant[sizeKey], "shrink-0 transition-opacity hover:opacity-95", className)}
      aria-label="Nashville Scavenger Hunt — Home"
    >
      <Image
        src={src}
        alt="Nashville Scavenger Hunt"
        fill
        priority={variant === "header"}
        className={cn(
          "object-contain object-left",
          homeHero || variant === "footer"
            ? "brightness-[1.14] contrast-[1.06] saturate-[1.2] drop-shadow-[0_0_32px_rgba(242,182,50,0.42)]"
            : "brightness-[1.08] saturate-[1.1] drop-shadow-[0_4px_20px_rgba(242,182,50,0.25)]"
        )}
        sizes={
          homeHero
            ? "(max-width:768px) 240px, 448px"
            : variant === "footer"
              ? "(max-width:768px) 320px, 480px"
              : "(max-width:768px) 200px, 336px"
        }
        unoptimized={unoptimized}
      />
    </Link>
  );
}
