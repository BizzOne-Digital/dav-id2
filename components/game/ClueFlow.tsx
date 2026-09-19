"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export type GamePhase =
  | "CLUE"
  | "TRAVEL"
  | "ARRIVE"
  | "TASK"
  | "VERIFY"
  | "AWARD"
  | "NEXT";

export type ClueStopData = {
  stopIndex: number;
  totalStops: number;
  locationName: string;
  address?: string;
  lat: number;
  lng: number;
  clue?: string;
  instructions: string;
  challengeTitle?: string;
  basePoints: number;
};

type ClueFlowProps = {
  sessionId: string;
  stop: ClueStopData;
  onStopComplete?: (nextStopIndex: number | null) => void;
};

export function ClueFlow({ sessionId, stop, onStopComplete }: ClueFlowProps) {
  const [phase, setPhase] = useState<GamePhase>("CLUE");
  const [answer, setAnswer] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [award, setAward] = useState<{ points: number; displayNumber: string } | null>(null);

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#F2B632", "#F6E8CB", "#D76A26"],
    });
  }, []);

  async function submitAnswer() {
    setLoading(true);
    setFeedback(null);
    const res = await fetch("/api/game/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        stopIndex: stop.stopIndex,
        answer,
        hintUsed,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success && data.error) {
      setFeedback(data.error);
      return;
    }

    if (data.correct) {
      setAward({ points: data.pointsAwarded, displayNumber: data.displayNumber });
      setPhase("AWARD");
      fireConfetti();
    } else {
      setFeedback(data.message ?? "Try again");
      setPhase("TASK");
    }
  }

  function advanceFromAward() {
    setPhase("NEXT");
    onStopComplete?.(null);
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;

  return (
    <div className="mx-auto max-w-lg px-4 pb-28 pt-4">
      <p className="mb-2 text-center text-xs uppercase tracking-widest text-cream/50">
        Stop {stop.stopIndex + 1} of {stop.totalStops} · {phase}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {phase === "CLUE" && (
            <Card>
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl text-gold">{stop.locationName}</h2>
              <p className="mt-3 text-cream/90 leading-relaxed">{stop.clue ?? stop.instructions}</p>
              <Button className="mt-6 w-full" onClick={() => setPhase("TRAVEL")}>Got it — let&apos;s go</Button>
            </Card>
          )}

          {phase === "TRAVEL" && (
            <Card>
              <h2 className="text-lg font-semibold text-cream">Head to the location</h2>
              <p className="mt-2 text-sm text-cream/70">{stop.address}</p>
              <Button href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 w-full" variant="secondary">
                Open in Maps
              </Button>
              <Button className="mt-3 w-full" onClick={() => setPhase("ARRIVE")}>I&apos;m here</Button>
            </Card>
          )}

          {phase === "ARRIVE" && (
            <Card>
              <h2 className="text-lg font-semibold text-cream">You&apos;ve arrived</h2>
              <p className="mt-2 text-sm text-cream/70">Look around and get ready for your challenge.</p>
              <Button className="mt-6 w-full" onClick={() => setPhase("TASK")}>Start challenge</Button>
            </Card>
          )}

          {phase === "TASK" && (
            <Card>
              <h2 className="font-[family-name:var(--font-bebas)] text-xl text-gold">
                {stop.challengeTitle ?? "Challenge"}
              </h2>
              <p className="mt-3 text-cream/90">{stop.instructions}</p>
              <p className="mt-2 text-xs text-cream/50">Worth up to {stop.basePoints} points</p>
              {hintUsed && <p className="mt-2 text-xs text-orange">Hint applied (−50 pts)</p>}
              <Button
                variant="ghost"
                className="mt-3 w-full text-sm"
                onClick={() => setHintUsed(true)}
              >
                Use hint
              </Button>
              <Button className="mt-4 w-full" onClick={() => setPhase("VERIFY")}>Ready to answer</Button>
            </Card>
          )}

          {phase === "VERIFY" && (
            <Card>
              <h2 className="text-lg font-semibold text-cream">Submit answer</h2>
              <Input
                className="mt-4"
                label="Your answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoComplete="off"
              />
              {feedback && <p className="mt-2 text-sm text-orange">{feedback}</p>}
              <Button className="mt-4 w-full" disabled={loading || !answer.trim()} onClick={submitAnswer}>
                {loading ? "Checking…" : "Verify"}
              </Button>
              <Button variant="ghost" className="mt-2 w-full" onClick={() => setPhase("TASK")}>Back</Button>
            </Card>
          )}

          {phase === "AWARD" && award && (
            <Card className="text-center">
              <motion.p
                className="font-[family-name:var(--font-bebas)] text-4xl text-gold"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                +{award.points}
              </motion.p>
              <p className="mt-2 text-cream/80">Completion #{award.displayNumber}</p>
              <p className="mt-1 text-xs text-cream/50">Save this number for the final vault</p>
              <Button className="mt-6 w-full" onClick={() => setPhase("NEXT")}>Continue</Button>
            </Card>
          )}

          {phase === "NEXT" && (
            <Card>
              <h2 className="text-lg font-semibold text-cream">Stop complete!</h2>
              <p className="mt-2 text-sm text-cream/70">Loading your next clue…</p>
              <Button className="mt-6 w-full" onClick={advanceFromAward}>Next stop</Button>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
