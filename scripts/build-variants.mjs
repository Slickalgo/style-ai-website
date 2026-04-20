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
//
// Runs in both `dev` and `prebuild` so vite sees the files as rollup inputs.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

function main() {
  if (!existsSync(SOURCE)) {
    console.error(`build-variants: source not found at ${SOURCE}`);
    process.exit(1);
  }
  const source = readFileSync(SOURCE, "utf8");

  for (const v of VARIANTS) {
    const destDir = resolve(REPO_ROOT, "_variants", v);
    const destFile = resolve(destDir, "index.html");
    mkdirSync(destDir, { recursive: true });
    writeFileSync(destFile, stampVariant(source, v), "utf8");
    console.log(`build-variants: wrote _variants/${v}/index.html`);
  }
}

main();
