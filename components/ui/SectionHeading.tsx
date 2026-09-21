import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Use on parchment / light sections (charcoal type, subtle badge) */
  surface?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  surface = "dark",
  className,
}: SectionHeadingProps) {
  const isLight = surface === "light";

  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("mb-2", align === "center" && "flex justify-center")}>
          <Badge variant={isLight ? "subtle" : "default"}>{eyebrow}</Badge>
        </div>
      )}
      <h2
        className={cn(
          "text-balance font-[family-name:var(--font-bebas)] text-2xl tracking-wide sm:text-3xl md:text-4xl lg:text-5xl",
          isLight ? "text-charcoal" : "text-cream"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-2 text-pretty text-sm leading-relaxed sm:mt-3 sm:text-base md:text-lg",
            isLight ? "text-charcoal/70" : "text-cream/70"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
