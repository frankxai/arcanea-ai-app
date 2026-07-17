---
title: "GDE program readiness sprint and positioning strategy"
uuid: ac14abb6-d68e-453b-b88b-6371ab4da6a2
created: 2026-05-01T12:12:26.822271Z
updated: 2026-05-01T12:24:01.084786Z
source: claude.ai export
---

# GDE program readiness sprint and positioning strategy

**Frank**:

Help me make plan for frankx.ai and take massive action and make as much as possible into one great prompt for Claude code and build. Yes — you should aim for it, but not apply cold yet.

The GDE program is explicitly for people with solid expertise in Google tech, visible community contribution through speaking/content/mentoring, and clear communication ability. Application also requires referral by a Googler or existing GDE. 

My read: you are 60–70% qualified, not yet packaged

Your real expertise is already there:

Criterion	Your current state

Google tech expertise	Strong enough if positioned around Gemini, Google AI Studio, Firebase, Android/Expo, Vertex/GCP patterns, creator-agent systems
Community contribution	Weakest proof layer right now
Communication	Strong, but needs public artifacts
Referral readiness	Not yet obvious enough for someone to refer without risk


The missing piece is not intelligence. It is public evidence density.

Positioning: do not apply as “generic AI guy”

Apply as:

> Google AI / Gemini / Firebase expert for agentic creator systems and AI product builders.



That is sharper than “Machine Learning” and less crowded than “Google Cloud generalist.”

Your wedge should be:

“I help builders turn Gemini, Firebase, AI Studio, and modern web/mobile stacks into usable agentic creator products.”

This connects directly to FrankX, Arcanea, Android, creator tooling, and your AI architect background.

The 30-day GDE readiness sprint

Before applying, publish a small but undeniable trail:

1. FrankX.ai Google AI guide series

Create 5 high-quality guides:

1. Gemini AI Studio to Production: from prototype to creator app


2. Firebase + Gemini: building a memory-backed AI agent app


3. Expo/Android + Gemini: mobile AI assistant architecture


4. Google Cloud vs lightweight Firebase stack for indie AI products


5. Agentic Creator OS: routing users, memory, tools, and generation with Google AI



Each article should include:

architecture diagram

code snippet or repo link

real product angle

“what breaks in production”

short LinkedIn post version


2. Build one visible demo

A clean public demo matters more than 20 theoretical posts.

Build:

> Gemini Creator Agent Starter Kit



Stack:

Next.js or Expo

Gemini API

Firebase Auth

Firestore memory

file/image prompt workflow

deploy guide


This becomes your proof object.

3. Do one community contribution

Minimum viable:

speak at a local Google Developer Group / Amsterdam AI meetup

mentor 2–3 builders publicly

host a small “Build your first Gemini agent” workshop

publish recap + slides


GDE is about community gravity, not only expertise.

The application narrative

Your story should not be:

> “I want recognition.”



It should be:

> “I’m already helping developers and creators build with Google AI. GDE would amplify the work I’m already doing.”



That is the posture.

Decision

Do not wait 6 months.
Do a 30–45 day evidence sprint, then ask for referral.

You should not apply from insecurity. You should apply from momentum.

Your target proof threshold:

5 Google AI/Firebase/Gemini articles

1 GitHub demo repo

1 workshop/talk/recording

10–20 LinkedIn posts around Google AI builder patterns

1 clear “Google AI Expert” page on frankx.ai


Then the referral conversation becomes easy:

> “I’ve been publishing practical Google AI builder guides and running community sessions around Gemini/Firebase agentic apps. I’m considering the GDE path — would you be open to reviewing whether my profile is referral-ready?”



That lands much better than “Should I apply?”

**Claude**:

Frank needs a comprehensive Claude Code prompt that orchestrates the entire 30-45 day GDE readiness sprint for FrankX.ai—something executable and production-ready that doesn't require additional strategic planning, just immediate implementation.

