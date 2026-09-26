"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

type GameLobbyClientProps = {
  sessionId: string;
  playDeadlineLabel?: string | null;
};

export function GameLobbyClient({ sessionId, playDeadlineLabel }: GameLobbyClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startHunt() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.success) {
      setError(data.error ?? "Could not start hunt");
      return;
    }
    router.push(`/game/play/${sessionId}`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Hunt lobby</CardTitle>
          <CardDescription>
            Gather your team, review the rules, and start when everyone is ready. Only the captain needs
            to tap start. Join codes stay active for {HUNT_PLAY_WINDOW_HOURS} hours from purchase
            {playDeadlineLabel ? ` (through ${playDeadlineLabel})` : ""}.
          </CardDescription>
        </CardHeader>
        {error && <p className="mb-4 text-sm text-orange">{error}</p>}
        <Button className="w-full" onClick={startHunt} disabled={loading}>
          {loading ? "Building your route…" : "Start hunt"}
        </Button>
        <Button href={`/game/leaderboard/${sessionId}`} variant="ghost" className="mt-3 w-full">
          View leaderboard
        </Button>
      </Card>
    </div>
  );
}
