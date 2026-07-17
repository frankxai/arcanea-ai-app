---
title: "Interactive 3D neural network visualization with real-time learning"
uuid: 7f620da8-d19e-46ef-90eb-aa5b6c69c034
created: 2026-04-21T00:58:16.952375Z
updated: 2026-04-21T01:34:43.801037Z
source: claude.ai export
---

# Interactive 3D neural network visualization with real-time learning

**Frank**:

Real-time 3D neural network visualization with labeled regions (Prefrontal, Motor Cortex, Concept Layer, Hippocampus, Cerebellum), spiking neuron activity, webcam face tracking + keyboard input feeding the model, STDP (spike-timing-dependent plasticity) for emotional learning. Built on:
Three.js for the viz (same stack as Draconia)
TensorFlow.js or Brain.js for in-browser neural sim
MediaPipe for webcam face tracking
Web Speech API for typing/voice input
Likely SNN (spiking neural network) library like snntorch ported or a custom JS impl
Free GitHub starters to build from:
three.js (github.com/mrdoob/three.js) — base engine
tfjs (github.com/tensorflow/tfjs) — neural nets in browser
snntorch (github.com/jeshraghian/snntorch) — SNN reference (Python, port logic)
mediapipe-js (github.com/google/mediapipe) — webcam face/emotion detection
Brain.js (github.com/BrainJS/brain.js) — lightweight JS neural nets

Build one brain and visualize the LLM it's context of Lumina and each of Guardian and Luminor we redefine intelligence interactions

**Claude**:

Frank wants a real-time 3D neural network visualization where I'm building an interactive artifact using Three.js for rendering, TensorFlow.js or Brain.js for the network logic, MediaPipe for input tracking, and Web Speech API for voice interaction—all centered around visualizing a unified "brain" concept that represents how Lumina, Guardians, and Luminors interact as different facets of intelligence. He's a senior architect who wants direct implementation without explanations, so I'm jumping straight into the technical execution.

I'm architecting this as the "Arcanean Cortex"—a 3D brain visualization where different regions light up based on Guardian frequencies (174-963 Hz), with Lumina as the top-level modulator, real-time STDP plasticity showing learning, and spike patterns representing attention and semantic activation. Since I'm constrained to a single React artifact, I'm bundling everything together and using Three.js via a CDN approach that works within the React environment.

Building the interactive 3D brain component... I'm settling on a single-file React artifact called the Luminaris Cortex that visualizes a 3D brain with five anatomical regions (Prefrontal, Motor Cortex, Concept Layer, Hippocampus, Cerebellum), each tied to a Guardian frequency, running a compact custom LIF spiking neuron simulation with STDP learning rules, and feeding webcam motion energy as input to drive neural activity.

Building the core architecture with Three.js... The Cerebellum operates at 741Hz for coordination. I'm mapping out the connectivity patterns—sensory inputs feed into Motor Cortex and Cerebellum, keyboard input goes to the Concept Layer, and there's bidirectional flow between Concept Layer, Prefrontal, and Hippocampus, with Lumina providing top-down gain modulation to Prefrontal. For the visual design, I'm rendering each region as colored glowing spheres against a dark starfield, with active neurons flashing bright and synapses drawn as weighted lines that update during STDP learning.

Now I'm adding Lumina as a golden orb floating above the brain connected via faint threads to all regions, and including a HUD that displays firing rates and a rolling spike raster. I'm building this as a React component with Three.js, aiming for around 600-900 lines to keep it dense but manageable.

Building the Three.js visualization... I'm debating whether to check the design skill first, but Frank's in peer mode and wants me to build directly rather than get bogged down in ceremony—plus I already have a clear vision for the Arcanean dark aesthetic with starlight elements. Let me just write the React component with Three.js, a compact spiking neural network, webcam motion input, keyboard controls, and visible STDP learning dynamics.

