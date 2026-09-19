"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";

type GameHeaderProps = {
  teamName: string;
  sessionCode: string;
  score: number;
  stopLabel: string;
  sessionId: string;
};

export function GameHeader({ teamName, sessionCode, score, stopLabel, sessionId }: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-cream/10 bg-charcoal/95 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-wider text-cream/50">{sessionCode}</p>
          <h1 className="truncate font-[family-name:var(--font-bebas)] text-xl text-gold">{teamName}</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-cream/60">{stopLabel}</p>
          <p className="text-lg font-bold text-gold">{score} pts</p>
        </div>
        <Link
          href={`/game/leaderboard/${sessionId}`}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/20 text-gold"
          aria-label="Leaderboard"
        >
          <Trophy className="size-5" />
        </Link>
      </div>
    </header>
  );
}
