import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);
const SKIP_FILES = new Set(["package-lock.json", "replace-nashville-brand.mjs"]);

const placeholders = [
  ["NashvilleScavengerHunt.com", "__DOMAIN_COM__"],
  ["NashvilleScavengerHunt", "__DOMAIN__"],
  ["ExploreNashville", "__EXPLORE_COMP__"],
  ["NashvilleGalleryStrip", "__GALLERY_COMP__"],
  ["getNashvilleRank", "__RANK_FN__"],
  ["/images/nashville-", "__IMGPATH__"],
  ["nashville-logo", "__LOGOFILE__"],
  ["nashville-promo", "__PROMOFILE__"],
];

function transform(s) {
  let t = s;
  for (const [a, b] of placeholders) t = t.split(a).join(b);
  t = t.replace(/Nashville Scavenger Hunt/g, "Music City Scavenger Hunt");
  t = t.replace(/Nashville/g, "Music City");
  for (const [a, b] of placeholders) t = t.split(b).join(a);
  return t;
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "data" && dir.endsWith(`${path.sep}lib`)) continue;
      if (name === "build-master-jsonl.mjs") continue;
      walk(full, acc);
    } else if (
      /\.(tsx?|jsx?|md|json|svg|mjs)$/.test(name) &&
      !SKIP_FILES.has(name) &&
      !full.includes("build-master-jsonl") &&
      !full.includes("geocode-master-locations")
    ) {
      acc.push(full);
    }
  }
  return acc;
}

let updated = 0;
for (const file of walk(root)) {
  const orig = fs.readFileSync(file, "utf8");
  if (!orig.includes("Nashville")) continue;
  const next = transform(orig);
  if (next !== orig) {
    fs.writeFileSync(file, next);
    updated++;
    console.log(path.relative(root, file));
  }
}
console.log(`Updated ${updated} files.`);
