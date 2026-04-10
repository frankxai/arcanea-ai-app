# @arcanea/registry-mcp

**MCP server for the Arcanea Agent Registry Protocol.**

An open protocol for publishing, discovering, and deploying AI agents across platforms. Free to use. Free to fork. Attribution built in.

## Philosophy

Abundance over extraction. No revenue splits, no platform fees, no KYC. The registry is pure infrastructure — revenue flows to adjacent products (blueprints, community, premium features), not through the protocol itself.

This is npm's playbook, not Etsy's.

## Install

```bash
# Inside the monorepo
pnpm --filter @arcanea/registry-mcp build

# Or globally via node
node packages/arcanea-registry-mcp/dist/cli.js
```

## Environment

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Claude Code integration

Add to `.mcp.json`:

```json
{
  "mcpServers": {
    "arcanea-registry": {
      "command": "node",
      "args": ["path/to/packages/arcanea-registry-mcp/dist/cli.js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

## Tools

### `registry_search`
Find agents by query, capabilities, category, or tags.

```typescript
registry_search({
  query: "code review",
  category: "core-development",
  limit: 20
})
```

### `registry_publish`
Publish an agent to the registry. Upserts the creator profile and optionally registers associated skills.

```typescript
registry_publish({
  id: "my-agent",
  name: "My Agent",
  title: "Agent Title",
  category: "creative",
  description: "What it does",
  capabilities: ["writing", "analysis"],
  spec: { /* agent config */ },
  creator_id: "uuid",
  creator_name: "Creator Name"
})
```

### `registry_deploy`
Deploy an agent to a platform. Creates a deployment record and emits an attribution event. Free — no revenue logic.

```typescript
registry_deploy({
  agent_id: "my-agent",
  deployer_id: "user-uuid",
  platform_id: "trinity" // optional
})
```

### `registry_status`
Check deployment health for a specific deployment or all deployments of an agent.

### `registry_usage`
Query usage analytics — token counts, invocation counts, duration stats.

### `registry_attribution`
Query creator attribution — reach, deploys, usages, tips. Public by design.

```typescript
registry_attribution({
  creator_id: "user-uuid"
})
// Returns: { reach: { deploys, usages, platforms_reached, ... } }
```

### `registry_skills`
List, search, or publish skills. Skills can be standalone or attached to agents.

### `registry_platforms`
List active platforms or register a new platform (generates API key).

## Schema

The registry runs on Supabase with these tables:

| Table | Purpose |
|-------|---------|
| `marketplace_agents` | Agent registry (extended with pgvector embeddings) |
| `platforms` | Registered consumer platforms |
| `creators` | Creator profiles with attribution scores |
| `deployments` | Who deployed what, where |
| `usage_events` | Execution telemetry |
| `attribution_events` | Reach + voluntary tips (no revenue splits) |
| `skill_registry` | Independently publishable skills |
| `platform_api_keys` | Scoped platform access keys |

All tables have Row-Level Security with multi-tenant isolation.

## Protocol notes

- **All agents default to `is_open = true`.** Free to deploy, free to fork.
- **Attribution is public by design.** Anyone can query who made what and where it's been deployed. Transparency is a feature.
- **Tips are voluntary.** The `attribution_events` table tracks `tip_amount` but it's optional — most events have `tip_amount = 0`.
- **pgvector for discovery.** Agent embeddings (1536-dim) enable semantic search via the `match_agents` PostgreSQL function.
- **No payment processing.** Platforms can monetize on top if they want — that's between them and their users.

## License

MIT. Fork it, improve it, run your own registry. If you do, consider speaking the Arcanea Protocol so agents published on one registry are discoverable across all registries.
