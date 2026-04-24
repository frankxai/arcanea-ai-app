---
title: Invariants Over Rules
aliases: [enforced constraints, code checks, non-negotiable properties]
tags: [atom, software, growth]
status: stable
domain: software
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/shipped-beats-perfect]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Invariants Over Rules

Encode invariants (things that must always be true) as code/checks; rules rot, invariants compound.

A rule is a guideline: "Always check error responses." A rule is easy to break and easy to forget. Invariants are things that are mathematically true by construction: "All user IDs are non-null UUIDs." Invariants are enforced.

The difference in practice:

**Rules (brittle):**
- Type every parameter (you'll forget sometimes)
- Validate all inputs (you'll skip one in a hot loop)
- Never write to X without reading Y first (someone will refactor and miss it)

**Invariants (resilient):**
- `const userId: NonNullableUUID = parseId(raw)` or throw
- `database.insert({...record}, { constraints: ['userId_not_null'] })`
- `readonly fields` in TypeScript so you can't write X without the compiler knowing you touched Y

The payoff: as the codebase grows, rules require discipline. Invariants scale without discipline. Rules rot in 6 months. Invariants are checked on every execution.

Frank's practice (Arcanea codebase):
- **TypeScript strict mode:** makes null a compile error, not a runtime error
- **Database constraints:** NOT NULL, UNIQUE, FOREIGN KEY are invariants, not aspirations
- **Readonly datastructures:** where state shouldn't be mutable, it's physically immutable
- **API route checks:** every API endpoint asserts `if (!userId) throw` at the top, not somewhere in the middle

The cost: invariants take longer to design. You can't be sloppy. But the payoff is that as the system scales, you don't need to hire more QA engineers; the system enforces itself.

## Related
- [[../concepts/shipped-beats-perfect]] — what you can relax
- [[../../00-MOCs/MOC-Patterns]] — system design
