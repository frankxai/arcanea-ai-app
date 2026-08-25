import type { GatewayErrorCode } from "./errors.js";
import type {
  AuthorizedWorldSnapshot,
  WorldContextInput,
  WorldContextRole,
  WorldContextState,
  WorldContextVisibility,
} from "./schema.js";

export interface WorldContextActor {
  actorId: string;
  tenantId: string;
}

export interface LoadAuthorizedSnapshotInput {
  actor: WorldContextActor;
  worldId: string;
  visibilityScope: WorldContextInput["visibilityScope"];
}

export interface WorldContextRepository {
  loadAuthorizedSnapshot(
    input: LoadAuthorizedSnapshotInput,
  ): Promise<AuthorizedWorldSnapshot>;
}

export interface WorldContextAuthorityInput {
  authenticatedTenantId: string;
  authenticatedActorId: string;
  contextRequestHash: string;
  normalizedQueryHash: string;
  filtersHash: string;
  worldId: string;
  membershipRole: WorldContextRole;
  membershipGrantId: string;
  worldVisibility: WorldContextVisibility;
  effectiveVisibility: WorldContextVisibility;
  revision: string;
  snapshotHash: string;
  includeStates: WorldContextState[];
  maxEntities: number;
  visibilityScope: WorldContextInput["visibilityScope"];
  contentHash: string;
}

export interface WorldContextAuthorityRecord extends WorldContextAuthorityInput {
  schemaVersion: "arcanea.world-context-authority.preview.v1";
  authorityKey: string;
  classification: "bounded-relevant";
  verificationMethod: "preview-memory";
  authorizedAt: string;
  expiresAt: string;
}

export interface WorldContextAuthority {
  authorize(
    input: WorldContextAuthorityInput,
  ): Promise<WorldContextAuthorityRecord>;
}

export interface WorldContextAdmissionLimiter {
  consume(actor: WorldContextActor): void | Promise<void>;
}

export interface WorldContextAuditEvent {
  schemaVersion: "arcanea.world-context-audit.v1";
  outcome: "allowed" | "denied";
  code?: GatewayErrorCode;
  authenticatedTenantId: string;
  authenticatedActorId: string;
  worldId?: string;
  contextRequestHash?: string;
  normalizedQueryHash?: string;
  filtersHash?: string;
  revision?: string;
  returnedEntities?: number;
  returnedConflicts?: number;
  returnedProvenance?: number;
}

export interface WorldContextAuditSink {
  record(event: WorldContextAuditEvent): void | Promise<void>;
}

export interface WorldContextGatewayDependencies {
  actor: WorldContextActor;
  repository: WorldContextRepository;
  authority: WorldContextAuthority;
  audit?: WorldContextAuditSink;
}
