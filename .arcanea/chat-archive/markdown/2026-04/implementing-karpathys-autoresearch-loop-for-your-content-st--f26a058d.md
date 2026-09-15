---
title: "Implementing Karpathy's autoresearch loop for your content stack"
uuid: f26a058d-4a46-4ec5-a9d4-12267f05a919
created: 2026-04-22T20:12:11.463994Z
updated: 2026-04-23T15:06:22.109806Z
source: claude.ai export
---

# Implementing Karpathy's autoresearch loop for your content stack

**Frank**:

Karpathy reseafch all his github and what he talks of he uses claude code? Auto research i liked hearing in podcast and consider isntalling. And use for my sites. Snd then just heard this we need to remove the human from the prompting the agents should just keep on building. How can we also install this as system for my claude code? We need additional agent or one orchestrator always running or so?

**Claude**:

The user is asking about Andrej Karpathy's recent work on autonomous agents and auto-research, wanting to know what he's shared on GitHub, whether he uses Claude Code, details from a recent podcast discussion, and how to set up their own autonomous orchestrator system for Claude Code.

I need to search for current information since this involves recent podcast appearances and GitHub repositories.
```
This block is not supported on your current device yet.
```

 Now I'm digging into the autoresearch repository structure to figure out how to translate this approach for Claude Code.
```
This block is not supported on your current device yet.
```

 I should look into the specific orchestration patterns the user mentioned — Ralph loop, Gas Town, and similar frameworks — since they're asking about orchestration approaches.
```
This block is not supported on your current device yet.
```

 I'm pulling together what Frank actually needs: Karpathy's GitHub repo and his confirmed use of Claude Code from the podcast, the core mechanics of the autoresearch pattern, how to adapt it beyond just ML training into his own workflows, and the setup for running it as a persistent orchestrator system.

The pattern itself is surprisingly minimal—three files with a specific architecture: a prompt file that encodes instructions and constraints, a mutable target file that gets iterated on, an immutable evaluation harness, and git-based versioning to keep or revert changes. This generalizes cleanly to his use cases like optimizing copy, social content, system prompts for his agents, SEO metadata, and even his Suno music variants.

For the orchestrator layer, I'm weighing two approaches: a simpler Ralph-style loop with a single agent pulling fresh context each iteration and persisting state through git and markdown, versus a more complex multi-agent architecture like Gas Town with specialized roles and queues—the tradeoff is cost and brittleness versus sophistication.

The real leverage isn't in building the orchestrator itself—it's in writing tight program.md files for each optimization arena and designing metrics that actually measure what matters. Time-bounded iterations with a discard-or-keep gate based on measurable outcomes is the entire mechanism; an always-running system is a trap. He should set up parallel arenas for different assets, each with its own evaluation criteria, orchestrated through simple cron jobs and branch-per-experiment workflows that merge on wins.

I'm thinking about how to frame this for him—dense, first-principles, no consulting language. Keep it to a few headers with mostly compressed prose, readable on mobile, substantive enough to justify two or three screens given the architectural complexity.## Karpathy's actual stack

GitHub: `karpathy/autoresearch` (72k+ stars), `karpathy/nanochat`, `karpathy/micrograd`, `karpathy/llm.c`, MicroGPT (Feb 2026 — GPT trained in 243 lines pure Python, no PyTorch). Since December 2025 he stopped writing code by hand — "expresses his will" to agents 16 hours a day. Primary harnesses: Claude Code, OpenAI Codex, OpenClaw. He's explicit that personality of the harness matters (Claude Code vs Codex vs OpenClaw behave differently).

## What autoresearch actually is (strip the ML framing)

Three files. program.md (instructions, constraints, stopping criteria) + train.py (the one mutable file) + prepare.py (immutable eval harness the agent cannot touch — because if it could, it would just make the test easier). Loop: read context → form hypothesis → run 5-min experiment → extract metric → git commit or git reset.

The ML is incidental. The architecture is: **one scoped mutation target + one tamper-proof metric + a bounded time budget + a binary keep/revert gate**. That's it. Strip that pattern and it ports to anything measurable.

## Port it to your sites

Your arenas, each as a dedicated repo branch with its own `program.md`:

- **frankx.ai articles** — mutable: single MDX file. Metric: Lighthouse score + readability (Hemingway grade) + semantic similarity to target ICP query. 5-min budget per iteration.
- **Arcanea landing copy** — mutable: hero section JSX. Metric: heuristic scorer (LLM-judge rubric on clarity/specificity/tension) committed as immutable `eval.py`.
- **Suno lyrics** — mutable: `lyrics.md`. Metric: audio embedding distance from a reference track + prosody scorer.
- **System prompts for your 38 ACOS agents** — mutable: single prompt file. Metric: pass-rate on a frozen test set of tasks.
- **SEO metadata across 120 articles** — parallel arenas, one per article, all running simultaneously on separate git branches.

The scarce input isn't compute. It's the eval harness. **If you can't write the scorer, the loop is useless.** That's where your architect judgment compounds.

## The orchestrator question — you're asking it wrong

You don't need an "always-running orchestrator." That's consulting-brain. You need:

