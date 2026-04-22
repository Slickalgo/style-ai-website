# Site audit — entry fee

**Date:** 2026-04-20
**Target:** the current homepage + motion layer, before the hero redesign pitch.
**Method:** source read on `index.html`, `src/style.css`, `src/main.js`, `tailwind.config.js`, `vercel.json`. No devtools, no Lighthouse runs — just receipts from the codebase.

The brief asks for five things working and five things not. Receipts below. Every claim points to a file and a line range.

---

## Five things working

### 1. Verdict stamp as focal point — `index.html:162–169`

The hero's `<h1 id="hero-verdict">` lands at `clamp(40px, 10vw, 72px)` with `line-height: 1.02` and `-0.015em` tracking (`src/style.css:119–123`). Fraunces italic at maximum optical force. The copy — `Today. Quiet confidence.` — teaches the format on first load. Nothing competes: ink-fade-bottom pulls the image to 55% opacity (`src/style.css:228–239`), verdict reads foreground, stagger delay of 200ms means the masthead arrives first and the eye has hierarchy before the verdict hits.

### 2. Mirror triple negation as counterpoint — `index.html:197–240`

After the hero's full-bleed ink canvas, the mirror is paper, spacious, and the first moment of *texture*. Three negations (`Not the trench. Not the dress. Not the one you wore on Thursday.`) at `clamp(28px, 7.5vw, 44px)` Fraunces italic, each its own `.site-sr-item` with 120ms stagger. The stone rail (2px pseudo-element, `src/style.css:154–165`) signals a margin mark without visual weight. Teaches what Style.ai is *not* before showing what it is — a structurally smart pause in the funnel.

### 3. One-pull as proof, not repeat — `index.html:248–302`

The second full-bleed render is a different render, a different mood (`Soft authority.` on Thursday, warm undertone), and introduces the *whisper* — `Your undertone reads warm; this palette agrees.` This is the first time the site explains the stylist's logic in the user's voice. The shift from *teaching* (hero + mirror) to *proving* happens without ceremony; lazy-loaded so mobile users don't pay for it until they've engaged.

### 4. Scroll-reveal as single motion idiom — `src/style.css:357–370`

One animation signature across six sections: `translate3d(0, 1.5rem, 0)` to `0`, `opacity 0 → 1`, 600ms, `cubic-bezier(0.22, 1, 0.36, 1)`, per-item delay via `--site-sr-delay`. No parallax, no scroll-linked effects, no springs. Consistency makes the motion invisible — users stop noticing the *motion* and start noticing the content. Reduced-motion users get 200ms opacity-only, not a degraded experience.

### 5. AVIF / WebP / PNG chain with preloaded hero — `index.html:40`, `117–126`

Hero LCP candidate is preloaded as AVIF in `<head>`. `<picture>` serves AVIF → WebP → PNG. `fetchpriority="high"`, `decoding="async"`, Fraunces italic `font-display: optional` so font lateness never blocks LCP. Image pipeline in `scripts/optimize-images.mjs` quality-tunes AVIF at 55 / WebP at 82. Baseline 2.2s LCP on 4G clears the brief's 2.5s threshold.

---

## Five things not working

### 1. Verdict rotation is a random slot machine — `src/main.js:439–493`

`const VERDICTS = [...]` of five strings (line 439–445). On return-to-top, `VERDICTS[Math.floor(Math.random() * VERDICTS.length)]` (line 480). Zero curation, zero personalization, zero A/B instrumentation. The brief's own inline comment says: *"Never rotates more than once per page load to avoid the slot-machine feel"* (line 437) — and yet `Math.random()` is the selection function. It isn't a slot machine only because it fires once; the mechanism is still pure chance. The rotation is also triggered on return-to-top, which is a *friction* direction in the funnel. We're spending motion tax on a feature that doesn't serve conversion.

### 2. Sticky CTA duplicates the hero conversion moment — `src/main.js:411–430`, `src/style.css:387` (fixed bottom-right pill)

The sticky pill shows when `hero.intersectionRatio < 0.4`. By that point the user has already seen the hero CTA and chose to scroll. Re-surfacing the same `#your-turn` target creates attribution noise (is the click organic or stuck-CTA?) and steals ~10% of right-edge viewport on mobile. No A/B data justifies the 40% threshold. If the hero CTA converts, duplicating it doesn't lift; if it doesn't, duplication doesn't fix it.

### 3. `.whisper` at 62% opacity burns mobile reading budget — `src/style.css:127–133`

`color: rgba(13, 11, 10, 0.62)` on paper canvas. Semantic intent is "tertiary hum," but the whisper carries *explanation* copy — e.g., the one-pull's `Your undertone reads warm; this palette agrees.` (`index.html:297`) and the how-she-works beat bodies. That's not tertiary, that's the thing that makes the stylist feel like a stylist. On 390px mobile at scroll speed, 62% opacity on Fraunces italic at `clamp(13px, 3.6vw, 15px)` is a skip-read. We're muting the copy that earns the install.

### 4. Stone rail is decoration without conviction — `src/style.css:154–165`

Eight lines of CSS for a 2px pseudo-element. The rail doesn't bind to a progress state, a focus state, or any interaction. Mirror and how-she-works read identically without it. It's a restraint signifier — "look, we know what a magazine margin looks like" — but a signifier isn't a decision. Either promote it to structural (e.g., a per-section progress indicator that fills as the section enters view) or drop it. Neutral decoration is a tell that we didn't push the design hard enough.

### 5. A-Week section is desktop-first despite brief's "mobile first actually" — `index.html:407–513`

The grid container is `flex max-w-prose flex-col gap-20 sm:max-w-none sm:grid sm:grid-cols-2 sm:gap-x-16 sm:gap-y-28` (line 408). Mobile default caps at `max-w-prose` (520px) then blows out to full-width grid at `sm:`. Four figures at `.aspect-[2/3]` on 390px mobile means each image is ~350×525, which dominates a single viewport; the CTA at the bottom is 4 viewports away. No figure-level offset, no masonry stagger, no mobile-specific alternative to the desktop grid. The brief says 390×844 is the canvas and Meta is mobile-native — this section squanders both.

---

## Summary

| Theme | Working signal | Failing signal |
|---|---|---|
| Focal hierarchy | Verdict stamp; ink-fade scrim | — |
| Editorial pause | Mirror negations; stone rail *idea* | Stone rail *execution* |
| Proof → install | One-pull whisper voice | Sticky CTA duplication |
| Motion craft | Single-idiom fade | Random verdict rotation |
| Performance | AVIF/WebP + font-display optional | — |
| Mobile canvas | Hero is mobile-sound | A-Week is desktop-first |
| Legibility | Verdict/pieces contrast strong | `.whisper` 62% opacity too muted |

**Read:** the editorial baseline is earned. The failures are ornament-for-ornament's-sake (rotation, stone rail), redundancy (sticky CTA), and one layout that forgot the canvas (A-Week). The hero redesign should fix the first three by omission and keep A-Week for a later pass.
