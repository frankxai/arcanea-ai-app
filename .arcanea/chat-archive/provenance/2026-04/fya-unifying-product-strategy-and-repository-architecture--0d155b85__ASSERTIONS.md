# Claude's canon assertions -- FYA Unifying product strategy and repository architecture

Source uuid: 0d155b85-465c-49ab-b18c-610f289cf4ef

CONFIRMED = Frank's next message reads as explicit approval. PUSHED-BACK = reads as disagreement. UNCLEAR/NO-RESPONSE = no clean signal -- treat as OPEN, not LOCKED.

| Verdict | Claude said | Frank's next message |
|---|---|---|
| UNCLEAR | I'm also noticing from the Developer Hub that the main product is actually called `arcanea-ai-app` rather than just `arcanea`, and it's already live on arcanea.ai with locked architecture decisions, a | Continue |
| UNCLEAR | For code organization, I'm moving to four lanes instead of three: a single product repo for the deployed app, a foundation monorepo containing the core libraries and canonical data, plus the ecosystem | Continue |
| UNCLEAR | `arcanea` keeps Guardian/Vel'Tara canonical content and worldbuilding only. | Continue |
| NO-RESPONSE | Actually, thinking this through more carefully — the architecture decisions are already locked in Notion as the authoritative source, and my memory is meant to be a cache, not a duplicate. | (none) |
| NO-RESPONSE | What really matters for continuity is just knowing that the architecture was decided and where to find it. | (none) |
| NO-RESPONSE | So I'll replace entry 24 with a compressed note: the ecosystem architecture was finalized on 2026-04-20 with Notion as intent, the repos.json file as the contract, and GitHub as state, plus the 5 lane | (none) |
| NO-RESPONSE | Once those are resolved and the new `arcanea-ecosystem` repo is created with the Notion integration wired up, we'll have everything in place to ingest the full ecosystem.**Executed this pass:**  1. | (none) |
| NO-RESPONSE | [ADR-0001 — Source-of-Truth Hierarchy](https://www.notion.so/34826ac2b7f68186a92fe6638d5182e2) locked. | (none) |
| NO-RESPONSE | [ADR-0002 — Five-Lane Code Organization](https://www.notion.so/34826ac2b7f68123aaeee00e9fdd7642) locked. | (none) |