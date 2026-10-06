import { compilePacket, digest, packetMarkdown } from "./myth-packets.mjs";

export const packetTag = "arcanea-myth-packet-v1";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers = { "Cache-Control": "private, no-store" };
const reply = (body, status = 200) => Response.json(body, { status, headers });
const error = (message, status) => reply({ error: message }, status);

export function snapshotId(owner, packetId) {
  const hex = digest(["arcanea.myth-save.v1", owner, packetId]);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export function handoff(packet) {
  return {
    schema: "arcanea.myth-handoff.v1",
    packetId: packet.packetId,
    briefDigest: packet.provenance.briefDigest,
    sourceDigests: packet.research.map(({ id, sourceDigest }) => ({
      id,
      sourceDigest,
    })),
    state: "editorial-planning",
    executionAuthorized: false,
    releaseEligible: false,
    tasks: packet.budget.estimates.map((line) => ({
      id: line.id,
      format: line.format,
      acceptedUnitsTarget: line.acceptedUnits,
      maxAttempts: line.plannedAttempts,
      estimatedCostMicros: line.totalCostMicros,
      currency: packet.budget.currency,
      requires: [
        "source-reading",
        "original-direction",
        "human-review",
        "budget-authorization",
      ],
      acceptance:
        "A human editor accepts the output against the audience, setting and original direction; rejected attempts remain in the cost record.",
    })),
    nextDecision: packet.review.livingTraditionReviewRequired
      ? "Invite a reader from the living tradition before proposing a commercial adaptation."
      : "Read the source witnesses and approve an original editorial direction.",
    limits:
      "Planning export only. No models, tools, jobs, purchases or releases are authorized by this file.",
  };
}

function view(brief, atlas) {
  const packet = compilePacket(brief, atlas);
  return {
    brief,
    packet,
    markdown: packetMarkdown(packet),
    handoff: handoff(packet),
  };
}

function verifyRow(row, owner, id) {
  if (
    !row ||
    row.id !== id ||
    row.user_id !== owner ||
    row.type !== "text" ||
    row.status !== "draft" ||
    row.visibility !== "private" ||
    !row.tags?.includes(packetTag) ||
    typeof row.created_at !== "string" ||
    !Number.isFinite(Date.parse(row.created_at))
  )
    throw new Error("Snapshot conflict");
  const content = row.content;
  if (!content || content.schema !== "arcanea.myth-save.v1")
    throw new Error("Snapshot conflict");
  const result = view(content.brief, content.atlas);
  if (
    snapshotId(owner, result.packet.packetId) !== id ||
    digest(content.packet) !== digest(result.packet)
  )
    throw new Error("Snapshot conflict");
  return result;
}

function receipt(row, disposition) {
  return {
    creationId: row.id,
    packetId: row.content.packet.packetId,
    createdAt: row.created_at,
    disposition,
    storage: "creations",
    visibility: "private",
  };
}

// Read actual bytes, not only Content-Length. Compilation is cheap and bounded.
async function readBody(request) {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw Object.assign(new Error("Use application/json."), { status: 415 });
  const reader = request.body?.getReader();
  if (!reader)
    throw Object.assign(new Error("A brief is required."), { status: 400 });
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16_384) {
        await reader.cancel();
        throw Object.assign(new Error("Brief exceeds 16 KiB."), {
          status: 413,
        });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let body;
  try {
    body = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw Object.assign(new Error("Invalid JSON."), { status: 400 });
  }
  if (
    !body ||
    Object.getPrototypeOf(body) !== Object.prototype ||
    Object.keys(body).length !== 2 ||
    !Object.hasOwn(body, "brief") ||
    !["compile", "save"].includes(body.action)
  )
    throw Object.assign(new Error("Expected action and brief only."), {
      status: 400,
    });
  return body;
}

// Inject session-scoped storage. No service-role client or owner field in input.
export async function handleWorkbench(request, { atlas, getOwner, store }) {
  try {
    if (request.method === "POST") {
      const body = await readBody(request);
      let result;
      try {
        result = view(body.brief, atlas);
      } catch (failure) {
        return error(failure.message, 400);
      }
      if (body.action === "compile") return reply(result);
      const owner = await getOwner();
      if (!owner)
        return error(
          "Sign in to save a private snapshot. Your brief is still in the editor.",
          401,
        );
      const id = snapshotId(owner, result.packet.packetId);
      const content = {
        schema: "arcanea.myth-save.v1",
        brief: result.brief,
        atlas,
        packet: result.packet,
      };
      const saved = await store.insert({
        id,
        user_id: owner,
        title: result.packet.project.title,
        content,
        type: "text",
        status: "draft",
        visibility: "private",
        tags: [packetTag],
      });
      if (saved.error?.code === "23505") {
        const existing = await store.find(id, owner);
        if (existing.error)
          return error(
            "Storage is unavailable. Retry the same brief safely.",
            503,
          );
        try {
          const verified = verifyRow(existing.data, owner, id);
          if (verified.packet.packetId !== result.packet.packetId)
            throw new Error("Conflict");
        } catch {
          return error(
            "Stored snapshot has changed. Export your brief and contact support.",
            409,
          );
        }
        return reply({
          ...result,
          receipt: receipt(existing.data, "existing"),
        });
      }
      if (saved.error || !saved.data)
        return error(
          "Save was not confirmed. Retry the same brief safely.",
          503,
        );
      try {
        verifyRow(saved.data, owner, id);
      } catch {
        return error(
          "Storage did not return the expected snapshot. Export your brief and contact support.",
          503,
        );
      }
      return reply({ ...result, receipt: receipt(saved.data, "created") }, 201);
    }
    if (request.method !== "GET") return error("Method not allowed.", 405);
    const owner = await getOwner();
    if (!owner) return error("Sign in to open your private snapshots.", 401);
    const id = new URL(request.url).searchParams.get("id");
    if (id) {
      if (!uuid.test(id)) return error("Invalid snapshot ID.", 400);
      const found = await store.find(id, owner);
      if (found.error) return error("Storage is unavailable. Try again.", 503);
      if (!found.data) return error("Snapshot not found.", 404);
      try {
        return reply({
          ...verifyRow(found.data, owner, id),
          receipt: receipt(found.data, "existing"),
        });
      } catch {
        return error("Stored snapshot has changed. Contact support.", 409);
      }
    }
    const found = await store.list(owner);
    if (found.error || !Array.isArray(found.data))
      return error("Storage is unavailable. Try again.", 503);
    // Only verified private, research-stage rows may enter this list.
    const snapshots = [];
    let unreadableCount = 0;
    for (const row of found.data) {
      try {
        const result = verifyRow(row, owner, row.id);
        snapshots.push({
          ...receipt(row, "existing"),
          title: result.packet.project.title,
        });
      } catch {
        unreadableCount++;
      }
    }
    return reply({ snapshots, unreadableCount, limit: 30 });
  } catch (failure) {
    return error(
      Number.isInteger(failure?.status)
        ? failure.message
        : "Storage is unavailable. Your brief remains in the editor.",
      Number.isInteger(failure?.status) ? failure.status : 503,
    );
  }
}
