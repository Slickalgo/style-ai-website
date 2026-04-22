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

/**
 * Each entry corresponds to an editorial image slot in the site. If the
 * semantic PNG is present, we do nothing. If missing, a bone-colored
 * placeholder with the caption text is generated so the dev server never
 * 404s. All primaries are 3:4 portrait except the week grid which is 1:1.
 *
 * Alts are reserve variants that are referenced by the build pipeline but
 * not wired into any HTML by default. They still need placeholders to
 * avoid dangling optimize-images runs when the alt PNG has been deleted.
 */
const SLOTS = [
  { id: "hero", width: 1200, height: 1600, label: "UKTI · HERO" },
  { id: "hero-alt", width: 1200, height: 1600, label: "UKTI · HERO (alt)" },
  { id: "one-pull", width: 1200, height: 1600, label: "UKTI · ONE PULL" },
  { id: "one-pull-alt", width: 1200, height: 1600, label: "UKTI · ONE PULL (alt)" },
  { id: "week-tue", width: 1200, height: 1200, label: "TUE · Quiet confidence." },
  { id: "week-wed", width: 1200, height: 1200, label: "WED · Soft authority." },
  { id: "week-thu", width: 1200, height: 1200, label: "THU · The grey, again." },
  { id: "week-fri", width: 1200, height: 1200, label: "FRI · Less is the call." },
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
  for (const slot of SLOTS) {
    const dest = path.join(outDir, `${slot.id}.png`);
    if (fs.existsSync(dest)) continue;
    const buf = await makePlaceholder(slot.width, slot.height, slot.label);
    fs.writeFileSync(dest, buf);
    console.warn(`[ensure-image-placeholders] wrote ${path.relative(root, dest)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
