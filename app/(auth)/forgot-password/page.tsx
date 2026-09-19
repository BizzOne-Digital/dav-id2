"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send a reset link when email delivery is configured.
        </CardDescription>
      </CardHeader>
      {submitted ? (
        <p className="text-sm text-cream/80">
          If an account exists for <strong className="text-cream">{email}</strong>, you&apos;ll receive
          instructions shortly.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/login" className="text-gold hover:underline">Back to sign in</Link>
      </p>
    </Card>
  );
}
