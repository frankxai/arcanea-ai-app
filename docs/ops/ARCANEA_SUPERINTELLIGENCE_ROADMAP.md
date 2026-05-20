# 🌌 ARCANEA SUPERINTELLIGENCE ROADMAP
**Version:** 1.0.0 (May 2026)  
**Status:** Approved  
**Moniker Active:** AG (Antigravity)  
**Authorizer:** Frank  

---

## 1. The Five-Substrate Split Matrix

The ecosystem operates across five distinct architectural layers, maintaining a clean boundary between generic open-source pipes and proprietary worldbuilding assets:

| Layer | Domain | Repository / Path | Open/Closed | Role |
| :--- | :--- | :--- | :--- | :--- |
| **SIS** | Universal Intelligence | `Starlight-Intelligence-System/` | Open | Brain stem: context, memory graph, voice operator, wake-word daemon (:7373) |
| **ACOS** | Developer Harness | `agentic-creator-os/` | Open | Spine: Workspace-level orchestration, developer tools, slash commands |
| **Kura** | Capture Layer | `arcanea-vault/` (to rename `kura`) | Open | Capture: Local-first MV3 extension capturing AI conversation history to Markdown |
| **Arcanea** | Worldbuilding Soul | `Arcanea/` (monorepo) | Mixed | Sovereign Engine: Structuring lore, compilations, smart contracts, 16 Luminors |
| **FrankX** | Personal Studio | `FrankX/`, `frankx.ai-vercel-website/` | Closed | Dashboard: Personal creator OS and specialized visual formats |

---

## 2. E2E Capture to Publishing Data Flow

```
[ AI Conversations ]
        │
        ▼ (Captured locally by Kura Chrome Extension)
[ ~/Downloads/Kura/ ]
        │
        ▼ (Opt-in "Send to Arcanea" CORS POST)
[ arcanea.ai/api/kura/import ]
        │
        ▼ (Structured by World Engine)
[ Supabase World Graph ] (12-axis Lore, Characters, Artifacts, timelines)
        │
        ▼ (Written/Refined via ACOS /author-council)
[ book/ Manuscripts ] (Chapter compilations, reader rating loops)
        │
        ▼ (Minted & Registered via arcanea-onchain)
[ Smart Contract splits ] (Success splits, world keys)
        │
        ▼ (Vercel Auto-deploy)
[ Immersive Web Landing ] (Visually exquisite universe sites)
```

---

## 3. Multimodal & Generative Video Engine

We integrate state-of-the-art AI workflows to make worldbuilding a tactile, cinematic, real-time experience.

### Google I/O Omni Loop
* **Architecture**: Direct low-latency real-time voice-to-voice stream using native multimodal models.
* **Flow**: Web clients in `/room/[persona]` connect via WebSocket through the local `:7373` voice operator, bypassing old multi-stage STT/TTS latency to deliver character voice dialogue under 1.5 seconds response time.

### Higgsfield MCP Server
* **Architecture**: A Model Context Protocol server exposing tools to generate cinematic, physics-aware motion videos based on world assets.
* **Workflow**:
  1. Creator details an entity in the World Graph.
  2. The system triggers `higgsfield_generate_motion` with prompt parameters optimized for high-end cinematic aesthetics ("shot, not generated").
  3. The resulting 4-second motion clip is saved as an asset and rendered as the dynamic background of the entity's lore card.

---

## 4. Frictionless, Zero-Liability Community Publishing

To scale book and world submissions without administrative overhead or hosting liability, we build a decentralized, automated self-service pipeline:

1. **Submission**: Community creators package their worlds/books and submit them via a GitHub pull request or by pinning the directory on IPFS/Arweave.
2. **Review Swarm (Aiyami Guardian)**:
   * A sandboxed GitHub Action workflow triggers the automated review swarm.
   * **Formatting Lint**: Checks that YAML coordinates match the strict spec format.
   * **Design Lint**: Scans for font corruption and enforces banned styling parameters.
   * **Canon Check**: Runs vector-similarity and LLM evaluations against `.arcanea/lore/CANON_LOCKED.md` to ensure zero core lore contradictions.
3. **Automated Merges & Gateway Display**:
   * **Failure**: The agent comments on the PR detailing the required fixes and shifts the PR to Draft. No human support is required.
   * **Success**: The agent merges the PR to the public world index. The Arcanea gateway client reads this public decentralized index, resulting in **zero liability** for hosting copyright-sensitive content.

---

## 5. Genius Revenue Loops & Pricing Architecture

We monetize at the intersection of developer utility, elite design templates, and creator success:

1. **Gumroad Creator/Developer Kits ($49 - $149)**: One-time purchases for local-first developer harnesses, advanced prompt books, and pre-packaged Obsidian Worldbuilding templates.
2. **Premium Next.js/Vercel Templates ($79 - $249)**: Gorgeous, pre-configured Next.js sites built with Geist/Instrument Serif typography and Atlantean glassmorphism. Optimized for Vercel auto-deploys with built-in voice `/room` and Higgsfield motion support.
3. **Mädchen Whop / Founders Edition ($99/mo or $899/yr)**: High-ticket recurring revenue for access to Frank's exclusive mastermind and hosted GPU render credits.
4. **Onchain Success Royalties (0.5% - 2.5%)**: Deeply integrated into `arcanea-onchain`. When community creators sell books, market access keys, or trade worlds, a micro-royalty split is automatically routed to the Arcanea treasury.
