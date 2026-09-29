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
import { resolvePricePerPersonCents } from "@/lib/pricing/resolve-price";
import {
  bookingPlayerBounds,
  COUPLE_GROUP_TYPE,
  DEFAULT_MIN_PLAYERS,
  fixedTicketCountForGroupType,
  isSoloOrPairGroupType,
  SINGLE_GROUP_TYPE,
  suggestedTicketsForGroupBooking,
  TICKET_ONE_GAME_LINE,
} from "@/lib/site/groupSizeCopy";
import {
  CORPORATE_PRICING_NOTE,
  PRICING_HEADLINE,
  PRICING_SUBLINE,
  pricingTotalLine,
} from "@/lib/site/pricingCopy";
import {
  competitionAllowsMultiSquads,
  defaultPlayFormat,
  playFormatAvailable,
  playFormatLabel,
  PLAY_FORMAT_OPTIONS,
  type PlayFormat,
} from "@/lib/site/playFormat";
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
  validateSquads,
  type SquadPlan,
  type TeamColor,
} from "@/lib/site/teamSetupGuide";
import { TeamSetupGuidePanel } from "@/components/booking/TeamSetupGuidePanel";
import { SquadBuilder } from "@/components/booking/SquadBuilder";
import { TicketCountStepper } from "@/components/booking/TicketCountStepper";
import {
  BOOKING_FLEXIBLE_START_WINDOW,
  BOOKING_PLANNED_DATE_HINT,
  BOOKING_PLAY_WINDOW_SUMMARY,
} from "@/lib/site/bookingFlex";
import { DEFAULT_BOOKING_HUNT_SLUG } from "@/lib/site/huntCatalog";
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

const FORM_FIELD = "light" as const;
const FORM_LABEL = "mb-2 block text-sm font-medium text-cream/85";

const GROUP_TYPES = [
  { value: SINGLE_GROUP_TYPE, label: "Single (1 ticket)" },
  { value: COUPLE_GROUP_TYPE, label: "Couple (2 tickets)" },
  { value: "friends", label: "Group — friends" },
  { value: "family", label: "Group — family" },
  { value: "bachelorette", label: "Group — bachelorette / bachelor" },
  { value: "corporate", label: "Group — corporate" },
  { value: "tourists", label: "Group — visitors / tourists" },
];

type BookingWizardProps = {
  hunts: HuntOption[];
  initialHuntSlug?: string;
};

function clampPlayerCount(count: number, bounds: { min: number; max: number }): number {
  return Math.min(bounds.max, Math.max(bounds.min, count));
}

function resizePlayerRoster(prev: string[], count: number): string[] {
  const next = [...prev];
  while (next.length < count) next.push("");
  return next.slice(0, count);
}