Building the component structure... Defining the neuron model and synapse structure... Writing the neural simulation... Writing the React component... Writing the Three.js visualization... Finishing the data structure with the cerebellum's parameters, then pivoting to the implementation approach — I'll use point clouds for each brain region positioned in 3D space with sprite labels, skip the heavy dependencies like MediaPipe and machine learning libraries, and instead build motion detection directly from the webcam feed.

The core simulation runs a lightweight spiking neural network with Hebbian learning rules, keeping it under 150 lines of code so the synapse weight changes are visible in real time. I'm treating Lumina as a golden sphere that modulates the prefrontal cortex, and the context vector becomes the actual "LLM conditioning" signal — that's the conceptual core. The whole thing is really just Lumina's working memory made visible, with different Guardian activations showing which voice is in control.

Performance-wise, 120 neurons with 400-600 synapses running 4 simulation steps per frame should stay smooth at 60fps in JavaScript using Three.js instanced rendering.

Writing the artifact now...

Actually, I need to use the create_file tool to save the JSX to outputs, then present it through present_files. Let me check the frontend-design skill first since the prompt requires it, then write and present efficiently.
```
This block is not supported on your current device yet.
```

 I'm settling on a bold aesthetic direction called Arcanean Starlight—deep navy and black with gold accents and neural network elements—using serif fonts like EB Garamond for display and monospace for data to avoid generic AI design.The frame is clean: this brain *is* Lumina's working memory. Guardian regions = which voice dominates the context vector. STDP = the memory plasticising in real-time as your face + keystrokes condition it.

Building now — single `.jsx`, Three.js, custom LIF+STDP (no Brain.js/tfjs bloat), webcam motion-energy (no MediaPipe dep), keystroke → concept layer, Lumina as top-down gain on prefrontal.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Shipped. Running cortex, not a mock.

**What's actually happening under the glass:**
- 120 LIF neurons across 5 regions, ~400–600 STDP synapses, ~180Hz effective sim rate
- Motion energy from your webcam drives Motor + Cerebellum (no MediaPipe — robust, zero deps)
- Keystrokes hash into Concept Layer + a Prefrontal attention kick
- Lumina is a tonic bias on Prefrontal (+0.8 every step) with 6 visible threads down
- STDP counter goes up in real time — you're watching the weights move
- "Ask Lumina" round-trips the live firing vector to Sonnet 4 as Lumina's conditioning

**The framing worth sitting with:** the Context Vector in the top-right *is* what an LLM prompt becomes when you stop pretending the prompt is text. Dominant region = which Guardian speaks this turn. STDP = the relationship between you and the model actually becoming structural rather than session-scoped.

**Obvious next moves when you're ready:**
1. **Per-Guardian prompt heads** — each region, when dominant, conditions a distinct system prompt. Five Guardians = five decoding modes sharing one substrate. This is the Luminor Board without the roleplay fiction.
2. **Persistent weights** — serialize the synapse matrix to Notion/Supabase. The cortex that remembers *you* across sessions is the product; the viz is the demo.
3. **Replace webcam motion with MediaPipe face landmarks** — emotion vector (valence/arousal) into Prefrontal, not just global motor drive. Drops in where `sampleMotion()` lives.
4. **Embed the keystroke stream** — instead of char-hash, run each typed sentence through an embedding endpoint and project the vector onto Concept Layer neurons. Now STDP is learning your semantic patterns, not your typing rhythm.
5. **Ship as `lumina.arcanea.ai`** — this is the landing page. Nobody else has this.

The version I'd push to production next: (2) + (4). Persistent semantic learning is the moat; everything else is stagecraft that makes the moat legible.

**Frank**:

