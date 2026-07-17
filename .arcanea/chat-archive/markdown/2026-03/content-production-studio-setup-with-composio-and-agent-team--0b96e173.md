---
title: "Content production studio setup with composio and agent team"
uuid: 0b96e173-df99-4969-b557-fed37c3b437a
created: 2026-03-11T23:34:51.760134Z
updated: 2026-03-12T12:48:41.661256Z
source: claude.ai export
---

# Content production studio setup with composio and agent team

**Frank**:

Check my cc setup contedt in other chats . Is composio what i needed and maybe missing link for arcanea and sis? Is its code and githubs free to use or its api is just glueing? And ruben or so? And any competition to n8n or other tooling we have? 

Bro. So todit's the 11th of March, and I need to spend some time on how we can set up my content production studio. Really think in depth about my home setup, uh, daily routines that I should be having, uh, as well as content production pipeline. And all of the social media channels that we need to serve. Which automations we have, or which standard operating proced7ures I need to follow. And, uh, build their a notion database and, um, yeah, but also maybe like a, a website maybee puttng thiss even on FragX.ai/admin/content, production or content strategy, content studio or something like that. And for us to be an, uh, build something there that is, yeah, really helping me to structure all of these different types of social media channels. the social media content I want to create, and help to standardize, help to standardize my research on it, that my general AI chats and custom jam kind of run. And then how to store and build a sophisticated knowledge base for it that helps also kind of coding agents to pick up the markdown files and the insights that we've gained and the strategy to tailor it further to my own. And probably need then also like a private studio experience and maybe initially a smart-to-buy content studio with its MCP server capabilities. It might be exactly what I need to structure now my multiple social media channels. But at the same time, I wanted to make it Claude code native and thenn I need N workflows so I'm not sure if it's best to dock it then into a content studio or if we can easily build such a visual content production platform. Ourslves maybe forksome GitHub, plug it into our pipeline for me to have my own self-hosted system that we could scale.soo we're notneeding to pay them always good money every month. But maybe there is value in their services. So please research that and soen suggest the best path going forward. And then I would expect you to help me build something or really think about all of the different content streams that we have and the content production like, for example, I was just thinking for my personal Instagram and TikTok, I should be doing more videos of Amsterdam and beingI'm grateful about, you know, what this incredible city has to offer. And be like, "Hey, I just experienced this and that." Or when I'm going on meals and stuff that I always have, like, a standard content template. To use, and the process, um, that my agents or my generative my gen creator OS knows how to follow for us to ensure you're creating top-notch content and publish it. And have, like, a set of CapCut templates, uh, good music, maybe my own music, already in its library, and right, then having just the machine that daily we can produce the most high-quality best experiences and content for our audience,and alsoo think about what they ned, whhat we shouldbee producing how we make it easy for me with at the same time super valuable and engaging for them. And I think for, for that weealso need toTo build a massive whiteboard and bring together all of the different brands, all of the different funnels that we have, tailored to each of the different personas that ideal customer profiles, that we have for every stream at every social media channel and every product that it should be leading up to, or where we are just having bright, status chtus channels, or that just make me more public, but at the same time I don't want to be too public,r want the smart strategy of just high-quality content we're producing at scale and brings me a lot of joy and for sure also better strategy and execution now of using Opus Clip to create short-term content from anime from Tony Robbins and other stuff that I can then daily watch on my own YouTube. To have content that I really enjoy also in content format yeah short format always available but also bringing me benefit because I publish it so build a strategy how to do that. can we also make google drive and local phone and which agents can work there? or need to upload from phone and then process somewhere? whats cost or time needed for claude code or some other smarter approach?

Yes, integrate Google Drive and local phone seamlessly—agents can work directly without manual uploads via automations. [1][2][3] n8n handles phone-to-Drive syncing, Claude agents manage files via MCP, and processing stays efficient with minimal Claude code effort. [4][5]

## Phone Integration
Auto-upload from phone to Drive, then process; no manual steps needed.

- iPhone/Android: Enable Google Drive app auto-backup for camera roll (select folders like "Amsterdam_vids")—files land in /Phone_Backup/YYYY/MM/DD. [6][7]
- n8n watcher: Trigger on new Drive files matching "*.mov" or "*.mp4"; auto-tag, proxy-generate, move to /media/raw/camera. [1][4]
- Local phone access: Optional rclone sync (mount Drive as local folder on Mac), or n8n webhook from phone shortcuts app for instant push.

