#!/usr/bin/env node
/**
 * Arcanea durable workflow readiness packet.
 *
 * This is intentionally non-mutating. It audits whether Eve/Vercel Workflow
 * code is allowed yet, records the missing prerequisites, and produces an
 * operator packet for the first safe implementation wave.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const jsonOnly = args.has('--json');

const OUTPUT_BASENAME = 'ARCANEA_DURABLE_WORKFLOW_READINESS_PACKET_2026-07-05';
const JSON_OUTPUT = path.join(PROJECT_ROOT, 'planning-with-files', `${OUTPUT_BASENAME}.json`);
const MD_OUTPUT = path.join(PROJECT_ROOT, 'planning-with-files', `${OUTPUT_BASENAME}.md`);

function absolute(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
}

function fileExists(relativePath) {
  try {
    return fs.statSync(absolute(relativePath)).isFile();
  } catch {
    return false;
  }
}

function dirExists(relativePath) {
  try {
    return fs.statSync(absolute(relativePath)).isDirectory();
  } catch {
    return false;
  }
}

function readText(relativePath) {
  return fs.readFileSync(absolute(relativePath), 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(readText(relativePath));
  } catch (error) {
    return { __readError: error.message };
  }
}

function collectPackageJsonFiles() {
  const ignored = new Set(['.git', '.next', '.turbo', '.vercel', '.worktrees', 'node_modules', 'dist', 'build']);
  const files = [];

  function walk(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (ignored.has(entry.name)) continue;
        walk(full);
      } else if (entry.isFile() && entry.name === 'package.json') {
        files.push(path.relative(PROJECT_ROOT, full).replace(/\\/g, '/'));
      }
    }
  }

  walk(PROJECT_ROOT);
  return files.sort();
}

function packageDeps(pkg) {
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies,
    ...pkg.optionalDependencies,
    ...pkg.peerDependencies,
  };
}

function dependencyHits(packageFiles, matcher) {
  const hits = [];

  for (const file of packageFiles) {
    const json = readJson(file);
    if (json.__readError) continue;
    const deps = packageDeps(json);
    for (const [name, version] of Object.entries(deps)) {
      if (matcher(name)) hits.push({ file, name, version });
    }
  }

  return hits;
}

function check(status, lane, id, summary, details = {}) {
  return { status, lane, id, summary, ...details };
}

function buildReport() {
  const packageFiles = collectPackageJsonFiles();
  const workflowDependencies = dependencyHits(packageFiles, (name) =>
    name === 'workflow' || name === '@vercel/workflow' || name.startsWith('@workflow/')
  );
  const eveDependencies = dependencyHits(packageFiles, (name) => name === 'eve');
  const workflowDocs = fileExists('node_modules/workflow/docs/README.md')
    || fileExists('node_modules/@vercel/workflow/docs/README.md');
  const eveDocs = fileExists('node_modules/eve/docs/README.md');
  const durableBriefPath = 'planning-with-files/ARCANEA_DURABLE_WORKFLOW_RELEASE_BRIEF_2026-07-05.md';
  const durableBrief = fileExists(durableBriefPath) ? readText(durableBriefPath) : '';
  const workflowContractPath = 'apps/web/lib/genesis/workflow-contract.ts';
  const workflowContractTestPath = 'apps/web/lib/genesis/__tests__/workflow-contract.test.ts';
  const workflowContract = fileExists(workflowContractPath) ? readText(workflowContractPath) : '';
  const workflowContractTest = fileExists(workflowContractTestPath) ? readText(workflowContractTestPath) : '';
  const checks = [];

  checks.push(workflowDependencies.length > 0
    ? check('pass', 'ai-engineering', 'workflow-dependency-present', 'Workflow dependency is present in package manifests.', {
      dependencies: workflowDependencies,
    })
    : check('warn', 'ai-engineering', 'workflow-dependency-present', 'Workflow dependency is not installed; do not write Vercel Workflow runtime code yet.', {
      installCommand: 'pnpm add workflow --filter @arcanea/web',
    }));

  checks.push(workflowDocs
    ? check('pass', 'ai-engineering', 'workflow-docs-present', 'Workflow bundled docs are present in node_modules.', {
      docs: ['node_modules/workflow/docs/README.md', 'node_modules/@vercel/workflow/docs/README.md'],
    })
    : check('warn', 'ai-engineering', 'workflow-docs-present', 'Workflow bundled docs are absent; read installed docs before writing workflow code.'));

  checks.push(eveDependencies.length > 0
    ? check('pass', 'ai-engineering', 'eve-dependency-present', 'Eve dependency is present in package manifests.', {
      dependencies: eveDependencies,
    })
    : check('warn', 'ai-engineering', 'eve-dependency-present', 'Eve dependency is not installed; do not write Eve runtime code yet.', {
      note: 'Repo policy requires pnpm for package changes. The Eve skill says bundled docs under node_modules/eve/docs are the source of truth after installation/scaffold.',
    }));

  checks.push(eveDocs
    ? check('pass', 'ai-engineering', 'eve-docs-present', 'Eve bundled docs are present in node_modules.', {
      docs: ['node_modules/eve/docs/README.md'],
    })
    : check('warn', 'ai-engineering', 'eve-docs-present', 'Eve bundled docs are absent; read installed Eve docs before writing Eve code.'));

  const requiredBriefPhrases = [
    'genesisProofRun',
    'receive intent',
    'generate bounded Gift Object',
    'Right-use review step',
    'Artifact/export step',
    'Metrics step',
    'Do not add Vercel Workflow or Eve runtime code in this slice',
    'Keep Eve out of the public app runtime',
  ];
  const missingBriefPhrases = requiredBriefPhrases.filter((phrase) => !durableBrief.includes(phrase));

  checks.push(missingBriefPhrases.length === 0
    ? check('pass', 'product-doctrine', 'genesis-proof-run-specified', 'Durable Genesis proof workflow candidate and safety boundaries are specified.', {
      evidence: durableBriefPath,
    })
    : check('blocker', 'product-doctrine', 'genesis-proof-run-specified', 'Durable workflow brief is missing required implementation/safety phrases.', {
      evidence: durableBriefPath,
      missingBriefPhrases,
    }));

  const requiredContractPhrases = [
    'GENESIS_PROOF_WORKFLOW_SCHEMA_VERSION',
    'GENESIS_PROOF_WORKFLOW_STEPS',
    'buildGenesisProofWorkflowPacket',
    'assertGenesisProofWorkflowPacketSafe',
    'runtimeCodeAllowed: false',
    'Workflow or Eve runtime packages',
    'Workflow metrics must not contain raw intent text',
  ];
  const requiredContractTestPhrases = [
    'workflow-contract',
    'buildGenesisProofWorkflowPacket',
    'assertGenesisProofWorkflowPacketSafe',
    'metricsPayload.includes(rawIntent), false',
    'workflowPackageRequired',
    'eveDocsRequired',
  ];
  const missingContractPhrases = requiredContractPhrases.filter((phrase) => !workflowContract.includes(phrase));
  const missingContractTestPhrases = requiredContractTestPhrases.filter((phrase) => !workflowContractTest.includes(phrase));
  const forbiddenRuntimeImports = [
    'from "workflow"',
    "from 'workflow'",
    'from "workflow/api"',
    "from 'workflow/api'",
    'from "eve"',
    "from 'eve'",
    '@vercel/workflow',
    '@workflow/',
  ].filter((phrase) => workflowContract.includes(phrase));

  checks.push(
    workflowContract && workflowContractTest && missingContractPhrases.length === 0 && missingContractTestPhrases.length === 0 && forbiddenRuntimeImports.length === 0
      ? check('pass', 'ai-engineering', 'genesis-workflow-contract-ready', 'Dependency-free Genesis proof workflow contract and redaction test are present.', {
        evidence: [workflowContractPath, workflowContractTestPath],
        note: 'This is a contract boundary only. Runtime Workflow/Eve code remains gated until installed docs are present and read.',
      })
      : check('blocker', 'ai-engineering', 'genesis-workflow-contract-ready', 'Genesis proof workflow contract is missing, under-specified, or imports runtime packages too early.', {
        evidence: [workflowContractPath, workflowContractTestPath],
        missingContractPhrases,
        missingContractTestPhrases,
        forbiddenRuntimeImports,
      }),
  );

  const runtimeCodeAllowed = workflowDependencies.length > 0 && workflowDocs && eveDependencies.length > 0 && eveDocs;
  const implementationReady = workflowDependencies.length > 0 && workflowDocs;
  const packetReady = true;
  const pass = checks.filter((entry) => entry.status === 'pass').length;
  const warn = checks.filter((entry) => entry.status === 'warn').length;
  const blockers = checks.filter((entry) => entry.status === 'blocker').length;

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    repo: PROJECT_ROOT,
    summary: {
      decision: runtimeCodeAllowed ? 'runtime-ready' : 'runtime-blocked-packet-ready',
      implementationReady,
      runtimeCodeAllowed,
      packetReady,
      pass,
      warn,
      blockers,
    },
    inputs: {
      durableBrief: durableBriefPath,
      packageManifestCount: packageFiles.length,
      packageFiles,
    },
    officialSources: [
      {
        label: 'Vercel Workflows install and TypeScript durable workflow directives',
        url: 'https://vercel.com/docs/workflows',
      },
      {
        label: 'Vercel Workflow concepts and use step directive',
        url: 'https://vercel.com/docs/workflows/concepts',
      },
      {
        label: 'Eve skill source-of-truth rule',
        path: 'C:/Users/frank/.agents/skills/eve/SKILL.md',
      },
    ],
    targetWorkflow: {
      name: 'genesisProofRun',
      type: 'Vercel Workflow first, Eve internal operator second',
      contractFiles: [
        'apps/web/lib/genesis/workflow-contract.ts',
        'apps/web/lib/genesis/__tests__/workflow-contract.test.ts',
      ],
      firstImplementationFiles: [
        'apps/web/lib/workflows/genesis-proof-run.ts',
        'apps/web/app/api/genesis/workflow/route.ts',
        'apps/web/lib/workflows/__tests__/genesis-proof-run.test.ts',
      ],
      durableSteps: [
        'intake: receive intent, drift face, mission lane, source route',
        'gift: generate bounded Gift Object and persist step output',
        'world_seed: generate laws, characters, visual DNA, first proof',
        'right_use_review: check source, commercial, and canon boundaries',
        'artifact_export: produce Markdown/JSON export packet',
        'metrics: emit safe activation events without prompt text',
      ],
    },
    nextActions: [
      {
        id: 'install-workflow-docs-first',
        command: 'pnpm add workflow --filter @arcanea/web',
        approvalRequired: true,
        evidence: [
          'package manifest and lockfile intentionally updated',
          'node_modules/workflow/docs/README.md read before writing code',
        ],
      },
      {
        id: 'read-installed-workflow-docs',
        command: 'Get-Content -Raw node_modules/workflow/docs/README.md',
        approvalRequired: false,
        evidence: [
          'Relevant Workflow setup/start/step/test docs summarized in planning-with-files',
        ],
      },
      {
        id: 'install-or-scaffold-eve-docs-before-eve-code',
        command: 'pnpm add eve --filter @arcanea/web',
        approvalRequired: true,
        evidence: [
          'node_modules/eve/docs/README.md read before writing Eve instructions/tools/schedules',
        ],
      },
      {
        id: 'implement-genesis-proof-run-only-after-docs',
        command: 'Create the firstImplementationFiles listed in targetWorkflow',
        approvalRequired: false,
        evidence: [
          'workflow integration test passes',
          'no raw prompt or provider secret in workflow payload',
          'release-readiness gate still passes non-Vercel internal checks',
        ],
      },
    ],
    guardrails: [
      'Do not write Eve runtime code until node_modules/eve/docs/README.md has been read.',
      'Do not write Vercel Workflow runtime code until the installed workflow docs have been read.',
      'Do not add package dependencies inside the God Mode release slice unless Frank explicitly approves the dependency change.',
      'Do not send raw prompts, API keys, wallet addresses, transaction hashes, or generated proof bodies through workflow metrics.',
      'Keep Eve as an internal/operator lane until process, secrets, persistence, and deployment boundary are explicit.',
    ],
    checks,
  };
}

function formatMarkdown(report) {
  const lines = [];
  lines.push('# Arcanea Durable Workflow Readiness Packet');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Decision: ${report.summary.decision}`);
  lines.push(`Implementation ready: ${report.summary.implementationReady}`);
  lines.push(`Runtime code allowed: ${report.summary.runtimeCodeAllowed}`);
  lines.push('');
  lines.push('## Current Checks');
  lines.push('');
  for (const entry of report.checks) {
    lines.push(`- ${entry.status.toUpperCase()} ${entry.id}: ${entry.summary}`);
  }
  lines.push('');
  lines.push('## Target Workflow');
  lines.push('');
  lines.push(`Name: ${report.targetWorkflow.name}`);
  lines.push(`Type: ${report.targetWorkflow.type}`);
  lines.push('');
  lines.push('Contract files:');
  for (const file of report.targetWorkflow.contractFiles) lines.push(`- ${file}`);
  lines.push('');
  lines.push('Files:');
  for (const file of report.targetWorkflow.firstImplementationFiles) lines.push(`- ${file}`);
  lines.push('');
  lines.push('Steps:');
  for (const step of report.targetWorkflow.durableSteps) lines.push(`- ${step}`);
  lines.push('');
  lines.push('## Next Actions');
  lines.push('');
  for (const action of report.nextActions) {
    lines.push(`### ${action.id}`);
    lines.push('');
    lines.push(`Command: \`${action.command}\``);
    lines.push(`Approval required: ${action.approvalRequired}`);
    lines.push('');
    lines.push('Evidence:');
    for (const item of action.evidence) lines.push(`- ${item}`);
    lines.push('');
  }
  lines.push('## Guardrails');
  lines.push('');
  for (const guardrail of report.guardrails) lines.push(`- ${guardrail}`);
  lines.push('');
  lines.push('## Sources');
  lines.push('');
  for (const source of report.officialSources) {
    lines.push(`- ${source.label}: ${source.url || source.path}`);
  }
  lines.push('');
  return lines.join('\n');
}

const report = buildReport();

if (args.has('--write')) {
  fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(MD_OUTPUT, formatMarkdown(report));
  process.stdout.write(`Wrote ${path.relative(PROJECT_ROOT, JSON_OUTPUT).replace(/\\/g, '/')}\n`);
  process.stdout.write(`Wrote ${path.relative(PROJECT_ROOT, MD_OUTPUT).replace(/\\/g, '/')}\n`);
} else if (jsonOnly) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(formatMarkdown(report));
}

if (strict && report.summary.blockers > 0) {
  process.exit(1);
}
