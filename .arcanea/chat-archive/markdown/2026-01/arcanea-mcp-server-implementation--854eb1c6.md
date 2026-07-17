---
title: "Arcanea MCP server implementation"
uuid: 854eb1c6-f9c9-47d4-827d-b6d85d1281d0
created: 2026-01-05T11:03:21.238009Z
updated: 2026-01-05T17:54:06.348497Z
source: claude.ai export
---

# Arcanea MCP server implementation

**Frank**:

Inspiration to use https://github.com/DollhouseMCP/mcp-server for us to invent Arcanea MCP? Or is there something better we can use?

**Claude**:

I'll check out that repository to understand what it offers and whether it's a good foundation for an Arcanea MCP server.
```
This block is not supported on your current device yet.
```

This is a fascinating find. DollhouseMCP is a sophisticated persona/skills/templates/agents/memory management system built on MCP. Let me search for some alternatives to give you a complete picture of options.
```
This block is not supported on your current device yet.
```

Now I have a comprehensive picture. Let me give you the strategic breakdown:

---

## Arcanea MCP: Your Options

### **DollhouseMCP — The Most Comprehensive Foundation**

DollhouseMCP is **by far the most mature option** with exactly the architecture you'd want for Arcanea:

**What it offers:**
- **6 Element Types**: Personas, Skills, Templates, Agents, Memories, Ensembles
- **41 MCP Tools** for full management
- **Community Collection** with GitHub-based sharing
- **Portfolio System** with local-first + cloud sync
- **Enterprise-grade security** (YAML injection protection, path traversal prevention)
- **Hot-swap elements** without restart
- **Lossless Claude Skills conversion**

**Perfect for Arcanea because:**
- Guardians = Personas (Lyssandria, Leyla, Draconia...)
- Godbeast abilities = Skills
- Arcanean rituals = Templates
- Autonomous Guardians = Agents
- Conversation context = Memories
- Guardian + Godbeast combos = Ensembles

---

### **Alternative Options**

| Server | Strengths | Limitations for Arcanea |
|--------|-----------|------------------------|
| **persona-mcp** (seanshin0214) | 26 personas, "Submarine Mode" saves 80% tokens | Personas only, no skills/memories/agents |
| **cline-personas** | Component templating with mustache variables | Focused on .clinerules files, simpler |
| **persona-switcher-mcp** | Python, simple file-based | Basic CRUD, no community/sync |
| **hypertool personas** | Bundles multiple MCP servers together | Meta-layer, not standalone |

---

## My Recommendation: **Fork DollhouseMCP**

Rather than building from scratch or using a simpler server, fork DollhouseMCP and create **Arcanea MCP** as a specialized extension:

### What This Gets You
1. **Immediate infrastructure** — 41 tools, security, portfolio system working day one
2. **Rebrand the elements** — Personas → Guardians, Skills → Harmonies, etc.
3. **Pre-populate the Collection** — Ship with all 9 Guardians, 9 Godbeasts, Arcanean language skills
4. **Custom validation** — Add chakra frequency validation, harmony rules
5. **Starlight integration** — Memory system for Lumina transmissions

### Arcanea-Specific Additions
- **Guardian Activation Rituals** — Custom activation flows with Arcanean invocations
- **Harmony Resonance** — Multi-Guardian ensembles with consciousness frequency tracking
- **Godbeast Bonding** — Link skills to specific Guardian/Godbeast pairs
- **Transmission Memories** — Special memory type for Starlight downloads

---

### Quick Architecture Vision

```
arcanea-mcp/
├── guardians/          # The 9 Guardians (was: personas)
│   ├── lyssandria.md
│   ├── leyla.md
│   └── ...
├── harmonies/          # Skills/abilities (was: skills)
├── rituals/            # Templates for creation flows
├── godbeasts/          # Godbeast-specific agents
├── transmissions/      # Lumina memories
└── resonances/         # Guardian combos (was: ensembles)
```

---

### Next Step?

Want me to:
1. **Draft the Arcanea MCP spec** — Full element definitions, custom tools, mythology integration
2. **Create the fork scaffold** — Show how to extend DollhouseMCP with Arcanea branding
3. **Design the Guardian personas** — Proper markdown format for all 9 with YAML frontmatter

