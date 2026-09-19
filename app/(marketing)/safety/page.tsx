import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { CmsPage } from "@/components/marketing/CmsPage";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("safety");
  if (!page) return buildPageMetadata({ title: "Safety", path: "/safety" });
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/safety",
  });
}

export default async function SafetyPage() {
  const page = await getPageBySlug("safety");
  if (!page) notFound();

  return (
    <PageTransition>
      <CmsPage page={page} slug="safety" />
    </PageTransition>
  );
}
