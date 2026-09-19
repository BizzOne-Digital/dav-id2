"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { cartSubtotal, readCart, writeCart, type CartLine } from "@/lib/shop/cart";

export function ShopCart() {
  const [lines, setLines] = useState<CartLine[]>(() => readCart());

  function updateQuantity(productId: string, quantity: number) {
    const next = readCart()
      .map((l) => (l.productId === productId ? { ...l, quantity } : l))
      .filter((l) => l.quantity > 0);
    writeCart(next);
    setLines(next);
  }

  function removeLine(productId: string) {
    const next = readCart().filter((l) => l.productId !== productId);
    writeCart(next);
    setLines(next);
  }

  if (!lines.length) {
    return (
      <Card className="text-center">
        <p className="text-cream/80">Your cart is empty.</p>
        <Button href="/shop" variant="secondary" className="mt-6">
          Browse shop
        </Button>
      </Card>
    );
  }

  const subtotal = cartSubtotal(lines);

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li key={line.productId}>
            <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/shop/${line.slug}`} className="font-semibold text-cream hover:text-gold">
                  {line.title}
                </Link>
                <p className="text-sm text-cream/60">{formatCurrency(line.priceCents)} each</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={line.quantity}
                  onChange={(e) => updateQuantity(line.productId, Number(e.target.value) || 1)}
                  className="w-16 rounded-lg border border-cream/20 bg-charcoal px-2 py-1 text-cream"
                />
                <button
                  type="button"
                  onClick={() => removeLine(line.productId)}
                  className="text-cream/50 hover:text-orange"
                  aria-label="Remove"
                >
                  <Trash2 className="size-5" />
                </button>
                <span className="min-w-[5rem] text-right font-medium text-gold">
                  {formatCurrency(line.priceCents * line.quantity)}
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <Card>
        <p className="text-lg text-cream">
          Subtotal: <span className="font-bold text-gold">{formatCurrency(subtotal)}</span>
        </p>
        <p className="mt-2 text-sm text-cream/50">
          Gift cards and vouchers are fulfilled by email after payment. Contact us for bulk orders.
        </p>
        <Button href="/contact?subject=Shop%20checkout" variant="primary" className="mt-6">
          Request checkout
        </Button>
      </Card>
    </div>
  );
}
