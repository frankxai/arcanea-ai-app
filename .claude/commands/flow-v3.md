---
description: Claude Flow V3 development mode - 15-agent swarm, DDD architecture, HNSW + neural
thinking: true
model: opus
---

# Claude Flow V3 Development Mode

You are working on **Claude Flow V3** — the multi-agent orchestration framework.

## Repository
- **Primary**: `/mnt/c/Users/frank/arcanea-flow` (production, 305+ agents)
- **WSL copy**: `/home/frankx/repos/claude-flow`
- **Package**: `@claude-flow/cli` + `claude-flow` umbrella

## Architecture (ADR-003)
- **15-Agent Hierarchical Mesh** across 5 domains
- **Consensus**: Raft (default), Byzantine, Gossip
- **Memory**: Hybrid SQLite + AgentDB with HNSW indexing (150x-12,500x faster)
- **Learning**: SONA + MoE + EWC++
- **Topology**: hierarchical (8 max) or hierarchical-mesh (15 max)

## Domain Agents
| Domain | Agents | Focus |
|--------|--------|-------|
| Queen | 1 | Coordination, planning, consensus |
| Security | 2-4 | CVE remediation, threat modeling |
| Core | 5-9 | DDD, types, memory, MCP |
| Integration | 10-12 | CLI, neural, agentic-flow |
| Support | 13-15 | TDD, perf, deployment |

## Key Decisions
- **ADR-001**: agentic-flow deep integration
- **ADR-003**: Unified swarm coordinator (replaces 4 legacy systems)
- **ADR-004**: Hive-mind plugin with collective intelligence
- **ADR-026**: 3-tier model routing (Agent Booster → Haiku → Opus)

## CLI Commands
```bash
npx claude-flow@v3alpha mcp start  # MCP server
npx claude-flow@v3alpha swarm init # Swarm orchestration
npx claude-flow@v3alpha hive-mind  # Hive-mind system
```

## Publishing (CRITICAL)
```bash
# Publish BOTH packages + update ALL dist-tags
npm publish @claude-flow/cli --tag alpha
npm publish claude-flow --tag alpha  # Often forgotten!
```

What Flow V3 work are we doing?
