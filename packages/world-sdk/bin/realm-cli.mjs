import { promises as fs } from "node:fs";
import {
  openRealmGraph,
  realmContinuity,
  realmImpact,
  exportRealmGraph,
} from "../src/realm-graph.mjs";

/** Read one explicit local metadata file; no provider, repository or canon writes. */
export async function runRealmCommand(args) {
  const [action, repoRoot, commit, overlayPath, firstId, secondId] = args;
  if (!(
    (action === "continuity" && args.length === 6) ||
    (action === "impact" && args.length === 5) ||
    (action === "export" && args.length === 4)
  )) {
    throw new Error(
      "usage: realm continuity|impact|export <repo> <full-commit> <staging.json> [character-id scene-id|change-id]",
    );
  }
  const handle = await fs.open(overlayPath, "r");
  let overlay;
  try {
    if (!(await handle.stat()).isFile())
      throw new Error("Realm input must be a regular file.");
    const buffer = Buffer.alloc(1_000_001);
    let count = 0;
    while (count < buffer.length) {
      const { bytesRead } = await handle.read(
        buffer,
        count,
        buffer.length - count,
        null,
      );
      if (!bytesRead) break;
      count += bytesRead;
    }
    if (count > 1_000_000) throw new Error("Realm input exceeds 1 MB.");
    overlay = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(
        buffer.subarray(0, count),
      ),
    );
  } finally {
    await handle.close();
  }
  const graph = await openRealmGraph(repoRoot, commit, overlay);
  const output =
    action === "continuity"
      ? realmContinuity(graph, firstId, secondId)
      : action === "impact"
        ? realmImpact(graph, firstId)
        : exportRealmGraph(graph);
  return JSON.stringify(output, null, 2);
}
