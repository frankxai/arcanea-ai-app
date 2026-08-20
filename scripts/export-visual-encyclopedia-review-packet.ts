import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

import {
  CINEMA_USE_MAP,
  ENCYCLOPEDIA_STATS,
  ENTRY_BY_ID,
  VISUAL_ENCYCLOPEDIA_ENTRIES,
  VISUAL_GRAPH_EDGES,
  validateVisualCatalog,
} from "../apps/web/lib/visual-encyclopedia/catalog";
import { GATES } from "../apps/web/lib/visual-encyclopedia/schema";

type JsonRecord = Record<string, unknown>;

interface IntakeAsset {
  visual: {
    id: string;
    slug: string;
    name: string;
    kind: string;
    gate: string;
    batch: number;
    canonState: string;
  };
  clientAssetId: string;
  source: {
    localPath: string;
    contentType: string;
    byteSize: number;
    sha256: string;
    width: number;
    height: number;
  };
  provenance: {
    sourceManifest: string;
    dossierPath: string;
    generatedBy: string;
    generatedAt: string;
    canonState: string;
    collectionWave: string;
    qualityReview: JsonRecord;
  };
  publicationGate: JsonRecord;
}

interface IntakePacket {
  schemaVersion: string;
  generatedAt: string;
  brandSlug: string;
  collection: string;
  safety: JsonRecord;
  summary: JsonRecord;
  assets: IntakeAsset[];
}

interface ReleaseAsset {
  visualId: string;
  clientAssetId: string;
  sourceSha256: string;
  sourceByteSize: number;
  ingest: JsonRecord & { status: string };
  rendition: JsonRecord & { status: string };
  rights: JsonRecord & { status: string };
  publicationReview: JsonRecord & { status: string };
  publication: JsonRecord & { status: string };
  withdrawal: JsonRecord & { status: string };
}

interface ReleaseLedger {
  schemaVersion: string;
  packet: { sha256: string; assets: number; totalBytes: number };
  assets: ReleaseAsset[];
}

interface RenditionEntry {
  visualId: string;
  clientAssetId: string;
  sourceSha256: string;
  sourceByteSize: number;
  outputFile: string;
  status: string;
  attempts: number;
  outputSha256: string | null;
  outputByteSize: number | null;
  width: number | null;
  height: number | null;
  encoder: string | null;
  completedAt: string | null;
  lastError: string | null;
}

interface RenditionManifest {
  schemaVersion: string;
  packet: { sha256: string; assets: number };
  spec: JsonRecord;
  entries: RenditionEntry[];
}

