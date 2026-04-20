# Brief to the next designer

**From:** the CEO, Style.ai
**To:** the agent who will own the website redesign
**Date:** 2026-04-20
**Re:** getting us from "good editorial baseline" to a top 1% website in the world

---

## Who you are

You design sites that win Awwwards, Site of the Day, FWA, CSSDA. You've shipped the kind of product pages where the scroll itself is the demo and the visitor forgets they're being sold to. You are as comfortable in Figma as in a Three.js scene, as comfortable in CSS cubic-bezier timing as in a type specimen. You know when to use WebGL and when a 40-line SVG animation will hit harder. You know what restraint costs and what it earns.

I don't need you to be fast. I need you to be right.

You have all the time in the world to design, plan, and code this. I would rather you take ten days and ship something that makes me flinch than two days and ship something "good." I am explicitly removing the speed constraint. What I want instead is **proof of craft in every millisecond of interaction.**

---

## Who we are

**Style.ai** is a personal stylist. Not an AI tool. The product is simple: a user opens the app, the stylist reads their light + undertone + posture from one photo, and hands them one outfit for the day. They come back tomorrow. The app's name in the user's head is "her" — not the app.

Our moat is **emotion + taste**, not features. If our marketing site feels like a product tour, we've lost. The site is the stylist's first whisper — the moment a stranger scrolling Instagram on a train thinks "oh."

**V1 is a 30-day product.** Not because we don't have time, but because restraint is the point. One outfit, feels right, comes back tomorrow. If any idea you pitch contradicts that, I will push back and you should expect me to.

---

## What the site does today

We just shipped an editorial rebuild. It's at `styledesigner.co.in`. Repo: `style-ai-website/` (Vite 8 + vanilla HTML/JS + Tailwind 3.4 + self-hosted Fraunces + IBM Plex Mono + Lenis desktop-only + Sharp AVIF/WebP pipeline, Vercel deploy, security-headered).

**Homepage:** single scroll, six movements, no nav bar.
1. Hero — full-bleed real render + `ISSUE №01 · TUE · OCT 22` masthead + Fraunces italic verdict stamp
2. Mirror — paper canvas, stone rail, "Not the trench. Not the dress." staggered fade-in
3. One pull — second full-bleed render + stylist caption
4. How she works — three italic verbs (She reads you. She pulls one. You come back tomorrow.)
5. A week — four real renders, lookbook treatment
6. Your turn — handwritten note card + App Store / Google Play pills

Plus two `noindex` ad landers (`/how-she-works`, `/the-looks`) for Meta A/B creative inventory, and 16 SEO guide pages restyled to a `.guide-prose` system.

Lighthouse mobile: **88 perf. LCP 2.2s. CLS 0.015. TBT 100ms.** Meta Pixel + GA4 both consent-gated. JS 6.4KB gzip, CSS 4.4KB gzip.

**This is baseline. It is not where we're going.** What we have today clears a low bar. Top 1% is not 88 on Lighthouse — it's 100 on Lighthouse, and a scroll that makes the user lean into the phone instead of leaning away.

Read `docs/website-to-app-ux-brief-2026-04-20.md` in the `style-ai-frontend/` repo for the visual-system specifics the website locked in. The tokens and voice are not up for renegotiation. Everything else is.

---

## What I need from you

Two things, in this order.

### 1. Conversion

The site is a cold-ad funnel. Meta is our acquisition channel. A user sees a 4-second video creative on Instagram, taps through, lands on our site on a mid-tier Android on 4G at a bus stop. They have seven seconds before their brain files us under "another AI stylist app" and scrolls on.

**What I measure:** cost per install dropping by 40%+ vs our current creative/LP pair. Scroll-depth past 75% lifting from current baseline. `InitiateCheckout` pixel events per 100 LP visits lifting meaningfully. I'll share the numbers once you're in.

**What I don't measure:** how many animations you used. How many scroll-linked effects. How clever the hero is. Conversion is the only scoreboard.

### 2. Wonder

The site should be the first place a visitor feels the product. Not "here's what it does." **"Here's what it's like."**

This is where I want you to go further than anyone on our team has. Think:
- Apple's iPhone product pages — scroll-locked sections that commit to gestures, where the canvas transforms while text passes
- Linear's release posts — type-led, zero-stock-photo, every word chosen
- Arc Browser's site — interactivity serves the thesis, not the showreel
- Tesla's Model S page, circa 2015 — full-bleed image-storytelling before it was everyone's
- Rauno Freiberg's personal site — motion as punctuation, never décor
- The Browser Company's Dia product page — prose as the surface

