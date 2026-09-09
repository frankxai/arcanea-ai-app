import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import {
  MAX_CINEMATIC_ARTIFACT_BYTES,
  readVerifiedCinematicArtifact,
} from '../cinematic-artifact-integrity';

const approved = new TextEncoder().encode('%PDF-1.7\nApproved book content\n%%EOF');
const evidence = {
  bytes: approved.byteLength,
  sha256: createHash('sha256').update(approved).digest('hex'),
};

function streamOf(...chunks: Uint8Array[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
}

test('returns exactly the approved artifact after reading the complete stream', async () => {
  const bytes = await readVerifiedCinematicArtifact(
    streamOf(approved.slice(0, 8), approved.slice(8)),
    evidence,
  );
  assert.deepEqual(bytes, approved);
});

test('rejects a same-length replacement, truncation, or unexpected trailing bytes', async () => {
  const replacement = approved.slice();
  replacement[12] ^= 1;
  for (const bytes of [replacement, approved.slice(1), new Uint8Array([...approved, 0])]) {
    assert.equal(await readVerifiedCinematicArtifact(streamOf(bytes), evidence), null);
  }
});

test('withholds bytes until end of stream proves that no trailing content exists', async () => {
  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(value) {
      controller = value;
      value.enqueue(approved);
    },
  });
  let returned = false;
  const result = readVerifiedCinematicArtifact(stream, evidence).then((bytes) => {
    returned = true;
    return bytes;
  });
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(returned, false);
  controller!.enqueue(new Uint8Array([0]));
  assert.equal(await result, null);
});

test('bounds memory before allocating and cancels an oversized source', async () => {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    cancel() { cancelled = true; },
  });
  assert.equal(await readVerifiedCinematicArtifact(stream, {
    ...evidence,
    bytes: MAX_CINEMATIC_ARTIFACT_BYTES + 1,
  }), null);
  assert.equal(cancelled, true);
  assert.equal(stream.locked, false);
});

test('a stalled or failed storage stream cannot return partially verified data', async () => {
  let cancelled = false;
  const stalled = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(approved.slice(0, 8)); },
    cancel() { cancelled = true; },
  });
  assert.equal(await readVerifiedCinematicArtifact(stalled, evidence, { timeoutMs: 20 }), null);
  assert.equal(cancelled, true);
  assert.equal(stalled.locked, false);

  const failed = new ReadableStream<Uint8Array>({
    start(controller) { controller.error(new Error('Storage disconnected')); },
  });
  assert.equal(await readVerifiedCinematicArtifact(failed, evidence), null);
});

test('client cancellation releases the source and never returns the buffered artifact', async () => {
  const abort = new AbortController();
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(approved); },
    cancel() { cancelled = true; },
  });
  const result = readVerifiedCinematicArtifact(stream, evidence, { signal: abort.signal });
  abort.abort();
  assert.equal(await result, null);
  assert.equal(cancelled, true);
  assert.equal(stream.locked, false);
});
