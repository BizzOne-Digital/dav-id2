import { connectDB } from "@/lib/db/connect";
import { Hunt, type IHunt } from "@/lib/models/Hunt";
import { catalogHuntsForListing, type PublicHuntListing } from "@/lib/site/huntCatalog";
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

export async function getPublicHuntListings(): Promise<PublicHuntListing[]> {
  try {
    await connectDB();
    const rows = (await Hunt.find({ status: "published" })
      .sort({ featured: -1, title: 1 })
      .lean()) as IHunt[];
    if (rows.length > 0) {
      return rows.map((hunt, index) => dbHuntToListing(hunt, index));
    }
  } catch {
    /* catalog fallback */
  }
  return catalogHuntsForListing();
}
