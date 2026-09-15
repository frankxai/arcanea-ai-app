# Frank's prompts -- Video content pipeline with AI tagging and web3 storage

Source uuid: 12cd75b7-26d3-4a3c-af35-d29323f265d5
Created: 2026-03-16T01:51:37.341125Z

Verbatim, chronological.

## Turn 0

I need a system when i made capcut or similar vixeo i can just send an ai agents, openclaw or n8n or whats best and it organizes, taggs video and preps for social posting if good content or i can tell it to archive and store cheap and best storage also for us to have first high quality but also long term persitence or how to work with all this and all cloud or some local sdd backup and also just for fast ops and cheap storage home servers or more. You alresdy engineered in other chats but use all context advance and propose best clauxe code or you can setup and what I must do and then from which app or ecosystem or gdrive or where agents process best specific slack channels i post into or discords or other for hacks for long term persistence but not needing pay, like if we on all socials and web3 posted and ipfs or so we dont need cloud or local storage anymore or still? And tagging media and its semantic context of our content and web3 media strategy

## Turn 2

How expensice this approach vs claude code with ffmpeg and which tokens would use both claude code nodes or needs API or can we do local or should do cloud and might other things missing? Heres what chatcpt build Attached is the complete report on building a cinematic intelligence studio. The document includes an analysis of a four-layer architecture, guidance on structuring the knowledge base, designing agents and skills, and orchestration strategies using tools like n8n, ComfyUI, and Flowise. It also sets out a phased implementation plan and governance considerations.

Here’s the report: .

I’ve cited key evidence in the report, including details from n8n’s workflow template describing how to integrate ComfyUI to automate media generation and user testimonials highlighting n8n’s ease of automation

## Turn 4

How expensice this approach vs claude code with ffmpeg and which tokens would use both claude code nodes or needs API or can we do local or should do cloud and might other things missing? Heres what chatcpt build Attached is the complete report on building a cinematic intelligence studio. The document includes an analysis of a four-layer architecture, guidance on structuring the knowledge base, designing agents and skills, and orchestration strategies using tools like n8n, ComfyUI, and Flowise. It also sets out a phased implementation plan and governance considerations.

