import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { CmsPage } from "@/components/marketing/CmsPage";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  if (!page) return buildPageMetadata({ title: "About", path: "/about" });
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/about",
  });
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  if (!page) notFound();

  return (
    <PageTransition>
      <CmsPage page={page} slug="about" />
    </PageTransition>
  );
}
