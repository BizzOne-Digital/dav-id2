import { cn } from "@/lib/utils";

const variants = {
  default: "bg-gold/12 text-orange border-orange/25",
  subtle:
    "bg-charcoal/[0.06] text-charcoal/80 border-charcoal/12 dark:bg-charcoal/20 dark:text-cream/85 dark:border-cream/15",
  orange: "bg-orange/15 text-orange border-orange/25",
  outline: "bg-transparent text-cream/80 border-cream/30",
} as const;

type BadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
