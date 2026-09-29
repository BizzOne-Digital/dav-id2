/**
 * Build app/favicon.ico and public/favicon.ico from app/icon.png
 * Run: node scripts/generate-favicon.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "app", "icon.png");

const buf = await readFile(input);
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(buf)
      .resize(size, size, { fit: "contain", background: { r: 16, g: 18, b: 22, alpha: 1 } })
      .png()
      .toBuffer()
  )
);

const ico = await toIco(pngs);
const targets = [path.join(root, "app", "favicon.ico"), path.join(root, "public", "favicon.ico")];
for (const dest of targets) {
  await writeFile(dest, ico);
}
console.log(`favicon.ico written (${ico.length} bytes) -> app/ and public/`);
