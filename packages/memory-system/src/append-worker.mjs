/**
 * Child process for memory-bridge.concurrency.test.ts.
 *
 * Appends N numbered notes to a shared MEMORY.md through MemoryBridge. Two of
 * these running at once is what exposes a read-modify-write append: each
 * process would write back the content it read, discarding the other's notes.
 *
 * argv: <outputPath> <label> <count>
 */
import { MemoryBridge } from "./memory-bridge.ts";

const [outputPath, label, countRaw] = process.argv.slice(2);
const bridge = new MemoryBridge({ outputPath, maxLines: 100000 });

for (let i = 0; i < Number(countRaw); i++) {
  bridge.appendToMemory(`note ${label}-${i}`);
}