Attached is the complete report on building a cinematic intelligence studio. The document includes an analysis of a four-layer architecture, guidance on structuring the knowledge base, designing agents and skills, and orchestration strategies using tools like n8n, ComfyUI, and Flowise. It also sets out a phased implementation plan and governance considerations.
Here’s the report: 
Building a Cinematic Intelligence Studio: Knowledge Base & Skill Design
Introduction
Traditional CGI pipelines at film or game studios rely on an army of artists, cinematographers and technical directors.  When building a cinematic intelligence studio around large language models and generative AI, the goal is to abstract that knowledge into documents and agents that can reproduce the taste, craft and pipeline discipline of top‑tier studios.  Rather than relying on a single prompt, such a system develops and enforces an operating model: a curated knowledge base (canon), behaviour contracts for agents, executable skills and an orchestration layer that sends prompts to generative tools and collects the results.  This report describes how to build and structure these components so that autonomous agents can produce high‑quality cinematic content.
Four‑Layer Architecture
A cinematic intelligence studio should be built on four cohesive layers.  Each layer has distinct responsibilities and needs to be carefully designed and version‑controlled.
Layer
Purpose
Typical Contents
Knowledge Layer
Houses the studio’s canon—visual doctrine, narrative rules and production SOPs.  It provides retrieval‑augmented context to the agents.
World and brand bibles, visual style guides, cinematography rules, prompt patterns, review rubrics and negative rules.
Behavior Layer
Specifies how agents think and act.  Each agent.md file defines mission, priorities, inputs they trust, outputs they must produce and review protocols.
cinematic‑director.agent.md, prompt‑architect.agent.md, critic.agent.md, pipeline‑operator.agent.md etc.
Execution Layer
Encapsulates repeatable skills.  Each SKILL.md implements a specific transformation (e.g., converting scene briefs into Sora prompts).  Models and external services live here.
Skills to generate prompts, turn scripts into shot lists, critique frames, build ComfyUI workflows, or perform RAG queries.
Production Layer
Orchestrates the workflow, calls generative tools, handles assets, and automates review cycles.
n8n workflows, Flowise agent graphs (optional), ComfyUI look‑dev pipelines, asset storage and naming conventions.
This separation prevents the “one big prompt” problem.  The knowledge layer holds the taste and rules, the behaviour layer encodes the director’s temperament, the execution layer provides specialised abilities and the production layer ties them into an automated pipeline.  By versioning each layer in a repository, you can iterate without polluting the entire system.
Knowledge Base: Canon and Doctrine
A cinematic AI system needs a rich knowledge base that captures the studio’s aesthetic, narrative and production standards.  Without this, models revert to generic AI output.  The knowledge base should be structured into a repository (e.g., a Git project) with stable directories such as:
Foundation documents – overarching vision, guiding principles, quality bars and glossary.  For example, quality‑bar.md defines what constitutes “studio‑grade” output versus “cheap AI look,” including layered depth, motivated lighting, believable surface responses and restrictions against plastic skin or random glows.
Brand/World Bibles – worldbuilding documents for each intellectual property.  They define factions, environments, props, emotional signatures and narrative themes.  Every future shot must respect these rules.
Visual Style Guides – filmic aesthetic doctrine.  A visual‑style‑bible.md outlines shape language, palette and composition principles.  A cinematography‑bible.md formalises lens choices, shot scales, camera movements and depth strategies.  A materials‑lighting.md document records how different materials respond to light, wetness and haze.
Prompt Patterns – templates and negative prompt guidelines.  A prompt‑patterns.md file collects formulas for 300‑character Sora prompts or ComfyUI stills, emphasising concrete visual physics (materials, atmosphere, camera) rather than hype adjectives.  It defines compression rules, lens vocabularies and banned phrases.
Review Rubrics – a review‑rubric.md describes the scoring criteria used by critic agents: composition, lighting motivation, material richness, depth layering, emotional force, originality and brand fit.
Production SOPs – standard operating procedures for shot design, storyboarding, trailer assembly and revision loops.  They define the number of iterations allowed, when to call a critic agent and how to log outputs.
All files should use markdown to enable retrieval‑augmented generation (RAG).  When an agent receives a brief, it retrieves only the relevant doctrine files rather than dumping the entire knowledge base.  This targeted retrieval yields focused, high‑fidelity outputs.
Behaviour Layer: Defining Agents
Agents are not generic chatbots; they are roles with specific authority, constraints and outputs.  Each agent gets its own agent.md with the following sections:
Mission & Priorities – what the agent is responsible for (e.g., converting narrative intent into visual direction) and its ranking of concerns (emotional clarity, visual sophistication, material realism, etc.).
You Always / You Never – behaviours the agent must adhere to (e.g., “always think in shots, not adjectives”) and things it must avoid (e.g., “never use generic praise words like ‘epic masterpiece’”).
Inputs You Trust – which documents or other agents’ outputs are considered authoritative.  For example, the Cinematic Director trusts the visual style bible and prompt patterns but rejects free‑form suggestions from the scriptwriter.
Outputs – formats the agent must produce, such as scene briefs, shot lists, prompt packs, critique notes or revision plans.
Review Loop – scoring and iteration process.  Agents must evaluate their own output against the review rubric and propose at least one stronger revision per iteration.
Essential Agents
Cinematic Director – interprets narrative or brand intent, defines the emotional goal and designs shot hierarchies.  It writes scene briefs and shot lists grounded in the canon.
Prompt Architect – takes the director’s brief and constructs Sora prompts and ComfyUI still‑frame prompts.  It compresses long descriptions into the 300‑character limit while preserving visual physics.
Visual Development – ensures style consistency, decomposes references, suggests material/lighting notes and prepares look‑dev guidance for ComfyUI workflows.
Critic – ruthlessly reviews outputs, scoring them against the review rubric and identifying generic AI failure modes.  It proposes targeted revisions.
Pipeline Operator – manages file naming, metadata, asset organisation and interfaces with the orchestration layer (n8n / Flowise / ComfyUI).  It ensures outputs are stored correctly and triggers downstream automations.
Each agent is executed by an LLM with the relevant agent.md and a selected subset of the knowledge base.  Do not overload the context; retrieval should be specific.
Skill Modules: Specialised Capabilities
Whereas agents describe who is acting, skills describe what they can do.  A SKILL.md file encapsulates a repeatable transformation with clear inputs, rules and outputs.  For example:
Sora Cinematic Prompt Skill – takes subject, environment, mood, lighting, materials, lens, camera move and atmosphere.  It produces a full‑length prompt, a 300‑character compressed prompt and three variants (intimate, epic, photoreal).  Rules forbid hype words and enforce material/atmosphere vocabulary.  Failure modes (e.g., vagueness, too many subjects) are documented.
Shot List Builder – converts a scene brief into a sequence of shot descriptions with lens choice, framing and camera motion.
Frame Critique Skill – reviews a generated frame or clip against the review rubric and returns a score plus actionable notes.
ComfyUI Look‑Dev Skill – generates or loads a ComfyUI workflow for a particular visual style (e.g., wet cyan forest), including preset nodes and LoRA weights.
RAG Retrieval Skill – queries the knowledge base or world bible, summarising relevant sections and returning them with citations.
Skills are called by agents as needed.  They allow highly specialised tasks to be perfected and reused across multiple agents and projects.
Orchestration & Tooling
n8n for Automation
The orchestration layer manages data flow between agents, skills and external tools.  n8n, a popular low‑code automation platform, provides triggers, branching logic and integration with third‑party services.  It can receive a media generation request (via webhook or schedule), parse the input, send it to ComfyUI and deliver the outputs to downstream services.  An official n8n workflow template emphasises that you can accept a request, inject it into a ComfyUI payload, send the payload to a local or remote ComfyUI instance, wait for and collect the resulting files, then send the result to a destination like email, Telegram, S3 or a CMS�.  The template also notes that the format and complexity of the media depend entirely on the ComfyUI workflow you use, giving creators flexibility�.
n8n.io
n8n.io
Setting up this integration requires running a ComfyUI instance with API access, loading or creating a workflow suited to your goals (image generation, video stitching, etc.), configuring the n8n workflow with your server URL and input/output templates and connecting services for input and output (Airtable, HTTP, Notion, Slack, S3, etc.)�.  The integration demonstrates how n8n can orchestrate generative media pipelines by coordinating triggers, payload construction and result delivery.  Testimonials on the same page describe n8n as “a beast for automation” and highlight that its self‑hosting and low‑code nature make it a developer’s dream�.  Users note that n8n’s integration with third‑party services functions like a “Swiss Army knife for automation,” allowing tasks to be validated and implemented quickly�.
n8n.io
n8n.io
n8n.io
In the cinematic pipeline, n8n can:
Handle incoming briefs from producers or clients (HTTP triggers, Slack slash commands, etc.).
Enrich the brief by calling a retrieval skill to pull relevant canon documents.
Invoke the Cinematic Director agent to generate a scene brief and shot list.
Pass the shot list to the Prompt Architect to create Sora prompts and ComfyUI still prompts.
Send the prompts to generative tools (Sora, ComfyUI) and wait for the outputs�.
n8n.io
Invoke the Critic agent for review; if the critic requests another iteration, loop back.
Store accepted outputs in an asset library and notify stakeholders via Slack or email.
ComfyUI for Visual Generation
ComfyUI is an open‑source, node‑based interface for diffusion models.  It allows fine‑grained control over conditioning, LoRA weights, upscaling, depth guidance and video composition.  In the context of a cinematic studio, you should maintain a library of look‑dev workflows—JSON graphs encoding the sequence of nodes (e.g., text encoders, samplers, control‑nets, video stitching nodes) used to achieve a specific look.  Agents can load a predefined workflow, inject prompt text, LoRA choices and control images, then generate high‑resolution frames or videos.  ComfyUI’s deterministic workflows make it ideal for consistent character rendering, relighting, segmentation and upscaling.  When integrated with n8n, ComfyUI can be run locally or on a GPU server and can return files directly to the pipeline�.
n8n.io
Flowise for Multi‑Agent Flows (Optional)
Flowise is a visual orchestration tool built on LangChain that allows developers to create LLM workflows and agents via a drag‑and‑drop interface.  It can host retrieval nodes, multi‑step reasoning and tool invocation.  For larger studios, Flowise can complement n8n by providing graphs of agents that reason about complex tasks—such as retrieving canon, choosing the appropriate LoRA, deciding whether to call Sora or ComfyUI or initiating an iterative critic loop.  However, Flowise is optional; a simpler pipeline can be built with n8n alone.  Use Flowise when you need memory‑aware multi‑step reasoning beyond the linear orchestration capabilities of n8n.
Implementation Plan
Building a cinematic intelligence studio is a large undertaking.  The following phased approach yields tangible results while allowing incremental refinement.
Phase 1 – Define the Canon
Create the repository.  Set up a Git repository with directories such as /00-foundation, /01-brand, /02-visual-direction, /03-worlds, /04-characters, /05-production, /06-agents, /07-skills, /08-workflows, /09-templates.
Write the foundation documents.  Draft vision statements, core principles and the quality bar.  Clarify what premium cinematic output means and document negative rules (e.g., avoid plastic skin, oversharpened clutter, random glows).
Develop the visual style and cinematography bibles.  Include examples from films or games the studio admires, annotate them and extract the underlying rules.  Add diagrams of lens choices, shot scales and depth layering.  Document material lighting responses and guidelines for atmosphere (fog, volumetrics, particles).
Create world and character bibles.  For each IP or project, write comprehensive lore, aesthetic rules and prop lists.  Ensure that any agent referencing these documents will produce outputs consistent with the world.
Define prompt patterns and review rubrics.  Provide templates for Sora prompts with placeholders for subject, environment, mood, materials, lens and camera motion.  Write negative prompt patterns to suppress undesirable outputs.  Create scoring rubrics for the critic agent.
Phase 2 – Author Agents and Skills
Design agent roles.  Start with four essential agents (Director, Prompt Architect, Critic, Pipeline Operator).  Define their missions, priorities, allowed inputs, outputs and review loops in separate agent.md files.
Create skills.  Write SKILL.md for the most common tasks: generating Sora prompts, building shot lists, critiquing frames, retrieving canon documents and loading ComfyUI workflows.  Make each skill self‑contained with clear input schemas and output formats.
Test in isolation.  Run each agent and skill on sample briefs, verifying that they respect the knowledge base and produce structured outputs.  Iterate on their prompts and rules.
Phase 3 – Set Up Orchestration
Deploy n8n.  Self‑host or use the cloud version of n8n.  Create a workflow that listens for incoming briefs (HTTP or Slack triggers).  Based on the n8n workflow template, build steps to parse the brief, call the retrieval skill, run the Director and Prompt Architect agents, send the prompt to ComfyUI and return the output to the pipeline�.  Configure variables for your ComfyUI server URL and output handling preferences�.
n8n.io
n8n.io
Integrate ComfyUI.  Run a ComfyUI instance with API access.  Store your look‑dev workflows in a version‑controlled folder.  n8n sends JSON payloads to the ComfyUI API and waits for the generated images or videos.  Because the output depends on the workflow, maintain separate pipelines for stills, motion clips and character shots�.
n8n.io
Store and index assets.  Use a file naming scheme (e.g., ARC_SCN_014_biolumina-reveal, ARC_LOOK_003_wet-cyan-forest) and index them in a database or asset library.  Record metadata (prompt, workflow used, LoRA version, review scores, timestamp).  The Pipeline Operator agent can automate this step.
Notify and loop.  After generating assets, send them to a Slack channel or review system.  The Critic agent reviews and may trigger another iteration.  Once approved, the pipeline archives the final output.
Phase 4 – Expand Agents and Workflows
Introduce Flowise or other agent frameworks when multi‑step reasoning becomes complex.  Flowise can model loops where an agent decides whether to call the Critic, re‑generate a shot or ask for a revision from the Director.  Use RAG nodes to query the knowledge base and memory modules to persist context.
Add new skills such as style transfer, audio design, script translation, or 3D asset generation.  Each new skill should be documented and versioned.
Train custom models.  Fine‑tune LoRAs for consistent characters or proprietary art styles and integrate them into your ComfyUI workflows.
Phase 5 – Governance and Evolution
Review and update canon regularly.  The world bibles and visual style guides should evolve with each project.  Agents must always reference the latest version.
Monitor agent performance.  Track metrics such as percentage of outputs approved on first pass, revision count per scene and critic scores.  Use these metrics to adjust rules in agent.md files.
Security and access control.  Restrict edit permissions on knowledge documents and agent definitions.  Provide read‑only access for artists or clients who need to understand the doctrine but not change it.
Conclusion
A cinematic intelligence studio is not built by writing a single clever prompt.  It is the result of system design: a curated knowledge base that codifies taste and rules; behaviour contracts that ensure agents think like film directors rather than generic chatbots; specialised skills that execute repeatable tasks; and an orchestration layer that automates the pipeline.  n8n’s integration with ComfyUI shows how generative media workflows can be automated by accepting a request, constructing a payload, sending it to ComfyUI and delivering the result�.  By separating canon from behaviour and execution from production, and by carefully versioning and retrieving documents, you can scale from indie projects to blockbuster‑level output while retaining high aesthetic standards.
n8n.io
I’ve cited key evidence in the report, including details from n8n’s workflow template describing how to integrate ComfyUI to automate media generation� and user testimonials highlighting n8n’s ease of automation�.
n8n.io
n8n.io
