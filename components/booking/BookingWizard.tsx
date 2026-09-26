"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurrency } from "@/lib/utils";
import { resolvePricePerPersonCents, VOLUME_PRICING_SUMMARY } from "@/lib/pricing/resolve-price";
import { cn } from "@/lib/utils";

export type HuntOption = {
  id: string;
  slug: string;
  title: string;
  minimumPlayers: number;
  pricePerPersonCents: number;
};

const STEPS = ["details", "team", "preferences", "review"] as const;
type Step = (typeof STEPS)[number];

const GROUP_TYPES = [
  { value: "friends", label: "Friends" },
  { value: "family", label: "Family" },
  { value: "bachelorette", label: "Bachelorette / Bachelor" },
  { value: "corporate", label: "Corporate" },
  { value: "couples", label: "Couples" },
  { value: "tourists", label: "Visitors / Tourists" },
];

const START_WINDOWS = [
  { value: "morning", label: "Morning (9–11 AM)" },
  { value: "midday", label: "Midday (11 AM–2 PM)" },
  { value: "afternoon", label: "Afternoon (2–5 PM)" },
  { value: "evening", label: "Evening (5–8 PM)" },
];

const TEAM_COLORS = ["BLUE", "GOLD", "GREEN", "PINK", "RED", "CYAN"] as const;

type BookingWizardProps = {
  hunts: HuntOption[];
  initialHuntSlug?: string;
};

