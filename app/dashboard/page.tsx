import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession, Order, Team, Certificate, Hunt } from "@/lib/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  await connectDB();
  const userId = session.user.id;

  const [bookings, orders, teams] = await Promise.all([
    Booking.find({ userId }).sort({ scheduledDate: 1 }).limit(10).lean(),
    Order.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    Team.find({ captainId: userId }).lean(),
  ]);

  const teamIds = teams.map((t) => t._id.toString());
  const sessions = await GameSession.find({ teamId: { $in: teamIds } })
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();

  const huntIds = bookings.map((b) => b.huntId?.toString()).filter(Boolean);
  const hunts = await Hunt.find({ _id: { $in: huntIds } }).select("title slug").lean();
  const huntMap = new Map(hunts.map((h) => [h._id.toString(), h]));

  const sessionIds = sessions.map((s) => s._id);
  const certificates = await Certificate.find({ sessionId: { $in: sessionIds } }).lean();

  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" && new Date(b.scheduledDate) >= new Date()
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Your dashboard</h1>
        <p className="text-cream/70">Hi {session.user.name} — manage hunts, orders, and certificates.</p>
      </header>

      <div className="mb-8 flex flex-wrap gap-3">
        <Button href="/dashboard/orders" variant="secondary">Orders</Button>
        <Button href="/dashboard/certificates" variant="secondary">Certificates</Button>
        <Button href="/team/setup">Team setup</Button>
        <Button href="/join">Join with code</Button>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-cream">Upcoming hunts</h2>
        {upcoming.length === 0 ? (
          <Card>
            <CardDescription>No upcoming hunts yet. Book your Music City adventure from the homepage.</CardDescription>
            <Button href="/" className="mt-4" variant="secondary">Explore hunts</Button>
          </Card>
        ) : (
          <ul className="space-y-4">
            {upcoming.map((booking) => {
              const hunt = huntMap.get(booking.huntId?.toString() ?? "");
              const gameSession = sessions.find(
                (s) => s.bookingId?.toString() === booking._id.toString()
              );
              return (
                <li key={booking._id.toString()}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{hunt?.title ?? "Scavenger hunt"}</CardTitle>
                      <CardDescription>
                        {new Date(booking.scheduledDate).toLocaleDateString()} · {booking.startWindow} ·{" "}
                        {booking.playerCount} players
                      </CardDescription>
                    </CardHeader>
                    {gameSession ? (
                      <Button
                        href={
                          gameSession.status === "lobby"
                            ? `/game/lobby/${gameSession._id}`
                            : `/game/play/${gameSession._id}`
                        }
                      >
                        {gameSession.status === "lobby" ? "Open lobby" : "Continue hunt"}
                      </Button>
                    ) : (
                      <p className="text-sm text-cream/60">Session will appear after payment is confirmed.</p>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold text-cream">Recent orders</h2>
          <Card>
            {orders.length === 0 ? (
              <CardDescription>No orders yet.</CardDescription>
            ) : (
              <ul className="space-y-3 text-sm">
                {orders.map((order) => (
                  <li key={order._id.toString()} className="flex justify-between border-b border-cream/10 pb-2">
                    <span className="text-cream/80">{order.paymentStatus}</span>
                    <span className="font-medium text-gold">{formatCurrency(order.amountCents)}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/dashboard/orders" className="mt-4 inline-block text-sm text-gold hover:underline">
              View all orders →
            </Link>
          </Card>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-cream">Certificates</h2>
          <Card>
            {certificates.length === 0 ? (
              <CardDescription>Finish a hunt to earn your certificate.</CardDescription>
            ) : (
              <ul className="space-y-3 text-sm">
                {certificates.map((cert) => (
                  <li key={cert._id.toString()}>
                    <Link href={`/certificate/${cert.certificateId}`} className="text-gold hover:underline">
                      {cert.teamName ?? "Team"} — {cert.rankTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/dashboard/certificates" className="mt-4 inline-block text-sm text-gold hover:underline">
              All certificates →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
