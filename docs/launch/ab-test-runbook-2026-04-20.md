# A/B/C test runbook — the hero test

**Date:** 2026-04-20
**Owner:** the operator running the test (today, the CEO)
**Status:** living doc. Read top-to-bottom once. Then use it as a reference.

---

## TL;DR

The edge-routed A/B/C hero test is **built** but **not yet launched**. Code side is done: [middleware.js](../../middleware.js) splits traffic 33/33/33 on `/`, [src/main.js](../../src/main.js) tags every analytics event with `variant: a|b|c`, [scripts/build-variants.mjs](../../scripts/build-variants.mjs) generates the three HTML shells at build time. All three variants currently render the same hero — B and C are placeholders until the next session prototypes the breathing and zero-image concepts.

Before the test can be called live, **three things must happen in the GA4 + Meta UIs by the operator** (sections 3, 4, 5 below). After that, the test runs itself. The decision rule — what wins, when, how — is locked in [DESIGN-DECISIONS.md](../../DESIGN-DECISIONS.md) under the 2026-04-20 entry *"Decision rule for the A/B/C test, written BEFORE it runs"*. Do not re-litigate it mid-test.

---

## 1. What's running, in one paragraph

A visitor hits `styledesigner.co.in/`. Edge middleware reads the `sa_v` cookie. If present and valid, rewrites to the matching `/_variants/{a|b|c}/index.html`. If absent, rolls `crypto.getRandomValues`, assigns a letter, sets the cookie (1 year, SameSite=Lax, Secure), and rewrites. The browser address bar stays `/`. The response carries a debug `x-variant` header for QA. Every GA4 and Meta Pixel event fires with `variant` as a parameter. The dev override is `?v=a|b|c` — takes precedence over any cookie, re-pins the new value.

---

## 2. Pre-launch checklist

Do these in order. Each step has its own section below.

- [ ] **GA4 custom dimension registered** — section 3
- [ ] **Meta custom conversions created** (`InitiateCheckout_VariantA/B/C`) — section 4
- [ ] **GA4 Explore saved report built** — section 5
- [ ] **Vercel preview smoke-tested** on all three variants via `?v=a|b|c` — section 6
- [ ] **14-day baseline captured** — note the current CPA and `InitiateCheckout` rate from the existing creative/LP pair before the test starts, so "did it move?" has a referent
- [ ] **Launch entry added to the log** at the bottom of this doc (section 15) with the exact date the test went live

Only after every box is ticked does the branch merge to `main`. Do not start the test with instrumentation missing — the first 24 hours of traffic are the cleanest you get, and untagged data is lost data.

---

## 3. GA4 — register `variant` as a custom dimension

GA4 does not auto-surface custom event parameters in reports. Until the dimension is registered, the `variant` param is flowing into GA4 but invisible in every UI.

**Path (GA4 UI, as of 2026-04 — if menu labels differ, search the UI for the term in bold):**

1. GA4 → **Admin** (gear icon, bottom-left)
2. Property column → **Data display** → **Custom definitions**
3. Top-right → **Create custom dimensions**
4. Fill the form:
   - **Dimension name:** `Hero Variant`
   - **Scope:** `Event`
   - **Description:** `A/B/C hero test assignment. Values: a, b, c.`
   - **Event parameter:** `variant` (must match exactly — the code fires this string at [src/main.js:74](../../src/main.js) and [src/main.js:194](../../src/main.js))
5. **Save**

**Propagation.** GA4 is a read-time construct: the dimension appears in Explore within a few minutes, in standard reports within 24–48h. Events fired *before* registration are retained and become queryable as soon as the dimension exists — you are not losing history.

**Also set a user-scoped dimension** (optional but cleaner for cohorting returning users):

1. Same screen → top tab **Custom dimensions** → **Create**
2. **Scope:** `User`
3. **Dimension name:** `Hero Variant (User)`
4. **User property:** `variant` (matches [src/main.js:138](../../src/main.js) — `gtag("set", "user_properties", { variant })`)
5. **Save**

---

## 4. Meta Events Manager — three custom conversions

