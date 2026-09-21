import type { ILocation } from "@/lib/models/Location";

export type RouteZone = "A" | "B" | "C" | "D" | "partner";

export type MasterPriority = "high" | "medium";

/** Raw row from client master workbook (Sep 2026) */
export type MasterLocationRow = {
  id: number;
  name: string;
  categoryLabel: string;
  address: string;
  phone?: string;
  website?: string;
  accessAgeProfile: string;
  audienceFit: string;
  routeNotes: string;
  sampleChallenge: string;
  partnerPrizeIdea: string;
  priority: MasterPriority;
  verificationNote: string;
  zone: RouteZone;
  gameStopEligible: boolean;
  adultOnlyInterior?: boolean;
  alcoholVenue?: boolean;
  maxTeamsPerSlot?: number;
  lat?: number;
  lng?: number;
  geocodeStatus?: "pending" | "verified";
};

export type LocationCatalogCategory =
  | "landmark"
  | "history"
  | "retail"
  | "food"
  | "scenic"
  | "music"
  | "partner";

export function mapCategoryLabel(label: string): LocationCatalogCategory {
  const l = label.toLowerCase();
  if (l.includes("district") || l.includes("business network")) return "partner";
  if (l.includes("honky-tonk") || (l.includes("live music") && !l.includes("restaurant"))) return "music";
  if (l.includes("celebrity") || l.includes("restaurant") || l.includes("food hall") || l.includes("bbq") || l.includes("dining")) {
    return "food";
  }
  if (l.includes("retail") || l.includes("visitor") || l.includes("candy") || l.includes("boot")) return "retail";
  if (l.includes("park") || l.includes("riverfront") || l.includes("scenic") || l.includes("bridge")) return "scenic";
  if (l.includes("museum") || l.includes("historic") || l.includes("civic") || l.includes("capitol") || l.includes("government")) {
    return "history";
  }
  if (l.includes("landmark")) return "landmark";
  return "landmark";
}

export function priorityToPartnerScore(priority: MasterPriority): number {
  return priority === "high" ? 8 : 5;
}

export function parseAudienceTags(audienceFit: string): string[] {
  const tags: string[] = [];
  const lower = audienceFit.toLowerCase();
  if (lower.includes("individuals: yes") || lower.includes("individuals: daytime") || lower.includes("individuals: exterior")) {
    tags.push("individual");
  }
  if (lower.includes("friends/adult: yes")) tags.push("friends");
  if (lower.includes("families: yes") || lower.includes("families: daytime") || lower.includes("families: exterior")) {
    tags.push("family");
  }
  if (lower.includes("family reunions: yes")) tags.push("reunion");
  if (lower.includes("corporate: yes")) tags.push("corporate");
  if (lower.includes("exterior")) tags.push("exterior-default");
  if (lower.includes("individuals: no")) tags.push("no-individual-stop");
  return tags;
}

export function masterRowToLocationDoc(
  row: MasterLocationRow,
  slug: string,
  coords: { lat: number; lng: number; geocodeStatus: "pending" | "verified" }
): Partial<ILocation> {
  const category = mapCategoryLabel(row.categoryLabel);
  const adultHonky = row.categoryLabel.toLowerCase().includes("honky-tonk") || row.adultOnlyInterior;
  return {
    name: row.name,
    slug,
    category,
    categoryLabel: row.categoryLabel,
    masterId: row.id,
    description: row.routeNotes,
    address: row.address,
    lat: coords.lat,
    lng: coords.lng,
    geocodeStatus: coords.geocodeStatus,
    phone: row.phone,
    website: row.website,
    accessAgeProfile: row.accessAgeProfile,
    audienceFit: row.audienceFit,
    routeNotes: row.routeNotes,
    sampleChallenge: row.sampleChallenge,
    partnerPrizeIdea: row.partnerPrizeIdea,
    verificationNote: row.verificationNote,
    priority: row.priority,
    zone: row.zone,
    gameStopEligible: row.gameStopEligible,
    tags: [category, row.zone.toLowerCase()],
    audienceTags: parseAudienceTags(row.audienceFit),
    adultOnlyInterior: adultHonky ?? false,
    alcoholVenue: row.alcoholVenue ?? row.categoryLabel.toLowerCase().includes("honky-tonk"),
    purchaseRequired: false,
    alcoholRequired: false,
    maxTeamsPerSlot: row.maxTeamsPerSlot ?? (row.zone === "partner" ? 0 : 3),
    partnerPriority: priorityToPartnerScore(row.priority),
    partnerConfirmed: false,
    partnerPermission: row.gameStopEligible,
    status: row.gameStopEligible ? "active" : "suppressed",
    outdoor: true,
    weatherSuitability: row.routeNotes.toLowerCase().includes("rain") ? "indoor_fallback" : "all",
  };
}