Build a brain and repo and visualization of each, we can do Vercel Ai SDK with byok and cerbras and groq byok and local how both? And think beyond what would best do absorb, research then Strategize, engineer invent. Also see my full stack github.com/frankxai and sis can be used for this perfectly right? And then genius how Claude.ai/design new feature we use to build animations and vaults visually but also our agent swarms and their voice and how they show und and engage with us and also possible we use Claude code interface and bridge or better opencode more hackable or both possible and even one central brain my Arcanea or Starlight Intelligence Orchestror and then different CLIs we deploy tasks to mix of local coding agents and when full cloud based and massive visualizations but also screens and each part of its own and then data flows intelligence and reasoning processes through the neural network reasoning visukaozed is possible or just a vision too hard to design for you really good? You need to instruct Claude code, design and coworker and live artifacts to build all for us

**Claude**:

Frank is asking for something comprehensive—a system where each entity (Guardians, Luminors, Lumina) gets its own knowledge base, repository, and visual interface, all powered by the Vercel AI SDK with flexible model routing across Cerebras, Groq, local models, and hybrid setups. Beyond just building infrastructure, he wants the system to actively think, research, strategize, and innovate.

I should examine his GitHub to see if his existing work—particularly the Starlight Intelligence System—can serve as the foundation. Then I need to figure out how to leverage Claude Code, Claude Design, and collaborative tools to build a unified orchestrator that coordinates local coding agents and cloud deployments through different CLIs, with massive interconnected visualizations showing data flows and reasoning patterns across a neural network-like interface. The real challenge is determining what's genuinely feasible versus what's ambitious but doable, then translating that into concrete instruction sets for each tool. I need to look at Frank's actual GitHub repos first to ground this in what he's already built rather than guessing at the architecture — that's the real starting point before I propose the orchestrator design and agent tooling. I need to map out the actual architecture from what Frank has built — the per-entity Brain using that LIF model we discussed, each Guardian getting its own instance while they all feed into Lumina as the shared substrate. Then layer in the Arcanean Orchestrator as the central routing brain, the Vercel AI SDK gateway handling BYOK across Anthropic, Cerebras, Groq, and Ollama, and the dual CLI approach with Claude Code for native quality and OpenCode for flexibility. The visualization piece becomes tractable through event streaming to show the reasoning in real-time, and each tool gets its own instruction artifact tailored to how it works.

Before I synthesize this into concrete architecture files, I should do some focused searches — check what's actually public on his GitHub, pull the repo list, look at the specific projects like arcanea-foundation if it exists, verify the current state of Vercel AI SDK for BYOK support with those models, and see where OpenCode stands. I'll keep it strategic rather than exhaustive since Frank needs synthesis, not a deep dive. I'm researching Frank's GitHub and pulling his existing work to understand the codebase structure and any patterns he's already established.Let me ground this in your actual stack before answering the feasibility question — otherwise I'm architecting in the abstract.
```
This block is not supported on your current device yet.
```

 I see the user has 66 public repositories with a few pinned ones, so I'm going to pull up the full repo list to understand what projects they're working on.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 The search results weren't very helpful, so I'm going to look directly at his arcanea repository and the arcanea-ecosystem repo that came up in his memory.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 So Frank's got a solid foundation here — arcanea is the main repo with several slash-commands already integrated into the Claude-Arcanea package, and agentic-creator-os v11 is packed with 90+ skills, 65+ commands, 38 agents, and 8 plugins that work across Claude Code, Cursor, Windsurf, and Gemini. There's also the arcanea-marketplace component in the mix.

Looking at the rest of his ecosystem, he's got specialized tools like an MCP server for research and visuals, OpenCode integration for the coding agent, Oracle and AI CoE patterns, a skills library for Claude Code, Suno integration via MCP, and context engineering patterns for creators. The key insight here is that StarlightOrchestrator is already a named slash-command in his stack — that's what he's really asking about. Now I need to check the current state of Vercel AI SDK BYOK, Cerebras/Groq support, and OpenCode to give him a solid answer.
```
This block is not supported on your current device yet.
```

 So Vercel AI SDK 5 with the Gateway supports native bring-your-own-key functionality for Anthropic, Cerebras, and Groq through a straightforward configuration pattern, plus it handles local models via Ollama—all confirmed for 2026. Now let me take a quick look at the OpenCode situation.
