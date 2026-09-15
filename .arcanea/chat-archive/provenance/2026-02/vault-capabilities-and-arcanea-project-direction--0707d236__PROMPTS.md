# Frank's prompts -- Vault capabilities and Arcanea project direction

Source uuid: 0707d236-446a-4eab-a66a-fd4908833013
Created: 2026-02-16T16:07:38.207613Z

Verbatim, chronological.

## Turn 0

Check Vault capabilities - and if this really the Arcanea Vault I wanted to build. I think slightly different but also interesting idea

* Need to do this week:  1. Sign up for affiliates — Railway, n8n, Vercel, Better Stack
  2. Create Lemon Squeezy products — I flip status to active once you have variant IDs
  3. Create GitHub template repos — configs are ready in data/template-configs/
* Check and improve FrankX shop experience and use state of art vercel for it 
* Check new Book experience 
* We need to work hard to have products that deliver - the PDFs, and clear vault or space where they live in and work this week with Loom and other recording for SOPs and Academy experience first just from Notion wiki later for Skool or so.
* Package and market and build product for ACOS and its extension packs - genius strategy needed huge potential and main seller I think we got good product but needs to be tested and used better. 
* Music for Coworker something for later right: 
  Task: Upload 10 Songs to DistroKid with AI Disclosure
  Goal: Log into distrokid.com, navigate to the upload flow, and upload the first 3 singles with full metadata and AI disclosure.
  Context: DistroKid is the only major distributor accepting AI music with disclosure. These tracks were created with Suno AI (paid account = commercial license). Uploading as singles first to test streaming
  performance before releasing EPs.
  Prerequisites:
  - DistroKid account ($22/year) — needs to be created at distrokid.com if not already done
  - Desktop access to download audio files from Suno
  - Suno paid account credentials
  Steps:
  1. If DistroKid account doesn't exist: Go to distrokid.com → Sign Up → Select "Musician" plan ($22.99/year) → Complete payment
  2. Download audio files from Suno:
    - Log into suno.com
    - For each track, download HQ audio (MP3 or WAV):
        - Trust in Yourself
      - The Awakening
      - Vibe O S
    - Save to Desktop in a folder named distrokid-wave-1/
  3. Upload to DistroKid (repeat for each track):
    - Go to distrokid.com → "Upload" button
    - Select audio file
    - Track Details:
        - Artist Name: FrankX
      - Track Title: [use exact title from Suno]
      - Genre: [see list above — e.g., "Pop Punk" for Trust in Yourself]
      - Language: English (or Japanese for J-rock tracks)
      - Explicit: No
    - AI Disclosure (REQUIRED):
        - Check "This track contains AI-generated content"
      - In disclosure field: "Music created using Suno AI with commercial license. Original composition and direction by FrankX."
    - Release Date: Set to 2 weeks from today (DistroKid recommends lead time for playlist pitching)
    - Distribution: Select all platforms (Spotify, Apple Music, Amazon, YouTube Music, TikTok, etc.)
    - Album Art: Use placeholder for now (you can update later with Nano Banana covers)
    - Credits:
        - Composer: FrankX
      - Producer: Suno AI / FrankX
    - ISRC: Let DistroKid auto-generate
    - Splits: 100% FrankX (you're the only artist)
  4. Spotify Playlist Pitching (after upload):
    - DistroKid provides Spotify for Artists access
    - For each track, submit to Spotify editorial playlists via the "Pitch" feature
    - Pitch angles:
        - Trust in Yourself: "Uplifting pop punk anthem for anyone building confidence"
      - The Awakening: "African-influenced world music journey"
      - Vibe O S: "Laid-back hip hop with female vocals and signature production"
  5. Verification:
    - After upload, DistroKid shows a status page with distribution progress
    - Screenshot the confirmation page for each track
    - Save screenshots to Desktop as distrokid-confirmation-[track-name].png
  Important notes:
  - AI disclosure is MANDATORY — without it, tracks can be removed
  - Release date should be 2+ weeks out for best playlist consideration
  - Don't rush — take 5-10 min per track to ensure metadata is accurate
  - If a field is unclear, leave it default rather than guessing
  - DistroKid charges extra for YouTube Content ID ($4.95/year) — skip for now
  After completion: You'll have 3 singles submitted and awaiting distribution. It takes 1-5 days for tracks to go live on Spotify/Apple Music. DistroKid will email when live.

## Turn 2

Deployed to Production (Live at frankx.ai) 🎉
  Commit: 1407e82 — already pushed and deployed
  What Shipped:
  1. Premium 644KB PDF (/products/soulbook-7-pillars-framework.pdf)
  - Dark theme with gold accents
  - 3 pages: Cover + 7 Pillars + How to Use
  - Designed for digital viewing (iPad, screen)
  - Generated via Puppeteer with embedded HTML/CSS
  - Live at: https://frankx.ai/products/soulbook-7-pillars-framework.pdf
  2. Liquid Glass Framework Page (/soulbook/framework)
  - Animated background: Floating gradient orbs (amber/purple/cyan) with blob animations
  - Glass pillar cards: Multi-layer shadows, refraction edge highlights, backdrop blur
  - Liquid metal download button: Shimmer animation, gradient that breathes on hover
  - Premium typography: Gold gradient text, proper hierarchy
  - Print-optimized: Clean black/white output when using browser Print
  - Live at: https://frankx.ai/soulbook/framework
  3. PDF Generation Script (scripts/generate-soulbook-pdf.mjs)
  - Self-contained HTML generator with embedded styles
  - Puppeteer-based rendering (no dev server needed)
  - Memory-safe flags for WSL compatibility
  - Run: node scripts/generate-soulbook-pdf.mjs
  Design Principles Applied:
  From your Liquid Glass Futurism spec:
  - ✅ Multi-layer background with gradients + base color
  - ✅ backdrop-filter: blur(40-60px) for glass effect
  - ✅ Layered box-shadow (ambient + direct + contact)
  - ✅ Top-edge refraction highlights (white/15 gradient)
  - ✅ Liquid metal buttons (gradient + inset highlights + shimmer)
  - ✅ Floating blob animations (translate + scale)
  - ✅ Premium color palette (amber gold, dark navy, subtle accents)
  Also Shipped:
  - Music admin dashboard (/admin/music)
  - Multi-artist support in music catalog
  - Enhanced /music page
  Production URL: https://frankx.ai/soulbook/framework
  The liquid glass aesthetic creates that premium 2026 design feel — sophisticated 3D depth, glass refraction, and breathing animations. Zero clay, zero pastel, all dark premium tech.
✻ Worked for 6m 18s

* soulbook need to check
* Book reading needs check - maybe we can even prompt Claude Coworker to test and check this for CC and provide input?

## Turn 4

mail.frankx.ai frankx.ai/soulbook https://www.frankx.ai/blog/oracle-genai-agents-vs-langgraph-crewai-2026 

Fix that PDF not download or email possible why? https://www.frankx.ai/downloads/preview/soulbook 

https://www.frankx.ai/downloads/preview/soulbook

mail.frankx.ai

From <https://resend.com/domains/2984a2e4-a5a0-47a0-802c-c61bcec252c2> 

 
https://www.frankx.ai/content - should be build - with plan connect with content studio and ai agents manage and visualize for me there embedded all linkedin, twitter, instagram posts maybe even across multiple accounts we configure and manage? 
AI Architect Academy, FrankX, Starlight Intelligence, Arcanea and then Arcanea Sub-Brands and Characters - what do each of these social media and email and then agent - as claude code or n8n pipeline and workflow or something else we need to manage each and all of these content production workflows and inteconnect with frankx.ai/content-studio/ from which we can plan and deploy, and maybe we need content-studio/pr-agents/ or so from which we can trigger n8n or claude code workflow that allows to send our posts to influencer or partners or be autonomous PR like Openclaw or Eliza and also we build dashboard to show all they do and deliver? We need swarms of agents talking about all our stuff right? 
--- 

https://www.frankx.ai/blog/frankx-intelligence-ecosystem-complete-guide - I love this one! I realize GenCreator need to become more New Rich Philosophy and ultra cool community we can embed and link towards, Vibe OS more viby music and have Vibe songs embedded (can you use our Music index see all public Vibe OS Songs and decide which) 
and we need to create more smoother interconnected development and deliver system for all these products, lets plan next iteration of this article but also product development, web-development of our site and githubs, and skool, slack and whatever that really creates ultra high quality state of the art 2026 products, systems and experience? 


--- 

Fix that PDF not download or email possible why? https://www.frankx.ai/downloads/preview/soulbook 

https://www.frankx.ai/downloads/preview/soulbook

mail.frankx.ai

From <https://resend.com/domains/2984a2e4-a5a0-47a0-802c-c61bcec252c2> 

 
https://www.frankx.ai/content - should be build - with plan connect with content studio and ai agents manage and visualize for me there embedded all linkedin, twitter, instagram posts maybe even across multiple accounts we configure and manage? 
AI Architect Academy, FrankX, Starlight Intelligence, Arcanea and then Arcanea Sub-Brands and Characters - what do each of these social media and email and then agent - as claude code or n8n pipeline and workflow or something else we need to manage each and all of these content production workflows and inteconnect with frankx.ai/content-studio/ from which we can plan and deploy, and maybe we need content-studio/pr-agents/ or so from which we can trigger n8n or claude code workflow that allows to send our posts to influencer or partners or be autonomous PR like Openclaw or Eliza and also we build dashboard to show all they do and deliver? We need swarms of agents talking about all our stuff right? 
--- 

https://www.frankx.ai/blog/frankx-intelligence-ecosystem-complete-guide - I love this one! I realize GenCreator need to become more New Rich Philosophy and ultra cool community we can embed and link towards, Vibe OS more viby music and have Vibe songs embedded (can you use our Music index see all public Vibe OS Songs and decide which) 
and we need to create more smoother interconnected development and deliver system for all these products, lets plan next iteration of this article but also product development, web-development of our site and githubs, and skool, slack and whatever that really creates ultra high quality state of the art 2026 products, systems and experience? 


---
