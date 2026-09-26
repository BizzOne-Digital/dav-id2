import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/lib/models/Booking";
import { Team } from "@/lib/models/Team";
import { GameSession } from "@/lib/models/GameSession";
import { PageTransition } from "@/components/motion/PageTransition";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { CopyJoinCodeButton } from "@/components/booking/CopyJoinCodeButton";
import { confirmCheckoutSession } from "@/lib/payments/confirm-checkout-session";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string; session_id?: string }>;
}) {
  const { bookingId, session_id: stripeSessionId } = await searchParams;
  let booking = null;
  let team = null;
  let session = null;

  if (stripeSessionId) {
    try {
      await confirmCheckoutSession(stripeSessionId);
    } catch (err) {
      console.error("[booking/success] Stripe confirm failed", err);
    }
  }

  if (bookingId) {
    try {
      await connectDB();
      booking = await Booking.findById(bookingId).lean();
      if (booking?.teamId) {
        team = await Team.findById(booking.teamId).lean();
        session = await GameSession.findOne({ teamId: booking.teamId }).lean();
      }
    } catch {
      /* show generic success */
    }
  }

  return (
    <PageTransition>
      <section className="site-x page-y mx-auto max-w-2xl">
        <div className="text-center">
          <CheckCircle2 className="mx-auto size-16 text-gold" aria-hidden />
          <h1 className="mt-6 font-[family-name:var(--font-bebas)] text-4xl tracking-wide text-cream md:text-5xl">
            You&apos;re booked!
          </h1>
          <p className="mt-3 text-cream/75">
            Your Nashville adventure is confirmed. Save your team details below.
          </p>
        </div>

        <Card className="mt-10 space-y-4">
          {booking?.bookingReference && (
            <p>
              <span className="text-cream/60">Booking reference: </span>
              <strong className="text-gold">{booking.bookingReference}</strong>
            </p>
          )}
          {team && (
            <>
              <p>
                <span className="text-cream/60">Team: </span>
                <strong>{team.name}</strong> ({team.color} {String(team.number).padStart(2, "0")})
              </p>
              <p className="flex flex-wrap items-center gap-2">
                <span className="text-cream/60">Join code: </span>
                <strong className="text-gold">{team.joinCode}</strong>
                <CopyJoinCodeButton code={team.joinCode} />
              </p>
            </>
          )}
          {session?.sessionCode && (
            <p>
              <span className="text-cream/60">Session: </span>
              <strong>{session.sessionCode}</strong>
            </p>
          )}
          <ol className="list-decimal space-y-2 pl-5 text-sm text-cream/80">
            <li>Invite players with the join code or link from your dashboard.</li>
            <li>Open the game lobby when your start window begins.</li>
            <li>Captain starts the hunt — clues appear one stop at a time.</li>
          </ol>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {session?._id && (
            <Button href={`/game/lobby/${session._id}`} variant="primary">
              Open game lobby
            </Button>
          )}
          <Button href="/dashboard" variant="secondary">
            Go to dashboard
          </Button>
          <Button href="/join" variant="ghost">
            Join as player
          </Button>
        </div>
      </section>
    </PageTransition>
  );
}
