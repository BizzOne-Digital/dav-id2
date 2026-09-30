"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

const lobbyCodeKey = (sessionId: string) => `mcs-hunt-join-code-${sessionId}`;

type GameLobbyClientProps = {
  sessionId: string;
  playDeadlineLabel?: string | null;
  initialJoinCode?: string | null;
};

export function GameLobbyClient({ sessionId, playDeadlineLabel, initialJoinCode }: GameLobbyClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState(initialJoinCode ?? "");

  useEffect(() => {
    if (initialJoinCode) {
      sessionStorage.setItem(lobbyCodeKey(sessionId), initialJoinCode);
      setJoinCode(initialJoinCode);
      return;
    }
    const saved = sessionStorage.getItem(lobbyCodeKey(sessionId));
    if (saved) setJoinCode(saved);
  }, [sessionId, initialJoinCode]);

  async function startHunt() {
    setLoading(true);
    setError(null);
    const code = joinCode.trim();
    if (code) sessionStorage.setItem(lobbyCodeKey(sessionId), code);
    const res = await fetch("/api/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, joinCode: code || undefined }),
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
        <Input
          label="Team join code (from confirmation)"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="mb-4"
        />
        {error && <p className="mb-4 text-sm text-orange">{error}</p>}
        <Button className="w-full" onClick={startHunt} disabled={loading || !joinCode.trim()}>
          {loading ? "Building your route…" : "Start hunt"}
        </Button>
        <Button href={`/game/leaderboard/${sessionId}`} variant="ghost" className="mt-3 w-full">
          View leaderboard
        </Button>
      </Card>
    </div>
  );
}
