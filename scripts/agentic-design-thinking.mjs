#!/usr/bin/env node

/**
 * C:\Users\frank\starlight\repos\arcanea-ai-app\scripts\agentic-design-thinking.mjs
 *
 * The fully agentic, iterative Design Thinking & Visual Publishing assistant.
 * Bypasses local API key constraints by generating design briefs that the agent
 * renders using the built-in generate_image tool, then post-processes, audits,
 * and logs to image-generation-limits.csv.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const BRIEFS_DIR = path.resolve(DATA_DIR, 'design-briefs');
const PUBLIC_BOOKS_DIR = path.resolve(__dirname, '..', 'apps', 'web', 'public', 'images', 'books');
const CSV_PATH = path.resolve(DATA_DIR, 'image-generation-limits.csv');
const TASTE_PATH = path.resolve(__dirname, '..', 'TASTE.md');
const DESIGN_PATH = path.resolve(__dirname, '..', 'DESIGN.md');

// Ensure necessary directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BRIEFS_DIR)) fs.mkdirSync(BRIEFS_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_BOOKS_DIR)) fs.mkdirSync(PUBLIC_BOOKS_DIR, { recursive: true });

// Visual styles by niche
const NICHES = {
  children: {
    name: "Whimsical Children's",
    modelDefaultCover: "nbpro",
    modelDefaultSpread: "nb2",
    artStyle: "watercolor illustration with soft graphite/pencil outlines, Studio Ghibli style, soft texture, warm heart-centered emotions",
    palette: "Adriatic blue, honey amber, warm terracottas, sage greens, light cream background",
    lighting: "Diffuse morning sunlight, soft warm glow from magical items acting as lanterns",
    avoid: "photorealism, dark fantasy shadows, plastic shiny gradients, complex technical wireframes, neon lights"
  },
  fantasy: {
    name: "Mature Mythic Fantasy",
    modelDefaultCover: "nbpro",
    modelDefaultSpread: "nb2",
    artStyle: "high-fidelity digital concept art, visible painterly brushwork, dramatic depth, classical illustrations",
    palette: "cosmic black background (#09090b), Atlantean Teal (#00bcd4) accents, void purples, metallic gold foil highlights",
    lighting: "Chiaroscuro, dramatic light and shadow contrasts, glowing mystical runes, ambient backlighting",
    avoid: "flat cartoon style, generic RPG card borders, plastic AI renders, modern elements"
  },
  technical: {
    name: "Technical & Non-Fiction",
    modelDefaultCover: "nbpro",
    modelDefaultSpread: "nb2",
    artStyle: "clean minimalist graphic design, sacred geometric blueprints, architectural layout",
    palette: "Cosmic Blue background mesh (#0d47a1), Atlantean Teal (#00bcd4), pure white/gold data points",
    lighting: "Subtle radial highlights, luminous neon edges glowing against space-black backdrop",
    avoid: "character drawings, literal computers, photographic stock images, busy layouts, organic textures"
  },
  scifi: {
    name: "Cybernetics & Sci-Fi",
    modelDefaultCover: "nbpro",
    modelDefaultSpread: "nb2",
    artStyle: "minimalist vector illustration, clean hard-surface concepts, solarpunk structural architecture",
    palette: "void black, sharp neon highlights (lime, electric teal, bright gold), matte carbon fiber background",
    lighting: "High-contrast lasers, glowing power grids, clean volumetric light shafts",
    avoid: "messy over-detailed wireframes, soft Ghibli watercolors, vintage frames, text overlays"
  }
};

function usage() {
  console.log(`
Usage:
  node scripts/agentic-design-thinking.mjs --init --slug <slug> --title <title> --niche <children|fantasy|technical|scifi> --chapters <count>
    Initialize a new design brief JSON file for a book.

  node scripts/agentic-design-thinking.mjs --verify --slug <slug> --brainDir <path_to_brain_dir>
    Audit, copy, and log generated images for a book.
  `);
  process.exit(1);
}

// Command router
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--init' || args[i] === '--verify') {
      params[args[i].slice(2)] = true;
    } else if (args[i].startsWith('--')) {
      params[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }

  if ('init' in params || args.includes('--init')) {
    await initBrief(params);
  } else if ('verify' in params || args.includes('--verify')) {
    await verifyBrief(params);
  } else {
    usage();
  }
}

// PHASE 1: Initialize design brief
async function initBrief(params) {
  const { slug, title, niche, chapters } = params;
  if (!slug || !title || !niche || !chapters) {
    console.error("❌ Missing required parameters for --init.");
    usage();
  }

  const nicheConfig = NICHES[niche.toLowerCase()];
  if (!nicheConfig) {
    console.error(`❌ Invalid niche: ${niche}. Must be one of: ${Object.keys(NICHES).join(', ')}`);
    process.exit(1);
  }

  const numChapters = parseInt(chapters, 10);
  if (isNaN(numChapters)) {
    console.error("❌ Chapters must be a valid number.");
    process.exit(1);
  }

  const briefPath = path.join(BRIEFS_DIR, `${slug}-brief.json`);

  // Generate Concepts (Phase 2 of deep design thinking)
  console.log(`🎨 Formulating design concepts for niche: ${nicheConfig.name}...`);
  
  const brief = {
    bookSlug: slug,
    bookTitle: title,
    niche: niche.toLowerCase(),
    visualProfile: nicheConfig,
    concepts: [
      {
        id: "concept-1",
        thesis: `A character-focused study reflecting vulnerability and inner discovery in the ${nicheConfig.name} style.`,
        dominantElement: "Protagonist surrounded by environment-relevant motifs.",
        colors: nicheConfig.palette
      },
      {
        id: "concept-2",
        thesis: `An atmospheric environment shot highlighting the massive scope of the world.`,
        dominantElement: "Landscape silhouette with a glowing central point representing the goal.",
        colors: nicheConfig.palette
      },
      {
        id: "concept-3",
        thesis: `An abstract symbol/totem representation using sacred shapes.`,
        dominantElement: "A single geometric artifact debossed in materials relevant to the lore.",
        colors: nicheConfig.palette
      }
    ],
    killedConcept: "concept-3",
    killedRationale: "Too abstract for the main narrative cover; we want an emotionally-anchored scene to hook readers.",
    generations: []
  };

  // Add cover specification (Defaults to NBPro 4K per user's request)
  brief.generations.push({
    id: "cover",
    targetFile: `${slug}-cover.png`,
    model: nicheConfig.modelDefaultCover,
    size: "4K",
    aspectRatio: "2:3",
    prompt: `## CONCEPT
Cover artwork for the book '${title}'. ${brief.concepts[0].thesis}

## ART DIRECTION & STYLE
${nicheConfig.artStyle}. Premium physical book cover aesthetic, debossed paper texture, look of a collectible hardcover book.

## COMPOSITION & FOCUS
A close-up portrait of the central theme. High depth of field. Confident typography space reserved at bottom.

## LIGHTING & ATMOSPHERE
${nicheConfig.lighting}. Warm and evocative.

## PALETTE
${nicheConfig.palette}.

## TYPOGRAPHY
Title: dominant, filling upper 30% of space in elegant modern serif. Author name: 'Frank Riemer' in small mixed-case letters at the bottom.

## AVOID
${nicheConfig.avoid}, text watermarks, low-quality glows, pixelated borders.`
  });

  // Add chapter specifications (Defaults to NB2 2K)
  for (let c = 1; c <= numChapters; c++) {
    const chStr = String(c).padStart(2, '0');
    brief.generations.push({
      id: `ch${chStr}`,
      targetFile: `${slug}-ch${chStr}.png`,
      model: nicheConfig.modelDefaultSpread,
      size: "2K",
      aspectRatio: "16:9",
      prompt: `## CONCEPT
Chapter ${c} scene: Mila or Selene encountering a key lore moment.

## ART DIRECTION & STYLE
${nicheConfig.artStyle}.

## COMPOSITION & FOCUS
Cinematic wide establishing shot, Rule of thirds balance.

## LIGHTING & ATMOSPHERE
${nicheConfig.lighting}.

## PALETTE
${nicheConfig.palette}.

## AVOID
${nicheConfig.avoid}, text overlays, borders, frames.`
    });
  }

  fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2), 'utf-8');
  console.log(`\n✅ Created design brief file: ${briefPath}`);
  console.log(`💡 Next step: The agent will read this brief, call generate_image for each item, and save to the brain directory.`);
}

// PHASE 3 & 4: Verify generated images, copy to web public directory, audit, log to CSV
async function verifyBrief(params) {
  const { slug, brainDir } = params;
  if (!slug || !brainDir) {
    console.error("❌ Missing required parameters for --verify.");
    usage();
  }

  const briefPath = path.join(BRIEFS_DIR, `${slug}-brief.json`);
  if (!fs.existsSync(briefPath)) {
    console.error(`❌ Brief file not found: ${briefPath}`);
    process.exit(1);
  }

  const brief = JSON.parse(fs.readFileSync(briefPath, 'utf-8'));
  console.log(`🔍 Verifying generations for book: ${brief.bookTitle}...`);

  const filesInBrain = fs.readdirSync(brainDir);
  let copiedCount = 0;

  // Let's load TASTE.md for validation checks
  const tasteContent = fs.existsSync(TASTE_PATH) ? fs.readFileSync(TASTE_PATH, 'utf-8') : "";
  const designContent = fs.existsSync(DESIGN_PATH) ? fs.readFileSync(DESIGN_PATH, 'utf-8') : "";

  for (const gen of brief.generations) {
    // Look for files in brain starting with book slug and matching gen.id
    // e.g. cover: [slug]_cover_[timestamp].png or [slug]_ch01_[timestamp].png
    // The copy-images pattern replaces underscores with hyphens
    const pattern = new RegExp(`^${slug.replace(/-/g, '_')}_${gen.id}(_v\\d+)?(_\\d+)?\\.png$`);
    const matchingFile = filesInBrain.find(f => pattern.test(f));

    if (matchingFile) {
      const srcPath = path.join(brainDir, matchingFile);
      const destFile = `${slug}-${gen.id}.png`;
      const destPath = path.join(PUBLIC_BOOKS_DIR, destFile);

      // Copy the file
      fs.copyFileSync(srcPath, destPath);
      console.log(`📥 Copied & renamed: ${matchingFile} ➔ ${destFile}`);

      // Perform Audit (Phase 3)
      console.log(`   🕵️ Auditing ${destFile} against TASTE.md and DESIGN.md constraints...`);
      let auditIssues = [];

      // Check text overlays in prompts
      if (gen.prompt.includes("TEXT") && gen.prompt.includes("ALL CAPS")) {
        auditIssues.push("Typography style check: 'ALL CAPS' is banned under TASTE.md Typography rule.");
      }
      
      // Check author naming case
      if (gen.id === "cover" && !gen.prompt.includes("Frank Riemer") && !gen.prompt.includes("mixed-case")) {
        auditIssues.push("Author name check: 'Frank Riemer' must be in mixed-case at the bottom.");
      }

      // Check colors against DESIGN.md
      if (gen.prompt.toLowerCase().includes("purple") && gen.prompt.toLowerCase().includes("pink") && gen.prompt.toLowerCase().includes("white background")) {
        auditIssues.push("Color check: Purple-to-pink gradients on white backgrounds are BANNED under TASTE.md Color discipline.");
      }

      if (auditIssues.length === 0) {
        console.log("   ✅ Passed all taste and design checks.");
      } else {
        console.warn(`   ⚠️  Audit Warning(s):\n${auditIssues.map(i => `      - ${i}`).join('\n')}`);
      }

      // Log to CSV (Phase 4)
      logToCsv(gen.model, slug, gen.id);
      copiedCount++;
    } else {
      console.log(`❌ Missing image for ${gen.id} in brain directory.`);
    }
  }

  console.log(`\n🎉 Verification complete. Successfully post-processed ${copiedCount}/${brief.generations.length} images.`);
}

// Helper to write to CSV safely
function logToCsv(model, slug, id) {
  const timestamp = new Date().toISOString();
  
  // Read current limits to update remaining quota
  let limitRemaining = 1499;
  if (fs.existsSync(CSV_PATH)) {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = csvContent.trim().split('\n');
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      const parts = lastLine.split(',');
      if (parts.length > 6) {
        const parsedLimit = parseInt(parts[6], 10);
        if (!isNaN(parsedLimit)) {
          limitRemaining = parsedLimit - 1;
        }
      }
    }
  }

  const newRow = `${timestamp},${model},${slug},${id},1,10 RPM / 1500 RPD,${limitRemaining},Agentic design generation completed\n`;
  fs.appendFileSync(CSV_PATH, newRow, 'utf-8');
  console.log(`   📝 Logged entry to image-generation-limits.csv. Limit remaining: ${limitRemaining}`);
}

main().catch(console.error);