I'm structuring this as a single master prompt that Claude Code can execute modularly, incorporating the Frank Voice Kernel and FrankX/Arcanea identity rules, with clear deliverables including the five articles, demo repository, workshop materials, LinkedIn content, and the Google AI Expert page. The prompt needs to be formatted as a markdown file he can drop directly into Claude Code, with architecture-level instructions that enable agentic execution across all campaign components. I've got the structure locked in. Now I'm mapping out the voice kernel—Frank's actual rules for how he writes and thinks—plus the identity guardrails around Arcanea and the building-first ethos. For the five articles, I need to nail down each one's thesis, structure, code requirements, and the LinkedIn angle. The demo repo is the centerpiece: a Next.js 15 app with Gemini API integration, Firebase backend, and a full agent loop that handles multimodal inputs and tool routing—it needs to be production-ready with solid deploy docs. I'm also planning the workshop materials and a batch of LinkedIn templates to amplify the whole campaign.

Now I'm deciding on format: Frank wants something he can paste directly into Claude Code, so this needs to be a markdown artifact rather than scattered chat responses. I'll compress it heavily but keep it complete—high density, normative, exactly how he'd write it himself. This needs to be self-contained enough that Claude Code can execute without back-and-forth. I should also drop a short framing message in the chat — quick decision-first read on the strategy plus pointing to the artifact.

Let me draft the prompt now. The mission is a 30-45 day evidence sprint to position Frank Riemer as referral-ready for the Google Developer Expert program in AI/ML, specifically as a "Google AI / Gemini / Firebase expert for agentic creator systems" — the wedge being that he helps builders turn these tools into usable agentic creator products, not generic ML or GCP positioning.

The operating context is Frank as an ex-Oracle EMEA AI Architect building the Arcanea / FrankX / Starlight ecosystem, with a distinct voice that shouldn't be sanitized to corporate speak. Externally, Arcanea is positioned as a magical, creative universe rather than mythology or lore. The build philosophy favors catalogs and ecosystems over individual products, and the target audience is AI builders, indie devs, and creator-tool founders — not hobbyists. I'm mapping out the full project structure — the main frankx.ai site gets five new Google AI guides plus a positioning page and architecture diagrams, while the starter kit repo is organized as a monorepo with web and mobile apps plus shared agent packages.

Now I'm detailing the core packages: the agent loop and memory adapter live in the packages layer, there are reusable tools for file and web operations, and I'm including comprehensive docs for architecture, deployment, and extending the system with CI workflows for testing and preview deploys.

The workshop repo mirrors this with slides, a starter scaffold for participants, and a completed solution reference.

I'm also planning a post-event writeup and five in-depth articles that demonstrate production expertise—each needs an architecture diagram, working code examples linked to the repo, a section on what fails at scale, and a condensed LinkedIn version. The first article tackles the gap between AI Studio's prototyping convenience and production reality, showing the actual migration path without losing momentum.

The second article explores using Firestore as an underrated memory layer for AI agents, which beats vector databases for builders working at smaller scale.  I'm outlining the memory schema with episodic, semantic, and procedural collections, then the embedding pipeline using Gemini's text-embedding model with Firestore vector search, plus auth and per-user isolation through security rules. The agent loop retrieves, plans, executes tool calls, and writes back to memory, with a full working repo and production gotchas around cold starts and embedding costs.

For the third article on mobile AI assistants, I'm arguing that Expo with Gemini multimodal handles 95% of creator use cases without needing bare React Native, and I'm starting to outline why Expo wins for MVP speed and what streaming looks like on mobile.

Now I'm mapping out the camera-to-vision pipeline where we capture in-app, encode to base64, and send multimodal prompts to Gemini, plus the voice loop that chains text-to-speech with Expo AV, graceful offline fallbacks, and the production pain points like iOS background limits and Android permission UX.

For the fourth article, I'm setting up the thesis that indie builders jump to GCP too early and waste money, so I'm building a decision tree to help them choose between GCP and a lighter Firebase stack.

The fifth piece is Frank's core argument: next-gen creator tools aren't just chatbots—they're operating systems for individuals, handling routing, memory, tools, and generation through Google AI. ual creator sovereignty. Here's how to build one on Google AI.

