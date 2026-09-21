import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { RichContent } from "@/components/marketing/RichContent";
import { HowItWorksJourney } from "@/components/marketing/HowItWorksJourney";
import { TeamsAndGroupsSection } from "@/components/marketing/TeamsAndGroupsSection";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";
import { MARKETING_IMAGES } from "@/lib/site/marketingImages";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("how-it-works");
  if (!page) return buildPageMetadata({ title: "How It Works", path: "/how-it-works" });
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/how-it-works",
  });
}

export default async function HowItWorksPage() {
  const page = await getPageBySlug("how-it-works");
  if (!page) notFound();

  return (
    <PageTransition>
      <PageHero
        title={page.heroTitle}
        subtitle={page.heroSubtitle || undefined}
        className="border-b border-cream/10 py-5 sm:py-6"
      />

      <div className="site-x mx-auto max-w-5xl pt-4 sm:pt-5">
        <MarketingPhoto
          src={MARKETING_IMAGES.flatlay.src}
          alt={MARKETING_IMAGES.flatlay.alt}
          aspect="wide"
          priority
          sizes="1024px"
          className="mb-4 sm:mb-5"
        />
      </div>

      <div className="site-x mx-auto max-w-3xl border-b border-cream/10 pb-6 pt-0 text-center sm:pb-8">
        <RichContent html={page.content} className="prose-p:mx-auto prose-p:max-w-2xl" />
      </div>

      <HowItWorksJourney showHeading={false} spacing="tight" />
      <TeamsAndGroupsSection spacing="tight" />
    </PageTransition>
  );
}
