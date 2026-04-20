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

**Risk:** fashion is visual. A zero-image hero is a conviction bet that *the word* — Fraunces italic at 240px — is more arresting than a full-bleed photo of a composed outfit. For a user who doesn't know Style.ai yet, no image means no anchor for what "quiet confidence" looks like on a body. The one-pull (`index.html:248–302`) still shows a real render on scroll, so the visual anchor arrives — but it's ~1.5 screens late. Brief §Concrete provocations #7.

**Conversion hypothesis:** faster LCP + rarer format = longer first-viewport dwell time. Target: CPA drops ≥25% on a 4G-throttled cohort; LCP hits 1.1s on Lighthouse mobile; `scroll_50` stays flat or lifts.

**Kill criterion:** if `scroll_50` drops ≥15% on mobile A/B in 72 hours, users aren't being pulled through. Cut.

---

## The ask

Which one gets a `hero/concept-{a,b,c}` branch? I can prototype two in parallel if two tie. My read: **B is the editorial moonshot**, **C is the conversion dark-horse**, **A is the safe A/B with a known upside**. If I had to pick one without your input I'd pick C — fastest to prototype, easiest to A/B, cleanest perf story, and the brief's own line *"conversion is the only scoreboard"* makes the zero-image hero the uncomfortable-but-honest bet.

I'd rather we argue about that than ship the comfortable choice.
