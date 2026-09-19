import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { CmsPage } from "@/components/marketing/CmsPage";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("terms");
  if (!page) return buildPageMetadata({ title: "Terms", path: "/terms" });
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/terms",
  });
}

export default async function TermsPage() {
  const page = await getPageBySlug("terms");
  if (!page) notFound();

  return (
    <PageTransition>
      <CmsPage page={page} slug="terms" />
    </PageTransition>
  );
}
