/**
 * Build `public/og-cover.jpg` — the social-preview image referenced by
 * every page's og:image + twitter:image meta tags.
 *
 * Typographic composition, not photograph, per final-spec §7.
 *
 *   Canvas   1200×630, paper #F5F1EA
 *   Bottom-left masthead in IBM Plex Mono 11px uppercase tracked 0.12em,
 *                stone (#6B6460)
 *   Centered headline "Ukti decides what you wear." in Fraunces 80px,
 *                roman 400, ink (#0D0B0A), forced two-line break after "you"
 *   Nothing else.
 *
 * Run: `node scripts/build-og-cover.mjs` — wired into prebuild alongside
 * image-placeholder ensure + image optimize. Idempotent.
 *
 * Rendering approach: Sharp's SVG pipeline composites the typography. The
 * SVG embeds the site's WOFF2 fonts as base64 @font-face, and declares a
 * system fallback stack (Iowan Old Style / Georgia for serif; SFMono /
 * Menlo for mono) so a CI machine without the WOFF2 loader falls through
 * to a visually-similar serif/mono rather than breaking the build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const fontsDir = path.join(root, "public", "fonts");
const outPath = path.join(root, "public", "og-cover.jpg");

function encodeFontBase64(filename) {
  const abs = path.join(fontsDir, filename);
  if (!fs.existsSync(abs)) {
    console.warn(`[build-og-cover] missing font ${filename}, falling back to system fonts`);
    return null;
  }
  return fs.readFileSync(abs).toString("base64");
}

const fraunces400 = encodeFontBase64("Fraunces-400.woff2");
const plexMono400 = encodeFontBase64("IBMPlexMono-400.woff2");

const fontFaceFraunces = fraunces400
  ? `@font-face { font-family: 'Fraunces'; src: url(data:font/woff2;base64,${fraunces400}) format('woff2'); font-weight: 400; font-style: normal; }`
  : "";
const fontFacePlex = plexMono400
  ? `@font-face { font-family: 'IBM Plex Mono'; src: url(data:font/woff2;base64,${plexMono400}) format('woff2'); font-weight: 400; font-style: normal; }`
  : "";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <style>
    ${fontFaceFraunces}
    ${fontFacePlex}

    .canvas { fill: #F5F1EA; }

    .masthead {
      font-family: 'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace;
      font-size: 12px;
      font-weight: 400;
      fill: #6B6460;
      letter-spacing: 1.44px; /* 0.12em × 12px */
      text-transform: uppercase;
    }

    .headline {
      font-family: 'Fraunces', 'Iowan Old Style', Georgia, serif;
      font-size: 80px;
      font-weight: 400;
      fill: #0D0B0A;
      letter-spacing: -1.6px; /* -0.02em × 80px */
    }
  </style>

  <!-- Canvas -->
  <rect class="canvas" width="1200" height="630" />

  <!-- Masthead bottom-left (60px from left edge, 46px from bottom) -->
  <text class="masthead" x="60" y="584">ISSUE №01 · UKTI · EST. 2026</text>

  <!-- Centered headline, forced two-line break.
       line-height 0.95 × 80 = 76px
       For a 2-line block centered vertically (canvas 630), midline = 315.
       Offset each baseline ±38 from the midline.
       Also: nudge the group ~8px up to optically center — serif descenders
       push the visual mass downward, which we counteract. -->
  <text class="headline" x="600" y="285" text-anchor="middle">Ukti decides what you</text>
  <text class="headline" x="600" y="361" text-anchor="middle">wear.</text>
</svg>`;

async function main() {
  const jpg = await sharp(Buffer.from(svg))
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  fs.writeFileSync(outPath, jpg);
  const size = (jpg.length / 1024).toFixed(1);
  console.log(`[build-og-cover] wrote ${path.relative(root, outPath)} (${size} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