## Google Drive Role
Primary "inbox" for phone uploads; agents treat it as the /raw entry point.

- Folder sync: Use rclone to mirror Drive folders to your local /media structure (bidirectional, cron every 15min). [8]
- Agent access: Claude via Composio MCP server—natural commands like "upload phone clip to Amsterdam_Gratitude project" or "find similar Amsterdam shots". [3]
- Limits: Free 15GB fine for starters; upgrade to 2TB (€10/mo) for video scale; no extra cost for API access. [8]

## Agents & Processing
Coding agents (Claude/n8n) work on Drive-mounted paths; ffmpeg processes locally after sync.

- Claude agents: Use Composio SDK—MCP connects to Drive for list/upload/share/comment; 1-hour setup with their template (pip install, API keys). [3]
- n8n flows: Native Drive nodes (upload/download/search) + ffmpeg for cuts/thumbnails; e.g., phone vid → Drive → extract frame → tag → /work_in_progress. [2][4][9]
- No upload bottleneck: Agents query Drive metadata first (fast), download only selected files to local SSD for ffmpeg (e.g., 4K proxy in 10s).

## Cost & Time: Claude Code vs Smarter Paths
Self-hosted n8n + Drive is cheapest/fastest; Claude code only for custom logic.

| Approach | Setup Time | Monthly Cost | Best For |
|----------|------------|--------------|----------|
| n8n + Drive native (no code) | 2-4 hours (import workflows) | €0 (Drive free tier) | Phone sync, basic tag/move [4][10] |
| Claude MCP (Composio template) | 1 hour (API keys + test) | Claude: €3/1M tokens; Composio: free tier | Natural lang file mgmt [3] |
| Full Claude code (custom agent) | 4-8 hours scripting | Claude: €20+/mo heavy use | Complex "taste" decisions |
| Smarter: n8n-first | 3 hours total | €0-5 | Your stack—scale to OCI [5] |

Start with n8n workflow import (e.g., video-to-thumbnail-Drive) + phone auto-backup; add Claude MCP for smarts. [4]

Do you have a preferred Google Drive folder for the inbox, or want a sample n8n JSON workflow?