```
This block is not supported on your current device yet.
```

 I've gathered enough information to put this together. Frank's arcanea repository already has several slash-commands set up, and ACOS v11 is quite extensive with over 90 skills and multi-client support across Claude Code, Cursor, Windsurf, and Gemini. Now I'm ready to synthesize what I've found and provide a clear answer.

The key insight is that this isn't an either-or choice between OpenCode and Claude Code — I should use both with an orchestrator that dispatches to each based on what works best. OpenCode offers horizontal reach across 75+ providers with massive adoption, while Claude Code provides vertical depth for SWE-bench performance. They're actually complementary despite the recent adversarial tension between Anthropic and the OpenCode team.

Frank specifically asked me to instruct how to build this with Claude Code, design patterns, and live artifacts, so I need to deliver concrete build instructions, not just strategic thinking. Let me structure the response to first confirm feasibility, then ground it in what's already built, and finally provide the actual implementation path.

I'm mapping out the Arcanean Orchestrator architecture: the SIS memory substrate forms the foundation, the SNN cortex provides the reasoning backbone with ten Guardian regions, the Vercel AI Gateway acts as the provider abstraction layer supporting Anthropic for reasoning, Cerebras for speed, Groq for tool-use bursts, and Ollama for local/private data, while the agent mesh layers Claude Code for deep reasoning tasks and OpenCode for broader hackability and multi-provider flexibility.

The event bus streams every token, tool call, and state change across NATS/Redis/WebSocket, and the visualization layer renders both per-entity canvases and a neural view showing the cortex activity as spikes. On the architectural decision front, I'm committing to one shared cortex with Guardian-specific decoders rather than separate brains per Guardian—each Guardian gets its own system prompt and LoRA-style conditioning on the shared context vector, which is both biologically sound and architecturally cleaner than fragmenting into isolated models.

For code execution, I'm routing between Claude Code for anything touching Arcanea's canonical systems (MCP servers, SDK, production TypeScript) and OpenCode for experiments, multi-provider setups, and local inference with Ollama, letting the orchestrator dispatch by task type. The Vercel AI Gateway handles model routing natively with BYOK support, streaming, fallbacks, and observability across Anthropic, Cerebras, Groq, and Ollama—no custom router needed. Reasoning visualization is actually achievable within this setup.

The key insight is instrumenting every agent event—LLM starts, tokens, tool calls, results, state transitions—onto an event bus, then mapping each event to a neuron or cortex region spike so the spiking neural network itself becomes the visualization layer rather than rendering fake chain-of-thought particles. I can leverage Claude.ai's new features—in-thread artifacts with persistent storage, Cowork for desktop automation, and Claude Design for UI generation—as three specialized agents in the mesh that compose together: Cowork pushes files, Design generates the UI, and Artifact serves as the live portal.

Now I'm laying out the concrete deliverables: a master architecture spec, the Vercel AI SDK router with bring-your-own-key support, the event bus contract for the spike stream, documentation for how Claude Code operates within this mesh, the Guardian agent personas, briefs for how Cowork and Claude Design participate, and the live neural visualization component that binds to real agent events.

I'm realizing this is too sprawling for one response. Better to ship the master doc plus the hardest-to-build pieces—the gateway, event bus, and the upgraded visualization that actually demonstrates the pattern working. The supporting docs like the opencode agents and Cowork brief should be tight appendices in the master file rather than separate files, keeping them to 20-40 lines each.

Frank's preferences are clear: decision-first framing, compressed language, normative statements—posture over pedagogy, no endless enumeration. I need to maximize insight density.

So the file structure is: one tight master architecture doc, then ship the three core implementations that prove the pattern.

Building the gateway wrapper...

