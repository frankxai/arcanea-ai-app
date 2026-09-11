import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { verifyExternalSourceFile } from "./lib/arcanea-external-source-evidence.mjs";

function getArg(name, fallback = null) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

try {
  const root = process.cwd();
  const sourcePath = getArg("file");
  if (!sourcePath) throw new Error("--file is required.");
  const evidenceId = getArg(
    "evidence-id",
    "creator-supplied-tenfold-constitution-v1-0-level99",
  );
  const campaignPath = resolve(
    root,
    getArg("campaign", "apps/web/data/arcanea-visual-campaign.v1.json"),
  );
  const campaign = JSON.parse(readFileSync(campaignPath, "utf8"));
  const evidence = campaign.meta?.externalSourceEvidence?.find(
    (item) => item.id === evidenceId,
  );
  if (!evidence) {
    throw new Error(`No campaign external-source evidence exists for ${evidenceId}.`);
  }
  const observed = verifyExternalSourceFile(resolve(root, sourcePath), evidence);
  console.log(
    `External visual source verified: ${evidence.id}, ${observed.bytes} bytes, sha256 ${observed.sha256}.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