const HELP = `Usage:
  pnpm visual:review-packet -- \\
    --collection-root <path> \\
    --intake <media-intake-packet.json> \\
    --release-ledger <visual-encyclopedia-release-ledger.json> \\
    --rendition-manifest <visual-encyclopedia-gallery-rendition-manifest.json> \\
    --as-of <ISO-8601> \\
    --out <human-review-packet.json> [--check]

The exporter never changes catalog, canon, rights, publication, or withdrawal state.
It refuses to overwrite an existing packet. --check compares a packet byte-for-byte.
`;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(HELP);
    return;
  }

  const collectionRoot = requiredPath(args, "collection-root");
  const intakePath = requiredPath(args, "intake");
  const releaseLedgerPath = requiredPath(args, "release-ledger");
  const renditionManifestPath = requiredPath(args, "rendition-manifest");
  const outputPath = requiredPath(args, "out");
  const asOf = required(args, "as-of");

  assert(
    !Number.isNaN(Date.parse(asOf)),
    "--as-of must be a valid ISO-8601 timestamp.",
  );
  assert(
    isAbsolute(collectionRoot),
    "--collection-root must be an absolute path.",
  );

  const [intakeBuffer, releaseBuffer, renditionBuffer] = await Promise.all([
    readFile(intakePath),
    readFile(releaseLedgerPath),
    readFile(renditionManifestPath),
  ]);
  const intake = JSON.parse(intakeBuffer.toString("utf8")) as IntakePacket;
  const releaseLedger = JSON.parse(
    releaseBuffer.toString("utf8"),
  ) as ReleaseLedger;
  const renditionManifest = JSON.parse(
    renditionBuffer.toString("utf8"),
  ) as RenditionManifest;

  validateInputs(intake, releaseLedger, renditionManifest);
  assert(
    releaseLedger.packet.sha256 === sha256(intakeBuffer),
    "Release ledger is not bound to the exact intake packet bytes.",
  );

  const intakeById = uniqueMap(
    intake.assets,
    (asset) => asset.visual.id,
    "intake assets",
  );
  const releaseById = uniqueMap(
    releaseLedger.assets,
    (asset) => asset.visualId,
    "release assets",
  );
  const renditionById = uniqueMap(
    renditionManifest.entries,
    (entry) => entry.visualId,
    "rendition entries",
  );
  assertExactCatalogIds(intakeById, "intake assets");
  assertExactCatalogIds(releaseById, "release assets");
  assertExactCatalogIds(renditionById, "rendition entries");

  const cinemaByBatch = new Map(
    CINEMA_USE_MAP.map((chapter) => [chapter.chapter, chapter]),
  );
  const entries = [];

  for (const entry of VISUAL_ENCYCLOPEDIA_ENTRIES) {
    const intakeAsset = mustGet(intakeById, entry.id, "intake asset");
    const releaseAsset = mustGet(releaseById, entry.id, "release asset");
    const rendition = mustGet(renditionById, entry.id, "rendition entry");

    validateAssetBinding(
      entry.id,
      entry.media.sha256,
      intakeAsset,
      releaseAsset,
      rendition,
    );

    const sourceMaster = await requiredCollectionArtifact(collectionRoot, [
      resolve(dirname(intakePath), intakeAsset.source.localPath),
    ]);
    const dossier = await requiredCollectionArtifact(collectionRoot, [
      resolve(dirname(intakePath), intakeAsset.provenance.dossierPath),
      resolve(collectionRoot, intakeAsset.provenance.dossierPath),
    ]);
    const gateNumber = GATES.indexOf(entry.gate) + 1;
    assert(gateNumber > 0, `${entry.id} has an unknown Gate: ${entry.gate}.`);
    const gateSlug = slugify(entry.gate);
    const gateBoard = await requiredCollectionArtifact(collectionRoot, [
      resolve(
        collectionRoot,
        "wave-02",
        "gate-boards",
        `${String(gateNumber).padStart(2, "0")}-${gateSlug}-board.svg`,
      ),
    ]);
    const atlas = await requiredCollectionArtifact(collectionRoot, [
      resolve(collectionRoot, "wave-02", "hundredfold-atlas.svg"),
    ]);
    const generationPrompt =
      intakeAsset.provenance.collectionWave === "wave-02"
        ? await requiredCollectionArtifact(collectionRoot, [
            resolve(
              collectionRoot,
              "wave-02",
              "prompts",
              `W2-B${String(gateNumber).padStart(2, "0")}-${gateSlug}.md`,
            ),
          ])
        : null;

    const chapter = cinemaByBatch.get(entry.batch);
    const linkedEntries = entry.relationships.map((id) => {
      const related = ENTRY_BY_ID.get(id);
      assert(related, `${entry.id} links to missing catalog entry ${id}.`);
      return {
        id: related.id,
        slug: related.slug,
        name: related.name,
        kind: related.kind,
      };
    });

    const reviewBinding = {
      id: entry.id,
      slug: entry.slug,
      sourceSha256: entry.media.sha256,
      canon: entry.canon,
      cinemaUse: entry.cinemaUse,
      relationships: entry.relationships,
      dossier,
    };
    const reviewFingerprint = sha256(
      Buffer.from(JSON.stringify(reviewBinding)),
    );

    const activationChecks = [
      check("source-master-verified", true, entry.media.sha256 ?? null),
      check(
        "agent-quality-review",
        entry.review.state === "approved",
        entry.review.state,
      ),
      check(
        "human-canon-acceptance",
        entry.canon.state !== "proposal",
        entry.canon.state,
      ),
      check(
        "private-media-ingest",
        isComplete(releaseAsset.ingest.status),
        releaseAsset.ingest.status,
      ),
      check(
        "gallery-rendition",
        isComplete(rendition.status),
        rendition.status,
      ),
      check(
        "human-rights-clearance",
        isApproved(releaseAsset.rights.status),
        releaseAsset.rights.status,
      ),
      check(
        "independent-publication-review",
        isApproved(releaseAsset.publicationReview.status),
        releaseAsset.publicationReview.status,
      ),
      check(
        "public-publication",
        isComplete(releaseAsset.publication.status),
        releaseAsset.publication.status,
      ),
    ];

    entries.push({
      id: entry.id,
      slug: entry.slug,
      name: entry.name,
      kind: entry.kind,
      gate: entry.gate,
      guardian: entry.guardian,
      batch: entry.batch,
      sourceWave: intakeAsset.provenance.collectionWave,
      narrative: {
        origin: entry.origin,
        role: entry.role,
        gift: entry.gift,
        cost: entry.cost,
      },
      artDirection: {
        visualDNA: entry.visualDNA,
        camera: entry.camera,
        emotion: entry.emotion,
      },
      canon: {
        state: entry.canon.state,
        anchor: entry.canon.anchor,
        note: entry.canon.note,
        humanAcceptanceRequired: entry.canon.state === "proposal",
      },
      cinema: {
        chapter: chapter?.chapter ?? null,
        primarySceneId: chapter?.primaryScene ?? null,
        use: entry.cinemaUse,
      },
      contentUses: entry.contentUses,
      graph: {
        relationshipCount: linkedEntries.length,
        relationships: linkedEntries,
      },
      sourceProof: {
        clientAssetId: intakeAsset.clientAssetId,
        master: sourceMaster,
        deliveryKey: entry.media.deliveryKey ?? null,
        mimeType: entry.media.mimeType ?? null,
        byteSize: intakeAsset.source.byteSize,
        width: entry.media.width ?? null,
        height: entry.media.height ?? null,
        sha256: entry.media.sha256 ?? null,
        alt: entry.media.alt ?? null,
        generatedBy:
          entry.media.generationModel ?? intakeAsset.provenance.generatedBy,
        generatedAt:
          entry.media.generatedAt ?? intakeAsset.provenance.generatedAt,
      },
      explanationAssets: {
        dossier,
        gateBoard,
        atlas,
        generationPrompt,
      },
      productionReview: {
        authority: "agent-visual-quality-review",
        state: entry.review.state,
        score: entry.review.score,
        notes: entry.review.notes,
        doesNotGrantCanonOrPublication: true,
      },
      mediaLifecycle: {
        ingest: releaseAsset.ingest,
        rendition: { ...releaseAsset.rendition, preparedOutput: rendition },
        rights: releaseAsset.rights,
        publicationReview: releaseAsset.publicationReview,
        publication: releaseAsset.publication,
        withdrawal: releaseAsset.withdrawal,
      },
      activation: {
        status: activationChecks.every((item) => item.pass)
          ? "ready"
          : "blocked",
        checks: activationChecks,
      },
      humanReviewWorksheet: {
        status: "awaiting-human-review",
        reviewFingerprint,
        reviewer: null,
        reviewedAt: null,
        canonDecision: null,
        canonNotes: "",
        galleryDisposition: null,
        galleryNotes: "",
        cinemaPriority: null,
        cinemaNotes: "",
        rightsDecision: null,
        publicationDecision: null,
        sourceRetention: null,
        allowedValues: {
          canonDecision: ["accept-to-staging", "revise", "reject", "hold"],
          galleryDisposition: [
            "approve",
            "revise",
            "reject",
            "withdraw",
            "hold",
          ],
          cinemaPriority: [
            "hero",
            "supporting",
            "reference-only",
            "not-for-cinema",
          ],
          rightsDecision: ["cleared", "not-cleared", "needs-review"],
          publicationDecision: ["approve", "reject", "hold"],
          sourceRetention: [
            "retain",
            "quarantine",
            "delete-after-verified-backup",
          ],
        },
        safety: {
          editingThisWorksheetDoesNotMutateAnySystem: true,
          canonPromotionRequiresSeparateHumanAuthorizedAction: true,
          publicationRequiresSeparateHumanAuthorizedAction: true,
          deletionRequiresSeparateDestructiveAction: true,
        },
      },
    });
  }

  const packetInputs = {
    catalog: "apps/web/lib/visual-encyclopedia/catalog.ts",
    intake: {
      schemaVersion: intake.schemaVersion,
      sha256: sha256(intakeBuffer),
      reference: collectionReference(collectionRoot, intakePath),
    },
    releaseLedger: {
      schemaVersion: releaseLedger.schemaVersion,
      sha256: sha256(releaseBuffer),
      reference: collectionReference(collectionRoot, releaseLedgerPath),
    },
    renditionManifest: {
      schemaVersion: renditionManifest.schemaVersion,
      sha256: sha256(renditionBuffer),
      reference: collectionReference(collectionRoot, renditionManifestPath),
    },
  };
  const packetFingerprint = sha256(
    Buffer.from(
      JSON.stringify({
        schemaVersion: "arcanea.visual-encyclopedia-human-review.v1",
        asOf,
        inputs: packetInputs,
        reviews: entries.map(
          (entry) => entry.humanReviewWorksheet.reviewFingerprint,
        ),
      }),
    ),
  );
  const packet = {
    schemaVersion: "arcanea.visual-encyclopedia-human-review.v1",
    asOf,
    packetFingerprint,
    collection: intake.collection,
    authority: {
      type: "advisory-review-worksheet",
      mutatesApprovalState: false,
      grantsCanon: false,
      grantsRights: false,
      grantsPublication: false,
      deletesMedia: false,
    },
    inputs: packetInputs,
    summary: {
      entries: entries.length,
      byKind: ENCYCLOPEDIA_STATS.byKind,
      byGate: Object.fromEntries(
        GATES.map((gate) => [
          gate,
          entries.filter((e) => e.gate === gate).length,
        ]),
      ),
      agentQualityStates: ENCYCLOPEDIA_STATS.byReviewState,
      canonStates: countBy(entries, (entry) => entry.canon.state),
      activationStates: countBy(entries, (entry) => entry.activation.status),
      graphEdges: VISUAL_GRAPH_EDGES.length,
      relationshipReferences: entries.reduce(
        (sum, entry) => sum + entry.graph.relationshipCount,
        0,
      ),
      pendingHumanReviews: entries.filter(
        (entry) =>
          entry.humanReviewWorksheet.status === "awaiting-human-review",
      ).length,
    },
    reviewOrder: [
      "verify source proof and dossier",
      "judge visual identity and production quality",
      "accept, revise, reject, or hold canon proposal",
      "assign cinema priority and content uses",
      "clear rights independently",
      "approve gallery publication independently",
      "execute authorized media lifecycle actions through the control plane",
    ],
    entries,
  };
  const serialized = `${JSON.stringify(packet, null, 2)}\n`;

  if (args.check) {
    const existing = await readFile(outputPath, "utf8");
    assert(
      existing === serialized,
      `Review packet is stale or edited: ${outputPath}`,
    );
    process.stdout.write(
      `${JSON.stringify({ ok: true, mode: "check", outputPath, entries: entries.length, packetFingerprint })}\n`,
    );
    return;
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized, { encoding: "utf8", flag: "wx" });
  process.stdout.write(
    `${JSON.stringify({ ok: true, mode: "write", outputPath, entries: entries.length, packetFingerprint })}\n`,
  );
}

