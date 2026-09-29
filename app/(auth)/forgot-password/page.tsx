import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Password reset by email is not live yet. Create an account with the same email you used when booking, or
          contact us for help.
        </CardDescription>
      </CardHeader>
      <p className="text-sm text-cream/80">
        Use <Link href="/signup" className="text-gold hover:underline">Sign up</Link> with your booking email if you
        have not set a password yet. For help, email{" "}
        <a href="mailto:contact@musiccityscavengerhunt.com" className="text-gold hover:underline">
          contact@musiccityscavengerhunt.com
        </a>
        .
      </p>
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/login" className="text-gold hover:underline">Back to sign in</Link>
      </p>
    </Card>
  );
}
