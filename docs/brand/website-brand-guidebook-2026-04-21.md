# UKTI — Website Brand Guidebook

**Date:** 2026-04-21
**Scope:** `styledesigner.co.in` — the home page, the ad landers (`/how-she-works`, `/the-looks`), the 16 SEO guide pages, and any future A/B/C variant proposed on top of them.
**Audience:** every agent, designer, or contributor proposing a new variant, redesign, copy change, or motion on the website.
**Status:** authoritative. If you disagree with a rule, add a dated entry to `DESIGN-DECISIONS.md` explaining why. Do not edit the rules silently.

---

## How to use this book

Read it once cover to cover before you touch a file. Then keep it open while you design.

Every rule in here has two parts: the **brand axiom** (what taste demands) and the **product reality** (what survives contact with real users). When the two disagree — and they will — the rule shipped is always the reality version, not the axiom version. The axiom is what we *mean*; the reality is what we *do*.

The commonest failure mode in this project is a brand instinct overriding product sense: theatrical exits, hard-stops on user actions, over-minimal onboarding, copy so elliptical it reads as broken. When you catch yourself writing the more beautiful option, stop and ask whether it works for a user who has 7 seconds and a 4G connection. If it doesn't, the less beautiful option is the right one. Authority is not restriction. Authority is tone plus consistency.

---

## Table of contents