function validateInputs(
  intake: IntakePacket,
  releaseLedger: ReleaseLedger,
  renditionManifest: RenditionManifest,
) {
  const catalogErrors = validateVisualCatalog();
  assert(
    catalogErrors.length === 0,
    `Catalog validation failed:\n- ${catalogErrors.join("\n- ")}`,
  );
  assert(
    intake.schemaVersion === "starlight.media-intake-packet.v1",
    "Unexpected intake schema.",
  );
  assert(
    releaseLedger.schemaVersion === "starlight.media-release-ledger.v1",
    "Unexpected release-ledger schema.",
  );
  assert(
    renditionManifest.schemaVersion === "starlight.media-rendition-manifest.v1",
    "Unexpected rendition-manifest schema.",
  );
  assert(
    intake.assets.length === 130,
    `Expected 130 intake assets; found ${intake.assets.length}.`,
  );
  assert(
    releaseLedger.assets.length === 130,
    `Expected 130 release assets; found ${releaseLedger.assets.length}.`,
  );
  assert(
    renditionManifest.entries.length === 130,
    `Expected 130 rendition entries; found ${renditionManifest.entries.length}.`,
  );
  assert(
    releaseLedger.packet.sha256 === renditionManifest.packet.sha256,
    "Release ledger and rendition manifest bind to different intake packets.",
  );
  assert(
    releaseLedger.packet.assets === 130 &&
      renditionManifest.packet.assets === 130,
    "Media ledgers do not both declare all 130 assets.",
  );
}

