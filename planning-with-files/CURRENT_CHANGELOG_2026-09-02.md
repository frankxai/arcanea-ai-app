# Arcanea Development Changelog

Date: 2026-09-02
Status: Growth Core integration staged

## Capture repair

- Replaced the `waitlists` insert that swallowed missing-table and connection failures.
- The waitlist API now writes to the shared Starlight Growth Core and returns success only after confirmed persistence.
- Added explicit program segmentation for the Founding Circle and the community footer newsletter.
- Converted the footer newsletter from a no-op form into a real, accessible submission path.
- Added bounded input handling, a honeypot, upstream timeout, and 429/503 failure semantics.
- Kept Arcanea product/auth state in the Arcanea database; only consented growth capture enters the shared ledger.

## Promotion gate

Typecheck, lint, build, Vercel preview, and an end-to-end database receipt must pass before merge.