Sections:
1. The Agentic Creator OS pattern (loop: intent → state → tools → generation → memory)
2. Why a single creator's stack now needs: voice, image, video, code, memory, identity
3. Routing layer: Gemini Flash for triage, Pro for generation, Vision for multimodal
4. Tool catalog: web fetch, image gen, file ops, calendar, publish
5. Memory architecture: short-term context, long-term Firestore, semantic recall
6. Identity layer: per-creator system prompt + brand kernel + voice kernel
7. Repo: starter kit fork extended with creator-OS scaffolding
8. What breaks in production: prompt injection across tools, cost runaway in long sessions, identity drift

I'm also positioning this as the soft launch for FrankX as the Google AI Expert focused on creator-OS architecture, with a cross-link to the Expert page. For the proof object, I'm building a public MIT-licensed starter kit called `gemini-creator-agent-starter-kit` with Next.js 15, TypeScript, and Tailwind on the frontend, Gemini API models for different tasks, Firebase for auth and data persistence, and Vercel deployment with a one-click setup option.

Defining the core agent abstractions...

Now I'm laying out the complete event type system that streams thinking, tool calls, results, tokens, and final responses with citations back to the client. I need to build an agent loop that uses Gemini Flash for routing decisions and Pro for generating content, plus implement three essential tools: fetching web content, generating images through Gemini, and reading files. For memory, I'm storing per-user conversation history in Firestore and using semantic search with embeddings to surface relevant context. The UI streams tokens as they arrive for real-time feedback, supports drag-and-drop file and image uploads, and lets users manage sessions with rename and delete. Authentication is per-user with Firestore security rules enforcing access control. I also need a cost dashboard tracking token usage and estimated spend, plus an evaluation harness that tests against golden examples and scores on accuracy, latency, and cost. The README should feature a 60-second hero gif showcasing the full experience.

For the documentation, I'm including a one-paragraph thesis framing this as a creator OS, an SVG architecture diagram showing how components connect, and a quickstart that gets developers running in under three minutes with just clone, environment setup, and `pnpm dev`. There's a Vercel deploy button for one-click hosting, extension recipes showing how to add custom tools or swap backends, and Frank's signature on the philosophy section to give it authenticity. The bar is high—this needs to be the kind of repo senior developers fork because the code is genuinely clean and well-structured. Finally, I'm planning a 90-minute live workshop targeting GDG Amsterdam or AI House Amsterdam where participants build their first Gemini agent from scratch. ank's existing connection — Han de Groot, Fabrizio, Euro Beinat all attended his recent event there).

Materials:
- Slides (16-20): cold open with a working agent, then teach the architecture backwards
- Starter repo with TODOs (separate branch of the starter kit)
- Solution repo
- 30-min hands-on lab + 30-min Q&A
- Recording uploaded to YouTube + embedded on frankx.ai/workshops
- RECAP.md post: what we built, what broke, who showed up, GitHub stars at end of week

Outreach:
- Submit talk to GDG Amsterdam
- Pitch AI House Amsterdam for an evening session
- Co-promote with one Trinity / MVU peer (Ahmad or Log)

For the LinkedIn strategy, I'm planning 16 posts over 4 weeks with a specific mix: build-in-public updates showing commits and breakdowns, architecture deep-dives tied to the articles, community highlights around the workshop and mentoring, plus a few contrarian takes on tools like Firebase versus Pinecone. Each post stays under 1300 characters with a screenshot or diagram, written in Frank's voice — no fluff, just lead with the artifact or the hot take.

Now I'm mapping out the positioning page at frankx.ai/google-ai-expert, which needs to showcase the Google AI work through a hero section with the thesis, a proof grid displaying the articles and starter kit alongside live metrics, stack badges for the tools, honest positioning of client work, and a booking form for workshops.