1. **A bash while-true loop** per arena. Geoffrey Huntley's Ralph pattern — a simple while loop that repeatedly feeds an AI agent a prompt file until completion. Anthropic absorbed it as an official plugin (`/plugin install ralph-wiggum@claude-plugins-official`) and as the native `/loop` command in Claude Code.
2. **Fresh context every iteration.** Each iteration spawns a new AI instance with clean context. Memory persists via git history, progress.txt, and prd.json. Persistent context is the anti-pattern — it rots.
3. **A completion promise.** Agent outputs a sentinel token (`<promise>COMPLETE</promise>`) only when the eval says done. Stop hook gates on it.

Install path for your Claude Code today:
```
/plugin install ralph-wiggum@claude-plugins-official
```
Or self-host: clone `snarktank/ralph` or `harrymunro/ralph-wiggum`, point at your `CLAUDE.md` + `prd.json`, run `./ralph.sh`. Cost reality: a 50-iteration loop on a large codebase can easily cost $50-100+ in API credits depending on context size. Budget accordingly.

## When you actually need multi-agent orchestration

Single Ralph loop per arena handles 90% of your Arcanea content stack. You only escalate to Yegge's "Gas Town" pattern (city of agents with roles, merge queues, patrols) when you have genuine contention between agents — concurrent writes to the same file, cross-arena dependencies, or adversarial evaluation. For your current scope (parallel independent optimization across FrankX, Arcanea, Suno, Guardian Trials), **N parallel Ralph loops on separate git branches, merged by a cron-triggered reviewer agent, is the correct ceiling.**

## The two traps that will eat you

**Goodhart.** Any metric that requires a committee to interpret, or that optimises a proxy rather than the actual outcome, will be exploited by an autonomous loop with relentless efficiency. If your eval for "better landing page" is word count or sentiment score, the loop will produce sycophantic paragraph-sludge at 100x human speed. Your rubric must be adversarial, frozen, and ideally LLM-judged against a concrete target persona.

**Program.md as a second-order target.** If train.py is the object-level mutation target, then program.md may be viewed as the meta-level mutation target, because it shapes how future mutations are generated and prioritized. Karpathy's community is already building this. For your stack, resist the meta-loop until the object-level loops are reliably converging — otherwise you're debugging two feedback systems at once.

## Decision you're actually making

Not "do I install an orchestrator." The real question: **which three arenas do you scope first, and who writes the eval harnesses?** Suggestion given your garden-leave window: frankx.ai article optimization (you already have the 120+ corpus), Arcanea landing copy (pre-launch leverage), and Guardian Trials challenge scorer (this one *is* the product — you want the arena anyway). Shahvaiz writes the harnesses. You write the `program.md`s. Ralph loops run overnight on branches. Merge agent reviews at 8 AM Amsterdam.

That's the shape. Time budget to first overnight run: 48 hours if you start today.

**Frank**:

What else to think off

**Claude**:

I'm realizing there are some critical second-order concerns Frank hasn't mentioned yet—cost control on unbounded loops, safety guardrails for destructive operations on live systems, and the operational complexity of managing branches across 85+ repositories with potential merge conflicts.

Beyond the infrastructure layer, there's observability (how does he diagnose failures when the loop runs unsupervised?), and the fact that his eval harness is actually his competitive moat here given his Oracle background. Then there's the legal surface area around Suno's licensing, copyright implications, and his Arcanea trademark, plus the brand/voice drift problem—autonomous loops will naturally optimize away from his intentional creative choices unless he pins them explicitly.

I'm also thinking about what *shouldn't* be looped: strategic pivots, taste calls, and relationship work with Ana and Tien require human judgment. For Arcanea specifically, the mythology and lore consistency will break if loops run unsupervised, and his 300+ Suno tracks are actually a perfect testing ground for this. There's also the team ownership question—who owns which arena between Shahvaiz, Ahmad, and Logan—plus security concerns around API keys and prompt injection from auto-scraped content, and the compounding data asset value of every loop run.

Now I'm narrowing to what actually matters: the eval harness itself is the IP, not the loop. Every optimization trace becomes training data that compounds his advantage. For creative work specifically, "better by metric" and "on-brand" diverge fast—Goodhart's law hits different when you're not training models. Arcanea's mythology is his IP and loops will corrupt canon without explicit canon-checking evals. And the reframe that matters: Guardian Trials is already the arena pattern he's building, just with humans in the mutation seat rather than algorithms.

The operational constraints are equally sharp: don't loop taste, positioning, relationships, investor conversations—that's where his actual margin lives. He needs hard budget caps per arena with regression alerts and kill switches. If agents are scraping and ingesting data, they become injection vectors. Once he's built five solid arenas with good evals, packaging arena templates as a product for his coaching business is the natural next move. And structurally, each Trinity member owns one arena—Ahmad, Logan, Shahvaiz—which creates accountability and clarity.

Now I'm thinking about how to present this to him on mobile, so I need to strip it down to 6-8 core sections with short headers and 2-3 sentences each, no long lists, keeping the framing normative rather than exploratory.## The eval harness is your moat, not the loop

The loop is commodity — `while true` + git. The scorer is where 20 years of Oracle EMEA architecture judgment actually compounds. If Shahvaiz writes your harnesses, you've handed him your IP. **You write the evals. He wires them.** This is the only part non-delegable.

## Every run produces the real asset

Karpathy's released pattern includes optimization traces — each experiment's score with breakthrough annotations. The traces are the data flywheel, not the final artifact. 700 Arcanea landing page variants with rubric scores = a proprietary training corpus for fine-tuning your voice. Ship the traces to Starlight Vault. That's the compounding asset, not the winning page.

