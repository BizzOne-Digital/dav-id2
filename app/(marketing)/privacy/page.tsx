import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { CmsPage } from "@/components/marketing/CmsPage";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("privacy");
  if (!page) return buildPageMetadata({ title: "Privacy", path: "/privacy" });
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("privacy");
  if (!page) notFound();

  return (
    <PageTransition>
      <CmsPage page={page} slug="privacy" />
    </PageTransition>
  );
}