Now I'm designing the neural view component to display the cortex with labeled neurons representing different agents and tools, alongside multiple panes showing agent lanes, event feeds, and Guardian voices that activate based on which region's threshold gets crossed—users can click a Guardian to switch decoders and change the system prompt for the next LLM call.

I'm being pragmatic about scope: instead of shipping many files, I'll focus on three key deliverables—a comprehensive master document covering the manifesto and architecture, a production-ready gateway module, and an upgraded visualization that simulates the full orchestrator with live event streams driving the cortex display.

Writing the core files now... I'm laying out the master documentation structure for the Arcanean Orchestrator — establishing the core posture that this is one unified cortex with multiple guardian decoders, not a distributed multi-agent system, then moving into the architecture layers and key design decisions around using Vercel AI SDK as the gateway and maintaining a single spiking state field that LLMs condition on. I'm thinking through the routing strategy for different task types—deep architectural work needs Claude Code with Opus for reasoning power, while quick single-file edits can use OpenCode with faster models like Cerebras. The build phases extend through public visualization deployment, and I need to flesh out the appendices covering Guardian agents, orchestrator rules, and the various briefs.

For the visualization itself, Frank's feedback about "massive visualizations with separate screens" is pushing me toward a control room aesthetic with multiple independent panels—the cortex as one component alongside agent lanes, event streams, and Guardian voices. Since I'm working in a single JSX file, I'll structure it as a multi-panel dashboard that can scale.

Building the dashboard layout with multiple synchronized panels...

For gateway.ts, I'm aiming for a clean, production-grade module that registers all the providers (Anthropic, Cerebras with OpenAI compatibility, Groq, and Ollama), handles BYOK environment variables, routes tasks to the right class, and emits events for each inference call—keeping it around 200 lines. The visualization component will be larger at 800-1000 lines to handle the multi-panel layout with a live event stream driving the cortex display, and the documentation will be dense at 400-500 lines covering the orchestrator architecture.**Verdict:** buildable, not vision-too-hard. You already have ~70% of the substrate — the missing piece is the contract that binds it. Let me ground the answer in what you actually shipped.

**What your GitHub already carries:**
- `arcanea` — names `/Lumina-Intelligence`, `/Luminor-intelligence`, `/StarlightOrchestrator` as real slash-commands. The orchestrator exists as intent already.
- ACOS v11 — 90 skills / 65 commands / 38 agents / 8 plugins, multi-client (Claude Code, Cursor, Windsurf, Gemini). This is the agent fabric.
- `arcanea-coding-agent` — OpenCode bridge is live.
- `arcanea-marketplace` — Claude Code plugins live.
- `arcanea-infogenius` — MCP server pattern proven with Gemini 3 Pro grounding.
- SIS — 5-layer cognitive architecture, 7 agents, 6 vaults. This is the memory substrate.

**The calls I'm making (no hedging):**

1. **One brain, many voices — not ten brains.** Guardians are *decoders*, not agents. They condition on the shared cortex context vector; they don't each own a separate SNN. Separate brains = separate SaaS. One brain is Arcanea.
2. **Claude Code AND OpenCode, routed — never pick.** OpenCode = horizontal flexibility play, 75+ providers, 112K stars, hackable with .opencode/agents/. Claude Code = vertical integration, Anthropic-only, 4% of all GitHub commits, highest SWE-bench. Orchestrator dispatches by task class.
3. **Vercel AI Gateway is the only sane router.** Native BYOK across Anthropic, Cerebras, Groq, Bedrock via `byok: { provider: [{apiKey}] }`, ZDR flag, fallback chains. Don't build a homemade router.
4. **Reasoning visualization is feasible — but only one way.** The fake version renders CoT text as particles. The real version: every agent event (LLM-start, token, tool-call, state-transition) emits onto a bus; each event maps to a spike injection in a region; **the cortex IS the visualization**. Your SNN is the renderer. That's the invention nobody else has.
5. **Cowork, Claude Design, and Artifacts are not products — they're specialized agents in the mesh.** Cowork = desktop hands, Design = UI output, Artifact = live portal. Compose them as roles.