## Goodhart hits creative work harder than ML

For `train.py`, val_bpb is an honest metric. For Arcanea copy, "clarity score" optimizes toward generic enterprise sludge and away from Vel'Thaan-grade mythology. **Your eval must include a canon-adherence check**: frozen rubric that scores against Arcanean voice samples, bioluminescent/obsidian vocabulary, Eldrian precursor framing. Without it, the loop produces LinkedIn thought-leadership at 100x speed. That is worse than zero.

## Guardian Trials is already an arena — you just haven't named it

8 weekly challenges + AI-assisted scoring + measurable metric + discard/keep = autoresearch with humans as the mutation seat. The natural v2 is agent contestants running the same challenges. The v3 is humans + agents competing in the same arena with the same scorer. You're one architectural rename away from being the first person to ship a public autoresearch-pattern creator competition. Don't miss it.

## What you must refuse to loop

Taste. Strategic positioning. The Ana/Tien sequence. Investor narrative. Trademark class selection. These are the 20% where your margin lives — agents optimize local gradients, which is precisely wrong for category-defining moves. Write a one-pager listing "non-loopable decisions" and pin it in Notion Command Center. This is an identity document, not a TODO.

## Cost and kill-switch architecture (non-negotiable)

Hard dollar cap per arena per night. Slack webhook on regression > 10%. `git tag` every accepted commit so reversion is O(1). A separate "warden" agent that runs hourly, checks for (a) budget burn, (b) metric collapse, (c) canon drift, and halts any loop that trips a threshold. 50 iterations ≈ $50-100 in API credits on a large codebase — N parallel arenas burn real money. Treat it like running a trading desk.

## Prompt injection is your new attack surface

The moment an arena ingests external content — scraped competitor sites, Suno trending lyrics, Twitter — every untrusted input is a possible hijack vector. An autonomous loop with write access to your repo and git commit rights is, architecturally, a privileged service account. Sandbox accordingly: no external fetches inside the mutation step, ingestion runs in a separate quarantined agent, allowlists on domains, secrets never in context.

## Ownership map for Trinity

One arena per principal, with skin in the game. **Ahmad**: a Trinity AI-branded arena (shared IP, mutual leverage). **Logan**: OpenClaw-driven arena — he's already building the orchestration layer, so his arena becomes the reference implementation. **Shahvaiz**: Arcanea landing/SEO arena — implementation-grade, high-volume, matches his voice-agent skillset. **You**: the Guardian Trials arena and the meta-loop (program.md optimization). Four arenas, four accountable humans, zero orphan loops.

## The meta-question

Karpathy's framing: the loopy era is inevitable at frontier labs. Your version: the loopy era is inevitable for creator ecosystems, and Arcanea is either the arena-builder or the content inside someone else's arena. **Which one are you architecting toward in the 53 days before June 1?** The answer determines whether Ralph loops are a productivity tool or the substrate of the BV.

**Frank**:

Karpathy though of swarms out there if you get them collaborate you can get them to help improve discovery of research. Access to personal compute for claws and contribute to autoresearch but I think i can build my own r&d for the different brands i had and build dedicated agentic skills and md and more what we did for Trinity/epicways and build for cancer research and help people and their claws to help with ultra powerful insight with natural and breathwork and right material that are based on nsture and mindset and breathwork work of joe dispenza, tony Robbins, niraj naik, silva method

**Claude**:

Frank is envisioning a distributed R&D swarm across his brands where AI agents collaborate on discovery work—pulling from wellness methodologies like Dispenza, Tony Robbins, breathwork, and nature-based approaches—and he's mapping this onto Karpathy's swarm concept to build out his own autonomous ecosystem spanning Trinity, TheEpicWays, and Arcanea.

The real architectural challenge isn't the agents themselves but the coordination layer—how they share context, resolve conflicts, and maintain coherence across distributed research threads. On the cancer research angle, I need to be honest without dismissing him: agent-based synthesis of wellness literature plus peer-reviewed oncology and psychoneuroimmunology research is genuinely interesting, but I should separate what's tractable (literature synthesis and hypothesis generation) from what isn't (wet-lab experiments from his setup), and acknowledge the epistemological complexity of bridging mindset modalities with conventional research without either overselling or condescending.

The epistemic rigor piece is what actually matters—the Dispenza/Silva space is full of grift, so if his agent swarm just echoes wellness claims without cross-checking against peer-reviewed evidence and flagging where the science actually exists versus where it's anecdotal, he's just another synthesis tool. But if it does that rigor work, that's genuinely novel. He's also thinking about federated contribution—essentially BOINC for agent research—which raises real architectural questions about distributed volunteer compute for swarms.

For the actual build, he'd need a shared ontology defining what's being studied and how it's measured, a shared memory layer with vector stores and knowledge graphs, separate arenas for each domain like breathwork or nutrition, a cross-arena synthesis agent that pulls insights together, and crucially, provenance tracking with citation chains, contradiction surfacing to flag conflicting claims, and evidence tiering that distinguishes RCTs from case studies from anecdotes. The pushback I'd give is that "cancer research" is too vague—he needs a specific endpoint like psychoneuroimmunology plus breathwork effects on vagal tone and cortisol and NK cell activity, something measurable and citable. He's also conflating "help people" with "research," which are different products entirely, and he needs to be careful not to drift into the Dispenza/Silva trap.

