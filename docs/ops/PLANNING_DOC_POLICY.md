# Arcanea Planning Document Policy

Date: 2026-03-29
Status: Draft operating policy

## Purpose

Arcanea planning output currently mixes:

- scratch notes
- review artifacts
- source-of-truth operating docs

That creates two problems:

- good work disappears into ignored paths
- ignored scratch folders get mistaken for durable system memory

This policy defines where planning documents belong and how they should be treated.

## Document Classes

### 1. Ephemeral Scratch

Purpose:

- private thinking
- temporary prompts
- rough plans
- disposable checklists

Allowed locations:

- `planning-with-files/`
- `.tmp/`
- agent-local temp folders

Git policy:

- ignored by default
- not relied on as organizational memory

Examples:

- one-off exploration
- in-progress notes that are not yet decision quality

### 2. Review Artifact

Purpose:

- branch review
- audit report
- verification record
- migration recommendation

Allowed locations:

- `planning-with-files/` while in draft
- promote to `docs/ops/` or `docs/technical/` if needed as durable record

Git policy:

- may be force-added if intentionally preserved
- must include date and scope

Examples:

- `TESTING_BRANCH_REVIEW.md`
- package health audit
- ecosystem status audit

### 3. Source-of-Truth Operating Doc

Purpose:

- release policy
- environment contract
- branch rules
- ownership rules
- architecture policy

Allowed locations:

- `docs/ops/`
- `docs/technical/`

Git policy:

- tracked normally
- reviewed for drift

Examples:

- release policy
- preview env checklist
- planning doc policy

## Placement Rules

Put it in `planning-with-files/` when:

- it is a draft
- it is scoped to a single review or short-lived decision
- it may be discarded

Put it in `docs/ops/` when:

- it defines recurring operating rules
- it affects multiple repos or multiple people
- future agents should treat it as policy

Put it in `docs/technical/` when:

- it documents architecture, ecosystem shape, or technical direction

## Naming Rules

Every durable planning/review doc should include:

- clear title
- date
- scope
- status

Preferred naming:

- `TOPIC_POLICY.md`
- `TOPIC_CHECKLIST.md`
- `TOPIC_AUDIT_YYYY-MM-DD.md`
- `TOPIC_REVIEW_YYYY-MM-DD.md`

## Promotion Rules

Promote a planning doc out of `planning-with-files/` when:

- it is referenced more than once
- it informs future execution, not just one session
- it records a decision that should survive branch churn

Promotion flow:

1. write or refine in `planning-with-files/`
2. confirm it reflects actual repo truth
3. move or rewrite into `docs/ops/` or `docs/technical/`
4. keep the planning copy only if it contains transient context not needed in the final doc

## Ignore Policy

Current reality:

- `planning-with-files/` is ignored

Implication:

- important artifacts in that folder will be invisible unless force-added

Policy:

- continue treating `planning-with-files/` as scratch-first
- force-add only when the artifact is intentionally being preserved
- do not assume files there are durable unless they were explicitly committed

## Review Rules

Before relying on a planning doc, ask:

1. Is it tracked?
2. Is it dated?
3. Is it still aligned to current repo reality?
4. Is it policy, audit, or scratch?

If the answer is unclear, the doc is not source-of-truth.

## Operating Standard

Arcanea should keep fast agent thinking lightweight, but durable decisions must leave the scratch zone.

That means:

- scratch is allowed
- hidden policy is not
- if a document governs future work, it belongs in `docs/`
