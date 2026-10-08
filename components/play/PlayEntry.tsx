"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";
import { clearHuntPass, readHuntPass, saveHuntPass, type HuntPass } from "@/lib/play/huntPass";

type Role = "captain" | "teammate";

export function PlayEntry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [savedPass, setSavedPass] = useState<HuntPass | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [joiningFriend, setJoiningFriend] = useState(searchParams.get("teammate") === "1");
  const [displayName, setDisplayName] = useState("");
  const [needsJoin, setNeedsJoin] = useState(false);
  const [lookupMeta, setLookupMeta] = useState<{ sessionId: string; joinCode: string; bookingId?: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showFind, setShowFind] = useState(searchParams.get("find") === "1");
  const [showBkRef, setShowBkRef] = useState(false);
  const [bkRef, setBkRef] = useState("");
  const [email, setEmail] = useState("");
  const [findLoading, setFindLoading] = useState(false);

  useEffect(() => {
    const pass = readHuntPass();
    setSavedPass(pass);
    const fromUrl = searchParams.get("code");
    if (fromUrl) setJoinCode(fromUrl);
    else if (pass?.joinCode) setJoinCode(pass.joinCode);
  }, [searchParams]);

  function persistPass(meta: { sessionId: string; joinCode: string; bookingId?: string; teamName?: string }) {
    if (!meta.bookingId) return;
    saveHuntPass({
      bookingId: meta.bookingId,
      sessionId: meta.sessionId,
      joinCode: meta.joinCode,
      teamName: meta.teamName,
    });
    setSavedPass(readHuntPass());
  }

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    setNeedsJoin(false);
    setLookupMeta(null);

    const raw = joinCode.trim();
    if (/^BK-/i.test(raw)) {
      setError("That’s your receipt number (BK-…), not the hunt code. Use “Email me my page” below, or enter the 6-digit code from your confirmation.");
      setShowFind(true);
      setLoading(false);
      return;
    }

    const role: Role = joiningFriend ? "teammate" : "captain";
    const res = await fetch("/api/play/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode: raw, role }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      error?: string;
      action?: string;
      path?: string | null;
      message?: string;
      sessionId?: string;
      joinCode?: string;
      bookingId?: string;
      teamName?: string;
    };
    setLoading(false);

    if (!res.ok || !data.success) {
      setError(data.error ?? "Could not find that code.");
      return;
    }

    if (data.message) setInfo(data.message);

    if (data.sessionId && data.joinCode) {
      setLookupMeta({
        sessionId: data.sessionId,
        joinCode: data.joinCode,
        bookingId: data.bookingId,
      });
      persistPass({
        sessionId: data.sessionId,
        joinCode: data.joinCode,
        bookingId: data.bookingId,
        teamName: data.teamName,
      });
    }

    if (data.action === "join") {
      setNeedsJoin(true);
      return;
    }

    if (data.path) {
      router.push(data.path);
    }
  }

  async function onJoinTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupMeta) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode: lookupMeta.joinCode, displayName }),
    });
    const data = (await res.json()) as { success?: boolean; error?: string; sessionId?: string };
    setLoading(false);
    if (!res.ok || !data.success) {
      setError(data.error ?? "Could not join team");
      if (data.sessionId) {
        setLookupMeta({ ...lookupMeta, sessionId: data.sessionId });
      }
      return;
    }
    const sid = data.sessionId ?? lookupMeta.sessionId;
    router.push(`/game/lobby/${sid}?code=${encodeURIComponent(lookupMeta.joinCode)}`);
  }

  async function onFindBooking(e: React.FormEvent) {
    e.preventDefault();
    setFindLoading(true);
    setError(null);
    const body = showBkRef && bkRef.trim()
      ? { email, reference: bkRef.trim() }
      : { email };
    const res = await fetch("/api/play/find-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as { success?: boolean; error?: string; bookingId?: string };
    setFindLoading(false);
    if (!res.ok || !data.success || !data.bookingId) {
      setError(data.error ?? "Booking not found");
      return;
    }
    router.push(`/booking/success?bookingId=${data.bookingId}`);
  }

  function openSavedPass() {
    if (!savedPass) return;
    router.push(`/game/lobby/${savedPass.sessionId}?code=${encodeURIComponent(savedPass.joinCode)}`);
  }

  function openConfirmation() {
    if (!savedPass) return;
    router.push(`/booking/success?bookingId=${savedPass.bookingId}`);
  }

  return (
    <div className="space-y-4">
      {savedPass && (
        <div className="rounded-xl border-2 border-gold/55 bg-gold/15 p-4">
          <p className="text-sm font-semibold text-gold">Continue your hunt</p>
          <p className="mt-1 text-sm text-cream/85">
            Code <span className="font-mono font-bold text-cream">{savedPass.joinCode}</span>
            {savedPass.teamName ? ` · ${savedPass.teamName}` : ""}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="primary" className="w-full !text-charcoal sm:flex-1" onClick={openSavedPass}>
              Open game lobby
            </Button>
            <Button type="button" variant="secondary" className="w-full sm:flex-1" onClick={openConfirmation}>
              View confirmation
            </Button>
          </div>
          <button
            type="button"
            className="mt-2 text-xs text-cream/55 underline hover:text-cream/80"
            onClick={() => {
              clearHuntPass();
              setSavedPass(null);
            }}
          >
            Not you? Clear saved hunt
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Go to my hunt</CardTitle>
          <CardDescription>
            One number: your <strong className="text-cream">6-digit code</strong> from checkout (example: 899067). No
            login. Works for {HUNT_PLAY_WINDOW_HOURS} hours after you book.
          </CardDescription>
        </CardHeader>

        {!needsJoin ? (
          <form onSubmit={onContinue} className="space-y-4">
            <Input
              label="6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="899067"
              required
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />

            {joiningFriend ? (
              <p className="rounded-lg border border-cream/15 bg-charcoal/50 px-3 py-2 text-sm text-cream/75">
                Joining a friend&apos;s team — after Continue you&apos;ll add your name.
                <button
                  type="button"
                  className="ml-1 text-gold underline"
                  onClick={() => setJoiningFriend(false)}
                >
                  I&apos;m the one who booked
                </button>
              </p>
            ) : (
              <p className="text-sm text-cream/60">
                Booked the hunt yourself? Just tap Go.{" "}
                <button
                  type="button"
                  className="text-gold underline hover:no-underline"
                  onClick={() => setJoiningFriend(true)}
                >
                  Joining a friend instead
                </button>
              </p>
            )}

            {info && <p className="text-sm text-cream/75">{info}</p>}
            {error && <p className="text-sm text-orange">{error}</p>}

            <Button type="submit" variant="primary" className="w-full !text-charcoal" disabled={loading}>
              {loading ? "One moment…" : "Go"}
            </Button>
          </form>
        ) : (
          <form onSubmit={onJoinTeam} className="space-y-4">
            <p className="text-sm text-cream/80">
              Almost there—enter your name for the scoreboard, then you&apos;ll go to the team lobby.
            </p>
            <Input
              label="Your display name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {error && (
              <div className="space-y-2">
                <p className="text-sm text-orange">{error}</p>
                {lookupMeta && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() =>
                      router.push(
                        `/game/lobby/${lookupMeta.sessionId}?code=${encodeURIComponent(lookupMeta.joinCode)}`
                      )
                    }
                  >
                    Open game lobby instead
                  </Button>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Joining…" : "Join team"}
            </Button>
            <button
              type="button"
              className="w-full text-sm text-cream/60 hover:text-gold"
              onClick={() => {
                setNeedsJoin(false);
                setError(null);
              }}
            >
              ← Back
            </button>
          </form>
        )}
      </Card>

      <Card className="!p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setShowFind((v) => !v)}
        >
          <span className="font-medium text-cream">Don&apos;t have your code?</span>
          <span className="text-sm text-gold">{showFind ? "Hide" : "Email only"}</span>
        </button>
        {showFind && (
          <form onSubmit={onFindBooking} className="mt-4 space-y-3 border-t border-cream/10 pt-4">
            <p className="text-sm text-cream/70">
              Enter the <strong className="text-cream">email you used at checkout</strong>. We&apos;ll open your
              confirmation page with your code and lobby button — no BK number needed.
            </p>
            <Input
              label="Your email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {showBkRef ? (
              <Input
                label="BK reference (only if email alone doesn’t work)"
                placeholder="BK-96D401B3"
                value={bkRef}
                onChange={(e) => setBkRef(e.target.value)}
              />
            ) : (
              <button
                type="button"
                className="text-xs text-cream/55 underline hover:text-cream/80"
                onClick={() => setShowBkRef(true)}
              >
                Add BK reference (optional)
              </button>
            )}
            <Button type="submit" className="w-full" disabled={findLoading}>
              {findLoading ? "One moment…" : "Open my confirmation"}
            </Button>
          </form>
        )}
      </Card>

      <p className="text-center text-sm text-cream/60">
        Optional:{" "}
        <Link href="/login" className="text-gold hover:underline">Sign in</Link> for dashboard &amp; certificates ·{" "}
        <Link href="/booking" className="text-gold hover:underline">Book a new hunt</Link>
      </p>
    </div>
  );
}