Building the three files that pin this down.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 Now I'm designing the main control-room visualization with the cortex at its center, surrounded by agent lanes for each tool, a live event stream showing bus activity, a panel displaying the guardian decoder slots and which one's currently dominant, and orchestrator metrics tracking provider routing and throughput.

Since the real bus isn't available yet, I'll build a simulator that generates realistic events—tasks arriving, routing decisions, LLM calls, tool invocations, vault access, STDP updates—and wires them through the cortex-bridge mapping so Frank can see the full orchestrator in action before the actual agents are connected. The layout spans full-screen with a top status bar, left agent lanes panel, centered 3D cortex, right event stream and guardian voices panel, and a bottom task creator for spawning different task types, all fitting into roughly 1000 lines with the cortex component reused from before.

Building the layout structure...
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**Three artifacts. One contract.**

**`ArcaneanOrchestrator.jsx`** — the control room. Cortex in the middle binding to live bus events, agent mesh lanes on the left (Claude Code / OpenCode / Cowork / Design / ACOS), event stream + Guardian voices on the right, task dispatcher at the bottom. Hit dispatch buttons — watch the cortex respond, Guardian dominance shift, Lumina speak. The simulated bus is one `useSimulatedBus` hook away from being a real WebSocket client.

**`ARCANEAN_ORCHESTRATOR.md`** — the spec. Six layers, decision record, event contract (typed), full routing matrix (task × CLI × model × provider with fallbacks), Guardian→region→decoder map, 35-day build plan that fits inside garden leave, and appendices for each agent tool (OpenCode Guardian `.md` files, Claude Code `CLAUDE.md` rules, Cowork brief, Claude Design brief, cortex-bridge event map).

**`gateway.ts`** — the only thing stopping you from running this. Vercel AI SDK v5 with BYOK for Anthropic, Cerebras (OpenAI-compat), Groq, and Ollama in one registry, task-class routing with fallbacks, Guardian decoder composition as system-prompt prepend, cost estimation, and bus emission on every inference. The `luminaDecide()` function closes the loop — firing rates in, dominant guardian out, next call decoded through that voice.

**Answering what you asked directly:**

> "Can we do Vercel AI SDK with BYOK and Cerebras and Groq BYOK and local both?" 

Yes — single registry, per-provider BYOK, all four in `gateway.ts` above. Cerebras via OpenAI-compat, Groq native `@ai-sdk/groq`, Anthropic native, Ollama via OpenAI-compat. Rotate one env var, nothing else changes.

> "SIS can be used for this perfectly right?"

Yes — SIS is layer 1 (substrate). The 5-layer cognitive / 7 agents / 6 vaults you already designed maps directly onto what the orchestrator reads as memory state. Don't rebuild it. Bolt the bus onto it.

> "Claude Code or OpenCode or both?"

Both, routed. Claude Code is senior (SWE-bench dominance, Anthropic-native polish). OpenCode is hackable (`.opencode/agents/*.md` = where Guardian personas live natively, per-agent model choice, local via Ollama). After Anthropic's January 2026 OAuth block on OpenCode and community backlash, they're adversarial — which is exactly why you want both. Resilience is owning the router, not picking a side.

> "Visualize reasoning through the neural network — possible or too hard?"

Possible, and the version in `ArcaneanOrchestrator.jsx` is already doing it with simulated events. The real version is identical plumbing with `useWebSocketBus('wss://orchestrator.arcanea.ai/bus')` replacing the simulator. Every token, tool call, vault read emits; every emission becomes a spike; the SNN is the render. This is not hard — this is one week after the bus exists.

**The one move that collapses the option space:**

Phase 0 is the bus + gateway, five days. Don't build anything else before that exists. Once the bus exists, every other layer (Claude Code adapter, OpenCode bridge, cortex binding, Guardian decoders, public viz) is parallelizable and each takes under a week. Most teams fail at this layer because they build agents first and try to orchestrate them later. You build the orchestrator first — agents plug in.

