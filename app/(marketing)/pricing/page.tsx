import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { PricingCalculator } from "@/components/pricing/PricingCalculator";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { connectDB } from "@/lib/db/connect";
import { PricingPlan, type IPricingPlan } from "@/lib/models/PricingPlan";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { formatCurrency } from "@/lib/utils";
import { PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";

export const metadata: Metadata = buildPageMetadata({
  title: "Pricing",
  description: "Transparent per-person pricing for Nashville scavenger hunts. Minimum group sizes and features included.",
  path: "/pricing",
});

export default async function PricingPage() {
  let plans: IPricingPlan[] = [];

  try {
    await connectDB();
    plans = (await PricingPlan.find({ active: true }).sort({ isDefault: -1, name: 1 }).lean()) as IPricingPlan[];
  } catch {
    plans = [];
  }

  const calculatorPlans = plans.map((p) => ({
    id: String(p._id),
    name: p.name,
    pricePerPersonCents: p.pricePerPersonCents,
    minimumPlayers: p.minimumPlayers,
    maximumPlayers: p.maximumPlayers ?? undefined,
    durationLabel: p.durationLabel,
    features: p.features,
  }));

  const defaultPlan = plans.find((p) => p.isDefault) ?? plans[0];

  return (
    <PageTransition>
      <PageHero
        eyebrow="Simple pricing"
        title="One price per player, all the fun included"
        subtitle="No hidden fees for standard downtown hunts. Use the calculator for your group total."
        backgroundImage={PAGE_HERO_IMAGES.pricing}
      />
      <div className="site-x page-y mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            {plans.length === 0 ? (
              <Card>
                <CardTitle>Standard hunt</CardTitle>
                <CardDescription className="mt-2">$50 per person · 4 player minimum · 2–3 hours</CardDescription>
              </Card>
            ) : (
              plans.map((plan) => (
                <Card key={String(plan._id)} className={plan.isDefault ? "border-gold/30" : undefined}>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="mt-2 text-2xl font-bold text-gold">
                    {formatCurrency(plan.pricePerPersonCents)}
                    <span className="text-base font-normal text-cream/60"> / person</span>
                  </p>
                  {plan.description && <CardDescription className="mt-2">{plan.description}</CardDescription>}
                  <ul className="mt-4 space-y-2">
                    {(plan.features ?? []).map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-cream/80">
                        <Check className="size-4 shrink-0 text-gold" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))
            )}
          </div>
          <PricingCalculator
            plans={
              calculatorPlans.length
                ? calculatorPlans
                : [
                    {
                      id: "default",
                      name: "Standard Hunt",
                      pricePerPersonCents: 5000,
                      minimumPlayers: 4,
                      durationLabel: "2–3 hours",
                    },
                  ]
            }
            defaultPlanId={defaultPlan ? String(defaultPlan._id) : "default"}
          />
        </div>
      </div>
    </PageTransition>
  );
}
