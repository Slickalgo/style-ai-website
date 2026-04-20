// Vercel Edge Middleware — hero A/B/C variant router.
//
// Intercepts requests to `/` at the edge, assigns the visitor to variant
// a|b|c via a cryptographically random 33/33/33 split, pins the assignment
// in a first-party cookie (`sa_v`, 1-year, SameSite=Lax), and rewrites the
// response internally to `/_variants/<v>/index.html`. The URL in the browser
// address bar stays as `/` — the visitor never sees a variant URL.
//
// Dev/QA override: `?v=a|b|c` on the URL forces the variant and re-pins the
// cookie. Useful for the CEO to preview each variant on the live deploy
// without clearing cookies.
//
// Cleanup path: when the test concludes, either (a) hard-pin all traffic to
// the winning variant by collapsing the assignment to a single value, or
// (b) delete this file entirely and let the root index.html serve `/` again.
//
// Matcher is scoped to `/` only so static assets (images, CSS, JS) and all
// other routes bypass this middleware entirely — zero perf cost on anything
// that isn't the root.

import { rewrite } from "@vercel/edge";

const COOKIE_NAME = "sa_v";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year
const VARIANTS = ["a", "b", "c"];

export const config = {
  // Only run on the root path. Everything else is served directly from the
  // static output without middleware overhead.
  matcher: "/",
};

function pickRandomVariant() {
  // crypto.getRandomValues is available in the edge runtime. Gives us a
  // uniform 33/33/33 split independent of request-header entropy, so two
  // visitors arriving from the same IP get independent assignments.
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return VARIANTS[buf[0] % VARIANTS.length];
}

function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  const needle = `${name}=`;
  for (const chunk of cookieHeader.split(/;\s*/)) {
    if (chunk.startsWith(needle)) return chunk.slice(needle.length);
  }
  return null;
}

export default function middleware(request) {
  const url = new URL(request.url);

  // 1. Dev/QA override via ?v=a|b|c — takes precedence over any existing cookie
  //    so the CEO can force a variant on demand.
  const forced = url.searchParams.get("v");
  const forcedValid = forced && VARIANTS.includes(forced) ? forced : null;

  // 2. Existing cookie — returning visitors always get their prior variant.
  const existing = readCookie(request.headers.get("cookie"), COOKIE_NAME);
  const existingValid = existing && VARIANTS.includes(existing) ? existing : null;

  // 3. Fresh assignment for new visitors.
  const assigned = forcedValid ?? existingValid ?? pickRandomVariant();

  // Internal rewrite. Browser's address bar stays at `/`.
  const response = rewrite(
    new URL(`/_variants/${assigned}/index.html`, request.url),
  );

  // Pin (or refresh) the cookie so repeat visits stay on the same variant.
  // httpOnly=false because client-side analytics needs to read it to tag
  // GA4 + Meta Pixel events. The value is a single lowercase letter, not
  // personally identifying — no consent prompt required under GDPR/CCPA
  // functional-cookie exceptions.
  const cookie =
    `${COOKIE_NAME}=${assigned}; ` +
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}; ` +
    `Path=/; ` +
    `SameSite=Lax; ` +
    `Secure`;
  response.headers.append("Set-Cookie", cookie);

  // Useful debug header so the CEO can hit `/` in curl and verify the
  // assignment path without opening devtools. Stripped in production by
  // Vercel's edge pipeline is not automatic — so this stays visible. No PII.
  response.headers.set("x-variant", assigned);

  return response;
}
