---
title: "Arcanea MCP Server status check"
uuid: 1216b718-13b1-4fb3-a4ac-96a16774cd90
created: 2026-03-29T11:23:28.549492Z
updated: 2026-03-29T11:29:50.134533Z
source: claude.ai export
---

# Arcanea MCP Server status check

**Frank**:

i need you to check the Arcanea MCP Server status, find from Arcanea Command Center Chat Status and link to the github

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me check the actual GitHub repos for current status:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's the status from what I can pull:

**Arcanea MCP Server** lives inside the main monorepo at `packages/mcp-server/` with 30+ tools:
- GitHub: [github.com/frankxai/arcanea](https://github.com/frankxai/arcanea)

**Key issues:** There are multiple open deployment incident issues (#39–#50) filed by github-actions on Feb 25-26, 2026, all tagged `deployment`, `incident`, `production`, status open. That's 12 unresolved deployment incidents — something in the CI/CD pipeline is firing failure issues repeatedly.

**Related MCP repos across your ecosystem:**

| Repo | Status | Link |
|------|--------|------|
| `arcanea` (monorepo, includes `packages/mcp-server/`) | Active, P0, deployment issues open | [github.com/frankxai/arcanea](https://github.com/frankxai/arcanea) |
| `claude-arcanea` | Active, P0, npm package — bridge between Claude ↔ Arcanea | [github.com/frankxai/claude-arcanea](https://github.com/frankxai/claude-arcanea) |
| `arcanea-infogenius` | Active, published on npm — Gemini-powered infographic MCP | [github.com/frankxai/arcanea-infogenius](https://github.com/frankxai/arcanea-infogenius) |
| `arcanea-code` | Active, P1 — fork of opencode with Guardian personas | [github.com/frankxai/arcanea-code](https://github.com/frankxai/arcanea-code) |
| `mcp-doctor` | Active, P1 — diagnose/optimize MCP servers | [github.com/frankxai/mcp-doctor](https://github.com/frankxai/mcp-doctor) |

**The 12 open deployment incidents on the main repo need triage.** They're all from the same day window — likely a broken Vercel deploy or GitHub Actions workflow that kept re-firing. Worth checking whether the workflow is still looping or if it stabilized after Feb 26.

Which layer do you want to dig into — the deployment incidents, the MCP server tool inventory, or the `claude-arcanea` npm package status?

**Frank**:

Suggest how we can use latest Claude Coworker cabalities  and i think there are some skills specificly for creating MCP server and then connected with it we have skill.md and agent.md who understand how to work with it?

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me check the MCP builder skill we already have locally:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's the architecture for how Cowork + your existing skills + Arcanea MCP fit together:

---

**What's shipped since you last looked (Cowork evolution):**

Cowork gives Claude access to a folder on your computer where it can read, edit, and create files — with sub-agent coordination for parallel workstreams. It now includes Dispatch (persistent conversation from phone to desktop), computer use (screen control), memory across sessions, and scheduled recurring tasks. Dispatch shipped March 18, 2026 — one persistent conversation between mobile and desktop, your Mac handles execution, phone is the remote control.

The plugin architecture is the key piece for you: plugins bundle slash commands, subagents, MCP configurations, hooks, and skills into a single installable package with this structure:

```
arcanea-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/        # /arcanea:summon, /arcanea:gate
├── agents/          # Guardian subagents
├── skills/          # SKILL.md files
├── hooks/           # Event handlers
├── .mcp.json        # Points to your arcanea MCP server
└── README.md
```

---

**What you already have locally that maps directly:**

You have two skills in `/mnt/skills/examples/` that are the exact toolchain:

1. **`mcp-builder`** — full 4-phase guide for building MCP servers (TypeScript recommended, Streamable HTTP for remote, stdio for local). This is how you'd build/rebuild the `packages/mcp-server/` in the arcanea monorepo properly.

2. **`skill-creator`** — creates SKILL.md files with eval loops, description optimization for triggering accuracy, and test harnesses. This generates the skills that go *inside* your plugin.

---

**The play — Arcanea as a Cowork Plugin:**

Your `packages/mcp-server/` (30+ tools) already exists. The move is to package the entire Arcanea stack as a **Cowork plugin** that anyone installs from GitHub:

```
/plugin install github.com/frankxai/arcanea-plugin
```

What this gives every Cowork user:

- `/arcanea:summon <guardian>` — loads Guardian persona + frequency context
- `/arcanea:gate <number>` — enters a Gate progression challenge
- `/arcanea:lore <topic>` — queries canonical world data via MCP
- `/arcanea:create-world` — scaffolds a new creator's world using the 5-Question Framework
- Subagents for each Guardian archetype (Lyssandria/174 through Shinkami/1111)
- Hooks that validate Hz mappings and lore consistency on every output

The MCP server handles the data layer (lore queries, world validation, frequency mapping). The skills handle the methodology (how to world-build, how to create characters). The agents handle the personas (Guardian archetypes as specialized subagents). The plugin bundles all three.

---

**Execution path using your existing tools:**

1. **Cowork + `mcp-builder` skill** → Point Cowork at your `arcanea/packages/mcp-server/` folder. Use the skill to audit and rebuild the 30+ tools against current MCP SDK best practices. Fix the 12 deployment incidents.

2. **Cowork + `skill-creator` skill** → Generate SKILL.md files for each Guardian archetype, the 5-Question Framework, the Gate progression system. Run evals against test prompts.

3. **Package as plugin** → `plugin.json` manifest, namespace everything under `arcanea:`, publish to GitHub. Host it on GitHub and users install with `/plugin install github.com/frankxai/arcanea-plugin`.

4. **Dispatch for mobile control** → You summon Guardians from your phone while walking IJburg. Cowork executes on desktop.

5. **Scheduled tasks** → Schedule recurring tasks — daily briefings, weekly reports, automated processing. Claude runs them on schedule. Schedule a daily Starlight transmission generation, weekly lore consistency audit, content publishing pipeline.

---

**The strategic angle:** Anthropic launched private plugin marketplaces for enterprise on Feb 24, 2026 — admins populate with public, partner-built, or custom plugins. Arcanea as an official Cowork plugin puts you in that marketplace alongside WordPress, Slack, GitHub. That's distribution at a completely different scale than npm alone.

Which piece do you want to build first — the plugin manifest + packaging, or rebuilding the MCP server tools with the `mcp-builder` skill?

**Frank**:

Dispatch only one Chat on phone but Coworker has multiple tasks on my computer. How this works? And could we potentially think across this whole ecosystem and build now with Arcanea and Author and World building tool extension of every capability of Claude. Mobile, Projects, Code, Coworker, Chrome. And complete guide how what we have build enriches it how it helps and why its better then anything else out there or what we need to develop further to nail this top notch. And Latest we want Arcanea to feel like this Magical Creative Intelligence Ecosystem end to end.

**Claude**:

```
This block is not supported on your current device yet.
```

Now let me build the complete architecture document:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Here's the full architecture.

**Your Dispatch question answered:** From a single conversation on your phone, you spawn and manage multiple Cowork task sessions running simultaneously on your desktop. Each session runs independently — its own context, its own file access, its own connectors. When you assign a task, Claude figures out what kind of work it is and routes it accordingly — dev tasks run in Code, research/document/desktop tasks run in Cowork. These sessions show up in their respective sidebars.

So: one phone thread = your command center. Multiple parallel tasks executing on desktop. With the new Projects feature, you can run 5 different projects all simultaneously with Cowork + scheduled tasks + browser + Dispatch without context bleeding between them.

**The strategic frame in the doc:**

Arcanea already has more creative infrastructure than any competing system — 90+ skills, 38 agents, 30+ MCP tools, 77 skills in the monorepo. The gap isn't building more — it's **packaging what exists into the plugin format** so it distributes across every Claude surface with one install.

The P0 move: fix the 12 deployment incidents, create `plugin.json`, and you have the first mythology-as-a-service plugin in the Cowork marketplace. Nothing like it exists.
