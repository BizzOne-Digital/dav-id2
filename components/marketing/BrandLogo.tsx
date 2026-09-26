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
    "relative block h-[4.75rem] w-[min(62vw,12.5rem)] sm:h-[5.5rem] sm:w-[15rem] md:h-24 md:w-[18rem] lg:h-28 lg:w-[21rem]",
  headerHome:
    "relative block h-[5.75rem] w-[min(72vw,15rem)] sm:h-[7rem] sm:w-[18rem] md:h-32 md:w-[22rem] lg:h-36 lg:w-[26rem] xl:h-[9.5rem] xl:w-[28rem]",
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
