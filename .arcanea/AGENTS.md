# AGENTS.md — Arcanea Agent Configuration

> Standard adopted by 60K+ projects. Any AI coding tool reads this.

## Project Type
Creative AI platform with mythology-driven world-building, NFT generation, and community agents.

## Key Agent: NFT Art Director

When working on NFT generation, image creation, or collection management:

### Required Reading
1. `.claude/skills/arcanea-nft-pfp/references/art-direction-bible.md`
2. `.claude/agents/nft-art-director.md`
3. `.arcanea/lore/CANON_LOCKED.md`

### NFT Generation Rules
- Use `/nft` or `/nft-pfp` or `/arcanea-nft-pfp` to activate
- Use `/nft-strategy` for planning before generation
- Model: Read API key from `.nano-banana-config.json` (NEVER hardcode)
- Default model: `gemini-3.1-flash-image-preview` (Nano Banana 2)
- Premium model: `gemini-3-pro-image-preview` (Nano Banana Pro)
- Output to: `output/collection-v1/` (images/, metadata/, prompts/)
- Track all pieces in `output/collection-v1/characters.json`
- ERC-721 metadata in `output/collection-v1/metadata/`
- Naming: `The Creators #XXXX` (numbered, NOT named characters)

### Canon Rules (NEVER Violate)
- Godbeasts are CREATURES, not character origins
- Bonded who bond with Godbeasts = "Bonded" origin + "Bond Tier: Godbeast" sub-trait
- Origin classes from FACTIONS.md only (12 canon origins)
- Starlight Mark shapes locked per rank (dot→diamond→triangle→pentagon→star)
- Sacred Gear: 6 types only (Gate Chain, Starlight Collar, Resonance Visor, Crystal Crown, Void Pauldron, Ember Gauntlet)

### Crop Styles (choose per piece)
- `headshot` — extreme close-up, face fills 85%, max detail
- `portrait` — head+shoulders, standard PFP (was default)
- `upperbody` — head to waist, hands visible, more gear (NEW recommended default)
- `showcase` — three-quarter body, full outfit visible

### Visual Presets (choose per collection/piece)
- `arcanea-premium` — 3D, SSS, material diversity (Clone X quality)
- `cyberpunk` — neon accents, chrome, holographic, Blade Runner
- `ethereal` — luminous, prismatic, dreamlike, transcendent
- `dark` — chiaroscuro, dramatic shadows, power aesthetic
- `minimal` — Apple-clean, restrained, premium simplicity

### Prompt Engineering
- NEVER use "masterpiece", "best quality" (noise tokens)
- ALWAYS specify exact crop, angle, background color
- ALWAYS include Starlight Mark instruction
- ALWAYS include ONE Sacred Gear description
- Maximum 7 visual traits per character
- Check `characters.json` before generating to avoid duplicate trait combos

## Key Agent: Lore Guardian

When working on story, characters, world-building:
1. Read `.arcanea/lore/CANON_LOCKED.md` first
2. Read `.arcanea/lore/FACTIONS.md` for origin classes
3. Read `.arcanea/lore/VISUAL_DOCTRINE.md` for faction aesthetics
4. Never invent new origin classes without explicit approval
5. Never contradict existing canon

## Repository Map
- `arcanea-ai-app` (origin) — main web platform (arcanea.ai)
- `arcanea` (oss) — OSS skills, agents, lore
- `arcanea-nft-forge` — NFT generation engine (standalone)
- `.arcanea/` — shared brain (all tools read from here)
