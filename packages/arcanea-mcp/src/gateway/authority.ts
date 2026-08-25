import { canonicalSha256 } from "./canonical.js";
import { GatewayError } from "./errors.js";
import type {
  WorldContextActor,
  WorldContextAdmissionLimiter,
  WorldContextAuthority,
  WorldContextAuthorityInput,
  WorldContextAuthorityRecord,
} from "./types.js";

export interface InMemoryPreviewAuthorityOptions {
  clock?: () => Date;
  maximumActorRequestsPerWindow?: number;
  windowSeconds?: number;
}

interface RateWindow {
  count: number;
  startedAtMs: number;
}

interface PreviewWindowOptions {
  clock?: () => Date;
  maximumActorRequestsPerWindow?: number;
  windowSeconds?: number;
}

function createPreviewWindow(options: PreviewWindowOptions) {
  const clock = options.clock ?? (() => new Date());
  const maximum = options.maximumActorRequestsPerWindow ?? 20;
  const windowSeconds = options.windowSeconds ?? 60;
  const windows = new Map<string, RateWindow>();
  let operations = 0;

  if (!Number.isSafeInteger(maximum) || maximum < 1 || maximum > 1000) {
    throw new GatewayError("context-query-window-invalid");
  }
  if (
    !Number.isSafeInteger(windowSeconds) ||
    windowSeconds < 1 ||
    windowSeconds > 3600
  ) {
    throw new GatewayError("context-query-window-invalid");
  }

  return {
    windowSeconds,
    consume(partitionKey: string): Date {
      const now = clock();
      const nowMs = now.getTime();
      if (!Number.isFinite(nowMs)) {
        throw new GatewayError("context-query-window-invalid");
      }

      operations += 1;
      if (operations % 128 === 0 || windows.size >= 4096) {
        const boundaryMs = windowSeconds * 1000;
        for (const [key, window] of windows) {
          if (nowMs >= window.startedAtMs + boundaryMs) windows.delete(key);
        }
      }

      const existing = windows.get(partitionKey);
      const boundaryMs = windowSeconds * 1000;
      if (!existing || nowMs >= existing.startedAtMs + boundaryMs) {
        windows.set(partitionKey, { count: 1, startedAtMs: nowMs });
      } else {
        if (
          !Number.isSafeInteger(existing.count) ||
          existing.count < 0 ||
          existing.count >= maximum
        ) {
          throw new GatewayError("context-query-rate-limited");
        }
        existing.count += 1;
      }
      return now;
    },
  };
}

export type InMemoryPreviewAdmissionLimiterOptions = PreviewWindowOptions;

/**
 * Best-effort per-isolate admission defense. It is deliberately independent
 * of world IDs so cycling unauthorized IDs cannot amplify datastore reads.
 */
export function createInMemoryPreviewAdmissionLimiter(
  options: InMemoryPreviewAdmissionLimiterOptions = {},
): WorldContextAdmissionLimiter {
  const window = createPreviewWindow(options);
  return {
    consume(actor: WorldContextActor): void {
      window.consume(
        canonicalSha256({
          schemaVersion: "arcanea.world-context-admission-key.preview.v1",
          authenticatedTenantId: actor.tenantId,
          authenticatedActorId: actor.actorId,
        }),
      );
    },
  };
}

/**
 * Best-effort preview authority only. It proves exact binding and local rate
 * behavior but is intentionally not durable or horizontally authoritative.
 */
export function createInMemoryPreviewAuthority(
  options: InMemoryPreviewAuthorityOptions = {},
): WorldContextAuthority {
  const window = createPreviewWindow(options);

  return {
    async authorize(
      input: WorldContextAuthorityInput,
    ): Promise<WorldContextAuthorityRecord> {
      const partitionKey = canonicalSha256({
        authenticatedTenantId: input.authenticatedTenantId,
        authenticatedActorId: input.authenticatedActorId,
        worldId: input.worldId,
      });
      const now = window.consume(partitionKey);
      const nowMs = now.getTime();

      const authorityKey = canonicalSha256({
        schemaVersion: "arcanea.world-context-authority-key.v1",
        contextRequestHash: input.contextRequestHash,
        authenticatedTenantId: input.authenticatedTenantId,
        authenticatedActorId: input.authenticatedActorId,
        worldId: input.worldId,
        membershipGrantId: input.membershipGrantId,
        revision: input.revision,
        snapshotHash: input.snapshotHash,
      });
      const record: WorldContextAuthorityRecord = {
        schemaVersion: "arcanea.world-context-authority.preview.v1",
        authorityKey,
        classification: "bounded-relevant",
        verificationMethod: "preview-memory",
        ...input,
        authorizedAt: now.toISOString(),
        expiresAt: new Date(
          nowMs + Math.min(300, window.windowSeconds) * 1000,
        ).toISOString(),
      };
      return Object.freeze(record);
    },
  };
}
