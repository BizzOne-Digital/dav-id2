"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type ChallengeRow = { _id: string; title?: string; type: string; active?: boolean };

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeRow[]>([]);

  useEffect(() => {
    fetch("/api/admin/challenges")
      .then((r) => r.json())
      .then((d) => setChallenges(d.challenges ?? []));
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Challenges</h1>
      <ul className="mt-6 space-y-2">
        {challenges.map((c) => (
          <li key={c._id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{c.title ?? c.type}</CardTitle>
                <p className="text-xs text-cream/50">{c.type} · {c.active ? "active" : "inactive"}</p>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
