"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type Entry = {
  rank: number;
  teamName?: string;
  teamDisplayId?: string;
  score?: number;
};

type PageProps = { params: Promise<{ sessionId: string }> };

export default function SessionLeaderboardPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch("/api/leaderboard?limit=25")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setEntries(data.entries);
      });
  }, []);

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-24">
      <Link href={`/game/play/${sessionId}`} className="text-sm text-gold hover:underline">← Back to hunt</Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas)] text-3xl text-gold">Leaderboard</h1>
      <ul className="mt-6 space-y-2">
        {entries.map((e) => (
          <li key={e.rank}>
            <Card className="flex items-center justify-between py-4">
              <CardHeader className="mb-0">
                <CardTitle className="text-base">
                  #{e.rank} {e.teamName ?? "Team"}
                </CardTitle>
                <p className="text-xs text-cream/50">{e.teamDisplayId}</p>
              </CardHeader>
              <span className="pr-4 font-bold text-gold">{e.score ?? 0}</span>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
