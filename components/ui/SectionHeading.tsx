import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
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
          <Badge>{eyebrow}</Badge>
        </div>
      )}
      <h2 className="text-balance font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-cream sm:text-3xl md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-pretty text-sm leading-relaxed text-cream/70 sm:mt-3 sm:text-base md:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
