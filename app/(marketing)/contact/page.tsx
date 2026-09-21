import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { HuntTypesGrid } from "@/components/marketing/HuntTypesGrid";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/site/getSiteSettings";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPublicHuntListings } from "@/lib/site/getPublicHuntListings";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";
import { PRICING_HEADLINE } from "@/lib/site/pricingCopy";
import type { MarketingSettings } from "@/components/marketing/types";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Questions about booking, corporate events, or custom hunts? Reach the Nashville Scavenger Hunt team.",
  path: "/contact",
});

export default async function ContactPage() {
  const [{ settings }, hunts] = await Promise.all([getSiteSettings(), getPublicHuntListings()]);
  const s = settings as MarketingSettings;

  return (
    <PageTransition>
      <PageHero
        title="Contact us"
        subtitle="We respond quickly—especially for date changes and corporate groups."
        className="border-b border-cream/10 py-5 sm:py-6"
      />

      <div className="site-x mx-auto max-w-5xl pt-4 sm:pt-5">
        <MarketingPhoto
          src={MARKETING_IMAGES.mapPin.src}
          alt={MARKETING_IMAGES.mapPin.alt}
          aspect="wide"
          priority
          sizes="1024px"
          className="mb-6 sm:mb-8"
        />
      </div>

      <div className="site-x mx-auto max-w-7xl border-b border-cream/10 pb-8 sm:pb-10">
        <SectionHeading
          eyebrow="Experiences"
          title="Our hunt routes"
          subtitle={`Not sure which adventure fits? Browse our signature routes—${PRICING_HEADLINE.toLowerCase()}—then message us below.`}
          className="mb-5 sm:mb-6"
        />
        <HuntTypesGrid hunts={hunts} />
      </div>

      <div className="site-x mx-auto grid max-w-5xl gap-8 pt-6 pb-12 sm:gap-10 sm:pt-8 sm:pb-14 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-cream">Send a message</h2>
          <p className="mt-1 text-sm text-cream/60">Corporate groups, date changes, or custom routes—we&apos;re here to help.</p>
          <div className="mt-6">
            <ContactForm defaultEmail={s.email} />
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-cream">Direct line</h2>
          {s.phone && (
            <p className="mt-4">
              <a href={`tel:${s.phone.replace(/\D/g, "")}`} className="text-gold hover:underline">
                {s.phone}
              </a>
            </p>
          )}
          {s.email && (
            <p className="mt-2">
              <a href={`mailto:${s.email}`} className="text-gold hover:underline">{s.email}</a>
            </p>
          )}
          <p className="mt-6 text-sm text-cream/60">
            Downtown Nashville · Hunt support available on event days.
          </p>
        </Card>
      </div>
    </PageTransition>
  );
}
