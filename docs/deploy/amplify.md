# Deploy runbook — AWS Amplify

UKTI marketing site deploys to AWS Amplify via GitHub Actions. This doc is the
operational reference for first-time setup, rotating secrets, cutting over to
a new app, and debugging failed deploys.

## Current infrastructure

| Thing | Value |
|---|---|
| AWS account | `575108946398` |
| IAM user running deploys | `bapu` (local) / dedicated CI user (recommended — see below) |
| Amplify region | `ap-south-1` (Mumbai) |
| Amplify app id | `d1y2gv5w126dto` |
| Amplify app name | `ukti-marketing` (renamed from `style-designer-marketing` on 2026-04-22 via `aws amplify update-app`) |
| Default Amplify domain | `https://main.d1y2gv5w126dto.amplifyapp.com` (per-branch URL — the bare appId domain is not routed; see "Why the branch prefix" below) |
| Target production domain | `ukti.io` (DNS flip planned week of May 11–17, 2026) |
| Deploying branch | `main` |
| GitHub repo | `git@github.com:Slickalgo/style-ai-website.git` |

## Flow

```
  push to main
      │
      ▼
  GH Actions:  deploy-amplify.yml
      │
      ├─ npm ci
      ├─ npm run build  (prebuild + vite build)
      ├─ zip dist/ → amplify-upload.zip
      ├─ aws amplify create-deployment  → { jobId, zipUploadUrl }
      ├─ curl PUT amplify-upload.zip → zipUploadUrl
      ├─ aws amplify start-deployment
      └─ poll aws amplify get-job until SUCCEED | FAILED
                                              │
                                              ▼
                                     CloudFront propagates (~30s)
```

## GitHub Secrets required

Set under **Settings → Secrets and variables → Actions → Repository secrets**:

| Secret | Value |
|---|---|
| `AWS_ACCESS_KEY_ID` | Access key id for the CI IAM user |
| `AWS_SECRET_ACCESS_KEY` | Secret key for the CI IAM user |
| `AWS_REGION` | `ap-south-1` |
| `AMPLIFY_APP_ID` | `d1y2gv5w126dto` |
| `AMPLIFY_BRANCH_NAME` | `main` |

## IAM policy for the CI user

Create a dedicated IAM user `ukti-ci-deployer` (do NOT use your personal
access keys for GH Actions). Attach an inline policy with only the
permissions the workflow actually needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AmplifyDeploy",
      "Effect": "Allow",
      "Action": [
        "amplify:CreateDeployment",
        "amplify:StartDeployment",
        "amplify:GetJob",
        "amplify:ListJobs"
      ],
      "Resource": [
        "arn:aws:amplify:ap-south-1:575108946398:apps/d1y2gv5w126dto",
        "arn:aws:amplify:ap-south-1:575108946398:apps/d1y2gv5w126dto/*"
      ]
    }
  ]
}
```

The zip upload itself goes to a pre-signed S3 URL returned by Amplify — no
separate S3 permissions are needed; the signature authorizes the PUT.

Create the user + key via the AWS console or:

```bash
aws iam create-user --user-name ukti-ci-deployer
aws iam put-user-policy \
  --user-name ukti-ci-deployer \
  --policy-name AmplifyDeploy \
  --policy-document file://iam-policy.json
aws iam create-access-key --user-name ukti-ci-deployer
# copy AccessKeyId + SecretAccessKey into GitHub Secrets, then never again.
```

## Custom rewrite rules

Clean, minimal set (pretty URLs → the actual HTML files):

| Source | Target | Status |
|---|---|---|
| `/terms` | `/terms.html` | 200 |
| `/terms/` | `/terms.html` | 200 |
| `/privacy` | `/privacy.html` | 200 |
| `/privacy/` | `/privacy.html` | 200 |
| `/how-it-works` | `/how-it-works.html` | 200 |
| `/how-it-works/` | `/how-it-works.html` | 200 |
| `/press` | `/press.html` | 200 |
| `/press/` | `/press.html` | 200 |

Applied via `aws amplify update-app --app-id d1y2gv5w126dto --custom-rules ...`
— see `scripts/amplify-set-rewrites.sh` for the idempotent script. (The
pre-rebrand app had 20+ stale `/guides/*` rules from the deleted Style.ai
SEO pages; those were purged when we cut over.)

## Debugging failed deploys

1. **GH Actions job red** — open the failing step's log. The "Wait for
   deployment to finish" step polls `aws amplify get-job` and prints status
   each attempt; if it hit `FAILED`, the problem is inside Amplify.
2. **Amplify console** — <https://ap-south-1.console.aws.amazon.com/amplify/apps/d1y2gv5w126dto/branches/main/deployments>
   has per-job logs. For upload/deploy-phase failures (vs. build phase —
   which doesn't exist on the API flow) the error is usually about the zip
   structure (missing `index.html` at root, etc.).
3. **Custom rules regression** — if pretty URLs 404 after a deploy,
   `aws amplify get-app --app-id d1y2gv5w126dto --query 'app.customRules'`
   and confirm the rules survived.
4. **Manual rollback** — Amplify keeps job history; a prior SUCCEED job
   can be redeployed from the console (Redeploy button). Prefer this over
   reverting commits when the issue is infra, not content.

## Why the branch prefix

Amplify serves each branch at its own subdomain:
`https://<branch>.<appId>.amplifyapp.com`. The bare `<appId>.amplifyapp.com`
returns 404 unless you promote a branch to `productionBranch` (only done
when attaching a custom domain — a separate concern). When we wire `ukti.io`
in launch week, that custom-domain record will point at the `main` branch
explicitly, so `https://ukti.io` will serve the site end-users see, and the
branch-prefixed URL above stays as the canonical staging URL.

## First-time setup checklist

- [ ] Create `ukti-ci-deployer` IAM user with the policy above
- [ ] Create an access key for the user, record id + secret
- [ ] Add the five GitHub Secrets listed above
- [ ] Push to `main` OR trigger the workflow manually via
      **Actions → Deploy to AWS Amplify → Run workflow**
- [ ] Watch the job succeed; confirm `https://main.d1y2gv5w126dto.amplifyapp.com`
      shows the new build
- [ ] (Later) add custom domain `ukti.io` in the Amplify console, verify
      DNS records at the registrar, wait for cert validation

## Rename the Amplify app (cosmetic)

Already renamed to `ukti-marketing` on 2026-04-22. If you ever need to rename
again (e.g. splitting into `ukti-marketing-prod` + `ukti-marketing-preview`):

```bash
aws amplify update-app \
  --app-id d1y2gv5w126dto \
  --name ukti-marketing
```

Changes the console label only; app-id stays the same, default domain
stays `main.d1y2gv5w126dto.amplifyapp.com`.
