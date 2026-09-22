import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

/** Primary site logo (neon marquee artwork). Admin upload overrides via logoUrl. */
export const SITE_LOGO_PATH = "/images/nashville-logo.jpg";

type BrandLogoProps = {
  logoUrl?: string | null;
  className?: string;
  /** header = nav bar; footer = larger; hero = homepage left (~600×400) */
  variant?: "header" | "footer" | "hero";
  /** Center artwork inside the logo frame (e.g. spotlight column) */
  imageAlign?: "left" | "center";
};

const sizeByVariant = {
  header:
    "relative block h-[4.25rem] w-[min(58vw,13rem)] sm:h-20 sm:w-[15rem] md:h-[5.25rem] md:w-[18rem] lg:h-24 lg:w-[21rem] xl:h-[6.25rem] xl:w-[23rem]",
  footer:
    "relative block h-36 w-[min(100%,22rem)] sm:h-44 sm:w-[26rem] md:h-48 md:w-[30rem] lg:h-52 lg:w-[34rem] xl:h-56 xl:w-[36rem]",
  hero:
    "relative mr-auto block h-[220px] w-[min(88vw,480px)] sm:h-[260px] sm:w-[min(86vw,520px)] md:h-[320px] md:w-[540px] lg:h-[360px] lg:w-[540px] xl:h-[380px] xl:w-[560px]",
} as const;

export function BrandLogo({
  logoUrl,
  className,
  variant = "header",
  imageAlign = "left",
}: BrandLogoProps) {
  const raw = logoUrl?.trim() ? logoUrl : SITE_LOGO_PATH;
  const src = raw.startsWith("/images/") || raw.startsWith("/api/uploads/") ? raw : resolvePublicImageUrl(raw);
  const unoptimized = src.startsWith("/api/uploads/");
  const sizeKey = variant === "footer" ? "footer" : variant === "hero" ? "hero" : "header";

  return (
    <Link
      href="/"
      className={cn(
        sizeByVariant[sizeKey],
        "shrink-0 bg-transparent transition-opacity hover:opacity-95",
        variant === "hero" && "isolate",
        className
      )}
      aria-label="Nashville Scavenger Hunt — Home"
    >
      <Image
        src={src}
        alt="Nashville Scavenger Hunt"
        fill
        priority={variant === "header" || variant === "hero"}
        className={cn(
          "object-contain",
          imageAlign === "center" ? "object-center" : "object-left",
          variant === "hero"
            ? "mix-blend-lighten brightness-[1.15] contrast-[1.08] saturate-[1.2] drop-shadow-[0_0_28px_rgba(201,147,42,0.35)]"
            : variant === "footer"
              ? "brightness-[1.14] contrast-[1.06] saturate-[1.2] drop-shadow-[0_0_32px_rgba(242,182,50,0.42)]"
              : "brightness-[1.1] contrast-[1.05] saturate-[1.15] drop-shadow-[0_4px_24px_rgba(242,182,50,0.32)]"
        )}
        sizes={
          variant === "hero"
            ? "(max-width:768px) 520px, 600px"
            : variant === "footer"
              ? "(max-width:768px) 352px, 576px"
              : "(max-width:768px) 240px, 368px"
        }
        unoptimized={unoptimized}
      />
    </Link>
  );
}
