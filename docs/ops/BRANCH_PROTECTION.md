# Branch protection setup

One-time setup per repo. Requires `gh` CLI authenticated as a repo admin.

## arcanea-ai-app (production)

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  repos/frankxai/arcanea-ai-app/branches/main/protection \
  -f required_status_checks='{"strict":true,"contexts":["Quality Gate","Guardian PR Check"]}' \
  -f enforce_admins=false \
  -f required_pull_request_reviews='{"required_approving_review_count":1,"require_code_owner_reviews":true,"dismiss_stale_reviews":true}' \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f allow_deletions=false \
  -f required_linear_history=true \
  -f required_conversation_resolution=true
```

## arcanea (OSS)

Same as above, swap `arcanea-ai-app` → `arcanea`.

## Verify

```bash
gh api repos/frankxai/arcanea-ai-app/branches/main/protection | jq '{
  force_pushes: .allow_force_pushes.enabled,
  deletions: .allow_deletions.enabled,
  linear_history: .required_linear_history.enabled,
  code_owner_reviews: .required_pull_request_reviews.require_code_owner_reviews,
  required_checks: [.required_status_checks.contexts[]]
}'
```

Expected output:
```json
{
  "force_pushes": false,
  "deletions": false,
  "linear_history": true,
  "code_owner_reviews": true,
  "required_checks": ["Quality Gate", "Guardian PR Check"]
}
```

## What this enforces

- No direct pushes to `main` — PR required
- At least 1 approving review (CODEOWNERS applies for sacred paths)
- Stale reviews dismissed when new commits arrive
- No force-push to main (the `073bc640` class of incident)
- No branch deletion via push
- Linear history (no merge commits that tangle blame)
- All conversations resolved before merge
- `Quality Gate` + `Guardian PR Check` CI must pass

## Bypass (admin override)

`enforce_admins=false` means you (as admin) can override in genuine emergencies.
Flip to `true` once the team is comfortable and Frank trusts the gates fully.

## Signals that protection is working

- Your muscle-memory `git push origin main` fails with `protected branch` → ✓
- PR shows "Review required" even when you approved it yourself → ✓
- `gh pr merge` refuses until checks pass → ✓
