import { readFileSync, mkdirSync, writeFileSync, realpathSync } from "node:fs";
import { dirname, resolve, relative, isAbsolute, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { compilePrivateReview, privateReviewSql } from "./lib/arcanea-private-review.mjs";

// Deliberately offline: an operator reviews the SQL before executing through a scoped connection.
const args = process.argv.slice(2);
if (args.length !== 4) {
  console.error("Usage: node scripts/import-arcanea-private-review.mjs MANIFEST CATALOG REVIEW_INPUT PRIVATE_OUTPUT_DIR");
  process.exit(2);
}
try {
  const repo = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
  const output = resolve(args[3]);
  mkdirSync(output, { recursive: true, mode: 0o700 });
  const rel = relative(repo, realpathSync(output));
  if (!rel || (!rel.startsWith(".." + sep) && rel !== ".." && !isAbsolute(rel))) {
    throw new Error("Private output must be outside the public source repository");
  }
  const review = JSON.parse(readFileSync(args[2], "utf8"));
  const bundle = compilePrivateReview(readFileSync(args[0]), readFileSync(args[1]), review);
  writeFileSync(resolve(output, "private-review-records.json"), JSON.stringify(bundle, null, 2) + "\n", { mode: 0o600, flag: "wx" });
  writeFileSync(resolve(output, "private-review-import.sql"), privateReviewSql(bundle), { mode: 0o600, flag: "wx" });
  console.log(`Prepared ${bundle.records.length} private reference records; database unchanged.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
