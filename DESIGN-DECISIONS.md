# Design decisions log

A running record of what we considered, what we rejected, and why. The brief (§"What I will and will not accept") asks for this at repo root so future agents can learn from what didn't work.

Format: one entry per decision. Date. Title. One-paragraph context. One-paragraph outcome. Link to the artifact if one exists (audit, proposal, commit).

---

## 2026-04-20 — Audit before pitch

**Context.** The brief asks for three hero concepts. The easy path is to pitch three concepts cold — pinned scroll, breathing photo, type-led — because all three live in the brief's own §Concrete provocations. The harder path is to ground each concept in what the *current* site is doing wrong, so the pitch reads as surgery not decor.

**Outcome.** Wrote `docs/audit/site-audit-2026-04-20.md` first — five working / five not-working with `file:line` receipts — and seeded each hero concept's *kill criterion* from a specific audit failure (e.g., Concept A retires the random-rotation slot machine at `src/main.js:439–493`; Concept B displaces the stone rail's decoration-without-conviction). Cost: an extra exploration pass. Gain: the pitch argues from evidence.

---

## 2026-04-20 — Motion library deferred

**Context.** Brief allows GSAP *or* Motion One, not both. Picking the library before picking the concept would lock us into a bundle-size footprint we might not need.

**Outcome.** Deferred. The picked concept decides:
- **Concept A** (pinned verdict morph) — needs timeline + pin. Motion One (~3.8KB gz) preferred over GSAP-ScrollTrigger (~15KB gz) on bundle cost.
- **Concept B** (breathing + ink-wash) — pure CSS keyframe; no library. WebGL path, if invoked, adds one shader not a library.
- **Concept C** (type-led zero-image) — no library.

Decision punted to the post-pick session. `package.json` unchanged.

---

## 2026-04-20 — Zero-image hero stays in the slate

**Context.** First instinct on a fashion brand's landing page is "lead with a photograph." Removing the hero image contradicts that instinct and risks reading as "underdeveloped" rather than "confident."

**Outcome.** Kept Concept C in the proposal despite the instinct. The brief's §What I need from you §1 says *"Conversion is the only scoreboard"* and *"cost per install dropping by 40%+"* is the measure. An LCP improvement of ~1.1s on 4G (2.2s → 1.1s est.) is a conversion delta we can't dismiss without measuring. If the CEO vetoes C on brand grounds, that's a signal the brief's conversion-only framing has a brand-intuition override — worth surfacing now, not after we've A/B'd.

---

## 2026-04-20 — No code changes this session

**Context.** Brief (§What I will and will not accept) is explicit: *"A PR that ships a major redesign before I've seen the motion. I won't approve it blind."* The temptation is to prototype the easiest concept (C is ~30 min of HTML/CSS surgery) to have something tangible for the pick conversation.

**Outcome.** Resisted. Session ships four docs (audit, calibration, proposal, this log) on `claude/ux-brief-documentation-iuIiH` and stops. The CEO's pick — not a prototype's feel — gates the implementation session. If the pick lands fast, the prototype is 30 minutes of work; if the pick changes, a prototype is sunk cost we avoided.

---

## 2026-04-20 — Verdict rotation scheduled for deletion

**Context.** The existing `initVerdictRotation` at `src/main.js:439–493` selects a random verdict from a hardcoded array of five strings on return-to-top. The brief's own inline comment says this should *"avoid the slot-machine feel"* but the selection function is literally `Math.random()`. The failure is not bug, it's *mechanism*.

**Outcome.** Flagged in audit §Five not working #1. Concept A retires this code entirely by promoting the three best verdicts into the primary hero crossfade (curated, not random). Concepts B and C leave it in place only until the picked concept is prototyped; then the function is deleted regardless of which concept wins. The array's five strings remain useful as curated candidates for future A/B tests.

---

## 2026-04-20 — A/B/C test via edge middleware on a single URL

**Context.** The original proposal was "CEO picks one concept, one branch, prototype, ship." The CEO asked instead to run all three concepts as a live A/B/C test so conversion data — not taste — picks the winner. Two routing approaches were considered.

