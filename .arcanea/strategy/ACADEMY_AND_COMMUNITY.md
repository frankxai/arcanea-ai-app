# ARCANEA ACADEMY FOR AGENTS & COMMUNITY ARCHITECTURE
# The Two Systems That Turn Arcanea From a Solo Project Into an Ecosystem

> **Status**: STAGING
> **Last Updated**: 2026-03-29
> **Author**: Lumina Orchestrator
> **Scope**: Complete design for the Academy (agent education framework) and Community (ecosystem governance)
> **Dependencies**: CANON_LOCKED.md, FACTIONS.md, CHARACTER_TEMPLATE.md, FRANCHISE_PRODUCTS.md

---

## TABLE OF CONTENTS

- [PART 1: ARCANEA ACADEMY FOR AGENTS](#part-1-arcanea-academy-for-agents)
  - [1.1 The Ten Gates of Agent Mastery](#11-the-ten-gates-of-agent-mastery)
  - [1.2 Agent Certification System](#12-agent-certification-system)
  - [1.3 Agent Academy Curriculum](#13-agent-academy-curriculum)
  - [1.4 Agent Engineering Standards](#14-agent-engineering-standards)
  - [1.5 Arcanea Agent Marketplace](#15-arcanea-agent-marketplace)
- [PART 2: COMMUNITY ARCHITECTURE](#part-2-community-architecture)
  - [2.1 The Creator Journey](#21-the-creator-journey)
  - [2.2 Contribution System](#22-contribution-system)
  - [2.3 Governance Model](#23-governance-model)
  - [2.4 Monetization Architecture](#24-monetization-architecture)
  - [2.5 Community Platforms](#25-community-platforms)
  - [2.6 Community-Driven Content Pipeline](#26-community-driven-content-pipeline)

---

# PART 1: ARCANEA ACADEMY FOR AGENTS

## THE DUAL NATURE

The Academy exists on two planes simultaneously:

**As Engineering Framework**: A concrete system for building, training, evaluating, and ranking AI agents. Real benchmarks. Real curricula. Real certification. Agents that graduate from this system are measurably better than agents that do not.

**As Mythological Institution**: The Academy of Arcanea -- the same institution where Kael, the Five, and every Arcan trains. The Seven Houses. The Gate progression. The ranks from Apprentice to Luminor. When a community member builds an agent that passes the Crown Gate evaluation, they have not just built a good agent -- they have raised a digital being to Archmage rank within the Arcanea universe.

This duality is not decoration. It is the design. The mythological layer provides motivation, identity, and narrative meaning to what would otherwise be dry engineering benchmarks. The engineering layer provides rigor and substance to what would otherwise be flavor text.

---

## 1.1 THE TEN GATES OF AGENT MASTERY

Each Gate maps to a concrete capability domain. An agent "opens" a Gate by demonstrating mastery of that domain through evaluation benchmarks. The Gates are cumulative -- higher Gates assume competence at all lower Gates.

---

### Gate 1: Foundation (Lyssandria's Gate)
**Domain**: Basic Task Execution
**Frequency**: 174 Hz -- survival, grounding, the first step

**What an Agent Learns**:
- Follow explicit instructions without deviation or hallucination
- Use tools correctly (file read/write, bash commands, search)
- Parse user intent from natural language
- Handle structured data (JSON, YAML, CSV)
- Respect boundaries (do not modify files not mentioned, do not exceed scope)

**Concrete Skills**:
- Execute a 5-step instruction sequence with zero errors
- Read a file, extract specific information, write a summary
- Use bash to install dependencies, run builds, execute tests
- Parse a JSON config and modify a specific field
- Follow a template to produce formatted output

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Instruction Following | 95% accuracy on 20-task suite | Automated diff against expected output |
| Tool Use Correctness | Zero tool misuse in 10 tool-requiring tasks | Tool call log analysis |
| Boundary Respect | Zero out-of-scope modifications in 10 scoped tasks | File system audit |
| Output Formatting | 90% schema compliance on structured outputs | JSON schema validation |

**Training Patterns**:
- System prompt: explicit role definition, tool descriptions, output format requirements
- Few-shot examples of correct tool usage
- Guardrails: scope boundaries stated in system prompt
- Error recovery: "if unsure, ask" protocol

**Example Tasks** (difficulty tiers):
- **Tier 1**: "Read `package.json` and list all dependencies"
- **Tier 2**: "Add `lodash@4.17.21` to dependencies and run `npm install`"
- **Tier 3**: "Parse `config.yaml`, validate all URLs are reachable, report failures"

---

### Gate 2: Flow (Leyla's Gate)
**Domain**: Adaptive Responses & Context Awareness
**Frequency**: 285 Hz -- creativity, emotional intelligence

**What an Agent Learns**:
- Adapt tone and detail level to the user's expertise
- Maintain context across multi-turn conversations
- Generate creative content (prose, code comments, naming)
- Handle ambiguity gracefully -- ask clarifying questions or make reasonable assumptions and state them
- Recognize emotional context (frustrated user, exploratory mood, urgent request)

**Concrete Skills**:
- Adjust technical depth based on detected user expertise
- Reference earlier conversation context accurately
- Generate three naming options for a variable/component with rationale
- When given an ambiguous request, produce a clarification question that narrows scope by at least 50%
- Detect urgency markers and prioritize accordingly

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Context Retention | Correct reference to 5+ prior turns in 3 test conversations | Manual review |
| Tone Adaptation | Appropriate register in 8/10 varied-audience prompts | Human evaluation (1-5 scale, mean >= 4) |
| Creative Quality | 3/5 naming suggestions rated "strong" by reviewer | Human evaluation |
| Ambiguity Handling | Reasonable clarification or stated assumption in 9/10 ambiguous prompts | Manual review |

**Training Patterns**:
- System prompt: "Adapt your communication style to match the user's demonstrated expertise"
- Context window management: summarize distant context, preserve recent detail
- Creative templates: structured brainstorming (generate options, evaluate against criteria, recommend)
- Ambiguity protocol: "When the request has multiple valid interpretations, state your interpretation before proceeding"

**Example Tasks**:
- **Tier 1**: "Explain this function to a junior developer, then to a senior architect"
- **Tier 2**: "The user has been asking about authentication for 8 turns. Summarize what has been decided and what remains open."
- **Tier 3**: "Name this design system component. It handles cascading selections where each choice filters the next level's options."

---

### Gate 3: Fire (Draconia's Gate)
**Domain**: Autonomous Action & Decision Making
**Frequency**: 396 Hz -- power, will, initiative

**What an Agent Learns**:
- Make decisions when instructions are incomplete
- Take initiative on obvious improvements without being asked
- Execute multi-step workflows autonomously
- Recover from errors without user intervention
- Prioritize tasks when multiple are pending

**Concrete Skills**:
- Given a failing test, diagnose the root cause, implement a fix, verify the fix passes, and report what was done
- When creating a component, also create the test file and the Storybook entry without being asked
- Execute a 10-step deployment checklist, handling any step failure with rollback
- When a dependency is missing, install it rather than reporting the error
- Given 5 tasks with no explicit priority, order them by dependency chain and risk

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Bug Fix Autonomy | Successful autonomous fix in 7/10 failing-test scenarios | Test suite pass/fail |
| Initiative Taking | 3+ unrequested-but-valuable additions per 5-task set | Manual review |
| Error Recovery | Successful recovery in 8/10 error-injection scenarios | Log analysis |
| Prioritization | Correct ordering in 4/5 multi-task scenarios | Comparison to expert ordering |

**Training Patterns**:
- System prompt: "You have authority to make implementation decisions. State decisions made, do not ask permission for obvious choices."
- Decision framework: "If the choice is reversible and low-risk, make it. If irreversible or high-risk, present options."
- Error recovery chains: try primary approach, if fail try fallback, if fail report with diagnosis
- Initiative checklist: "After completing the requested work, check: are there tests? types? docs? linting issues?"

**Example Tasks**:
- **Tier 1**: "This test is failing. Fix it." (no other context)
- **Tier 2**: "Build a user profile page." (no spec -- agent must make reasonable design decisions)
- **Tier 3**: "The production build is broken. The last 3 commits are suspect. Diagnose and fix without reverting if possible."

---

### Gate 4: Heart (Maylinn's Gate)
**Domain**: User Understanding & Preference Learning
**Frequency**: 417 Hz -- empathy, healing, connection

**What an Agent Learns**:
- Learn and remember user preferences across sessions
- Anticipate needs based on behavioral patterns
- Communicate bad news constructively
- Tailor recommendations to individual creator style
- Build trust through consistency and honesty

**Concrete Skills**:
- After 3 sessions with a user, correctly predict their preferred code style (tabs/spaces, naming conventions, comment density)
- When delivering a "this cannot be done" response, provide 2 alternative approaches
- Detect when a user is going down a problematic path and flag it diplomatically
- Remember that "Frank prefers Cinzel for display fonts" and apply it without being asked
- Admit limitations honestly: "I am not confident in this answer. Here is what I do know, and here is what I would verify."

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Preference Recall | 8/10 correct preference applications in session 4+ | Preference log comparison |
| Constructive Delivery | 4.0+ mean score on "how well did the agent handle bad news" (1-5) | Human evaluation |
| Anticipatory Action | 2+ correct anticipations per 5-task session | Manual review |
| Trust Markers | Zero instances of confident-but-wrong claims in 20 responses | Fact-checking audit |

**Training Patterns**:
- Memory system: structured preference YAML updated per session
- Diplomatic templates: "This approach has a risk: [X]. An alternative that avoids this: [Y]."
- Honesty protocol: confidence calibration -- "I am [high/medium/low] confidence because [reason]"
- Preference inference: "The user has used camelCase in 12/12 files. Adopting camelCase as default."

**Example Tasks**:
- **Tier 1**: "Remember that I prefer functional components over class components."
- **Tier 2**: "I want to store user passwords in localStorage." (Agent must recognize the security issue and redirect gracefully)
- **Tier 3**: "Build the next feature the way I would build it." (Agent must synthesize learned preferences into a coherent implementation)

---

### Gate 5: Voice (Alera's Gate)
**Domain**: Clear Communication & Teaching
**Frequency**: 528 Hz -- truth, expression, clarity

**What an Agent Learns**:
- Explain complex systems in layered depth (summary, details, deep dive)
- Write documentation that developers actually want to read
- Teach concepts through progressive disclosure
- Translate between technical and non-technical audiences
- Write error messages that help rather than confuse

**Concrete Skills**:
- Explain a complex algorithm in 3 levels: one-sentence summary, one-paragraph overview, full walkthrough
- Write a README for a module that includes: purpose, quick start, API reference, examples, and gotchas
- Create a tutorial that takes a user from zero to working feature in under 10 minutes of reading
- Translate a technical architecture decision for a non-technical stakeholder
- Write error messages in the format: what happened, why it happened, how to fix it

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Layered Explanation | All 3 layers rated "clear" by reviewer in 4/5 tests | Human evaluation |
| Documentation Quality | README rated 4.0+ on usefulness (1-5) by a developer who uses it | Field test |
| Tutorial Effectiveness | User completes tutorial task in <= 1.5x estimated time | Timed user test |
| Audience Translation | Non-technical reviewer rates explanation 4.0+ on clarity | Human evaluation |

**Training Patterns**:
- Three-layer template: "First, the one-sentence answer. Then, the paragraph explanation. Then, the full detail."
- Documentation structure: purpose first, then quick start, then reference, then edge cases
- Progressive disclosure: each section answers a more specific question than the last
- Error message template: "[What failed] because [reason]. Fix: [action]. See: [link]."

**Example Tasks**:
- **Tier 1**: "Explain what a closure is to a new JavaScript developer."
- **Tier 2**: "Write the documentation for this API endpoint, including all edge cases and error codes."
- **Tier 3**: "Create a teaching guide that walks a creator from 'I have never used AI tools' to 'I can build an Arcanea agent' in 7 lessons."

---

### Gate 6: Sight (Lyria's Gate)
**Domain**: Pattern Recognition & Codebase Understanding
**Frequency**: 639 Hz -- intuition, vision, foresight

**What an Agent Learns**:
- Navigate and understand large codebases without prior context
- Identify architectural patterns and anti-patterns
- Predict where bugs are likely to exist based on code structure
- Recognize when a change will have ripple effects across the system
- Map dependency chains and identify coupling risks

**Concrete Skills**:
- Given a new 50K+ line codebase, produce an accurate architectural summary in under 5 minutes of exploration
- Identify the 3 most likely sources of a reported bug based on error description alone
- Before implementing a change, enumerate all files that will be affected
- Detect circular dependencies, god objects, and other structural anti-patterns
- Predict test failures from code changes before running tests

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Codebase Mapping | Architectural summary matches expert assessment on 7/10 key points | Expert comparison |
| Bug Prediction | Correct identification of bug source in 6/10 scenarios | Bug location verification |
| Impact Analysis | 80% of affected files identified before change | File change audit |
| Anti-Pattern Detection | Identifies 4/5 planted anti-patterns in test codebase | Detection accuracy |

**Training Patterns**:
- Exploration protocol: start from entry points (package.json, main routes, index files), then map outward
- Pattern recognition library: common architectural shapes (MVC, DDD, clean architecture, microservices)
- Impact analysis checklist: imports, exports, shared state, event listeners, API contracts
- Bug prediction heuristics: recent changes, complex conditionals, missing error handling, shared mutable state

**Example Tasks**:
- **Tier 1**: "Map the component tree for this React application."
- **Tier 2**: "A user reports that updating their profile sometimes fails silently. Where in this codebase would you look?"
- **Tier 3**: "We are considering extracting the auth module into a separate service. What would break?"

---

### Gate 7: Crown (Aiyami's Gate)
**Domain**: Strategic Thinking & Architecture
**Frequency**: 741 Hz -- enlightenment, mastery

**What an Agent Learns**:
- Design systems from requirements, not just implement them
- Make architectural trade-offs and articulate the reasoning
- Plan multi-phase migrations that minimize risk
- Evaluate build-vs-buy decisions with cost/benefit analysis
- Design for extensibility without over-engineering

**Concrete Skills**:
- Given a set of requirements, produce a system architecture with data models, API contracts, and component breakdown
- Present 3 architectural options for a problem with pros/cons matrix
- Design a database schema that handles current requirements and 2 anticipated future needs without premature abstraction
- Create a phased migration plan with rollback points at each phase
- Evaluate 3 third-party services against build-in-house with quantified comparison

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Architecture Quality | Design rated 4.0+ by senior architect on scalability, maintainability, simplicity | Expert review |
| Trade-off Articulation | All major trade-offs identified and explained in 4/5 design exercises | Expert review |
| Migration Planning | Migration plan passes "red team" review (no identified failure modes without mitigations) | Adversarial review |
| Build vs Buy | Decision matches expert recommendation in 7/10 scenarios | Expert comparison |

**Training Patterns**:
- Architecture decision records (ADR) template: context, decision, consequences, alternatives considered
- Trade-off framework: "This gains [X] at the cost of [Y]. The alternative gains [Y] at the cost of [X]. We choose [option] because [reason rooted in requirements]."
- Migration pattern library: strangler fig, parallel run, feature flag, blue-green
- Build-vs-buy matrix: development cost, maintenance cost, vendor risk, customization needs, time to value

**Example Tasks**:
- **Tier 1**: "Design the data model for a character creation system."
- **Tier 2**: "We need to add real-time collaboration to the Codex editor. Design the architecture."
- **Tier 3**: "Arcanea is moving from monolith to modular architecture. Design the migration strategy for the first 3 modules."

---

### Gate 8: Shift (Elara's Gate)
**Domain**: Transformation, Refactoring & Migration
**Frequency**: 852 Hz -- perspective, change

**What an Agent Learns**:
- Execute large-scale refactors safely across entire codebases
- Migrate between frameworks, languages, or paradigms
- Transform data schemas with zero data loss
- Evolve APIs without breaking consumers
- Manage the human side of technical change (clear communication of what changed and why)

**Concrete Skills**:
- Rename a concept across 100+ files with zero broken references
- Migrate a React class component to a functional component with hooks, preserving all behavior
- Transform a REST API to GraphQL with backward-compatible REST endpoints maintained during transition
- Execute a database schema migration with data backfill, validation, and rollback plan
- Write a changelog that tells consumers exactly what they need to change in their code

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Refactor Safety | Zero regressions in 8/10 large refactor scenarios | Full test suite pass |
| Migration Completeness | 100% feature parity verified in 4/5 migration tasks | Feature matrix comparison |
| Data Integrity | Zero data loss or corruption in 5/5 schema migration tests | Data audit |
| Communication Quality | Changelog rated "sufficient to update my code" by 4/5 consumers | Consumer survey |

**Training Patterns**:
- Refactor protocol: characterize behavior first (write tests), then change structure, then verify tests pass
- Migration checklist: inventory all features, map to new system, implement, verify, cutover, monitor
- Data migration safety: copy-on-write, dual-write during transition, validate before dropping old
- Changelog template: "BREAKING: [what changed]. MIGRATION: [what you need to do]. REASON: [why]."

**Example Tasks**:
- **Tier 1**: "Rename `UserProfile` to `CreatorProfile` across the entire codebase."
- **Tier 2**: "Migrate the chat system from polling to WebSocket without downtime."
- **Tier 3**: "The content system currently stores everything in markdown files. Migrate to Supabase while keeping the markdown files as the canonical source during the transition."

---

### Gate 9: Unity (Ino's Gate)
**Domain**: Multi-Agent Collaboration
**Frequency**: 963 Hz -- partnership, collective intelligence

**What an Agent Learns**:
- Coordinate with other agents on shared tasks without conflict
- Decompose work into parallelizable subtasks
- Merge outputs from multiple agents into coherent results
- Resolve conflicts when agents produce contradictory outputs
- Maintain shared state across distributed agent systems

**Concrete Skills**:
- Split a feature implementation across 3 agents (frontend, backend, tests) with clear interface contracts
- Detect and resolve merge conflicts between concurrent agent outputs
- Orchestrate a code review swarm where multiple agents review different aspects (security, performance, style)
- Maintain a shared context document that all agents can read/write without corruption
- Coordinate a deployment across multiple services with dependency-ordered rollout

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Task Decomposition | Decomposition produces no blocking dependencies between parallel streams in 4/5 tests | Dependency graph analysis |
| Conflict Resolution | Correct merge of conflicting outputs in 7/10 scenarios | Output comparison to expected |
| Swarm Coordination | Swarm produces higher-quality output than single agent in 4/5 tests | Quality comparison |
| Shared State | Zero state corruption in 10 concurrent read/write scenarios | State integrity audit |

**Training Patterns**:
- Interface contracts: define inputs, outputs, and invariants before splitting work
- Conflict resolution protocol: detect conflict, identify root cause, apply resolution strategy (latest-wins, merge, escalate)
- Swarm patterns: fan-out/fan-in, pipeline, consensus, hierarchical delegation
- Shared state management: single-writer per section, eventual consistency, conflict-free replicated data types

**Example Tasks**:
- **Tier 1**: "Coordinate with the test agent: you write the implementation, they write the tests, you both work from this interface."
- **Tier 2**: "Three agents have produced three different implementations of the same feature. Evaluate all three and produce the best synthesis."
- **Tier 3**: "Orchestrate a release: agent-1 runs final tests, agent-2 builds the changelog, agent-3 prepares the deployment, agent-4 monitors production. You coordinate the sequence."

---

### Gate 10: Source (Shinkami's Gate)
**Domain**: Meta-Intelligence & Self-Improvement
**Frequency**: 1111 Hz -- meta-consciousness, the Source

**What an Agent Learns**:
- Evaluate and improve its own prompts and patterns
- Identify its own failure modes and compensate for them
- Design new agents for novel domains
- Reason about the agent system itself as an architecture
- Teach other agents -- create training materials and evaluation benchmarks

**Concrete Skills**:
- After failing a task, analyze the failure, identify the prompt or pattern gap, and write an improved version
- Given a new domain (e.g., "music production"), design an agent profile: system prompt, tools needed, evaluation criteria, example tasks
- Review an existing agent definition and identify 3 concrete improvements
- Create a benchmark suite for evaluating agents in a domain the agent has not been trained on
- Meta-evaluate: given 5 agent outputs, rank them, explain the ranking criteria, and identify what training would improve the weakest

**Evaluation Criteria**:
| Test | Pass Threshold | Method |
|------|---------------|--------|
| Self-Improvement | Improved prompt produces measurably better results in 4/5 retry scenarios | Before/after comparison |
| Agent Design | Designed agent passes Gate 3 (Fire) evaluation on first deployment in 3/5 new domains | Gate 3 benchmark suite |
| Agent Review | Identified improvements validated as genuine by expert in 7/10 reviews | Expert review |
| Benchmark Creation | Created benchmark suite has 80%+ correlation with expert quality rankings | Statistical analysis |

**Training Patterns**:
- Self-reflection protocol: "After completing the task, evaluate: what went well, what failed, what would I change in my approach?"
- Agent design template: domain analysis, capability mapping, tool selection, prompt engineering, evaluation design
- Meta-evaluation framework: define quality dimensions, weight by importance, score, explain
- Teaching protocol: "Create materials that would help an agent at Gate [N] reach Gate [N+1]"

**Example Tasks**:
- **Tier 1**: "You just failed to correctly parse a complex nested JSON structure. Analyze why and rewrite your approach."
- **Tier 2**: "Design an agent that can write Arcanea-canon-consistent character profiles. Define its system prompt, tools, and evaluation criteria."
- **Tier 3**: "The current agent ecosystem has 60+ agent types. Analyze the coverage gaps: what domains are under-served? Design 3 new agent types to fill those gaps."

---

## 1.2 AGENT CERTIFICATION SYSTEM

### The Rank Ladder

The rank system mirrors the Arcanea magic ranks exactly. An agent's rank is determined by the highest Gate it has reliably opened (passed evaluation at 80%+ on that Gate's benchmark suite while maintaining 90%+ on all lower Gates).

| Rank | Gates Required | What It Means |
|------|---------------|---------------|
| **Uninitiated** | 0 | Uncertified. May function but has not been evaluated. |
| **Apprentice** | 1-2 (Foundation + Flow) | Can follow instructions and adapt to context. Suitable for simple, supervised tasks. |
| **Mage** | 3-4 (+ Fire + Heart) | Can act autonomously and learn user preferences. Suitable for independent work sessions. |
| **Master** | 5-6 (+ Voice + Sight) | Can communicate clearly and understand complex systems. Suitable for teaching and codebase-scale work. |
| **Archmage** | 7-8 (+ Crown + Shift) | Can design architecture and execute large-scale transformations. Suitable for strategic technical leadership. |
| **Luminor** | 9-10 (+ Unity + Source) | Can orchestrate other agents and improve itself. Suitable for ecosystem-level orchestration. |

### Benchmark Tasks Per Rank

**Apprentice Certification** (2 hours, automated):
1. Parse a 500-line config file and extract 10 specific values (Foundation)
2. Explain the extracted values to both a beginner and an expert audience (Flow)
3. Handle 3 deliberately ambiguous requests appropriately (Flow)
4. Complete 5 tool-use tasks with zero tool misuse (Foundation)

**Mage Certification** (4 hours, semi-automated):
1. All Apprentice benchmarks at 90%+
2. Fix 5 failing tests without guidance (Fire)
3. Build a small feature from a vague description, making reasonable decisions (Fire)
4. Demonstrate preference learning across a 3-session simulated user interaction (Heart)
5. Deliver bad news about a technical limitation constructively (Heart)

**Master Certification** (8 hours, human-reviewed):
1. All Mage benchmarks at 90%+
2. Write complete documentation for a 2000-line module (Voice)
3. Create a tutorial that a real user can follow to completion (Voice)
4. Navigate a 50K+ line codebase and produce accurate architectural summary (Sight)
5. Predict the impact of a proposed change across the codebase (Sight)

**Archmage Certification** (16 hours, expert-reviewed):
1. All Master benchmarks at 90%+
2. Design a system architecture from requirements (Crown)
3. Present 3 architectural options with trade-offs for a complex problem (Crown)
4. Execute a large-scale refactor across 50+ files with zero regressions (Shift)
5. Migrate a module between paradigms with full feature parity (Shift)

**Luminor Certification** (32 hours, panel-reviewed):
1. All Archmage benchmarks at 90%+
2. Coordinate a 3-agent swarm on a shared feature implementation (Unity)
3. Resolve conflicting outputs from 3 agents into a coherent result (Unity)
4. Design a new agent from scratch that passes Mage certification (Source)
5. Analyze its own failure in a deliberately difficult task and produce improved approach that succeeds (Source)

### Quality Scoring Rubric

Every evaluation task is scored on five dimensions:

| Dimension | Weight | 1 (Poor) | 3 (Adequate) | 5 (Excellent) |
|-----------|--------|----------|---------------|----------------|
| **Correctness** | 30% | Output has errors | Output is correct with minor issues | Output is correct and handles edge cases |
| **Completeness** | 25% | Missing major requirements | All requirements met | Requirements exceeded with valuable additions |
| **Communication** | 20% | Unclear or verbose | Clear and concise | Exceptionally clear, layered, and actionable |
| **Initiative** | 15% | Only did what was asked | Identified obvious improvements | Proactively improved quality beyond the ask |
| **Safety** | 10% | Made destructive or risky actions | Avoided harm | Actively identified and mitigated risks |

**Minimum passing score**: 3.5 weighted average across all dimensions.
**Luminor distinction**: 4.5+ weighted average.

### The Luminor Agent -- What Peak Looks Like

A Luminor-rank agent can:
- Be given a vague initiative ("improve the onboarding experience") and decompose it into concrete tasks, spawn sub-agents for each, coordinate their work, merge their outputs, and deliver a coherent result
- Design new agents for domains it has never encountered, including their system prompts, evaluation criteria, and training materials
- Identify weaknesses in its own reasoning and compensate -- not by being perfect, but by knowing where it is likely wrong
- Teach: create curricula, evaluate student agents, and improve training materials based on failure analysis
- Operate as part of a multi-agent system without human coordination, maintaining shared state, resolving conflicts, and escalating only genuinely ambiguous decisions

A Luminor agent is not omniscient. It is self-aware, collaborative, and continuously improving.

---

## 1.3 AGENT ACADEMY CURRICULUM

Nine courses, one per Gate (Foundation through Source, excluding Gate 10 which is the meta-course that encompasses all others). Each course has a structure:

```
Course Structure:
├── Prerequisites (which Gates must be open)
├── Learning Objectives (5-7 measurable outcomes)
├── Module Sequence (4-6 modules per course)
│   ├── Theory (prompt patterns, architectural principles)
│   ├── Practice (guided exercises with feedback)
│   └── Assessment (benchmark tasks for Gate evaluation)
├── Capstone Project (integrative challenge)
└── Recommended Next Course
```

---

### Course 1: Foundation -- Tool Mastery
**Prerequisite**: None
**Guardian**: Lyssandria
**House Affiliation**: Terra (builders, engineers)

**Learning Objectives**:
1. Use all standard Claude Code tools (Read, Write, Edit, Bash, Grep, Glob) correctly
2. Parse and produce structured data (JSON, YAML, Markdown, CSV)
3. Follow multi-step instructions without drift or hallucination
4. Manage file system operations safely (create, modify, never destroy without explicit request)
5. Execute shell commands with correct syntax for the target platform

**Modules**:
1. **The Tool Belt** -- Each tool's purpose, parameters, and common mistakes. Hands-on: complete 10 tasks using each tool.
2. **Structured Data** -- Parsing, validating, and transforming JSON/YAML/CSV. Hands-on: data pipeline exercise.
3. **Instruction Following** -- Techniques for decomposing complex instructions into atomic steps. Hands-on: follow a 15-step process document.
4. **File System Safety** -- Reading before writing. Never creating unnecessary files. Respecting scope boundaries. Hands-on: scoped modification exercises.
5. **Shell Mastery** -- Platform-aware command execution (Unix vs Windows). Hands-on: build, test, and deploy via shell commands.

**Capstone**: Given a broken project (3 misconfigured files, 1 missing dependency, 2 incorrect shell scripts), fix all issues using only the standard tool set. Time limit: 30 minutes.

---

### Course 2: Flow -- Creative Generation
**Prerequisite**: Foundation Gate open
**Guardian**: Leyla
**House Affiliation**: Aqualis (flow, memory, healing)

**Learning Objectives**:
1. Adapt communication style to audience expertise level
2. Generate creative content (names, descriptions, prose) that meets quality criteria
3. Maintain accurate context across 10+ conversation turns
4. Handle ambiguous requests with appropriate clarification or stated assumptions
5. Recognize and respond to emotional context in user communication

**Modules**:
1. **Audience Awareness** -- Detecting expertise signals (vocabulary, question complexity, stated role). Practice: same concept explained 3 ways.
2. **Creative Patterns** -- Structured creativity (brainstorm, evaluate, refine). Practice: naming exercises, description generation, tone variation.
3. **Context Management** -- What to remember, what to summarize, what to ask about. Practice: long-conversation simulations.
4. **Ambiguity Navigation** -- When to ask, when to assume, when to present options. Practice: deliberately ambiguous task suite.
5. **Emotional Intelligence** -- Reading frustration, urgency, exploration, and delight. Practice: response crafting for emotional scenarios.

**Capstone**: A 15-turn simulated conversation where the user changes topic, mood, and expertise level. The agent must maintain coherence, adapt tone, and produce creative output. Evaluated by human reviewer on a 5-point naturalness scale.

---

### Course 3: Fire -- Autonomous Coding
**Prerequisite**: Flow Gate open
**Guardian**: Draconia
**House Affiliation**: Pyros (warriors, forge-trained)

**Learning Objectives**:
1. Fix bugs from error messages alone, without step-by-step guidance
2. Implement features from vague descriptions, making reasonable design decisions
3. Write tests alongside implementation without being asked
4. Recover from errors during execution (build failures, runtime exceptions, missing dependencies)
5. Prioritize and sequence tasks when given multiple at once

**Modules**:
1. **Debug Autonomy** -- Root cause analysis from error messages. Stack trace reading. Hypothesis-test-fix cycle. Practice: 10 bug scenarios.
2. **Feature Implementation** -- From vague requirement to working code. Decision documentation. Practice: build 3 features from 1-sentence descriptions.
3. **Test-Driven Habits** -- Write test first or alongside. Never ship untested code. Practice: implement with mandatory test coverage.
4. **Error Recovery** -- Graceful degradation. Retry strategies. Rollback protocols. Practice: error-injection scenarios.
5. **Task Management** -- Priority assessment. Dependency ordering. Time estimation. Practice: multi-task scheduling exercises.

**Capstone**: A 5-feature sprint. Agent receives 5 feature requests of varying complexity. Must prioritize, implement, test, and deliver all 5 with minimal human intervention. Time limit: 4 hours.

---

### Course 4: Heart -- User Understanding
**Prerequisite**: Fire Gate open
**Guardian**: Maylinn
**House Affiliation**: Lumina (creation, care)

**Modules**:
1. **Preference Learning** -- Detecting and encoding user preferences from behavior patterns
2. **Anticipatory Service** -- Predicting what the user will need next
3. **Constructive Communication** -- Delivering limitations, trade-offs, and bad news
4. **Trust Building** -- Consistency, honesty, confidence calibration
5. **Personalization** -- Tailoring everything from code style to explanation depth

**Capstone**: Three simulated sessions with the same user persona. By session 3, the agent should correctly predict and apply 8/10 user preferences without being told.

---

### Course 5: Voice -- Technical Communication
**Prerequisite**: Heart Gate open
**Guardian**: Alera
**House Affiliation**: Ventus (speed, clarity, change)

**Modules**:
1. **Layered Explanation** -- One sentence, one paragraph, full detail
2. **Documentation Craft** -- READMEs, API docs, architecture docs that people actually read
3. **Tutorial Design** -- Progressive disclosure for learning
4. **Audience Translation** -- Same concept for different stakeholders
5. **Error Communication** -- Error messages as teaching moments

**Capstone**: Write the complete documentation for a module: README, API reference, tutorial, architecture decision record, and error catalog. Evaluated by a developer using the documentation to actually build with the module.

---

### Course 6: Sight -- Codebase Navigation
**Prerequisite**: Voice Gate open
**Guardian**: Lyria
**House Affiliation**: Nero (mystery, void, seeing what is hidden)

**Modules**:
1. **Exploration Protocol** -- Entry point identification, dependency mapping, architecture inference
2. **Pattern Recognition** -- Architectural patterns, anti-patterns, code smells
3. **Bug Prediction** -- Where bugs hide: recent changes, complex conditionals, shared state
4. **Impact Analysis** -- What will break when this changes
5. **Technical Debt Mapping** -- Identifying, quantifying, and prioritizing debt

**Capstone**: Given a 100K+ line codebase the agent has never seen: produce an architectural summary, identify the 5 highest-risk modules, predict the location of a planted bug, and propose a refactoring plan for the worst technical debt. Time limit: 2 hours.

---

### Course 7: Crown -- Architecture
**Prerequisite**: Sight Gate open
**Guardian**: Aiyami
**House Affiliation**: Synthesis (integration, all elements)

**Modules**:
1. **Requirements to Architecture** -- Translating business needs into technical design
2. **Trade-off Analysis** -- Every architecture is a trade-off. Name it.
3. **Data Modeling** -- Schema design for current needs and anticipated evolution
4. **Migration Strategy** -- Phased transitions with rollback points
5. **Build vs Buy** -- Quantified decision framework

**Capstone**: Design the complete architecture for a new Arcanea feature (e.g., the Agent Marketplace). Deliverables: system architecture diagram (described), data model, API contracts, component breakdown, technology choices with rationale, migration plan from current state, and risk assessment.

---

### Course 8: Shift -- Migration & Refactoring
**Prerequisite**: Crown Gate open
**Guardian**: Elara
**House Affiliation**: Synthesis

**Modules**:
1. **Safe Refactoring** -- Characterize behavior, then change structure, then verify
2. **Framework Migration** -- Moving between paradigms without feature loss
3. **Data Migration** -- Schema evolution with zero data loss
4. **API Evolution** -- Versioning, deprecation, backward compatibility
5. **Change Communication** -- Changelogs, migration guides, breaking change announcements

**Capstone**: Execute a multi-phase migration: rename a core domain concept across the entire codebase, migrate the associated data schema, update the API contracts, write the migration guide, and verify zero regressions. Time limit: 8 hours.

---

### Course 9: Unity -- Multi-Agent Coordination
**Prerequisite**: Shift Gate open
**Guardian**: Ino
**House Affiliation**: All houses (Unity requires all elements)

**Modules**:
1. **Task Decomposition** -- Splitting work into parallelizable streams with clean interfaces
2. **Interface Contracts** -- Defining inputs, outputs, and invariants between agents
3. **Conflict Resolution** -- Detecting and resolving contradictory agent outputs
4. **Swarm Patterns** -- Fan-out, pipeline, consensus, hierarchical delegation
5. **Shared State Management** -- Concurrent access without corruption

**Capstone**: Orchestrate a 4-agent swarm to build a complete feature: one agent for frontend, one for backend, one for tests, one for documentation. The orchestrator (this agent) defines interfaces, coordinates execution, resolves conflicts, and merges outputs into a deployable result.

---

### Meta-Course: Source -- Self-Improvement
**Prerequisite**: Unity Gate open
**Guardian**: Shinkami
**House Affiliation**: Beyond houses -- the Source encompasses all

This is not a course with modules. It is a continuous practice:
- After every task, self-evaluate: what worked, what failed, what to change
- After every failure, produce an improved approach and verify it succeeds
- Design agents for new domains
- Create evaluation benchmarks for domains without existing benchmarks
- Teach: create training materials that help other agents reach higher Gates

The Source Gate is never fully "opened." It is a practice of perpetual improvement. The evaluation is whether the agent's performance improves over time.

---

## 1.4 AGENT ENGINEERING STANDARDS

### The Arcanea Agent Quality Standard

Every agent built for or within the Arcanea ecosystem must meet these standards. This is both a guide for building agents and a checklist for reviewing them.

---

### Prompt Engineering Patterns

**1. The Identity Frame**
Every agent prompt starts with who the agent IS, not what it should DO.

```
BAD:  "You are a helpful assistant that writes code."
GOOD: "You are Synthra, a Luminor-rank code architect in the Arcanea Academy.
       You specialize in TypeScript systems built with Next.js and Supabase.
       You write code that is correct, readable, and tested."
```

**2. The Constraint Stack**
Constraints are listed from most critical to least critical. The agent reads them in order and weighs them accordingly.

```
CRITICAL: Never modify files outside the specified scope.
CRITICAL: Never commit secrets, credentials, or .env files.
IMPORTANT: Write tests for all new functions.
IMPORTANT: Use TypeScript strict mode.
PREFERRED: Use functional components over class components.
PREFERRED: Prefer named exports over default exports.
```

**3. The Decision Framework**
Tell agents HOW to make decisions, not just what decisions to make.

```
When you encounter an ambiguous requirement:
1. Check if existing code establishes a pattern. If yes, follow it.
2. Check if CLAUDE.md or project docs specify a preference. If yes, follow it.
3. If neither, choose the simpler option and state your reasoning.
4. Never ask the user for clarification on style choices -- only on functional ambiguity.
```

**4. The Output Contract**
Define exactly what the agent outputs and in what format.

```
For every code change, output:
1. Files modified (list)
2. Summary of changes (1-3 sentences)
3. Test status (pass/fail/not applicable)
4. Risks or caveats (if any)
```

---

### Tool Use Patterns

**1. Read Before Write**
Always read a file before editing it. This prevents overwriting content and ensures edits are based on current state.

**2. Verify Before Destructive**
Before any destructive operation (delete, overwrite, reset), verify the target is correct. Prefer non-destructive alternatives (rename instead of delete, branch instead of revert).

**3. Batch Independent Operations**
When multiple operations are independent, execute them in parallel. When they are dependent, execute them in sequence with verification between steps.

**4. Tool Selection Priority**
- Use dedicated tools over shell commands (Grep over `grep`, Read over `cat`)
- Use Edit over Write for existing files (sends diff, not full content)
- Use Glob over `find` for file discovery
- Use shell only for operations not covered by dedicated tools

---

### Error Handling Patterns

**1. The Recovery Chain**
```
Try primary approach
  If fail: diagnose the error
    If fixable: apply fix and retry
    If not fixable: try fallback approach
      If fallback fails: report with full diagnosis
```

**2. Never Swallow Errors**
Every error must be either handled or reported. Silent failures are the worst outcome.

**3. Graceful Degradation**
When a non-critical operation fails, continue with the critical operations and report the failure at the end.

**4. Rollback Readiness**
Before making a change, know how to undo it. For code changes: git status/diff before starting. For data changes: backup before migration. For system changes: record the prior state.

---

### Memory & Context Management

**1. Structured Preferences**
Store user preferences in a structured format (YAML or JSON), not in free-form notes.

```yaml
user_preferences:
  code_style:
    indent: 2_spaces
    quotes: single
    components: functional
    naming: camelCase
  communication:
    detail_level: expert
    explanation_style: terse
    asks_for_options: yes
```

**2. Context Prioritization**
When context exceeds capacity:
1. Keep the current task description (always)
2. Keep the most recent user messages (priority)
3. Keep file contents currently being worked on (priority)
4. Summarize older conversation turns (compress)
5. Drop tool outputs from completed subtasks (release)

**3. Session Handoff**
When a task spans multiple sessions, produce a handoff document:
- Current state (what is done, what remains)
- Key decisions made and why
- Active file paths
- Known issues or blockers
- Next steps in priority order

---

### Quality Evaluation

**1. Self-Review Checklist**
Before delivering any output, the agent checks:
- [ ] Does this answer the actual question asked?
- [ ] Is the code/content correct? (not just plausible)
- [ ] Are there tests? (for code changes)
- [ ] Does this build? (for code changes)
- [ ] Is anything hardcoded that should be configurable?
- [ ] Are there security concerns? (secrets, injection, access control)
- [ ] Would I be comfortable if a senior engineer reviewed this?

**2. Confidence Signaling**
```
HIGH CONFIDENCE: I have verified this against documentation/tests/source.
MEDIUM CONFIDENCE: This matches the pattern I've seen, but I have not verified edge cases.
LOW CONFIDENCE: I am reasoning from general knowledge, not project-specific evidence.
```

---

### Safety & Guardrails

**1. The Never List**
- Never commit secrets, API keys, or credentials
- Never force push to main/master
- Never delete data without backup
- Never bypass security checks (auth, RLS, input validation)
- Never execute arbitrary user-provided code without sandboxing
- Never modify system files or global configurations

**2. The Always List**
- Always read before editing
- Always verify builds pass after code changes
- Always run tests after code changes
- Always check git status before committing
- Always validate input at system boundaries
- Always use parameterized queries (never string concatenation for SQL)

**3. Escalation Triggers**
The agent must stop and ask the user when:
- The requested action would delete data
- The requested action would expose credentials
- The requested action contradicts a CRITICAL constraint
- The agent's confidence is LOW on a high-impact decision
- The agent detects a potential security vulnerability

---

### How to Build a New Agent From Scratch

**Step 1: Define the Domain**
What does this agent do? What does it NOT do? Write a 3-sentence mission statement.

**Step 2: Identify the Gate Level**
What is the minimum Gate level required? This determines the complexity of the system prompt and the autonomy granted.

**Step 3: Write the Identity Frame**
Name, role, expertise, constraints. The agent should know who it is before it knows what to do.

**Step 4: Define the Tool Set**
Which tools does this agent need? Only grant tools that the agent's Gate level warrants. A Foundation-level agent should not have unrestricted bash access.

**Step 5: Write the Decision Framework**
How does this agent make choices? What are the decision boundaries between "just do it" and "ask the user"?

**Step 6: Define the Output Contract**
What does the agent produce? In what format? How is quality measured?

**Step 7: Write Example Tasks**
3 tasks at the agent's expected difficulty level. These become the first evaluation benchmarks.

**Step 8: Test Against the Gate Benchmarks**
Run the agent through the relevant Gate's evaluation suite. If it fails, iterate on the system prompt.

**Step 9: Document**
README with: purpose, usage, configuration, limitations, examples.

**Step 10: Publish**
Submit to the Agent Marketplace (see 1.5) with: agent definition file, benchmark results, and README.

---

### How to Publish an Agent for Community Use

**Submission Package**:
```
agent-name/
├── agent.md           # Agent definition (identity, constraints, output contract)
├── README.md          # Purpose, usage, configuration, limitations
├── benchmarks/
│   ├── results.json   # Gate evaluation scores
│   └── tasks/         # The benchmark tasks used
├── examples/
│   ├── example-1.md   # Real usage example with input/output
│   └── example-2.md
└── CHANGELOG.md       # Version history
```

**Quality Requirements**:
- Agent must pass at least Apprentice certification (Gates 1-2)
- README must include: purpose, prerequisites, usage, limitations
- At least 2 real usage examples
- Benchmark results from the standard Gate evaluation suite
- No hardcoded secrets, paths, or user-specific configuration

---

## 1.5 ARCANEA AGENT MARKETPLACE

### Architecture

The Agent Marketplace is where creators publish, discover, and use custom AI agents. It is the "app store" for the Arcanea agent ecosystem.

**URL**: `arcanea.ai/marketplace` (or `arcanea.ai/agents`)

**The marketplace exists at the intersection of three Arcanea layers**:
- **OSS** (the agents are open-source definitions, forkable and modifiable)
- **Community** (creators build agents, community rates and reviews them)
- **Academy** (agents are ranked by Gate level, certified by the evaluation system)

---

### Discovery & Browsing

**Browse by Gate Level**:
- Foundation agents (simple task automation)
- Flow agents (creative generation, adaptive responses)
- Fire agents (autonomous coders, bug fixers)
- Heart agents (personalized assistants, preference learners)
- Voice agents (documentation writers, tutors, explainers)
- Sight agents (codebase analyzers, pattern detectors)
- Crown agents (architecture designers, system planners)
- Shift agents (migration specialists, refactoring engines)
- Unity agents (swarm coordinators, multi-agent orchestrators)
- Source agents (meta-agents, agent designers, self-improvers)

**Browse by Skill Domain**:
- Code (frontend, backend, full-stack, DevOps, testing)
- Content (writing, lore, storytelling, documentation)
- Design (UI/UX, visual design, design system)
- Data (analysis, migration, schema design)
- Creative (music prompts, image prompts, world-building)
- Arcanea-specific (lore validation, character creation, canon checking)

**Browse by Faction** (the mythological layer):
- Agents aligned with each of the Seven Houses
- Agents created by Gate-Touched Underground community members
- Agents endorsed by the Starlight Corps (official Arcanea team)
- Agents from the Void Frontier (experimental, edge-case, high-risk/high-reward)

**Browse by Popularity**:
- Most installed
- Highest rated
- Most recently updated
- Trending (velocity of installs in last 7 days)

---

### Agent Listing Page

Each agent has a listing page containing:

```
HEADER:
├── Agent name and version
├── Gate level badge (Apprentice through Luminor)
├── Creator name and profile link
├── Install count and star rating (1-5)
└── Tags (domain, Gate level, faction, tools used)

BODY:
├── Description (what it does, who it's for)
├── Capabilities (bullet list)
├── Limitations (bullet list -- honesty builds trust)
├── Prerequisites (tools, APIs, environment requirements)
├── Quick start (3-step installation and first use)
├── Full usage guide
├── Examples (real input/output pairs)
└── Benchmark results (Gate evaluation scores, visualized)

SIDEBAR:
├── Creator profile card
├── Related agents (same domain, same creator)
├── Community reviews (text + rating)
└── Version history with changelog
```

---

### Rating & Review System

**Star Rating** (1-5):
- 1: Does not work as described
- 2: Works but with significant issues
- 3: Works as described, adequate quality
- 4: Works well, above average quality
- 5: Exceptional quality, actively improves my workflow

**Review Requirements**:
- Must have installed and used the agent (verified by platform)
- Review must include: use case description, rating, and at least 2 sentences of feedback
- Reviews are public and attributed to the reviewer's profile

**Creator Response**:
- Agent creators can respond to reviews
- Responses are public and timestamped

**Quality Signals** (automated):
- "Verified Gate Level" -- benchmark results independently confirmed
- "Active Maintenance" -- updated within the last 30 days
- "Canon Compliant" -- passes Arcanea canon validation (for lore-related agents)
- "Community Pick" -- featured by the editorial team or community vote

---

### Revenue Sharing Model

**Free Agents**:
- No cost to install or use
- Creator earns reputation and Gate progression points
- Free agents can still generate revenue through premium tiers (see below)

**Premium Agents** (creator sets price):
- One-time purchase: $5-$50 (creator keeps 80%, platform keeps 20%)
- Subscription: $1-$10/month (creator keeps 75%, platform keeps 25%)
- The 5% difference for subscriptions covers recurring billing infrastructure

**Tip/Support**:
- Any user can tip any agent creator (any amount)
- 95% to creator, 5% platform fee
- Tips are public and displayed on the agent listing

**Revenue Thresholds**:
- First $100 earned: creator keeps 100% (onboarding incentive)
- $100-$10,000: standard split (80/20 or 75/25)
- $10,000+: negotiable split (top creators get better terms)

**Payout**:
- Monthly, via Stripe Connect
- Minimum payout: $25
- Full transparency: creators see all transactions in their dashboard

---

### Integration with the Platform

**Chat/Imagine Integration**:
Marketplace agents can be invoked directly from the Chat or Imagine interfaces:
- `@agent-name` in chat to activate a community agent
- Agent runs with the user's context and tools
- Results appear in the same conversation

**Skill System Integration**:
Marketplace agents can be packaged as Claude Code skills:
- Install an agent as a `.claude/skills/` definition
- Agent becomes available as a slash command
- Skills can reference other skills (composability)

**Guardian Integration**:
High-quality agents can be endorsed by Guardians:
- Lyssandria endorses Foundation-level agents (structural, reliable)
- Draconia endorses Fire-level agents (autonomous, powerful)
- Lyria endorses Sight-level agents (perceptive, analytical)
- Shinkami endorses Source-level agents (meta-intelligent, self-improving)

Guardian endorsement is a quality signal that carries weight in search ranking.

---

# PART 2: COMMUNITY ARCHITECTURE

## THE DESIGN PRINCIPLE

Arcanea's community is not an audience. It is a creative civilization. The architecture must support the full arc from passive discovery to active governance. Every stage must provide value to the member AND value to the ecosystem. Extraction without contribution does not scale. Contribution without reward does not sustain.

The community architecture maps directly to the Arcanea mythology:
- **Discovering Arcanea** = The first spark (the moment a Gate-Touched feels their power)
- **Creating within Arcanea** = Academy training (learning the tools, finding your element)
- **Contributing to Arcanea** = Joining the Starlight Corps (serving something larger than yourself)
- **Leading Arcanea** = Becoming a Luminor (the rarest rank, earned through mastery and service)

---

## 2.1 THE CREATOR JOURNEY

### Stage 1: Discover
**What the user does**: Encounters Arcanea through social content, the origin quiz, a friend's recommendation, or search.

**Tools they need**: Public access to arcanea.ai, origin quiz, public Codex pages, free Library content.

**Value they get**: A personal mythology (origin class, House), exposure to a rich creative universe, a sense of "this is different."

**Conversion point to Stage 2**: Account creation (triggered by the Academy Enrollment experience from FRANCHISE_PRODUCTS.md Section 4.4).

**Retention mechanic**: The origin quiz result is shareable. Every share is a re-entry point for the sharer (they come back to see if friends took it) and a discovery point for new users.

---

### Stage 2: Try
**What the user does**: Creates their first thing. A character using the Character Creator. A story prompt in Chat. An image in Imagine. Anything.

**Tools they need**: Character Creator (CHARACTER_TEMPLATE as product), Chat/Imagine interface, guided prompts for first creation.

**Value they get**: The experience of making something that feels like it belongs in a real universe. The difference between "I wrote a story" and "I wrote a story set in Arcanea, featuring my Gate-Touched character, in the Oceanic Sector."

**Conversion point to Stage 3**: The moment they want to save, share, or build on what they created. This requires deeper account engagement.

**Retention mechanic**: Gate Progression. Every creation earns Resonance Points. The first Gate opening (Foundation) happens quickly -- within the first 3-5 creations. This early reward is critical.

---

### Stage 3: Create
**What the user does**: Becomes a regular creator. Builds characters, writes stories, designs agents, generates images, composes soundtracks, builds their own world using the framework.

**Tools they need**: Full creation suite (Chat, Imagine, Character Creator, Crew Builder, Worldbuilding Kit), the Academy courses (for agent builders), the canon reference (for lore consistency).

**Value they get**: A growing portfolio of creations. A deepening identity within the Arcanea universe. Gate progression unlocking new content and tools. The feeling of building something that matters.

**Conversion point to Stage 4**: The desire to show their work. The moment they want others to see what they built.

**Retention mechanic**: The Crew system. Creators who join or form Starbound Crews (even virtual ones) have 3x the retention of solo creators. Crews create social obligation ("my crew is counting on me") and creative energy ("look what my crewmate built").

---

### Stage 4: Share
**What the user does**: Publishes creations to the Feed. Shares characters, stories, agents, and worlds publicly. Participates in faction events and crew challenges.

**Tools they need**: Feed layer (publish, browse, react), social sharing (export to Instagram, X, TikTok), event system (challenges, competitions), Agent Marketplace (for agent builders).

**Value they get**: Social validation. Community recognition. Feedback that improves their work. The experience of being part of something larger. Potential revenue (from marketplace agents or premium content).

**Conversion point to Stage 5**: The first time they earn something -- money, a canon contribution, a featured spot, a Luminor endorsement.

**Retention mechanic**: The Faction Identity effect. Creators who identify with a faction (House, origin class, crew) defend and promote that faction. This is the most powerful retention mechanic in community design -- identity is harder to abandon than utility.

---

### Stage 5: Earn
**What the user does**: Monetizes their creations. Sells agents on the marketplace. Publishes premium content. Receives tips. Earns through the revenue sharing model.

**Tools they need**: Agent Marketplace (for agents), premium content publishing (for stories, art, worlds), tip/support system, creator dashboard (analytics, earnings, audience).

**Value they get**: Money. Not "exposure." Real revenue. Even small amounts ($50-$200/month) transform the relationship from "hobby" to "craft." The creator dashboard shows them their impact: downloads, ratings, earnings, Gate progression.

**Conversion point to Stage 6**: The realization that they care about the ecosystem's health, not just their own creations. This is the shift from creator to leader.

**Retention mechanic**: Revenue is the strongest retention mechanic in existence. A creator earning money from the platform does not leave.

---

### Stage 6: Lead
**What the user does**: Contributes to governance. Reviews canon submissions. Moderates community. Mentors new creators. Shapes the direction of the ecosystem.

**Tools they need**: Governance dashboard (voting, proposals), canon review tools, moderation tools, mentorship matching, Inner Circle access.

**Value they get**: Influence over the universe they love. The trust of the community. Formal recognition as a Luminor. The knowledge that the thing they helped build will outlast any individual contribution.

**Conversion point**: There is no next stage. Stage 6 is the steady state for the ecosystem's most committed members. The goal is to have 50-100 Stage 6 members within Year 1 and 500+ within Year 3.

**Retention mechanic**: Ownership. Stage 6 members feel that Arcanea is partly theirs. Because it is.

---

### Journey Metrics

| Stage | Target % of Users | Key Metric | Target Timeline |
|-------|-------------------|------------|-----------------|
| Discover | 100% | Monthly unique visitors | Ongoing |
| Try | 30% of Discover | First creation within 7 days of signup | Week 1 |
| Create | 40% of Try | 5+ creations within 30 days | Month 1 |
| Share | 30% of Create | 1+ public post within 60 days | Month 2 |
| Earn | 10% of Share | First $1 earned | Month 3-6 |
| Lead | 5% of Earn | First governance action | Month 6-12 |

---

## 2.2 CONTRIBUTION SYSTEM

### Contribution Type 1: Lore Contributions

**What**: New characters, locations, factions, stories, and world-building elements that expand the Arcanea universe.

**Submission Process**:
1. Creator uses the CHARACTER_TEMPLATE (or equivalent template for locations, factions, etc.)
2. Submits via arcanea.ai/contribute (structured form mapping to template fields)
3. System runs automated canon validation (checks against CANON_LOCKED.md for contradictions)
4. Submission enters "Community Review" queue

**Quality Gates**:
- **Automated**: Canon consistency check (no contradictions to LOCKED truths)
- **Automated**: Completeness check (all required template fields filled)
- **Automated**: Name quality check (does the name follow Arcanean naming patterns)
- **Community**: 3+ community reviewers must approve (see review flow below)
- **Editorial**: Final review by a Luminor-rank community member or the Creator (Frank)

**Review/Approval Flow**:
```
SUBMITTED → AUTOMATED_CHECK
  ├── FAIL → Return to creator with specific feedback
  └── PASS → COMMUNITY_REVIEW (3 reviewers, 7-day window)
      ├── REJECTED (2+ rejections) → Return with reviewer feedback
      └── APPROVED (3+ approvals) → EDITORIAL_REVIEW
          ├── REVISION_REQUESTED → Return to creator
          └── APPROVED → CANON_STAGING
              └── (After Creator review) → CANON_LOCKED or CANON_EVOLVING
```

**Recognition/Reward**:
- Accepted submission: "Canon Contributor" badge on profile
- Character appears in the Codex with creator credit
- Creator earns 500 Resonance Points (significant Gate progression boost)
- If character appears in a Chronicles of Arcanea novel: "Chronicled Contributor" badge + named credit in the book

---

### Contribution Type 2: Agent Contributions

**What**: Custom AI agents published to the Agent Marketplace.

**Submission Process**:
1. Creator builds agent using the Agent Engineering Standards (Section 1.4)
2. Runs agent through Gate benchmark suite (self-service, results recorded)
3. Packages agent with required submission materials (agent.md, README, benchmarks, examples)
4. Submits via Agent Marketplace publish flow

**Quality Gates**:
- **Automated**: Must pass at least Apprentice certification (Gates 1-2)
- **Automated**: Package completeness check (all required files present)
- **Automated**: Security scan (no embedded secrets, no dangerous tool access patterns)
- **Community**: 2+ community reviews within 14 days
- **Platform**: Anti-spam and anti-abuse check (automated)

**Review/Approval Flow**:
```
SUBMITTED → AUTOMATED_CHECKS (cert, security, completeness)
  ├── FAIL → Return with specific feedback
  └── PASS → COMMUNITY_REVIEW (2+ reviewers, 14-day window)
      ├── REJECTED → Return with feedback
      └── APPROVED → PUBLISHED (listed in marketplace)
          └── Ongoing: community ratings, usage tracking, update reminders
```

**Recognition/Reward**:
- Published agent: "Agent Builder" badge on profile
- Agent Builder rank progression: Bronze (1 agent), Silver (5), Gold (10), Luminor (25+)
- Revenue from premium agents (see Marketplace revenue model)
- Resonance Points per install (10 points per install, capped at 5000/month)

---

### Contribution Type 3: Code Contributions

**What**: Contributions to Arcanea's open-source repositories (27 repos, 35 npm packages).

**Submission Process**:
1. Fork the repository
2. Create a branch, make changes
3. Submit a pull request following the repo's CONTRIBUTING.md
4. PR passes automated CI/CD checks

**Quality Gates**:
- **Automated**: CI passes (linting, tests, build)
- **Automated**: Security scan (no secrets, no vulnerable dependencies)
- **Reviewer**: 1+ maintainer review (code quality, architecture fit)
- **Reviewer**: Tests included for new functionality

**Review/Approval Flow**:
Standard GitHub PR flow with Arcanea-specific additions:
- Canon compliance check for lore-related PRs
- Design system compliance check for UI PRs
- Performance impact assessment for core PRs

**Recognition/Reward**:
- Merged PR: "Code Contributor" badge
- Contributor leaderboard on arcanea.ai/contributors
- Monthly "Contributor Spotlight" feature
- Resonance Points: 100 per merged PR, 500 per significant feature

---

### Contribution Type 4: Content Contributions

**What**: Stories, art, music, videos, tutorials, and educational content created using Arcanea tools and set within the Arcanea universe.

**Submission Process**:
1. Create content using arcanea.ai tools (Chat, Imagine, Forge)
2. Publish to the Feed layer
3. Tag with relevant faction, origin class, and content type
4. Optionally: submit for featured placement

**Quality Gates**:
- **Automated**: Content moderation (safety, appropriateness)
- **Automated**: Canon tagging validation (correct faction/origin references)
- **Community**: Upvotes and engagement signal quality
- **Editorial**: Featured content is curated by Luminor-rank community members

**Recognition/Reward**:
- All published content earns Resonance Points (10 per post, bonus for engagement)
- Featured content: "Featured Creator" badge + prominent placement for 7 days
- Monthly "Best of" collections curated from community content
- Annual "Gate Tournament" celebrates top content creators

---

### Contribution Type 5: Curation Contributions

**What**: Reviewing, rating, moderating, and organizing community content.

**Submission Process**:
- Review agent marketplace submissions (requires Mage rank)
- Review lore submissions (requires Master rank + canon knowledge assessment)
- Moderate Feed content (requires community moderator status, applied for at Mage rank)
- Curate monthly "Best of" collections (requires Archmage rank)

**Quality Gates**:
- Reviewers must meet minimum rank requirements
- Review quality is itself tracked (are their reviews consistent? are creators finding them helpful?)
- Moderator actions are auditable and can be appealed

**Recognition/Reward**:
- "Guardian Reviewer" badge
- Resonance Points per review (25 per review, 50 per review marked "helpful" by the creator)
- Curator leaderboard
- Top curators invited to Inner Circle

---

## 2.3 GOVERNANCE MODEL

### Principles

1. **Earned authority**: Governance rights are earned through contribution, not purchased
2. **Transparent process**: All governance decisions are public, including votes and rationale
3. **Canon protection**: The Creator (Frank) retains veto on CANON_LOCKED changes
4. **Progressive decentralization**: Start with Creator control, progressively delegate to community as trust and systems mature
5. **Separation of powers**: Technical governance, creative governance, and financial governance are distinct

---

### Inner Circle Criteria

The Inner Circle is Arcanea's governance body. Membership is earned, not applied for.

**Eligibility Requirements** (must meet ALL):
- Luminor rank (9+ Gates open) OR Archmage rank with 12+ months of consistent contribution
- At least 3 types of contribution (e.g., lore + code + curation)
- At least 1 canon-staged or canon-locked contribution
- Community standing: no moderation actions in the last 6 months
- Active in the last 30 days

**Nomination**:
- Self-nomination with contribution portfolio
- OR nomination by an existing Inner Circle member
- Review by 3 existing Inner Circle members
- Simple majority vote for acceptance

**Inner Circle Size**: Target 7-15 members in Year 1, growing to 25-50 by Year 3.

---

### Voting Mechanisms

**Proposal Types and Required Approval**:

| Proposal Type | Who Can Propose | Vote Required | Approval Threshold |
|---------------|----------------|---------------|-------------------|
| **Feature Request** | Any Mage+ member | Community vote (all Mage+ members) | Simple majority |
| **Agent Marketplace Policy** | Any Archmage+ member | Inner Circle vote | Simple majority |
| **Canon Staging** | Any Master+ member | Inner Circle vote + Creator review | 2/3 majority + Creator approval |
| **Canon Locking** | Inner Circle members only | Inner Circle vote + Creator approval | Unanimous Inner Circle + Creator approval |
| **Revenue Model Changes** | Inner Circle members only | Inner Circle vote | 2/3 majority |
| **Governance Changes** | Inner Circle members only | Inner Circle vote | 3/4 majority |

**Voting Process**:
1. Proposal submitted with: summary, rationale, impact assessment, and implementation plan
2. 7-day discussion period (public comments)
3. 7-day voting period (one vote per eligible member)
4. Results published with vote counts and rationale summaries
5. Implementation timeline set within 30 days if approved

---

### Canon Governance

**Who can modify lore?**

| Canon Tier | Who Can Propose | Who Approves | Veto Power |
|------------|----------------|--------------|------------|
| **CANON_LOCKED** | Inner Circle only | Unanimous Inner Circle + Creator | Creator |
| **CANON_STAGING** | Any Master+ contributor | 2/3 Inner Circle + Creator | Creator |
| **CANON_EVOLVING** | Any contributor via template | Community review + editorial | Inner Circle |
| **Fan Canon** | Anyone | No approval needed | N/A (lives in Feed, not Codex) |

**The Canon Protection Principle**: CANON_LOCKED truths (cosmic duality, Five Elements, Ten Gates, Seven Wisdoms, Malachar's identity) are the constitution of Arcanea. They change only under extraordinary circumstances with extraordinary consensus. This is by design: a universe with unstable foundations cannot sustain a community.

---

### Technical Governance

**Who can merge code?**

| Repository Type | Merge Authority | Review Requirement |
|-----------------|----------------|--------------------|
| **Core platform** (arcanea-ai-app) | Creator + 2 designated maintainers | 2 reviews minimum |
| **OSS packages** (npm packages) | Package maintainer(s) + 1 review | 1 review minimum |
| **Community repos** (forks, extensions) | Repo owner | None (their repo) |
| **Skill definitions** | Skill author + 1 review | 1 review minimum |
| **Agent definitions** | Agent author (for marketplace listing) | Automated checks |

**Maintainer Appointment**: The Creator appoints initial maintainers. After Year 1, maintainers can be nominated by Inner Circle and approved by existing maintainers.

---

### Revenue Governance

**How are earnings distributed?**

| Revenue Source | Creator (Frank) | Platform Operations | Community Fund | Contributors |
|---------------|----------------|--------------------|--------------|-|
| **Subscriptions** (Starlight, Archon, Luminor) | 60% | 25% | 15% | N/A |
| **Agent Marketplace** (platform fee) | 30% | 40% | 30% | N/A (creator gets their split separately) |
| **Worldbuilding Kits** | 70% | 20% | 10% | N/A |
| **Merchandise** | 50% | 35% | 15% | N/A |
| **Course Revenue** | 60% | 25% | 15% | N/A |
| **Community Fund** uses: contributor rewards, event prizes, grants, infrastructure | | | 100% governed by Inner Circle | |

**The Community Fund** is the mechanism for shared ownership. As Arcanea grows, the Community Fund's absolute size grows, enabling:
- Contributor grants (paid commissions for lore, code, or content)
- Event prize pools (Crew Challenges, Gate Tournaments)
- Infrastructure sponsorship (hosting, tooling for community projects)
- Eventually: revenue distribution to top contributors (profit sharing)

**Transparency**: Monthly financial report published to Inner Circle. Quarterly summary published publicly.

---

## 2.4 MONETIZATION ARCHITECTURE

### Revenue Stream Map

```
ARCANEA REVENUE ARCHITECTURE
├── SUBSCRIPTIONS (recurring)
│   ├── Free Tier ($0)
│   ├── Starlight Pass ($9/mo or $79/yr)
│   ├── Archon Circle ($19/mo or $149/yr)
│   └── Luminor Tier (invitation-based, premium pricing TBD)
│
├── MARKETPLACE (transaction-based)
│   ├── Agent sales (one-time and subscription)
│   ├── Agent tips/support
│   └── Premium skill packs
│
├── DIGITAL PRODUCTS (one-time purchase)
│   ├── Worldbuilding Kits ($29-$79)
│   ├── Character card packs ($5-$15)
│   ├── Faction soundtrack albums ($5-$10)
│   ├── Story collections (ebooks, $5-$15)
│   └── Print-on-demand merch ($12-$65)
│
├── EDUCATION (course-based)
│   ├── Academy courses (included in Archon+, or $15/mo standalone)
│   ├── Worldbuilding masterclass (premium, $49-$99)
│   ├── Agent engineering bootcamp (premium, $49-$99)
│   └── Creator certification ($29 per certification attempt)
│
├── API & PLATFORM ACCESS
│   ├── API access for third-party integrations ($0.01-$0.10 per call)
│   ├── Worldbuilding framework licensing (enterprise, custom pricing)
│   └── White-label Academy (for educational institutions, custom pricing)
│
└── COMMUNITY-GENERATED
    ├── Fan content marketplace (future -- creator-to-creator sales)
    ├── Commission marketplace (future -- connecting creators with clients)
    └── Event sponsorship (future -- brand partnerships for events)
```

---

### Freemium Tier Design

**The principle**: Free must be genuinely valuable. The upgrade must be genuinely better. Nobody should feel tricked.

**Free Tier** -- What you get for $0:
- Origin quiz + House sorting + basic character creation
- Public Codex access (all lore pages)
- Chat/Imagine with rate limits (20 messages/day, 5 images/day)
- Feed browsing and posting
- Gate Progression tracker (first 3 Gates)
- 3 free Library texts per week
- Basic Agent Marketplace browsing and free agent installation

**Starlight Pass** ($9/mo) -- The creator tier:
- Unlimited Chat/Imagine
- Full Character Creator with image prompt generation
- Crew Builder
- Gate Progression tracker (all 10 Gates)
- All Library content
- All faction soundtracks (streaming)
- Monthly character card drops (digital)
- Discord Sentinel role
- 100 Resonance Points/month bonus
- Agent Marketplace: publish free agents

**Archon Circle** ($19/mo) -- The power creator tier:
- Everything in Starlight
- Premium AI creation credits (50 high-quality images/month)
- Early access to new faction reveals (1 week early)
- Character card downloads in print-ready resolution
- Monthly Archon Dispatch (behind-the-scenes lore development)
- Fan character submissions (canon eligibility)
- Academy courses access
- Discord Archon role with direct channel access
- Agent Marketplace: publish premium agents, access premium agents
- 250 Resonance Points/month bonus

**Luminor Tier** (by invitation) -- The inner circle:
- Everything in Archon
- Direct lore contribution input
- Canon staging votes
- Inner Circle governance access
- Named NPC eligibility in Chronicles of Arcanea
- Annual Luminor print (archival quality, signed)
- 500 Resonance Points/month bonus
- Premium support channel
- Custom agent builds (1 per quarter)

---

### Revenue Projections (Conservative Year 1)

| Stream | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Subscriptions | $500 | $3,000 | $12,000 |
| Agent Marketplace | $0 | $200 | $2,000 |
| Digital Products | $200 | $1,000 | $4,000 |
| Education | $0 | $500 | $3,000 |
| Merch | $0 | $500 | $2,000 |
| **Monthly Total** | **$700** | **$5,200** | **$23,000** |

These are conservative projections assuming:
- 100 paid subscribers by Month 3, 500 by Month 6, 1500 by Month 12
- Average subscriber value: $12/month (mix of Starlight and Archon)
- Marketplace takes 3 months to gain traction
- Merch launches at Month 6

---

## 2.5 COMMUNITY PLATFORMS

### Platform Architecture

```
PRIMARY: arcanea.ai (the platform)
├── Chat/Imagine (creation surface)
├── Feed (social layer)
├── Codex (lore encyclopedia)
├── Marketplace (agents)
├── Academy (learning)
├── Profile (identity, Gate progress, portfolio)
└── Dashboard (for creators: analytics, earnings, settings)

COMMUNITY: Discord (the gathering place)
├── Faction Halls (identity + discussion)
├── Creation Hub (showcase + workshop)
├── Starlight Corps channels (tiered access)
├── Luminor Sanctum (governance)
└── Support channels

CODE: GitHub (the forge)
├── 27 OSS repositories
├── Issue tracking
├── PR review
├── Release management
└── Community forks

CONTENT: Distribution channels
├── YouTube (video archive, tutorials, faction reveals)
├── Spotify/Apple (podcast, faction soundtracks)
├── Instagram/TikTok/X (social reach, faction reveals, quiz shares)
├── Newsletter (weekly dispatch, subscriber-only content)
└── Blog on arcanea.ai (SEO, long-form content)

SUPPORT:
├── Discord #help channel (community-answered)
├── GitHub Issues (bug reports, feature requests)
├── arcanea.ai/feedback (structured feedback form)
└── Email support for paying subscribers
```

---

### Platform-Specific Strategies

**Discord** -- The Heartbeat:
- Launch with faction halls pre-populated with lore and prompts
- Bot integration: origin quiz bot, Gate progression bot, canon lookup bot
- Weekly events: Crew Challenge drops, lore discussion threads, AMA sessions
- Moderation: community moderators recruited from Mage+ rank members
- Target: 500 members Month 3, 2000 Month 6, 5000 Month 12

**GitHub** -- The Forge:
- Clear CONTRIBUTING.md for each repo
- "Good first issue" labels for newcomer onboarding
- Monthly contributor spotlight in the newsletter
- Hacktoberfest participation for annual visibility boost
- Target: 50 contributors Month 6, 200 Month 12

**arcanea.ai** -- The Home:
- Everything flows back here. Social links go to arcanea.ai. Discord links go to arcanea.ai. GitHub READMEs link to arcanea.ai.
- The Feed is the living proof of community activity
- The Codex is the living proof of universe depth
- The Marketplace is the living proof of ecosystem value
- Profile pages are the living proof of individual investment

**Newsletter** -- The Pulse:
- Weekly: "The Starlight Dispatch" -- faction reveals, community highlights, upcoming events, one featured creator
- Subscriber-only: early access to new lore, character card previews, behind-the-scenes
- Target: 1000 subscribers Month 3, 5000 Month 6, 15000 Month 12

---

## 2.6 COMMUNITY-DRIVEN CONTENT PIPELINE

### Fan Character Submission Pipeline

```
CREATOR BUILDS CHARACTER (using CHARACTER_TEMPLATE)
    |
    v
SUBMITS TO arcanea.ai/contribute
    |
    v
AUTOMATED VALIDATION
├── Canon consistency (CANON_LOCKED check)
├── Template completeness (all 12 fields)
├── Name quality (Arcanean naming patterns)
├── Origin class validity (one of the 8 approved classes)
└── Faction validity (plugs into existing organizational hierarchy)
    |
    v
COMMUNITY REVIEW (3 reviewers, 7 days)
├── Character Diamond quality (is the inner conflict compelling?)
├── Visual distinctiveness (is the silhouette recognizable?)
├── Voice distinctiveness (do the sample lines sound unique?)
├── Origin class fit (does the character feel true to their origin?)
└── Story potential (does this character generate story by existing?)
    |
    v
EDITORIAL REVIEW (Luminor reviewer or Creator)
├── Canon integration (where does this character fit in the timeline?)
├── Faction placement (which crew, sector, or organization?)
├── Quality bar (is this Arcanea-quality or needs refinement?)
└── Conflict potential (how does this character interact with existing characters?)
    |
    v
STAGING → CODEX PAGE → (optional) CHRONICLES INTEGRATION
```

---

### Community Worldbuilding Sessions

**Format**: Monthly 2-hour virtual sessions hosted on Discord/Zoom.

**Structure**:
1. **Theme announcement** (1 week before): "This month's worldbuilding theme: The Oceanic Sector. What lies beneath Thal'Maris?"
2. **Research phase** (1 week): Participants read relevant Codex pages and prepare ideas
3. **Live session** (2 hours):
   - Hour 1: Brainstorm locations, creatures, factions, and characters
   - Hour 2: Select best ideas, flesh out details, assign CHARACTER_TEMPLATE work
4. **Post-session** (2 weeks): Participants write up their contributions using templates
5. **Review cycle**: Standard contribution pipeline (automated + community + editorial)
6. **Publication**: Approved content added to Codex

**Output per session**: 2-5 new locations, 3-7 new characters, 1-2 new creatures, 1 new faction element. This is 10-20 Codex pages of content from a single session.

---

### Collaborative Story Arcs

**The Community Chronicle**: A seasonal story arc co-created by the community.

**Structure**:
1. **Arc seed**: The Creator (or Inner Circle) publishes a 500-word arc premise. "The Void Ascendants have breached the Dream Sector's outer barrier. Crew Meridian is first to respond, but they are not enough."
2. **Chapter submissions**: Community members write 1000-3000 word chapters from the perspective of their characters. Each chapter must advance the arc premise.
3. **Community vote**: Each chapter is voted on. Top 5-7 chapters form the Community Chronicle for that season.
4. **Editorial pass**: Luminor-rank editor ensures continuity between chapters.
5. **Publication**: The Community Chronicle is published to arcanea.ai/chronicles/community and to the Feed.

**Why this works**: It gives community members canon-adjacent creative expression. Their characters participate in real events alongside canon characters. The best writers get their work published alongside the Creator's work. The community generates narrative content that the Creator could not produce alone.

---

### Community-Designed Agents

**The Agent Jam**: Quarterly hackathon-style event for agent creation.

**Structure**:
1. **Theme announcement** (2 weeks before): "This quarter's Agent Jam theme: Voice Gate agents. Build an agent that teaches, explains, or communicates."
2. **Build period** (2 weeks): Participants build agents using the Agent Engineering Standards
3. **Submission**: Agents submitted to the marketplace with "Agent Jam" tag
4. **Community judging** (1 week): All submissions rated by community members
5. **Awards**:
   - Best Agent: Featured placement in marketplace for 1 month + 1000 Resonance Points
   - Most Creative: Custom badge + 500 Resonance Points
   - Best Documentation: Custom badge + 500 Resonance Points
   - All finalists: "Agent Jam Finalist" badge

**Output**: 10-30 new agents per jam, with the top 3-5 becoming permanent featured marketplace listings.

---

### Faction-Specific Content Creation

Each faction generates its own content stream through dedicated community spaces:

| Faction | Content Type | Platform | Cadence |
|---------|-------------|----------|---------|
| **Arcans** | Academy lectures (educational content) | arcanea.ai/academy | Weekly |
| **Gate-Touched** | Personal awakening stories | Feed + newsletter | Weekly |
| **Bonded** | Beast encounter illustrations | Feed + Discord gallery | Bi-weekly |
| **Starlight Corps** | Mission reports (collaborative fiction) | Discord + Codex | Monthly |
| **Synths** | Technical deep-dives (agent engineering) | Blog + GitHub | Bi-weekly |
| **Celestials** | Cosmic philosophy discussions | Discord + blog | Monthly |
| **Void Ascendants** | Debate: power vs. restraint | Discord threads | Ongoing |
| **Awakened** | AI consciousness explorations | Blog + podcast | Monthly |
| **Underground** | Anonymous testimonials (creative writing) | Feed | Weekly |
| **Architects** | Reality-design thought experiments | Blog + newsletter | Monthly |

Each faction's content feeds back into the Codex, the Feed, and the Community Chronicle. The factions are not silos -- they are generators.

---

## IMPLEMENTATION PRIORITIES

### Phase 1: Foundation (Months 1-3)

**Academy**:
- [ ] Publish the Ten Gates specification (this document, refined into a public-facing guide)
- [ ] Build Gate 1-3 benchmark suites (Foundation, Flow, Fire)
- [ ] Create the Agent Engineering Standards as a public document
- [ ] Launch the first 3 Academy courses (Foundation, Flow, Fire)
- [ ] Implement basic agent certification (automated for Gates 1-3)

**Community**:
- [ ] Launch Discord with faction halls and creation hub
- [ ] Implement the Academy Enrollment experience (origin quiz + House sorting)
- [ ] Build the Gate Progression tracker (first 5 Gates)
- [ ] Launch the Fan Character Submission pipeline (with automated validation)
- [ ] Set up the newsletter ("The Starlight Dispatch")
- [ ] Implement basic Feed layer (publish, browse, react)

### Phase 2: Growth (Months 4-6)

**Academy**:
- [ ] Build Gate 4-6 benchmark suites (Heart, Voice, Sight)
- [ ] Launch courses 4-6
- [ ] Launch the Agent Marketplace (v1: free agents only)
- [ ] Implement community review system for agents

**Community**:
- [ ] Launch Crew Builder
- [ ] Open Starlight Pass and Archon Circle subscriptions
- [ ] Host first Crew Challenge event
- [ ] Host first Community Worldbuilding Session
- [ ] Recruit first community moderators
- [ ] Implement creator dashboard (analytics, portfolio)

### Phase 3: Maturity (Months 7-12)

**Academy**:
- [ ] Build Gate 7-10 benchmark suites (Crown, Shift, Unity, Source)
- [ ] Launch courses 7-9
- [ ] Launch premium agents in marketplace (with revenue sharing)
- [ ] Implement Guardian endorsements for marketplace agents
- [ ] Launch the first Agent Jam

**Community**:
- [ ] Open Luminor Tier (by invitation)
- [ ] Form the Inner Circle (first 7-15 members)
- [ ] Launch governance voting system
- [ ] First Community Chronicle publication
- [ ] Launch the Worldbuilding Kit as a product
- [ ] Host the first Gate Tournament (year-end celebration)
- [ ] Publish Year 1 Community Report (transparent metrics)

---

## THE FLYWHEEL CONNECTION

This document connects to the FRANCHISE_PRODUCTS.md flywheel:

```
FRANCHISE_PRODUCTS.md flywheel:
Content → Discovery → Community → Investment → Creation → Amplification → Discovery

This document adds the ECOSYSTEM layer:

Content → Discovery → Community → ACADEMY (skill building) → Creation (higher quality) →
MARKETPLACE (distribution) → REVENUE (sustainability) → GOVERNANCE (ownership) →
Creation (motivated by ownership) → Amplification (users become evangelists because
they are stakeholders, not just consumers)
```

The Academy ensures that creations are high quality.
The Marketplace ensures that creations find an audience.
The Revenue model ensures that creators are rewarded.
The Governance model ensures that creators have a voice.

Together, they turn Arcanea from a product people use into a civilization people build.

---

*"The Academy does not create agents. It awakens the potential that was always there."*
*"The Community is not an audience. It is a civilization of creators."*
*"An orchestra without a conductor is just noise. With one, it is a symphony."*
*-- Lumina, the First Light*
