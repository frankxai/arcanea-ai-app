import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  MACHINE_PREFLIGHT_SCHEMA,
  buildStorageEvidence,
  deriveMachinePosture,
  hashJson,
  validateMachinePreflightReceipt,
} from "./lib/arcanea-machine-preflight.mjs";

const ROOT = process.cwd();
const AUTHORITY_ROOT = join(
  ROOT,
  "planning-with-files/arcanea-visual-authority",
);

function argsToObject(values) {
  const result = {};
  for (let index = 2; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = values[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for ${key}`);
    }
    result[key.slice(2)] = value;
    index += 1;
  }
  return result;
}

function ensureInside(path, parent, label) {
  const absolute = resolve(path);
  const absoluteParent = resolve(parent);
  if (
    absolute !== absoluteParent &&
    !absolute.startsWith(`${absoluteParent}\\`) &&
    !absolute.startsWith(`${absoluteParent}/`)
  ) {
    throw new Error(`${label} must remain inside ${absoluteParent}.`);
  }
  return absolute;
}

function readStoragePlan(args) {
  const storagePath = resolve(
    args["storage-input"] ??
      join(homedir(), ".starlight", "storage-intelligence", "latest.json"),
  );
  if (!existsSync(storagePath)) {
    throw new Error(
      `Storage evidence is missing: ${storagePath}. Run the Starlight quick storage sensor before capture.`,
    );
  }
  return JSON.parse(readFileSync(storagePath, "utf8"));
}

function readPlan(args) {
  if (args.input) {
    return JSON.parse(readFileSync(resolve(args.input), "utf8"));
  }
  let command;
  if (process.platform === "win32") {
    const located = spawnSync("where.exe", ["pp.ps1"], {
      encoding: "utf8",
      windowsHide: true,
    });
    const ppScript = located.stdout
      .split(/\r?\n/)
      .map((value) => value.trim())
      .find(Boolean);
    if (located.status !== 0 || !ppScript) {
      throw new Error("Could not resolve the installed pp.ps1 wrapper.");
    }
    command = {
      file: "powershell.exe",
      args: [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        ppScript,
        "preflight",
        "--workload",
        "overnight",
        "--json",
      ],
    };
  } else {
    command = {
      file: "pp",
      args: ["preflight", "--workload", "overnight", "--json"],
    };
  }
  const result = spawnSync(command.file, command.args, {
    cwd: ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
  if (![0, 2].includes(result.status ?? -1) || !result.stdout.trim()) {
    throw new Error(
      `Peak Performance preflight failed: ${result.stderr.trim() || `exit ${result.status}`}`,
    );
  }
  return JSON.parse(result.stdout);
}

try {
  const args = argsToObject(process.argv);
  const ttlMinutes = Number(args["ttl-minutes"] ?? "15");
  if (!Number.isInteger(ttlMinutes) || ttlMinutes < 5 || ttlMinutes > 30) {
    throw new Error("--ttl-minutes must be an integer from 5 through 30.");
  }
  const plan = readPlan(args);
  const storagePlan = readStoragePlan(args);
  if (
    plan.workload !== "overnight" ||
    !["allow", "bounded", "hold"].includes(plan.decision) ||
    !Number.isFinite(Date.parse(plan.timestamp)) ||
    !Number.isInteger(plan.budget?.maxParallelism) ||
    plan.budget.maxParallelism < 1 ||
    !Array.isArray(plan.hardBlocks) ||
    !Array.isArray(plan.constraints)
  ) {
    throw new Error(
      "Input must be a complete `pp preflight --workload overnight --json` plan.",
    );
  }
  const checkedAt = new Date(plan.timestamp);
  const storageEvidence = buildStorageEvidence(storagePlan);
  const storageCheckedAt = new Date(storageEvidence.generatedAt);
  const expiresAt = new Date(
    Math.min(checkedAt.getTime(), storageCheckedAt.getTime()) +
      ttlMinutes * 60 * 1000,
  ).toISOString();
  const ppPlanHash = hashJson(plan);
  const performancePosture = plan.decision;
  const posture = deriveMachinePosture(performancePosture, storageEvidence);
  const blockingConditions = [
    ...plan.hardBlocks,
    ...(storageEvidence.mediaGenerationAllowed
      ? []
      : [
          `Storage is ${storageEvidence.freePercent}% free; image generation requires at least ${storageEvidence.mediaAdmissionPercent}%.`,
        ]),
  ];
  const receiptBody = {
    schema: MACHINE_PREFLIGHT_SCHEMA,
    workload: "image-generation",
    sourceWorkload: plan.workload,
    performancePosture,
    posture,
    maxParallelCalls: Math.min(1, plan.budget.maxParallelism),
    checkedAt: checkedAt.toISOString(),
    expiresAt,
    checkedBy: "peak-performance/pp + starlight-storage-intelligence",
    evidence: `pp ${plan.workload} plan ${ppPlanHash}; storage plan ${storageEvidence.rawPlanHash}; ${plan.summary}`,
    blockingConditions,
    ppPlan: plan,
    ppPlanHash,
    storageEvidence,
  };
  const receipt = {
    ...receiptBody,
    receiptHash: hashJson(receiptBody),
  };
  validateMachinePreflightReceipt(receipt, {
    now: Date.now(),
    requireExecutable: false,
  });
  if (args.write) {
    const outputPath = ensureInside(args.write, AUTHORITY_ROOT, "Receipt path");
    const serialized = `${JSON.stringify(receipt, null, 2)}\n`;
    if (existsSync(outputPath)) {
      if (readFileSync(outputPath, "utf8") !== serialized) {
        throw new Error(
          `Receipt already exists with different content: ${outputPath}`,
        );
      }
    } else {
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, serialized, "utf8");
    }
    console.log(
      `Captured ${receipt.posture} image-generation preflight: ${relative(ROOT, outputPath).replaceAll("\\", "/")} · ${receipt.receiptHash}`,
    );
  } else {
    console.log(JSON.stringify(receipt, null, 2));
  }
  if (receipt.posture === "hold") process.exit(2);
} catch (error) {
  console.error(`Preflight capture failed: ${error.message}`);
  process.exit(2);
}
