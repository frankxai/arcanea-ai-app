// Scaffold — turn a WorldSpec into a conforming world repo on disk.
// The scaffolder IS the world template (programmatic, so it never drifts from the standard).

import { buildManifest, slugify, MANIFEST_FILE } from "./manifest.mjs";
import { writeFiles } from "./fs-world.mjs";
import { declarations } from "./source-files.mjs";
import { documentWithMetadata } from "./frontmatter.mjs";
import { relativePath } from "./world-paths.mjs";
import { genesis } from "./genesis.mjs";

async function maybeWorldEngine() {
  try {
    return await import("@arcanea/world-engine");
  } catch {
    return null;
  }
}

function characterDoc(c) {
  return documentWithMetadata(
    {
      name: c.name,
      role: c.role || "inhabitant",
      visibility: "public",
      canonLevel: 1,
    },
    `# ${c.name}\n\n${c.persona || ""}\n\n## Backstory\n${c.backstory || ""}`,
  );
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

Content licence: ${manifest.license?.spdx || "not selected"}.
Royalty terms: ${manifest.royalty ? "declared in world.arcanea.json" : "not selected"}.

Built with the [Arcanea World Repo Standard](https://arcanea.ai).
`;
}

function licenseDoc(manifest) {
  return `# Content licence declaration\n\nSPDX: ${manifest.license.spdx}\nCommercial: ${manifest.license.commercial ?? "not specified"}\nRemix: ${manifest.license.remix ?? "not specified"}\n\nCaller-supplied declaration. This summary does not include the licence text or verify rights over the world's sources.\n`;
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
  declarations(manifest);
  const contentPath = (section, file) =>
    `${relativePath(manifest.content[section], { directory: true })}/${file}`;

  const files = [
    { path: "README.md", bytes: readme(manifest) },
    {
      path: contentPath("canon", "world-bible.md"),
      bytes: worldBible(manifest),
    },
    { path: contentPath("media", ".gitkeep"), bytes: "" },
    { path: contentPath("quests", ".gitkeep"), bytes: "" },
    { path: contentPath("books", ".gitkeep"), bytes: "" },
  ];

  // Other pointers belong to the caller; policy metadata is not a write path.
  if (manifest.license?.pointer === "licenses/LICENSE.md") {
    files.push({ path: "licenses/LICENSE.md", bytes: licenseDoc(manifest) });
  }
  if (manifest.royalty?.policy === "licenses/royalty.json") {
    files.push({
      path: "licenses/royalty.json",
      bytes: JSON.stringify(manifest.royalty, null, 2) + "\n",
    });
  }

  for (const c of characters) {
    files.push({
      path: contentPath("characters", `${slugify(c.name)}.md`),
      bytes: characterDoc(c),
    });
  }
  for (const l of spec.locations || []) {
    files.push({
      path: contentPath("locations", `${slugify(l.name)}.md`),
      bytes: documentWithMetadata(
        { name: l.name, visibility: "public", canonLevel: 1 },
        `# ${l.name}\n\n${l.description || ""}`,
      ),
    });
  }
  for (const a of manifest.agents || []) {
    files.push({
      path: contentPath("agents", `${a.id}.md`),
      bytes: `# ${a.id}\n\n- harness: ${a.harness}\n- role: ${a.role}\n${a.skill ? `- skill: ${a.skill}\n` : ""}`,
    });
  }

  await writeFiles(
    dir,
    [
      { path: MANIFEST_FILE, bytes: JSON.stringify(manifest, null, 2) + "\n" },
      ...files,
    ],
    { exclusive: true },
  );
  return manifest;
}

/** The headline path: one sentence -> a living world repo on disk. */
export async function createWorld(dir, sentence, opts = {}) {
  const spec = await genesis(sentence, opts);
  if (opts.creator) spec.creator = opts.creator;
  // Enrichment is creative output, not authority to select rights or fees.
  delete spec.license;
  delete spec.royalty;
  if (opts.license != null) spec.license = opts.license;
  if (opts.royalty != null) spec.royalty = opts.royalty;
  const manifest = await scaffoldWorld(dir, spec, {
    useWorldEngine: opts.useWorldEngine !== false,
  });
  return { dir, manifest };
}