function validateAssetBinding(
  id: string,
  catalogSha256: string | undefined,
  intake: IntakeAsset,
  release: ReleaseAsset,
  rendition: RenditionEntry,
) {
  const hashes = [
    catalogSha256,
    intake.source.sha256,
    release.sourceSha256,
    rendition.sourceSha256,
  ];
  assert(
    hashes.every((value) => value === hashes[0]),
    `${id} has conflicting source hashes.`,
  );
  assert(
    intake.clientAssetId === release.clientAssetId &&
      release.clientAssetId === rendition.clientAssetId,
    `${id} has conflicting client asset ids.`,
  );
  assert(
    intake.visual.canonState === "proposal",
    `${id} intake canon state is not proposal.`,
  );
}

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    assert(token.startsWith("--"), `Unexpected positional argument: ${token}`);
    const key = token.slice(2);
    if (key === "check" || key === "help") {
      args[key] = true;
      continue;
    }
    const value = argv[index + 1];
    assert(value && !value.startsWith("--"), `Missing value for --${key}.`);
    args[key] = value;
    index += 1;
  }
  return args;
}

function required(args: Record<string, string | boolean>, key: string): string {
  const value = args[key];
  assert(
    typeof value === "string" && value.length > 0,
    `Missing required --${key}.`,
  );
  return value;
}

