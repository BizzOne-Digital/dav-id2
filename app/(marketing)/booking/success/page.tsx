import { connectDB } from "@/lib/db/connect";
import { Booking } from "@/lib/models/Booking";
import { Team } from "@/lib/models/Team";
import { GameSession } from "@/lib/models/GameSession";
import { PageTransition } from "@/components/motion/PageTransition";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";
import { CopyJoinCodeButton } from "@/components/booking/CopyJoinCodeButton";
import {
  formatPlayDeadline,
  HUNT_PLAY_WINDOW_HOURS,
  resolvePlayExpiresAt,
} from "@/lib/game/playWindow";

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;
  let booking = null;
  let teams: Array<{
    _id: unknown;
    name: string;
    color: string;
    number: number;
    joinCode: string;
  }> = [];
  let sessions: Array<{ _id: unknown; teamId: unknown; sessionCode: string }> = [];

  if (bookingId) {
    try {
      await connectDB();
      booking = await Booking.findById(bookingId).lean();
      if (booking) {
        teams = await Team.find({ bookingId: booking._id }).sort({ number: 1 }).lean();
        if (!teams.length && booking.teamId) {
          const one = await Team.findById(booking.teamId).lean();
          if (one) teams = [one];
        }
        sessions = await GameSession.find({ bookingId: booking._id }).lean();
      }
    } catch {
      /* show generic success */
    }
  }

  const sessionByTeam = new Map(
    sessions.map((s) => [String(s.teamId), s])
  );
  const primarySession = sessions[0];
  const playExpiresAt = booking
    ? resolvePlayExpiresAt(
        {
          playExpiresAt: (primarySession as { playExpiresAt?: Date } | undefined)?.playExpiresAt,
        },
        booking
      )
    : null;
  const playDeadlineLabel = playExpiresAt ? formatPlayDeadline(playExpiresAt) : null;

  return (
    <PageTransition>
      <section className="site-x page-y mx-auto max-w-2xl">
        <div className="text-center">
          <CheckCircle2 className="mx-auto size-16 text-gold" aria-hidden />
          <h1 className="mt-6 font-[family-name:var(--font-bebas)] text-4xl tracking-wide text-cream md:text-5xl">
            You&apos;re booked!
          </h1>
          <p className="mt-3 text-cream/75">
            Your Nashville adventure is confirmed. Save your team details below
            {teams.length > 1 ? "—each squad has its own join code." : "."}
          </p>
          {playDeadlineLabel && (
            <p className="mx-auto mt-4 max-w-md rounded-lg border border-gold/25 bg-gold/5 px-4 py-3 text-sm text-cream/85">
              Play window: {HUNT_PLAY_WINDOW_HOURS} hours from purchase (through{" "}
              <strong className="text-gold">{playDeadlineLabel}</strong>). Join codes stop working after
              that.
            </p>
          )}
        </div>

        <Card className="mt-10 space-y-4">
          {booking?.bookingReference && (
            <p>
              <span className="text-cream/60">Booking reference: </span>
              <strong className="text-gold">{booking.bookingReference}</strong>
            </p>
          )}

          {teams.length > 0 && (
            <div className="space-y-4">
              {teams.map((team) => {
                const session = sessionByTeam.get(String(team._id));
                return (
                  <div
                    key={String(team._id)}
                    className="rounded-lg border border-cream/10 bg-charcoal/30 p-4"
                  >
                    <p>
                      <span className="text-cream/60">Team: </span>
                      <strong>{team.name}</strong> ({team.color}{" "}
                      {String(team.number).padStart(2, "0")})
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-cream/60">Join code: </span>
                      <strong className="text-gold">{team.joinCode}</strong>
                      <CopyJoinCodeButton code={team.joinCode} />
                    </p>
                    {session?.sessionCode ? (
                      <p className="mt-1 text-sm">
                        <span className="text-cream/60">Session: </span>
                        <strong>{session.sessionCode}</strong>
                      </p>
                    ) : null}
                    {session ? (
                      <Button
                        href={`/game/lobby/${String(session._id)}`}
                        variant="secondary"
                        className="mt-3 w-full sm:w-auto"
                      >
                        Open this squad&apos;s lobby
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          <ol className="list-decimal space-y-2 pl-5 text-sm text-cream/80">
            <li>Invite players with the join code or link from your dashboard.</li>
            <li>
              Start and finish within {HUNT_PLAY_WINDOW_HOURS} hours of purchase
              {playDeadlineLabel ? ` (by ${playDeadlineLabel})` : ""}.
            </li>
            <li>Open the game lobby when your group is ready—captain starts the hunt.</li>
            <li>Clues appear one stop at a time on any phone browser.</li>
            {teams.length > 1 && (
              <li>Corporate groups: assign one captain per squad to start their lobby.</li>
            )}
          </ol>
        </Card>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {teams.length === 1 && primarySession ? (
            <Button href={`/game/lobby/${String(primarySession._id)}`} variant="primary">
              Open game lobby
            </Button>
          ) : null}
          <Button href="/dashboard" variant={teams.length === 1 ? "secondary" : "primary"}>
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
