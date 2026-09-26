"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GameBottomNav } from "@/components/game/GameBottomNav";

type PageProps = { params: Promise<{ sessionId: string }> };

export default function GameFinishPage({ params }: PageProps) {
  const { sessionId } = use(params);
  const router = useRouter();
  const [vaultCode, setVaultCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function unlockVault(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/game/finish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, vaultCode }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.success) {
      setError(data.error ?? "Vault code incorrect");
      return;
    }
    router.push(`/certificate/${data.certificateId}`);
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-lg px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Final vault</CardTitle>
            <CardDescription>
              Enter your completion numbers in order, separated by hyphens (e.g. 123456-789012-345678).
            </CardDescription>
          </CardHeader>
          <form onSubmit={unlockVault} className="space-y-4">
            <Input
              label="Vault code"
              value={vaultCode}
              onChange={(e) => setVaultCode(e.target.value)}
              required
            />
            {error && <p className="text-sm text-orange">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Unlocking…" : "Unlock & claim certificate"}
            </Button>
          </form>
        </Card>
      </div>
      <GameBottomNav sessionId={sessionId} active="finish" />
    </div>
  );
}
