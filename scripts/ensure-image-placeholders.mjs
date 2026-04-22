/**
 * Creates on-brand placeholder PNGs for the UKTI imagery slots when sources are
 * missing. Replace files in public/images/ with real exports anytime; re-run
 * optimize-images after.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public", "images");

const IDS = [
  "08349e12269a",
  "63d9bb1e1a74",
];

async function makePlaceholder(width, height, label) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#E8E1D4"/>
      <text x="50%" y="48%" text-anchor="middle" fill="rgba(13,11,10,0.22)" font-family="ui-serif,Georgia,serif" font-size="${Math.round(width * 0.045)}">${label}</text>
      <text x="50%" y="54%" text-anchor="middle" fill="rgba(13,11,10,0.12)" font-family="ui-monospace,monospace" font-size="${Math.round(width * 0.022)}">UKTI placeholder</text>
    </svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const id of IDS) {
    const dest = path.join(outDir, `${id}.png`);
    if (fs.existsSync(dest)) continue;
    const buf = await makePlaceholder(786, 1704, `UKTI · ${id.slice(0, 6)}`);
    fs.writeFileSync(dest, buf);
    console.warn(`[ensure-image-placeholders] wrote ${path.relative(root, dest)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
