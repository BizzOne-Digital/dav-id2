"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbulb, Lock, Unlock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

const SAMPLE_RIDDLE =
  "Where steel strings echo and boots hit the floor, a famous strip shines—what two words name this Nashville core?";

export function ChallengePreview() {
  const [answer, setAnswer] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "correct" | "wrong" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function checkAnswer(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    setStatus("loading");
    setFeedback("");
    try {
      const res = await fetch("/api/preview-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setFeedback(data.error ?? "Could not verify answer.");
        return;
      }
      if (data.correct) {
        setStatus("correct");
        setFeedback(data.message ?? "That's it! You're hunt-ready.");
      } else {
        setStatus("wrong");
        setFeedback(data.message ?? "Not quite—try again.");
      }
    } catch {
      setStatus("error");
      setFeedback("Connection error. Try again.");
    }
  }

  return (
    <section id="challenge-preview" className="bg-charcoal section-y">
      <div className="site-x mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Try it"
          title="Preview a challenge"
          subtitle="Sample the clue style—no booking required. Hints cost nothing but pride."
        />

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/25 shadow-2xl lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={MARKETING_IMAGES.ryman.src}
              alt={MARKETING_IMAGES.ryman.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-sm text-cream/80">
              Real hunts use riddles, photos, QR check-ins, and more—tones change by group type.
            </p>
          </div>

          <Card className="border-gold/20">
            <div className="flex items-start gap-3">
              {status === "correct" ? (
                <Unlock className="size-6 shrink-0 text-gold" aria-hidden />
              ) : (
                <Lock className="size-6 shrink-0 text-cream/50" aria-hidden />
              )}
              <p className="text-lg leading-relaxed text-cream">{SAMPLE_RIDDLE}</p>
            </div>

            {hintVisible && (
              <p className="mt-4 rounded-lg border border-orange/30 bg-orange/10 px-4 py-3 text-sm text-cream/90">
                <Lightbulb className="-mt-0.5 mr-2 inline size-4 text-orange" aria-hidden />
                Hint: Think rhinestones, pedal steel, and tourists with cowboy hats.
              </p>
            )}

            <form onSubmit={checkAnswer} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
              <Input
                label="Your answer"
                placeholder="Type your guess"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={status === "loading" || status === "correct"}
                className="flex-1"
              />
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="ghost" onClick={() => setHintVisible(true)} disabled={hintVisible}>
                  Show hint
                </Button>
                <Button type="submit" variant="primary" disabled={status === "loading" || status === "correct"}>
                  {status === "loading" ? "Checking…" : "Check answer"}
                </Button>
              </div>
            </form>

            {feedback && (
              <p
                role="status"
                className={`mt-4 text-sm font-medium ${
                  status === "correct"
                    ? "text-gold"
                    : status === "wrong"
                      ? "text-orange"
                      : "text-cream/70"
                }`}
              >
                {feedback}
              </p>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
