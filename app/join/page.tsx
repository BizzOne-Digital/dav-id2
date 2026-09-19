"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function JoinPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode: joinCode.trim(), displayName }),
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
      <Card>
        <CardHeader>
          <CardTitle>Join your team</CardTitle>
          <CardDescription>Enter the 6-digit code from your captain.</CardDescription>
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
          {error && <p className="text-sm text-orange">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Joining…" : "Join team"}
          </Button>
        </form>
      </Card>
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/dashboard" className="text-gold hover:underline">Back to dashboard</Link>
      </p>
    </div>
  );
}