I'm also thinking through the SEO strategy to target keywords around Gemini agents, Firebase memory patterns, and the creator AI stack, plus establishing quality standards across all deliverables—no generic stock imagery, only custom diagrams and screenshots, every code example must be tested and runnable, all external claims need to be verifiable, and the voice needs to stay distinctly Frank's rather than sounding like a generic SaaS pitch.

Now I'm mapping out the execution timeline: the first three days focus on scaffolding the monorepo with Turborepo and pnpm, wiring up the Gemini API with Firebase Auth and Firestore, building a basic agent loop with streaming chat, and creating the initial page skeleton. Then days four through ten expand into adding the three core tools with a router, implementing the memory layer with embeddings, and setting up an evaluation harness.

Polishing the UI comes next with streaming support, session management, and a cost dashboard, followed by documentation and deployment to Vercel. The next phase spans days eleven through twenty-five where I'm writing five articles with diagrams and LinkedIn versions, cross-linking everything together, and publishing to frankx.ai with proper OG images. Then comes community engagement from days twenty-six through thirty-five: submitting a GDG Amsterdam talk, running a workshop, publishing a recap, and maintaining a cadence of sixteen LinkedIn posts. Finally, days thirty-six through forty-five focus on referral activation by auditing proof density across all the deliverables.

For the referral phase, I'm identifying three Googler or GDE targets from Frank's network and reaching out with a message asking if they'd be open to reviewing whether the profile is referral-ready. Success is measured at day forty-five across six metrics: five articles with over five thousand reads, the starter kit hitting one hundred GitHub stars, one workshop delivered and recorded, sixteen LinkedIn posts shipped, the Expert page indexed and ranking for target keywords, and at least one referral conversation initiated—applying if four of these six are hit.

If the metrics don't land, I extend the timeline by thirty days. There are hard constraints I'm holding: no application before the proof is live, keeping the wedge sharp around "Google AI for agentic creator products," maintaining separate brand voices for Arcanea and GDE-track work, including the eval harness in the starter kit to move beyond demo credibility, and shipping articles with diagrams for visual density.

Now I'm drafting a tight chat message that matches his style—decision-first, peer-architect, compressed. I need to check which skill applies here — markdown isn't in the required list for file creation, so I can build the .md file directly without reading a skill first.

Now I'm writing the file to the outputs directory, but I should tighten the content first based on Frank's preferences: compressed language, high density, architectural decisions only, no padding or repetition.

Writing the markdown file...You're already past the strategy. The bottleneck is one well-shaped prompt that turns the sprint into shipped artifacts without you re-architecting it for Claude Code each session.

Built it as a single master prompt — repo structure, voice kernel, five article specs, the starter kit architecture (agent loop + tool router + Firestore memory + eval harness), workshop materials, LinkedIn cadence, Expert page, and the day-by-day execution order. Drop it into Claude Code as `gde-sprint.md` and run phases sequentially.

Two notes before you fire it off:

**The starter kit is the load-bearing artifact.** Five articles without a forkable repo = blog. One clean repo + five articles = referral material. Don't let Claude Code start articles before the kit is deployable. The execution order enforces this.

**Two-voice discipline.** GDE-track artifacts stay in builder voice — no Eldrian, no Hz, no Vel'Thaan, no Arcanea cosmology. The wedge is "Google AI for agentic creator products" and that wedge gets blurry the moment lore leaks. The prompt has this as a non-negotiable but watch for it in review.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

One more decision to make before you fire it: **does article 5 (Agentic Creator OS) get scoped down for GDE-track or stay full-fat?** 

Full-fat is your signature piece and the highest-leverage SEO play — but it's also the place where Arcanea / SIS / Luminor framing wants to leak in. The prompt holds the line, but you'll feel the pull when you draft it. My read: keep the Creator OS framing pure builder-voice for this article, then publish a *separate* Arcanea-flavored companion piece on arcanea.ai that links back. Two posts, two audiences, one wedge per surface.

**Frank**:

