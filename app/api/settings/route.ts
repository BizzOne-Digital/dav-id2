import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site/getSiteSettings";
import type { ISiteSettings } from "@/lib/models/SiteSettings";
import type { IPricingPlan } from "@/lib/models/PricingPlan";

export async function GET() {
  try {
    const { settings, pricing } = await getSiteSettings();
    const site = settings as Partial<ISiteSettings>;
    const plan = pricing as Partial<IPricingPlan> | null;

    return NextResponse.json({
      success: true,
      settings: {
        businessName: site.businessName,
        tagline: site.tagline,
        phone: site.phone,
        email: site.email,
        domain: site.domain,
        logoUrl: site.logoUrl,
        faviconUrl: site.faviconUrl,
        brandColors: site.brandColors,
        socialLinks: site.socialLinks,
        hero: site.hero,
        defaultPricePerPersonCents: site.defaultPricePerPersonCents,
        minimumPlayers: site.minimumPlayers,
        typicalDurationHours: site.typicalDurationHours,
        seo: site.seo,
        stats: site.stats,
        newsletterHeading: site.newsletterHeading,
        footerText: site.footerText,
      },
      pricing: plan
        ? {
            name: plan.name,
            slug: plan.slug,
            pricePerPersonCents: plan.pricePerPersonCents,
            currency: plan.currency,
            minimumPlayers: plan.minimumPlayers,
            maximumPlayers: plan.maximumPlayers,
            durationLabel: plan.durationLabel,
            features: plan.features,
            priceType: plan.priceType,
            description: plan.description,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load settings" }, { status: 500 });
  }
}
