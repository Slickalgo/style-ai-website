/**
 * Emits responsive AVIF + WebP for each PNG under public/images/.
 *
 * Two widths per source:
 *   {stem}.avif    / {stem}.webp      — 1440px primary, served to desktop/retina.
 *   {stem}-sm.avif / {stem}-sm.webp   — 720px mobile variant.
 *
 * HTML <picture> elements consume both via srcset width descriptors:
 *   <source type="image/avif"
 *           srcset="/images/hero-sm.avif 720w, /images/hero.avif 1440w"
 *           sizes="100vw" />
 *
 * `withoutEnlargement: true` means a source smaller than the target width
 * is left at its source size — this matters for the 1:1 week renders whose
 * source is 1200px, and the 3:4 portraits also capped at 1200px wide.
 * Acceptable: the 1440 variant of a 1200-source effectively becomes 1200,
 * which still outperforms the original 720 cap.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imgDir = path.join(root, "public", "images");

const VARIANTS = [
  { suffix: "", width: 1920 },   // desktop retina + large-viewport primary
  { suffix: "-md", width: 1440 }, // laptop / standard desktop
  { suffix: "-sm", width: 720 },  // mobile
];

async function main() {
  if (!fs.existsSync(imgDir)) {
    console.warn("[optimize-images] no public/images — run ensure-image-placeholders first");
    return;
  }
  const files = fs.readdirSync(imgDir).filter((f) => f.endsWith(".png"));
  for (const f of files) {
    const basePath = path.join(imgDir, f);
    const stem = path.basename(f, ".png");

    for (const { suffix, width } of VARIANTS) {
      const meta = await sharp(basePath).metadata();
      const srcW = meta.width || 0;

      let pipeline = sharp(basePath);
      if (srcW > width) {
        pipeline = sharp(basePath).resize({ width, withoutEnlargement: true });
      }
      const buf = await pipeline.toBuffer();
      await sharp(buf)
        .avif({ quality: 55, effort: 6 })
        .toFile(path.join(imgDir, `${stem}${suffix}.avif`));
      await sharp(buf)
        .webp({ quality: 82 })
        .toFile(path.join(imgDir, `${stem}${suffix}.webp`));
    }
    console.log(`[optimize-images] ${stem} → 1920, 1440, 720 (avif + webp)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
