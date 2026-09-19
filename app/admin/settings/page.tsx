"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LocalImageField } from "@/components/admin/LocalImageField";
import { useAdminToast } from "@/components/admin/AdminToastProvider";

type SettingsForm = {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  minimumPlayers: number;
  typicalDurationHours: string;
  logoUrl: string;
  footerText: string;
  newsletterHeading: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroBackgroundImage: string;
};

const emptyForm: SettingsForm = {
  businessName: "",
  tagline: "",
  phone: "",
  email: "",
  minimumPlayers: 1,
  typicalDurationHours: "2–3",
  logoUrl: "",
  footerText: "",
  newsletterHeading: "",
  heroHeadline: "",
  heroSubheadline: "",
  heroCtaPrimary: "Book Your Hunt",
  heroCtaSecondary: "Preview a Challenge",
  heroBackgroundImage: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(emptyForm);
  const { toastSuccess, toastError } = useAdminToast();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          setForm({
            businessName: s.businessName ?? "",
            tagline: s.tagline ?? "",
            phone: s.phone ?? "",
            email: s.email ?? "",
            minimumPlayers: s.minimumPlayers ?? 1,
            typicalDurationHours: s.typicalDurationHours ?? "2–3",
            logoUrl: s.logoUrl ?? "",
            footerText: s.footerText ?? "",
            newsletterHeading: s.newsletterHeading ?? "",
            heroHeadline: s.hero?.headline ?? "",
            heroSubheadline: s.hero?.subheadline ?? "",
            heroCtaPrimary: s.hero?.ctaPrimary ?? "Book Your Hunt",
            heroCtaSecondary: s.hero?.ctaSecondary ?? "Preview a Challenge",
            heroBackgroundImage: s.hero?.backgroundImage ?? "",
          });
        }
      });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: form.businessName,
        tagline: form.tagline,
        phone: form.phone,
        email: form.email,
        minimumPlayers: form.minimumPlayers,
        typicalDurationHours: form.typicalDurationHours,
        logoUrl: form.logoUrl,
        footerText: form.footerText,
        newsletterHeading: form.newsletterHeading,
        hero: {
          headline: form.heroHeadline,
          subheadline: form.heroSubheadline,
          ctaPrimary: form.heroCtaPrimary,
          ctaSecondary: form.heroCtaSecondary,
          backgroundImage: form.heroBackgroundImage,
        },
      }),
    });
    if (res.ok) toastSuccess("Settings saved — refresh the public site to see updates");
    else toastError("Save failed");
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-[family-name:var(--font-bebas)] text-4xl text-gold">Site settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Business profile</CardTitle>
          <CardDescription>Logo, contact info, and footer copy on the marketing site.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <LocalImageField
            label="Site logo"
            folder="pages"
            value={form.logoUrl}
            onChange={(logoUrl) => setForm({ ...form, logoUrl })}
          />
          <Input
            label="Business name"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          />
          <Input
            label="Tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Minimum players"
            type="number"
            value={form.minimumPlayers}
            onChange={(e) => setForm({ ...form, minimumPlayers: Number(e.target.value) })}
          />
          <Input
            label="Typical duration (hours label)"
            value={form.typicalDurationHours}
            onChange={(e) => setForm({ ...form, typicalDurationHours: e.target.value })}
          />
          <Input
            label="Footer text"
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
          />
          <Input
            label="Newsletter heading"
            value={form.newsletterHeading}
            onChange={(e) => setForm({ ...form, newsletterHeading: e.target.value })}
          />

          <CardHeader className="px-0 pt-4">
            <CardTitle className="text-lg">Homepage hero</CardTitle>
            <CardDescription>Headline, buttons, and optional background image.</CardDescription>
          </CardHeader>
          <LocalImageField
            label="Hero background"
            folder="pages"
            value={form.heroBackgroundImage}
            onChange={(heroBackgroundImage) => setForm({ ...form, heroBackgroundImage })}
          />
          <Input
            label="Hero headline"
            value={form.heroHeadline}
            onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
          />
          <label className="block text-sm font-medium text-cream/80">
            Hero subheadline
            <textarea
              className="mt-1 w-full rounded-lg border border-cream/20 bg-charcoal/80 px-3 py-2 text-sm text-cream"
              rows={3}
              value={form.heroSubheadline}
              onChange={(e) => setForm({ ...form, heroSubheadline: e.target.value })}
            />
          </label>
          <Input
            label="Primary CTA label"
            value={form.heroCtaPrimary}
            onChange={(e) => setForm({ ...form, heroCtaPrimary: e.target.value })}
          />
          <Input
            label="Secondary CTA label"
            value={form.heroCtaSecondary}
            onChange={(e) => setForm({ ...form, heroCtaSecondary: e.target.value })}
          />

          <Button type="submit">Save settings</Button>
        </form>
      </Card>
    </div>
  );
}
