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

*Add entries below as we make decisions. Future agents: if you reverse any entry above, add a new entry explaining why — do not edit history.*
