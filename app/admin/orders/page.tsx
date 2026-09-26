"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type OrderRow = {
  _id: string;
  amountCents: number;
  paymentStatus?: string;
  booking?: { teamName?: string; bookingReference?: string };
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []));
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Orders</h1>
      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li key={o._id}>
            <Card>
              <CardHeader>
                <CardTitle>${(o.amountCents / 100).toFixed(2)}</CardTitle>
                <CardDescription>
                  {o.paymentStatus} · {o.booking?.teamName ?? "—"} · {o.booking?.bookingReference ?? ""}
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