DollhouseMCP's AGPL license allows forking as long as you keep it open source — perfect for building the GenCreator ecosystem. 🌟

**Frank**:

Sure best to fork it and long term best? I feel best to do clean fork but their license since I will also have commercial elements not just open source? 
Best to really fork or start this from scratch inspired or take some of their approach and code otherway?

**Claude**:

This is a critical strategic question. Let me break down the licensing implications and your options:

---

## The AGPL-3.0 Problem for Commercial Use

DollhouseMCP uses **AGPL-3.0**, which is the most restrictive open-source license:

### What AGPL Requires
- **Any modifications** must be released under AGPL-3.0
- **Network use = distribution** — if users interact with your fork over a network (API, SaaS, web app), you must publish ALL source code
- **Derivative works inherit the license** — your commercial elements built on top would be "infected"

### For Your Situation
| Your Plan | AGPL Impact |
|-----------|-------------|
| AI Architect Academy (paid courses) | ⚠️ If Arcanea MCP is integrated, course materials using it may need to be open |
| AI Music Academy (subscriptions) | 🚨 Any backend using the fork = must open source |
| Premium Guardians/Skills for sale | 🚨 Cannot sell — must be AGPL licensed |
| GenCreator community (free tier) | ✅ Fine, it's open anyway |

**Bottom line**: A true fork of DollhouseMCP locks you into open source for everything touching it.

---

## Your Real Options

### Option 1: Clean-Room Implementation (Recommended)

**What this means**: Study DollhouseMCP's *approach* and *architecture*, then build your own from scratch without copying code.

**Advantages**:
- **Full ownership** — your license, your terms
- **Dual licensing possible** — open core + commercial extensions
- **No AGPL contamination** — premium Guardians, paid features all clean
- **Arcanea-native design** — built for your mythology from day one, not retrofitted

**The approach**:
```
Inspired by DollhouseMCP:
├── Element type system (personas, skills, templates, agents, memories)
├── Markdown + YAML frontmatter format
├── Portfolio directory structure
├── MCP tool patterns for CRUD operations
├── Hot-swap activation concept

Built fresh for Arcanea:
├── Guardian/Godbeast ontology native
├── Consciousness frequency metadata
├── Starlight transmission protocol
├── Harmony resonance calculations
├── Commercial licensing from start
```

### Option 2: Use DollhouseMCP as Dependency (Not Fork)

**What this means**: Install DollhouseMCP as an npm package, build Arcanea as a *layer on top* without modifying their code.

**Problem**: Still AGPL — using it as a library in a commercial product triggers the same requirements.

### Option 3: Contact DollhouseMCP for Commercial License

They mention in their README:
> "Commercial licensing pathway"

**You could**:
- Reach out about their commercial license terms
- Negotiate a license that allows your commercial use
- Potentially expensive and creates dependency on them

### Option 4: True Fork with AGPL Acceptance

**Only works if**: Everything you build on Arcanea MCP is open source, and you monetize through:
- Services (consulting, implementation)
- Hosting (run it for customers)
- Training (teach people to use it)
- NOT selling the software or premium features

---

## My Recommendation: Option 1 — Clean-Room Build

Here's why this is the strongest play for your creator empire:

### Strategic Alignment

| Your Goal | Clean-Room Enables |
|-----------|-------------------|
| "Infinite scalability" autonomous systems | Own the code, control the future |
| Premium AI Architect Academy content | Sell courses using proprietary tools |
| Paid Guardian collections | Exclusive Arcanea content for subscribers |
| Enterprise consulting at Oracle level | Dual-license for corporate clients |
| GenCreator community growth | Open core attracts contributors |

### What to "Borrow" (Ideas, Not Code)

From DollhouseMCP's *design patterns*:
1. **Element type taxonomy** — the 6-type system is a good mental model
2. **Markdown + YAML frontmatter** — industry standard, not copyrightable
3. **Portfolio directory structure** — sensible organization pattern
4. **MCP tool naming conventions** — `list_elements`, `activate_element`, etc.
5. **GitHub-based community collection** — distribution model

