# Frank's prompts -- Content production studio setup with composio and agent team

Source uuid: 0b96e173-df99-4969-b557-fed37c3b437a
Created: 2026-03-11T23:34:51.760134Z

Verbatim, chronological.

## Turn 0

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

## Turn 2

Q: Which deliverable do you want me to actually build right now?
A: idk all of them

Q: Which content stream ships first this week?
A: all

Q: Where does raw content live right now?
A: Scattered across phone + Drive + desktop

## Turn 4

I also once bought content notion template. Maybe its more useful and you can build from it https://www.notion.so/arcanea/Content-Creation-Hub-91047d2d85f94eebb5206d8a14278593?source=copy_link