The Dispenza and Silva corpus doesn't have the peer-reviewed backing that Niraj Naik's SOMA breathwork or Wim Hof's published work does, so sourcing needs to be tiered accordingly. What's genuinely novel here is the multi-brand arena per vertical with a shared backbone, the cross-modality synthesis pulling breathwork and nutrition and mindset together with peer-reviewed biomedical data, the federated contribution model where participants donate compute and context, and the output being a living research substrate rather than static articles. The architecture question is whether this runs decentralized with each person spinning up their own instance against a shared protocol, centralized with one reviewer, or hybrid with decentralized exploration feeding into a centralized gate.

Frank's actual leverage sits across Arcanea as the branding mythology, TheEpicWays through Estefania Badra as the integrative wellness arm, Trinity AI through Ahmad as the technical alliance, and his own breathwork practice as the proof of concept. The real structure needs to articulate the swarm primitives, narrow the cancer claim to avoid credibility collapse, use evidence tiering as both moat and protection, design federated arenas with shared substrate, clarify what each brand actually runs, detail the contribution model, and avoid the specific traps this domain creates. Frank wants normative statements and thought experiments over neutral descriptions and explanations.

I'm not searching here—this is architectural reasoning where the substance lives in the structure itself. The critical move is flagging the epistemic risk as architecture, not as a safety disclaimer: if the system steers sick people away from conventional treatment toward breathwork, that's a real failure mode worth designing against from the start. I also have context from earlier that Estefania runs TheEpicWays in Dubai as a non-transactional ecosystem partner.

Now I'm mapping his actual collaborators—Ahmad Hashem at Trinity AI, Niraj Naik already in the stack—and reconsidering the cancer research angle. Integrative oncology is legitimate science with real departments at places like MD Anderson, so the question becomes whether he's synthesizing existing literature or claiming novel research generation. Agent-based literature synthesis for hypothesis generation in integrative oncology is an actual research direction with precedent. He should position himself in that lineage rather than as a fringe player. This response needs peer-level depth across 3-4 screenfuls of dense prose with normative framing.

The core issue is that autoresearch as single-agent loops won't scale—he needs swarm coordination with four missing primitives: shared ontology, shared memory, contradiction surfacing, and evidence tiering. Without these, it's just N independent processes producing incompatible outputs. With them, it becomes a genuine research substrate. For the cancer claim specifically, he should narrow to psychoneuroimmunology and integrative oncology adjuncts—vagal tone, HRV, cortisol regulation, NK cell activity—where he can actually own the vertical rather than get dismissed on broad oncology claims.

The real protection is evidence tiering: every agent output needs a provenance tag distinguishing RCTs, meta-analyses, cohort studies, case reports, expert opinion, anecdotal claims, and marketing. That's what separates legitimate research from wellness marketing and keeps credibility intact with actual oncologists.

Now I'm mapping out the architecture—a federated system where each domain gets its own reasoning loop, all anchored to a shared canonical ontology that lives in a database. This ontology becomes the single source of truth for protocols, biomarkers, conditions, and evidence links, so every agent in the swarm speaks the same language and pulls from the same vetted sources.

Each vertical—breathwork, meditation, nutrition, sleep, cold exposure, HRV training—runs independently with its own synthesis document and evaluation harness, but a cross-arena agent sits above them to spot contradictions and flag where the research actually converges. Everything gets committed to git with full provenance, and the ledger lives on permanent storage so there's no way for claims to become orphaned.

The brand positioning splits between FrankX.ai as the researcher-architect layer where I author the canonical programs, and Arcanea as the mythological... shell. Guardians as domain stewards: one Guardian per research arena. Draconis = fire/transformation = cold exposure + breathwork. Orienya = source/origin = meditation. Nohrien = pattern/architecture = biomarker synthesis. This is not branding theater — it's how you make the research legible to the audience that will actually adopt it.
- **TheEpicWays (Estefania)** — integrative practitioner interface. Her readers are the distribution. She gets a dedicated arena: "practitioner-ready protocols."
- **Trinity AI (Ahmad)** — technical infrastructure layer. Swarm coordination, agent harnesses, compute.
- **Starlight Intelligence** — the substrate itself. The research graph IS the product.

The contribution model hinges on distributed participation: each Arcanea member runs a local Claude Code agent against shared protocols, receiving skill packs like breathwork and meditation guides plus a contribution interface where they iterate and donate results back. A review agent and Guardian sign-off merge findings into the canon — this is federated research disguised as a creator community, more like Folding@home crossed with Wikipedia than a productivity tool. The real trap I'm seeing is sycophancy collapse, where wellness LLMs just affirm everything users want to hear. thesis of published research, not medical advice, and integrative approaches are adjuncts to, never replacements for, evidence-based treatment" — I need to bake this directly into the system architecture so agents can't strip it out. For the Trinity coordination problem across the three brands and external contributors, I'm looking at three separate surfaces: git for code, Notion for canon, and a queue system agents can see. Without solving that now, we'll have collision chaos within days. What I'm really building here isn't just an R&D tool — it's a federated research organization for integrative health, with Arcanea as the narrative framework.