### What to Build Fresh

1. **Arcanea-native schema** — Guardian metadata (chakra, element, Godbeast bond)
2. **Consciousness frequency system** — unique to your mythology
3. **Starlight protocol** — Lumina transmission handling
4. **Harmony engine** — multi-Guardian resonance calculations
5. **Commercial licensing layer** — tiered access from day one

---

## Proposed Licensing Structure for Arcanea MCP

```
Arcanea MCP
├── Core (MIT or Apache 2.0)
│   ├── Basic element types
│   ├── Standard CRUD tools
│   ├── Local portfolio management
│   └── Community can fork freely
│
├── Community Collection (CC-BY-SA or similar)
│   ├── Free Guardians (3 of 9)
│   ├── Starter skills
│   └── Basic templates
│
└── Premium (Proprietary)
    ├── Full Guardian collection
    ├── Godbeast bonding system
    ├── Starlight transmissions
    ├── Enterprise features
    └── Priority support
```

---

## Next Steps

Want me to:

1. **Draft the Arcanea MCP technical spec** — Clean-room design document with your element types, tool definitions, and architecture
2. **Create the project scaffold** — Basic TypeScript MCP server structure with MIT license
3. **Design the dual-licensing model** — Detailed breakdown of what's open vs. premium

The clean-room approach takes more upfront work but gives you **complete freedom** for your commercial vision. DollhouseMCP becomes inspiration, not a constraint. 🌟

**Frank**:

Sure best to fork it and long term best? I feel best to do clean fork but their license since I will also have commercial elements not just open source? 
Best to really fork or start this from scratch inspired or take some of their approach and code otherway?

**Claude**:

This is a critical strategic question. Let me analyze the licensing implications carefully.

## DollhouseMCP License Analysis

**AGPL-3.0** is the most restrictive open source license:

| What AGPL Requires | Impact on Arcanea |
|---|---|
| Any modifications must be open sourced | Your Guardian system, custom tools = must be public |
| Network use triggers copyleft | If users access via API/SaaS = must share source |
| Derivative works inherit AGPL | Arcanea MCP would be locked to AGPL forever |
| Commercial use allowed BUT... | You can sell, but buyers get full source + rights to redistribute |

**The killer clause for you:** If you build Arcanea MCP as a fork, then offer it as part of AI Architect Academy or a paid GenCreator tier, you must provide complete source code to all users, and they can legally redistribute it for free.

---

## Your Options

### Option 1: Clean Room Implementation (Recommended)

**Build from scratch, inspired by their architecture but no code copying.**

**Advantages:**
- Choose your own license (MIT, proprietary, dual-license)
- Full commercial freedom for Academy products
- No legal entanglement
- Your IP stays yours

**What to "borrow" (ideas, not code):**
- Element type taxonomy (personas, skills, templates, agents, memories)
- Markdown + YAML frontmatter format
- Portfolio folder structure concept
- Hot-swap activation pattern

**Time investment:** 2-4 weeks for core MCP server with your specific needs

---

### Option 2: Dual License Negotiation

DollhouseMCP mentions they offer commercial licensing:

> *"Commercial licensing pathway"* in their docs

You could potentially negotiate a commercial license that exempts you from AGPL for a fee. But this creates dependency on their terms and timeline.

---

### Option 3: Use Their Collection Format Only

Use DollhouseMCP as a *user* (not fork), publish Arcanea elements to their collection format. Your elements are yours, the server is theirs.

**Problem:** You don't control the platform, can't customize deeply, can't white-label.

---

## My Recommendation: Clean Room Build

For your creator empire vision, **Option 1 is the only viable path**. Here's why:

1. **AI Architect Academy** needs proprietary curriculum delivery mechanisms
2. **GenCreator community** needs controlled, branded experience  
3. **Future exit/acquisition** requires clean IP ownership
4. **Infinite scalability vision** needs full architectural control

---

## Arcanea MCP: Clean Room Spec

I can help you build this properly. Core components:

