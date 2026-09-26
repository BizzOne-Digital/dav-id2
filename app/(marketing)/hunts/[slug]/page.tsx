import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { RichContent } from "@/components/marketing/RichContent";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models/Hunt";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
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
    if (!hunt) return buildPageMetadata({ title: "Hunt", path: `/hunts/${slug}` });
    return buildPageMetadata({
      title: hunt.seoTitle ?? hunt.title,
      description: hunt.seoDescription ?? hunt.shortDescription ?? undefined,
      path: `/hunts/${slug}`,
    });
  } catch {
    return buildPageMetadata({ title: "Hunt", path: `/hunts/${slug}` });
  }
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

  if (!hunt) notFound();

  const descriptionHtml =
    hunt.fullDescription ??
    `<p>${hunt.shortDescription ?? "A signature Nashville scavenger hunt experience."}</p>`;

  const cover =
    hunt.coverImage ||
    HUNT_CARD_IMAGES[Math.abs(slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % HUNT_CARD_IMAGES.length]
      .src;
  const displayCover = resolvePublicImageUrl(cover);

  return (
    <PageTransition>
      <PageHero
        title={hunt.title}
        subtitle={hunt.shortDescription ?? undefined}
        backgroundImage={{ src: displayCover, alt: hunt.title }}
      />
      <div className="site-x page-y mx-auto max-w-3xl">
        {hunt.gallery?.length ? (
          <div className="mb-10 grid grid-cols-2 gap-3">
            {hunt.gallery.slice(0, 4).map((src) => (
              <div key={src} className="relative aspect-video overflow-hidden rounded-lg">
                <Image src={resolvePublicImageUrl(src)} alt="" fill className="object-cover" sizes="200px" unoptimized={src.startsWith("/api/uploads/")} />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-xl border border-cream/10">
            <Image src={displayCover} alt={hunt.title} fill className="object-cover" sizes="768px" unoptimized={cover.startsWith("/api/uploads/")} />
          </div>
        )}
        <div className="mb-8 flex flex-wrap gap-2">
          {hunt.difficulty && <Badge variant="outline">{hunt.difficulty}</Badge>}
          {hunt.duration && <Badge variant="outline">{hunt.duration}</Badge>}
          {hunt.pricePerPersonCents != null && (
            <Badge>{formatCurrency(hunt.pricePerPersonCents)} per person</Badge>
          )}
        </div>
        <RichContent html={descriptionHtml} />
        {hunt.groupTypes?.length ? (
          <p className="mt-8 text-sm text-cream/60">
            Great for: {hunt.groupTypes.join(", ")}
          </p>
        ) : null}
        <Button href={`/booking?hunt=${hunt.slug}`} variant="primary" className="mt-10">
          Book this hunt
        </Button>
      </div>
    </PageTransition>
  );
}
