import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-cream/90">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border border-cream/20 bg-charcoal/60 px-4 py-3 text-cream placeholder:text-cream/40",
            "transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30",
            error && "border-orange focus:border-orange focus:ring-orange/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-orange">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
