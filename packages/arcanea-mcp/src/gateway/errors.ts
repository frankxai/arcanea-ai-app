export type GatewayErrorCode =
  | "authentication-required"
  | "world-not-found"
  | "visibility-denied"
  | "query-too-broad"
  | "revision-unavailable"
  | "state-coverage-unavailable"
  | "context-visibility-leak"
  | "context-requested-states-mismatch"
  | "context-state-partition-mismatch"
  | "context-visibility-scope-mismatch"
  | "context-count-mismatch"
  | "context-bound-mismatch"
  | "context-provenance-unresolved"
  | "context-provenance-partition-mismatch"
  | "context-returned-states-mismatch"
  | "context-returned-visibility-mismatch"
  | "context-unrequested-state"
  | "context-world-mismatch"
  | "context-role-mismatch"
  | "context-grant-mismatch"
  | "context-access-visibility-mismatch"
  | "context-effective-visibility-mismatch"
  | "context-query-binding-mismatch"
  | "context-query-plan-unbounded"
  | "context-query-classification-unverified"
  | "context-query-window-invalid"
  | "context-query-rate-limited"
  | "context-filter-mismatch"
  | "context-revision-mismatch"
  | "context-snapshot-mismatch"
  | "context-source-mismatch"
  | "adapter-required";

const SAFE_MESSAGES: Record<GatewayErrorCode, string> = {
  "authentication-required": "Authentication is required.",
  "world-not-found": "World not found.",
  "visibility-denied": "The requested visibility scope is not available.",
  "query-too-broad":
    "Use at least one exact entity or source selector and a bounded query.",
  "revision-unavailable": "A trustworthy world revision is not available.",
  "state-coverage-unavailable":
    "One or more requested canon states are not indexed.",
  "context-visibility-leak": "World context visibility validation failed.",
  "context-requested-states-mismatch":
    "Requested canon-state binding validation failed.",
  "context-state-partition-mismatch":
    "Canon-state partition validation failed.",
  "context-visibility-scope-mismatch":
    "Visibility-scope binding validation failed.",
  "context-count-mismatch": "World context result-count validation failed.",
  "context-bound-mismatch": "World context bound validation failed.",
  "context-provenance-unresolved": "World context provenance is incomplete.",
  "context-provenance-partition-mismatch":
    "World context provenance partition validation failed.",
  "context-returned-states-mismatch": "Returned canon-state validation failed.",
  "context-returned-visibility-mismatch":
    "Returned visibility validation failed.",
  "context-unrequested-state":
    "The result contains an unrequested canon state.",
  "context-world-mismatch": "World binding validation failed.",
  "context-role-mismatch": "Role binding validation failed.",
  "context-grant-mismatch": "Membership grant binding validation failed.",
  "context-access-visibility-mismatch":
    "World visibility binding validation failed.",
  "context-effective-visibility-mismatch":
    "Effective visibility binding validation failed.",
  "context-query-binding-mismatch":
    "Query authority binding validation failed.",
  "context-query-plan-unbounded": "The query plan is not bounded.",
  "context-query-classification-unverified":
    "The bounded query classification is not verified.",
  "context-query-window-invalid": "The query rate window is invalid.",
  "context-query-rate-limited":
    "The World Context request rate limit was reached.",
  "context-filter-mismatch": "Filter binding validation failed.",
  "context-revision-mismatch": "Revision binding validation failed.",
  "context-snapshot-mismatch": "Snapshot binding validation failed.",
  "context-source-mismatch": "Source binding validation failed.",
  "adapter-required": "The production World Context adapter is not connected.",
};

export class GatewayError extends Error {
  readonly code: GatewayErrorCode;

  constructor(code: GatewayErrorCode, options?: ErrorOptions) {
    super(SAFE_MESSAGES[code], options);
    this.name = "GatewayError";
    this.code = code;
  }
}

export function asGatewayError(error: unknown): GatewayError {
  return error instanceof GatewayError
    ? error
    : new GatewayError("revision-unavailable", { cause: error });
}