export function BookingWizard({ hunts, initialHuntSlug }: BookingWizardProps) {
  const router = useRouter();
  const defaultSlug = initialHuntSlug ?? hunts[0]?.slug ?? "";
  const [step, setStep] = useState<Step>("details");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [huntSlug, setHuntSlug] = useState(defaultSlug);
  const [groupType, setGroupType] = useState("friends");
  const [scheduledDate, setScheduledDate] = useState("");
  const [startWindow, setStartWindow] = useState("afternoon");
  const [playerCount, setPlayerCount] = useState(hunts[0]?.minimumPlayers ?? 4);

  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [teamColor, setTeamColor] = useState<(typeof TEAM_COLORS)[number]>("GOLD");
  const [emergencyConsent, setEmergencyConsent] = useState(false);

  const [youngestAge, setYoungestAge] = useState<number | "">("");
  const [accessibilityNotes, setAccessibilityNotes] = useState("");
  const [alcoholFree, setAlcoholFree] = useState(false);
  const [walkingPref, setWalkingPref] = useState("moderate");

  const hunt = useMemo(
    () => hunts.find((h) => h.slug === huntSlug) ?? hunts[0],
    [hunts, huntSlug]
  );

  const pricePerPerson = useMemo(
    () =>
      resolvePricePerPersonCents({
        playerCount,
        groupType,
        basePriceCents: hunt?.pricePerPersonCents,
      }),
    [playerCount, groupType, hunt?.pricePerPersonCents]
  );

  const estimatedTotal = pricePerPerson * playerCount;

  const stepIndex = STEPS.indexOf(step);

  const saveStep = useCallback(
    async (current: Step) => {
      setError(null);
      const body: Record<string, unknown> = {
        step: current,
        idempotencyKey,
        bookingId: bookingId ?? undefined,
        huntSlug,
        groupType,
        scheduledDate: scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
        startWindow,
        playerCount,
        teamName: teamName || undefined,
        captainName: captainName || undefined,
        captainEmail: captainEmail || undefined,
        captainPhone: captainPhone || undefined,
        teamColor,
        emergencyConsent,
        youngestAge: youngestAge === "" ? undefined : youngestAge,
        accessibilityNotes: accessibilityNotes || undefined,
        alcoholFree,
        walkingPref,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        booking?: { id: string };
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Could not save booking");
      }
      if (data.booking?.id) setBookingId(data.booking.id);
    },
    [
      idempotencyKey,
      bookingId,
      huntSlug,
      groupType,
      scheduledDate,
      startWindow,
      playerCount,
      teamName,
      captainName,
      captainEmail,
      captainPhone,
      teamColor,
      emergencyConsent,
      youngestAge,
      accessibilityNotes,
      alcoholFree,
      walkingPref,
    ]
  );

  async function goNext() {
    try {
      await saveStep(step);
      const next = STEPS[stepIndex + 1];
      if (next) setStep(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }

  async function handleCheckout() {
    if (!bookingId) {
      setError("Complete the steps above before checkout.");
      return;
    }
    setCheckoutLoading(true);
    setError(null);
    try {
      await saveStep("review");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = (await res.json()) as { success?: boolean; url?: string; error?: string; mode?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Checkout failed");
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.mode === "dev") {
        router.push(`/booking/success?bookingId=${bookingId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (!hunts.length) {
    return (
      <Card>
        <p className="text-cream/80">No hunts are available to book right now. Please check back soon.</p>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="mb-10 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide",
              i <= stepIndex ? "bg-gold/20 text-gold" : "bg-cream/5 text-cream/40"
            )}
          >
            {i < stepIndex ? <Check className="size-3.5" /> : <span>{i + 1}</span>}
            {s}
          </li>
        ))}
      </ol>

      <Card>
        {step === "details" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-cream">Hunt details</h2>
            <div>
              <label className="mb-2 block text-sm text-cream/80">Hunt</label>
              <Select
                value={huntSlug}
                options={hunts.map((h) => ({ value: h.slug, label: h.title }))}
                onChange={(e) => setHuntSlug(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-cream/80">Group type</label>
              <Select
                value={groupType}
                options={GROUP_TYPES}
                onChange={(e) => setGroupType(e.target.value)}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-cream/80">Date</label>
                <Input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-cream/80">Start window</label>
                <Select
                  value={startWindow}
                  options={START_WINDOWS}
                  onChange={(e) => setStartWindow(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-cream/80">Players</label>
              <Input
                type="number"
                min={hunt?.minimumPlayers ?? 4}
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value) || 4)}
              />
            </div>
            <p className="text-sm text-cream/60">
              {formatCurrency(pricePerPerson)} per person × {playerCount} players ={" "}
              <span className="font-semibold text-gold">{formatCurrency(estimatedTotal)}</span>
            </p>
            <p className="text-xs text-cream/50">{VOLUME_PRICING_SUMMARY}</p>
          </div>
        )}

        {step === "team" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-cream">Team & captain</h2>
            <Input placeholder="Team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            <Input placeholder="Captain name" value={captainName} onChange={(e) => setCaptainName(e.target.value)} />
            <Input
              type="email"
              placeholder="Captain email"
              value={captainEmail}
              onChange={(e) => setCaptainEmail(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Captain phone"
              value={captainPhone}
              onChange={(e) => setCaptainPhone(e.target.value)}
            />
            <div>
              <label className="mb-2 block text-sm text-cream/80">Team color</label>
              <Select
                value={teamColor}
                options={TEAM_COLORS.map((c) => ({ value: c, label: c }))}
                onChange={(e) => setTeamColor(e.target.value as (typeof TEAM_COLORS)[number])}
              />
            </div>
            <label className="flex items-start gap-3 text-sm text-cream/80">
              <input
                type="checkbox"
                className="mt-1"
                checked={emergencyConsent}
                onChange={(e) => setEmergencyConsent(e.target.checked)}
              />
              I agree to receive hunt-day updates by email or text.
            </label>
          </div>
        )}

        {step === "preferences" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-cream">Preferences</h2>
            <div>
              <label className="mb-2 block text-sm text-cream/80">Youngest player age (optional)</label>
              <Input
                type="number"
                min={0}
                value={youngestAge}
                onChange={(e) => setYoungestAge(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
            <label className="flex items-center gap-3 text-sm text-cream/80">
              <input type="checkbox" checked={alcoholFree} onChange={(e) => setAlcoholFree(e.target.checked)} />
              Prefer alcohol-free route
            </label>
            <div>
              <label className="mb-2 block text-sm text-cream/80">Walking pace</label>
              <Select
                value={walkingPref}
                options={[
                  { value: "easy", label: "Easy / frequent breaks" },
                  { value: "moderate", label: "Moderate" },
                  { value: "fast", label: "Fast-paced" },
                ]}
                onChange={(e) => setWalkingPref(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Accessibility notes or special requests"
              rows={4}
              value={accessibilityNotes}
              onChange={(e) => setAccessibilityNotes(e.target.value)}
            />
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4 text-cream/85">
            <h2 className="text-xl font-semibold text-cream">Review & pay</h2>
            <p><strong className="text-cream">Hunt:</strong> {hunt?.title}</p>
            <p><strong className="text-cream">Date:</strong> {scheduledDate} ({startWindow})</p>
            <p><strong className="text-cream">Group:</strong> {GROUP_TYPES.find((g) => g.value === groupType)?.label ?? groupType}</p>
            <p><strong className="text-cream">Players:</strong> {playerCount}</p>
            <p><strong className="text-cream">Rate:</strong> {formatCurrency(pricePerPerson)} / person</p>
            <p><strong className="text-cream">Team:</strong> {teamName || "—"}</p>
            <p><strong className="text-cream">Captain:</strong> {captainName} · {captainEmail}</p>
            <p className="text-2xl font-bold text-gold">Total: {formatCurrency(estimatedTotal)}</p>
            <Button variant="primary" onClick={handleCheckout} disabled={checkoutLoading}>
              {checkoutLoading ? "Redirecting…" : "Continue to payment"}
            </Button>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-orange">{error}</p>}

        {step !== "review" && (
          <div className="mt-8 flex justify-between gap-4">
            <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex === 0}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            <Button type="button" variant="primary" onClick={goNext}>
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
