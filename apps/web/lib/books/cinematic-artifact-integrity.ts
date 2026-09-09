import { createHash } from 'node:crypto';

// Keep verification within the function's memory budget before returning any bytes.
export const MAX_CINEMATIC_ARTIFACT_BYTES = 128 * 1024 * 1024;

export interface CinematicArtifactEvidence {
  bytes: number;
  sha256: string;
}

export async function readVerifiedCinematicArtifact(
  stream: ReadableStream<Uint8Array>,
  evidence: CinematicArtifactEvidence,
  options: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<Uint8Array<ArrayBuffer> | null> {
  const reader = stream.getReader();
  const timeoutMs = options.timeoutMs ?? 30_000;
  let aborted = false;
  const cancel = () => {
    aborted = true;
    void reader.cancel().catch(() => undefined);
  };
  const timeout = setTimeout(cancel, timeoutMs);
  options.signal?.addEventListener('abort', cancel, { once: true });

  try {
    if (
      options.signal?.aborted
      || !Number.isSafeInteger(evidence.bytes)
      || evidence.bytes <= 0
      || evidence.bytes > MAX_CINEMATIC_ARTIFACT_BYTES
      || !/^[a-f0-9]{64}$/.test(evidence.sha256)
      || !Number.isFinite(timeoutMs)
      || timeoutMs <= 0
    ) {
      cancel();
      return null;
    }

    const bytes = new Uint8Array(evidence.bytes);
    let offset = 0;
    while (!aborted) {
      const chunk = await reader.read();
      if (aborted) return null;
      if (chunk.done) break;
      if (chunk.value.byteLength > evidence.bytes - offset) {
        cancel();
        return null;
      }
      bytes.set(chunk.value, offset);
      offset += chunk.value.byteLength;
    }

    if (aborted || offset !== evidence.bytes) return null;
    return createHash('sha256').update(bytes).digest('hex') === evidence.sha256
      ? bytes
      : null;
  } catch {
    cancel();
    return null;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', cancel);
    reader.releaseLock();
  }
}
