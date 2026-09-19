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
};

export function GamePlayClient(props: GamePlayClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-charcoal pb-20">
      <GameHeader
        teamName={props.teamName}
        sessionCode={props.sessionCode}
        score={props.score}
        stopLabel={`Stop ${props.stop.stopIndex + 1}/${props.stop.totalStops}`}
        sessionId={props.sessionId}
      />
      <ClueFlow
        sessionId={props.sessionId}
        stop={props.stop}
        onStopComplete={() => router.refresh()}
      />
      <GameBottomNav sessionId={props.sessionId} active="play" />
    </div>
  );
}