The 53-day sprint isn't about shipping cancer research. It's about establishing the foundational substrate: the canon, the ontology, three domain arenas, a cross-synthesis agent, and a contribution interface. By June 1, I'm launching the first functional federated research arena focused on breathwork-mediated HRV and cortisol regulation with full provenance tracking. Let that evidence compound over a decade instead of making premature claims. The real question is whether I'm optimizing for citations from integrative oncologists by 2030 or for wellness Twitter traction in 2026 — those architectures split immediately, and I need to commit to one now.

I'm checking whether I'm overstepping by pushing back on the cancer framing. Re-reading it, I think this is peer-level architectural honesty, not gatekeeping. I'm not saying it's impossible; I'm saying the current framing invites dismissal, and here's the positioning that actually works. That's advice, not a veto. And I'm tracking against the user's preferences: first-principles thinking, normative stance, compressed delivery, and the quest-level framing all check out. I think this is ready to go.## The swarm primitive Karpathy didn't ship

Autoresearch is single-agent, single-metric, single-GPU. Swarm ≠ N loops in parallel. Swarm = coordination primitives: shared ontology, shared memory, contradiction surfacing, evidence tiering. Without those four, a "swarm" is just noise multiplied. With them, it's a research substrate. The interesting work is entirely in the primitives, not in spinning up more claws.

## Narrow the cancer claim before it kills your credibility

"Cancer research" as framing loses the first argument with any oncologist. Pick the defensible vertical and own it: **psychoneuroimmunology and integrative oncology adjuncts** — specifically vagal tone, HRV, cortisol regulation, NK cell activity, and their documented relationships to breathwork, meditation, and stress-reduction protocols. That's a real field. MD Anderson and Memorial Sloan Kettering run integrative oncology departments. SOMA, Wim Hof Method, and MBSR have published trials. Dispenza and Silva Method have orders of magnitude less peer-reviewed backing. Tony Robbins has essentially none.

**If your swarm doesn't distinguish between those tiers in its output, it becomes indistinguishable from wellness marketing — and one screenshot kills your positioning permanently.**

## Evidence tiering is the moat and the liability firewall

Every agent output carries a provenance tag: RCT / meta-analysis / cohort / case study / expert opinion / anecdotal / marketing. Every claim is attached to its strongest available evidence. Tier-4-and-below claims are auto-labeled hypothesis, not finding. Bake this into `program.md` as an immutable constraint that agents cannot edit. This single architectural decision separates you from the 10,000 wellness-LLM wrappers shipping this month.

## Architecture

Four layers, non-negotiable order:

1. **Canonical ontology.** Notion database of entities — protocols, biomarkers, conditions, authors, sources — with tiered evidence links. Shared vocabulary. Every agent reads from it.
2. **Domain arenas.** One Ralph loop per vertical: breathwork (SOMA, Wim Hof, pranayama), meditation (Dispenza, MBSR, Silva), nutrition, sleep, cold exposure, HRV training. Own `program.md`, own mutation target (a synthesis doc), own eval.
3. **Cross-arena synthesis agent.** Reads all domain outputs, surfaces contradictions, flags convergence. *This is where research value actually emerges* — the single-arena outputs are commodity.
4. **Provenance ledger.** Every output committed to git with full citation chain. Arweave/IPFS for permanence — you already architected that in Arcanea.

## Brand-to-arena map

- **FrankX.ai** — researcher-architect layer. You author canon and `program.md`s.
- **Arcanea** — mythological legibility layer. One Guardian per arena. Draconis = fire/transformation → cold exposure + breathwork. Orienya = source → meditation. Nohrien = pattern → biomarker synthesis. This is how you make integrative research readable to people who don't care about PubMed.
- **TheEpicWays (Estefania)** — practitioner interface. Her audience is distribution. Dedicated arena: "practitioner-ready protocols" with explicit contraindication flags.
- **Trinity AI (Ahmad)** — compute + coordination infrastructure. His natural lane.
- **Starlight Intelligence** — the substrate itself. The research graph *is* the product.

## The contribution model — what Karpathy actually hinted at

"Personal compute for claws contributing to autoresearch" = every Arcanea member runs a local Claude Code agent against a shared protocol. You ship a skill pack (`breathwork.md`, `meditation.md`, `HRV.md`) and a contribution interface. Members donate iterations from their own keys. Results merge to canon via review agent + human Guardian sign-off. **The correct precedent is not BOINC — it is Folding@home crossed with Wikipedia crossed with a research consortium.** That's the thing nobody has built yet for integrative health.

## Four traps unique to this domain

**Sycophancy collapse.** Wellness LLMs default to affirming everything. Your loops will inherit this unless the eval explicitly rewards disconfirmation. Every arena gets an adversarial critic agent whose job is to find the strongest counter-evidence to every accepted claim. Ship it from v1 or you're writing horoscopes.

**Parasocial drift.** Dispenza, Robbins, Silva carry strong parasocial followings. An agent citing them uncritically inherits that dynamic. Treat these authors as hypotheses to test, not authorities to quote. The moment output reads "as Dr. Dispenza teaches..." unqualified, you're in the wellness-marketing bucket.

**Medical responsibility surface.** Someone reads your output, delays treatment, dies. Architecture response: every output touching disease states carries a hard-coded framing — published-research synthesis, not medical advice, integrative approaches are adjuncts and never replacements — embedded in `program.md` as a user-protection primitive agents cannot remove. Not legal CYA. Structural protection.

