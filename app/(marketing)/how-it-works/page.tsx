import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { CmsPage } from "@/components/marketing/CmsPage";
import { HowItWorksJourney } from "@/components/marketing/HowItWorksJourney";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";

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
      <CmsPage page={page} slug="how-it-works" />
      <HowItWorksJourney />
    </PageTransition>
  );
}
