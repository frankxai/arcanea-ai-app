# AI Exact-Head Review Contract

## Purpose

`AI Exact-Head Review` is Arcanea's independent autonomous review gate for ordinary same-repository pull requests targeting `main`.

## Required properties

- The workflow runs from the protected base via `pull_request_target` and checks out only the base SHA.
- It retrieves PR metadata and textual diffs through GitHub API, verifies the event head SHA, and never runs PR-head code while repository secrets are present.
- It accepts only `APPROVE`, `REQUEST_CHANGES`, or `BLOCK` structured verdicts.
- Any unavailable model, missing provider capability, incomplete patch context, malformed response, provider failure, fork PR, or non-`APPROVE` verdict fails the status check.
- Model discovery uses Google Models API capability metadata and bounded pagination; only `generateContent`-capable Gemini models are eligible.
- GitHub protection requires this exact status plus strict `Build`; GitHub auto-merge is the only ordinary merge path.

## Evidence

Each run updates one sticky PR receipt containing the exact base/head SHAs, reviewed scope, selected model, verdict, and bounded findings. Comments are evidence only; the status check is the merge authority.

## Exclusions

Provider billing, repository secrets, production environment changes, Stripe activation, DNS, legal commitments, and destructive data operations remain explicitly human-gated.
