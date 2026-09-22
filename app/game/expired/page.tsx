import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HUNT_PLAY_WINDOW_HOURS } from "@/lib/game/playWindow";

export default function GameExpiredPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Hunt window ended</CardTitle>
          <CardDescription>
            Your booking had {HUNT_PLAY_WINDOW_HOURS} hours from purchase to join, play, and finish. After
            that, join codes no longer work—perfect for a weekend trip, but this window has closed.
          </CardDescription>
        </CardHeader>
        <Button href="/booking" variant="primary" className="w-full">
          Book a new hunt
        </Button>
        <Button href="/contact" variant="ghost" className="mt-3 w-full">
          Questions? Contact us
        </Button>
      </Card>
      <p className="mt-6 text-center text-sm text-cream/70">
        <Link href="/dashboard" className="text-gold hover:underline">
          Back to dashboard
        </Link>
      </p>
    </div>
  );
}
