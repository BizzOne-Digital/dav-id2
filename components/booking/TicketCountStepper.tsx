"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type TicketCountStepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const stepperButtonClass =
  "flex min-h-[3rem] min-w-[3rem] shrink-0 items-center justify-center rounded-xl border-2 border-gold bg-gold text-charcoal shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:border-charcoal/15 disabled:bg-charcoal/10 disabled:text-charcoal/35 disabled:shadow-none";

export function TicketCountStepper({ value, min, max, onChange }: TicketCountStepperProps) {
  function commit(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits === "") return;
    const n = Number(digits);
    if (!Number.isFinite(n)) return;
    onChange(Math.min(max, Math.max(min, n)));
  }

  return (
    <div className="relative z-10 flex items-stretch gap-2 touch-manipulation">
      <button
        type="button"
        aria-label="Remove one ticket"
        disabled={value <= min}
        className={stepperButtonClass}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-5" strokeWidth={2.5} aria-hidden />
      </button>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label="Number of tickets"
        value={String(value)}
        onChange={(e) => commit(e.target.value)}
        className={cn(
          "min-h-[3rem] w-full min-w-0 flex-1 rounded-xl border-2 border-charcoal/20 bg-white px-3 text-center text-lg font-semibold tabular-nums text-charcoal",
          "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
        )}
      />
      <button
        type="button"
        aria-label="Add one ticket"
        disabled={value >= max}
        className={stepperButtonClass}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-5" strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  );
}
