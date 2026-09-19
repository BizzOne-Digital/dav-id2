import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db/connect";
import { Order, Booking } from "@/lib/models";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/dashboard/orders");

  await connectDB();
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  const bookings = await Booking.find({
    _id: { $in: orders.map((o) => o.bookingId?.toString()).filter(Boolean) },
  }).lean();
  const bookingMap = new Map(bookings.map((b) => [b._id.toString(), b]));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gold hover:underline">← Dashboard</Link>
      <h1 className="mt-4 font-[family-name:var(--font-bebas)] text-4xl text-gold">Orders</h1>
      {orders.length === 0 ? (
        <Card className="mt-6">
          <CardDescription>No orders on file.</CardDescription>
        </Card>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => {
            const booking = bookingMap.get(order.bookingId?.toString() ?? "");
            return (
              <li key={order._id.toString()}>
                <Card>
                  <CardHeader>
                    <CardTitle>{formatCurrency(order.amountCents, order.currency?.toUpperCase() ?? "USD")}</CardTitle>
                    <CardDescription>
                      {order.paymentStatus} · {new Date(order.createdAt).toLocaleString()}
                      {booking?.bookingReference ? ` · Ref ${booking.bookingReference}` : ""}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
