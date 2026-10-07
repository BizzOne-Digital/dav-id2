"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      setError(
        result.error === "Configuration"
          ? "Sign-in is not configured on the server yet. Please contact support."
          : "Invalid email or password"
      );
      return;
    }
    window.location.href = callbackUrl;
  }

  return (
    <Card>
      <div className="mb-6 rounded-xl border-2 border-gold/50 bg-gold/10 p-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold">Already booked?</p>
        <p className="mt-2 text-sm leading-relaxed text-cream/90">
          You don&apos;t need to sign in to play. Use your <strong className="text-cream">6-digit join code</strong>{" "}
          (extra players) or open the lobby from your confirmation page (captain / solo).
        </p>
        <Button href="/join" variant="primary" className="mt-4 w-full !text-charcoal">
          Join with 6-digit code
        </Button>
        <p className="mt-3 text-xs text-cream/65">
          Captain or 1 ticket? Reopen your <strong className="text-cream/80">You&apos;re booked!</strong> tab and tap{" "}
          <strong className="text-cream/80">Open game lobby</strong>—not Join.
        </p>
      </div>
      <CardHeader className="!pt-0">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in only if you want your dashboard and certificates. Playing the hunt does not require an account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          variant="light"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          variant="light"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-orange">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/forgot-password" className="text-gold hover:underline">
          Forgot password?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-cream/70">
        No account?{" "}
        <Link href="/signup" className="text-gold hover:underline">
          Create one
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Card><CardDescription>Loading…</CardDescription></Card>}>
      <LoginForm />
    </Suspense>
  );
}
