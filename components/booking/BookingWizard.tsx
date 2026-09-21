"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurrency } from "@/lib/utils";
import { resolvePricePerPersonCents, VOLUME_PRICING_SUMMARY } from "@/lib/pricing/resolve-price";
import {
  bookingPlayerBounds,
  DEFAULT_MIN_PLAYERS,
  SINGLE_COUPLE_GROUP_LABEL,
  SINGLE_COUPLE_GROUP_TYPE,
} from "@/lib/site/groupSizeCopy";
import {
  COMPETITION_RULES,
  rosterLabel,
  suggestedTeamCount,
} from "@/lib/site/competitionRules";
import {
  TEAM_COLORS,
  buildDefaultSquads,
  defaultSingleSquadName,
  getGroupSetupGuide,
  shouldOfferMultiSquads,
  validateSquads,
  type SquadPlan,
  type TeamColor,
} from "@/lib/site/teamSetupGuide";
import { TeamSetupGuidePanel } from "@/components/booking/TeamSetupGuidePanel";
import { SquadBuilder } from "@/components/booking/SquadBuilder";
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
  { value: SINGLE_COUPLE_GROUP_TYPE, label: SINGLE_COUPLE_GROUP_LABEL },
  { value: "friends", label: "Friends" },
  { value: "family", label: "Family" },
  { value: "bachelorette", label: "Bachelorette / Bachelor" },
  { value: "corporate", label: "Corporate" },
  { value: "tourists", label: "Visitors / Tourists" },
];

const START_WINDOWS = [
  { value: "morning", label: "Morning (9–11 AM)" },
  { value: "midday", label: "Midday (11 AM–2 PM)" },
  { value: "afternoon", label: "Afternoon (2–5 PM)" },
  { value: "evening", label: "Evening (5–8 PM)" },
];

type BookingWizardProps = {
  hunts: HuntOption[];
  initialHuntSlug?: string;
};