function requiredPath(
  args: Record<string, string | boolean>,
  key: string,
): string {
  return resolve(required(args, key));
}

function uniqueMap<T>(
  items: T[],
  keyOf: (item: T) => string,
  label: string,
): Map<string, T> {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = keyOf(item);
    assert(!map.has(key), `Duplicate ${label} key: ${key}.`);
    map.set(key, item);
  }
  return map;
}

function assertExactCatalogIds(map: Map<string, unknown>, label: string) {
  assert(
    map.size === VISUAL_ENCYCLOPEDIA_ENTRIES.length,
    `${label} count does not match catalog.`,
  );
  for (const entry of VISUAL_ENCYCLOPEDIA_ENTRIES) {
    assert(map.has(entry.id), `${label} is missing ${entry.id}.`);
  }
  for (const id of map.keys()) {
    assert(ENTRY_BY_ID.has(id), `${label} contains unknown id ${id}.`);
  }
}

async function requiredCollectionArtifact(
  collectionRoot: string,
  candidates: string[],
): Promise<string> {
  for (const candidate of candidates) {
    if (!isInside(collectionRoot, candidate)) continue;
    try {
      await access(candidate);
      return collectionReference(collectionRoot, candidate);
    } catch {
      // Try the next deterministic candidate.
    }
  }
  throw new Error(
    `Missing required collection artifact. Tried: ${candidates.join(", ")}`,
  );
}

function collectionReference(
  collectionRoot: string,
  artifactPath: string,
): string {
  assert(
    isInside(collectionRoot, artifactPath),
    `Artifact escapes collection root: ${artifactPath}`,
  );
  return relative(collectionRoot, artifactPath).split(sep).join("/");
}

function isInside(root: string, candidate: string): boolean {
  const path = relative(resolve(root), resolve(candidate));
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

function check(id: string, pass: boolean, observed: unknown) {
  return { id, pass, observed };
}

function isComplete(status: string): boolean {
  return ["complete", "completed", "published", "ready"].includes(status);
}

function isApproved(status: string): boolean {
  return ["approved", "cleared", "complete", "completed"].includes(status);
}

function countBy<T>(
  items: T[],
  keyOf: (item: T) => string,
): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function mustGet<T>(map: Map<string, T>, key: string, label: string): T {
  const value = map.get(key);
  assert(value, `Missing ${label}: ${key}.`);
  return value;
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
