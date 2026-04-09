/**
 * Creates on-brand placeholder PNGs for marketing screenshots when sources are missing.
 * Replace files in public/images/ with real exports anytime; re-run optimize-images after.
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
  "4f28726ca1c6",
  "522f0c15a4e6",
  "559a53a42c92",
  "63d9bb1e1a74",
  "89096df6ac08",
  "988f70d5c1e6",
  "a72cfc383f12",
  "a7640dc147b6",
  "cdedd99bf2d5",
];

async function makePlaceholder(width, height, label) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a0a12"/>
          <stop offset="55%" style="stop-color:#44182b"/>
          <stop offset="100%" style="stop-color:#6b1d47"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="48%" text-anchor="middle" fill="rgba(250,246,240,0.22)" font-family="system-ui,sans-serif" font-size="${Math.round(width * 0.045)}">${label}</text>
      <text x="50%" y="54%" text-anchor="middle" fill="rgba(250,246,240,0.12)" font-family="system-ui,sans-serif" font-size="${Math.round(width * 0.022)}">Replace with app screenshot</text>
    </svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const id of IDS) {
    const dest = path.join(outDir, `${id}.png`);
    if (fs.existsSync(dest)) continue;
    const buf = await makePlaceholder(786, 1704, `Style AI · ${id.slice(0, 6)}`);
    fs.writeFileSync(dest, buf);
    console.warn(`[ensure-image-placeholders] wrote ${path.relative(root, dest)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
