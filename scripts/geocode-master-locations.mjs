/**
 * Geocode master locations via OpenStreetMap Nominatim (respect 1 req/sec).
 * Usage: node scripts/geocode-master-locations.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonl = resolve(__dirname, "../lib/data/master-locations.jsonl");
const out = resolve(__dirname, "../lib/data/master-location-geocodes.json");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function geocode(address) {
  const q = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "NashvilleScavengerHunt/1.0 (local seed geocoder)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.[0]) return null;
  return {
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
    geocodeStatus: "verified",
  };
}

async function main() {
  if (!existsSync(jsonl)) {
    console.error("Run node scripts/build-master-jsonl.mjs first.");
    process.exit(1);
  }
  const lines = readFileSync(jsonl, "utf8").split(/\r?\n/).filter(Boolean);
  const rows = lines.map((l) => JSON.parse(l));
  const cache = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : {};

  for (const row of rows) {
    const key = String(row.id);
    if (cache[key]?.geocodeStatus === "verified") {
      console.log(`Skip ${row.id} ${row.name} (cached)`);
      continue;
    }
    process.stdout.write(`Geocoding ${row.id} ${row.name}... `);
    try {
      const hit = await geocode(row.address);
      if (hit) {
        cache[key] = hit;
        console.log(`${hit.lat}, ${hit.lng}`);
      } else {
        console.log("NOT FOUND");
      }
    } catch (e) {
      console.log("ERROR", e.message);
    }
    writeFileSync(out, JSON.stringify(cache, null, 2), "utf8");
    await sleep(1100);
  }
  console.log(`Saved ${Object.keys(cache).length} geocodes to ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
