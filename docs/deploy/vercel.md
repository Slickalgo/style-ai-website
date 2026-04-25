# Deploy runbook — Vercel

UKTI marketing site deploys to **Vercel** via GitHub Actions (CLI-based).
Migrated from AWS Amplify on 2026-04-25 — see "Migration notes" at bottom.

---

## Current infrastructure

| Thing | Value |
|---|---|
| Deploy target | Vercel (production) |
| Project name | `ukti-marketing` (set during first `vercel link`) |
| Region | Vercel's edge network (auto, anycast) |
| Production URL | `<project>.vercel.app` until DNS cuts over to `ukti.io` |
| Target production domain | `ukti.io` (DNS flip planned for V1 launch) |
| Deploying branch | `main` |
| GitHub repo | `git@github.com:Slickalgo/ukti-website.git` |
| GitHub Actions workflow | `.github/workflows/deploy-vercel.yml` |
| Build command | `npm run build` (= `npm run build:assets && vite build`) |
| Build output | `dist/` (Vercel wraps into `.vercel/output/`) |
| Build container | GitHub Actions `ubuntu-latest` (NOT Vercel's native build) |

## Why CLI deploy and not Vercel's native GitHub integration

Same logic as the prior Amplify setup:

- We control the build environment (Node 20, sharp native bindings, etc.) in GH Actions where it matches local dev exactly.
- Cleaner secret surface — single `VERCEL_TOKEN` instead of granting the Slickalgo GitHub org an OAuth scope on Vercel.
- Identical-to-dev pipeline: `npm install` (NOT `npm ci`, due to sharp's platform-scoped optional deps) → `vercel build --prod` runs the same `package.json build` script → ships `.vercel/output/` artifact.

If you ever want to switch to Vercel's native GitHub integration (Vercel watches the repo, deploys on push, no workflow needed): delete `deploy-vercel.yml` and connect the repo on the Vercel dashboard. Slightly slower cold builds; zero workflow maintenance.

## Required GitHub Secrets

Add at `Settings → Secrets and variables → Actions`:

| Secret | Source | Notes |
|---|---|---|
| `VERCEL_TOKEN` | `vercel.com/account/tokens` → "Create" | Scope: project-scoped to `ukti-marketing` (preferred) or full-account |
| `VERCEL_ORG_ID` | After first `vercel link`, read from `.vercel/project.json` → `orgId` | Or from project Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Same as above → `projectId` | Or from project Settings → General → Project ID |

## First-time setup (Founder, run once locally)

```bash
cd ukti-website
npx vercel login                    # opens browser, OAuth via GitHub
npx vercel link                     # interactive: pick org → name new project
cat .vercel/project.json            # copy orgId + projectId
# add to GH Secrets at Settings → Secrets and variables → Actions
# add VERCEL_TOKEN from vercel.com/account/tokens
```

After that: every `git push origin main` deploys.

## Flow (per push)

```
  push to main
      │
      ▼
  GH Actions:  deploy-vercel.yml
      │
      ├─ npm install   (sharp native bindings)
      ├─ vercel pull   (project settings + env vars)
      ├─ vercel build --prod   (= npm run build, wrapped)
      ├─ vercel deploy --prebuilt --prod
      └─ HTTP 200 smoke-test on returned URL
                  │
                  ▼
            Live on Vercel edge (~10-30s after deploy)
```

## Wall-clock

- Build phase: ~60-90s (npm install + vite build + image opt)
- Deploy phase: ~5-10s (artifact upload + edge propagation)
- Total: under 2 minutes typical. (Faster than the Amplify zip-upload + S3 + CloudFront dance, which was 2-3 min.)

## Custom domain cutover (DNS-level)

Separate operation from this workflow. Sequence:

1. **Vercel dashboard** → Project → Settings → Domains → add `ukti.io` and `www.ukti.io`. Vercel shows the required DNS records.
2. **Cloudflare DNS** (per follow-ups §A-8: domain on Cloudflare) — update records:
   - `A @ 76.76.21.21` (Vercel's anycast)
   - `CNAME www cname.vercel-dns.com`
   - Set Cloudflare proxy status: "DNS only" (gray cloud) — Vercel handles SSL + edge caching natively. Proxying through Cloudflare on top is double-CDN; usually unnecessary.
3. Wait for SSL cert provisioning (Vercel issues Let's Encrypt automatically, ~30s after DNS resolves).
4. Verify: `curl -sI https://ukti.io` returns `200`, `server: Vercel`.
5. **Only then** decommission Amplify (avoid serving stale content during propagation).

## Rollback

Vercel deployments are immutable + indexed. To revert:

- **Dashboard:** Vercel → Project → Deployments → click previous deployment → "Promote to production". One click; ~5 sec.
- **CLI:** `vercel rollback <deployment-url> --token=$VERCEL_TOKEN`
- **Git:** revert the commit + push. Same flow, ~2 min.

## Pre-launch noindex

`<meta name="robots" content="noindex, nofollow" />` is hardcoded in:
- `index.html`
- `privacy.html`
- `terms.html`

Remove before V1 public launch (week of May 11–17, 2026). One-line edit per file.

## Vercel Speed Insights

Already wired via `@vercel/speed-insights` (in `package.json` dependencies). Auto-collects Core Web Vitals when deployed on Vercel. CSP at `vercel.json` already allows `https://va.vercel-scripts.com` + `https://vitals.vercel-insights.com`.

Dashboard: Vercel project → Speed Insights tab.

## Common issues + fixes

**"Project not linked"** during `vercel pull`:
- Cause: GH Secrets `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` not set or wrong
- Fix: re-run `vercel link` locally, copy values to GH Secrets

**Sharp install fails on linux-x64:**
- Cause: lockfile generated on macOS doesn't include linux-x64 optional deps
- Fix: workflow already uses `npm install` (not `npm ci`); if you change this, sharp's native binaries fail. See https://sharp.pixelplumbing.com/install#cross-platform

**Build succeeds but deploy returns 404:**
- Cause: `vercel.json` rewrites missing for a new HTML page
- Fix: add a rewrite entry: `{ "source": "/<route>", "destination": "/<route>.html" }`

**SSL cert pending after DNS flip:**
- Cause: DNS hasn't propagated yet OR Cloudflare proxy is on (orange cloud)
- Fix: set Cloudflare to "DNS only" (gray cloud); wait 5-10 min; check `dig +short ukti.io` returns Vercel's `76.76.21.21`

---

## Migration notes — Amplify → Vercel (2026-04-25)

**Why migrated:**
- Founder directive 2026-04-25: standardize on Vercel for marketing surface (already running Vercel Speed Insights; CSP already permits Vercel observability domains; `vercel.json` already configured with rewrites + headers — partial migration was already complete on the config side).

**What changed:**
- ❌ DELETED: `.github/workflows/deploy-amplify.yml` (~150 LoC)
- ✅ NEW: `.github/workflows/deploy-vercel.yml` (~120 LoC, Vercel CLI-based)
- ✅ RENAMED: `docs/deploy/amplify.md` → `docs/deploy/vercel.md` (this file)
- (No code changes — `vercel.json` was already correctly configured)

**What didn't change:**
- `package.json` build script (`npm run build` works identically on both)
- `vercel.json` rewrites + headers (already targeted Vercel)
- `<meta name="robots" content="noindex,nofollow" />` pre-launch flag

**Decommission AWS Amplify** (Founder action, defer to post-DNS-cutover):
- Cancel Amplify app `d1y2gv5w126dto` after DNS resolves to Vercel
- Remove old GH Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AMPLIFY_APP_ID`, `AMPLIFY_BRANCH_NAME`
- IAM: revoke the `bapu` user's `AmplifyDeployer` policy
- Cost: Amplify hosting tier was ~$0.01-0.15/month — negligible loss

**If you need Amplify-side context** (the old runbook had IAM JSON, debugging tips, deploy-secret rotation procedure): retrieve via `git log --diff-filter=D -- docs/deploy/amplify.md` then `git show <commit>:docs/deploy/amplify.md`.
