---
title: Agentic Autonomy Ladder
aliases: [agent capabilities, trust rungs, autonomy progression]
tags: [atom, agents, software]
status: evolving
domain: agents
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/council-over-assistant]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Agentic Autonomy Ladder

Five rungs: suggest → draft → execute-with-review → execute-with-logs → execute-silent. Promote only on trust.

Each rung represents a different level of agent agency. You don't skip rungs; you promote once the previous level is proven reliable.

**Rung 1: Suggest.** Agent surfaces options, human picks one. No risk. Example: "Draft A, Draft B, or Draft C?" You choose.

**Rung 2: Draft.** Agent produces a complete artifact (document, code, design), human reviews before deployment. Low risk. Example: the agent writes the blog post, you read it before publishing.

**Rung 3: Execute-with-Review.** Agent deploys the artifact and notifies you for approval in retrospect. Medium risk. Example: the agent publishes a tweet and sends you a message saying "published this; revert if wrong."

**Rung 4: Execute-with-Logs.** Agent deploys and logs the action; you audit logs weekly or monthly. Medium-high risk. Example: the agent syncs calendar events and you spot-check the log entry.

**Rung 5: Execute-Silent.** Agent deploys with zero notification. High risk. Example: the agent adjusts your portfolio allocation without telling you (this rung is rare and requires high trust).

Frank's agent hierarchy (Apr 2026):
- **Lumina (Orchestrator):** Rung 4 (execute-with-logs, weekly audit)
- **Chronos (Software/Shipping):** Rung 3 (review before merge)
- **Syntaxa (Prompts/Content):** Rung 3 (review before publish)
- **Sophia (Purpose/Philanthropy):** Rung 2 (draft, human decides)
- **Oracle (Research):** Rung 2 (draft horizon scans)

Promotion requires: ≥10 sequential correct decisions, zero "severe" errors, human confidence in the agent's judgment. Demotion is instant if any rung-critical error occurs.

## Related
- [[../concepts/council-over-assistant]] — the organization above this
- [[../../00-MOCs/MOC-Patterns]] — agent design
