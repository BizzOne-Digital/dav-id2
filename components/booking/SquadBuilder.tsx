"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  TEAM_COLORS,
  type SquadPlan,
  type TeamColor,
  squadTicketTotal,
} from "@/lib/site/teamSetupGuide";
import { cn } from "@/lib/utils";

const COLOR_DOT: Record<TeamColor, string> = {
  BLUE: "bg-denim",
  GOLD: "bg-gold",
  GREEN: "bg-olive",
  PINK: "bg-[#e879a9]",
  RED: "bg-crimson",
  CYAN: "bg-cyan-400",
};

type SquadBuilderProps = {
  squads: SquadPlan[];
  requiredTickets: number;
  onChange: (squads: SquadPlan[]) => void;
};

export function SquadBuilder({ squads, requiredTickets, onChange }: SquadBuilderProps) {
  const total = squadTicketTotal(squads);
  const balanced = total === requiredTickets;

  function updateIndex(i: number, patch: Partial<SquadPlan>) {
    onChange(squads.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addSquad() {
    if (squads.length >= TEAM_COLORS.length) return;
    onChange([
      ...squads,
      {
        name: `Team ${String.fromCharCode(65 + squads.length)}`,
        color: TEAM_COLORS[squads.length % TEAM_COLORS.length],
        playerCount: 1,
      },
    ]);
  }

  function removeSquad(i: number) {
    if (squads.length <= 1) return;
    onChange(squads.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-cream/90">Competing squads</p>
        <p
          className={cn(
            "text-xs font-semibold",
            balanced ? "text-olive" : "text-orange"
          )}
        >
          Tickets assigned: {total} / {requiredTickets}
        </p>
      </div>

      <ul className="space-y-3">
        {squads.map((squad, i) => (
          <li
            key={`squad-${i}`}
            className="rounded-lg border border-cream/10 bg-charcoal/40 p-3 sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                Squad {i + 1}
              </span>
              {squads.length > 1 && (
                <button
                  type="button"
                  className="text-cream/40 hover:text-orange"
                  onClick={() => removeSquad(i)}
                  aria-label={`Remove squad ${i + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <Input
                placeholder="Squad name"
                value={squad.name}
                onChange={(e) => updateIndex(i, { name: e.target.value })}
              />
              <Select
                value={squad.color}
                options={TEAM_COLORS.map((c) => ({ value: c, label: c }))}
                onChange={(e) => updateIndex(i, { color: e.target.value as TeamColor })}
              />
              <Input
                type="number"
                min={1}
                max={requiredTickets}
                value={squad.playerCount}
                onChange={(e) =>
                  updateIndex(i, { playerCount: Math.max(1, Number(e.target.value) || 1) })
                }
                aria-label={`Tickets for squad ${i + 1}`}
              />
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-cream/50">
              <span className={cn("size-3 rounded-full", COLOR_DOT[squad.color])} aria-hidden />
              Shown on leaderboard & certificates for this squad
            </div>
          </li>
        ))}
      </ul>

      {squads.length < TEAM_COLORS.length && squads.length < requiredTickets && (
        <Button type="button" variant="ghost" className="w-full gap-2 text-sm" onClick={addSquad}>
          <Plus className="size-4" /> Add another squad
        </Button>
      )}
    </div>
  );
}