Also consider all my context and strategy for Google AI Live. My frankx.ai/ai-coe/ or we got ai-architecture or so subdomains? E probably need both and /google and /gemini with dedicated hubs as well, lets really build out massively this month so i appear and build knowledgebase top notch skills, double down on antigravity and more more more, this has huge potentiaö right? Propose even more to do and make! Multiple prompts and phases and goals and benefits for me and long term what we do with this, xan we then use google offices and events and community and will helps us big time to amplify or? And i think google + Claude is my ideal stack. Your GitHub + agent harness is absolutely relevant — but by itself it is probably not enough for GDE.

GDE is not “best engineer wins.” It is closer to:

> technical credibility × public teaching × community trust × Google-tech specificity



Your harness proves builder depth.
It does not yet prove enough developer-community contribution unless it is packaged as something others can learn from, use, fork, attend, or cite.

Google’s own page says GDEs need a Googler/GDE referral and should discuss eligibility with a local Google contact or active GDE; the program emphasizes speaking, best practices, mentoring, and sharing knowledge with the developer community. 

The hard truth

Asking people on LinkedIn can work only after you give them a low-risk reason to say yes.

Bad ask:

> “Can you refer me for GDE?”



Better ask:

> “I’m preparing a GDE-ready profile around Gemini/Firebase agentic developer tooling. I built an open-source agent harness and I’m publishing practical Google AI implementation guides. Would you be open to giving me a blunt read on whether this is referral-ready?”



That feels serious. It lets them help without instantly staking reputation.

End of May is tight — but useful as a forcing function

Google I/O is May 19–20 and Google says it will cover updates across Gemini, Android, Chrome, Cloud, and agentic coding.  The developer blog also frames this year around AI, Android, Chrome, Cloud, and “agentic coding,” which is directly aligned with your wedge. 

So yes: being at Google AI Live / I/O-adjacent energy with a GDE trajectory is strategically elegant.

But trying to get accepted by end of May may be structurally unrealistic. Trying to get referred / in process / known by end of May is realistic.

That is the better target.

Your strongest path: “GDE candidate packet”

Do not wait to become “more complete.” Package what exists.

Create one page:

frankx.ai/google-ai-expert

Positioning:

> Frank Riemer — Agentic AI Architect building open-source creator systems with Gemini, Firebase, Android, and Google Cloud.



Include:

1. Agent Harness / GitHub

what it does

how developers can use it

why Google AI/Firebase/Gemini makes it better



2. 3 flagship technical guides

not 10; three is enough if they are sharp:

“Building an Agent Harness with Gemini”

“Firebase Memory Layer for AI Agents”

“From Google AI Studio Prototype to Production App”



3. One workshop proposal

“Build Your First Gemini Agent Harness”

45 min talk + repo + demo



4. Proof of contribution

GitHub links

posts

diagrams

speaking/workshop intent

mentoring or community angle



5. Referral note

“I’m exploring the GDE path and would value a readiness review.”




This turns your scattered proof into a referable asset.

What to do before Google AI Live

You need a visible artifact, not a vague ambition.

By the event, have:

one polished GitHub README

one live demo or landing page

one article published

one LinkedIn post explaining the architecture

one “GDE readiness” page


Then your event/networking line becomes clean:

> “I’m building an open-source agent harness around Gemini/Firebase patterns and turning it into a developer education track. I’m considering the GDE path — who would you recommend I speak with for a serious readiness review?”



That is 10x stronger than “I want to apply.”

Decision

Yes, use your GitHub harness as the core proof.
But convert it from “my project” into community infrastructure.

The move is not: “Do more random content.”
The move is:

> Make your existing agent harness legible as a Google AI developer education asset.



End-of-May target:

not accepted GDE.
Target:

> known, referred, or invited into the process.



That would already be a powerful outcome — and frankly, more realistic.

