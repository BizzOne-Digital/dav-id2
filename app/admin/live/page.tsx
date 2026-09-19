"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type LiveSession = {
  id: string;
  sessionCode: string;
  status: string;
  score?: number;
  completedStops?: number;
  team?: { name?: string; displayId?: string };
};

export default function AdminLivePage() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);

  useEffect(() => {
    const tick = () => {
      fetch("/api/admin/live")
        .then((r) => r.json())
        .then((d) => setSessions(d.sessions ?? []));
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Live control room</h1>
      <p className="text-cream/70">Active and lobby sessions refresh every 15s.</p>
      <ul className="mt-6 space-y-3">
        {sessions.map((s) => (
          <li key={s.id}>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{s.team?.name ?? "Team"}</CardTitle>
                  <CardDescription>
                    {s.sessionCode} · {s.team?.displayId} · {s.completedStops ?? 0} stops · {s.score ?? 0} pts
                  </CardDescription>
                </div>
                <Badge>{s.status}</Badge>
              </CardHeader>
            </Card>
          </li>
        ))}
        {sessions.length === 0 && <p className="text-cream/60">No live sessions right now.</p>}
      </ul>
    </div>
  );
}
