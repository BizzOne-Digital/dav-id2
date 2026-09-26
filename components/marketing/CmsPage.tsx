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
  const textHeroSpacing =
    slug === "about" ? "!py-3 sm:!py-4" : "!py-4 sm:!py-5";
  const compactHero = `!min-h-0 ${textHeroSpacing}`;

  return (
    <>
      <PageHero
        title={page.heroTitle}
        subtitle={page.heroSubtitle || undefined}
        backgroundImage={heroBg}
        className={
          inlineImage
            ? compactHero
            : heroBg
              ? `${compactHero} sm:!min-h-[160px] lg:!min-h-[180px]`
              : compactHero
        }
      />
      {inlineImage ? (
        <div className="site-x mx-auto max-w-3xl pt-2 sm:pt-3">
          <MarketingPhoto
            src={inlineImage.src}
            alt={inlineImage.alt}
            aspect="wide"
            className="mb-5 sm:mb-6"
            sizes="768px"
          />
        </div>
      ) : null}
      <div className="site-x mx-auto max-w-3xl pb-8 pt-1 sm:pb-10 sm:pt-2">
        <RichContent html={page.content} />
      </div>
    </>
  );
}
