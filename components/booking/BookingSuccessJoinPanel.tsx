"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyJoinCodeButton } from "@/components/booking/CopyJoinCodeButton";

type TeamRow = {
  id: string;
  name: string;
  color: string;
  joinCode: string;
  sessionId: string | null;
};

type BookingSuccessJoinPanelProps = {
  bookingId: string;
  stripeSessionId?: string;
  initialTeams: TeamRow[];
};

export function BookingSuccessJoinPanel({
  bookingId,
  stripeSessionId,
  initialTeams,
}: BookingSuccessJoinPanelProps) {
  const [teams, setTeams] = useState(initialTeams);
  const [polling, setPolling] = useState(initialTeams.length === 0);

  useEffect(() => {
    if (initialTeams.length > 0) return;

    let attempts = 0;
    const maxAttempts = 15;

    async function poll() {
      const params = new URLSearchParams({ bookingId });
      if (stripeSessionId) params.set("session_id", stripeSessionId);
      const res = await fetch(`/api/booking/confirmation?${params.toString()}`);
      const data = (await res.json()) as {
        success?: boolean;
        teams?: TeamRow[];
      };
      if (data.success && data.teams && data.teams.length > 0) {
        setTeams(data.teams);
        setPolling(false);
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        window.setTimeout(poll, 2000);
      } else {
        setPolling(false);
      }
    }

    poll();
  }, [bookingId, stripeSessionId, initialTeams.length]);

  if (teams.length === 0) {
    return (
      <p className="rounded-lg border border-orange/40 bg-orange/10 px-4 py-3 text-sm text-cream/85">
        {polling
          ? "Preparing your 6-digit join code… this usually takes a few seconds."
          : "We could not generate a join code automatically. Email contact@musiccityscavengerhunt.com with your BK- booking reference."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className="rounded-xl border-2 border-gold/40 bg-gold/5 p-5 text-center sm:text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Your 6-digit join code</p>
          <p
            className="mt-2 font-mono text-4xl font-bold tracking-[0.35em] text-cream sm:text-5xl"
            aria-label={`Join code ${team.joinCode}`}
          >
            {team.joinCode}
          </p>
          <CopyJoinCodeButton code={team.joinCode} />
          <p className="mt-3 text-sm text-cream/70">
            Team: <strong className="text-cream">{team.name}</strong> ({team.color})
          </p>
          {team.sessionId ? (
            <Button
              href={`/game/lobby/${team.sessionId}?code=${encodeURIComponent(team.joinCode)}`}
              variant="primary"
              className="mt-4 w-full sm:w-auto"
            >
              Open game lobby
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
