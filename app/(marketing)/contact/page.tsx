import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card } from "@/components/ui/Card";
import { getSiteSettings } from "@/lib/site/getSiteSettings";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { PAGE_HERO_IMAGES, MARKETING_IMAGES } from "@/lib/site/marketingImages";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import type { MarketingSettings } from "@/components/marketing/types";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Questions about booking, corporate events, or custom hunts? Reach the Nashville Scavenger Hunt team.",
  path: "/contact",
});

export default async function ContactPage() {
  const { settings } = await getSiteSettings();
  const s = settings as MarketingSettings;

  return (
    <PageTransition>
      <PageHero
        title="Contact us"
        subtitle="We respond quickly—especially for date changes and corporate groups."
        backgroundImage={PAGE_HERO_IMAGES.contact}
      />
      <div className="site-x page-y mx-auto grid max-w-5xl gap-8 sm:gap-10 lg:grid-cols-3">
        <MarketingPhoto
          src={MARKETING_IMAGES.mapPin.src}
          alt={MARKETING_IMAGES.mapPin.alt}
          aspect="video"
          className="hidden lg:block lg:col-span-3"
          sizes="1024px"
        />
        <Card className="lg:col-span-2">
          <ContactForm defaultEmail={s.email} />
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
