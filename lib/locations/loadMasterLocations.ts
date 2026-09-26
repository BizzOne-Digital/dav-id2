import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import type { MasterLocationRow } from "@/lib/locations/masterLocationTypes";

const JSONL = resolve(process.cwd(), "lib/data/master-locations.jsonl");
const GEO = resolve(process.cwd(), "lib/data/master-location-geocodes.json");

type GeocodeEntry = { lat: number; lng: number; geocodeStatus?: "pending" | "verified" };

export function loadMasterLocationRows(): MasterLocationRow[] {
  if (!existsSync(JSONL)) {
    throw new Error(`Missing master location file: ${JSONL}`);
  }
  const lines = readFileSync(JSONL, "utf8").split(/\r?\n/).filter(Boolean);
  return lines.map((line) => JSON.parse(line) as MasterLocationRow);
}

export function loadGeocodeCache(): Record<string, GeocodeEntry> {
  if (!existsSync(GEO)) return {};
  return JSON.parse(readFileSync(GEO, "utf8")) as Record<string, GeocodeEntry>;
}

/** Downtown fallback when geocode missing — replace via scripts/geocode-master-locations.ts */
export const DOWNTOWN_FALLBACK = { lat: 36.1627, lng: -86.7816, geocodeStatus: "pending" as const };

export function resolveCoordsForMasterRow(
  row: MasterLocationRow,
  cache: Record<string, GeocodeEntry>
): { lat: number; lng: number; geocodeStatus: "pending" | "verified" } {
  if (row.lat != null && row.lng != null) {
    return { lat: row.lat, lng: row.lng, geocodeStatus: row.geocodeStatus ?? "verified" };
  }
  const cached = cache[String(row.id)];
  if (cached) {
    return {
      lat: cached.lat,
      lng: cached.lng,
      geocodeStatus: cached.geocodeStatus ?? "verified",
    };
  }
  return DOWNTOWN_FALLBACK;
}