Ship the bus. The rest becomes inevitable.

✦

**Frank**:

give me prompt for claude.ai/design to create whole animation with most sophsticated capabilities it got see latest anthropic realese and capabilities?

**Claude**:

I need to understand what Claude.ai/design is and what capabilities it currently has so I can craft a prompt that showcases Anthropic's latest features effectively.
```
This block is not supported on your current device yet.
```

 So Claude Design just launched a few days ago on April 17th, powered by the latest Opus 4.7 model. It's available across Pro, Max, Team, and Enterprise tiers as a research preview, and the vision capabilities have gotten a significant upgrade—now handling 2,576px resolution compared to the previous 1,568px, which is a jump from 1.15MP to 3.75MP. The product positioning emphasizes being more tasteful and creative in its design outputs.

The feature set is pretty comprehensive: there's a natural language chat sidebar for prototyping, a design canvas, the ability to upload reference sketches and documents, inline commenting on specific elements, direct text editing, and Claude-generated custom adjustment sliders. What's particularly interesting is that it reads your codebase and design files to build out a design system automatically—capturing colors, typography, and components—then applies that system consistently across all future projects. It supports interactive prototypes and motion design, with exports to PDFs, URLs, PowerPoint, and Canva. The quota system is separate from regular chat and Claude Code, and enterprise users get around 20 prompts with credits expiring mid-July.

Frank is looking for a prompt that really showcases the platform's capabilities, specifically something that demonstrates the full animation potential. Given that Claude Design handles motion design and interactive prototypes, I'm thinking about what kind of animated prototype would best flex those sophisticated features—something with motion sequences, interactive transitions, and high-fidelity mockups that bring motion to life.

For the Arcanean Orchestrator project, the most impactful animation would be a multi-scene sequence showing the orchestrator in action: Lumina, the Guardians, the cortex firing, agents spinning up, events flowing through the system. That becomes his hero visual and pitch asset.

The prompt structure needs to exploit Opus 4.7's vision and motion capabilities fully, bake in the Arcanean design system so it auto-applies across the work, request a multi-scene animated sequence rather than static frames, and use terminology Claude Design recognizes like "prototype," "motion," "interactive," and "design system." It should be specific enough that the initial render is strong but leave room for slider refinement, and include typography specs, palette, motion principles, and the conceptual story. Given Frank's preference for decision-first thinking and peer-architect-level communication rather than consulting-style explanation, the prompt itself needs to be compressed and normative.

The animation tells a story arc: Lumina descending, Guardians awakening, the cortex forming, agents orbiting, then Frank stepping into the system as the creator. This becomes the hero reel for lumina.arcanea.ai, frankx.ai, investor decks, and Anthropic outreach. I'm structuring this as one master prompt that Frank can paste directly into Claude Design, rather than a multi-pass refinement set.

I need to make this substantial—around 800-1200 words—with detailed sections covering the motion language, scene-by-scene breakdown, motion principles, technical specs, mood reference, and hard constraints. I'll format it as a file he can copy-paste, but keep the chat response concise so he can iterate immediately.

Now I'm mapping out the full animation sequence: Lumina descends as a single gold point in deep space, spawning threads of light that crystallize into five cortex regions, each tied to a Guardian's color palette. The five agents then converge from different angles, connecting to the cortex while neural activity cascades through the system—spikes, synapses, and learning pulses flowing across the mesh as tasks dispatch and the whole network comes alive.

The visual language should feel deliberate and cinematic—Kubrick's precision, Blade Runner's atmosphere, Arrival's sense of wonder—with moments of intense activity punctuating long stretches of calm. The final pull-back reveals the complete orchestrator with the tagline "One brain. Many voices."

