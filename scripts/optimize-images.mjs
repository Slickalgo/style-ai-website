/**
 * Emits AVIF + WebP next to each PNG under public/images/ (max width 720, aspect preserved).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imgDir = path.join(root, "public", "images");

const MAX_W = 720;

async function main() {
  if (!fs.existsSync(imgDir)) {
    console.warn("[optimize-images] no public/images — run ensure-image-placeholders first");
    return;
  }
  const files = fs.readdirSync(imgDir).filter((f) => f.endsWith(".png"));
  for (const f of files) {
    const basePath = path.join(imgDir, f);
    const stem = path.basename(f, ".png");
    const meta = await sharp(basePath).metadata();
    const w = meta.width || 0;
    let pipeline = sharp(basePath);
    if (w > MAX_W) {
      pipeline = sharp(basePath).resize({ width: MAX_W, withoutEnlargement: true });
    }
    const buf = await pipeline.toBuffer();
    await sharp(buf).avif({ quality: 55, effort: 6 }).toFile(path.join(imgDir, `${stem}.avif`));
    await sharp(buf).webp({ quality: 82 }).toFile(path.join(imgDir, `${stem}.webp`));
    console.log(`[optimize-images] ${stem}.avif, ${stem}.webp`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
