// Providers — real model/asset backends, staged behind env keys.
// With NO keys present, every factory returns null and behaviour is identical to the
// deterministic offline path. Zero external deps: global fetch (Node 18+) + node builtins.

import { promises as fs } from "node:fs";
import path from "node:path";
import { createWorld } from "./scaffold.mjs";
import { writeManifest } from "./fs-world.mjs";

function firstJsonBlock(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("no JSON object in model output");
  return JSON.parse(text.slice(start, end + 1));
}

/** An async (prompt)=>object that calls a real LLM, or null if no key is configured. */
export function llmFromEnv(env = process.env) {
  if (env.ANTHROPIC_API_KEY) {
    return async (prompt) => {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-opus-4-8",
          max_tokens: 2048,
          messages: [{ role: "user", content: `${prompt}\n\nReturn STRICT JSON only — no prose, no markdown fences.` }],
        }),
      });
      if (!res.ok) throw new Error(`anthropic ${res.status}`);
      const data = await res.json();
      const text = (data.content || []).map((b) => b.text || "").join("");
      return firstJsonBlock(text);
    };
  }
  if (env.GEMINI_API_KEY) {
    return async (prompt) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${prompt}\n\nReturn STRICT JSON only — no prose, no markdown fences.` }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });
      if (!res.ok) throw new Error(`gemini ${res.status}`);
      const data = await res.json();
      const text = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join("");
      return firstJsonBlock(text);
    };
  }
  return null;
}

/** An async (spec)=>{url} cover generator, or null. Gated on ARCANEA_STUDIO_API_KEY. */
export function coverFromEnv(env = process.env) {
  if (!env.ARCANEA_STUDIO_API_KEY) return null;
  const base = env.ARCANEA_STUDIO_URL || "https://studio.arcanea.ai";
  return async (spec) => {
    const res = await fetch(`${base}/v1/cover`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.ARCANEA_STUDIO_API_KEY}` },
      body: JSON.stringify({
        name: spec.name,
        mood: spec.mood,
        prompt: spec.visualDna?.style || spec.tagline || spec.name,
        palette: spec.visualDna?.palette || [],
      }),
    });
    if (!res.ok) throw new Error(`studio cover ${res.status}`);
    const data = await res.json();
    return { url: data.url };
  };
}

/** An async (spec)=>{url} theme/soundtrack generator, or null. Gated on SUNO_API_KEY. */
export function themeFromEnv(env = process.env) {
  if (!env.SUNO_API_KEY) return null;
  const base = env.SUNO_API_URL || "https://api.suno.ai";
  return async (spec) => {
    const res = await fetch(`${base}/v1/generate`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.SUNO_API_KEY}` },
      body: JSON.stringify({ prompt: spec.theme?.prompt || `${spec.mood} ambient`, instrumental: true }),
    });
    if (!res.ok) throw new Error(`suno theme ${res.status}`);
    const data = await res.json();
    return { url: data.audio_url || data.url };
  };
}

/**
 * Embed chunks in place. Returns the same chunks, each with an `embedding` field.
 * With GEMINI_API_KEY: Gemini text-embedding-004 (768d) per chunk. Else embedding=null (staged no-op).
 * Tolerates per-chunk failure by leaving that embedding null.
 */
export async function embedChunks(chunks, env = process.env) {
  if (!env.GEMINI_API_KEY) {
    return chunks.map((c) => ({ ...c, embedding: null }));
  }
  const out = [];
  for (const c of chunks) {
    let embedding = null;
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${env.GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: { parts: [{ text: c.text || "" }] } }),
      });
      if (res.ok) {
        const data = await res.json();
        embedding = data.embedding?.values || null;
      }
    } catch {
      embedding = null;
    }
    out.push({ ...c, embedding });
  }
  return out;
}

/**
 * Map a buildIndex() result to upserts against the Genesis world-graph tables.
 * `client` is any object with `.from(table).upsert(rows)`. No real network — caller injects it.
 * @param {{from:(t:string)=>{upsert:(rows:object[])=>any}}} client
 */
export function supabasePersister(client) {
  return async (index, meta = {}) => {
    const upserts = {};
    const send = async (table, rows) => {
      if (!rows.length) return;
      await client.from(table).upsert(rows);
      upserts[table] = (upserts[table] || 0) + rows.length;
    };

    const worldNode = index.nodes.find((n) => n.type === "world");
    if (worldNode) {
      await send("worlds", [{
        id: worldNode.id,
        name: worldNode.title,
        premise: worldNode.premise || "",
        mood: worldNode.mood || "fantasy",
        genesis_status: meta.genesisStatus || "seeded",
      }]);
    }

    const characters = index.nodes
      .filter((n) => n.type === "character")
      .map((n) => ({ world_id: n.worldId, name: n.title, persona: n.title }));
    await send("world_characters", characters);

    const lore = index.nodes
      .filter((n) => n.type === "location" || n.type === "quest")
      .map((n) => ({ world_id: n.worldId, title: n.title, body: n.title }));
    await send("world_lore", lore);

    return { upserts };
  };
}

function assetNote(kind, url) {
  return `# ${kind}\n\n- type: ${kind}\n- url: ${url}\n- generated: provider\n`;
}

/**
 * The full provider-aware creation path. With empty env this equals offline createWorld.
 * @returns {Promise<{dir:string, manifest:object, usedLLM:boolean, usedCover:boolean, usedTheme:boolean}>}
 */
export async function createWorldWithProviders(dir, sentence, env = process.env, opts = {}) {
  const llm = llmFromEnv(env);
  const cover = coverFromEnv(env);
  const theme = themeFromEnv(env);

  const { manifest } = await createWorld(dir, sentence, { ...opts, llm });
  const usedLLM = !!llm;

  let coverResult = null;
  let themeResult = null;
  if (cover) {
    try { coverResult = await cover(manifest); } catch { coverResult = null; }
  }
  if (theme) {
    try { themeResult = await theme(manifest); } catch { themeResult = null; }
  }

  const extraFiles = [];
  if (coverResult?.url) {
    manifest.cover = coverResult.url;
    extraFiles.push({ path: "media/cover.md", bytes: assetNote("image", coverResult.url) });
  }
  if (themeResult?.url) {
    manifest.theme = { ...(manifest.theme || {}), audio: themeResult.url };
    extraFiles.push({ path: "media/theme.md", bytes: assetNote("audio", themeResult.url) });
  }

  if (extraFiles.length) {
    await writeManifest(dir, manifest);
    for (const f of extraFiles) {
      const abs = path.join(dir, f.path);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, f.bytes, "utf8");
    }
  }

  return {
    dir,
    manifest,
    usedLLM,
    usedCover: !!coverResult,
    usedTheme: !!themeResult,
  };
}
