/**
 * 1200×630 Open Graph / Twitter share image.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dest = path.join(root, "public", "og-cover.jpg");

const W = 1200;
const H = 630;

async function main() {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2a0f1c"/>
          <stop offset="50%" style="stop-color:#44182b"/>
          <stop offset="100%" style="stop-color:#6b1d47"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <text x="64" y="200" fill="rgba(250,246,240,0.95)" font-family="Georgia,serif" font-size="72" font-weight="600">Style AI</text>
      <text x="64" y="280" fill="rgba(250,246,240,0.75)" font-family="system-ui,sans-serif" font-size="28" font-weight="500">Skin-aware colors · Your closet · Your looks</text>
      <text x="64" y="340" fill="rgba(250,246,240,0.45)" font-family="system-ui,sans-serif" font-size="22">styledesigner.co.in</text>
    </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
  console.log(`[build-og-cover] ${path.relative(root, dest)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
