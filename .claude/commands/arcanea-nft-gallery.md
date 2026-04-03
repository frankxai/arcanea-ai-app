---
description: "NFT Forge gallery — review, stage, and approve generated PFPs for collection"
argument-hint: "<subcommand: review|stage|approve|reject|export>"
---

# /arcanea-nft-gallery — Pre-Launch Staging & Review

## What This Does

The gallery is the curation layer between generation and deployment.
Generated PFPs go through: **Generate → Gallery Review → Stage → Community Vote → Approve → Deploy**

## Workflow

```
/arcanea-nft-pfp generate     →  Raw output lands in output/nft-*/
                                        ↓
/arcanea-nft-gallery review    →  View all pending images, score with Art Director checklist
                                        ↓
/arcanea-nft-gallery stage     →  Move approved images to staging/ with metadata
                                        ↓
/arcanea-nft-gallery approve   →  Lock staged images for deployment
                                        ↓
/arcanea-nft-pfp deploy        →  IPFS upload + contract deployment
```

## Subcommands

### `/arcanea-nft-gallery review`
Open and score pending generated images.

**Workflow:**
1. Scan `output/nft-*/` for unreviewed images
2. For each image, display and score against Art Director checklist:
   - Crop correct? (20pts)
   - Starlight Mark visible? (15pts)
   - Sacred Gear reads at 48px? (15pts)
   - Traits ≤ 7? (10pts)
   - Expression cool/unbothered? (10pts)
   - Material diversity? (10pts)
   - Flat background? (5pts)
   - Palette discipline? (5pts)
   - Cultural modernity? (5pts)
   - Thumbnail test? (5pts)
3. Score ≥ 80 = auto-stage, 60-79 = manual review, < 60 = reject
4. Log scores to `output/nft-forge-tracker.xlsx` Quality Audit sheet

### `/arcanea-nft-gallery stage`
Move approved images to staging directory with full metadata.

**Workflow:**
1. Copy approved images to `output/staging/images/`
2. Generate ERC-721 metadata JSON per image using MetadataGenerator
3. Create preview grid (HTML or image montage) at `output/staging/preview.html`
4. Update tracker spreadsheet with staged status

### `/arcanea-nft-gallery approve`
Lock staged collection for deployment.

**Workflow:**
1. Display final count: X images staged, Y metadata files
2. Show rarity distribution analysis
3. Generate collection-level metadata (contractURI)
4. Create deployment-ready bundle at `output/deploy/`
5. Show pre-flight briefing with deployment costs

### `/arcanea-nft-gallery reject [id]`
Remove an image from staging and mark for regeneration.

### `/arcanea-nft-gallery export`
Export gallery as shareable format.

**Options:**
- `--html` — Static HTML gallery page (for community preview)
- `--json` — Full metadata export
- `--grid` — Image montage grid (4x4, 8x8, etc.)
- `--tracker` — Updated xlsx with all scores

## Directory Structure

```
output/
├── nft-v5/              ← Raw generation output
├── nft-batch/           ← Batch test output
├── nft-scale-test/      ← Scale test output
├── staging/             ← Approved, metadata-ready
│   ├── images/          ← Approved PNGs/JPGs
│   ├── metadata/        ← ERC-721 JSON per token
│   └── preview.html     ← Visual preview gallery
├── deploy/              ← Locked for deployment
│   ├── images/          ← Final images
│   ├── metadata/        ← Final metadata
│   └── collection.json  ← Contract-level metadata
└── nft-forge-tracker.xlsx  ← Production tracking
```

## Community Pre-Launch (Future)

For community voting before mint:
1. Export gallery as HTML preview page
2. Deploy to arcanea.ai/forge/preview (or Vercel preview)
3. Holders/community members upvote favorites
4. Top-voted pieces get rarity boost
5. Community-rejected pieces get regenerated

This creates buy-in BEFORE mint — the community helped curate the collection.
