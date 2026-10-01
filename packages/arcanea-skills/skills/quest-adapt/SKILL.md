---
name: quest-adapt
description: Adapt supplied world and story material into one bounded quest or interactive scene with inspectable dialogue, conditions, consequences and replay cases.
metadata:
  internal: true
---

# Adapt one quest

Start with world facts, scene objective and target runtime if specified. Preserve an existing engine/state format. Without one, deliver an editable narrative/state packet rather than selecting an engine or building a general game platform.

Choose one playable decision with a meaningful consequence. Identify start condition, player goal, involved characters, success/failure conditions and endings. Use stable world IDs; new facts remain proposals.

Describe each transition with source state, player action, conditions, effects and destination. Declare variables and initial values. Keep impossible actions unavailable and explain why. Avoid cosmetic alternatives that converge without an expressed consequence.

Provide replay cases for intended endings and at least one unavailable action. Check that targets exist, variables have defined meanings and outcomes are reachable. Distinguish deterministic packet checks from an actual engine playtest.

Read [references/example.md](references/example.md) for a small quest. Its notation is illustrative, not a new required world schema. Official Arcanea adaptations consume the approved versioned world/Realm Graph contract supplied by the creator.

Consequences are game/session state or proposals. They never automatically change accepted world facts or official canon. Keep asset references and rights visible; downloadable art has no implied commercial license.

Deliver the packet, source references, unresolved choices and playtest questions. A readable packet is not a running game. State whether it was imported, replayed or played, and retain export/recovery paths when implementation is separately requested.
