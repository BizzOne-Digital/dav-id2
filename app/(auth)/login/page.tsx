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
    <>
      <Card className="mb-4 border-2 border-gold/40 bg-charcoal/95">
        <CardHeader>
          <CardTitle className="text-gold">Playing the hunt?</CardTitle>
          <CardDescription>
            You do <strong className="text-cream">not</strong> need an account. Use your 6-digit code or recover your
            confirmation page in one step.
          </CardDescription>
        </CardHeader>
        <Button href="/play" variant="primary" className="mx-4 mb-4 w-[calc(100%-2rem)] !text-charcoal">
          Start or resume my hunt
        </Button>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Optional—dashboard, orders, and certificates only.</CardDescription>
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
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Card><CardDescription>Loading…</CardDescription></Card>}>
      <LoginForm />
    </Suspense>
  );
}
