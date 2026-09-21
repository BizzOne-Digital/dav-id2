import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>
          {token
            ? "Choose a new password for your account."
            : "This link is invalid or expired. Request a new reset email."}
        </CardDescription>
      </CardHeader>
      {token ? (
        <form action="/api/auth/reset-password" method="post" className="space-y-4">
          <input type="hidden" name="token" value={token} />
          <Input variant="light" label="New password" type="password" name="password" required minLength={8} />
          <Input variant="light" label="Confirm password" type="password" name="confirm" required minLength={8} />
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      ) : (
        <Button href="/forgot-password" variant="secondary" className="w-full">
          Request reset link
        </Button>
      )}
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/login" className="text-gold hover:underline">Back to sign in</Link>
      </p>
    </Card>
  );
}
