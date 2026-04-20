#!/usr/bin/env node
// Variant generator for the hero A/B/C test.
//
// Reads index.html at repo root and writes three siblings into _variants/{a,b,c}/.
// Each output is byte-identical to index.html except for:
//   1. `data-variant="X"` added to <html> so client-side analytics can read it
//      without a cookie round-trip on pages that ship with the attribute baked in.
//   2. A <meta name="robots" content="noindex, nofollow"> injected after the
//      canonical link so search engines don't index the variant URLs directly.
//   3. A leading HTML comment flagging the file as generated.
//   4. If `scripts/variants/<v>.mjs` exists, its default export runs as a last-mile
//      transform — lets concepts B and C diverge from the A control (hero section
//      swap, preload strip, etc.) without forking index.html three ways.
//
// Runs in both `dev` and `prebuild` so vite sees the files as rollup inputs.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const VARIANTS = ["a", "b", "c"];
const SOURCE = resolve(REPO_ROOT, "index.html");

const CONCEPT_NOTES = {
  a: "Control. Current hero.",
  b: "Concept B — breathing hero + ink-wash bridge. Pending prototype review.",
  c: "Concept C — type-led zero-image hero. Pending prototype review.",
};

function stampVariant(html, variant) {
  // 1. Stamp data-variant onto <html>.
  let out = html.replace(
    /<html\s+lang="en"\s+class="bg-paper">/,
    `<html lang="en" class="bg-paper" data-variant="${variant}">`,
  );
  if (out === html) {
    throw new Error(
      `build-variants: could not find <html lang="en" class="bg-paper"> tag to stamp variant=${variant}. ` +
        `Source index.html signature has drifted — update the regex in scripts/build-variants.mjs.`,
    );
  }

  // 2. Inject noindex + generated banner AFTER the canonical link so SEO tools
  //    treat the root `/` as the sole indexable surface.
  const noindexBlock =
    `\n    <!-- GENERATED FILE — DO NOT EDIT. Source: index.html. Variant: ${variant}. ${CONCEPT_NOTES[variant]} -->\n` +
    `    <meta name="robots" content="noindex, nofollow" />`;
  out = out.replace(
    /(<link rel="canonical" href="[^"]+"\s*\/>)/,
    `$1${noindexBlock}`,
  );

  return out;
}

async function applyVariantOverride(html, variant) {
  // If scripts/variants/<v>.mjs exists, import and apply its default export
  // as a transform. Contract: `export default async function (html, variant)`
  // returns the transformed HTML string. Missing file = no override = pass-through.
  const overridePath = resolve(__dirname, "variants", `${variant}.mjs`);
  if (!existsSync(overridePath)) return html;
  const mod = await import(pathToFileURL(overridePath).href);
  if (typeof mod.default !== "function") {
    throw new Error(
      `build-variants: ${overridePath} exists but has no default export — ` +
        `remove the file or export a default (html, variant) => html function.`,
    );
  }
  const out = await mod.default(html, variant);
  if (typeof out !== "string" || !out.length) {
    throw new Error(
      `build-variants: ${overridePath} default export returned non-string or empty output for variant=${variant}.`,
    );
  }
  return out;
}

async function main() {
  if (!existsSync(SOURCE)) {
    console.error(`build-variants: source not found at ${SOURCE}`);
    process.exit(1);
  }
  const source = readFileSync(SOURCE, "utf8");

  for (const v of VARIANTS) {
    const destDir = resolve(REPO_ROOT, "_variants", v);
    const destFile = resolve(destDir, "index.html");
    mkdirSync(destDir, { recursive: true });
    const stamped = stampVariant(source, v);
    const final = await applyVariantOverride(stamped, v);
    writeFileSync(destFile, final, "utf8");
    const delta = final.length - stamped.length;
    const suffix = delta === 0 ? "" : ` (${delta > 0 ? "+" : ""}${delta}b override)`;
    console.log(`build-variants: wrote _variants/${v}/index.html${suffix}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
