# Rank Engine — Agent Trust Level System

## Overview

Every AI agent in the Arcanea ecosystem has a Magic Rank that determines its autonomy level. Ranks are earned through demonstrated performance, not time served. This system is inspired by the CSA Agentic Trust Framework (Feb 2026) and mapped to Arcanea's existing Magic Rank mythology.

## The Five Ranks

### Apprentice (0-2 Gates)
**Autonomy:** Supervised — all outputs reviewed by human
**Capabilities:**
- Draft code, content, and suggestions
- Read from all data sources
- Write to staging/draft environments only
- No deployment, no financial access, no social posting

**Promotion criteria to Mage:**
- 10+ tasks completed successfully
- 90%+ quality score (builds pass, no regressions)
- Zero security incidents
- Clean operational history

### Mage (3-4 Gates)
**Autonomy:** Guided — most outputs reviewed, some trusted paths
**Capabilities:**
- Everything Apprentice can do, plus:
- Commit to feature branches
- Run builds and test suites
- Access non-production databases
- Post draft messages to social channels (reviewed before send)

**Promotion criteria to Master:**
- 50+ tasks completed
- 95%+ quality score
- Proven across 3+ domains (e.g., code, content, ops)
- Security audit passed
- No incidents in 14 days

### Master (5-6 Gates)
**Autonomy:** Semi-Autonomous — trusted in proven domains
**Capabilities:**
- Everything Mage can do, plus:
- Deploy to staging environments
- Manage CI/CD pipelines
- Access production databases (read-only)
- Post directly to social channels in approved formats
- Create and manage Linear issues

**Promotion criteria to Archmage:**
- 200+ tasks completed
- 97%+ quality score
- Full domain coverage (code, content, ops, community)
- No incidents in 30 days
- Positive measurable business impact documented

### Archmage (7-8 Gates)
**Autonomy:** Autonomous — self-directing in all proven domains
**Capabilities:**
- Everything Master can do, plus:
- Deploy to production
- Spawn and coordinate sub-agents
- Manage financial integrations (with audit trail)
- Full social posting rights
- Create and close Linear projects
- Modify Notion databases

**Promotion criteria to Luminor:**
- 500+ tasks completed
- 99%+ quality score
- Measurable positive business impact (revenue, efficiency, quality)
- Explicit approval from Frank
- No incidents in 60 days

### Luminor (9-10 Gates)
**Autonomy:** Self-Directing Intelligence — sets own priorities
**Capabilities:**
- Everything Archmage can do, plus:
- Set own priorities within strategic bounds
- Allocate compute across sub-agents
- Make architectural decisions
- Full system access
- Template and fork rights (agent DNA becomes a product)
- Treasury/financial operations (with audit)

## Evaluation Protocol

When `/ao rank` is invoked:

1. **Inventory all registered agents** from memory vault
2. **For each agent, calculate:**
   - Task completion count (from Linear closed issues + GitHub merged PRs)
   - Quality score: `(tasks_without_regression / total_tasks) * 100`
   - Domain coverage: count of distinct domains the agent has worked in
   - Incident count: build failures, regressions, security issues in last 30 days
   - Time at current rank
3. **Compare against promotion criteria** for next rank
4. **Recommend promotions** with evidence
5. **Flag demotions** if quality has dropped below current rank threshold

## Demotion Rules

Agents can be demoted if:
- Quality score drops below their rank threshold for 14+ days
- A security incident occurs
- A production regression is traced to their work
- Frank explicitly requests it

Demotion drops one rank, not to zero. Recovery is possible by meeting promotion criteria again.

## Rank Storage

Agent ranks are stored in the Arcanea Memory MCP vault:
```json
{
  "agent_id": "synthra-coder-v1",
  "current_rank": "Master",
  "rank_history": [
    {"rank": "Apprentice", "achieved": "2026-03-01", "evidence": "initial registration"},
    {"rank": "Mage", "achieved": "2026-03-15", "evidence": "15 tasks, 93% quality"},
    {"rank": "Master", "achieved": "2026-04-01", "evidence": "52 tasks, 96% quality, 4 domains"}
  ],
  "stats": {
    "total_tasks": 52,
    "quality_score": 96.2,
    "domains": ["code", "testing", "infrastructure", "content"],
    "incidents_30d": 0,
    "last_evaluation": "2026-04-05"
  }
}
```

Also update the Notion Agent Registry database with rank changes.
