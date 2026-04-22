#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# Idempotent: apply the canonical rewrite rule set to the UKTI Amplify app.
#
# Why this lives in a script rather than documentation:
#   - The pre-UKTI Amplify app inherited 20+ /guides/* rules from the
#     Style.ai SEO guides that were deleted during the rebrand. Those need
#     to be purged, not hand-managed via the console where they'll drift.
#   - A future custom-domain or new page (e.g. /about) is a one-line edit
#     here + a re-run — not a "remember to update the console" chore.
#
# Usage:
#   ./scripts/amplify-set-rewrites.sh
#
# Requirements:
#   - AWS_PROFILE or env credentials with amplify:UpdateApp on the app
#   - jq available on PATH (Amplify returns the current rules as JSON which
#     we could diff against in the future; unused today but cheap to keep)
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

APP_ID="${AMPLIFY_APP_ID:-d1y2gv5w126dto}"
REGION="${AWS_REGION:-ap-south-1}"

# The complete canonical ruleset. Replaces whatever is currently configured
# — this is a full overwrite via update-app, not a merge.
RULES_JSON='[
  {"source":"/terms","target":"/terms.html","status":"200"},
  {"source":"/terms/","target":"/terms.html","status":"200"},
  {"source":"/privacy","target":"/privacy.html","status":"200"},
  {"source":"/privacy/","target":"/privacy.html","status":"200"},
  {"source":"/how-it-works","target":"/how-it-works.html","status":"200"},
  {"source":"/how-it-works/","target":"/how-it-works.html","status":"200"},
  {"source":"/press","target":"/press.html","status":"200"},
  {"source":"/press/","target":"/press.html","status":"200"}
]'

echo "[amplify-set-rewrites] region=$REGION app=$APP_ID"
echo "[amplify-set-rewrites] applying $(echo "$RULES_JSON" | jq length) rules..."

aws amplify update-app \
  --region "$REGION" \
  --app-id "$APP_ID" \
  --custom-rules "$RULES_JSON" \
  --query 'app.customRules' \
  --output json

echo "[amplify-set-rewrites] done."
