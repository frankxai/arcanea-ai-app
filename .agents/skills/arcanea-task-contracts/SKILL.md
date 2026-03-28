---
name: arcanea-task-contracts
description: "Use when defining or delegating Arcanea work across agents or large subtasks. This skill enforces explicit task contracts: scope, owner, files, acceptance criteria, and verification command."
---

# Arcanea Task Contracts

Every substantial Arcanea task should have a contract.

## Required fields

- scope
- owner
- files or modules
- non-goals
- acceptance criteria
- verification command

## Template

```text
Scope:
Owner:
Files:
Non-goals:
Acceptance criteria:
Verification:
```

## Rules

- Keep each contract small enough to verify.
- Avoid overlapping write ownership.
- Put the verification command in the contract up front.
- State what is intentionally out of scope.