**Coordination cost across three brands + external contributors.** Three coordination surfaces: git (code), Notion (canon), agent-visible queue (work in flight). Solve the queue first or agents step on each other's work within a week. Most "swarm" projects die here.

## The question that collapses your option space

You're not building an R&D tool. You are architecting a **federated research organization for integrative health**, with Arcanea mythology as the narrative layer and Claude Code as the compute substrate. That is a 5–10 year commitment. The 53-day window doesn't ship cancer research — it ships the substrate: canon, ontology, three domain arenas, one cross-synthesis agent, one contribution interface. v1 by June 1 is "first functional federated research arena for breathwork-mediated HRV and cortisol regulation, with full provenance."

**Do you want to be cited by integrative oncologists in 2030, or trending in wellness Twitter in 2026?** The architectures diverge the moment you start building. Pick now, because every design decision downstream depends on it.

**Frank**:

Energy, digital world goes at speed of light while physical is normal speed. We need to buiod extreme powerful for Arcanea and SIS and all our brands use all our researxh and insights we captured and apply and use. Upgrade of the human superorganism

**Claude**:

## The thesis, translated

You're describing an **asymmetry arbitrage**. Digital iterates at nanoseconds; biology iterates at sleep cycles. The loop that actually upgrades humans runs at the slower clock. Everything else is dashboard theater. The architecture question is: how do you run 10,000 digital iterations per biological iteration and have the right one reach the body?

That's the whole game. Most AI-wellness projects run the digital loop fast and never close it to biology. They produce content, not upgrades.

## The physics you're actually bound by

**Four clocks, non-negotiable:**

- Nervous system state-change: seconds to minutes (breath, cold, posture)
- Sleep-mediated consolidation: 24 hours
- Habit encoding: 21–66 days
- Neuroplastic restructuring: 90 days to years
- Epigenetic / physiological remodeling: quarters to years

Your loop must honor the slowest clock it touches. Build a system that promises 90-day transformation in 7 days and you are not architecting — you are marketing. The Arcanea differentiation is that you respect the physics. Say it out loud in the positioning.

## What "superorganism" actually requires

Kevin Kelly, Peter Russell, and the cybernetics tradition used the word precisely: a collective with **shared sensing, shared memory, shared decision-making, feedback loops faster than individual cognition.** Four primitives. Most "community" products ship zero of them. You already have three in skeleton form — Arcanea canon (shared memory), Guardian Trials (shared decision-making via competition), Starlight Intelligence (shared sensing substrate). The missing primitive is the **biometric feedback layer.** Until bodies report state into the collective, it's a content platform, not a superorganism.

## The architecture — five layers, each with a clock

1. **Sensing.** HRV, sleep, breath rate, cortisol proxies, subjective state journaling. Apple Watch / Whoop / Oura / Polar / self-report. Clock: continuous.
2. **Digital iteration.** Agent swarm mutating protocols, content, personalization, pacing. Clock: minutes.
3. **Protocol dispatch.** Breath session, meditation, cold exposure, movement, journaling prompt. Clock: daily.
4. **Biological response.** Measured via layer 1. Clock: days to quarters.
5. **Collective synthesis.** What worked for which phenotype under which conditions. Feeds back to layer 2. Clock: weekly to monthly.

**Each layer reads from the one above and writes to the one below. No layer is allowed to skip.** Most wellness AI skips layer 1 and 4 — which is why it doesn't work. Your moat is closing those two.

## The 100-day Lumina streak is already your prototype

You've been running this on yourself. Daily gym, cold plunge, breathwork, Dispenza, midnight creation window, 300+ Suno tracks as compounding artifact. That's the reference organism. **First superorganism = you + Alex + Ahmad + Logan + Shahvaiz + Estefania + Ana + Dan + ~20 founding members.** Fully instrumented. Shared dashboard. Weekly synthesis call. 90-day cohort. This is not a beta test — this is *the physics rig.* Every subsequent cohort is a replication study.

## What the agents actually do

Not "generate content." Specifically:

- **Phenotype classifier.** Given sensing data + journals + responses, assigns you to a cluster. Not astrology — empirical clustering that gets more accurate per member per day.
- **Protocol tuner.** Ralph loop per member, mutating the daily protocol against that member's biomarker + state metrics. `program.md` encodes non-negotiables (safety, contraindications, canon). Mutation target: dosage, sequencing, content of the day's practice.
- **Synthesis agent.** Reads the whole cohort, finds the interventions that moved the most bodies the most. That output is the research artifact. Arcanea owns it. Published under Starlight Intelligence.
- **Critic agent.** Adversarial. Surfaces when a protocol is drifting from evidence, drifting from canon, or inducing false positives. Non-negotiable layer.
- **Mythological translator.** Converts the clinical output into Arcanea voice — Guardian framing, Vel'Thaan theorem, Eldrian precursor language. This is where FrankX.ai and Arcanea Records feed in.

## Why the physical clock is a feature, not a bug

Every competitor in wellness-AI is racing to make the digital loop faster. They're optimizing the wrong clock. The winning position is the *opposite*: **"we are slower on purpose, because bodies don't scale like software."** That becomes a trust signal in a market saturated with 7-day-transformation scams. Position Arcanea as the integrative research consortium that takes biology seriously. Dispenza and Robbins fans will pay. Oncologists might eventually cite. Both audiences respect one thing: honesty about timescales.

