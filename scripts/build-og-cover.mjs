/**
 * 1200×630 Open Graph / Twitter share image.
 *
 * Editorial share card: ink canvas + warm off-paper type. A verdict stamp
 * carries the voice; the URL sits quietly. Designed to match the site's
 * paper + ink palette so the ad → site → app transition reads as one world.
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

// Token mirrors — see tailwind.config.js + style-ai-frontend editorialColors.
const INK = "#0D0B0A";
const PAPER = "#F5F1EA";
const STONE = "#A89B8A";

async function main() {
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Subtle vertical wash — ink deepens toward bottom. -->
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#14100D"/>
          <stop offset="100%" style="stop-color:${INK}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>

      <!-- Mono eyebrow, letter-spaced caps. -->
      <text x="72" y="150"
        fill="${STONE}"
        font-family="'IBM Plex Mono', ui-monospace, monospace"
        font-size="22"
        letter-spacing="4"
        font-weight="500">
        ISSUE №01 · TODAY
      </text>

      <!-- Verdict stamp — Fraunces italic. Face-fallback to Georgia italic
           covers servers that don't have the self-hosted font installed; the
           glyph shapes are similar enough for share-card purposes. -->
      <text x="72" y="300"
        fill="${PAPER}"
        font-family="'Fraunces', Georgia, 'Times New Roman', serif"
        font-size="96"
        font-style="italic"
        font-weight="400">
        Quiet confidence.
      </text>

      <!-- Pieces caption — lighter, the stylist's post-script. -->
      <text x="72" y="380"
        fill="rgba(245, 241, 234, 0.72)"
        font-family="'Fraunces', Georgia, 'Times New Roman', serif"
        font-size="32"
        font-weight="400">
        Camel knit. Black denim. Brown loafers.
      </text>

      <!-- Footer meta + URL. -->
      <text x="72" y="560"
        fill="${PAPER}"
        font-family="'Fraunces', Georgia, 'Times New Roman', serif"
        font-size="36"
        font-weight="400">
        Style<tspan fill="rgba(245, 241, 234, 0.6)">.ai</tspan>
      </text>
      <text x="1128" y="560"
        text-anchor="end"
        fill="${STONE}"
        font-family="'IBM Plex Mono', ui-monospace, monospace"
        font-size="18"
        letter-spacing="3"
        font-weight="400">
        STYLEDESIGNER.CO.IN
      </text>
    </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(dest);
  console.log(`[build-og-cover] ${path.relative(root, dest)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
