import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  variant?: "dark" | "light";
  options: { value: string; label: string }[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, variant = "dark", ...props }, ref) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "mb-1.5 block text-sm font-medium",
              variant === "light" ? "text-charcoal/90" : "text-cream/90"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "w-full appearance-none rounded-xl border px-4 py-3 pr-10 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
              variant === "light"
                ? "border-charcoal/20 bg-white text-charcoal"
                : "border-cream/20 bg-charcoal/60 text-cream",
              error && "border-orange focus:border-orange focus:ring-orange/30",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className={variant === "light" ? "bg-white text-charcoal" : "bg-charcoal text-cream"}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2",
              variant === "light" ? "text-charcoal/45" : "text-cream/50"
            )}
            aria-hidden
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-orange">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
