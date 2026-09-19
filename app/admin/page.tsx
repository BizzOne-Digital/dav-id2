import { connectDB } from "@/lib/db/connect";
import { Booking, GameSession, Order, Hunt, User } from "@/lib/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = { title: "Admin" };

export default async function AdminDashboardPage() {
  await connectDB();
  const [bookings, orders, sessions, hunts, users] = await Promise.all([
    Booking.countDocuments({ status: "confirmed" }),
    Order.countDocuments({ paymentStatus: "paid" }),
    GameSession.countDocuments({ status: "active" }),
    Hunt.countDocuments({ status: "published" }),
    User.countDocuments(),
  ]);

  const stats = [
    { label: "Confirmed bookings", value: bookings },
    { label: "Paid orders", value: orders },
    { label: "Live sessions", value: sessions },
    { label: "Published hunts", value: hunts },
    { label: "Users", value: users },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Control center</h1>
      <p className="text-cream/70">Operational snapshot for Nashville Scavenger Hunt.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl text-gold">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
