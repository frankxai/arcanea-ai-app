import assert from "node:assert/strict";
import { test } from "node:test";
import {
  boundedJson,
  parseImageClaim,
  privateAssetHandle,
  privateAssetPath,
  retainPrivateImage,
  validateImageBytes,
  MAX_IMAGE_JSON_BYTES,
  type ImageClaim,
  type RetainedImage,
  type PrivateAssetRepository,
  type PrivateImageStore,
} from "../private-assets";

const owner = "11111111-1111-4111-8111-111111111111";
const id = "22222222-2222-4222-8222-222222222222";
const input = {
  ownerId: owner,
  assetId: id,
  imageData: Buffer.from("fixture").toString("base64"),
  mimeType: "image/png",
  prompt: "A private scene",
  alt: "A private scene",
  sourceId: "generation-a",
  provider: "fixture",
};
const claim = () => parseImageClaim(input, owner);
function fixture() {
  let asset: RetainedImage | null = null;
  let object: { bytes: Buffer; mime: string } | null = null;
  let used = 0,
    reserved = 0,
    puts = 0,
    reads = 0,
    completes = 0;
  let failPut = false,
    lostPutAck = false,
    lostCompleteAck = false,
    failRead = false;
  const repository: PrivateAssetRepository = {
    reserve: async (value: ImageClaim) => {
      if (asset) return { ...asset };
      reserved += value.bytes.length;
      asset = {
        id: value.id,
        user_id: value.ownerId,
        mime_type: value.mime,
        byte_size: value.bytes.length,
        sha256: value.checksum,
        fingerprint: value.fingerprint,
        prompt: value.prompt,
        alt_text: value.alt,
        source_id: value.sourceId,
        provider: value.provider,
        status: "reserved",
        created_at: "2026-10-11T00:00:00.123456Z",
        favorited: true,
        favorite_revision: 0,
        favorite_changed_at: "2026-10-11T00:00:00.123456Z",
        last_favorite_operation: null,
      };
      return { ...asset };
    },
    complete: async () => {
      completes++;
      if (asset!.status !== "ready") {
        reserved -= asset!.byte_size;
        used += asset!.byte_size;
        asset!.status = "ready";
      }
      if (lostCompleteAck) {
        lostCompleteAck = false;
        throw Error("fixture database acknowledgement lost");
      }
      return { ...asset! };
    },
  };
  const store: PrivateImageStore = {
    read: async () => {
      reads++;
      if (failRead) throw Error("fixture read uncertain");
      return object;
    },
    put: async (_path, bytes, mime) => {
      puts++;
      if (failPut) throw Error("fixture put uncertain");
      if (object) throw Error("fixture immutable object already exists");
      object = { bytes: Buffer.from(bytes), mime };
      if (lostPutAck) throw Error("fixture upload acknowledgement lost");
    },
  };
  return {
    repository,
    store,
    stats: () => ({ used, reserved, puts, reads, completes, asset }),
    set: (value: {
      failPut?: boolean;
      lostPutAck?: boolean;
      lostCompleteAck?: boolean;
      failRead?: boolean;
    }) => {
      if (value.failPut !== undefined) failPut = value.failPut;
      if (value.lostPutAck !== undefined) lostPutAck = value.lostPutAck;
      if (value.lostCompleteAck !== undefined)
        lostCompleteAck = value.lostCompleteAck;
      if (value.failRead !== undefined) failRead = value.failRead;
    },
    corrupt: () => {
      object!.bytes = Buffer.from("altered");
    },
    remove: () => {
      object = null;
    },
  };
}
test("valid claim binds owner, immutable content and all metadata", () => {
  const a = claim();
  assert.equal(a.bytes.toString(), "fixture");
  assert.equal(
    privateAssetPath(owner, id, a.mime),
    `imagine-private/${owner}/${id}.png`,
  );
  assert.notEqual(
    parseImageClaim({ ...input, prompt: "Changed" }, owner).fingerprint,
    a.fingerprint,
  );
  assert.notEqual(
    parseImageClaim({ ...input, alt: "Changed" }, owner).fingerprint,
    a.fingerprint,
  );
});
test("foreign, malformed, prototype MIME and noncanonical inputs are denied", () => {
  for (const changes of [
    { ownerId: id },
    { assetId: "../escape" },
    { mimeType: "toString" },
    { imageData: "Zh==" },
    { alt: "" },
    { provider: {} },
    { prompt: "x".repeat(2001) },
  ])
    assert.throws(() => parseImageClaim({ ...input, ...changes }, owner));
  assert.equal(privateAssetHandle(`/api/imagine/assets/${id}.png`)?.id, id);
  for (const url of [
    `https://example.invalid/${id}.png`,
    `/api/imagine/assets/${"-".repeat(36)}.png`,
    `/api/imagine/assets/${id}.png?other=1`,
  ])
    assert.equal(privateAssetHandle(url), null);
});
test("actual chunked request size is bounded without trusting Content-Length", async () => {
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      controller.enqueue(new Uint8Array(MAX_IMAGE_JSON_BYTES + 1));
    },
    cancel() {
      cancelled = true;
    },
  });
  const request = new Request("https://fixture.invalid", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit);
  await assert.rejects(boundedJson(request), /3 MiB/);
  assert.equal(cancelled, true);
  assert.deepEqual(
    await boundedJson(
      new Request("https://fixture.invalid", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    ),
    input,
  );
});
test("immutable completion and duplicate retry use one upload and byte charge", async () => {
  const f = fixture();
  const first = await retainPrivateImage(claim(), f.repository, f.store);
  assert.equal(first.status, "ready");
  assert.equal(
    (await retainPrivateImage(claim(), f.repository, f.store)).id,
    first.id,
  );
  assert.equal(f.stats().puts, 1);
  assert.equal(f.stats().used, claim().bytes.length);
  assert.equal(f.stats().reserved, 0);
});
test("lost upload acknowledgement reconciles verified bytes without a second put", async () => {
  const f = fixture();
  f.set({ lostPutAck: true });
  assert.equal(
    (await retainPrivateImage(claim(), f.repository, f.store)).status,
    "ready",
  );
  assert.equal(f.stats().puts, 1);
  assert.equal(f.stats().completes, 1);
});
test("unknown upload retains reservation and exact identity until recovery", async () => {
  const f = fixture();
  f.set({ failPut: true });
  await assert.rejects(
    retainPrivateImage(claim(), f.repository, f.store),
    /unresolved/,
  );
  assert.equal(f.stats().reserved, claim().bytes.length);
  assert.equal(f.stats().used, 0);
  assert.equal(f.stats().completes, 0);
  f.set({ failPut: false });
  assert.equal(
    (await retainPrivateImage(claim(), f.repository, f.store)).id,
    id,
  );
  assert.equal(f.stats().used, claim().bytes.length);
  assert.equal(f.stats().reserved, 0);
});
test("an uncertain read never causes blind upload or completion", async () => {
  const f = fixture();
  f.set({ failRead: true });
  await assert.rejects(retainPrivateImage(claim(), f.repository, f.store));
  assert.equal(f.stats().puts, 0);
  assert.equal(f.stats().completes, 0);
  assert.equal(f.stats().reserved, claim().bytes.length);
});
test("lost metadata acknowledgement reopens the same completed record", async () => {
  const f = fixture();
  f.set({ lostCompleteAck: true });
  await assert.rejects(retainPrivateImage(claim(), f.repository, f.store));
  assert.equal(
    (await retainPrivateImage(claim(), f.repository, f.store)).status,
    "ready",
  );
  assert.equal(f.stats().puts, 1);
  assert.equal(f.stats().used, claim().bytes.length);
});
test("content conflict and corrupted bytes never overwrite or complete", async () => {
  const f = fixture();
  await retainPrivateImage(claim(), f.repository, f.store);
  await assert.rejects(
    retainPrivateImage(
      parseImageClaim({ ...input, prompt: "Other" }, owner),
      f.repository,
      f.store,
    ),
    /different content/,
  );
  f.corrupt();
  await assert.rejects(
    retainPrivateImage(claim(), f.repository, f.store),
    /verified/,
  );
  assert.equal(f.stats().puts, 1);
  assert.equal(f.stats().completes, 1);
});
test("a missing ready object fails visibly and preserves metadata without reupload", async () => {
  const f = fixture();
  await retainPrivateImage(claim(), f.repository, f.store);
  f.remove();
  await assert.rejects(
    retainPrivateImage(claim(), f.repository, f.store),
    /preserved/,
  );
  assert.equal(f.stats().puts, 1);
  assert.equal(f.stats().asset?.status, "ready");
});
test("quota/authority refusal occurs before store access", async () => {
  const f = fixture();
  f.repository.reserve = async () => {
    throw Error("fixture quota exhausted");
  };
  await assert.rejects(retainPrivateImage(claim(), f.repository, f.store));
  assert.equal(f.stats().reads, 0);
  assert.equal(f.stats().puts, 0);
});
test("actual image decoder rejects a MIME label over nonimage bytes", async () => {
  await assert.rejects(validateImageBytes(claim()), /invalid/);
});

test("concurrent retries preserve one immutable object and one accounted completion", async () => {
  const f = fixture();
  const results = await Promise.all([
    retainPrivateImage(claim(), f.repository, f.store),
    retainPrivateImage(claim(), f.repository, f.store),
  ]);
  assert.equal(results[0].id, results[1].id);
  assert.equal(f.stats().used, claim().bytes.length);
  assert.equal(f.stats().reserved, 0);
  assert.equal(
    (await retainPrivateImage(claim(), f.repository, f.store)).status,
    "ready",
  );
});

test("actual PNG pixels decode while truncated or incorrectly labelled bytes fail", async () => {
  const png =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  const valid = parseImageClaim({ ...input, imageData: png }, owner);
  await validateImageBytes(valid);
  await assert.rejects(
    validateImageBytes(
      parseImageClaim(
        { ...input, imageData: png, mimeType: "image/jpeg" },
        owner,
      ),
    ),
    /invalid/,
  );
  await assert.rejects(
    validateImageBytes(
      parseImageClaim(
        { ...input, imageData: valid.bytes.subarray(0, 45).toString("base64") },
        owner,
      ),
    ),
    /invalid/,
  );
});
