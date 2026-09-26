import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-cream/90">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              "w-full appearance-none rounded-xl border border-cream/20 bg-charcoal/60 px-4 py-3 pr-10 text-cream",
              "transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
              error && "border-orange focus:border-orange focus:ring-orange/30",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-charcoal text-cream">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-cream/50"
            aria-hidden
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-orange">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
