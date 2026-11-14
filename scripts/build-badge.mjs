// Renders public/badge/paws-member-badge.svg to PNGs (2x for websites, 4x
// for print/social). Re-run after editing the SVG: node scripts/build-badge.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const svg = await readFile(new URL("../public/badge/paws-member-badge.svg", import.meta.url));
for (const [density, out] of [[144, "paws-member-badge.png"], [288, "paws-member-badge-large.png"]]) {
  await sharp(svg, { density }).png({ compressionLevel: 9 }).toFile(fileURLToPath(new URL(`../public/badge/${out}`, import.meta.url)));
  console.log(out);
}
