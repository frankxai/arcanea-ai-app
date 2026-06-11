// Scaffold — turn a WorldSpec into a conforming world repo on disk.
// The scaffolder IS the world template (programmatic, so it never drifts from the standard).

import { buildManifest, slugify } from "./manifest.mjs";
import { writeManifest, writeFiles } from "./fs-world.mjs";
import { genesis } from "./genesis.mjs";

async function maybeWorldEngine() {
  try {
    return await import("@arcanea/world-engine");
  } catch {
    return null;
  }
}

function characterDoc(c) {
  return `---
name: ${c.name}
role: ${c.role || "inhabitant"}
visibility: public
canonLevel: 1
---

# ${c.name}

${c.persona || ""}

## Backstory
${c.backstory || ""}
`;
}

function worldBible(manifest) {
  const laws = (manifest.laws || []).map((l, i) => `${i + 1}. ${l}`).join("\n");
  const palette = (manifest.visualDna?.palette || []).join(", ");
  return `---
visibility: public
canonLevel: 1
---

# ${manifest.name}

> ${manifest.tagline || ""}

**Genesis:** ${manifest.genesisPrompt || ""}

## Premise
${manifest.premise || ""}

## The Laws
${laws}

## Visual DNA
- **Palette:** ${palette}
- **Style:** ${manifest.visualDna?.style || ""}
- **Motifs:** ${(manifest.visualDna?.motifs || []).join(", ")}
`;
}

function readme(manifest) {
  return `# ${manifest.name}

${manifest.tagline || ""}

An Arcanea world. The repo is the source of truth — portable, ownable, agent-editable.
See \`world.arcanea.json\`. World id: \`${manifest.id}\`.

Built with the [Arcanea World Repo Standard](https://arcanea.ai).
`;
}

function licenseDoc(manifest) {
  return `# License\n\nSPDX: ${manifest.license?.spdx || "CC-BY-4.0"}\nCommercial: ${!!manifest.license?.commercial}\nRemix: ${manifest.license?.remix || "allow-attribution"}\n\nThis world's canon is owned by its creator (\`${manifest.creator?.handle}\`).\n`;
}

/**
 * @param {string} dir   target folder
 * @param {object} spec  a WorldSpec (from genesis() or hand-authored)
 */
export async function scaffoldWorld(dir, spec, { useWorldEngine = true } = {}) {
  const we = useWorldEngine ? await maybeWorldEngine() : null;

  // Reuse world-engine for richer characters/locations when the workspace link is present.
  let characters = spec.characters || [];
  if (we?.generateCharacter && characters.length) {
    characters = characters.map((c) => {
      try {
        const gen = we.generateCharacter({ name: c.name });
        return { ...gen, ...c, persona: c.persona, backstory: c.backstory };
      } catch {
        return c;
      }
    });
  }

  const manifest = buildManifest({ ...spec, agents: spec.agents });

  const files = [
    { path: "README.md", bytes: readme(manifest) },
    { path: "canon/world-bible.md", bytes: worldBible(manifest) },
    { path: "licenses/LICENSE.md", bytes: licenseDoc(manifest) },
    { path: "licenses/royalty.json", bytes: JSON.stringify(manifest.royalty, null, 2) + "\n" },
    { path: "media/.gitkeep", bytes: "" },
    { path: "quests/.gitkeep", bytes: "" },
    { path: "books/.gitkeep", bytes: "" },
  ];

  for (const c of characters) {
    files.push({ path: `characters/${slugify(c.name)}.md`, bytes: characterDoc(c) });
  }
  for (const l of spec.locations || []) {
    files.push({
      path: `locations/${slugify(l.name)}.md`,
      bytes: `---\nname: ${l.name}\nvisibility: public\ncanonLevel: 1\n---\n\n# ${l.name}\n\n${l.description || ""}\n`,
    });
  }
  for (const a of manifest.agents || []) {
    files.push({ path: `agents/${a.id}.md`, bytes: `# ${a.id}\n\n- harness: ${a.harness}\n- role: ${a.role}\n${a.skill ? `- skill: ${a.skill}\n` : ""}` });
  }

  await writeManifest(dir, manifest);
  await writeFiles(dir, files);
  return manifest;
}

/** The headline path: one sentence -> a living world repo on disk. */
export async function createWorld(dir, sentence, opts = {}) {
  const spec = await genesis(sentence, opts);
  if (opts.creator) spec.creator = opts.creator;
  const manifest = await scaffoldWorld(dir, spec, { useWorldEngine: opts.useWorldEngine !== false });
  return { dir, manifest };
}
