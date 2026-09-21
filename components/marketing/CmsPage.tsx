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
  const inlineImage =
    slug === "about"
      ? MARKETING_IMAGES.porch
      : slug === "privacy" || slug === "terms"
        ? MARKETING_IMAGES.ryman
        : null;

  const heroBg = inlineImage ? undefined : slug ? PAGE_HERO_IMAGES[slug] : undefined;

  return (
    <>
      <PageHero
        title={page.heroTitle}
        subtitle={page.heroSubtitle || undefined}
        backgroundImage={heroBg}
        className={
          inlineImage || heroBg
            ? inlineImage
              ? "border-b border-cream/10 py-5 sm:py-6"
              : undefined
            : "border-b border-cream/10 py-5 sm:py-6"
        }
      />
      {inlineImage ? (
        <div className="site-x mx-auto max-w-3xl pt-4 sm:pt-5">
          <MarketingPhoto
            src={inlineImage.src}
            alt={inlineImage.alt}
            aspect="wide"
            className="mb-8 sm:mb-10"
            sizes="768px"
          />
        </div>
      ) : null}
      <div className="site-x mx-auto max-w-3xl pb-12 pt-4 sm:pb-14 sm:pt-6">
        <RichContent html={page.content} />
      </div>
    </>
  );
}
