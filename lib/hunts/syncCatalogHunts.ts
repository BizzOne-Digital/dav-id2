import { connectDB } from "@/lib/db/connect";
import { Hunt } from "@/lib/models/Hunt";
import { PricingPlan } from "@/lib/models/PricingPlan";
import {
  CATALOG_HUNTS,
  CATALOG_HUNT_COVER_PATHS,
  coverImageForHunt,
} from "@/lib/site/huntCatalog";

/** Idempotent: ensures every catalog hunt exists as published (same as seed). */
export async function syncCatalogHuntsToDb(): Promise<void> {
  await connectDB();

  const plan = await PricingPlan.findOne({ isDefault: true, active: true }).lean();
  const pricingPlanId = plan?._id;

  for (let i = 0; i < CATALOG_HUNTS.length; i++) {
    const hunt = CATALOG_HUNTS[i];
    const cover = coverImageForHunt(hunt, i);
    await Hunt.findOneAndUpdate(
      { slug: hunt.slug },
      {
        title: hunt.title,
        slug: hunt.slug,
        shortDescription: hunt.shortDescription,
        featured: hunt.featured,
        difficulty: hunt.difficulty,
        groupTypes: hunt.groupTypes,
        coverImage: cover,
        gallery: [cover, CATALOG_HUNT_COVER_PATHS[(i + 1) % CATALOG_HUNT_COVER_PATHS.length]],
        fullDescription: hunt.shortDescription,
        priceType: "per_person",
        pricePerPersonCents: 2995,
        minimumPlayers: 1,
        duration: "2–3 hours",
        alcoholFreeAvailable: true,
        includedRewards: ["Leaderboard ranking", "Digital certificate"],
        status: "published",
        ...(pricingPlanId ? { pricingPlanId } : {}),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

export type BookableHuntOption = {
  id: string;
  slug: string;
  title: string;
  minimumPlayers: number;
  pricePerPersonCents: number;
};

export async function getBookableHunts(): Promise<BookableHuntOption[]> {
  let defaultPrice = 2995;

  try {
    await syncCatalogHuntsToDb();
    const plan = await PricingPlan.findOne({ isDefault: true, active: true }).lean();
    if (plan?.pricePerPersonCents) defaultPrice = plan.pricePerPersonCents;

    const rows = await Hunt.find({ status: "published" }).sort({ featured: -1, title: 1 }).lean();
    if (rows.length > 0) {
      return rows.map((h) => ({
        id: String(h._id),
        slug: h.slug,
        title: h.title,
        minimumPlayers: h.minimumPlayers ?? 1,
        pricePerPersonCents: h.pricePerPersonCents ?? defaultPrice,
      }));
    }
  } catch (err) {
    console.error("[getBookableHunts]", err);
  }

  return CATALOG_HUNTS.map((h) => ({
    id: `catalog-${h.slug}`,
    slug: h.slug,
    title: h.title,
    minimumPlayers: 1,
    pricePerPersonCents: defaultPrice,
  }));
}
