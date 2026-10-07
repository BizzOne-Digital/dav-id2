"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

export default function JoinPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lobbySessionId, setLobbySessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLobbySessionId(null);
    const raw = joinCode.trim();
    if (/^BK-/i.test(raw)) {
      setError(
        "That looks like a booking reference (BK-…), not a join code. Use the 6-digit team code from your confirmation page or captain."
      );
      setLoading(false);
      return;
    }
    const normalized = raw.replace(/\s/g, "").toUpperCase();
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode: normalized, displayName }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      error?: string;
      sessionId?: string;
      teamName?: string;
    };
    setLoading(false);
    if (!res.ok || !data.success) {
      setError(data.error ?? "Could not join team");
      if (data.sessionId) setLobbySessionId(data.sessionId);
      return;
    }
    if (data.sessionId) {
      router.push(`/game/lobby/${data.sessionId}`);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-lg border border-cream/15 px-3 py-2 text-sm text-cream hover:border-gold/40 hover:text-gold"
        >
          ← Home
        </Link>
        <Link href="/login" className="text-sm text-cream/70 hover:text-gold">Sign in (optional)</Link>
      </div>

      <div className="mb-4 rounded-xl border border-cream/15 bg-charcoal/80 p-4">
        <p className="text-sm font-semibold text-gold">Captain or solo (1 ticket)?</p>
        <p className="mt-1 text-sm text-cream/75">
          Don&apos;t use this page. Open your <strong className="text-cream">You&apos;re booked!</strong> confirmation
          and tap <strong className="text-cream">Open game lobby</strong>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Join your team</CardTitle>
          <CardDescription>
            <strong className="text-cream">Extra players only</strong> (when the captain bought 2+ tickets). Enter the
            6-digit code—not BK-…. Codes work for {HUNT_PLAY_WINDOW_HOURS} hours after purchase.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Join code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <Input
            label="Your display name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {error && (
            <div className="space-y-3">
              <p className="text-sm text-orange">{error}</p>
              {lobbySessionId && (
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push(`/game/lobby/${lobbySessionId}?code=${joinCode.trim()}`)}
                >
                  Open game lobby (captain)
                </Button>
              )}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining…" : "Join team"}
          </Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/" className="text-gold hover:underline">Back to home</Link>
      </p>
    </div>
  );
}
