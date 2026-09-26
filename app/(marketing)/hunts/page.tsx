import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { PageTransition } from "@/components/motion/PageTransition";
import { PageHero } from "@/components/marketing/PageHero";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { connectDB } from "@/lib/db/connect";
import { Hunt, type IHunt } from "@/lib/models/Hunt";
import { buildPageMetadata } from "@/lib/site/buildMetadata";
import { formatCurrency } from "@/lib/utils";
import { HUNT_CARD_IMAGES, PAGE_HERO_IMAGES } from "@/lib/site/marketingImages";
import { resolvePublicImageUrl } from "@/lib/uploads/constants";

export const metadata: Metadata = buildPageMetadata({
  title: "Scavenger Hunts",
  description:
    "Browse downtown Nashville scavenger hunts for families, bachelorettes, corporate teams, and date nights.",
  path: "/hunts",
});

export default async function HuntsPage() {
  let hunts: IHunt[] = [];

  try {
    await connectDB();
    hunts = (await Hunt.find({ status: "published" }).sort({ featured: -1, title: 1 }).lean()) as IHunt[];
  } catch {
    hunts = [];
  }

  return (
    <PageTransition>
      <PageHero
        eyebrow="Experiences"
        title="Choose your Nashville hunt"
        subtitle="Every route is walkable, phone-friendly, and packed with Music City stories."
        backgroundImage={PAGE_HERO_IMAGES.hunts}
      />
      <div className="site-x page-y mx-auto max-w-7xl">
        {hunts.length === 0 ? (
          <p className="text-center text-cream/70">Hunts coming soon—check back shortly.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hunts.map((hunt, index) => {
              const fallback = HUNT_CARD_IMAGES[index % HUNT_CARD_IMAGES.length];
              const cover = hunt.coverImage || fallback.src;
              const displayCover = resolvePublicImageUrl(cover);
              const alt = hunt.title;
              return (
                <li key={hunt.slug}>
                  <Link href={`/hunts/${hunt.slug}`} className="group block h-full overflow-hidden rounded-xl">
                    <Card className="h-full overflow-hidden p-0 transition-colors group-hover:border-gold/40">
                      <div className="relative h-48 w-full">
                        <Image
                          src={displayCover}
                          alt={alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="400px"
                          unoptimized={cover.startsWith("/api/uploads/")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <MapPin className="size-4 text-gold" aria-hidden />
                          {hunt.featured && <Badge>Featured</Badge>}
                        </div>
                      </div>
                      <div className="p-5">
                        <CardTitle>{hunt.title}</CardTitle>
                        <CardDescription className="mt-2">{hunt.shortDescription}</CardDescription>
                        <p className="mt-4 text-sm text-cream/60">
                          {hunt.difficulty && <span className="capitalize">{hunt.difficulty}</span>}
                          {hunt.duration && ` · ${hunt.duration}`}
                          {hunt.pricePerPersonCents != null &&
                            ` · ${formatCurrency(hunt.pricePerPersonCents)}/person`}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
