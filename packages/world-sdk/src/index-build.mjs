// Index build — the derived layer. Parse a world (repo) into world-graph nodes + embed-ready
// chunks. This is what the Supabase index/render cache is rebuilt from on every push.
// One direction only: repo -> index. Never the reverse.

import { parseFrontmatter } from "./fs-world.mjs";

const CHUNK_MAX = 1200;

function chunkMarkdown(text) {
  const { body } = parseFrontmatter(text);
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const chunks = [];
  let buf = "";
  for (const b of blocks) {
    if ((buf + "\n\n" + b).length > CHUNK_MAX && buf) {
      chunks.push(buf);
      buf = b;
    } else {
      buf = buf ? buf + "\n\n" + b : b;
    }
  }
  if (buf) chunks.push(buf);
  return chunks;
}

function sectionOf(path) {
  const top = path.split("/")[0];
  return ["canon", "characters", "locations", "quests", "books"].includes(top) ? top : "other";
}

function titleOf(text, fallback) {
  const { data, body } = parseFrontmatter(text);
  if (data.name) return data.name;
  const h = /^#\s+(.+)$/m.exec(body);
  return h ? h[1].trim() : fallback;
}

/**
 * @param {{manifest:object, files:{path:string,bytes:Buffer|string,visibility?:string,isText?:boolean}[]}} world
 * @returns {{ worldId:string, embedding:{model:string,dim:number}, nodes:object[], chunks:object[] }}
 */
export function buildIndex(world) {
  const { manifest, files } = world;
  const nodes = [
    { type: "world", id: manifest.id, title: manifest.name, mood: manifest.mood, premise: manifest.premise },
  ];
  const chunks = [];

  for (const f of files) {
    if (!/\.(md|mdx)$/i.test(f.path)) continue;
    if ((f.visibility || "public") !== "public") continue; // private content never enters the index
    const text = typeof f.bytes === "string" ? f.bytes : f.bytes.toString("utf8");
    const section = sectionOf(f.path);
    const title = titleOf(text, f.path);

    if (section === "characters" || section === "locations" || section === "quests") {
      nodes.push({ type: section.replace(/s$/, ""), id: f.path, title, worldId: manifest.id });
    }
    chunkMarkdown(text).forEach((c, i) => {
      chunks.push({ id: `${f.path}#${i}`, worldId: manifest.id, path: f.path, section, title, text: c });
    });
  }

  return {
    worldId: manifest.id,
    embedding: { model: manifest.index?.embeddingModel || "gemini-text-embedding-004", dim: manifest.index?.dim || 768 },
    nodes,
    chunks,
  };
}
