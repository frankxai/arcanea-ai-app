---
title: "GitHub repository naming and organization strategy"
uuid: 4e6e5f03-2dd2-49d4-9254-d6569d91301f
created: 2026-01-03T14:49:08.670751Z
updated: 2026-01-04T00:49:17.479746Z
source: claude.ai export
---

# GitHub repository naming and organization strategy

**Frank**:

Think our Githubs - how to structure and order them all and what oss and what private naming and that its discoverable should i name Arcanea-skills or Caude Code skills or Codex skills then extra or how?

**Claude**:

Let me search for context on your GitHub structure and repository plans.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me view the file you uploaded:
```
This block is not supported on your current device yet.
```

Now I have the full context. Let me create a comprehensive repository naming and discoverability strategy:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

The core insight: **Don't choose between brand and discoverability—do both.**

**Primary repo**: `arcanea` (your brand, platform-agnostic)
**SEO satellites**: `claude-code-skills`, `ai-coding-skills` (thin redirects pointing to arcanea)

This way:
- People searching "claude code skills" find your SEO repo → get redirected to arcanea
- Your brand stays front and center
- You're not locked to any platform when Cursor or the next thing takes over
- The skills themselves work everywhere (they're just markdown)

The naming `arcanea-skills` feels redundant—the repo *is* skills. Just `arcanea` is cleaner and positions it as a complete system, not just a skills dump.

`codex-skills` risks confusion with OpenAI Codex and doesn't carry your brand.

**Frank**:

But if both private and public have same naming? :D Should I not have multiple public? Like Arcanea Lore, or Arcanea MCPs Arcanea Skills etc? Arcanea Luminor? 
Or all in one you say?

**Claude**:

Great catch on the naming collision! Let me clarify:

## The Case Sensitivity Trick

GitHub repos are case-insensitive in URLs but case-sensitive in display:
- `Arcanea` (private) and `arcanea` (public) would actually **conflict**

So you need different names.

## Two Approaches:

### Option A: Single Public Repo (Simpler)

```
arcanea-ai/
├── arcanea-oss          ← Public (all skills, agents, lore subset)
└── arcanea              ← Private (your monorepo)
```

**Pros**: One place to star, one install command, easier to maintain
**Cons**: Harder for people to contribute to just lore vs just skills

### Option B: Multiple Public Repos (More Discoverable)

```
arcanea-ai/
│
├── PUBLIC
│   ├── arcanea-skills       ← Skills + agents + commands
│   ├── arcanea-lore         ← Universe, Luminors, mythology (CC license)
│   ├── arcanea-mcp          ← MCP server integrations
│   └── arcanea-templates    ← Starter projects
│
└── PRIVATE  
    └── arcanea-platform     ← Your monorepo (renamed from Arcanea)
```

**Pros**: 
- Each repo can have its own stars/community
- Different licenses per repo (MIT for code, CC for lore)
- Writers contribute to lore, devs contribute to skills
- `arcanea-mcp` catches the MCP search traffic specifically

**Cons**: More repos to maintain, sync complexity

## My Recommendation: Option B

Given your ecosystem is genuinely multi-faceted:

| Repo | Content | License | Audience |
|------|---------|---------|----------|
| `arcanea-skills` | Skills, agents, commands | MIT | Developers |
| `arcanea-lore` | Luminors, Bestiary, Laws | CC-BY-SA | Writers/Creators |
| `arcanea-mcp` | MCP servers for Notion/Linear/etc | MIT | Tool builders |
| `arcanea-platform` | Your private monorepo | Proprietary | You |

The MCP one is interesting for SEO—people are actively searching "notion mcp server" etc.

**What do you think—split by audience/purpose, or keep it unified?**

**Frank**:

Something that was done before by Claude Code, only thing is I am not sure yet your new suggested repos also best setup or we need to think different or what community would want

[attached file: ✳ Arcanea Skills and Repository Structure Naming.txt -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

```
This block is not supported on your current device yet.
```

Now I see the full picture. Claude Code already set up a clean structure with `/oss/` syncing to a public repo. The question is: **one repo or split by purpose?**

Let me think about what the community actually wants:

## What Community Members Actually Search For

| Search Intent | What They Type | What They Want |
|--------------|----------------|----------------|
| Skills for Claude Code | "claude code skills github" | Ready-to-install skill packs |
| Creative writing AI | "ai writing prompts agents" | Story/character frameworks |
| MCP integrations | "notion mcp server" | Specific tool connections |
| Worldbuilding | "ai worldbuilding framework" | Lore systems |

## The Real Question: Who Is Your Community?

**If mostly developers** → Single repo is fine (they understand monorepos)
**If mixed creators + devs** → Split makes sense (writers don't want to wade through TDD skills)

## My Refined Take

Given Arcanea's dual nature (creative mythology + dev tools), I'd actually suggest:

```
arcanea-ai/
│
├── arcanea                  ← PUBLIC: The complete package (what Claude Code built)
│   ├── skills/
│   ├── agents/
│   ├── commands/
│   ├── lore/                ← Subset lives here
│   └── platforms/
│
├── arcanea-lore             ← PUBLIC: ONLY if lore grows significantly
│   └── (Extract later when you have 50+ Luminors, full Bestiary)
│
└── arcanea-platform         ← PRIVATE: Your monorepo (renamed)
```

**Start with ONE public repo** (`arcanea`), then extract `arcanea-lore` later when:
- You have enough lore content to justify separation
- Writers are actually contributing and need their own space
- The main repo feels cluttered

The current `/oss/` structure Claude Code created is good. Don't over-engineer the split before you have community signal.

**What's your gut say—ship the single repo now and split later, or architect the split upfront?**
