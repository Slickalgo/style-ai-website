/**
 * Generate the editorial QR code for the desktop install-handoff at Beat 6.
 *
 *   URL encoded:     https://ukti.io/get  (matches public/config.js `shortUrl`)
 *   Error correction: M (15%, standard — M is the editorial-safe default)
 *   Colors:           ink on paper (not black-on-white — keeps the page's palette)
 *   Margin:           1 module (tight; the QR will sit inside a framed container)
 *
 * The QR is static content. Encoded URL only changes on DNS strategy changes, so
 * this script doesn't need to run every build — but it's wired into `build:assets`
 * anyway so a drifted URL can't silently persist. Output is deterministic.
 *
 * If we ever need to regenerate for a new URL, change the URL constant below
 * and re-run `node scripts/build-qr.mjs` or `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const out = path.join(root, "public", "images", "qr.svg");

const URL_ENCODED = "https://ukti.io/get";

const svg = await QRCode.toString(URL_ENCODED, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: {
    dark: "#0D0B0A",  // ink
    light: "#F5F1EA", // paper — matches the site canvas so the QR sits flush
  },
});

fs.writeFileSync(out, svg);
console.log(`[build-qr] wrote ${path.relative(root, out)} (${(svg.length / 1024).toFixed(1)} KB)`);
