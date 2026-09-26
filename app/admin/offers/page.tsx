"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAdminToast } from "@/components/admin/AdminToastProvider";
import {
  DEFAULT_IN_GAME_OFFERS,
  OFFER_SLOTS,
  type InGameOffersConfig,
  type OfferSlotKey,
} from "@/lib/site/inGameOffers";

type SlotForm = InGameOffersConfig[OfferSlotKey];

export default function AdminOffersPage() {
  const [heading, setHeading] = useState(DEFAULT_IN_GAME_OFFERS.heading);
  const [subtitle, setSubtitle] = useState(DEFAULT_IN_GAME_OFFERS.subtitle);
  const [slots, setSlots] = useState<Record<OfferSlotKey, SlotForm>>({
    discounts: DEFAULT_IN_GAME_OFFERS.discounts,
    coupons: DEFAULT_IN_GAME_OFFERS.coupons,
    prizes: DEFAULT_IN_GAME_OFFERS.prizes,
  });
  const { toastSuccess, toastError } = useAdminToast();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const o = data.settings?.inGameOffers;
        if (!o) return;
        if (o.heading) setHeading(o.heading);
        if (o.subtitle) setSubtitle(o.subtitle);
        setSlots((prev) => ({
          discounts: { ...prev.discounts, ...o.discounts },
          coupons: { ...prev.coupons, ...o.coupons },
          prizes: { ...prev.prizes, ...o.prizes },
        }));
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inGameOffers: {
          heading,
          subtitle,
          discounts: slots.discounts,
          coupons: slots.coupons,
          prizes: slots.prizes,
        },
      }),
    });
    if (res.ok) toastSuccess("In-game offer placements saved");
    else toastError("Save failed");
  }

  function updateSlot(key: OfferSlotKey, patch: Partial<SlotForm>) {
    setSlots((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }

  const labels: Record<OfferSlotKey, string> = {
    discounts: "Discounts",
    coupons: "Coupons",
    prizes: "Prizes",
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">In-game offers</h1>
      <p className="mt-2 text-sm text-cream/60">
        Placeholders on the homepage for partner discounts, coupons, and prizes. Mark &quot;Coming soon&quot; until
        David provides details.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Section intro</CardTitle>
            <CardDescription>Heading above the three cards on the home page.</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            <Input label="Heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
            <label className="block text-sm font-medium text-cream/80">
              Subtitle
              <textarea
                className="mt-1 w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm"
                rows={3}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </label>
          </div>
        </Card>

        {OFFER_SLOTS.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{labels[key]}</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <Input
                label="Title"
                value={slots[key].title}
                onChange={(e) => updateSlot(key, { title: e.target.value })}
              />
              <textarea
                className="w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm"
                rows={3}
                placeholder="Description"
                value={slots[key].description}
                onChange={(e) => updateSlot(key, { description: e.target.value })}
              />
              <Input
                label="Internal note (shown on site as dashed box)"
                value={slots[key].note ?? ""}
                onChange={(e) => updateSlot(key, { note: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slots[key].published !== false}
                  onChange={(e) => updateSlot(key, { published: e.target.checked })}
                />
                Show on website
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={slots[key].comingSoon !== false}
                  onChange={(e) => updateSlot(key, { comingSoon: e.target.checked })}
                />
                Show &quot;Coming soon&quot; badge
              </label>
            </div>
          </Card>
        ))}

        <Button type="submit">Save placements</Button>
      </form>
    </div>
  );
}
