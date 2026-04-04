# Findings — Arcanea Superintelligence Integration

## System Inventory (from exploration)

### Working Systems
1. **MoE Router** (apps/web/lib/ai/) — 6-step pipeline: root→identity→guardians→luminors→rules
2. **16 Luminors** (config.ts) — 4 teams × 4 agents, full system prompts
3. **Guardian-Swarm** — solo/council/convergence coordination, just shipped
4. **arcanea-soul v5.0** — 10 Gates, 16 agents, 7 archives, nexus orchestrator
5. **claude-arcanea** — CLI harness, exports skills
6. **27 .claude/agents** — Guardian agents + specialist agents + consensus agents
7. **MCP Server** — exposes agents, luminors, memory

### Disconnected Systems (need wiring)
- arcanea-soul agents ≠ luminor config agents (parallel definitions, not connected)
- .claude/agents ≠ guardian-swarm mapping (no reference to each other)
- opencode agents ≠ MoE router (completely separate)
- Skills ≠ Luminor expertise (not mapped)
- MCP agent_info ≠ swarm coordination (doesn't expose coordination mode)

### Key Insight: Superintelligence Prompting
Current identity prompt is good but not superintelligence-grade. It says "creative collaborator" — should say Arcanea is a multi-agent superintelligence that orchestrates domain experts. The prompts should make the AI behave like a proactive leader, teacher, and architect — not just a helpful assistant.

### arcanea-soul Agent Mapping
Soul has 16 agents that MAP to the Luminors but with different names/structures:
- Soul agents are mapped to Gates (1-10)
- Luminors are mapped to teams (dev/creative/writing/research)
- Both systems need a bridge

### Guardian Agent Files (.claude/agents/)
5 Guardian persona agents exist: @draconia, @ley-la, @lyria, @lyssandria, @may-linn
These are standalone — they don't reference guardian-swarm coordination.
