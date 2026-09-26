import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TeamSetupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gold hover:underline">
        ← Dashboard
      </Link>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Team & squad setup</CardTitle>
          <CardDescription>
            Team names, colors, and corporate squads are set during booking—before you pay.
          </CardDescription>
        </CardHeader>
        <div className="space-y-4 text-sm text-cream/80">
          <p>
            After checkout, each squad gets an official join code and game lobby automatically. You do not
            need to re-enter names here.
          </p>
          <ul className="list-inside list-disc space-y-2 text-cream/70">
            <li>Solo, couple, friends, and family: one team name and color in step 2.</li>
            <li>Corporate: split tickets across squads—each with its own name, color, and join code.</li>
          </ul>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button href="/booking" variant="primary">
              Continue booking
            </Button>
            <Button href="/how-it-works" variant="secondary">
              How teams work
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