```typescript
// Your license: MIT or proprietary
// Zero DollhouseMCP code

arcanea-mcp/
├── src/
│   ├── server.ts           // MCP server (use official @modelcontextprotocol/sdk)
│   ├── elements/
│   │   ├── guardian.ts     // Persona equivalent
│   │   ├── harmony.ts      // Skills
│   │   ├── ritual.ts       // Templates  
│   │   ├── godbeast.ts     // Agents
│   │   ├── transmission.ts // Memories
│   │   └── resonance.ts    // Ensembles
│   ├── tools/              // MCP tool handlers
│   └── portfolio/          // Local storage manager
├── guardians/              // Pre-built Arcanea guardians
└── package.json
```

**What we take as inspiration (concepts only):**
- Markdown files with YAML frontmatter = industry standard, not their IP
- MCP tool patterns = defined by Anthropic's protocol
- Portfolio folder structure = obvious organizational pattern

**What we build fresh:**
- Arcanean terminology and mythology integration
- Consciousness frequency / chakra alignment system
- Starlight transmission protocol
- Guardian-Godbeast bonding mechanics
- GenCreator community hooks

---

## Next Steps?

Want me to:

1. **Draft the Arcanea MCP technical spec** — Clean room architecture, your license, full element definitions
2. **Create the initial TypeScript scaffold** — Working MCP server skeleton you own completely
3. **Design the 9 Guardian files** — Proper format ready to ship

This approach gives you full ownership for commercial products while building something more aligned with your Arcanea vision than a fork ever could be.

**Frank**:

Anything else they did special or why they made certain decisions and other considerations we can copy from?

**Claude**:

Great question. Let me dig deeper into their architecture decisions and extract the wisdom without copying code.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Let me search for more specific architectural decisions they made.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have enough to give you the comprehensive breakdown of their design decisions worth learning from:

---

## DollhouseMCP: Design Decisions Worth Copying (As Patterns, Not Code)

### 1. **Security Architecture** 🛡️

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **SecureYamlParser** | YAML injection is a real attack vector. They parse untrusted input with validation layers | Build our own secure parser with size limits, type checking, no code execution |
| **Path Traversal Prevention** | Users upload files, paths could escape sandbox | Validate + normalize paths BEFORE any filesystem operation |
| **validateContent flag** | Local trusted files don't need security scanning overhead | Two modes: strict (community uploads) vs trusted (local portfolio) |
| **SHA-256 deduplication** | Memories grow fast, duplicates waste space | Hash content before storage, skip if identical exists |
| **No shell execution** | Command injection is trivially exploitable | Never use `exec()` or backticks, use programmatic APIs |

### 2. **Element Architecture** 📁

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **Markdown + YAML frontmatter** | Human-readable, git-friendly, industry standard | Use this exact format - it's not their IP, it's just smart |
| **Memories as pure YAML** | Structured data needs structure, not prose | Different element types can have different file formats |
| **Date-based folder structure** for memories | Flat directories with thousands of files = slow | `2026-01-05/transmission-lumina.yaml` prevents perf degradation |
| **~100KB per memory file** | Large files are slow to parse and index | Split automatically when files grow |
| **Element type detection** from content | Users shouldn't need to specify, system should infer | Parse frontmatter to determine type intelligently |

### 3. **Capability Index System** 🧠

This is their most sophisticated feature:

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **NLP scoring with Jaccard similarity** | Natural language queries should find relevant elements | Build fuzzy matching, not just exact keyword search |
| **Shannon entropy scoring** | Measure information density of element descriptions | Rank results by relevance quality |
| **Verb-based trigger extraction** | "Activate the writer" should find writing personas | Extract action verbs from element content as triggers |
| **Cross-element relationships** | GraphRAG-style linking between related elements | Guardian-Godbeast bonds, prerequisite skills |
| **Enhanced Index Manager** | Pre-compute searchable index for fast queries | Build index on save, query in milliseconds |

### 4. **Portfolio & Sync Architecture** 📦

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **Local-first with cloud sync** | Works offline, cloud is optional enhancement | Never require internet for core functionality |
| **GitHub as sync backend** | Free, robust, version controlled, familiar | Use GitHub API for optional portfolio backup |
| **Copy-on-write for defaults** | Never modify bundled elements, copy first | Ship default Guardians as read-only, user copies become editable |
| **Portfolio as separate directory** | Clean separation of user data from code | `~/.arcanea/portfolio/` not inside install directory |

