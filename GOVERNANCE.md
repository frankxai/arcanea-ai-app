# Governance

Arcanea is maintainer-led.

Frank Riemer / FrankX owns the product direction, brand, licensing, public
positioning, and final merge authority. Contributions are reviewed against:

- product north star in [AGENTS.md](./AGENTS.md)
- current state and backlog in [planning-with-files/](./planning-with-files/)
- design and taste standards in [DESIGN.md](./DESIGN.md) and [TASTE.md](./TASTE.md)
- security, licensing, and operational risk

## Decision Records

Material direction changes should be recorded in `planning-with-files/` or
`docs/architecture/` with:

- context
- decision
- consequences
- verification or rollback path

## Branch And Merge Policy

- Work from a fresh branch.
- Keep slices narrow and verifiable.
- Prefer cherry-picking reviewed commits over merging stale branch heads.
- Do not merge if build, typecheck, lint, or scoped verification fails.