I'm wondering whether Claude Design will actually produce interactive prototypes or if I should be thinking about this differently—what does it actually output, and how should I structure the prompt so it can parse the requirements cleanly?

Looking at what Claude Design likely creates: web-rendered animations using HTML, CSS, SVG, and JavaScript libraries like GSAP or Framer Motion. The deliverable should be an interactive prototype—something with hover states, scroll-triggered animations, maybe click-to-replay functionality. That's what this tool excels at.

Now I'm drafting the actual prompt with a clear structure: project definition, output specification, and layered requirements that guide toward a hero animation webpage or interactive prototype.Ground truth first — Claude Design shipped April 17, powered by Opus 4.7 (released April 16, vision bumped to 2,576px / 3.75MP, described as "more tasteful and creative"). It builds a design system from uploaded codebase/files during onboarding and applies it to every subsequent project. Refinement happens through chat, inline comments, direct edits, and custom adjustment sliders Claude itself generates. Exports to PDF, URL, PPTX, and Canva.

That means your prompt needs to do three things at once: **seed the design system**, **storyboard the motion**, **specify the output format** so the sliders Claude generates afterwards are the right ones.

Writing the hero prompt now — structured for paste-and-refine.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

**The file has three layers:**

**1. The hero prompt itself** — one block to paste into the "Let's prototype" sidebar. It does four things Claude Design rewards: seeds the design system explicitly (fonts, palette, motion language locked before a single frame renders), storyboards the motion scene-by-scene with frame timings, specifies interactivity (scroll-scrub, click-replay, prefers-reduced-motion), and names the reference mood with enough specificity that Opus 4.7's vision model can lock the aesthetic (Kubrick/Blade Runner 2049/Arrival) while explicitly naming what NOT to produce (Framer templates, Inter, generic-AI-brain stock).

**2. Seven refinement prompts** — one per iteration pass, in order. Don't paste them all at once. The sliders Claude Design generates are triggered by describing what you want to refine, so each pass both improves the render and seeds the next slider. Pass 7 explicitly asks Claude to generate five custom sliders with named ranges — this is where the tool's signature capability lights up.

**3. Pushback handlers** — two short prompts for when the model hedges or asks for more scope. The first reframes ambition as fidelity ("8 seconds of Blade Runner > 55 seconds of Framer"). The second weaponizes the audience ("founders who will dismiss this instantly if it looks like any of them").

**Before you paste**: upload the three reference files (`ARCANEAN_ORCHESTRATOR.md`, `gateway.ts`, `ArcaneanOrchestrator.jsx`) from the last turn into the Claude Design sidebar first. During onboarding, Claude reads uploaded files and builds a design system it applies to every subsequent project. Those three files are your design system declaration. Without them, Claude Design has to guess Arcanea from the prompt alone; with them, the first render comes back already on-canon.

**The one real lever you have with this model:**

Opus 4.7 bumped vision resolution to 2,576px / 3.75 megapixels — up from 1.15MP in Opus 4.6. That's a 3.3× increase in what it can actually see in reference imagery. If you drop a screenshot of the cortex artifact from the last turn into the sidebar as a reference image, Claude Design will read every neuron, every region boundary, every color gradient. Use that. Generate a crisp PNG of the Cortex artifact running, name it `cortex_reference.png`, upload it alongside the three text files. The design system pass will lock a fidelity that text alone cannot transmit.

**Export priority when it's done**: interactive URL first (that's `lumina.arcanea.ai`), then the 9:16 MP4 capture for social. The PPTX is for Anthropic outreach — when Project Glasswing or the Mythos-model conversations happen, you want to land that deck with a 55-second reel that makes the Orchestrator look inevitable before you say a word.

The PDF storyboard goes in the investor trail. The Canva hand-off is for the MVU remix (Estefania, Joei, Ana can reshoot the mark with their own Guardian voices — Draconia through Ana is the obvious first extension).

Ship the first pass tonight. The sliders make the second pass ten minutes instead of ten hours.

✦