Citations:
[1] How to upload generated image to google drive - n8n Community https://community.n8n.io/t/how-to-upload-generated-image-to-google-drive/193172
[2] How to Connect Google Drive to N8N (Easy - Beginner Friendly) https://www.youtube.com/watch?v=WJwjNi5VYSE
[3] Google Drive MCP Integration with Claude Agent SDK | Composio https://composio.dev/toolkits/googledrive/framework/claude-agents-sdk
[4] Automate video uploads to thumbnails with FFmpeg and Google Drive https://n8n.io/workflows/7595-automate-video-uploads-to-thumbnails-with-ffmpeg-and-google-drive/
[5] Claude and Google Drive: Automate Workflows with n8n https://n8n.io/integrations/claude/and/google-drive/
[6] Google Photos Upload - Tips & Tricks - n8n Community https://community.n8n.io/t/google-photos-upload/237649
[7] How to Auto-Upload Images to Google Drive with n8n Workflow https://www.linkedin.com/posts/tkr_save-hours-auto-upload-images-to-google-activity-7372234541345927168-A5bi
[8] Google Drive's AI nonsense finally pushed me to self-host my ... https://www.androidauthority.com/self-hosted-google-drive-seafile-3635561/
[9] How to AutoClip AI Workflow (n8n + Google Drive + ... - YouTube https://www.youtube.com/watch?v=YXChB2KGSRc
[10] Google Drive integrations | Workflow automation with n8n https://n8n.io/integrations/google-drive/
[11] How to upload generated image to google drive : r/n8n - Reddit https://www.reddit.com/r/n8n/comments/1noyrba/how_to_upload_generated_image_to_google_drive/
[12] How to Save Image in Google Drive with n8n - Step By Step - YouTube https://www.youtube.com/watch?v=UwRQVqGFWy8
[13] Connect Google Drive and Anthropic Claude integrations - Make https://www.make.com/en/integrations/google-drive/anthropic-claude
[14] How To Make N8n Work with FFmpeg in 10 Minutes FAST! - YouTube https://www.youtube.com/watch?v=9jRhaAy7NII
[15] Google Drive and Personal AI: Automate Workflows with n8n https://n8n.io/integrations/google-drive/and/personal-ai/
and we meed either home server or cloud with archive and strategy for agents to manage image and video content and have taste and understanding either indexed or embedded or md files coding agent can process with ffmpeg or better some n8n flow and the folders ans where to archive and where which folder how saved can they manage for me?why composio not cloudinary or blotsto or postiz or need all oftime. and the question is more all the content if tagged and indexed i need content agent team with taste that knows how to use whoch content manages it and then uses with capcut mcp pr so and i could just use through Claude or Perplexity mobile? and I can upload the content from my local phone at least and lster we automate to get started and focus on whats important?

Composio excels for MCP integrations across tools like Postiz/CapCut (unified auth, Claude-ready), while Cloudinary handles asset optimization/CDN, Blotsto (likely Blotato?) does video gen, and Postiz schedules—use Composio as the "glue" for your agent team, not all constantly. [1][2][3] Yes, a tagged/indexed content agent team with "taste" awareness can manage everything via Claude mobile/perplexity, starting with manual phone uploads for quick wins. [4][5][6]

## Composio vs Others
Composio is the agent-orchestrator hub; others are specialized—no need for all at once.

| Tool | Role | Why Composio over it? | When to add |
|------|------|-----------------------|-------------|
| Composio | MCP router (Drive, Postiz, CapCut auth/tools) | One endpoint for 100+ tools, Claude SDK ready; handles multi-agent handoffs [2][7] | Core now |
| Cloudinary | Image/video transform/CDN | Composio integrates it; use for auto-resize if scaling uploads | Later for delivery |
| Blotsto/Blotato | AI video gen | Niche gen; Composio routes to it if needed | If video synth grows |
| Postiz | Social scheduler | Composio MCP wrapper exists; self-host Postiz base [2] | Publishing arm |

## Content Agent Team with Taste
Build a 4-6 agent team in Claude: They query indexed tags/embeddings, apply your taste MD files, select/combine assets, invoke CapCut MCP for edits.

- Team roles (Claude prompt-spawned): [4][5][8]
  - Content Strategist: Matches idea to channel/persona using /kb/taste/*.md (e.g., "grateful Amsterdam vibe: slow pans, warm filters").
  - Asset Scout: Searches Drive/index ("Amsterdam cafe 2026" → top 3 clips by embedding similarity).
  - Editor: Calls CapCut MCP (viaSocket/atx-guy servers) with shotlist: trim/add music/subtitles/export. [3][6][9]
  - Reviewer: Scores output (engagement potential), approves for Postiz.
- Taste baked in: Agents reference shared MD KB (git-synced): "High-performers have 3s hook, your Suno track, anime overlay if Arcanea".
- Access: Claude desktop/mobile or Perplexity chat—tag "@content-team Schedule Amsterdam reel" [10].

## Getting Started: Phone Upload Focus
Manual uploads first (5min/day), automate later—prioritize agent team MVP.

- Step 1 (today, 30min): Create Drive folder /Content_Inbox/Phone; upload 5 Amsterdam clips manually via app.
- Step 2 (1hr): Index them (n8n or Claude: generate .tags.json with location/mood).
- Step 3 (2hr): Spawn agent team in Claude: Paste team prompt, test "Make IG gratitude reel from inbox".
- Step 4: Add CapCut MCP (viaSocket free tier: 3min URL setup). [3]
- Cost: €0 start (Drive free, Claude ~€5/test run); scales to €20/mo heavy.

This gets top-notch content flowing immediately. [8]

What’s the first content idea (e.g., "Amsterdam meal gratitude") to test the team on?

Citations:
[1] What Platforms Are You Using for Tools & MCPs in Your AI Agents? https://www.reddit.com/r/AI_Agents/comments/1jflbir/what_platforms_are_you_using_for_tools_mcps_in/
[2] Postiz MCP Integration for AI Agents - Composio https://composio.dev/toolkits/postiz_mcp
[3] CapCut MCP - viaSocket https://viasocket.com/mcp/capcut
[4] Claude Code just Built me an AI Agent Team (Claude ... - YouTube https://www.youtube.com/watch?v=0J2_YGuNrDo
[5] How I built a 13-agent Claude team where agents review each ... https://www.reddit.com/r/ClaudeAI/comments/1rga7f5/how_i_built_a_13agent_claude_team_where_agents/
[6] CapCut MCP Server - LobeHub https://lobehub.com/nl/mcp/atx-guy-capcut-mcp-server
[7] Composio MCP wants to dance with your LLM, but some people are ... https://natesnewsletter.substack.com/p/composio-mcp-wants-to-dance-with
[8] Claude Agent Teams Explained: AI for Complex Projects (2026 Guide) https://www.turingcollege.com/blog/claude-agent-teams-explained
[9] mrbuslov/capcut-ai-editor - SmartCut MCP Server - GitHub https://github.com/mrbuslov/capcut-ai-editor
[10] Claude MCP Integration: Connect Claude Code to Tools https://thoughtminds.ai/blog/claude-mcp-integration-how-to-connect-claude-code-to-tools-via-mcp
[11] 4 Best AI Agent Authentication platforms to consider in 2026 - DEV ... https://dev.to/composiodev/4-best-ai-agent-authentication-platforms-to-consider-in-2026-32o8
[12] Top Composio Alternatives for AI Agents in 2026 | Nango Blog https://nango.dev/blog/composio-alternatives
[13] 3 AI agent management platforms to consider in 2026 - Merge https://www.merge.dev/blog/ai-agent-management-platform
[14] The Best AI Agent Resources You Should Know in 2025 - CopilotKit https://webflow.copilotkit.ai/blog/the-best-ai-agent-resources-you-should-know
[15] From MCP to multi-agents: The top 10 new open source AI projects ... https://github.blog/open-source/maintainers/from-mcp-to-multi-agents-the-top-10-open-source-ai-projects-on-github-right-now-and-why-they-matter/
can we also make google drive and local phone and which agents can work there? or need to upload from phone and then process somewhere? whats cost or time needed for claude code or some other smarter approach?why composio not cloudinary or blotsto or postiz or need all oftime. and the question is more all the content if tagged and indexed i need content agent team with taste that knows how to use whoch content manages it and then uses with capcut mcp pr so and i could just use through Claude or Perplexity mobile? and I can upload the content from my local phone at least and lster we automate to get started and focus on whats important?whats cost using all these at scale? 1000 videos and music and images

At scale processing 1000 videos/images/music tracks (assume ~1min 1080p vids, 5MB images, 3MB tracks; ~2TB total), monthly costs range €150-600 depending on optimization—mostly storage/API, self-host where possible to minimize. [1][2][3]

## Breakdown by Component
Self-host n8n/Postiz (OCI ~€50/mo infra); optimize Claude usage.

| Component | Monthly Cost | Scale Notes (1000 assets) |
|-----------|--------------|---------------------------|
| Google Drive | €10-25 | 2TB @ €10/TB; auto-backup fine [2] |
| n8n self-hosted | €40-100 | OCI droplet + DB; ffmpeg local [3] |
| Composio MCP | €29-229 | Growth tier; 600k calls cover team [4][5] |
| Claude API/Teams | €100-300 | Heavy agent use (~$6/day dev equiv.); cap tokens [6][7] |
| CapCut MCP (viaSocket) | €0 | Free lifetime fair use [8] |
| Postiz self-host | €0 | Open-source on your n8n server [9] |
| Cloudinary (opt-in) | €100-500 | Video encoding dominant; skip if local ffmpeg [1][10] |
| **Total Optimized** | **€180-650** | No Cloudinary; light Claude |

## Optimization Tips
- Storage: Compress proxies (ffmpeg); tier to cheap S3 (€5/TB).
- Compute: Local ffmpeg/n8n for 90% processing; Claude only for decisions (€0.50/video).
- Caps: Composio free 20k calls/mo starter; Claude Max €100 for 5x limits [11][6].
- Annual savings: 20% discounts; hybrid self-host keeps under €300/mo at 1000 assets.

What video length/resolution for your typical Amsterdam clips to refine estimates?

Citations:
[1] Cloudinary Pricing 2026: Plans, Costs & Real Expenses https://checkthat.ai/brands/cloudinary/pricing
[2] Google One vs Google Drive: Pricing, Storage, and Feature 2024 https://www.geeksforgeeks.org/blogs/google-one-vs-google-drive-pricing-storage-and-feature/
[3] N8N Free Self-Hosted Version 2025: Complete Analysis + True Cost ... https://latenode.com/blog/low-code-no-code-platforms/self-hosted-automation-platforms/n8n-free-self-hosted-version-2025-complete-analysis-true-cost-reality-check
[4] Composio Pricing 2026 — Plans & Costs - AISO Tools https://aisotools.com/pricing/composio
[5] Composio MCP: The Missing Skill Layer That's Finally Making AI ... https://skywork.ai/skypage/en/Composio-MCP-The-Missing-Skill-Layer-That's-Finally-Making-AI-Agents-Useful/1972859063848595456
[6] Claude Code Pricing: Pro, Max and API Costs (2026) - The CAIO https://www.thecaio.ai/blog/claude-code-pricing-guide
[7] Prompt Templates For... https://blog.laozhang.ai/en/posts/claude-code-agent-teams
[8] CapCut MCP - viaSocket https://viasocket.com/mcp/capcut
[9] Postiz Pricing 2026: Plans, Costs & Value Analysis - SocialRails https://socialrails.com/blog/postiz-pricing
[10] Cloudinary Software Pricing & Plans 2026: See Your Cost - Vendr https://www.vendr.com/marketplace/cloudinary
[11] Pricing - Composio Dev https://composio.dev/pricing
[12] Composio Pricing 2026 - Capterra https://www.capterra.com/p/10021083/Composio/pricing/
[13] Composio alternatives: top competitors in 2026 - Membrane https://getmembrane.com/articles/comparisons/composio-alternatives
[14] 10 Best MCP Servers for Developers in 2026 - Firecrawl https://www.firecrawl.dev/blog/best-mcp-servers-for-developers
[15] CapCut Standard vs Pro – Full Comparison Guide for Creators https://www.capcut.com/resource/capcut-standard-vs-pro

[attached file: 1773271959911.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1773271960461.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1773271960728.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1773271961877.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

[attached file: 1773271962243.jpeg -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

Frank is asking me to do several things:

1. Check his past chats for Claude Code (CC) setup context
2. Evaluate Composio as a missing link for Arcanea/SIS
3. Assess whether Composio's code/GitHub is free or just API glue
4. Research "Ruben or so" (likely a person associated with Composio)
5. Compare to n8n and other tooling
6. Then the big ask: build out his content production studio strategy

Let me start by searching past chats for relevant context, then research Composio.

He's also referencing a lot of prior conversation context that's already shown in the chat - looks like there were previous responses about Composio, n8n, Google Drive integration, etc.


I'll search through past chats for CC setup and content studio context while diving into Composio research to understand what we're working with.Let me pull your prior context and research Composio properly before architecting this.
```
This block is not supported on your current device yet.
```

Good, I have context from past chats. Now let me search for Composio specifically and also search for content production setup context.
```
This block is not supported on your current device yet.
```

Good context. Now let me search for more about content production pipeline and Composio specifically.
```
This block is not supported on your current device yet.
```

Now let me research Composio properly - what it actually is, its GitHub, whether it's open source, who founded it (Ruben?), and how it compares to alternatives.Now let me research Composio properly.
```
This block is not supported on your current device yet.
```

Now let me search for the founder - Frank mentioned "Ruben or so"
```
This block is not supported on your current device yet.
```

Now let me search for "Rube" which is their MCP server product, and alternatives to Composio and n8n.
```
This block is not supported on your current device yet.
```

Now I have a comprehensive picture. Let me synthesize this for Frank. Key findings:

1. **Composio**: Founded by Soham Ganatra and Karan Vaidya (not "Ruben" - Frank was thinking of "Rube" which is their MCP server product). Series A, $29M raised from Lightspeed. MIT licensed open source SDK. The API/platform is the monetization (glue layer for auth, tool routing, MCP). 

2. **Rube** = their universal MCP server product (not a person named Ruben)

3. **Is it the missing link?** For Frank's use case - connecting multiple tools (Drive, CapCut, Postiz, Notion, etc.) through a single MCP endpoint that Claude Code/Desktop can use - yes, it's potentially very useful as the auth/routing layer. But it IS "just glueing" in a sense - the value is managed auth + tool routing, not novel capabilities.
   
Composio sits in a different layer than n8n—while n8n handles workflow automation with triggers and visual sequences, Composio focuses on routing tools for AI agents through MCP, so they're complementary rather than competitive. The free tier gives 20K tool calls monthly plus open source access, with Rube offering 1000 requests daily at no cost. Now I need to structure a response that addresses Frank's architectural questions about whether Composio solves his content studio needs without building everything immediately.Got full context from your past chats. Here's the sharp assessment:

---

**Composio: What it actually is**

Founded in 2023 by Soham Ganatra and Karan Vaidya — not "Ruben." **Rube** is their universal MCP server product, not a person. That's what you saw. Series A, $29M from Lightspeed. MIT licensed open source SDK on GitHub.

**Is it just API glue?** Yes, architecturally — and that's the point. The core value is managed OAuth, token refresh, retries, rate limits, and agent-optimized interfaces across 500+ tools. The SDK is free and open source. The platform handles the auth/routing/execution you'd otherwise spend weeks building per integration. Free tier gives 20K tool calls/month; Rube gives 1,000 requests/day free.

**Is it the missing link for Arcanea/SIS?** Partially. It solves the multi-tool auth problem you keep hitting — connecting Claude Code/Desktop to Drive, Notion, GitHub, CapCut, Postiz through one MCP endpoint instead of wiring each individually. But it doesn't replace n8n. Composio handles agent-to-tool routing; n8n handles workflow sequencing with triggers, conditional logic, and scheduled automation. They're different layers of the same stack. You need both.

**Competition to n8n?** No — complementary. n8n = event-driven workflow orchestration (cron triggers, webhooks, visual DAGs). Composio = runtime tool access for LLM agents. OpenAI's AgentKit is closer to an n8n competitor in the visual agent-builder space. Pipedream was the closest Composio alternative but Workday acquired it and its future as a standalone product is uncertain.

**Your stack decision:** Composio as MCP gateway → n8n for workflow automation → Claude Code/Agent SDK for intelligence → Postiz (self-hosted) for scheduling → local ffmpeg for processing. That's the architecture.

---

Now — the content studio. Your past chats show you've designed this system at least 4 times (Oct '25 Substack pipeline, Nov '25 content calendar, Jan '26 milestones, now). The pattern: deep architecture sessions producing comprehensive plans that don't ship because the scope keeps expanding before execution starts.

The constraint isn't strategy. It's the first 30 minutes of execution today.
```
This block is not supported on your current device yet.
```

Good, I've given Frank a clear assessment and now forcing a decision on what to build. This collapses the scope and gets to execution.Pick one per row and I'll build it in this session. The architecture conversation can continue in parallel, but something ships today.

**Frank**:

Q: Which deliverable do you want me to actually build right now?
A: idk all of them

Q: Which content stream ships first this week?
A: all

Q: Where does raw content live right now?
A: Scattered across phone + Drive + desktop

**Claude**:

Frank wants everything but that's the pattern that's kept this from shipping. I need to be direct about sequencing while still being respectful of his agency. Let me pick the highest-leverage starting point and just build it, rather than asking more questions.

The Notion database is the foundation everything else depends on. The whiteboard is strategy visualization. The React dashboard needs the data model first. The n8n workflow needs the folder structure first. So Notion is the correct first move — it defines the schema that all other systems consume.

But actually, let me think about what I can concretely build right now in this session. I can:
1. Build a Notion database structure (I have Notion MCP access)


2. Build a Miro board (I have Miro MCP access)
3. Build a React artifact for the content studio dashboard
4. Create n8n workflow JSON files

Given his scattered content situation, the most useful thing is probably the Notion content pipeline database + a clear SOP document. But I can also build a React dashboard as an artifact that he could eventually deploy to FrankX.ai. I think the highest-impact move is to build a comprehensive content studio architecture document alongside the Notion database — that gives him both the system and the blueprint for how to use it.

I need to stop deliberating and just execute. I'll build the Notion database for the content production pipeline first, then create a comprehensive content strategy and SOP document, then move on to whatever else I can fit in the session."All of them" is the answer that's produced zero shipped systems across 5 months of architecture sessions. I'm going to sequence this for you and start building.

**Execution order (dependency chain):**
1. **Notion database** — defines the data model everything else reads from
2. **Content SOP document** — SOPs per channel so you (and agents) know the process
3. **Miro whiteboard** — brand × channel × persona × funnel map (visual layer)
4. **n8n workflow** — automation layer on top of the above
5. **React dashboard** — last, because it needs all the above to be meaningful

Starting with Notion now. Building the content production pipeline database with your brands, channels, and content types baked in.
```
This block is not supported on your current device yet.
```

Let me first search for any existing content-related databases in Frank's Notion workspace to avoid duplicating.
```
This block is not supported on your current device yet.
```

He already has a "Content Pipeline" database from yesterday (2026-03-11) and an older one. Let me fetch the most recent one to see its schema before building something new or extending it.You already have a Content Pipeline database from yesterday. Let me check its schema before building on top of it or replacing it.
```
This block is not supported on your current device yet.
```

He already has a solid Content Pipeline database with relations to Brand, Channel, SOP, and Source Idea collections. Let me check the related databases to see the full system.Good — you already built a solid relational schema yesterday. Content Pipeline with relations to Brand, Channel, SOP, and Source Idea databases. Let me check the related databases to see what's populated.
```
This block is not supported on your current device yet.
```

The schema is solid. Let me check channels and SOPs too, then populate everything with real data.
```
This block is not supported on your current device yet.
```

The schema is excellent - fully relational. Brands → Channels → Pipeline → SOPs → Source Ideas. Now I need to populate it with real data. Let me populate the Brands first, then Channels, then SOPs. Let me focus on getting the data in there.

I need to populate:
1. Brands: FrankX.ai, Arcanea, AI Music Academy, AI Architect Academy, GenCreator, Trinity AI
2. Channels per brand
3. SOPs per channel type

Let me start populating.Schema is solid — fully relational with Brands → Channels → Pipeline → SOPs → Source Ideas. The problem is it's empty. Let me populate it with your actual brands, channels, and SOPs.
```
This block is not supported on your current device yet.
```

Let me try with simpler pages, fewer at a time.
```
This block is not supported on your current device yet.
```

Brands are in. Now let me populate channels. I need to map channels to brands. Let me create the channels now.Brands populated. Now channels — mapping each to the right platform, brand, cadence, and status.
```
This block is not supported on your current device yet.
```

Now let me populate the SOPs database. Let me check it first.Now SOPs — the actual operating procedures per content type. Let me check the SOP schema first.
```
This block is not supported on your current device yet.
```

Now let me populate the SOPs with real, actionable procedures. These are the SOPs that matter most for Frank's content production.Now populating SOPs with actual operational procedures — these are the ones that will make the machine work.
```
This block is not supported on your current device yet.
```

Databases are populated. Now let me create some actual content pipeline entries for this week so Frank has things to execute on immediately, and then build the Miro whiteboard and the content studio architecture document.

Actually, let me now seed the pipeline with this week's content items. And then create the comprehensive content strategy document.Databases populated. Now seeding the pipeline with this week's actual content so you have something to execute against immediately.
```
This block is not supported on your current device yet.
```

Now let me build the Miro whiteboard with the brand × channel × persona × funnel map. Let me use Miro diagram tool for this.Pipeline seeded with 8 items for this week. Now building the brand × channel × funnel whiteboard in Miro.
```
This block is not supported on your current device yet.
```

I need a Miro board ID. Let me search for Frank's existing boards first. Actually I don't have a board ID. Let me check if there's an existing board I can use, or I'll use Miro to create a new one. But actually, I don't have a "create board" tool - I can only create content on an existing board. Let me search for existing boards.

Actually, looking at the tools, I can only use context_explore with a board URL. I don't have a way to create a new board or list boards. I'll need Frank to provide a board URL, or I can use the Figma/other approach.

Let me instead build the flowchart using the Figma generate_diagram tool which creates FigJam boards. 

The Figma tool should work well here since I can leverage Mermaid syntax to generate the flowchart directly.I don't have a Miro board URL to work with. Let me build the brand × channel × funnel map as a FigJam diagram instead — same visual output, immediate creation.
```
This block is not supported on your current device yet.
```

Now let me create the comprehensive content strategy document with the full SOP and daily routine. I'll make this as a proper document file.Now building the comprehensive content strategy and daily routine document — this is the operating manual for the content machine.
```
This block is not supported on your current device yet.
```

Actually, given the complexity of the document, let me just create a comprehensive markdown document with all the content strategy, SOPs, daily routines, and architecture. This will be more practical than a Word doc for this use case since it needs to be readable and actionable. Let me create a thorough markdown file.
```
This block is not supported on your current device yet.
```

Let me also put this into the Notion Starlight Command Center as a page so Frank has it directly accessible there.
```
This block is not supported on your current device yet.
```

Now let me also create a Notion page with the content strategy under the Starlight Command Center.Now putting the operating manual directly into your Starlight Command Center in Notion.
```
This block is not supported on your current device yet.
```

Good. Now let me present the markdown file and give the summary.
```
This block is not supported on your current device yet.
```

Let me give a comprehensive summary of everything built and the key decisions/next steps.---

**Shipped this session:**

**Notion (live in Starlight Command Center):**
- 6 Brands populated (FrankX, Arcanea, AI Music, AI Architect, GenCreator, Trinity)
- 18 Channels mapped with platform, cadence, handle, status
- 8 SOPs with full operating procedures (Amsterdam Reel, LinkedIn, Opus Clip, Lore Drop, Suno, Phone Intake, Weekly Review, X Thread)
- 8 Pipeline items seeded for this week with due dates
- Content Studio Operating Manual page under Command Center

**FigJam:** Brand × Channel × Persona × Funnel map (interactive diagram)

**Document:** Full operating manual with architecture, Drive folder structure, daily routine, weekly calendar, tech stack costs, n8n workflow specs, agent KB structure, and 3-hour quickstart

---

**The Composio verdict:** It's your MCP gateway layer, not an n8n replacement. Rube gives Claude agents authenticated access to your tools. n8n orchestrates the workflows. You need both. Free tier covers your bootstrap phase.

**What's not built yet but sequenced:** n8n workflow JSON exports (need your n8n instance URL), React dashboard at FrankX.ai/admin (need your Vercel project), brand-channel relations in Notion (Notion relations need manual linking in UI for the pages we just created).

**Your move right now:** Film 3 clips during your next walk, upload to a Drive folder called Content_Inbox, and post one Amsterdam gratitude reel. That's hour 1. The system only works when content enters it.

**Frank**:

I also once bought content notion template. Maybe its more useful and you can build from it https://www.notion.so/arcanea/Content-Creation-Hub-91047d2d85f94eebb5206d8a14278593?source=copy_link

**Claude**:

The user wants me to fetch their purchased Notion content creation template to see if it's more useful than what we built, and potentially build from it.Let me pull that template and assess it against what we just built.
```
This block is not supported on your current device yet.
```

This is a purchased template from 2022-2023 era. Let me assess it vs what we built.Assessed. Here's the honest verdict:

**This template is from your 2022-2023 Web3/NFT era.** It's a purchased "Content Creation Hub" template with databases for Creator Tabs, Tools, Creations, Master Tasks, Repurpose Content, SEO, Goals, Habits, Curation Board, and Categories. The structure is decent — it has the project management layer (Creations → Tasks → Repurpose pipeline) that our new system doesn't yet have.

**What's salvageable from it:**
- **Creations database** (collection://57ac0777) — project-based tracking for multi-step content pieces
- **Repurpose Content database** (collection://3e9defcb) — explicit repurposing pipeline (our system only has it as a status, not a dedicated flow)
- **Master Tasks** (collection://4ea61bac) — task decomposition per content piece
- **SEO database** (collection://a982e742) — keyword tracking, something we haven't set up
- **Curation Board** (collection://cffbdccb) — content inspiration capture

**What's not useful:**
- 90% of the page content is your old braindump from the Akamoto/DPI/NFT/Web3 era — strategies for Uhive, Desofy, Opensea NFT funnels, Spatial metaverse rooms. All deprecated context.
- The template's databases are generic and lack your brand/channel relational model.
- No SOP library, no automation layer, no agent-ready knowledge base structure.

**My recommendation: Hybrid.** Keep the old template as a historical archive. The Starlight Command Center system we just built is architecturally superior — it has relational Brand → Channel → SOP → Pipeline linkages that the template doesn't. But we should add three things the template has that we're missing:

1. A **Repurpose Queue** database (linked from Pipeline items)
2. An **SEO Keywords** database (per brand/channel)
3. A **Curation Board** for capturing inspiration content

Want me to add those three databases to the Starlight Command Center now, or are you ready to actually go film that first reel?
