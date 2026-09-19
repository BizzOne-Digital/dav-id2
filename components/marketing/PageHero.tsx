import Image from "next/image";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  backgroundImage?: { src: string; alt: string };
};

export function PageHero({ eyebrow, title, subtitle, className, backgroundImage }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-cream/10 py-10 sm:py-14 lg:py-16",
        backgroundImage ? "min-h-[220px] sm:min-h-[280px] lg:min-h-[320px]" : "bg-charcoal",
        className
      )}
    >
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage.src}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/80 to-charcoal/55" aria-hidden />
        </>
      )}
      {!backgroundImage && (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(242,182,50,0.12),_transparent_60%)]"
          aria-hidden
        />
      )}
      <div className="site-x relative mx-auto max-w-4xl text-center">
        {eyebrow && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold sm:mb-3 sm:text-xs">{eyebrow}</p>
        )}
        <h1 className="text-balance font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-cream sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-cream/85 sm:mt-4 sm:text-base md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
