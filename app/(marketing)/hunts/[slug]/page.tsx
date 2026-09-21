import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { RichContent } from "@/components/marketing/RichContent";
import { MarketingPhoto } from "@/components/marketing/MarketingPhoto";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models/Hunt";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { getCatalogHuntBySlug } from "@/lib/site/huntCatalog";
import { HUNT_CARD_IMAGES } from "@/lib/site/marketingImages";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const hunt = await Hunt.findOne({ slug, status: "published" }).lean();
    if (hunt) {
      return buildPageMetadata({
        title: hunt.seoTitle ?? hunt.title,
        description: hunt.seoDescription ?? hunt.shortDescription ?? undefined,
        path: `/hunts/${slug}`,
      });
    }
  } catch {
    /* fall through to catalog */
  }
  const catalog = getCatalogHuntBySlug(slug);
  if (catalog) {
    return buildPageMetadata({
      title: catalog.title,
      description: catalog.shortDescription,
      path: `/hunts/${slug}`,
    });
  }
  return buildPageMetadata({ title: "Hunt", path: `/hunts/${slug}` });
}

export default async function HuntDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let hunt = null;
  try {
    await connectDB();
    hunt = await Hunt.findOne({ slug, status: "published" }).lean();
  } catch {
    hunt = null;
  }

  const catalog = !hunt ? getCatalogHuntBySlug(slug) : null;
  if (!hunt && !catalog) notFound();

  const title = hunt?.title ?? catalog!.title;
  const shortDescription = hunt?.shortDescription ?? catalog!.shortDescription;
  const difficulty = hunt?.difficulty ?? catalog!.difficulty;
  const duration = hunt?.duration ?? catalog!.duration;
  const pricePerPersonCents = hunt?.pricePerPersonCents ?? catalog!.pricePerPersonCents;
  const groupTypes = hunt?.groupTypes ?? catalog!.groupTypes;
  const huntSlug = hunt?.slug ?? catalog!.slug;

  const descriptionHtml =
    hunt?.fullDescription ??
    `<p>${shortDescription ?? "A signature Nashville scavenger hunt experience."}</p>`;

  const cover =
    hunt?.coverImage ||
    catalog?.coverImage ||
    HUNT_CARD_IMAGES[Math.abs(slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % HUNT_CARD_IMAGES.length]
      .src;

  return (
    <PageTransition>
      <PageHero
        title={title}
        subtitle={shortDescription ?? undefined}
        className="border-b border-cream/10 py-5 sm:py-6"
      />
      <div className="site-x mx-auto max-w-3xl pt-4 pb-12 sm:pt-5 sm:pb-14">
        {hunt?.gallery?.length ? (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:mb-10">
            {hunt.gallery.slice(0, 4).map((src) => (
              <div key={src} className="relative aspect-video overflow-hidden rounded-lg border border-cream/10">
                <Image src={resolvePublicImageUrl(src)} alt="" fill className="object-cover" sizes="200px" unoptimized={src.startsWith("/api/uploads/")} />
              </div>
            ))}
          </div>
        ) : (
          <MarketingPhoto
            src={cover}
            alt={title}
            aspect="wide"
            sizes="768px"
            className="mb-8 sm:mb-10"
          />
        )}
        <div className="mb-8 flex flex-wrap gap-2">
          {difficulty && <Badge variant="outline">{difficulty}</Badge>}
          {duration && <Badge variant="outline">{duration}</Badge>}
          {pricePerPersonCents != null && (
            <Badge>{formatCurrency(pricePerPersonCents)} per person</Badge>
          )}
        </div>
        <RichContent html={descriptionHtml} />
        {groupTypes?.length ? (
          <p className="mt-8 text-sm text-cream/60">
            Great for: {groupTypes.join(", ")}
          </p>
        ) : null}
        <Button href={`/booking?hunt=${huntSlug}`} variant="primary" className="mt-10">
          Book this hunt
        </Button>
      </div>
    </PageTransition>
  );
}
