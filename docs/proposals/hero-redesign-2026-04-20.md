# Hero redesign — three concepts

**Date:** 2026-04-20
**Status:** proposal. No code. Awaiting the CEO's pick.
**Branch target (post-pick):** `hero/concept-{a|b|c}` off `claude/ux-brief-documentation-iuIiH`.

Each concept replaces the current hero at `index.html:110–189` only. Mirror (`197–240`) downward is unchanged unless noted. All three respect the brief's locked copy, banned words, stack, and perf budget (LH ≥95, LCP ≤1.8s on 4G, CLS ≤0.05, first-load JS ≤100KB gz).

---

## Concept A — Pinned verdict morph

**Emotional verb:** *seen in sequence.*

**Motion:** Between hero and mirror, the hero `<picture>` pins for ~200vh of scroll progress. Underneath, three real app verdicts crossfade on the same verdict stamp — `Today. Quiet confidence.` (the locked teaching string) → `Soft authority.` → `Bundled, composed.` Crossfade is `opacity 0 → 1` over 400ms per swap, 600ms hold, total 3s of pinned experience. Unpin fires an automatic scroll handoff into the mirror section using Lenis's existing smooth-scroll. Mobile (`< 768px`): no pin — instead, the three verdicts rotate in-place on the static hero every 1800ms for 3 cycles, then lock on `Today. Quiet confidence.`

**Copy strategy:** All three verdicts are real stylist outputs already in `src/main.js:439–445`. Promotes them from a hidden random-rotation easter egg into the primary teaching moment. Retires the random slot machine (`initVerdictRotation` can be deleted).

**Budget:** +1 IntersectionObserver for pin-detection, Motion One (~3.8KB gz) for the pin + crossfade timeline, no new image. Net JS delta: +3.8KB gz. Stays under the 100KB cap.

**Risk:** pinned scroll on mobile is a UX trap — we'd fall back to in-place rotation, which loses the "sequence reveals value" punch. Desktop-only pin means the A/B has to measure desktop and mobile separately. Brief §Concrete provocations #1 + #2.

**Conversion hypothesis:** users see three real outputs before scrolling, which answers the "is this varied?" objection earlier in the funnel. Target: `scroll_50` lifts ≥15% vs. baseline on desktop.

**Kill criterion:** if desktop `scroll_50` does not lift ≥10% in a 72-hour A/B at 50/50, cut.

---

## Concept B — Breathing hero + ink-wash bridge

**Emotional verb:** *watched back.*

**Motion:** Two layered effects.

1. **Breath** — the hero `<picture>` oscillates `scale(1.000) → scale(1.015)` and the `.grain-overlay` opacity oscillates `0.08 → 0.088` on a 6-second `ease-in-out` loop. Pure CSS keyframe on `<picture>` + `.grain-overlay`; no JS, no repaints beyond transform + opacity. Gated on `(prefers-reduced-motion: no-preference)`.
2. **Ink-wash bridge** — as the user crosses hero → mirror (scroll range 85%–105% of hero height), a paper-colored CSS-filter sweep (`backdrop-filter: brightness(1.08) saturate(0.94)` ramped by `clip-path`) travels bottom-to-top across the hero, leaving paper canvas behind. The mirror section is already paper — so the hero dissolves *into* the mirror visually. Feels like paper being dipped in water.

WebGL fragment shader only if the CSS filter fails the "dipping in water" read in prototype. If shipped, budget: ≤15KB compressed, one shader, gated on `(min-width: 768px) and (prefers-reduced-motion: no-preference)`.

**Copy strategy:** Unchanged. The hero stays `Today. Quiet confidence.` + pieces line. The effect is ambient; copy does not contort to accommodate.

**Budget:** CSS-only path adds ~40 lines of CSS, zero JS. WebGL path adds a 15KB shader + ~2KB loader, gated desktop-only. CSP at `vercel.json:54` permits self-hosted shader; no origin change needed.

**Risk:** breath read-as-video (autoplay aversion). The brief says "if anyone notices the animation, it's wrong" — the 1.5% scale + 0.008 opacity delta is at the edge of perception, but 6s loops have a tell on some monitors. Must test on a 60Hz phone and a 120Hz laptop side-by-side. Brief §Concrete provocations #3 + #6.

**Conversion hypothesis:** photographic realism creates attachment the product tour cannot. The user feels *watched back* for the first time before they've scrolled. Target: `scroll_90` lifts ≥10% and CPA drops ≥20%.

**Kill criterion:** if anyone in a 5-user hallway test says "is that a video?" — cut the breath. If CSS sweep reads as "transition effect" rather than "paper dipping," spike the WebGL path or cut the bridge.

---

## Concept C — Type-led zero-image hero

**Emotional verb:** *arrested.*

**Motion:** none on first paint. The hero is Fraunces italic `Today.` at `clamp(120px, 26vw, 240px)`, flush left, baseline of the word aligning with the vertical midline. Below, at the current hero scale (`clamp(40px, 10vw, 72px)`), `Quiet confidence.` in the same italic. No image. No grain. No ink-fade. Paper canvas. The masthead `ISSUE №01 · TUE · OCT 22` sits top-left as today. The CTA `Pull your first look →` sits bottom-center, unchanged. On scroll, the existing 600ms fade-up kicks in — same scroll-reveal signature already used everywhere.

**Copy strategy:** The hero *is* the copy. Locked fragments carry the full weight. This is Linear's playbook adapted to fashion: the word as the product's first impression.

