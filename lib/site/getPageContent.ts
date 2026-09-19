import { connectDB } from "@/lib/db/connect";
import { Page } from "@/lib/models/Content";
import { POLICY_FALLBACKS, type StaticPageContent } from "@/lib/site/policyFallbacks";

export type ResolvedPage = {
  source: "db" | "static";
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  content: string;
};

function fromStatic(page: StaticPageContent): ResolvedPage {
  return {
    source: "static",
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    heroTitle: page.heroTitle,
    heroSubtitle: page.heroSubtitle,
    content: page.content,
  };
}

export async function getPageBySlug(slug: string): Promise<ResolvedPage | null> {
  try {
    await connectDB();
    const page = await Page.findOne({ slug }).lean();
    if (page) {
      return {
        source: "db",
        slug: page.slug,
        title: page.title,
        seoTitle: page.seoTitle ?? page.title,
        seoDescription: page.seoDescription ?? "",
        heroTitle: page.heroTitle ?? page.title,
        heroSubtitle: page.heroSubtitle ?? "",
        content: page.content ?? "",
      };
    }
  } catch {
    // fall through to static
  }

  const fallback = POLICY_FALLBACKS[slug];
  if (fallback) return fromStatic(fallback);
  return null;
}