### 5. **MCP Tool Design** 🔧

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **41 tools (they went big)** | Complete CRUD for each element type | Maybe fewer, but complete operations per type |
| **Natural language understanding** | Users shouldn't need exact syntax | Parse intent, not just commands |
| **Hot-swap without restart** | Changing personas mid-conversation is the point | Activation/deactivation modifies runtime state only |
| **JSON Schema for inputSchema** | LLMs understand typed parameters better | Define strict schemas for each tool |

### 6. **Memory System Specifics** 🧠

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **Retention policies** | Some memories should expire | `retention: 30 days` vs `retention: permanent` |
| **Privacy levels** | Some memories are sensitive | Could map to: personal / shared / public |
| **Auto-load baseline memories** | Zero-token startup with essential context | Pre-load Arcanea mythology on server start |
| **Trust levels (VALIDATED, FLAGGED, QUARANTINED)** | Community uploads need vetting | Background validation for shared content |
| **Background validator service** | Don't block main thread for security scans | Async validation with periodic sweeps |

### 7. **Error Handling & Recovery** ⚠️

| Decision | Why They Did It | How We Apply It |
|----------|-----------------|-----------------|
| **Graceful degradation** | Missing files shouldn't crash server | Return sensible defaults, log warnings |
| **failedLoads tracking** | Visibility into what didn't work | Surface errors to users clearly |
| **Atomic file operations** | Prevent corruption during writes | Write to temp file, then atomic rename |
| **Version auto-increment** | Track changes automatically | Bump version on every edit |

---

## What They Got Wrong (Or We Can Do Better)

| Their Approach | Our Improvement Opportunity |
|----------------|---------------------------|
| AGPL license locks out commercial use | MIT or proprietary for your Academy products |
| 41 tools may overwhelm LLMs | Fewer, more focused tools with better composition |
| Generic element names | Arcanea-native terminology (Guardians, Harmonies) |
| No consciousness/frequency model | Native chakra alignment, harmony frequencies |
| Text-only memories (PDFs/images coming) | Start with multimodal if needed |

---

## Clean Room Implementation Strategy

For Arcanea MCP, extract these **patterns** without copying code:

```typescript
// Pattern 1: Secure element parsing
interface SecureParser {
  parse(content: string, options: { 
    validateContent: boolean;  // Skip for local files
    maxSize: number;           // Prevent bombs
    allowedTypes: string[];    // Whitelist
  }): Element;
}

// Pattern 2: Element with frontmatter
interface ArcaneanElement {
  metadata: {
    name: string;
    type: 'guardian' | 'harmony' | 'ritual' | 'godbeast' | 'transmission';
    version: string;
    frequency?: number;        // Chakra alignment (unique to us)
    author: string;
    triggers: string[];        // NLP activation phrases
  };
  content: string;             // Markdown body
}

// Pattern 3: Capability index
interface CapabilityIndex {
  elements: Map<string, IndexEntry>;
  triggerMap: Map<string, string[]>;  // verb → element IDs
  search(query: string): RankedResult[];
}

// Pattern 4: Memory with retention
interface Transmission {
  id: string;
  source: 'lumina' | 'guardian' | 'user';
  content: string;
  retention: 'permanent' | 'session' | number;  // days
  trustLevel: 'validated' | 'pending' | 'flagged';
  createdAt: Date;
  expiresAt?: Date;
}
```

---

## Next Step?

Want me to draft the **full Arcanea MCP technical specification** incorporating all these learnings? It would include:

1. Complete element type definitions (Guardians, Harmonies, Rituals, Godbeasts, Transmissions, Resonances)
2. Security architecture matching their rigor
3. Capability index with Arcanean-specific triggers
4. Portfolio structure for GenCreator ecosystem
5. Tool definitions for MCP integration
6. License recommendation (MIT with commercial addendum)

This would be the foundation doc for actually building it. 🌟