**Rejected: three distinct ad-lander URLs (`/`, `/b/`, `/c/`) with Meta splitting traffic at the creative level.** Zero new infrastructure, matches the existing `/how-she-works` and `/the-looks` ad-lander pattern. Rejected because the operational cost is recurring: every new ad creative must be triplicated across three URLs for the duration of the test, and Meta's delivery system cannot be trusted to produce a clean 33/33/33 split without the A/B-Test tool actively running. The ad-ops cost to the CEO was judged heavier than the one-time infrastructure cost.

**Chosen: Vercel Edge Middleware on a single URL (`/`).** `middleware.js` at repo root intercepts requests to the root path, reads or sets a first-party cookie (`sa_v`, 1-year, SameSite=Lax), hashes a fresh visitor 33/33/33 via `crypto.getRandomValues`, and rewrites the response internally to `/_variants/{a|b|c}/index.html`. The URL in the address bar stays `/`. Returning visitors see the same variant. Ads point at `/` as they always have — zero ad-ops change. The CEO can force a specific variant by appending `?v=a|b|c` to any URL, which re-pins the cookie for that browser.

**Cost.** Adds one dependency (`@vercel/edge`, ~3KB, Vercel-authored), ~30–60ms of edge-function TTFB on the first byte of the root page, one first-party functional cookie, and a new `_variants/` tree generated at build time. Concept C's LCP target of 1.1s on 4G becomes ~1.15s with edge overhead — still well under the 1.8s brief cap. This is pitch-first territory per brief §Technical constraints; the CEO approved the pitch in the 2026-04-20 session.

**Cleanup path.** When a winner is declared, a single-line change to `middleware.js` (hard-pin `assigned` to the winning letter) flips 100% of traffic to the winner. A follow-up PR then deletes `middleware.js`, the `_variants/` build step, and the losing-variant HTML; the root returns to serving `index.html` directly with no edge overhead. Reversible within one small PR.

---

## 2026-04-20 — Decision rule for the A/B/C test, written BEFORE it runs

**Context.** The brief's §Success section names the scoreboard (CPA drop, scroll-depth lift, `InitiateCheckout` rate) but not the decision rule. Writing the rule before the data arrives prevents post-hoc rationalization when one variant looks close-but-not-quite to another.

**Outcome — locked in advance:**

| Metric | Source | Winning signal |
|---|---|---|
| **Cost per install (PRIMARY)** | Meta Ads Manager via three custom conversions filtered on the `variant` Pixel param | Lowest CPA at **≥95% statistical confidence** |
| **`InitiateCheckout` rate per visit** | Meta Events Manager, GA4 | Highest rate; leading indicator |
| **`scroll_90` rate** | GA4 | ≥10% lift vs. control |
| **LCP p75** | GA4 Web Vitals (`src/main.js` `initWebVitals`) | Concept C must beat A/B by ≥0.5s to justify its zero-image thesis |
| **Bounce / avg session duration** | GA4 | Sanity check — no material regression |

**Run parameters:**
- **Minimum duration:** 14 calendar days. Shorter reads noise.
- **Traffic floor:** ≥1,000 visitors **and** ≥100 conversions per variant before any winner can be declared. Below that, extend.
- **Stop-early kill switch:** if any variant's CPA is ≥20% worse than the running average after 500 visitors, pause that variant in the middleware (hard-pin zero traffic to it) so ad spend stops bleeding into a known loser. Other two continue.
- **Tiebreaker:** if two variants tie on CPA within the 95% confidence interval, pick the one with better LCP p75. Perf is permanent; CPA noise is not.

**Instrumentation required before launch (not yet shipped):**
1. Add `variant` as a GA4 custom dimension (property-level setting in the GA4 UI; no code change).
2. Create three custom conversions in Meta Events Manager (`InitiateCheckout_VariantA/B/C`) filtered on the `variant` Pixel param.
3. Build a GA4 Explore saved report: rows = variant, columns = `scroll_50` / `scroll_90` / `cta_scroll_to_ask` / avg LCP.

---

*Add entries below as we make decisions. Future agents: if you reverse any entry above, add a new entry explaining why — do not edit history.*
