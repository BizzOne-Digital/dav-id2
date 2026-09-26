"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const COLORS = ["BLUE", "GOLD", "GREEN", "PINK", "RED", "CYAN"] as const;

export default function TeamSetupPage() {
  const [teamName, setTeamName] = useState("");
  const [color, setColor] = useState<string>("GOLD");
  const [playerCount, setPlayerCount] = useState("4");
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(
      "Team details saved locally. After checkout, your official team profile and join code are created automatically."
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gold hover:underline">← Dashboard</Link>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Team setup</CardTitle>
          <CardDescription>Choose your team name and colors before hunt day.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
          <Select
            label="Team color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            options={COLORS.map((c) => ({ value: c, label: c }))}
          />
          <Input
            label="Expected players"
            type="number"
            min={1}
            max={20}
            value={playerCount}
            onChange={(e) => setPlayerCount(e.target.value)}
          />
          {message && <p className="text-sm text-olive">{message}</p>}
          <Button type="submit" className="w-full">Save preferences</Button>
        </form>
      </Card>
    </div>
  );
}