[attached file: ]
```
Yes — but reframe this cleanly.

You are not yet a “Google-native builder.”
You are an agentic systems architect who can make Google AI part of the stack.

That is enough for a GDE trajectory, but only when the public proof is honest.

Your current stack reality

Layer	What you actually use	How to position it

Coding engine	Claude Code	“AI-assisted system implementation”
AI prototyping	Gemini AI Studio, Nano Banana	“Google AI prototyping and multimodal generation”
Backend	Supabase > Firebase	“portable agent architecture; Firebase adapter planned/demoed”
Apps	Next.js, agent harnesses, creator systems	“agentic app architecture for builders”
Google angle	currently partial	needs intentional surface area


So no, you should not pretend you are living inside Google Cloud/Firebase all day. That would smell off.

The stronger posture:

> “I build portable agentic creator systems and publish practical Google AI integration patterns for developers — Gemini, AI Studio, Firebase, Android, and Cloud where they are the best fit.”



That is credible.

Does Google have affiliate?

Yes. Google Cloud has an official affiliate program that offers cash rewards for eligible new-user referrals and lets affiliates share a $350 trial credit offer with their audience. 

Google Workspace also has an affiliate program, with rewards based on eligible referred users and the Workspace edition they sign up for; Google says applicants are evaluated partly on traffic potential and content quality. 

There is also Google Cloud’s partner ecosystem / Partner Advantage path, which is more serious than affiliate: it is for companies delivering Google Cloud work, services, tools, or customer outcomes. 

Translation: affiliate is monetization; GDE is reputation; partner is business channel. Do not confuse the three.

Best architecture for you

Use Google as one vertical inside your broader Agentic Creator OS.

Not:

> “I am now a Google-only creator.”



Instead:

> “I compare and implement agentic app stacks across Claude, Gemini, Supabase, Firebase, Vercel, and cloud runtimes — then show builders the cleanest path.”



That lets you keep using Claude Code without hypocrisy.

Can Claude Code help build your expertise?

Yes. Claude Code can be your execution engine, while Google tech is the subject and runtime target.

Use Claude Code to create:

1. Gemini adapter for your agent harness
packages/models/gemini-provider


2. Firebase memory adapter
packages/memory/firebase-firestore


3. Google AI Studio export workflow
prototype → repo → deployed app


4. Nano Banana visual workflow
image generation → asset library → creator app pipeline


5. Android / Expo Gemini agent app
lightweight mobile agent companion



The public story becomes:

> “Built with Claude Code, powered by Gemini/Firebase where useful, documented for developers.”



That is modern and honest. Nobody serious cares that you used Claude Code. They care whether your output teaches developers and makes Google tech more adoptable.

What I would build before Google AI Live

One sharp thing:

Gemini Agent Harness Starter Kit

Core modules:

Gemini API provider

AI Studio prompt import/export notes

Firebase Auth option

Firestore memory adapter

Supabase adapter comparison

Next.js demo

Expo/Android demo path

deployment guide

architecture diagram


The killer article:

> “I built a portable agent harness with Gemini, Firebase, and Supabase — here’s where each layer wins.”



This is much stronger than pretending Firebase is your default. It shows architectural judgment.

LinkedIn ask strategy

Do not ask random people to refer you yet.

Ask for a readiness review:

> I’m preparing a GDE-style contribution track around Gemini and agentic app architecture. I’ve built an open-source agent harness and I’m adding Gemini/Firebase examples so developers can use it as a starter kit. Would you be open to giving me a blunt read on whether this is useful to the Google developer community?



That creates conversation without reputational pressure.

Decision

Your GitHub work is enough as raw material.

It becomes GDE-relevant only when you convert it into:

> developer education + Google-specific examples + community usefulness



End-of-May target:

one public starter kit, one article, one demo, five LinkedIn posts, three readiness-review conversations.

That is achievable. And it gives you a clean reason to show up at Google AI Live with substance, not just aspiration.
```