export function BookingWizard({ hunts, initialHuntSlug }: BookingWizardProps) {
  const defaultSlug = initialHuntSlug ?? hunts[0]?.slug ?? "";
  const [step, setStep] = useState<Step>("details");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [huntSlug, setHuntSlug] = useState(defaultSlug);
  const [groupType, setGroupType] = useState(SINGLE_COUPLE_GROUP_TYPE);
  const [scheduledDate, setScheduledDate] = useState("");
  const [startWindow, setStartWindow] = useState("afternoon");
  const [playerCount, setPlayerCount] = useState(2);

  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [teamColor, setTeamColor] = useState<TeamColor>("GOLD");
  const [emergencyConsent, setEmergencyConsent] = useState(false);
  const [useSquads, setUseSquads] = useState(false);
  const [squads, setSquads] = useState<SquadPlan[]>([]);

  const [youngestAge, setYoungestAge] = useState<number | "">("");
  const [accessibilityNotes, setAccessibilityNotes] = useState("");
  const [alcoholFree, setAlcoholFree] = useState(false);
  const [walkingPref, setWalkingPref] = useState("moderate");

  const [playerRoster, setPlayerRoster] = useState<string[]>(["", ""]);

  const hunt = useMemo(
    () => hunts.find((h) => h.slug === huntSlug) ?? hunts[0],
    [hunts, huntSlug]
  );

  const playerBounds = useMemo(
    () => bookingPlayerBounds(groupType, hunt?.minimumPlayers ?? DEFAULT_MIN_PLAYERS),
    [groupType, hunt?.minimumPlayers]
  );

  useEffect(() => {
    setPlayerCount((count) =>
      Math.min(playerBounds.max, Math.max(playerBounds.min, count))
    );
  }, [playerBounds.min, playerBounds.max]);

  useEffect(() => {
    setPlayerRoster((prev) => {
      const next = [...prev];
      while (next.length < playerCount) next.push("");
      return next.slice(0, playerCount);
    });
  }, [playerCount]);

  useEffect(() => {
    if (!captainName) return;
    setPlayerRoster((prev) => {
      if (prev[0] === captainName) return prev;
      const next = [...prev];
      next[0] = captainName;
      return next;
    });
  }, [captainName]);

  const suggestedTeams = useMemo(
    () => suggestedTeamCount(playerCount, groupType),
    [playerCount, groupType]
  );

  const setupGuide = useMemo(() => getGroupSetupGuide(groupType), [groupType]);
  const offerMultiSquads = useMemo(
    () => shouldOfferMultiSquads(groupType, playerCount),
    [groupType, playerCount]
  );

  useEffect(() => {
    if (groupType === "corporate" && playerCount >= 4) {
      setUseSquads(true);
    }
  }, [groupType, playerCount]);

  useEffect(() => {
    if (!offerMultiSquads && useSquads) {
      setUseSquads(false);
      setSquads([]);
    }
  }, [offerMultiSquads, useSquads]);

  useEffect(() => {
    if (!useSquads) return;
    setSquads((prev) =>
      buildDefaultSquads(
        playerCount,
        prev.length > 1 ? prev.length : suggestedTeams,
        teamName.trim() || defaultSingleSquadName(groupType),
        teamColor
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebalance tickets when headcount changes
  }, [playerCount]);

  useEffect(() => {
    if (!useSquads) return;
    setSquads((prev) =>
      prev.length
        ? prev
        : buildDefaultSquads(
            playerCount,
            suggestedTeams,
            teamName.trim() || defaultSingleSquadName(groupType),
            teamColor
          )
    );
  }, [useSquads]);

  function enableSquads() {
    setUseSquads(true);
    setSquads(
      buildDefaultSquads(
        playerCount,
        suggestedTeams,
        teamName.trim() || defaultSingleSquadName(groupType),
        teamColor
      )
    );
  }

  function disableSquads() {
    setUseSquads(false);
    setSquads([]);
  }

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
        playerRoster: playerRoster.map((n) => n.trim()).filter(Boolean),
        teamName: useSquads && squads[0] ? squads[0].name : teamName || undefined,
        captainName: captainName || undefined,
        captainEmail: captainEmail || undefined,
        captainPhone: captainPhone || undefined,
        teamColor: useSquads && squads[0] ? squads[0].color : teamColor,
        squads: useSquads ? squads : undefined,
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
      useSquads,
      squads,
      playerRoster,
      emergencyConsent,
      youngestAge,
      accessibilityNotes,
      alcoholFree,
      walkingPref,
    ]
  );

  async function goNext() {
    setError(null);
    if (step === "team") {
      if (!captainEmail.trim()) {
        setError("Captain email is required so we can send join codes and receipts.");
        return;
      }
      if (useSquads) {
        const squadErr = validateSquads(squads, playerCount);
        if (squadErr) {
          setError(squadErr);
          return;
        }
      } else if (!teamName.trim()) {
        setError("Choose a team name—it appears on the leaderboard and certificates.");
        return;
      }
    }
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
        window.location.href = `/booking/success?bookingId=${bookingId}`;
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
                min={playerBounds.min}
                max={playerBounds.max}
                value={playerCount}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (!Number.isFinite(next)) return;
                  setPlayerCount(
                    Math.min(playerBounds.max, Math.max(playerBounds.min, next))
                  );
                }}
              />
              {groupType === SINGLE_COUPLE_GROUP_TYPE && (
                <p className="mt-1 text-xs text-cream/55">
                  One ticket covers 1 or 2 players at the same per-person rate.
                </p>
              )}
            </div>
            <p className="text-sm text-cream/60">
              {formatCurrency(pricePerPerson)} per person × {playerCount} players ={" "}
              <span className="font-semibold text-gold">{formatCurrency(estimatedTotal)}</span>
            </p>
            <p className="text-xs text-cream/50">{VOLUME_PRICING_SUMMARY}</p>
            <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm text-cream/85">
              <p className="font-semibold text-gold">{COMPETITION_RULES.headline}</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-cream/75">
                {COMPETITION_RULES.bullets.slice(0, 3).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {step === "team" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-cream">Team & tickets</h2>
            <TeamSetupGuidePanel groupType={groupType} guide={setupGuide} />
            <p className="text-sm text-cream/70">
              {playerCount} ticket{playerCount === 1 ? "" : "s"} purchased — one certificate per ticket at the finish line.
            </p>

            {offerMultiSquads && (
              <div className="rounded-lg border border-cream/10 bg-cream/5 p-4">
                <p className="text-sm font-medium text-cream/90">
                  {groupType === "corporate" ? "Corporate squads" : "Large group?"}
                </p>
                <p className="mt-1 text-xs text-cream/65">
                  Split tickets into competing squads—each gets its own name, color, join code, and lobby.
                </p>
                <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-cream/85">
                  <input
                    type="checkbox"
                    checked={useSquads}
                    onChange={(e) => (e.target.checked ? enableSquads() : disableSquads())}
                  />
                  Set up multiple squads ({suggestedTeams} suggested for {playerCount} tickets)
                </label>
              </div>
            )}

            {useSquads ? (
              <SquadBuilder squads={squads} requiredTickets={playerCount} onChange={setSquads} />
            ) : (
              <>
                <Input
                  placeholder={defaultSingleSquadName(groupType)}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  aria-label="Team name"
                />
                <div>
                  <label className="mb-2 block text-sm text-cream/80">Team color (competitor ID)</label>
                  <Select
                    value={teamColor}
                    options={TEAM_COLORS.map((c) => ({ value: c, label: c }))}
                    onChange={(e) => setTeamColor(e.target.value as TeamColor)}
                  />
                </div>
              </>
            )}

            <Input placeholder="Captain name" value={captainName} onChange={(e) => setCaptainName(e.target.value)} />
            <Input
              type="email"
              placeholder="Captain email"
              required
              value={captainEmail}
              onChange={(e) => setCaptainEmail(e.target.value)}
            />
            <Input
              type="tel"
              placeholder="Captain phone"
              value={captainPhone}
              onChange={(e) => setCaptainPhone(e.target.value)}
            />

            {!useSquads && suggestedTeams > 1 && (
              <p className="rounded-lg border border-cream/10 bg-cream/5 px-3 py-2 text-xs text-cream/75">
                {COMPETITION_RULES.corporateNote} You can enable multiple squads above if departments should compete separately.
              </p>
            )}

            <div>
              <p className="mb-2 text-sm font-medium text-cream/80">Player names (optional, for certificates)</p>
              <div className="space-y-2">
                {playerRoster.map((name, i) => (
                  <Input
                    key={`roster-${i}`}
                    placeholder={rosterLabel(i)}
                    value={name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPlayerRoster((prev) => {
                        const next = [...prev];
                        next[i] = val;
                        return next;
                      });
                      if (i === 0) setCaptainName(val);
                    }}
                  />
                ))}
              </div>
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
            <p><strong className="text-cream">Tickets:</strong> {playerCount} × {formatCurrency(pricePerPerson)}</p>
            {useSquads && squads.length > 0 ? (
              <div>
                <p className="text-cream"><strong>Squads:</strong></p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {squads.map((s) => (
                    <li key={`${s.name}-${s.color}`}>
                      {s.name} · {s.color} · {s.playerCount} ticket{s.playerCount === 1 ? "" : "s"}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p><strong className="text-cream">Team:</strong> {teamName || "—"} · {teamColor}</p>
            )}
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