- [I. The Creative Constitution](#i-the-creative-constitution)
- [II. The Reality Layer](#ii-the-reality-layer)
- [III. Voice — the locked grammar](#iii-voice--the-locked-grammar)
- [IV. Visual System](#iv-visual-system)
- [V. Motion & Interaction](#v-motion--interaction)
- [VI. Section Patterns — the six movements](#vi-section-patterns--the-six-movements)
- [VII. The Learning Loop](#vii-the-learning-loop)
- [VIII. Error & Edge States](#viii-error--edge-states)
- [IX. What's Banned — the will-never-appear list](#ix-whats-banned--the-will-never-appear-list)
- [X. How to Propose a Variant](#x-how-to-propose-a-variant)
- [XI. Appendix — tokens, copy fragments, file map](#xi-appendix--tokens-copy-fragments-file-map)

---

## I. The Creative Constitution

### The thesis, one sentence

**UKTI is a quiet authority. She has already decided. She is telling you the answer.**

The user is not browsing. Not comparing. Not optimizing. The user is being read, then told. The site is the first whisper of that voice — the moment a stranger on a train stops scrolling because the page in front of them does not sound like every other page.

### Point of view

**Taste is a subtraction, not an addition.**

If a proposal adds a thing, it is probably wrong. If a proposal removes a thing and the page still works, ship it.

### What the brand refuses to be

- A tool, an assistant, an engine, an AI, a styling service, a wardrobe platform, a fashion app. Every one of those words is a synonym for "something you operate." We are not something you operate.
- A product tour. The site does not show features. It shows the thing itself.
- A comparison. We do not name what we are better than. We do not position against anything. A magazine does not compete with other magazines by listing the other magazines' faults.
- A funnel. We do not beg. We do not A/B test urgency copy. We do not use timers, counters, or scarcity language.

### What the brand insists on

- **One.** One verdict per morning, one image per verdict, one sentence per beat, one beat per viewport, one CTA per issue, one issue per user, one conviction per page.
- **First-person stylist voice.** The stylist speaks. She says "I." She observes — "soft authority" — she does not aspire — "look your best." If a sentence could appear under a stock photo on LinkedIn, it dies.
- **Editorial restraint as product design.** Every button removed is a vote for the reader. Every grid collapsed is a vote for the reader. Every apology or explanation deleted is a vote for the reader.
- **Photography as the primary interface.** The render is the decision. Copy frames the image; the image is the thing.
- **Silence between beats.** Whitespace is content. The first 60–80% of horizontal space is empty more often than it is not.

### The single governing question

For every proposal: *would a reader of The Gentlewoman, flipping through Frieze on a rainy Sunday, see this and decide to subscribe?*

If yes, keep going. If no, cut it.

---

## II. The Reality Layer

The Creative Constitution is the north star. The Reality Layer is what we actually ship. Below are the six rules that keep the brand from becoming beautiful-but-broken.

### Rule 1 — Authority is not restriction. Degrade gracefully.

**Axiom:** The stylist decides.
**Reality:** Users will reject looks, want variation, and will not wait 24 hours. A product that hard-stops at the third "no" feels like punishment, not taste.

**Do:** Allow the secondary action (swipe down / "another pull") without a hard ceiling. After three rejections in quick succession, soften rather than block: *"Let's leave it here. Come back later."* — with one more pull still available if the user insists. The tone signals that three rejections is rare, not forbidden.

**Don't:** Cap the user's session behavior with a *no*. The word *no* does not appear from the brand to the user. From the brand's mouth, the worst outcome is *later*.

### Rule 2 — Never break session continuity.

**Axiom:** Failure can have dignity.
**Reality:** If the app closes itself, the user thinks the app crashed. Trust dies in the next five seconds.

**Do:** On error, stay on screen. Show a fallback look or a retry — in the voice. *"This one didn't land. Let me try again."*

**Don't:** Auto-dismiss, auto-close, or force a redirect. The app — and the site — never takes control away from the session. Authority comes from tone, not from forcing the user's hand.

### Rule 3 — Silence beats a wrong insight.

**Axiom:** The stylist notices. *"You wear black on Thursdays."*
**Reality:** If the insight is wrong, the brand loses its most important asset in one line.

**Do:** Only show learned patterns when confidence is high. If confidence is low, the beat is silent — the page simply doesn't have that line today.

**Don't:** Ship probabilistic observations as if they were facts. The memory beat is rare and right. Missing once is forgivable; wrong once is not.

### Rule 4 — Context specificity beats generic fragments.

**Axiom:** *"Reading you. Pulling the knit. Waiting on the light."*
**Reality:** Generic fragments become "fancy loading text" — the thing we were trying to avoid.

**Do:** Make the voice react to what the user gave us. Context in, context out. If the user said *dinner at home*, the loading monologue references dinner. If the user's stored profile skews soft, the fragments skew soft. Specificity is what makes this magic instead of UI.

**Don't:** Ship generic copy that reads the same on day 1 and day 100. If the stylist sounds canned, she is canned.

### Rule 5 — Minimal, but not silent.

**Axiom:** Nine words of onboarding. One-sentence CTAs. No tours.
**Reality:** Over-minimal reads as broken. A user who doesn't understand what they're being asked to do will drop off.

**Do:** Strip until you reach the last line that still makes the next action obvious. *"Send me a photograph. / I'll dress you from tomorrow."* — two lines, zero ambiguity. That's the floor.

**Don't:** Remove the line that tells the reader why they're doing what they're doing. Confidence is not the same as mystery. Apple's product pages are minimal, not silent.

### Rule 6 — Brand instinct vs. product instinct.

**The tell:** A proposal feels beautiful. It also feels like it would make a real user frown, pause, or tap away.

**The heuristic:** If the more beautiful option would surprise a Meta-ad visitor on 4G at a bus stop in a way they weren't expecting, the less beautiful option is probably right. The brand's job is to surprise visitors in the ways they already wanted to be surprised — not to confuse them.

Theatrical exits, forced pauses, hidden affordances, one-word buttons that don't name the action — these are brand instincts. Staying in the session, naming the next step, offering a retry, respecting reduced-motion — these are product instincts. A top-1% site needs both, in that order: product sense first, brand flourish second.

---

## III. Voice — the locked grammar

### Sentence shape

Fragments. Period-terminated. Observational, not aspirational.

```
✓ Soft authority.
✗ Look your best.

✓ Today. Quiet confidence.
✗ Feel confident today!

✓ Not the trench. Not the dress.
✗ Discover your perfect outfit.

✓ She is composing.
✗ Generating your personalized look...
```

### Tense and person

- **First person — the stylist.** *"I'll dress you."* Rare, used where warmth beats observation.
- **Third person observational — the magazine.** *"She reads you. She pulls one."* Default.
- **Never second-person marketing.** *"You'll love how…"* is banned.

### Read-aloud test

Before any copy ships: read it aloud. If it sounds like a LinkedIn product post, an onboarding tour, or a SaaS modal, it dies. The test catches almost every miss. No exceptions because "we can't think of anything better" — if you can't think of anything better, cut the line.

### Voice by context

**Section eyebrows (mono caps):**
```
ISSUE №01 · TUE · OCT 22
ISSUE №02 · WED · OCT 23
SECTION — THE MIRROR
SECTION — A WEEK
```
Mono, uppercase, letter-spacing 0.18em. Dates in the stylist's date format (day abbreviated, month abbreviated, date number — never "October 22nd, 2026").

**Verdicts (Fraunces italic):**
```
Today. Quiet confidence.
Soft authority.
Bundled, composed.
Quiet, steady.
Unhurried.
```
Two words max, rare three, period always. "Today." prefix appears only on the first-visit teaching stamp; subsequent rotations drop it.

**Section beats — the mirror (Fraunces italic, stacked):**
```
Not the trench.
Not the dress.
Not the one you wore on Thursday.
```
Three period-terminated negations, staggered fade-in. Each one is observational — the stylist is naming what the user is *not* wearing today. The emptiness is the content.

**Section beats — how she works (Fraunces italic verbs):**
```
She reads you.
She pulls one.
You come back tomorrow.
```
Three sentences. Three verbs. That is the mechanism. Never a feature grid.

**Pieces line (Fraunces regular, not italic):**
```
Camel knit. Black denim. Brown loafers.
```
Fragments. Period after each. Three items is the default; two is acceptable if the outfit is that spare; four is almost never right.

**CTAs — the ask:**
```
✓ Pull your first look →
✓ Continue tomorrow's issue.
✓ Hold this for later.

✗ Get started
✗ Sign up free
✗ Try now
✗ Start your free trial
```
The CTA can be a sentence, not a word. A magazine does not say "Subscribe!" on its cover. It says *"Continue tomorrow's issue."*

**Errors (stamps, not apologies):**
```
✓ The light was not enough. Again, by a window.
✓ She is composing. Try again after breakfast.
✓ The issue will print when you are ready.  (offline state)
✓ This one didn't land. Let me try again.    (retry-in-place)

✗ Something went wrong.
✗ Error: Unable to process your request.
✗ Please check your connection and try again.
```

**Empty states — never apologize:**
```
✓ An outfit arrives when the stylist has met you. One photograph is enough.
✓ She is waiting.

✗ No results found. Try a different search.
✗ Nothing here yet!
```

**Notifications — exactly one voice:**
```
✓ Today. Quiet confidence.
✓ Issue №47 is ready.

✗ Your outfit is ready! ✨
✗ Don't miss today's style!
```

### Voice guardrails (from the CEO brief — banned forever)

Words:
- "AI-powered"
- "Personalized"
- "Seamless"
- "Transform"
- "Revolutionary"
- "Experience" (as a noun for the product)
- "Your fashion assistant"
- "Let AI choose for you"
- "Powered by AI" / "AI technology" / any variant
- "Smart" / "intelligent" / "advanced"
- "Curated just for you" / "tailored to you"

Intensity adverbs:
- "truly"
- "incredibly"
- "deeply"
- "beautifully"

Structural tells:
- "With [product], you can..."
- "[Product] helps you..."
- "Join thousands of..."
- "Never [negative]... again!"

---

## IV. Visual System

### Color

A five-color world. Never a sixth. If a designer asks for one, the edge case is wrong.

| Token | Hex | Emotional register | Use |
|---|---|---|---|
| **Paper** | `#F5F1EA` | A cotton shirt washed fifty times. Morning light on plaster in Naples. The endpaper of a first edition. | Default canvas for most sections. Text when on ink. |
| **Ink** | `#0D0B0A` | Letterpress, not black. Absorbs light. The hem of a navy suit folded since yesterday. | Hero and closing section backdrops. Text when on paper. |
| **Stone** | `#A89B8A` | The margin mark, the pencil gloss, the hairline beside the paragraph. | Eyebrows, dates, rails, ambient meta. |
| **Ember** | `#A7412A` | The risk. One per page. | Verdict-stamp tint at 25%, selection color, rare emphasis. Never a button. Never a label. |
| **Clay** | `#C6B5A3` | Warm neutral. Held in reserve. | One gradient wash per week. Rare by design. |

**Contrast:**
- Paper text on ink canvas: full opacity `#F5F1EA` for hero verdict; `.72` alpha for whisper prose.
- Ink text on paper canvas: `#0D0B0A` direct, or `.82` alpha for body prose.

**Selection (`::selection`):** ember at 25% opacity — the warmest, rarest flourish the browser gives us.

### Typography

Three faces. Two weights. No more.

| Face | Role | Where it lives |
|---|---|---|
| **Fraunces 400 italic** | The stylist's voice. The signature. | Verdicts, whispers, headlines, section openers. Never labels, never captions. If Fraunces italic is on the page, someone with authority is speaking. |
| **IBM Plex Mono 400 / 500** | The marginalia. | Eyebrows, dates, page numbers, rails, CTA pill labels. Typewriter register. Signals "drafted, not generated." |
| **System-UI** | Paper under ink. | Long-form prose only — guide pages, privacy, terms. Marketing sections use Fraunces italic + Plex Mono, not system-UI. |

**Self-hosted:** [public/fonts/](../../public/fonts/) — Fraunces-400, Fraunces-400-italic, IBMPlexMono-400, IBMPlexMono-500. No Google Fonts CDN. The italic face is preloaded with `font-display: optional` because verdicts are LCP-critical and swap-flash reads worse than a fallback.

**Scale — extreme contrast, no middle.**

| Step | Size | Face | Use |
|---|---|---|---|
| Hero verdict (marketing site) | `clamp(40px, 10vw, 72px)` | Fraunces italic | First visible copy |
| Concept C marketing display | `clamp(120px, 26vw, 240px)` | Fraunces italic | Type-led hero variant only |
| Section verdict | `clamp(32px, 8.2vw, 56px)` | Fraunces italic | Mirror, one-pull, how-she-works |
| Whisper | `clamp(13px, 3.6vw, 15px)` | Fraunces italic | Sub-verdict ambient text |
| Pieces | `clamp(14px, 3.8vw, 16px)` | Fraunces regular | Outfit captions |
| Eyebrow | 10px | Plex Mono, uppercase, ls 0.18em | Issue numbers, section names |

**The 18–32px range is banned from marketing surfaces.** That range reads as UI. Every surface in this guidebook lives either below 16 or above 32.

### Layout

- **One idea per viewport. Never two.**
- **Left-aligned by default.** Centered type is for wedding invitations and SaaS hero sections. We are neither.
- **Asymmetric rhythm.** Masthead top-left, verdict lower-middle, CTA bottom-center. These positions are choreography, not a grid.
- **Density: one noun per 100px.** If you can read everything in the viewport at a glance, cut content until you can't.
- **60–80% whitespace** on any given viewport. If the composition looks balanced, it is probably too dense.
- **Mobile first — 390×844 is the canvas.** Design at 390 wide and let the layout spread upward. Never design desktop-first and compress.
- **No horizontal scroll** except the designated A-Week lookbook (if shipped). `html { overflow-x: hidden; }` is the safety net.

### Image treatment

- **Only real renders.** No stock. No model photography. Ever.
- **One hero image per page.** The image is the decision, not decoration.
- **Paper-textured atmosphere.** 8% warm grain overlay (`public/noise.svg`) on every full-bleed render. Photographs must look *printed*, not rendered. If a render reads as CG-clean, kill it or regrain it.
- **Ink-fade edges** on ink-backdrop heroes: top gradient 0.45 → 0 over 220px; bottom gradient 0.88 → 0 over 55% of section height. Legibility for the overlaid verdict.
- **Lighting: golden-hour indoor, one source.** Never studio. Never overhead fluorescent. Never harsh side-light.
- **No lifestyle context, no backgrounds, no people doing activities.** The outfit is the subject; the room is neutral or absent.
- **Composition: single figure, centered or offset-left.** Frame tight enough that the pieces are legible but loose enough that the figure has space to breathe.

### Hairlines

- **Stone rail** is the only hairline — 2px, `#A89B8A`, vertical, used as a margin mark on the mirror and how-she-works sections. See [`.stone-rail`](../../src/style.css) in the stylesheet.
- **No box borders.** No card shadows. No rounded corners beyond the CTA pill's `999px`.

### Tokens — authoritative source

Colors and type tokens are defined in [`tailwind.config.js`](../../tailwind.config.js). Editorial helpers (`.verdict`, `.eyebrow`, `.whisper`, `.pieces`, `.stone-rail`, `.hand-card`, `.grain-overlay`, `.ink-fade-top/bottom`, `.cta-pill`) live in [`src/style.css`](../../src/style.css). If you need a new token, first try to compose from these — most needs resolve by using one of them at a different size or opacity.

---

## V. Motion & Interaction

### The register

**Unhurried.** Every motion in the editorial surface reads as slower than a SaaS page. Never a spring-bounce. Never a snap. Motion is editorial, never functional.

**Durations, locked:**
- **Ambient / atmospheric** (breath, grain, section transitions): 1.8–2.6s, or much longer (6s for the breathing hero variant).
- **Intent / entry** (scroll-reveal, verdict stamps, CTA arrival): 420–600ms.
- **Never below 200ms** except for `::selection` and `cta-pill:active` (180ms fade — physical feedback only).
- **Easing default:** `cubic-bezier(0.22, 1, 0.36, 1)` — a soft-out curve. This is the site's single signature easing, used for all scroll-reveals. Do not introduce a second easing without documenting why.

### The single motion idiom — scroll-reveal

One motion pattern does almost all the work on the site: **bottom-to-top reveal on section entry.**

- Items get `class="site-sr-item"`; sections get `class="site-sr-section"`.
- Initial state: `opacity: 0; translate3d(0, 1.5rem, 0)`.
- Revealed state: `opacity: 1; translate3d(0, 0, 0)` with 600ms of `opacity` + `transform` transition, delayed by a per-item `--site-sr-delay` CSS variable for the stagger.
- See [`src/style.css`](../../src/style.css) lines `.site-sr-section` onward.

The hero's items auto-reveal on load (80ms + idx × 120ms stagger). Non-hero sections reveal on `IntersectionObserver` entry. Reduced-motion users get a 200ms crossfade with no translate. See [`src/main.js`](../../src/main.js) `initSiteScrollReveal`.

### What motion is allowed

- Entry / arrival (scroll-reveal, verdict stamp into place).
- Scroll-driven editorial effects that unfold over hundreds of pixels (the Concept B ink-wash bridge, an Apple-style pinned transition — but only if the effect serves the narrative, not the showreel).
- Ambient loops that stay below the threshold of perception (the Concept B hero breath — 1.5% scale, 6s — if you notice the animation obviously, it's wrong).
- Selection feedback: `opacity` + `scale(0.98)` on `cta-pill:active`. 180ms. Physical tap response only.

### What motion is banned

- **Hover-scale on anything** (buttons, cards, images). Hover is desktop-only and decorative.
- **Tap-ripples.** Material Design tells.
- **Spinners, percentages, "generating…"** — see the Reality Layer, §II Rule 4.
- **Parallax backgrounds.** Parallax reads as web-design tutorial, not magazine.
- **Spring-bounce easings** (`cubic-bezier(0.68, -0.55, 0.27, 1.55)` and kin). The site does not boing.
- **Snap scrolling.** The page scrolls as smoothly as the user's device allows; we don't fight it.
- **Motion that depends on cursor position** (cursor-following gradients, custom cursors beyond the editorial stylist-pencil dot). The ember-cursor idea stays parked unless explicitly approved per-concept.
- **Auto-playing video.** Ever.

### Reduced-motion

**Always respected.** Every motion rule in every variant must collapse under `@media (prefers-reduced-motion: reduce)`. The reduced-motion read:
- No transforms, only opacity fades — usually 200ms.
- No ambient loops (breath, wash).
- No scroll-driven reveals beyond a simple crossfade.

If a concept cannot degrade gracefully under reduced-motion, the concept is not shippable on this site.

### Session continuity (Reality Layer mirror)

On the website, the equivalent of "app never takes control" is:
- **No exit-intent popups.**
- **No "are you sure you want to leave?" modals.**
- **No auto-scrolling to sections the user didn't scroll to.**
- **No cookie banners larger than one line.**
- **No hamburger menus, no nav bars — the CEO brief locks this, we ratify it here.**
- **No forced fullscreen, no pointer-lock, no autoplaying audio.**

The site does not fight the reader. The reader scrolls; the site responds.

---

## VI. Section Patterns — the six movements

The home page is structured as a single magazine issue: six movements, no navigation, scroll is the only interaction. Each section has an emotional verb, a canvas tone, and a rule it must not break.

### 1. Hero — *seen*

**Canvas:** ink.
**Emotional verb:** the reader feels *seen*.
**Composition:** masthead top-left (`ISSUE №…`), full-bleed real render, verdict stamp + pieces line bottom-third, one CTA pill below.
**Rule:** one verdict, one image, one CTA. If you are adding a second anything, you are wrong.
**Copy grammar:** verdict is two words + period. Pieces is three fragments + period each.
**What breaks it:** a headline over the image, a secondary CTA, a logo-lockup, the word "AI" anywhere.

### 2. Mirror — *recognized*

**Canvas:** paper.
**Emotional verb:** the reader feels *recognized*.
**Composition:** stone rail on the left, three stacked Fraunces italic negations, staggered fade-in. No image.
**Copy:** `Not the trench. Not the dress. Not the one you wore on Thursday.`
**Rule:** the emptiness is the content. Do not fill it.
**What breaks it:** adding an image to balance the section, changing the negations to affirmations, introducing a fourth line.

### 3. One pull — *shown*

**Canvas:** ink (second full-bleed render).
**Emotional verb:** the reader feels *shown*.
**Composition:** a second real render + a single Fraunces italic caption. No verdict — the caption is the voice.
**Copy:** observational, one sentence. Example: *"The knit does the work. The denim disappears."*
**Rule:** the caption is the stylist thinking, not selling.
**What breaks it:** a second image (this is the one-pull section, not the lookbook), a list of pieces here (that belongs in hero), marketing copy pretending to be editorial.

### 4. How she works — *understood*

**Canvas:** paper.
**Emotional verb:** the reader feels *understood*.
**Composition:** three Fraunces italic verbs stacked with stone-rail dividers between them.
**Copy:** `She reads you.` / `She pulls one.` / `You come back tomorrow.`
**Rule:** three lines, three verbs. Never a feature grid. Never icons. Never numbered steps.
**What breaks it:** four lines, icons, an explainer sentence under each verb, the word "how" in any heading.

### 5. A week — *remembered*

**Canvas:** paper.
**Emotional verb:** the reader feels *remembered*.
**Composition — current:** four real renders in a lookbook row (horizontal scroll-locked on desktop, vertical stack on mobile).
**Composition — proposed (see §X, variant process):** replace the 4-up grid with **one backward memory beat** — a single line in Fraunces italic plus one thumbnail. *"Last Tuesday, you wore brown."* Memory, not inventory.
**Rule:** if the section reads as a grid of past looks, it has drifted into feature-grid territory. Memory is the register, not inventory.
**What breaks it:** captions under each thumbnail, a "see all" link, a carousel dot indicator.

### 6. Your turn — *invited*

**Canvas:** paper.
**Emotional verb:** the reader feels *invited*.
**Composition — current:** handwritten-style note card + App Store / Google Play pills.
**Composition — proposed (see §X):** the handwritten note is a product moment and belongs *inside* the app, not on marketing. Replace with one sentence ask and two mono-caps store links — no pill on the ask itself, just the store marks.
**Copy:** `Continue tomorrow's issue.` Below: `ONE OUTFIT · EVERY MORNING · NO ADS`
**Rule:** no exclamations. No urgency. No "free trial" language. The ask is a sentence, not a shout.
**What breaks it:** a "limited-time offer," a countdown, testimonial stars, an email-capture form on this surface.

### The footer

Five mono-caps links and the brand mark. That's it. No newsletter signup. No social icons. No "follow us on Instagram." The site is not a hub; it is a single issue.

Currently: `PRIVACY · TERMS · HOW SHE WORKS · THE LOOKS · [UKTI mark]`. If any link is added, one must be removed — the list of five is a constraint.

---

## VII. The Learning Loop

The product is evolving behind the surface — the model tunes, the stylist's choices improve, the pull gets closer to right over time. The website and app must communicate that *without explaining it*.

### The voice of learning

The stylist learns. She does not announce what she learned. She just acts slightly differently on the next visit.

**Signals, in the stylist's voice:**

```
Noted.
Closer.
That worked.
Keeping it.
A little quieter today.
Warmer than yesterday.
Remember.
```

Each is a Fraunces italic fragment. Period-terminated. No adjectives of intensity. No "Great!" / "Awesome!" / "You're all set!"

### Where these appear on the website

The marketing site does not directly show learning (the visitor has no history). But the *idea* of learning is sold in one place: **the weekly memory beat in §VI.5** — *"Last Tuesday, you wore brown."* That single line, seen on the home page, plants the promise that the product remembers.

In ad-lander variants specifically targeting returning users, the memory beat may be the primary hero. Example:

```
Hero variant — returning visitor:
  Last Tuesday, you wore brown.
  Tomorrow, I'll try something new.
```

That is a hero that says *we know you*. It is earned by past sessions. If we can identify a returning visitor (via the `sa_v` cookie or a future identity hook), we may show this variant. If we cannot, we do not fake it.

### The progression cue

The issue number is the learning visible. `ISSUE №01` becomes `№02` becomes `№47`. The number itself is evidence that the relationship has accumulated. Never "Day 47" — *issue* carries weight that *day* does not.

### Rule

**Never explain what she learned.** The fact of learning is the signal. If the copy says *"I noticed you prefer warm tones, so today I pulled…"* — kill it. The stylist's authority comes from not showing her work.

---

## VIII. Error & Edge States

Errors are opportunities. Most products apologize. We stamp.

### The three rules

1. **Never break session continuity.** Stay on screen. Offer a retry. The page does not close, redirect, or blank.
2. **Silence beats a wrong insight.** When confidence is low on a learned observation, do not ship it.
3. **In the voice, always.** If the error reads as developer copy, it dies.

### Patterns

**Image fails to load (hero render):**
- First try: silent retry. The page holds its placeholder for up to 2 seconds longer.
- Second try: show the render at a lower resolution if the CDN has one.
- Final fallback: replace the render with a paper-canvas block. The verdict and pieces lines still render. No broken-image icon, ever. The page still reads as an issue, just a sparer one.

**Server error during the first-visit install flow (marketing site → App Store tap):**
- The store-click tracking already fires on tap ([`src/main.js:264`](../../src/main.js)). If the store-link URL is empty or errors, the click still counts but the user sees no action.
- Better: the fallback URL already defined ([`src/main.js:38–41`](../../src/main.js)) opens a search on the store. That degradation is silent and intentional. Keep it.

**Offline (marketing site):**
- The site is static HTML cached by the browser. The first visit requires a network. On subsequent visits, if the network drops mid-scroll, nothing breaks — the cached HTML renders fully.
- If a form must be submitted and network fails, a single Fraunces italic line: *"The issue will print when you are ready."* No toast, no modal. The line replaces the form field text.

**Consent declined:**
- Handled at [`src/main.js:239–256`](../../src/main.js). The consent bar is removed and no analytics load. No follow-up prompt. The site functions identically, we just receive no data from the session.

**JavaScript disabled:**
- The site degrades to a scrollable magazine with no motion and no tracking. Every section is readable. CTAs link to the store anchor (`#your-turn`). Scroll-reveal items appear with their base `opacity: 1` (the styles are configured so the `site-sr-item` revealed state is the default in reduced-motion and with JS disabled).

**Reduced-motion:**
- Every motion collapses to a 200ms crossfade or no motion at all. Every variant is expected to pass this check.

**The CEO brief's explicit edge rules — amended here:**

- "No spinners, no percentages, no 'generating…'" — CONFIRMED. Loading in product contexts is a monologue (see [§II Rule 4](#rule-4--context-specificity-beats-generic-fragments)), not a state UI.
- "No theatrical exits" — NEW, confirmed: the app and site never close themselves. See [§II Rule 2](#rule-2--never-break-session-continuity).

---

## IX. What's Banned — the will-never-appear list

Organized by category. This list is authoritative. If a proposal includes anything from this list, the proposal does not ship until the item is removed.

### Words / phrases
- "AI-powered," "AI-driven," "AI stylist," "powered by AI," "AI technology"
- "Personalized," "tailored to you," "curated just for you," "unique to you"
- "Seamless," "smooth," "effortless"
- "Transform," "revolutionize," "disrupt"
- "Experience" (as a noun describing the product)
- "Your fashion assistant," "stylist in your pocket," "AI in your closet"
- "Let AI choose for you," "smart suggestions," "intelligent recommendations"
- "Truly," "incredibly," "deeply," "beautifully," "stunningly"
- "Never [negative] again!"
- "Join thousands of happy users"
- Any sentence starting with "With UKTI, you can..."
- Any sentence starting with "UKTI helps you..."

### Visual elements
- Gradient CTAs
- Feature grids (icon + headline + two-line description × 3–6)
- Bento grids
- Testimonials with stars
- Testimonial carousels
- "Trusted by" logo rows
- User avatar clusters ("+2,341 people chose…")
- Social proof counts ("1M+ outfits pulled")
- Star rating displays
- Dark-rounded cards inside paper canvases
- Phone mockups with visible iOS bezels, notches, status bars
- Browser-frame mockups
- 3D tilt-on-hover cards
- Glassmorphism (frosted panels inside the page content)
- Hamburger menus, nav bars, mega-nav dropdowns
- Cookie banners larger than one line
- Exit-intent popups
- Email-capture modals
- "New!" badges, "Limited time!" ribbons, countdown timers

### Motion
- Hover-scale on buttons, cards, images
- Tap-ripple effects
- Spring-bounce easings (overshoot curves)
- Auto-playing video
- Parallax backgrounds
- Cursor-following gradients or spotlight effects
- Snap scrolling
- Forced full-screen takeovers
- Loading spinners
- Progress percentages
- "Generating..." / "Analyzing..." text

### Structural
- Testimonials section
- Comparison tables ("us vs them")
- FAQ accordions on the home page
- "How it works" step-by-step with numbered circles
- Blog cards on the home page
- Newsletter signup inline with the core issue flow
- "Our team" section on a D2C product site
- Press-logo rows

### Meta
- Using emojis anywhere on the site
- The word "app" in hero copy (the product is a magazine)
- Any reference to underlying technology (models, frameworks, infrastructure)
- Stock photography of any kind
- Photography of models not generated by the product

---

## X. How to Propose a Variant

If you are an agent, designer, or contributor proposing a new A/B variant, a section redesign, or a copy change, follow this process. It is adapted from the CEO brief's §"What I will / will not accept" and the existing A/B/C test runbook at [`docs/launch/ab-test-runbook-2026-04-20.md`](../launch/ab-test-runbook-2026-04-20.md).

### Step 0 — entry fee

Before any code, before any Figma file:

1. Read this guidebook cover to cover.
2. Read [`NEXT-AGENT-BRIEF.md`](../../NEXT-AGENT-BRIEF.md).
3. Read the existing audit at [`docs/audit/site-audit-2026-04-20.md`](../audit/site-audit-2026-04-20.md) — five working, five not-working, with file:line receipts.
4. Spend three hours on the live site at `styledesigner.co.in`. Phone, desktop. Scroll slowly. Read aloud. Note what lands and what doesn't — five of each, with receipts.

### Step 1 — a proposal doc, one page

Location: `docs/proposals/<concept-name>-<YYYY-MM-DD>.md`.

Structure (required):

- **Emotional verb.** One sentence: what does the user feel after this section? *"Seen." "Recognized." "Invited."*
- **Motion rationale.** Why this effect, here, at this timing? What changes for the reader that wouldn't change with the current section?
- **Conversion hypothesis.** What metric moves, by how much, and why? Example: `InitiateCheckout` rate lifts ≥15% vs. control at 95% confidence.
- **Kill criterion.** Before the A/B starts, write the number at which you cut the variant. *"If mobile `scroll_50` drops ≥15% in the first 72 hours, cut."*
- **Budget.** Bundle size delta (JS + CSS gz), image payload, LCP impact, dependency additions.
- **Voice check.** Read the proposed copy aloud. Does it pass? Attach the copy in full.
- **Banned-word scan.** Grep the proposal against §IX. Zero hits before submission.

### Step 2 — CEO pick

The CEO's motion review is a gate. Brief §"Will not accept" is explicit: *"A PR that ships a major redesign before I've seen the motion. I won't approve it blind."*

The pick lands as a dated entry in [`DESIGN-DECISIONS.md`](../../DESIGN-DECISIONS.md). Until it does, no branch.

### Step 3 — branch per concept

`hero/concept-<letter>` or `section/<name>-<date>`. Branch off the current base branch (`claude/ux-brief-documentation-iuIiH` for in-flight work; `main` for post-merge work). One concept per branch. Never bundle two ideas in one branch — if the CEO accepts one and rejects another, you don't want to disentangle them.

### Step 4 — implement against the A/B/C infra

The variant-override mechanism is at [`scripts/variants/<v>.mjs`](../../scripts/variants/) — create a new file per variant that exports a default `(html, variant) => html` transform. See [`scripts/build-variants.mjs`](../../scripts/build-variants.mjs) for the contract. Do not fork `index.html` — override the one source of truth.

Variant-scoped CSS goes in [`src/style.css`](../../src/style.css), outside `@layer components`, scoped by `html[data-variant="<letter>"]`. (Inside `@layer components`, Tailwind's purge strips classes that don't appear in its content-scan sources — your variant class names won't, because they're emitted at build time.)

### Step 5 — smoke test before Vercel preview

Every variant must pass:
- `npm run build` — no errors, variant file generated, bundle sizes logged.
- Manual inspection of `dist/_variants/<v>/index.html` — the override applied as expected.
- Voice check against §III read-aloud test.
- Banned-word grep against §IX. Zero hits.
- Reduced-motion check — all motion collapses to opacity-only.
- Mobile check at 390×844 — composition holds, text is legible, tap targets ≥44×44px.
- Reality Layer check ([§II](#ii-the-reality-layer)) — no hard stops, no forced exits, no wrong-insight risk, no empty-of-meaning minimalism.
- Learning loop check ([§VII](#vii-the-learning-loop)) — if the variant surfaces intelligence, the stylist's voice is observational not declarative.

### Step 6 — Vercel preview

Deploy to a Vercel preview (not production). Send the URL to the CEO. Wait.

### Step 7 — DESIGN-DECISIONS entry

Before the branch merges, append an entry to [`DESIGN-DECISIONS.md`](../../DESIGN-DECISIONS.md):
- Context (what the proposal set out to change).
- Outcome (what shipped, with file:line references).
- Divergences from the proposal (if any, and why).
- Risk notes (what could still miss in real traffic).
- Kill criterion (restated from §X.1, now with the exact metric threshold).

### Step 8 — merge, then launch

The A/B/C test launch runbook ([`docs/launch/ab-test-runbook-2026-04-20.md`](../launch/ab-test-runbook-2026-04-20.md)) governs the operator steps. Do not merge a variant to main until the pre-launch checklist in §2 of that runbook has been executed.

### Step 9 — no push without explicit permission

Standing rule (user memory `feedback_no_auto_push.md`): `git push` triggers staging/prod deploy. Commit locally, summarize in chat, wait for the green light. No exceptions. Every push is named explicitly.

---

## XI. Appendix — tokens, copy fragments, file map

### Locked copy fragments (verbatim — reuse, do not rewrite)

From the CEO brief [`NEXT-AGENT-BRIEF.md`](../../NEXT-AGENT-BRIEF.md):

```
ISSUE №01 · TUE · OCT 22
Today. Quiet confidence.
Not the trench. Not the dress. Not the one you wore on Thursday.
She reads you. She pulls one. You come back tomorrow.
Your turn. Continue tomorrow's issue.
ONE OUTFIT · EVERY MORNING · NO ADS
```

Additional copy sanctioned in the Reality Layer / Learning Loop sections of this guidebook (agents may reuse):

```
Send me a photograph.
I'll dress you from tomorrow.

Reading you.
Pulling the knit.
Waiting on the light.
Here.

Not the knit. Try the shirt.
Let's leave it here. Come back later.
She's taking her time today.

Noted.
Closer.
That worked.

Last Tuesday, you wore brown.
You wear black on Thursdays. Hold onto it.
The issue will print when you are ready.
This one didn't land. Let me try again.
```

### Color tokens

| Name | Hex | RGB | Tailwind class |
|---|---|---|---|
| Paper | `#F5F1EA` | 245 241 234 | `bg-paper`, `text-paper` |
| Ink | `#0D0B0A` | 13 11 10 | `bg-ink`, `text-ink` |
| Stone | `#A89B8A` | 168 155 138 | `text-stone`, `border-stone` |
| Ember | `#A7412A` | 167 65 42 | `text-ember` (use sparingly) |
| Clay | `#C6B5A3` | 198 181 163 | `text-clay` (reserved) |

Definitions: [`tailwind.config.js`](../../tailwind.config.js) lines 26–34.

### Type scale

| Role | Mobile min | Desktop max | Face | Class |
|---|---|---|---|---|
| Hero verdict (marketing) | 40px | 72px | Fraunces italic 400 | `.verdict.verdict--hero` |
| Concept-C display | 120px | 240px | Fraunces italic 400 | `.hero-today` (variant-scoped) |
| Section verdict | 32px | 56px | Fraunces italic 400 | `.verdict` |
| Whisper | 13px | 15px | Fraunces italic 400 | `.whisper` |
| Pieces | 14px | 16px | Fraunces regular 400 | `.pieces` |
| Eyebrow | 10px | 10px | Plex Mono 400, uppercase | `.eyebrow` |
| Body prose (guides) | 16px | 16px | system-UI | `.guide-prose` descendants |

Definitions: [`src/style.css`](../../src/style.css) `@layer components`.

### Spacing / rhythm

- Section vertical padding: `py-24 sm:py-32` (96px mobile, 128px desktop) as the default.
- Content max-width: `max-w-prose` (520px) for centered copy blocks, `max-w-editorial` (1100px) for desktop reading columns. Defined in [`tailwind.config.js`](../../tailwind.config.js) `maxWidth`.
- Horizontal padding: `px-6` (24px) mobile minimum, `px-10` (40px) on `sm:` breakpoint for type-led surfaces.

### Motion primitives

- Signature easing: `cubic-bezier(0.22, 1, 0.36, 1)` — soft out.
- Signature duration: 600ms for scroll-reveal entry, 420ms for ambient, 1800–2600ms for atmospheric, 6000ms for the Concept B breath (currently parked).
- Selector hooks: `.site-sr-section[data-site-sr-animate="1"]` + `.site-sr-item[data-site-sr-revealed="1"]`. See [`src/main.js:`](../../src/main.js) `initSiteScrollReveal`.

### File map — what lives where

| What | Where |
|---|---|
| CEO brief (the original ask) | [`NEXT-AGENT-BRIEF.md`](../../NEXT-AGENT-BRIEF.md) |
| This guidebook | `docs/brand/website-brand-guidebook-2026-04-21.md` (you are here) |
| Decision log (append-only) | [`DESIGN-DECISIONS.md`](../../DESIGN-DECISIONS.md) |
| A/B/C test operator runbook | [`docs/launch/ab-test-runbook-2026-04-20.md`](../launch/ab-test-runbook-2026-04-20.md) |
| Three-concept proposal (pinned / breathing / type-led) | [`docs/proposals/hero-redesign-2026-04-20.md`](../proposals/hero-redesign-2026-04-20.md) |
| Site audit (5 working / 5 not) | [`docs/audit/site-audit-2026-04-20.md`](../audit/site-audit-2026-04-20.md) |
| Calibration prose (voice sample) | [`docs/calibration/prose-2026-04-20.md`](../calibration/prose-2026-04-20.md) |
| Home page HTML | [`index.html`](../../index.html) |
| Main stylesheet | [`src/style.css`](../../src/style.css) |
| Main JS (analytics, consent, motion) | [`src/main.js`](../../src/main.js) |
| Tailwind tokens | [`tailwind.config.js`](../../tailwind.config.js) |
| Vercel edge middleware (A/B/C router) | [`middleware.js`](../../middleware.js) |
| Variant build script | [`scripts/build-variants.mjs`](../../scripts/build-variants.mjs) |
| Per-variant HTML transforms | [`scripts/variants/`](../../scripts/variants/) |
| Real app renders (hero images) | [`public/images/`](../../public/images/) |
| Self-hosted fonts | [`public/fonts/`](../../public/fonts/) |
| Grain texture | [`public/noise.svg`](../../public/noise.svg) |

### External references

Editorial antecedents the brand aspires to:

- *The Gentlewoman* — slow, considered, never sells. [https://thegentlewoman.co.uk](https://thegentlewoman.co.uk)
- *Apartamento* — intimate, peculiar, prose-over-photograph. [https://www.apartamentomagazine.com](https://www.apartamentomagazine.com)
- *Frieze* — longform editorial typography. [https://www.frieze.com](https://www.frieze.com)
- Jil Sander's 2019-era website — reduction as conviction.

Product-page benchmarks (for motion and conviction, not visual mimicry):

- Apple iPhone product pages — scroll-locked sections committed to gesture. [https://www.apple.com/iphone](https://www.apple.com/iphone)
- Linear release posts — type-led, zero stock photo. [https://linear.app/changelog](https://linear.app/changelog)
- Arc Browser — interactivity serving the thesis, not the showreel.
- Aesop — photography as the brand, product page as catalog. [https://www.aesop.com](https://www.aesop.com)
- Loewe — absurdist craft, never explains.
- Ssense — editorial journalism as e-commerce. [https://www.ssense.com](https://www.ssense.com)
- The Row — absence of marketing is the marketing.

Motion practitioners worth a study pass before major motion work:

- Rauno Freiberg — motion as punctuation, never décor.
- Lusion — restrained WebGL editorial work.
- Active Theory — production-grade scroll choreography.

### Amendment process

This book is authoritative but not frozen. If real traffic data, a user test, or a new constraint invalidates a rule:

1. Open a PR against this file.
2. Attach a dated `DESIGN-DECISIONS.md` entry stating what invalidated the rule.
3. Update the rule in place. Do not edit without the decision log entry.
4. Revise the date in the title of the guidebook (e.g., `website-brand-guidebook-2026-07-01.md`) and update references.

If you reverse something someone else wrote, the amendment must explain why — do not delete the original entry.

---

*Read this book. Then open the site. Then open this book again. That is the cadence.*