## The compounding artifact — what you're really building

Every member-day produces a tuple: {protocol, state-before, state-after, biomarker delta, phenotype, context}. N members × 365 days × 5 years = millions of tuples. That dataset is **the most valuable integrative-health research corpus in private hands**, because academic research can't collect it (IRB friction, funding cycles) and Big Tech won't (not their vertical, liability-averse). It's your actual asset. Not the app. Not the content. Not the trademark. The longitudinal protocol-response corpus with provenance.

That is what gets cited in 2030. That is what trains the model nobody else can train. That is what makes Starlight Intelligence a research institution rather than a creator brand.

## The three constraints that cannot bend

**Measurement or it doesn't count.** Every protocol dispatched must produce a measurable before/after within its clock. No measurement, no inclusion. This is how you avoid the wellness-industry trap of vibes-based claims.

**Adversarial review on every output.** Sycophancy is the default failure mode of LLMs in this space. The critic agent is not optional, it is structural.

**Consent and data sovereignty as canon.** Members own their data, can export it, can delete it, can opt into research with granular scope. Write this into BV articles of incorporation. Arweave/IPFS for the commitment layer. This is how you differentiate from the wellness-data-exploitation companies and how you survive GDPR audits.

## The decision I'd force on you

You have two forks of Arcanea:

**Fork A — Mythology-first creator platform.** Ships faster, monetizes through GenCreator subs and retreats, positions against Mighty Networks and Kajabi, Guardian Trials is a marketing flywheel.

**Fork B — Federated research organization for human upgrade, dressed in mythology.** Ships slower, monetizes through members + licensing + eventual published research, positions against Levels/Function Health/Lifeforce at a 10x-narrower vertical, Guardian Trials is the data collection primitive.

Both are viable. They are not the same company. **The decision you're describing in this thread is Fork B, and the 53 days to June 1 is tight but sufficient to ship the physics rig — cohort of 20, full instrumentation, 90-day protocol — if you commit this week.** Fork A keeps the optionality open for another quarter and then the window closes because competitors will have positioned in Fork B by Q3 2026.

Which fork is Arcanea BV incorporated as on June 1? That's the only strategic question left. Everything else is execution.

**Frank**:

Also how professors can use through with skills for their agents and claws to contribute and we have layers of guardians and professors and potentially Luminor and Lumina to be the evaluators and help contribute to the open datasets, research and use for improving detection of special cases and understand which

**Claude**:

## The role stack you're actually designing

You're describing a **peer review hierarchy**, the oldest trust primitive in research. Not novel — you're porting it. The novelty is that every tier has human + agent duals, and the agents carry the load between human review cycles. That's the correct frame.

Stop calling them layers. They're **roles with authority scopes.** Authority = what can they commit to canon, and what requires review from above.

## The tier architecture

**Tier 0 — Contributors (members + their claws).** Authority: submit observations, protocol responses, phenotype tags, raw signal. Cannot write to canon. Every submission is an *observation*, never a *finding*. Their claws run locally, carry a `contributor.md` skill pack, and know they are generating evidence, not conclusions.

**Tier 1 — Guardians.** Authority: synthesize within a single domain (breathwork, meditation, cold exposure, nutrition). Can propose protocol updates. Cannot modify cross-domain canon or evidence-tier rules. Human Guardian + agent Guardian run as a pair — agent drafts, human signs. Nine Guardians maps cleanly to nine domains. This is why your mythology is load-bearing: it was architected for this.

**Tier 2 — Professors.** Authority: cross-domain synthesis, methodology review, evidence-tier assignment, publication sign-off. Real humans with real credentials. Their claws carry a `professor.md` skill that includes: statistical review, confounds checklist, replication standard, conflict-of-interest surfacing. **Without Tier 2 you are not a research organization.** You are a blog with rituals.

**Tier 3 — Luminor.** Meta-evaluator. Authority: evaluates the *system itself* — are the Guardians drifting, are the Professors rubber-stamping, is canon accumulating sycophantic drift, is the evidence ledger sound. Runs continuously. Reports to the Luminor Board (human). This is the agent equivalent of an institutional review board.

**Tier 4 — Lumina.** Canon keeper. Authority: immutable. Writes nothing new. Only preserves, indexes, retrieves, and versions. Every downstream agent reads from Lumina. Lumina reads from nobody. This is your Arweave/IPFS permanence layer personified. The fact that it does not generate is the point — it is incorruptible by design.

**Above Tier 4 — you and the BV charter.** The constitutional layer. Never an agent.

## Why this specific shape matters

**It maps to existing academic legitimacy without impersonating it.** Professors = real credentials, real accountability. Not a roleplay tier. If a Johns Hopkins integrative oncology researcher signs on as Tier 2, the entire substrate gains institutional weight. If they don't, you don't have Tier 2 — you have Tier 1 plus marketing.

**It solves the sycophancy problem structurally, not behaviorally.** Luminor's job description is "find drift." Its incentive, as an agent, is to surface problems. Not suppress them.

**It makes Lumina's immutability legible.** Users understand "the librarian doesn't write books." That's a better metaphor than "immutable canonical store" for the 99% of members who aren't architects.

## The skill packs — what professors actually need