export function BookingWizard({ hunts, initialHuntSlug }: BookingWizardProps) {
  const router = useRouter();
  const defaultSlug =
    initialHuntSlug ??
    hunts.find((h) => h.slug === DEFAULT_BOOKING_HUNT_SLUG)?.slug ??
    hunts[0]?.slug ??
    "";
  const [step, setStep] = useState<Step>("details");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [huntSlug, setHuntSlug] = useState(defaultSlug);
  const [groupType, setGroupType] = useState(SINGLE_GROUP_TYPE);
  const [scheduledDate, setScheduledDate] = useState("");
  const [playerCount, setPlayerCount] = useState(1);

  const [teamName, setTeamName] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [teamColor, setTeamColor] = useState<TeamColor>("GOLD");
  const [emergencyConsent, setEmergencyConsent] = useState(false);
  const [photoMarketingConsent, setPhotoMarketingConsent] = useState(false);
  const [squads, setSquads] = useState<SquadPlan[]>([]);

  const [youngestAge, setYoungestAge] = useState<number | "">("");
  const [accessibilityNotes, setAccessibilityNotes] = useState("");
  const [alcoholFree, setAlcoholFree] = useState(false);
  const [walkingPref, setWalkingPref] = useState("moderate");
  const [playFormat, setPlayFormat] = useState<PlayFormat>("single_group");

  const [playerRoster, setPlayerRoster] = useState<string[]>([""]);

  const hunt = useMemo(
    () => hunts.find((h) => h.slug === huntSlug) ?? hunts[0],
    [hunts, huntSlug]
  );

  const playerBounds = useMemo(
    () => bookingPlayerBounds(groupType, hunt?.minimumPlayers ?? DEFAULT_MIN_PLAYERS),
    [groupType, hunt?.minimumPlayers]
  );

  const resolvedPlayFormat: PlayFormat =
    isSoloOrPairGroupType(groupType) ? "single_group" : playFormat;

  const suggestedTeams = useMemo(
    () => suggestedTeamCount(playerCount, groupType),
    [playerCount, groupType]
  );

  const setupGuide = useMemo(() => getGroupSetupGuide(groupType), [groupType]);
  const showPlayFormatChoice = useMemo(
    () => playFormatAvailable(groupType, playerCount),
    [groupType, playerCount]
  );
  const multiSquadsEnabled = useMemo(
    () => competitionAllowsMultiSquads(resolvedPlayFormat, groupType, playerCount),
    [resolvedPlayFormat, groupType, playerCount]
  );

  const useSquads = resolvedPlayFormat !== "single_group" && multiSquadsEnabled;

  const squadNameDefault = teamName.trim() || defaultSingleSquadName(groupType);

  const effectiveSquads = useMemo(() => {
    if (!useSquads) return [];
    if (squads.length > 0) return squads;
    return buildDefaultSquads(playerCount, suggestedTeams, squadNameDefault, teamColor);
  }, [useSquads, squads, playerCount, suggestedTeams, squadNameDefault, teamColor]);

  const huntMin = hunt?.minimumPlayers ?? DEFAULT_MIN_PLAYERS;

  const onHuntSlugChange = useCallback(
    (slug: string) => {
      setHuntSlug(slug);
      const selected = hunts.find((h) => h.slug === slug);
      const bounds = bookingPlayerBounds(groupType, selected?.minimumPlayers ?? DEFAULT_MIN_PLAYERS);
      setPlayerCount((c) => {
        const next = clampPlayerCount(c, bounds);
        setPlayerRoster((prev) => resizePlayerRoster(prev, next));
        return next;
      });
    },
    [hunts, groupType]
  );

  const onGroupTypeChange = useCallback(
    (value: string) => {
      const prevFixed = fixedTicketCountForGroupType(groupType);
      setGroupType(value);
      setPlayFormat(isSoloOrPairGroupType(value) ? "single_group" : defaultPlayFormat(value));
      setSquads([]);
      const fixedTickets = fixedTicketCountForGroupType(value);
      if (fixedTickets != null) {
        setPlayerCount(fixedTickets);
        setPlayerRoster((prev) => resizePlayerRoster(prev, fixedTickets));
      } else {
        const bounds = bookingPlayerBounds(value, huntMin);
        setPlayerCount((c) => {
          const shouldSuggest =
            prevFixed != null || c <= 2 || c < bounds.min;
          const next = clampPlayerCount(
            shouldSuggest ? suggestedTicketsForGroupBooking(value, huntMin) : c,
            bounds
          );
          setPlayerRoster((prev) => resizePlayerRoster(prev, next));
          return next;
        });
      }
    },
    [huntMin, groupType]
  );

  const onPlayerCountChange = useCallback(
    (raw: number) => {
      if (!Number.isFinite(raw)) return;
      const next = clampPlayerCount(raw, playerBounds);
      setPlayerCount(next);
      setPlayerRoster((prev) => resizePlayerRoster(prev, next));
      const format =
        isSoloOrPairGroupType(groupType) ? "single_group" : playFormat;
      if (format === "single_group") return;
      if (competitionAllowsMultiSquads(format, groupType, next)) {
        setSquads((prev) =>
          buildDefaultSquads(
            next,
            prev.length > 1 ? prev.length : suggestedTeamCount(next, groupType),
            teamName.trim() || defaultSingleSquadName(groupType),
            teamColor
          )
        );
      } else {
        setSquads([]);
      }
    },
    [playerBounds, groupType, playFormat, teamName, teamColor]
  );

  const onPlayFormatSelect = useCallback(
    (format: PlayFormat) => {
      setPlayFormat(format);
      if (format === "single_group") {
        setSquads([]);
        return;
      }
      if (competitionAllowsMultiSquads(format, groupType, playerCount)) {
        setSquads(
          buildDefaultSquads(
            playerCount,
            suggestedTeamCount(playerCount, groupType),
            teamName.trim() || defaultSingleSquadName(groupType),
            teamColor
          )
        );
      } else {
        setSquads([]);
      }
    },
    [groupType, playerCount, teamName, teamColor]
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
        startWindow: BOOKING_FLEXIBLE_START_WINDOW,
        playerCount,
        playFormat: resolvedPlayFormat,
        playerRoster: playerRoster.map((n) => n.trim()).filter(Boolean),
        teamName: useSquads && effectiveSquads[0] ? effectiveSquads[0].name : teamName || undefined,
        captainName: captainName || undefined,
        captainEmail: captainEmail || undefined,
        captainPhone: captainPhone || undefined,
        teamColor: useSquads && effectiveSquads[0] ? effectiveSquads[0].color : teamColor,
        squads: useSquads ? effectiveSquads : undefined,
        emergencyConsent,
        photoMarketingConsent,
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
      resolvedPlayFormat,
      scheduledDate,
      playerCount,
      teamName,
      captainName,
      captainEmail,
      captainPhone,
      teamColor,
      useSquads,
      effectiveSquads,
      playerRoster,
      emergencyConsent,
      photoMarketingConsent,
      youngestAge,
      accessibilityNotes,
      alcoholFree,
      walkingPref,
    ]
  );

  async function goNext() {
    setError(null);
    if (step === "details") {
      if (!huntSlug || !hunts.length) {
        setError("No hunt is selected. Go back to Hunts and choose an experience.");
        return;
      }
    }
    if (step === "team") {
      if (!captainEmail.trim()) {
        setError("Captain email is required so we can send join codes and receipts.");
        return;
      }
      if (useSquads) {
        const squadErr = validateSquads(effectiveSquads, playerCount);
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

      <Card className="sm:p-8">
        {step === "details" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-cream">Hunt details</h2>
            <div>
              <label className={FORM_LABEL}>Hunt</label>
              <Select
                variant={FORM_FIELD}
                value={huntSlug}
                options={hunts.map((h) => ({ value: h.slug, label: h.title }))}
                onChange={(e) => onHuntSlugChange(e.target.value)}
              />
            </div>
            <div>
              <label className={FORM_LABEL}>Single, couple, or group</label>
              <Select
                variant={FORM_FIELD}
                value={groupType}
                options={GROUP_TYPES}
                onChange={(e) => onGroupTypeChange(e.target.value)}
              />
              <p className="mt-2 text-xs font-medium text-gold">{TICKET_ONE_GAME_LINE}</p>
            </div>
            <p className="rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-cream/85">
              {BOOKING_PLAY_WINDOW_SUMMARY}
            </p>
            <div>
              <label className={FORM_LABEL}>
                Planned visit date <span className="font-normal text-cream/50">(optional)</span>
              </label>
              <Input
                variant={FORM_FIELD}
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
              <p className="mt-1 text-xs text-cream/55">
                For our planning only—your clock starts when you complete checkout. {BOOKING_PLANNED_DATE_HINT}
              </p>
            </div>
            <div>
              <label className={FORM_LABEL}>Tickets (players)</label>
              {fixedTicketCountForGroupType(groupType) != null ? (
                <p className="rounded-xl border border-cream/20 bg-white px-4 py-3 text-sm text-charcoal">
                  <strong className="text-gold">{playerCount}</strong> ticket{playerCount === 1 ? "" : "s"} —{" "}
                  {groupType === SINGLE_GROUP_TYPE
                    ? "solo hunt game"
                    : "one shared hunt game for two"}
                </p>
              ) : (
                <>
                  <TicketCountStepper
                    value={playerCount}
                    min={playerBounds.min}
                    max={playerBounds.max}
                    onChange={onPlayerCountChange}
                  />
                  <p className="mt-2 text-xs text-cream/55">
                    Tap + or − anytime—one team, one join code; add a ticket for each player (
                    {formatCurrency(pricePerPerson)} each).
                  </p>
                </>
              )}
            </div>

            {showPlayFormatChoice ? (
              <div>
                <p className="mb-2 block text-sm font-medium text-cream/90">How do you want to play?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PLAY_FORMAT_OPTIONS.map((option) => {
                    const selected = resolvedPlayFormat === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onPlayFormatSelect(option.value)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition-colors",
                          selected
                            ? "border-gold bg-gold/10 ring-1 ring-gold/40"
                            : "border-cream/15 bg-cream/5 hover:border-cream/25"
                        )}
                      >
                        <p className="font-semibold text-cream">{option.title}</p>
                        <p className="mt-1 text-xs text-cream/70">{option.summary}</p>
                        <p className="mt-2 text-xs text-cream/55">{option.detail}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : isSoloOrPairGroupType(groupType) ? (
              <p className="text-xs text-cream/55">
                {groupType === SINGLE_GROUP_TYPE
                  ? "One player forms one team and receives one join code for the leaderboard."
                  : "One team, one join code—couples buy two tickets (one per player)."}
              </p>
            ) : (
              <p className="text-xs text-cream/55">
                Playing as one squad? Keep tickets equal to your group size. Need competing teams? Choose competition
                above when available.
              </p>
            )}

            <div className="rounded-xl border border-cream/10 bg-charcoal/40 p-4">
              <p className="text-lg font-semibold text-gold">{PRICING_HEADLINE}</p>
              <p className="mt-1 text-sm text-cream/65">{PRICING_SUBLINE}</p>
              <p className="mt-3 text-sm text-cream/80">
                {pricingTotalLine(pricePerPerson, playerCount)} ={" "}
                <span className="font-semibold text-gold">{formatCurrency(estimatedTotal)}</span>
              </p>
              {groupType === "corporate" && (
                <p className="mt-2 text-xs leading-relaxed text-cream/50">{CORPORATE_PRICING_NOTE}</p>
              )}
            </div>
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
            <TeamSetupGuidePanel groupType={groupType} guide={setupGuide} tone="dark" />
            <p className="text-sm text-cream/70">
              {playerCount} ticket{playerCount === 1 ? "" : "s"} purchased — one certificate per ticket at the finish line.
            </p>
            <p className="text-sm text-cream/75">
              <strong className="text-cream">Play format:</strong> {playFormatLabel(resolvedPlayFormat)}
              {resolvedPlayFormat === "competition" && !multiSquadsEnabled && (
                <span className="text-cream/65">
                  {" "}
                  — one squad on the city leaderboard; add players or choose corporate to split squads.
                </span>
              )}
            </p>

            {useSquads ? (
              <SquadBuilder
                squads={effectiveSquads}
                requiredTickets={playerCount}
                onChange={setSquads}
                fieldVariant={FORM_FIELD}
              />
            ) : (
              <>
                <Input
                  variant={FORM_FIELD}
                  placeholder={defaultSingleSquadName(groupType)}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  aria-label="Team name"
                />
                <div>
                  <label className={FORM_LABEL}>Team color (competitor ID)</label>
                  <Select
                    variant={FORM_FIELD}
                    value={teamColor}
                    options={TEAM_COLORS.map((c) => ({ value: c, label: c }))}
                    onChange={(e) => setTeamColor(e.target.value as TeamColor)}
                  />
                </div>
              </>
            )}

            <Input
              variant={FORM_FIELD}
              placeholder="Captain name"
              value={captainName}
              onChange={(e) => {
                const val = e.target.value;
                setCaptainName(val);
                setPlayerRoster((prev) => {
                  if (prev[0] === val) return prev;
                  const next = [...prev];
                  next[0] = val;
                  return next;
                });
              }}
            />
            <Input
              variant={FORM_FIELD}
              type="email"
              placeholder="Captain email"
              required
              value={captainEmail}
              onChange={(e) => setCaptainEmail(e.target.value)}
            />
            <Input
              variant={FORM_FIELD}
              type="tel"
              placeholder="Captain phone"
              value={captainPhone}
              onChange={(e) => setCaptainPhone(e.target.value)}
            />

            {resolvedPlayFormat === "competition" && multiSquadsEnabled && (
              <p className="rounded-lg border border-cream/10 bg-cream/5 px-3 py-2 text-xs text-cream/75">
                {suggestedTeams} squads suggested for {playerCount} tickets—adjust names, colors, and ticket split below.
              </p>
            )}

            <div>
              <p className="mb-2 text-sm font-medium text-cream/80">Player names (optional, for certificates)</p>
              <div className="space-y-2">
                {playerRoster.map((name, i) => (
                  <Input
                    variant={FORM_FIELD}
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
            <label className="flex items-start gap-3 text-sm text-cream/80">
              <input
                type="checkbox"
                className="mt-1"
                checked={photoMarketingConsent}
                onChange={(e) => setPhotoMarketingConsent(e.target.checked)}
              />
              Optional: I agree my hunt photos and videos may be used in Music City Scavenger Hunt marketing.
            </label>
          </div>
        )}

        {step === "preferences" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-cream">Preferences</h2>
            <div>
              <label className={FORM_LABEL}>Youngest player age (optional)</label>
              <Input
                variant={FORM_FIELD}
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
              <label className={FORM_LABEL}>Walking pace</label>
              <Select
                variant={FORM_FIELD}
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
              variant={FORM_FIELD}
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
            <p><strong className="text-cream">When to play:</strong> {BOOKING_PLAY_WINDOW_SUMMARY}</p>
            {scheduledDate ? (
              <p><strong className="text-cream">Planned visit:</strong> {scheduledDate}</p>
            ) : null}
            <p><strong className="text-cream">Group:</strong> {GROUP_TYPES.find((g) => g.value === groupType)?.label ?? groupType}</p>
            <p><strong className="text-cream">Play format:</strong> {playFormatLabel(resolvedPlayFormat)}</p>
            <p><strong className="text-cream">Tickets:</strong> {playerCount} ({TICKET_ONE_GAME_LINE})</p>
            <p><strong className="text-cream">Rate:</strong> {formatCurrency(pricePerPerson)} / person</p>
            <p><strong className="text-cream">Tickets:</strong> {playerCount} × {formatCurrency(pricePerPerson)}</p>
            {useSquads && effectiveSquads.length > 0 ? (
              <div>
                <p className="text-cream"><strong>Squads:</strong></p>
                <ul className="mt-1 list-inside list-disc text-sm">
                  {effectiveSquads.map((s) => (
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
            <Button type="button" variant="ghost" onClick={goBack}
              disabled={stepIndex === 0}
            >
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