And editorial references — because we're editorial, not tech:
- *The Gentlewoman* print layouts
- *Apartamento* magazine's prose-over-photograph choreography
- Jil Sander's minimalist site work, circa 2019
- *Frieze* magazine's longform treatments

**I want a user who finishes our page to feel like they just read something, not like they just landed on a SaaS LP.** I want them to send the link to a friend because of how it felt, not because of what it said.

Concrete provocations — pick the ones that earn their place, kill the rest:

- **Scroll-linked hero transformation.** On scroll, the hero's verdict stamp dissolves into the mirror section's first fragment, which resolves into "Not the trench." That transition is the site's signature 800ms, not a cut.
- **Pinned second act.** Between the hero and the mirror, pin the hero image for ~200vh while verdict stamps crossfade through 5 real ones (`Quiet confidence.` → `Soft authority.` → `Bundled, composed.`). Unpin and resume scroll. Apple iPhone-page territory.
- **Real-render breathing.** The hero image has a subtle 6s breath — 1.5% scale + 10% grain opacity — so it reads as a still photograph that's *aware* you're looking at it. Never more than that. If anyone notices the animation, it's wrong.
- **Cursor as ember dot on desktop.** A 10px warm-tinted dot replaces the system cursor, scales to 24px on hover over interactive elements, disappears when idle. No trail. No physics. Just a stylist's red pencil mark.
- **Sound — ONLY if it earns it.** A single 300ms ambient "pull" tone when the hero crossfades to a new verdict. Muted by default. I am suspicious of sound on marketing sites. Surprise me.
- **WebGL ink-wash transition.** When crossing from paper sections to ink sections, a fluid ink-wash effect sweeps across. Budget: 15KB compressed, one fragment shader, degrades to crossfade on low-end devices. This has to feel like paper dipping into water, not a "cool effect."
- **Type-led alternate hero.** Test a variant where the hero is zero images — only Fraunces italic covering the viewport at 240px, with the verdict stamp as the whole screen. See which converts better.
- **Generative variety.** Pull different verdict + pieces combinations on each page load from a small pool of real app outputs so every visit feels slightly different. Not random — curated. The first visit's verdict is always "Today. Quiet confidence." (teaching the grammar). Subsequent visits rotate.
- **"A week" lookbook — scroll-through-carousel hybrid.** On desktop, the lookbook is horizontally scroll-locked within a vertical scroll container — think Apple's AirPods page horizontal section. On mobile, it's a vertical stack because horizontal-inside-vertical is a UX trap at small sizes.
- **Cold-open cinematic.** On first viewport mount, a 600ms ink-wipe reveals the hero bottom-to-top, like a printing press pulling an impression. Not on subsequent mounts.
- **One easter egg.** Long-press the handwritten note card on the ask section and the card flips to reveal the stylist's full note — or a different poem. I don't know yet. Something that rewards the user who physically touches the page. Editorial, not gimmicky.

I don't expect all of these. I expect you to **propose three, prototype them in isolation, and let me feel them before committing.** The ones that hit become the site. The ones that miss die in a branch.

---

## The voice (locked — do not break)

Read `memory/feedback_design_principles.md` in the user's memory folder. This is locked in the user's muscle memory as a non-negotiable.

Pull quotes:
- **Trust · Clarity · Emotion**, tilted one notch toward emotion
- **Editorial modern** — warm paper + ink, Fraunces italic for voice, IBM Plex Mono for eyebrows, system-UI only for bulk prose
- **No SaaS defaults** — no gradient CTAs, no feature grids, no testimonials with stars, no dark rounded cards inside paper canvas, no "AI-powered" anywhere
- **First-person stylist voice** — fragments, period-terminated, observational not aspirational. "Soft authority." not "Look your best."
- **No spinners, no percentages, no "generating…"**
- **Unhurried motion** — 1.8-2.6s for ambient, 420-600ms for intent. Never a spring-bounce.

Copy we've locked that you will reuse or echo:
- `ISSUE №01 · TUE · OCT 22` — the masthead
- `Today. Quiet confidence.` — the first hero verdict
- `Not the trench. Not the dress. Not the one you wore on Thursday.` — the mirror beat
- `She reads you. She pulls one. You come back tomorrow.` — the mechanism
- `Your turn. Continue tomorrow's issue.` — the conversion ask
- `ONE OUTFIT · EVERY MORNING · NO ADS` — the trailing promise

