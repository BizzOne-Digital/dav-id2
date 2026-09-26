import type { MasterLocationRow, RouteZone } from "@/lib/locations/masterLocationTypes";
import { mapCategoryLabel } from "@/lib/locations/masterLocationTypes";

export type RouteAudience =
  | "individual"
  | "friends"
  | "family"
  | "reunion"
  | "corporate"
  | "bachelorette"
  | "large_event";

export type RouteBuildInput = {
  audience: RouteAudience;
  locations: MasterLocationRow[];
  stopCount?: number;
  seed?: string;
};

export type BuiltRouteStop = {
  masterId: number;
  name: string;
  zone: RouteZone;
  category: string;
  sampleChallenge: string;
};

/** Deterministic shuffle from seed string (team color + number). */
function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function audienceStopRange(audience: RouteAudience): { min: number; max: number } {
  switch (audience) {
    case "individual":
      return { min: 8, max: 10 };
    case "family":
      return { min: 8, max: 12 };
    case "friends":
    case "bachelorette":
      return { min: 10, max: 14 };
    case "corporate":
      return { min: 10, max: 16 };
    case "reunion":
      return { min: 10, max: 15 };
    case "large_event":
      return { min: 12, max: 18 };
    default:
      return { min: 10, max: 14 };
  }
}

function filterForAudience(rows: MasterLocationRow[], audience: RouteAudience): MasterLocationRow[] {
  return rows.filter((row) => {
    if (!row.gameStopEligible) return false;
    const fit = row.audienceFit.toLowerCase();
    if (audience === "individual") {
      return fit.includes("individuals: yes") || fit.includes("individuals: daytime") || fit.includes("individuals: exterior");
    }
    if (audience === "family") {
      return fit.includes("families: yes") || fit.includes("families: daytime") || fit.includes("families: exterior");
    }
    if (audience === "friends" || audience === "bachelorette") {
      return fit.includes("friends/adult: yes") || fit.includes("individuals: exterior");
    }
    if (audience === "corporate" || audience === "reunion" || audience === "large_event") {
      return fit.includes("corporate: yes") || fit.includes("family reunions: yes");
    }
    return true;
  });
}

function maxConcurrentForAudience(audience: RouteAudience): number {
  if (audience === "family") return 2;
  if (audience === "corporate") return 4;
  return 3;
}

/**
 * Builds a randomized stop list respecting zones, concurrent caps, and no purchase/alcohol requirements.
 * Challenges are pulled from each location's sample challenge until a full challenge bank exists.
 */
export function buildRandomRoute(input: RouteBuildInput): BuiltRouteStop[] {
  const rand = seededRandom(input.seed ?? "default-route");
  const range = audienceStopRange(input.audience);
  const target =
    input.stopCount ?? Math.floor(range.min + rand() * (range.max - range.min + 1));

  const pool = filterForAudience(input.locations, input.audience);
  const byZone: Record<RouteZone, MasterLocationRow[]> = { A: [], B: [], C: [], D: [], partner: [] };
  for (const row of pool) {
    byZone[row.zone]?.push(row);
  }

  const zoneOrder: RouteZone[] = ["A", "B", "C", "D"];
  const picked: MasterLocationRow[] = [];
  const venueCounts = new Map<number, number>();
  const maxConcurrent = maxConcurrentForAudience(input.audience);

  while (picked.length < target) {
    const zone = zoneOrder[picked.length % zoneOrder.length];
    const candidates = [...(byZone[zone] ?? [])].sort(() => rand() - 0.5);
    let added = false;
    for (const c of candidates) {
      if (picked.some((p) => p.id === c.id)) continue;
      const count = venueCounts.get(c.id) ?? 0;
      if (count >= maxConcurrent) continue;
      picked.push(c);
      venueCounts.set(c.id, count + 1);
      added = true;
      break;
    }
    if (!added) {
      const fallback = pool.filter((p) => !picked.some((x) => x.id === p.id)).sort(() => rand() - 0.5)[0];
      if (!fallback) break;
      picked.push(fallback);
    }
  }

  return picked.map((row) => ({
    masterId: row.id,
    name: row.name,
    zone: row.zone,
    category: mapCategoryLabel(row.categoryLabel),
    sampleChallenge: row.sampleChallenge,
  }));
}

export function computeMasterKpis(rows: MasterLocationRow[]) {
  const gameStops = rows.filter((r) => r.gameStopEligible);
  const highPriority = rows.filter((r) => r.priority === "high");
  const familyCompatible = gameStops.filter((r) => {
    const f = r.audienceFit.toLowerCase();
    return f.includes("families: yes") || f.includes("families: daytime") || f.includes("families: exterior");
  });
  const corporateCompatible = gameStops.filter((r) => r.audienceFit.toLowerCase().includes("corporate: yes"));
  const landmarkMuseumPark = gameStops.filter((r) => {
    const c = r.categoryLabel.toLowerCase();
    return c.includes("landmark") || c.includes("museum") || c.includes("park");
  });
  return {
    totalRecords: rows.length,
    highPriorityProspects: highPriority.length,
    familyCompatible: familyCompatible.length,
    corporateCompatible: corporateCompatible.length,
    landmarkMuseumPark: landmarkMuseumPark.length,
    gameStops: gameStops.length,
  };
}
