/** Published hunt routes — used on /hunts when DB is empty and for seed data */

export type CatalogHunt = {
  title: string;
  slug: string;
  shortDescription: string;
  featured: boolean;
  difficulty: "easy" | "moderate" | "challenging";
  groupTypes: string[];
};

export const CATALOG_HUNT_COVER_PATHS = [
  "/images/broadway-neon.jpg",
  "/images/ryman-guitar-case.jpg",
  "/images/flatlay-game-board.jpg",
  "/images/map-pin-downtown.jpg",
  "/images/skyline-river-sunset.jpg",
  "/images/qr-scan-challenge.jpg",
  "/images/prizes-trophy.jpg",
];

export const CATALOG_HUNTS: CatalogHunt[] = [
  {
    title: "Broadway Beats Hunt",
    slug: "broadway-beats",
    shortDescription: "Live music legends and neon-lit clues downtown.",
    featured: true,
    difficulty: "moderate",
    groupTypes: ["friends", "bachelorette"],
  },
  {
    title: "Music City History Trail",
    slug: "music-city-history",
    shortDescription: "Capitol stories, Printer's Alley secrets, and more.",
    featured: true,
    difficulty: "moderate",
    groupTypes: ["family", "corporate"],
  },
  {
    title: "Family Friendly Downtown",
    slug: "family-friendly-downtown",
    shortDescription: "Kid-safe stops with puzzles everyone can solve.",
    featured: false,
    difficulty: "easy",
    groupTypes: ["family"],
  },
  {
    title: "Date Night Discovery",
    slug: "date-night-discovery",
    shortDescription: "Romantic views and clever riddles for two.",
    featured: false,
    difficulty: "moderate",
    groupTypes: ["couples", "friends"],
  },
  {
    title: "Corporate Team Builder",
    slug: "corporate-team-builder",
    shortDescription: "Competitive scoring built for office outings.",
    featured: false,
    difficulty: "challenging",
    groupTypes: ["corporate"],
  },
  {
    title: "Gulch & Gallery Sprint",
    slug: "gulch-gallery-sprint",
    shortDescription: "Murals, art deco, and photo challenges.",
    featured: false,
    difficulty: "moderate",
    groupTypes: ["friends", "creatives"],
  },
  {
    title: "Riverfront Views Challenge",
    slug: "riverfront-views",
    shortDescription: "Bridge panoramas and stadium skyline puzzles.",
    featured: false,
    difficulty: "easy",
    groupTypes: ["family", "tourists"],
  },
];

export type PublicHuntListing = CatalogHunt & {
  coverImage: string;
  duration: string;
  pricePerPersonCents: number;
};

export function catalogHuntsForListing(): PublicHuntListing[] {
  return CATALOG_HUNTS.map((hunt, index) => ({
    ...hunt,
    coverImage: CATALOG_HUNT_COVER_PATHS[index % CATALOG_HUNT_COVER_PATHS.length],
    duration: "2–3 hours",
    pricePerPersonCents: 2995,
  }));
}

export function getCatalogHuntBySlug(slug: string): PublicHuntListing | null {
  const index = CATALOG_HUNTS.findIndex((h) => h.slug === slug);
  if (index === -1) return null;
  const hunt = CATALOG_HUNTS[index];
  return {
    ...hunt,
    coverImage: CATALOG_HUNT_COVER_PATHS[index % CATALOG_HUNT_COVER_PATHS.length],
    duration: "2–3 hours",
    pricePerPersonCents: 2995,
  };
}