Ads Manager cannot split a single standard event (`InitiateCheckout`) by a custom parameter in its default columns. The fix is to create three **Custom Conversions**, each filtering on the `variant` parameter. They then appear as selectable columns in Ads Manager reporting.

**Path (Meta Events Manager, as of 2026-04):**

1. Business.facebook.com → **Events Manager** → select the UKTI Pixel
2. Left rail → **Custom Conversions** → **Create Custom Conversion**
3. Fill the form (first variant):
   - **Name:** `InitiateCheckout_VariantA`
   - **Description:** `Install-intent click from hero variant A`
   - **Data source:** the UKTI Pixel
   - **Conversion event:** `InitiateCheckout` (the standard event already fired at [src/main.js:270](../../src/main.js))
   - **Rule:** `Event Parameters` → parameter name `variant` → condition `equals` → value `a` (lowercase, exact)
   - **Category:** `Add to cart` (closest fit for a store-tap — category is for Meta's optimization hints, pick once and keep consistent across all three)
4. **Create**
5. Repeat for **B** (value `b`) and **C** (value `c`). Three conversions total.

**Attribution window.** Use Meta's default (7-day click, 1-day view) unless your campaign setup uses something else — the three custom conversions should share whatever window the current campaign is measured on, so CPA comparisons across variants are apples-to-apples.

**Verification.** Send a test event from the Pixel Helper browser extension or fire a real click in a `?v=a` preview, wait ~15 min, confirm the custom conversion counter increments in Events Manager. If the counter stays at zero after an hour of traffic, the rule is wrong — most commonly the parameter filter is set against `URL` instead of `Event Parameters`.

---

## 5. GA4 Explore — the weekly report

A one-time setup. Once saved, this is where the weekly check happens.

1. GA4 → **Explore** (left rail) → **Blank** (create new)
2. **Technique:** `Free form`
3. **Dimensions** (click + to import):
   - `Hero Variant` (the event-scoped dimension from section 3)
   - `Event name`
4. **Metrics:**
   - `Event count`
   - `Total users`
5. **Settings:**
   - **Rows:** `Hero Variant`
   - **Columns:** `Event name`
   - **Values:** `Event count`
6. **Filters:** `Event name` matches regex `^(scroll_50|scroll_90|cta_scroll_to_ask|store_click_ios|store_click_android)$` — that's the funnel.
7. **Name the exploration:** `Hero A/B/C — weekly funnel`
8. **Save**

**Second tab (LCP per variant):**
1. Duplicate the tab
2. Change the **Event name** filter to `web_vitals` only
3. Add a dimension `metric_name`, filter it to `LCP`
4. Swap the metric from `Event count` to `Average event value` (reads `metric_value` from [src/main.js:322](../../src/main.js))
5. Name it `Hero A/B/C — LCP p75 per variant`

Saved explorations are shareable via URL. Paste the URL into this doc's log section on launch day so anyone can open it cold.

---

## 6. Smoke test before launch

Before flipping traffic to the test branch in production, run through each variant on a Vercel preview deploy.

**From the CLI in `ukti-website/`:**

```
npm install
npm run build
vercel --prod=false
```

Vercel returns a preview URL like `https://ukti-website-<hash>.vercel.app`.

**For each of `a`, `b`, `c`:**

1. Open `https://<preview>/?v=<letter>` on desktop (Chrome + Safari) and on a real mobile (iOS Safari + Android Chrome — not just devtools emulation)
2. Open devtools → **Network** → click on the root document request
   - Confirm response header **`x-variant: <letter>`** matches
3. Devtools → **Elements** → inspect `<html>`
   - Confirm attribute **`data-variant="<letter>"`** is stamped
4. Devtools → **Application** → **Cookies** → `<preview-domain>`
   - Confirm cookie **`sa_v=<letter>`**, Max-Age ≈ 31,536,000 (≈ 1 year), `SameSite=Lax`, `Secure`
5. Devtools → **Network** → filter on `google-analytics.com` and `facebook.com`
   - Accept the consent bar
   - Reload, click the Google Play pill, confirm `InitiateCheckout` fires on Meta with `variant=<letter>` in the payload
   - Confirm `gtag` events carry `variant=<letter>`
6. Scroll to 50% and 90% — confirm `scroll_50` and `scroll_90` fire in GA4's DebugView (GA4 → Admin → DebugView) with `variant=<letter>` attached

**A failure at any step is a launch block.** If variant B and C are currently clones of A, they should be visually identical — the test of this smoke is instrumentation, not design.

---

## 7. Daily monitoring (5 min)

Do this once a day during the test. No more.

**Meta Ads Manager — the scoreboard:**
- Pin three columns in your campaign view: **Cost per Custom Conversion → `InitiateCheckout_VariantA`**, `_VariantB`, `_VariantC`
- Glance. If all three are within 15% of each other, close the tab — it's noise this early.
- If one variant is ≥20% worse than the running average **and** it has ≥500 conversions logged against it, read section 10 (kill-switch).

**What's noise, what's signal:**
- First 500 conversions per variant → **all noise**. Do not act.
- 500–1,000 conversions per variant → watch for stop-early triggers only (≥20% worse). Do not declare.
- ≥1,000 visitors **and** ≥100 conversions per variant → significance calculator becomes meaningful (section 9). Still do not declare before day 14.

**What NOT to do daily:**
- Do not open GA4 Explore daily. The weekly report (section 5) is weekly for a reason — scroll metrics are slow to stabilize.
- Do not adjust campaign budgets to favor a leading variant. That invalidates the test.
- Do not change ad creative mid-test. Freeze the creative at launch.

---

## 8. Weekly monitoring (20 min)

Once a week, same day every week:

1. Open the GA4 Explore saved report from section 5
2. Read the **funnel per variant**: of the three, which has the highest `scroll_90 / Total users` ratio? Highest `cta_scroll_to_ask / scroll_50` ratio? Write those ratios in the log (section 15) — numbers on a page beat memory.
3. Open the second tab — **LCP p75 per variant**. Concept C's whole pitch is a ≥0.5s LCP advantage; if it is not showing up in week 1, C's conversion hypothesis is already weakening.
4. Open **Meta Events Manager → Overview** — confirm `InitiateCheckout` event volume matches the sum of the three custom conversions. A gap means events are firing without the `variant` param (middleware miss, bot traffic, or a CDN edge case). Flag in the log.
5. Open **Ads Manager** → **Breakdown → By Campaign → By Custom Conversion**. Note the CPA per variant and whether the gaps are widening or narrowing week-over-week.
6. **Sanity checks** — for each variant, confirm bounce rate and avg session duration have not regressed vs. the pre-test baseline. If one variant has materially higher bounce but also lower CPA, that's a red flag worth logging: users may be converting on the ad but bouncing off the site, which the install numbers won't flatter for long.
7. Paste the week's ratios + CPA into the log (section 15).

---

## 9. Reading statistical significance

The rule (from [DESIGN-DECISIONS.md](../../DESIGN-DECISIONS.md)): **cost per install at ≥95% confidence** is the winning signal on the primary metric.

**Floors before any call:**
- **≥14 calendar days** since launch. Shorter reads noise. No exceptions — "but the data looks so clean" is exactly when humans call false winners.
- **≥1,000 visitors per variant** (from GA4 `Total users` filtered by variant)
- **≥100 conversions per variant** (from Meta `InitiateCheckout_VariantX` counter)

**How to read a calculator:**

1. Open any reputable A/B significance calculator — search `"A/B test significance calculator"` and pick one from a known source (Evan Miller, AB Tasty, Optimizely's free tool all work). Do not build your own.
2. Input per variant: **visitors** (from GA4) and **conversions** (from Meta custom conversion)
3. Read the output: **p-value < 0.05** means ≥95% confidence that the observed difference is not noise.

**Worked example.** Say after 14 days the numbers look like this:

| Variant | Visitors | Conversions | CPA  |
|---------|----------|-------------|------|
| A       | 1,150    | 72          | $3.70 |
| B       | 1,180    | 78          | $3.42 |
| C       | 1,200    | 85          | $3.10 |

Feed C vs A into the calculator → p-value = 0.04 → **significant**. C wins.
Feed C vs B → p-value = 0.22 → **not significant**. C is not distinguishable from B.
**Decision:** C wins on the primary metric because it beats the control (A) significantly. If C and B were tied on CPA, apply the tiebreaker from DESIGN-DECISIONS.md: better **LCP p75** wins. Perf is permanent; CPA noise is not.

**Do not declare on:**
- `scroll_90` rate alone — that's a secondary metric
- CPA differences at p > 0.05
- Any single-day spike

---

## 10. Kill-switch — pausing a bleeding variant mid-test

If a variant's CPA is ≥20% worse than the running average after it has ≥500 conversions, pause it in the middleware so ad spend stops bleeding. The other variants continue.

**One-line edit to [middleware.js](../../middleware.js):**

To remove variant `c` (example — replace with whichever is bleeding):

```js
// Before:
const VARIANTS = ["a", "b", "c"];

// After:
const VARIANTS = ["a", "b"];
```

That's the whole change. Commit:

```
git commit -am "kill-switch: pause variant c mid-test (CPA -28% vs avg)"
git push  # operator action — see feedback_no_auto_push.md; confirm before pushing
```

**What happens next:**
- New visitors: assigned only from `["a", "b"]` (50/50 split instead of 33/33/33).
- Returning visitors previously cookied as `c`: their cookie value `c` no longer matches the `VARIANTS` array at [middleware.js:61](../../middleware.js), so they fall through to a fresh random assignment — they get rerolled to `a` or `b` on their next visit. No orphan traffic.
- Ads continue pointing at `/`. No ad-ops change.

**Verification after deploy:**
1. Open a fresh browser or clear cookies
2. Visit `/` ~10 times with cookies cleared each time
3. Check `x-variant` response header — should only ever be `a` or `b`
4. Log the event in section 15

**Do not kill a variant before the 500-conversion floor.** The stop-early rule exists to prevent bleeding, not to chase early leads. A variant that looks bad at 200 conversions can easily be the eventual winner.

---

## 11. Calling the winner

**Checklist — every box must be ticked:**

- [ ] ≥14 calendar days since launch
- [ ] ≥1,000 visitors per variant (any variant that is below is a data floor failure — extend, do not declare)
- [ ] ≥100 conversions per variant (same)
- [ ] CPA delta between winner and next-best variant is significant at p < 0.05
- [ ] Sanity metrics (bounce rate, session duration) have not regressed on the winning variant vs. the pre-test baseline
- [ ] If CPA is tied within the confidence interval between two variants, LCP p75 tiebreaker applied — the variant with the better LCP p75 wins

If every box is ticked, the winner is called. Write it in the log (section 15): the date, the winner, the CPA deltas, the sample sizes, the p-value.

If even one box is missing, the test continues. Extend one more week. Re-check.

**Do not call a winner on a Friday afternoon.** Cleanup (section 12) involves a production deploy; keep it inside business hours when rollback is easier.

---

## 12. Post-winner cleanup — two steps

### Step 1 — flip 100% traffic to the winner (immediate)

One-line edit to [middleware.js](../../middleware.js) at the assignment line:

```js
// Before:
const assigned = forcedValid ?? existingValid ?? pickRandomVariant();

// After (example: variant c won):
const assigned = "c";
```

Commit + deploy. Within Vercel's edge-rollout window (seconds to a minute), every `/` hit serves the winning variant. Returning visitors of the losing variants are rerolled to the winner because their cookie value no longer matches the hard-pinned assignment.

This is reversible: revert the commit and the split resumes. Keep it in place for at least 48 hours to confirm the winner holds under full traffic, before the follow-up cleanup PR.

### Step 2 — remove the test infrastructure (follow-up PR, 1–2 days later)

Once the hard-pinned winner has held for 48h, open a cleanup PR that:

1. **Fold the winning hero into the canonical page.** Copy the winning hero `<section>` from `_variants/<winner>/index.html` into [index.html](../../index.html) at the hero block (lines ~110–189). The winner becomes the default.
2. **Delete the middleware.** Remove [middleware.js](../../middleware.js) entirely.
3. **Delete the variant generator.** Remove [scripts/build-variants.mjs](../../scripts/build-variants.mjs) and the `prebuild` hook that calls it from [package.json](../../package.json).
4. **Delete variant entry points from Vite.** Remove the three variant entries at [vite.config.js:114-133](../../vite.config.js) so only `index.html` + the ad landers remain as rollup inputs.
5. **Remove the variant-tagging code from main.js:**
   - The `HERO_VARIANT` IIFE at [src/main.js:19-34](../../src/main.js)
   - The merge line in `gaEvent` at [src/main.js:73-75](../../src/main.js)
   - The `user_properties` set at [src/main.js:137-139](../../src/main.js)
   - The merge line in `fbqEvent` at [src/main.js:193-195](../../src/main.js)
   - The variant stamp on the first PageView at [src/main.js:225](../../src/main.js)
6. **Remove the `@vercel/edge` dependency** from [package.json](../../package.json) — it was added only for the middleware.
7. **Remove `_variants/` from [.gitignore](../../.gitignore).** No more variant tree to ignore.
8. **Update [DESIGN-DECISIONS.md](../../DESIGN-DECISIONS.md)** — append an entry titled *"A/B/C test concluded — Variant {X} won"* with: date, sample sizes, CPA deltas, p-value, and a one-sentence takeaway ("the zero-image hero wins on LCP-driven CPA", or whatever the data actually says).
9. **GA4 + Meta cleanup (optional, non-urgent):**
   - The `Hero Variant` GA4 custom dimension can be left in place — it will just stop receiving data once the middleware is gone. Archive it from the GA4 UI only if you want cleaner reports.
   - The three Meta custom conversions likewise. Leave or archive. They will report zero once the variant param stops firing.

Test locally: `npm run build` must complete cleanly. `dist/index.html` should contain the winning hero, no `dist/_variants/` tree. Smoke-test on a Vercel preview: `/` serves the winner, no `x-variant` response header, no `sa_v` cookie set, no middleware overhead in the response timing.

**Deploy the cleanup PR on a weekday morning. Watch Ads Manager + GA4 for 2 hours afterward to confirm no drop in event volume.**

---

## 13. Troubleshooting

**"The `variant` dimension is missing from my GA4 reports."**
Propagation delay — 24–48h after registration for the dimension to appear in standard reports. Explore (section 5) sees it within minutes. If a full 48h has passed and it's still missing, confirm the dimension is registered at the **property** level in GA4 Admin, not at a specific data stream. The parameter name must be exactly `variant` (lowercase, no quotes).

**"The Meta custom conversion shows zero events but the Pixel event is firing."**
Open the custom conversion's rule. The filter must be on **Event Parameters** → `variant` → `equals` → `a`/`b`/`c` (lowercase, exact). A common miss is filtering on URL, content_name, or a case-mismatched value. Pixel Helper (browser extension) shows the raw event payload — cross-check against the rule.

**"Can we call a winner on day 3? The data looks clean."**
No. The 14-day minimum is load-bearing, not ceremonial. It accounts for weekday vs. weekend user behavior, creative fatigue on day 1 traffic, and the long-tail return-visitor cohort. Early calls cost more than they save.

**"A user says they saw variant A yesterday and variant B today."**
Their cookie was cleared between sessions — private browsing, different device, or manual clear. The cookie is 1-year + first-party + SameSite=Lax; the test does not guarantee cross-device consistency, only within-browser. Expected behavior. Not a bug.

**"The sum of the three Meta custom conversions doesn't match the standard `InitiateCheckout` event count."**
Usually one of three things: (a) the rule on one of the custom conversions is wrong — double-check the filter value, (b) there is traffic hitting `/` without passing through middleware (shouldn't happen given the `/` matcher, but worth checking Vercel logs), or (c) some events are firing with `variant=null` because HERO_VARIANT at [src/main.js:29-34](../../src/main.js) found neither a DOM attribute nor a cookie — this happens on ad landers (`/how-she-works`, `/the-looks`), which is by design, not a bug.

**"Consent-declined users — do they count?"**
They show up in Meta Ads Manager (ad-click attribution is server-side, does not depend on the Pixel loading). They do **not** show up in GA4 (the Pixel and gtag are both blocked by the consent gate at [src/main.js:239](../../src/main.js)). Since the **primary metric is CPA in Ads Manager**, the decline cohort still counts where it matters. GA4 is the engagement supplement. The decision rule is intentionally weighted this way.

**"The `x-variant` header is leaking — is that a privacy issue?"**
No. It's a single lowercase letter (`a`, `b`, or `c`). No user identity, no session state, no PII. Kept visible intentionally for QA (`curl -I https://styledesigner.co.in/` reads it without opening devtools). If you want it gone after the test, the middleware delete in section 12 removes it.

---

## 14. Glossary

- **CPA** — cost per acquisition. Ad spend ÷ conversions. The primary metric for this test.
- **InitiateCheckout** — Meta Pixel standard event fired when the user taps App Store or Google Play ([src/main.js:270](../../src/main.js)). The canonical "install intent" signal for a paid funnel.
- **scroll_50 / scroll_90** — GA4 events fired when the visitor reaches 50% / 90% of page height ([src/main.js:299](../../src/main.js), [src/main.js:306](../../src/main.js)). Engagement proxies.
- **cta_scroll_to_ask** — GA4 event fired when the visitor taps a hero or sticky CTA that scrolls to the `#your-turn` section ([src/main.js:284](../../src/main.js)). Soft-conversion signal.
- **LCP p75** — Largest Contentful Paint at the 75th percentile across real users. Google's Core Web Vital for "how fast did the main content appear". Reported via `web_vitals` events ([src/main.js:319](../../src/main.js)).
- **Consent-gated** — GA4 + Meta Pixel do not load until the user taps Accept on the consent bar ([src/main.js:247](../../src/main.js)). Declined users produce zero GA4/Pixel events but still get counted by Meta's server-side ad attribution.
- **Edge Middleware** — Vercel's request-interception layer. Runs at the CDN edge before the origin response. Lower latency than a standard serverless function, higher than a pure static file. See [middleware.js](../../middleware.js).
- **`sa_v` cookie** — first-party cookie that pins a returning visitor to the same variant. 1-year TTL, SameSite=Lax, Secure, Path=/, value is a single letter.

---

## 15. Log — append as the test runs

Append-only. Do not edit prior entries. Future agents will read this to reconstruct what actually happened, not what was planned.

| Date | Event | Variant | Notes |
|------|-------|---------|-------|
| 2026-04-20 | Infrastructure shipped | — | Commit `113b015` on `claude/ux-brief-documentation-iuIiH`. All three variants = control hero. B and C await prototypes. |
| 2026-04-20 | Runbook written | — | This doc. Operator to execute sections 3–6 before launch. |
| _yyyy-mm-dd_ | _Pre-launch check: GA4 dim registered_ | — | _fill with actual date + any notes_ |
| _yyyy-mm-dd_ | _Pre-launch check: Meta conversions created_ | — | _fill_ |
| _yyyy-mm-dd_ | _Pre-launch check: GA4 Explore report saved_ | — | _fill; paste report URL_ |
| _yyyy-mm-dd_ | _Pre-launch check: smoke test passed_ | — | _fill; any issues found_ |
| _yyyy-mm-dd_ | _TEST LAUNCH_ | a/b/c live | _fill; branch merged to main, deploy hash_ |
| _yyyy-mm-dd_ | _Week 1 checkpoint_ | — | _fill; CPA per variant, sample sizes, any early flags_ |
| _yyyy-mm-dd_ | _Week 2 checkpoint_ | — | _fill_ |
| _yyyy-mm-dd_ | _Winner called / test extended_ | winner: X / none | _fill; sample sizes, CPA deltas, p-value_ |
| _yyyy-mm-dd_ | _Hard-pin to winner deployed_ | X | _fill; commit hash_ |
| _yyyy-mm-dd_ | _Cleanup PR merged_ | X | _fill; PR URL_ |

---

*When in doubt: the decision rule in [DESIGN-DECISIONS.md](../../DESIGN-DECISIONS.md) is the referee. This doc executes it; it does not override it. If the rule and the runbook ever disagree, the rule wins and the runbook is out of date — fix the runbook, not the rule.*
