import type { PublicHuntListing } from "@/lib/site/huntCatalog";
import { HuntTypeCard } from "@/components/marketing/HuntTypeCard";

export const HUNT_SPOTLIGHT_SLUGS = ["bachelorette-downtown", "corporate-team-builder"] as const;

type HuntTypesGridProps = {
  hunts: PublicHuntListing[];
};

export function HuntTypesGrid({ hunts }: HuntTypesGridProps) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {hunts.map((hunt) => (
        <li key={hunt.slug}>
          <HuntTypeCard hunt={hunt} />
        </li>
      ))}
    </ul>
  );
}

export function pickSpotlightHunts(hunts: PublicHuntListing[]) {
  const bachelorette = hunts.find((h) => h.slug === "bachelorette-downtown");
  const corporate = hunts.find((h) => h.slug === "corporate-team-builder");
  const rest = hunts.filter((h) => !HUNT_SPOTLIGHT_SLUGS.includes(h.slug as (typeof HUNT_SPOTLIGHT_SLUGS)[number]));
  return { bachelorette, corporate, rest };
}