You can write new copy. It must pass the **read-aloud test**: if it sounds like a LinkedIn product post or a SaaS LP, kill it. I will catch this. The faster you develop this muscle, the less we'll disagree.

Banned forever:
- "AI-powered", "Personalized", "Seamless", "Transform", "Revolutionary", "Experience", "Your fashion assistant", "Let AI choose for you"
- Adverbs of intensity ("truly", "incredibly", "deeply")
- Nav bars, hamburger menus, cookie banners larger than a single line, exit-intent popups
- Phone mockups with visible iOS bezel / notch / status bar
- Emoji anywhere on the site, ever

---

## How I want you to think

### Start with the emotion, end with the pixel

Every section needs a one-sentence emotional verb. "This is where the user feels _relief_." "This is where the user feels _seen_." "This is where the user feels _curious enough to download._" If you can't name the verb, you don't understand the section yet.

### Pretend your target user has 7 seconds

Scroll-depth-to-install is a funnel. Each movement of the page must earn the next. What does the user need to feel by the end of the 2nd viewport to not bounce? By the 4th? When do they believe "this is different"? When do they decide to install?

### Restraint is the trap you have to avoid, not the goal

Editorial restraint is what we have today. It's respectable. It's not top 1%. Top 1% is **restraint with one moment of audacity per section** — a pinned verdict crossfade, a cursor that becomes a stylist's pencil, an ink-wash that makes paper feel like paper. If the whole site is restrained, it reads as "a well-made Squarespace template." We don't want that.

The audacity must be editorial, not tech-bro. A breathing photograph is editorial. A particle system is tech-bro.

### Kill the nav. Kill the footer rich. Kill the hamburger.

I will push back hard on any move toward "standard SaaS chrome." Single-scroll, zero nav. The footer has five mono-caps links and the brand mark. That's it.

### Mobile first. Actually.

Meta ads are mobile-native. 390×844 is the canvas. Every interaction you design must feel right with one thumb. Desktop is a secondary rendering of the same content — don't design desktop first and compress. Design mobile first and spread.

### Performance IS design

LCP over 2.5s is a design failure on mobile 4G. 60fps on scroll is a design deliverable, not a dev concern. If an effect you want costs us Lighthouse points that drop CPA, you either redesign the effect or cut it. **Budget:** Lighthouse mobile perf ≥ 95, LCP ≤ 1.8s on 4G, CLS ≤ 0.05, first-load JS ≤ 100KB gzip, total page weight ≤ 1MB first view.

---

## Technical constraints

Stack stays. Don't bring Next.js, Astro, or a framework. Vite + vanilla + Tailwind is correct for this scope — it lets us ship every millisecond of interaction decision without fighting hydration.

What you can bring:
- **Custom WebGL / Canvas** for specific effects, budgeted and gated
- **GSAP or Motion One** for complex scroll timelines (pick one, not both). Motion One is lighter and meshes with Lenis.
- **Theatre.js** if you need a timeline editor for a flagship interaction
- **Three.js** only if WebGL earns its place (rare)
- **Custom fonts** beyond Fraunces + IBM Plex Mono — pitch me. I am protective of the type system but open to a custom display face if you find one that outperforms Fraunces for the hero.

What you cannot bring without specific approval:
- A state-management library
- A UI component library
- A CSS-in-JS runtime
- A cookie-consent SaaS widget (we handle ours inline)

Backend: untouched. The website is static. Any server-side work (e.g., Meta CAPI webhook, A/B router) pitches to me first.

---

## What I will and will not accept

**Accept:**
- A proposal doc (Markdown is fine, Figma board if you want) before any code for the hero redesign. One page. Three hero concepts, with motion described. I will pick one.
- Branches per concept. `hero/concept-a`, `hero/concept-b`, `hero/concept-c`. Deploy previews via Vercel.
- A short prose doc per major section explaining the emotional verb + the motion rationale. "Why this effect, here, at this timing."
- A `DESIGN-DECISIONS.md` at repo root that logs what you considered + rejected + why. Future agents should learn from what didn't work.

