# Stitch MCP Integration & Engineering Standards for Arcanea

## Overview
This document synthesizes the integration strategy for Stitch via MCP (`https://stitch.withgoogle.com/docs/mcp/setup`) into the Arcanea ecosystem. It aligns Stitch's generative UI capabilities with Arcanea's rigorous design and engineering standards as defined in `TASTE.md`, `DESIGN.md`, and `AGENTS.md`.

## Core Philosophy: Genius-Driven, Thoughtful Use
Stitch is a powerful tool for generating UI components and screens, but within Arcanea, it must never produce "AI-slop." Its usage is strictly governed by Arcanea's **7 Gates of Excellence**, specifically Gate 3 (Visual Identity) and Gate 7 (Strategy).

Stitch is not a replacement for deliberate design; it is an amplifier for High-Fidelity Ideation and Prototyping, strictly bound to Arcanea's tokenized design system.

## 1. Setup & Integration Protocol

### The `.mcp.json` Configuration
While the `shadcn-ui` skill from Google Labs (Stitch) is already harvested (priority HIGH per `HARVESTED_SKILLS.md`), the formal Stitch MCP integration must be handled deliberately.

Arcanea currently uses a layered MCP stack for design work (e.g., `magic`, `v0`, `figma-remote-mcp`). If Stitch MCP is added, it must operate under the following constraints:

1.  **Code is Truth:** Like Figma, Stitch is a sketchpad/generator. The final code in `apps/web/` is the ultimate source of truth.
2.  **No Raw Constants:** Any output from Stitch must be scrubbed of raw hex codes before entering the main tree. It must utilize `@arcanea/design-system` v0.3.0 tokens exclusively.
3.  **Strict Token Mapping:** The `stitch_upload_design_md` and `stitch_create_design_system` tools MUST be seeded with a sanitized version of Arcanea's `DESIGN.md` and `starlight/design.md` contracts to ensure Stitch's internal generations respect Arcanea's Color Spectrum (bg `#05070f`, gold `#c5a26f`, indigo `#3f2a6b`, crimson `#6b2a2a`, teal `#2a5c5c`).

## 2. Best Practices & High-Quality Engineering Standards

### For Engineering Agents (Claude, Gemini, etc.)
When an Arcanea agent uses Stitch MCP tools:

-   **Pre-Flight:** Agents must read `TASTE.md` before initiating a generation prompt (`stitch_generate_screen_from_text`).
-   **Prompt Engineering for Stitch:** Prompts must explicitly forbid banned aesthetics.
    *   *Bad:* "Create a dashboard for lore management."
    *   *Good:* "Generate a dashboard for lore management using a cosmic dark theme. Use deep shadows and parallax planes. Do not use flat vectors or saturated primary colors. Ensure the typography relies on Geist and Instrument Serif. The background should be ethereal deep void indigo."
-   **Motion Discipline (Gate 3):** Stitch-generated components must not include cargo-culted animations (e.g., default `duration: 0.3` fades or continuous `height: auto` shifts). Any generated motion must be replaced or refined with Arcanea's custom Framer Motion variants (e.g., `[0.22, 1, 0.36, 1]` for linear reveals).
-   **Typography:** The agent must ensure Stitch outputs use `Geist` (display/body), `Instrument Serif` (accent), and `Geist Mono` (code). `Inter` and `Space Grotesk` are strictly forbidden in new UI.

### Workflow Integration
1.  **Ideation (`stitch_generate_screen_from_text`):** Rapidly visualize a new feature (e.g., a new Creator Academy dashboard).
2.  **Variant Exploration (`stitch_generate_variants`):** Explore layout density and structural options.
3.  **Extraction & Tokenization:** The generated React/HTML/CSS is *never* merged directly. The agent extracts the structural DOM and translates all inline styles or generic Tailwind classes into `@arcanea/design-system` tokens and Radix UI primitives.
4.  **Verification:** The `design-verifier` agent blocks the PR if it detects raw hex codes, banned fonts, or generic 3D assets.

## 3. Deployment Targets: Hubs and Sites

Stitch's capabilities are best utilized for high-density, complex interaction surfaces where rapid prototyping saves significant engineering time.

### Primary Targets

1.  **`arcanea.ai` (SaaS Dashboard & Creator Workspace):**
    *   **Use Case:** Rapidly prototyping new modular panels for the World Graph, lore tracking, and agent orchestration.
    *   **Focus:** High data density, clear hierarchy, and adherence to the "Sovereignty is the moat" strategy (Gate 7).

2.  **`council/convening` (Multi-user Lore Synchronization):**
    *   **Use Case:** Designing the complex interfaces required for real-time collaboration and conflict resolution between different creators' lore canons.
    *   **Focus:** Spatial organization of data, clear status indicators, and distinct visual states for "proposed," "rejected," and "canon."

3.  **Creator Academies (`apps/web/components/studio/*`):**
    *   **Use Case:** Generating the layout for interactive learning modules, text-tabs, and visual encyclopedia entries.
    *   **Focus:** Editorial elegance (leveraging Instrument Serif), readability, and structured navigation.

### Surfaces to Avoid
-   **Marketing Hero Sections (e.g., The Dashboard Hero):** These require bespoke, hand-crafted WebGL, React Three Fiber, or specific generated video assets (via Higgsfield/Fal) as defined in `DESIGN.md`. Stitch is too generic for Arcanea's Track-B set-pieces.

## Conclusion
By treating Stitch MCP as a high-fidelity drafting tool strictly governed by the Arcanea Design Canon, we can accelerate UI development without compromising the product's sovereign, magical, and premium aesthetic. Every pixel generated by Stitch must earn its place in the repository through rigorous review against `TASTE.md`.
