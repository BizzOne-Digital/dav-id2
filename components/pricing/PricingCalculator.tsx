"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type PricingPlanOption = {
  id: string;
  name: string;
  pricePerPersonCents: number;
  minimumPlayers: number;
  maximumPlayers?: number;
  durationLabel?: string;
  features?: string[];
};

type PricingCalculatorProps = {
  plans: PricingPlanOption[];
  defaultPlanId?: string;
};

export function PricingCalculator({ plans, defaultPlanId }: PricingCalculatorProps) {
  const initialId = defaultPlanId ?? plans[0]?.id ?? "";
  const [planId, setPlanId] = useState(initialId);
  const [players, setPlayers] = useState(plans[0]?.minimumPlayers ?? 4);

  const plan = useMemo(() => plans.find((p) => p.id === planId) ?? plans[0], [plans, planId]);

  const min = plan?.minimumPlayers ?? 4;
  const max = plan?.maximumPlayers ?? 50;
  const priceCents = plan?.pricePerPersonCents ?? 5000;
  const totalCents = priceCents * Math.max(min, Math.min(max, players));

  return (
    <Card className="border-gold/20 bg-charcoal">
      <div className="flex items-center gap-3">
        <Calculator className="size-6 text-gold" aria-hidden />
        <h2 className="text-xl font-semibold text-cream">Estimate your group total</h2>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {plans.length > 1 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-cream/80">Plan</label>
            <Select
              value={planId}
              options={plans.map((p) => ({ value: p.id, label: p.name }))}
              onChange={(e) => {
                setPlanId(e.target.value);
                const next = plans.find((p) => p.id === e.target.value);
                if (next) setPlayers(Math.max(next.minimumPlayers, players));
              }}
            />
          </div>
        )}
        <div>
          <label className="mb-2 block text-sm font-medium text-cream/80">Players</label>
          <Input
            type="number"
            min={min}
            max={max}
            value={players}
            onChange={(e) => setPlayers(Number(e.target.value) || min)}
          />
          <p className="mt-2 text-xs text-cream/50">
            Minimum {min} players{plan?.durationLabel ? ` · ${plan.durationLabel}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-cream/10 bg-charcoal/60 p-6">
        <p className="text-sm text-cream/70">
          {formatCurrency(priceCents)} per person × {Math.max(min, Math.min(max, players))} players
        </p>
        <p className="mt-2 text-3xl font-bold text-gold">{formatCurrency(totalCents)}</p>
        <p className="mt-2 text-xs text-cream/50">Taxes and add-ons may apply at checkout.</p>
        <Button href="/booking" variant="primary" className="mt-6 w-full sm:w-auto">
          Book your hunt
        </Button>
      </div>
    </Card>
  );
}
