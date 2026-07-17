---
title: "3D worlds from AI-generated images"
uuid: 21926794-75d1-4b14-a1bc-0713f790578a
created: 2026-02-24T11:14:31.730214Z
updated: 2026-02-24T11:15:25.576911Z
source: claude.ai export
---

# 3D worlds from AI-generated images

**Frank**:

Hey. Is there any capability that's cloud code can already utilize with MCP servers. To create 3 d worlds So I have this idea within Arkenia that someone creates images, they create a vision of something. And then that the AI agents create a 3 d room filled with the assets that they generated with the images on the walls and, you know, some unique experience. I know there has been some technology like spatial, 3 g s, and also some NFT related galleries that had these 3 d rooms. Could also have them templates. And I'm, you know, I'm thinking to advance this there's any GitHub repository we can build up, and if any of these already has an MCP server that we could utilize, do a broad research and think about this whole idea and develop it further and refine it of what's possible and what we could make possible and what we need to invent or develop

**Claude**:

Let me research what's available for 3D world generation via MCP servers and Claude Code, focusing on the Arcanea use case.
```
This block is not supported on your current device yet.
```

Good, I have a solid picture of the MCP ecosystem. Let me also check for image-to-3D pipelines specifically and Gaussian Splatting MCP options.
```
This block is not supported on your current device yet.
```

Now I have enough to give a comprehensive, high-density architectural response. Let me synthesize this into the Arcanea context.Here's the full landscape mapped to what Arcanea actually needs to build.

---

## What Already Exists (MCP-Connectable Today)

**Three.js MCP servers — two worth knowing:**

1. **`mcp-server-threejs` (buryhuang)** — Sketchfab integration. Claude Code can search Sketchfab via natural language → pull downloadable GLB/GLTF → assemble into Three.js scenes. This is the asset acquisition layer.

2. **`three-js-mcp` (Loc Chung)** — WebSocket-based real-time scene manipulation. Claude Code sends commands → live Three.js scene mutates. Object creation, movement, rotation, state query. No direct code edits. March 2025, MIT.

3. **`mcp-game-asset-gen` (Flux159)** — The one that matters most for Arcanea. It chains: `image_to_3d` (Hunyuan3D or TRELLIS) → GLB output, texture generation, multi-view reference sheets, sprite sheets. It auto-generates reference images from prompt if no input provided. **This is your image → 3D object pipeline, already MCP-wired.**

4. **`mcp-three` (Basement Studio)** — GLTF/GLB → React Three Fiber JSX conversion. Bridges Arcanea's Next.js stack cleanly.

5. **BlenderMCP** — Claude controls Blender directly via MCP. For complex room layout, lighting, scene composition — this is a serious tool, not a toy.

---

## The Gap: What Doesn't Exist Yet

The specific Arcanea experience — **"user generates images → AI agents construct a personal 3D room with those images as environment assets"** — requires a pipeline that nobody has assembled end-to-end. The pieces exist; the orchestration layer is the invention.

Here's what needs building:

```
User Images
    ↓
[Agent 1: Image Intelligence]
  → Classify image content (guardian? godbeast? landscape?)
  → Extract semantic metadata (mood, palette, archetype)
  → Tag for room role (wall art, pedestal object, ambient texture, floor)
    ↓
[Agent 2: Asset Generation — mcp-game-asset-gen]
  → image_to_3d → GLB for 3D-fied objects
  → generate_texture → tileable environment textures from image palette
  → generate_object_sheet → multi-view references for consistency
    ↓
[Agent 3: Room Architect — Three.js MCP or BlenderMCP]
  → Select room template (shrine, vault, observatory, garden...)
  → Place assets spatially: images on walls as texture planes, 3D objects on pedestals
  → Apply lighting from palette, ambient audio hook (Vibe OS integration)
  → Output: self-contained Three.js scene or exportable GLB scene
    ↓
[Agent 4: Shareable Experience]
  → Embed in Next.js via React Three Fiber
  → URL-addressable room per user/session
  → Optional: export as splat for photorealistic variant
```

---

## The 3DGS Angle (Spatial / Gaussian Splat)

This is where it gets genuinely novel. Instead of hard polygon rooms:

- **DiffSplat** (ICLR 2025) — converts single image or text → 3D Gaussian Splat in 1-2 seconds. If a user generates a Guardian image, DiffSplat can produce a volumetric 3DGS object from it. No MCP server exists for this yet. **First-mover opportunity.**
- **SuperSplat** — open source browser-based splat viewer/editor. Could be embedded in Arcanea rooms as the photorealistic layer.
- The NFT gallery archetype (OnCyber, Spatial.io) used Three.js polygon rooms. The leap Arcanea makes is splat-composited rooms — photorealistic assets, no poly budget anxiety, runs in browser via `@react-three/fiber` + `@react-three/drei`'s splat support.

---

## The Arcanea-Specific Architecture

The intellectual property here isn't the 3D tech — it's the **room cosmology logic**:

- Each Arcanea image upload maps to a **Guardian or Godbeast archetype** → determines room template (Lyssandria's room ≠ Draconia's room)
- The **9 Guardian templates** become 9 room archetypes: visual language, sacred geometry layout, lighting frequency, ambient track from AI Music Academy
- User's generated images become the **living walls** — literally their creations populating the mythological space
- The room is simultaneously a gallery, a lore artifact, and a creator identity token

This is what none of the existing tools have — the **semantic layer** that maps AI-generated art to spatial narrative. That's the moat.

---

## Build Order

**Week 1-2:** Wire `mcp-game-asset-gen` into Claude Code. Validate image → GLB pipeline with Arcanea test images. Establish quality floor.

**Week 3-4:** Build the Room Architect agent using Three.js MCP (Loc Chung) for web-first, BlenderMCP for high-fidelity exports. Start with one Guardian template (Lyssandria as the launch archetype).

**Week 5-6:** React Three Fiber embed in Next.js. Room is a URL. Share-native.

**Parallel track:** Open a DiffSplat MCP server as a custom Claude Code tool. The wrapper is thin — call the Python inference pipeline, return `.ply`/`.splat` path. This becomes Arcanea's differentiated rendering layer.

---

The core invention to claim: **a cosmologically-aware 3D room generation system where AI agents interpret image semantics, map to Guardian archetypes, and assemble spatially coherent rooms from user-generated assets.** The MCP ecosystem gives you the rendering and generation primitives. The Arcanea mythology gives the orchestration its meaning — and that's what makes it a product rather than a demo.

Which Guardian do you want to use as the first room template? That choice drives everything about the spatial grammar.
