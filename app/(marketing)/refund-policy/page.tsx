import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { CmsPage } from "@/components/marketing/CmsPage";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getPageBySlug } from "@/lib/site/getPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("refund-policy");
  if (!page) return buildPageMetadata({ title: "Refund Policy", path: "/refund-policy" });
  return buildPageMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: "/refund-policy",
  });
}

export default async function RefundPolicyPage() {
  const page = await getPageBySlug("refund-policy");
  if (!page) notFound();

  return (
    <PageTransition>
      <CmsPage page={page} slug="refund-policy" />
    </PageTransition>
  );
}
