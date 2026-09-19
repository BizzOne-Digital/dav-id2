import { cn } from "@/lib/utils";

const variants = {
  default: "bg-gold/20 text-gold border-gold/30",
  orange: "bg-orange/20 text-orange border-orange/30",
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
