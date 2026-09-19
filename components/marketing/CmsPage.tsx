import { PageHero } from "@/components/marketing/PageHero";
import { RichContent } from "@/components/marketing/RichContent";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import type { ResolvedPage } from "@/lib/site/getPageContent";
import { PAGE_HERO_IMAGES, MARKETING_IMAGES } from "@/lib/site/marketingImages";

type CmsPageProps = {
  page: ResolvedPage;
  slug?: string;
};

export function CmsPage({ page, slug }: CmsPageProps) {
  const heroBg = slug ? PAGE_HERO_IMAGES[slug] : undefined;
  const inlineImage =
    slug === "about"
      ? MARKETING_IMAGES.porch
      : slug === "privacy" || slug === "terms"
        ? MARKETING_IMAGES.ryman
        : null;

  return (
    <>
      <PageHero
        title={page.heroTitle}
        subtitle={page.heroSubtitle || undefined}
        backgroundImage={heroBg}
      />
      <div className="site-x page-y mx-auto max-w-3xl">
        {inlineImage && (
          <MarketingPhoto
            src={inlineImage.src}
            alt={inlineImage.alt}
            aspect="video"
            className="mb-10"
            sizes="768px"
          />
        )}
        <RichContent html={page.content} />
      </div>
    </>
  );
}