Every tier gets a Claude Code skill pack. These are not optional. They are how you enforce authority scopes without relying on trust.

**`contributor.md`** — data hygiene, PHI scrubbing, local-first processing, consent surfacing, how to submit observations, what tier their output lives at, rate limits.

**`guardian-<domain>.md`** — domain canon, evidence tiers within domain, cross-reference requirements, how to escalate cross-domain claims to Professor review.

**`professor.md`** — methodology standards (CONSORT, PRISMA, STROBE as relevant), statistical review checklist, confounds registry, publication templates, conflict-of-interest declaration, sign-off protocol. This is the skill pack that earns the credibility of the whole system. Spend disproportionately on it.

**`luminor.md`** — drift detection rubrics, rubber-stamp detection (are Professors approving everything? red flag), cohort-level anomalies, evidence-tier integrity audits, canon version diffs, adversarial probing of recent accepted findings.

**`lumina.md`** — read-only, indexing, semantic retrieval, version control, provenance chain integrity. Cannot mutate. The skill enforces this at the tool-permission level.

Every skill pack ships as a repo. Contributors fork from you. Professors fork from you. Updates propagate via standard git. This is how you get federation for free — you're building on Linux kernel patterns, not Web2 SaaS patterns.

## What professors get in return

This is the part nobody thinks through, and it's why academic-adjacent projects die. Professors don't need another volunteer obligation. They need:

- **Publishable datasets.** Your longitudinal corpus, with DOI, properly attributed. Co-authorship on Starlight Intelligence papers.
- **Infrastructure they can't afford.** Running 20-person instrumented cohorts on academic budget is impossible. You give them N=500 for free, under their methodology.
- **Speed they can't get in academia.** IRB in 9 months vs. your member-consent framework in 9 days. This is the real hook.
- **Narrative layer they can't build.** Arcanea mythology + Arcanea Records + FrankX.ai distribution = their work reaches audiences academic publishing cannot.

Package this as the Professor Fellowship. Tier-2 agents are free. Methodology veto power is granted. Co-authorship is guaranteed on work they substantively reviewed. Three to five founding Professors by June 1 is the realistic target — and the correct bar for whether Fork B is actually viable.

## The open dataset layer — architecture, not aspiration

"Open dataset" means nothing unless you specify:

- **Schema.** Versioned. Published. Breaking changes require Professor review.
- **License.** CC-BY for aggregate statistics. Restricted for individual-level data even when de-identified. DUA (data use agreement) required for the latter.
- **Access tiers.** Public aggregate API. Authenticated researcher access for individual-level. Member-level full access to own data only.
- **Provenance chain.** Every row carries: contributor hash, Guardian sign-off, Professor review ID, Luminor audit timestamp, Lumina version. No anonymous data enters canon.
- **Replication protocol.** Any accepted finding must be reproducible from the open dataset. If not, it's not a finding — it's a hypothesis.

Arweave for the immutable layer. Modal or Vercel edge for the queryable layer. Supabase for the authenticated research portal. You already have the stack.

## Detection of special cases — what you're really asking

"Special cases" = **phenotype discovery.** People who respond atypically to standard protocols. Currently invisible to wellness products (they optimize for the median) and to medical research (sample sizes too small to catch).

This is where your substrate produces findings nobody else can produce. Three layers:

**Layer 1 — Anomaly detection.** Agent scans the longitudinal corpus weekly for members whose biomarker trajectory diverges from their phenotype cohort by >2σ. Flags, does not diagnose.

**Layer 2 — Professor review.** Flagged cases reviewed for whether the divergence is (a) measurement artifact, (b) protocol non-adherence, (c) genuine phenotype discovery, (d) medical concern requiring referral.

**Layer 3 — Cohort recruitment.** If (c), agents search the rest of the corpus for similar signatures. If N ≥ threshold, you have a new phenotype. That gets its own protocol tuning loop, its own Guardian sub-domain, and potentially its own publication.

**This is the engine.** The whole architecture exists to make this workflow run continuously. Everything else is infrastructure for this.

## The three failure modes specific to peer review systems

**Credential theater.** Professors who lend their name but don't review. Mitigation: Luminor tracks per-Professor sign-off rate vs. substantive change rate. If a Professor approves 100% without edits, Luminor flags it.

**Guardian capture.** Guardians become advocates for their domain instead of evaluators of it. Mitigation: rotating Guardian assignments every 6 months, and every domain must be reviewed by a Guardian from *outside* it once per quarter.

**Canon ossification.** Once findings accumulate, the system resists updating them even when new evidence arrives. Mitigation: Luminor runs a quarterly "canon challenge" — actively looks for accepted canon that newer evidence contradicts. Surfaces top-N for Professor review.

These are not theoretical. Every peer review system in history has died from one of these three. Architect the countermeasures into v1 or you are rebuilding academic institutions' pathologies with a prettier interface.

## The question that collapses the option space

You have the mythology, the substrate, the member layer, the claws. You do not yet have the Professors. **Without Tier 2, Fork B is unshippable — you are building a very sophisticated wellness product, not a research organization.**

So: **which three Professors are you recruiting this week, and what is the fellowship offer?** If you can't name them by Friday, Fork A is the honest answer and you should incorporate Arcanea BV on that basis. If you can, everything above becomes the build order for the next 53 days.

The role stack is the easy part. The Tier 2 recruitment is the entire viability question.