**Budget:** *negative.* Removes the preloaded AVIF hero image (~18KB), removes `.grain-overlay` SVG (~2KB), removes `.ink-fade-*` CSS (~0.4KB). Estimated LCP on 4G: **1.1s** — well under the 1.8s brief cap. JS unchanged. This is the only concept that *improves* perf.

**Risk:** fashion is visual. A zero-image hero is a conviction bet that *the word* — Fraunces italic at 240px — is more arresting than a full-bleed photo of a composed outfit. For a user who doesn't know UKTI yet, no image means no anchor for what "quiet confidence" looks like on a body. The one-pull (`index.html:248–302`) still shows a real render on scroll, so the visual anchor arrives — but it's ~1.5 screens late. Brief §Concrete provocations #7.

**Conversion hypothesis:** faster LCP + rarer format = longer first-viewport dwell time. Target: CPA drops ≥25% on a 4G-throttled cohort; LCP hits 1.1s on Lighthouse mobile; `scroll_50` stays flat or lifts.

**Kill criterion:** if `scroll_50` drops ≥15% on mobile A/B in 72 hours, users aren't being pulled through. Cut.

---

## The ask

Which one gets a `hero/concept-{a,b,c}` branch? I can prototype two in parallel if two tie. My read: **B is the editorial moonshot**, **C is the conversion dark-horse**, **A is the safe A/B with a known upside**. If I had to pick one without your input I'd pick C — fastest to prototype, easiest to A/B, cleanest perf story, and the brief's own line *"conversion is the only scoreboard"* makes the zero-image hero the uncomfortable-but-honest bet.

I'd rather we argue about that than ship the comfortable choice.

---

## Update 2026-04-20 — superseded by a three-way live A/B/C

The CEO rejected the pick-one-concept framing. All three ship simultaneously and compete for live traffic. Decision rule logged in `DESIGN-DECISIONS.md` (2026-04-20 entry: *"Decision rule for the A/B/C test, written BEFORE it runs"*).

### How the traffic split works

One URL — `styledesigner.co.in/` — same as today. No ad-ops change. No creative triplication. Every Meta ad still points at `/`.

Vercel Edge Middleware (`middleware.js` at repo root) intercepts the root path and does three things before the browser gets any bytes:

1. **Reads a cookie.** Returning visitors always see their prior variant. The cookie is `sa_v`, first-party, 1-year, SameSite=Lax, value is a single letter (`a`, `b`, or `c`). No PII.
2. **Assigns new visitors.** Fresh visitors get a cryptographically random 33/33/33 split via `crypto.getRandomValues`. Independent of IP, UA, headers — so two people on the same office Wi-Fi get independent assignments.
3. **Rewrites internally** to `/_variants/{a|b|c}/index.html`. The address bar stays `/`. The user never sees a variant URL.

Override for QA: append `?v=a|b|c` to any URL to force and pin the variant in the browser. Useful for the CEO to preview each variant on the live deploy.

### How the variants are built

`scripts/build-variants.mjs` runs in both `npm run dev` and `npm run build` `prebuild`. It reads `index.html` at repo root and generates `_variants/a/index.html`, `_variants/b/index.html`, `_variants/c/index.html`. Each output is byte-identical to the source except:
- `<html lang="en" class="bg-paper" data-variant="X">` stamped so client-side analytics can read the variant without a cookie parse.
- `<meta name="robots" content="noindex, nofollow">` injected after the canonical link.
- A leading HTML comment flagging the file as generated.

Vite picks up the three variants as additional rollup inputs (`vite.config.js:123–126`), so asset hashes and bundling stay consistent across all four outputs (`index.html` + three variants).

**Right now, all three variants = the current hero.** That's intentional. A is the control (shipping today). B and C stay as copies of A until a follow-up session prototypes the breathing-hero + zero-image heroes on `hero/concept-b` and `hero/concept-c` branches, CEO reviews the motion on Vercel previews, and only then replaces the hero `<section>` inside `_variants/b/index.html` and `_variants/c/index.html` (or — cleaner — modifies `build-variants.mjs` to swap in concept-specific hero fragments).

### How the data flows to the winner

`src/main.js` reads `data-variant` once at module scope (falls back to the `sa_v` cookie) and tags every GA4 `event` + Meta Pixel `track` call with `variant: 'a'|'b'|'c'`. The instrumentation is live regardless of whether the concepts are prototyped — so the day variant B's hero ships, the day's traffic already carries the variant attribution.

Three Meta **custom conversions** (to be created in Meta Events Manager before the test runs) filter on the `variant` param: `InitiateCheckout_VariantA`, `_VariantB`, `_VariantC`. Each becomes a selectable column in Ads Manager — cost-per-custom-conversion-per-variant falls out natively with no spreadsheet work.

GA4 needs `variant` registered as a custom dimension (property-level setting, no code change). Once registered, every report can split by it.

### When a winner is called

Per `DESIGN-DECISIONS.md`: 14-day minimum, 1,000 visitors / 100 conversions per variant floor, 95% statistical confidence on CPA. Stop-early kill switch pauses any variant running ≥20% worse than average after 500 visitors.

### Cleanup

When we have a winner, it's a one-line edit to `middleware.js` (hard-pin `assigned` to the winning letter). A follow-up PR deletes the middleware, the variant build step, and the losing HTML. The site returns to static-only with no edge overhead. Reversible.
