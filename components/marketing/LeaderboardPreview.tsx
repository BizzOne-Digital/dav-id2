"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import type { MarketingLeaderboardRow } from "@/components/marketing/types";

const DEMO_TEAMS: MarketingLeaderboardRow[] = [
  { rank: 1, name: "Boot Scootin' Brainiacs", score: 2840, completedStops: 12 },
  { rank: 2, name: "Hot Chicken Heroes", score: 2715, completedStops: 12 },
  { rank: 3, name: "Broadway Bandits", score: 2590, completedStops: 11 },
  { rank: 4, name: "Gulch Gurus", score: 2410, completedStops: 11 },
  { rank: 5, name: "Music City Misfits", score: 2285, completedStops: 10 },
];

type LeaderboardPreviewProps = {
  teams?: MarketingLeaderboardRow[];
};

export function LeaderboardPreview({ teams }: LeaderboardPreviewProps) {
  const rows = teams?.length ? teams : DEMO_TEAMS;
  const fromDb = Boolean(teams?.length);

  return (
    <section className="bg-charcoal section-y">
      <div className="site-x mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Live competition"
          title="Leaderboard preview"
          subtitle={
            fromDb
              ? "Recent demo standings—your team could top the board next."
              : "Sample standings from a recent downtown hunt—your team could top the board next."
          }
        />

        <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="relative hidden min-h-[280px] overflow-hidden rounded-2xl border border-gold/20 lg:block">
            <Image
              src={MARKETING_IMAGES.prizes.src}
              alt={MARKETING_IMAGES.prizes.alt}
              fill
              className="object-cover"
              sizes="480px"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-cream/10 bg-charcoal/60">
            <div className="flex items-center justify-between border-b border-cream/10 px-5 py-3">
              <span className="text-sm font-medium text-cream/70">Demo hunt · Downtown</span>
              <Badge variant="outline">{fromDb ? "Live sample" : "Sample data"}</Badge>
            </div>
            <ul>
              {rows.map((team, i) => (
                <motion.li
                  key={`${team.rank}-${team.name}`}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "flex items-center gap-4 border-b border-cream/5 px-5 py-4 last:border-0",
                    team.rank === 1 && "bg-gold/5"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full text-sm font-bold",
                      team.rank === 1 ? "bg-gold text-charcoal" : "bg-cream/10 text-cream"
                    )}
                  >
                    {team.rank === 1 ? <Crown className="size-5" aria-hidden /> : team.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-cream">{team.name}</p>
                    <p className="text-xs text-cream/50">
                      Checkpoint {team.completedStops ?? 12} of 14
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-gold">{team.score}</p>
                    <p className="flex items-center justify-end gap-1 text-xs text-green-400/90">
                      <TrendingUp className="size-3" aria-hidden />
                      —
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
