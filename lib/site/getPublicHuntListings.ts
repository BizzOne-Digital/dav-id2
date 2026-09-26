import { connectDB } from "@/lib/db/connect";
import { Hunt, type IHunt } from "@/lib/models/Hunt";
import {
  catalogHuntsForListing,
  coverImageForHunt,
  CATALOG_HUNTS,
  type PublicHuntListing,
} from "@/lib/site/huntCatalog";
import { HUNT_CARD_IMAGES } from "@/lib/site/marketingImages";

function dbHuntToListing(hunt: IHunt, index: number): PublicHuntListing {
  const fallback = HUNT_CARD_IMAGES[index % HUNT_CARD_IMAGES.length];
  return {
    title: hunt.title,
    slug: hunt.slug,
    shortDescription: hunt.shortDescription ?? "",
    featured: Boolean(hunt.featured),
    difficulty: (hunt.difficulty as PublicHuntListing["difficulty"]) ?? "moderate",
    groupTypes: hunt.groupTypes ?? [],
    coverImage: hunt.coverImage || fallback.src,
    duration: hunt.duration ?? "2–3 hours",
    pricePerPersonCents: hunt.pricePerPersonCents ?? 2995,
  };
}

/** Catalog order is source of truth (center slot = bachelorette). DB overrides copy when seeded. */
export async function getPublicHuntListings(): Promise<PublicHuntListing[]> {
  const catalog = catalogHuntsForListing();

  try {
    await connectDB();
    const slugs = CATALOG_HUNTS.map((h) => h.slug);
    const rows = (await Hunt.find({ status: "published", slug: { $in: slugs } }).lean()) as IHunt[];
    const bySlug = new Map(rows.map((r) => [r.slug, r]));

    return catalog.map((item, index) => {
      const db = bySlug.get(item.slug);
      if (!db) return item;

      const fromDb = dbHuntToListing(db, index);

      return {
        ...item,
        title: fromDb.title || item.title,
        shortDescription: fromDb.shortDescription || item.shortDescription,
        featured: fromDb.featured,
        difficulty: fromDb.difficulty,
        groupTypes: fromDb.groupTypes.length ? fromDb.groupTypes : item.groupTypes,
        duration: fromDb.duration,
        pricePerPersonCents: fromDb.pricePerPersonCents,
        coverImage:
          item.slug === "bachelorette-downtown" ||
          item.slug === "date-night-discovery" ||
          item.slug === "riverfront-views" ||
          item.slug === "corporate-team-builder"
            ? coverImageForHunt(item, index)
            : fromDb.coverImage || item.coverImage,
      };
    });
  } catch {
    return catalog;
  }
}
