"use client";

import { useRouter } from "next/navigation";
import { GameHeader } from "@/components/game/GameHeader";
import { GameBottomNav } from "@/components/game/GameBottomNav";
import { ClueFlow, type ClueStopData } from "@/components/game/ClueFlow";

type GamePlayClientProps = {
  sessionId: string;
  teamName: string;
  sessionCode: string;
  score: number;
  stop: ClueStopData;
  view?: "play" | "map";
};

export function GamePlayClient(props: GamePlayClientProps) {
  const router = useRouter();
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${props.stop.lat},${props.stop.lng}`;
  const showMap = props.view === "map";

  return (
    <div className="min-h-screen bg-charcoal pb-20">
      <GameHeader
        teamName={props.teamName}
        sessionCode={props.sessionCode}
        score={props.score}
        stopLabel={`Stop ${props.stop.stopIndex + 1}/${props.stop.totalStops}`}
        sessionId={props.sessionId}
      />
      {showMap ? (
        <div className="mx-auto max-w-lg px-4 pb-28 pt-4">
          <div className="rounded-2xl border border-cream/10 bg-charcoal/80 p-6">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl text-gold">{props.stop.locationName}</h2>
            <p className="mt-2 text-sm text-cream/70">{props.stop.address ?? "Current hunt stop"}</p>
            <p className="mt-4 text-sm text-cream/80">
              Stop {props.stop.stopIndex + 1} of {props.stop.totalStops} — open directions below, then return to{" "}
              <strong className="text-cream">Play</strong> for your clue.
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-charcoal"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      ) : (
        <ClueFlow
          key={props.stop.stopIndex}
          sessionId={props.sessionId}
          stop={props.stop}
          onStopComplete={() => router.refresh()}
        />
      )}
      <GameBottomNav sessionId={props.sessionId} active={showMap ? "map" : "play"} />
    </div>
  );
}