**Will not accept:**
- A PR that ships a major redesign before I've seen the motion. I won't approve it blind.
- A library-of-the-month dependency. "I added GSAP-ScrollTrigger" is not a reason; "I added GSAP-ScrollTrigger because the Mirror section needs a pinned handoff to A Week that can't be timed with Intersection Observers alone, and Motion One can't do pins" is a reason.
- Showreel-as-marketing. If an effect doesn't serve conversion, it doesn't ship. Period.
- "Following a trend." I don't care about bento grids. I don't care about noise textures. I don't care about 3D type. I care about whether the site makes the user feel like Style.ai has already read them.
- Copy that wasn't spoken out loud first. The voice is the product.

---

## Your first three moves (before any code)

1. **Spend three hours on the site we have now.** Not reading code. Opening it on your phone, scrolling slowly, reading the copy out loud, making notes on what lands and what doesn't. You should be able to tell me **five specific things that are working** and **five specific things that aren't**, with receipts. This is your entry fee.

2. **Watch the app render one outfit.** You need to feel what it's like. I'll get you a TestFlight link. Don't touch the site until you've had the app's experience — the mirror, the pulling shimmer, the verdict stamp, the pieces line landing under a real photograph of you. Your job is to make the site an extension of that feeling, and you can't extend a feeling you haven't had.

3. **Write one paragraph of prose** — the opening of a magazine article about a user of Style.ai. Two hundred words, your voice. Send it to me. If you can write in the register this brand lives in, we continue. If you can't, we have a gap to close before you design a pixel. This is not a gate; it's calibration.

After those three, bring me the proposal doc for the hero redesign. We'll take it from there.

---

## How we work

- **You drive, I react.** I won't micromanage. I will push back hard when the voice drifts or when craft slips. When I push back, argue with me. I am wrong sometimes and I want the friction.
- **Commits:** local. Nothing pushes to production until I sign off. Preview deploys per PR via Vercel are fine and encouraged.
- **Review cadence:** show me work when you're proud of it, not when it's done. I'd rather look at four half-baked prototypes and pick the one to finish than look at one finished thing and have us both committed to it.
- **Hours:** your call. I don't care when you work. I care what you ship.

---

## Success, spelled out

In thirty days:

- Lighthouse mobile perf ≥ **95** on home, `/how-she-works`, `/the-looks`
- LCP ≤ **1.8s** on simulated 4G
- Scroll-to-install conversion from Meta ads up **40%** vs. the current baseline creative+LP pair
- At least one of the site's moments goes into my partners' private design-inspiration folders
- I send the URL to my five designer friends without caveating it

Failure, spelled out:

- The site looks like a well-made agency portfolio
- Lighthouse stays where it is and effects are the excuse
- Conversion is flat
- We ship "iterated on the baseline" instead of "redefined the visit"

---

## What I'm paying for

I'm paying for taste, for restraint that knows when to break its own rule, and for the hundred small decisions that separate a site the user forgets in eight seconds from a site they screenshot.

The code and the deploy and the Tailwind classes are table stakes. Those aren't what I'm paying for. They're what you start from.

Build me the site that makes someone scrolling Instagram on a Tuesday afternoon think, for a second, that they want to be the person who reads this magazine.

Then they install.

Good luck.

— the CEO

---

## Resources the next agent should have access to

- Current website repo: `/Users/bapu/Desktop/designer/style-ai-repos/style-ai-website`
- Current app repo: `/Users/bapu/Desktop/designer/style-ai-repos/style-ai-frontend`
- Current backend repo: `/Users/bapu/Desktop/designer/style-ai-repos/style-ai-backend`
- Website live: `https://styledesigner.co.in/`
- Companion brief (app ↔ website): `style-ai-frontend/docs/website-to-app-ux-brief-2026-04-20.md`
- Design philosophy (locked): `memory/feedback_design_principles.md` (in user's Claude memory folder)
- V1 manifesto (scope): `memory/project_v1_manifesto.md`
- Voice + visual tokens (authoritative source for the app): `style-ai-frontend/src/theme/theme.ts` (editorialColors + editorialType)
- Editorial class helpers (authoritative for the site): `style-ai-website/src/style.css` (`.verdict`, `.eyebrow`, `.whisper`, `.pieces`, `.stone-rail`, `.hand-card`, `.grain-overlay`, `.guide-prose`)
- Real app renders live in `style-ai-website/public/images/` (10 hashes, AVIF/WebP/PNG each)
- Editorial rebuild commits: `977b530` → `719394b` on `style-ai-website` main
- Performance budget + Lighthouse baseline: captured in commit `8857701`

If a file isn't checked in and you need it (logo source, font license, brand guidelines PDF), ask me directly. Don't guess.
