/**
 * appendToMemory must not lose another writer's notes.
 *
 * MEMORY.md is shared by several agent processes. A read-modify-write append
 * (read the file, write back `current + addition`) drops everything another
 * process wrote in between, and the loss is silent. Two child processes
 * appending at the same time is the smallest thing that actually reproduces
 * it — a single-threaded test cannot interleave the read and the write.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const WORKER = fileURLToPath(new URL("./append-worker.mjs", import.meta.url));
// Tuned until the bug actually reproduces: 2 workers x 40 notes on an empty
// file lost nothing, because the processes barely overlap. 4 workers x 250
// notes against a pre-filled file loses ~93% of notes on the old
// read-modify-write path, and takes the seed content down with it.
const NOTES_PER_WORKER = 250;
const WORKERS = ["a", "b", "c", "d"];
const SEED = `# Memory
${"x".repeat(200_000)}
`;

describe("MemoryBridge.appendToMemory — concurrent writers", () => {
  it("keeps every note when several processes append at once", async () => {
    const dir = mkdtempSync(join(tmpdir(), "arcanea-append-"));
    const outputPath = join(dir, "MEMORY.md");
    writeFileSync(outputPath, SEED, "utf-8");

    try {
      await Promise.all(
        WORKERS.map((label) =>
          run(
            process.execPath,
            [
              "--import",
              "tsx",
              WORKER,
              outputPath,
              label,
              String(NOTES_PER_WORKER),
            ],
            { cwd: dir },
          ),
        ),
      );

      const written = readFileSync(outputPath, "utf-8");
      const missing: string[] = [];
      for (const label of WORKERS) {
        for (let i = 0; i < NOTES_PER_WORKER; i++) {
          if (!written.includes(`note ${label}-${i}`))
            missing.push(`${label}-${i}`);
        }
      }

      assert.equal(
        missing.length,
        0,
        `lost ${missing.length}/${NOTES_PER_WORKER * WORKERS.length} notes: ${missing.slice(0, 8).join(", ")}`,
      );
      assert.ok(
        written.startsWith(SEED),
        "pre-existing content survives intact",
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