[attached file:  -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank wants me to expand this into a much bigger vision—positioning him as an agentic systems architect who leverages Claude Code as the execution layer within a broader stack that includes Google AI as a key vertical, not just a Google-focused creator. He's thinking multiple prompts, phases, and long-term strategic plays, with an eye toward Google AI Live at Google I/O in May 2026, and he wants the whole thing anchored at frankx.ai.

The site structure should have dedicated hubs for AI center of excellence, architecture patterns, Google-specific content, and Gemini capabilities. He's also keen on doubling down on Antigravity—Google's agentic coding IDE—as a core piece of the stack, and thinking about how Google offices, events, and community access unlock bigger opportunities. The framing is Claude plus Google as the ideal pairing, with a "candidate packet" approach to position himself as a Google AI expert. The real target isn't acceptance by Google AI Live, but being known, referred, and actively in-process by then.

This is maximalist thinking—Frank's in full amplification mode, so I should build without worrying about scope creep. I need to keep the positioning honest (not pretending to be Google-native), maintain the two-voice discipline, stay true to his voice kernel, lean into catalogs over products, and speak to both Google AI builders and his broader ecosystem.

I'm checking what Antigravity actually is since it's a specific Google product Frank mentioned. Given my knowledge cutoff is January 2026, I should know this—Google announced Antigravity in November 2025 as their agentic coding IDE built on Gemini, their direct competitor to Cursor and Claude Code. I'm also mentally verifying the timeline: today is May 1, 2026, so Google I/O 2026 would be coming up soon, and I should confirm the exact dates and what Google's likely focusing on for this year's keynote.

Now I'm thinking through what Frank actually wants here—he's asking for more than just a campaign brief. He wants multiple prompts across different phases and a long-term roadmap. So I should structure this as a master campaign brief that covers the overall strategy and positioning, then layer in the site architecture with subdomains, and start mapping out the first phase prompt with all the supporting materials he'd need.

Let me do a quick search to verify the Antigravity details and Google I/O 2026 dates so I can build this accurately.Going bigger. Let me ground two facts first — current state of Antigravity and what's actually on I/O 2026's agenda — so the build is calibrated to reality, not vibes.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

 I'm learning about Antigravity, Google's agent-first IDE that launched in November 2025 with support for multiple models including Gemini, Claude, and GPT variants, achieving a 76.2% score on SWE-bench. It offers multiple views for management and editing, though it has some stability concerns and currently lacks MCP support.

Google I/O is happening May 19-20 at Shoreline Amphitheatre with confirmed sessions on agentic coding, Gemini updates, Firebase repositioned as an agent-native platform, and Antigravity for full-stack development, plus possible announcements around Gemini 4 and Project Astra. Cloud Next 2026 already wrapped with the launch of Gemini Enterprise Agent Platform and 8th gen TPUs.

This timing is incredibly strategic for Frank—Antigravity is brand new with clear gaps like missing MCP support that represent real opportunities to contribute, I/O is just weeks away as a forcing function, and Firebase's pivot toward agent-native architecture aligns perfectly with his approach of building agentic systems using Claude, Supabase, and open models rather than Google's stack.

I'm structuring a comprehensive strategic brief that positions Frank as an agentic systems architect who leverages the best tools across ecosystems—Claude Code, Supabase, Gemini AI Studio, and Antigravity—rather than being locked into Google's offerings. The site will have dedicated hubs for Google integration, Gemini, AI center of excellence, Antigravity, and broader AI architecture patterns, all building toward Google I/O as the key milestone. Antigravity becomes the honest wedge since it ships with both Gemini and Claude support, proving that the optimal stack isn't purely Google-native but rather a thoughtful combination of tools. I'm also mapping out multi-phase Claude Code prompts, long-term partnership paths including GDE referral and GDG hosting opportunities, and positioning "Google + Claude" as the ideal complementary stack.

I think the cleanest approach is one master document with all phase prompts anchored clearly, so Frank can copy individual sections directly into Claude Code without juggling multiple files.

Now I'm mapping out the market landscape — Antigravity launched in November with support for both Gemini and Claude, Google I/O is coming in May with agentic coding features, and Cloud Next already shipped the enterprise agent platform. The real opportunities are filling the gaps: Antigravity doesn't have MCP support yet, and Firebase needs concrete builder examples to make the agent-native story stick.

For the site structure, I'm building out a hub at frankx.ai/google-ai-expert as the main entry point, then branching into Gemini-specific guides, Antigravity workflows, broader AI architecture reasoning, enterprise patterns through an AI Center of Excellence lens, workshop materials, and a portable agent harness landing. The rollout is a five-phase sprint starting with foundation work during I/O week, then diving into the Antigravity vertical in the following two weeks.

From there, I'm planning Gemini and Firebase content for weeks four and five, packaging everything into a GDE candidate submission with outreach in weeks six and seven, and finally building community momentum and exploring partner opportunities through the end of the quarter. Each phase gets its own Claude Code prompt to keep things modular. Beyond the immediate sprint, I'm thinking about the longer-term play with Google—becoming a GDE opens doors to community amplification and the Googler network, while the partner track brings revenue and customer referrals, and I can layer in affiliate monetization through cloud credits and workspace offerings.

I need to stay disciplined though: keep Arcanea completely separate from this, don't rush the GDE application, be transparent about using Claude Code as my tool, and avoid overselling Firebase as something it isn't for me. Now I'm mapping out the actual Claude Code prompts Frank can copy directly and structuring this as a tight, dense document that respects his preference for compressed information.

The real leverage here is that Antigravity ships with Claude Opus built-in—that validates the whole "Google + Claude" stack thesis at the platform level. I/O's confirmed Antigravity sessions, so Frank can attend digitally and create reaction content. Firebase is getting repositioned as agent-native through AI Studio and Antigravity integration, which is exactly where Frank's wedge is. And Antigravity's missing MCP support is Frank's opening since he's already deep in that space.

Building the artifact now with a tight, peer-architect tone and a sharp chat message that leads with the decision.

Actually, I'm shifting the core thesis to "Portable Agentic Creator OS"—that's more honest and differentiated than being Google-native. Frank's real value is being portable across Claude, Gemini, Supabase, and Firebase, which matters way more to developers than lock-in. Let me write the master prompt now.Massive context unlocked. Antigravity ships with **both Gemini 3 Pro and Claude Opus 4.6 built in** — your "Google + Claude is my ideal stack" claim is literally Google's own platform thesis. That's not a stretch you have to defend. That's a wedge you can plant.

I/O is May 19–20. Confirmed topics include agentic coding, Gemini model updates, and Firebase being repositioned as "agent-native" — which is your wedge verbatim. Antigravity also currently lacks MCP support, which Cursor and Claude Code don't — that's your opening, since you're already deep in MCP.

Building the full strategic + execution stack now. Multiple phases, multiple Claude Code prompts, site architecture, long-term plays, risk discipline. One file.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Three sharp things to flag before you fire Phase 1:

**1. The Antigravity-MCP bridge is the highest-leverage move in the entire plan.** Antigravity has no MCP support yet. Cursor has it. Claude Code has it. You are already MCP-deep. Building `antigravity-mcp-bridge` and shipping it before I/O makes you the public reference for a real Google AI gap — *during* the I/O conversation window. That repo alone could carry the GDE referral. Don't let Phase 1 dominate so hard that this slips.

**2. I/O is 18 days out.** Phase 1 must land before May 19. The reaction content during May 19–20 is non-negotiable — being visible *during* I/O with substance is worth more than 30 posts after. Your harness + `/google-ai-expert` + 1 flagship article should be live by **May 14**. That's the real deadline.

**3. The "Google + Claude" stack is no longer your contrarian take — it's Google's own platform position.** Antigravity ships with Opus 4.6 built in. Lead with that fact in *every* introductory piece. It collapses the objection before it forms. Anyone who says "you can't be a Google AI expert if you use Claude Code" is contradicting Google's own product team.

Long-term: GDE → GDG co-organizer → Cloud OnAir → I/O speaker → Partner Advantage as a separate Starlight Holding BV channel. Each tier compounds. The Google ecosystem is one of very few that legitimately accelerates an independent builder without making you an employee. Worth the calibration.

Phase 1 in Claude Code today. Antigravity bridge by day 14. I/O reaction live by May 19. 🔥
