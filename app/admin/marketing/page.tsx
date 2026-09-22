"use client";

import { useState } from "react";
import { LAUNCH_CHECKLIST } from "@/lib/marketing/launchChecklist";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const STORAGE_KEY = "nashville-launch-checklist-v1";

export default function AdminMarketingPage() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  function toggle(id: string) {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Marketing & launch</h1>
      <p className="mt-2 max-w-2xl text-sm text-cream/70">
        Client launch checklist — dry run, test video crew, materials, partners, social, QR, and virtual brochure.
        Progress saves in this browser only.
      </p>

      <ul className="mt-8 space-y-3">
        {LAUNCH_CHECKLIST.map((item) => (
          <li key={item.id}>
            <Card className={done[item.id] ? "border-gold/40 bg-gold/5" : undefined}>
              <CardHeader className="flex flex-row items-start gap-4">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-gold"
                  checked={!!done[item.id]}
                  onChange={() => toggle(item.id)}
                  aria-label={`Mark ${item.title} complete`}
                />
                <div>
                  <CardTitle className="text-base text-cream">{item.title}</CardTitle>
                  <p className="mt-1 text-xs uppercase tracking-wider text-cream/45">{item.category}</p>
                  <p className="mt-2 text-sm text-cream/75">{item.detail}</p>
                </div>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-cream/50">
        Quick links:{" "}
        <a href="/book-qr" className="text-gold hover:underline" target="_blank" rel="noreferrer">
          /book-qr
        </a>
        {" · "}
        <a href="/brochure" className="text-gold hover:underline" target="_blank" rel="noreferrer">
          /brochure
        </a>
      </p>
    </div>
  );
}
