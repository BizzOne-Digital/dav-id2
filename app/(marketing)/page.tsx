import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { AdventureSnapshot } from "@/components/marketing/AdventureSnapshot";
import { HowItWorksJourney } from "@/components/marketing/HowItWorksJourney";
import { ExperienceCards } from "@/components/marketing/ExperienceCards";
import { ExploreNashville } from "@/components/marketing/ExploreNashville";
import { ChallengePreview } from "@/components/marketing/ChallengePreview";
import { WhyDifferent } from "@/components/marketing/WhyDifferent";
import { LeaderboardPreview } from "@/components/marketing/LeaderboardPreview";
import { PricingSpotlight } from "@/components/marketing/PricingSpotlight";
import { TestimonialCarousel } from "@/components/marketing/TestimonialCarousel";
import { FaqPreview } from "@/components/marketing/FaqPreview";
import { ReadySetHunt } from "@/components/marketing/ReadySetHunt";
import { NashvilleGalleryStrip } from "@/components/marketing/NashvilleGalleryStrip";
import { PromoFlyerSection } from "@/components/marketing/PromoFlyerSection";
import { DEFAULT_STANDARD_PRICE_CENTS } from "@/lib/pricing/resolve-price";
import { PageTransition } from "@/components/motion/PageTransition";
import { getSiteSettings, getHomepageData } from "@/lib/site/getSiteSettings";
import { buildPageMetadata, settingsToDefaultDescription } from "@/lib/site/buildMetadata";
import type {
  MarketingFaqItem,
  MarketingLeaderboardRow,
  MarketingPricing,
  MarketingSettings,
  MarketingTestimonial,
} from "@/components/marketing/types";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteSettings();
  const s = settings as MarketingSettings & { seo?: { defaultTitle?: string } };
  const title = s.seo?.defaultTitle ?? s.businessName ?? "Nashville Scavenger Hunt";
  return buildPageMetadata({
    title,
    description: settingsToDefaultDescription(s),
    path: "/",
  });
}

export default async function HomePage() {
  const [{ settings, pricing }, homepage] = await Promise.all([getSiteSettings(), getHomepageData()]);
  const marketingSettings = settings as MarketingSettings;
  const marketingPricing = pricing as MarketingPricing | null;

  const faqItems: MarketingFaqItem[] = homepage.faqs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  const testimonialItems: MarketingTestimonial[] = homepage.testimonials.map((t) => ({
    quote: t.quote,
    name: t.name ?? undefined,
    groupType: t.groupType ?? undefined,
    rating: t.rating ?? 5,
  }));

  const leaderboardRows: MarketingLeaderboardRow[] = homepage.leaderboard.map((entry, i) => ({
    rank: entry.rank ?? i + 1,
    name: entry.teamName ?? "Team",
    score: entry.score ?? 0,
    completedStops: entry.completedStops,
  }));

  return (
    <PageTransition>
      <Hero settings={marketingSettings} pricing={marketingPricing} />
      <NashvilleGalleryStrip />
      <PromoFlyerSection
        pricePerPersonCents={
          marketingPricing?.pricePerPersonCents ??
          marketingSettings.defaultPricePerPersonCents ??
          DEFAULT_STANDARD_PRICE_CENTS
        }
      />
      <AdventureSnapshot />
      <HowItWorksJourney />
      <ExperienceCards />
      <ExploreNashville />
      <ChallengePreview />
      <WhyDifferent />
      <LeaderboardPreview teams={leaderboardRows.length ? leaderboardRows : undefined} />
      <PricingSpotlight settings={marketingSettings} pricing={marketingPricing} />
      <TestimonialCarousel testimonials={testimonialItems.length ? testimonialItems : undefined} />
      <FaqPreview items={faqItems.length ? faqItems : undefined} />
      <ReadySetHunt />
    </PageTransition>
  );
}
