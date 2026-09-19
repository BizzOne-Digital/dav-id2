import type { ILocation } from "@/lib/models/Location";
import { hashSeed, seededRandom } from "@/lib/utils";
import type { IRouteRecipe } from "@/lib/models/RouteRecipe";

export interface RouteAssignmentInput {
  eventId?: string;
  sessionId: string;
  teamId: string;
  groupType: string;
  youngestAge?: number;
  alcoholFree?: boolean;
  accessibilityNotes?: string;
  locations: ILocation[];
  recipe: IRouteRecipe;
}

export interface AssignedStop {
  locationId: string;
  order: number;
  category: string;
}

function scoreLocation(loc: ILocation, ctx: RouteAssignmentInput, usedCategories: Set<string>): number {
  let audienceFit = 1;
  if (ctx.youngestAge !== undefined && ctx.youngestAge < 18 && loc.adultOnlyInterior) audienceFit = 0;
  if (ctx.alcoholFree && loc.alcoholVenue) audienceFit *= 0.2;
  if (loc.status !== "active") audienceFit = 0;

  const capacity = loc.maxTeamsPerSlot ? Math.min(loc.maxTeamsPerSlot / 3, 1) : 0.8;
  const diversity = usedCategories.has(loc.category) ? 0.4 : 1;
  const distanceFit = 0.85;
  const partnerPriority = (loc.partnerPriority ?? 5) / 10;
  const congestionPenalty = loc.status === "crowded" ? 0.5 : 0;

  return (
    30 * audienceFit +
    25 * capacity +
    20 * diversity +
    15 * distanceFit +
    10 * partnerPriority -
    congestionPenalty
  );
}

export function generateRoute(input: RouteAssignmentInput): { seed: string; stops: AssignedStop[] } {
  const seed = hashSeed([input.eventId || "default", input.sessionId, input.teamId]);
  const rng = seededRandom(seed);
  const usedLocationIds = new Set<string>();
  const usedCategories = new Set<string>();
  const stops: AssignedStop[] = [];
  let order = 0;

  for (const req of input.recipe.categories || []) {
    for (let i = 0; i < (req.count || 0); i++) {
      const candidates = input.locations
        .filter((loc) => {
          if (usedLocationIds.has(loc._id.toString())) return false;
          if (loc.category !== req.category) return false;
          if (input.recipe.rules?.noAdultInteriors && loc.adultOnlyInterior) return false;
          if (input.alcoholFree && loc.alcoholVenue) return false;
          if (loc.status === "suppressed" || loc.status === "closed") return false;
          return true;
        })
        .map((loc) => ({
          loc,
          score: scoreLocation(loc, input, usedCategories),
        }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (!candidates.length) continue;

      const total = candidates.reduce((s, c) => s + c.score, 0);
      let pick = candidates[0].loc;
      let roll = rng() * total;
      for (const c of candidates) {
        roll -= c.score;
        if (roll <= 0) {
          pick = c.loc;
          break;
        }
      }

      usedLocationIds.add(pick._id.toString());
      usedCategories.add(pick.category);
      stops.push({
        locationId: pick._id.toString(),
        order: order++,
        category: pick.category,
      });
    }
  }

  return { seed, stops };
}
