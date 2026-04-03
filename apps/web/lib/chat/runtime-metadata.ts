export interface ArcaneaRuntimeMetadata {
  modelLabel?: string | null;
  provider?: string | null;
  routeMode?: 'gateway' | 'legacy' | 'auto-detected' | 'unknown';
  apiKeySource?: 'server-env' | 'client-byok' | 'unknown';
  retrievalMode?: 'graph+selection' | 'selection-only' | 'none';
  selectedSessionCount?: number;
  availableSessionCount?: number;
  selectedCreationCount?: number;
  availableCreationCount?: number;
  selectedDocCount?: number;
  availableDocCount?: number;
  selectedMemoryCount?: number;
  availableMemoryCount?: number;
  hasStoredSummary?: boolean;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function toNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

export function buildArcaneaRuntimeHeaders(metadata: ArcaneaRuntimeMetadata): Record<string, string> {
  const headers: Record<string, string> = {};

  if (metadata.modelLabel) headers['x-arcanea-model'] = metadata.modelLabel;
  if (metadata.provider) headers['x-arcanea-provider'] = metadata.provider;
  if (metadata.routeMode) headers['x-arcanea-route-mode'] = metadata.routeMode;
  if (metadata.apiKeySource) headers['x-arcanea-api-key-source'] = metadata.apiKeySource;
  if (metadata.retrievalMode) headers['x-arcanea-retrieval-mode'] = metadata.retrievalMode;
  if (typeof metadata.selectedSessionCount === 'number') headers['x-arcanea-context-sessions'] = String(metadata.selectedSessionCount);
  if (typeof metadata.availableSessionCount === 'number') headers['x-arcanea-context-sessions-available'] = String(metadata.availableSessionCount);
  if (typeof metadata.selectedCreationCount === 'number') headers['x-arcanea-context-creations'] = String(metadata.selectedCreationCount);
  if (typeof metadata.availableCreationCount === 'number') headers['x-arcanea-context-creations-available'] = String(metadata.availableCreationCount);
  if (typeof metadata.selectedDocCount === 'number') headers['x-arcanea-context-docs'] = String(metadata.selectedDocCount);
  if (typeof metadata.availableDocCount === 'number') headers['x-arcanea-context-docs-available'] = String(metadata.availableDocCount);
  if (typeof metadata.selectedMemoryCount === 'number') headers['x-arcanea-context-memories'] = String(metadata.selectedMemoryCount);
  if (typeof metadata.availableMemoryCount === 'number') headers['x-arcanea-context-memories-available'] = String(metadata.availableMemoryCount);
  if (typeof metadata.hasStoredSummary === 'boolean') headers['x-arcanea-context-summary'] = metadata.hasStoredSummary ? 'stored' : 'none';

  return headers;
}

export function parseArcaneaRuntimeHeaders(headers: Headers): ArcaneaRuntimeMetadata {
  return {
    modelLabel: headers.get('x-arcanea-model'),
    provider: headers.get('x-arcanea-provider'),
    routeMode: (headers.get('x-arcanea-route-mode') as ArcaneaRuntimeMetadata['routeMode']) ?? undefined,
    apiKeySource: (headers.get('x-arcanea-api-key-source') as ArcaneaRuntimeMetadata['apiKeySource']) ?? undefined,
    retrievalMode: (headers.get('x-arcanea-retrieval-mode') as ArcaneaRuntimeMetadata['retrievalMode']) ?? undefined,
    selectedSessionCount: toNumber(headers.get('x-arcanea-context-sessions')),
    availableSessionCount: toNumber(headers.get('x-arcanea-context-sessions-available')),
    selectedCreationCount: toNumber(headers.get('x-arcanea-context-creations')),
    availableCreationCount: toNumber(headers.get('x-arcanea-context-creations-available')),
    selectedDocCount: toNumber(headers.get('x-arcanea-context-docs')),
    availableDocCount: toNumber(headers.get('x-arcanea-context-docs-available')),
    selectedMemoryCount: toNumber(headers.get('x-arcanea-context-memories')),
    availableMemoryCount: toNumber(headers.get('x-arcanea-context-memories-available')),
    hasStoredSummary: headers.get('x-arcanea-context-summary') === 'stored'
      ? true
      : headers.get('x-arcanea-context-summary') === 'none'
        ? false
        : undefined,
  };
}

export function coerceArcaneaRuntimeMetadata(value: unknown): ArcaneaRuntimeMetadata | null {
  const record = asRecord(value);
  if (!record) return null;

  const metadata: ArcaneaRuntimeMetadata = {
    modelLabel: toOptionalString(record.modelLabel),
    provider: toOptionalString(record.provider),
    routeMode: record.routeMode as ArcaneaRuntimeMetadata['routeMode'] | undefined,
    apiKeySource: record.apiKeySource as ArcaneaRuntimeMetadata['apiKeySource'] | undefined,
    retrievalMode: record.retrievalMode as ArcaneaRuntimeMetadata['retrievalMode'] | undefined,
    selectedSessionCount: toOptionalNumber(record.selectedSessionCount),
    availableSessionCount: toOptionalNumber(record.availableSessionCount),
    selectedCreationCount: toOptionalNumber(record.selectedCreationCount),
    availableCreationCount: toOptionalNumber(record.availableCreationCount),
    selectedDocCount: toOptionalNumber(record.selectedDocCount),
    availableDocCount: toOptionalNumber(record.availableDocCount),
    selectedMemoryCount: toOptionalNumber(record.selectedMemoryCount),
    availableMemoryCount: toOptionalNumber(record.availableMemoryCount),
    hasStoredSummary: toOptionalBoolean(record.hasStoredSummary),
  };

  return isArcaneaRuntimeMetadataEmpty(metadata) ? null : metadata;
}

export function isArcaneaRuntimeMetadataEmpty(metadata: ArcaneaRuntimeMetadata | null | undefined): boolean {
  if (!metadata) return true;

  return !(
    metadata.modelLabel ||
    metadata.provider ||
    metadata.routeMode ||
    metadata.apiKeySource ||
    metadata.retrievalMode ||
    typeof metadata.selectedSessionCount === 'number' ||
    typeof metadata.availableSessionCount === 'number' ||
    typeof metadata.selectedCreationCount === 'number' ||
    typeof metadata.availableCreationCount === 'number' ||
    typeof metadata.selectedDocCount === 'number' ||
    typeof metadata.availableDocCount === 'number' ||
    typeof metadata.selectedMemoryCount === 'number' ||
    typeof metadata.availableMemoryCount === 'number' ||
    typeof metadata.hasStoredSummary === 'boolean'
  );
}

export function formatArcaneaRuntimeSummary(metadata: ArcaneaRuntimeMetadata): string | null {
  const pieces: string[] = [];

  if (metadata.provider) {
    const route = metadata.routeMode && metadata.routeMode !== 'unknown'
      ? `${metadata.provider} via ${metadata.routeMode}`
      : metadata.provider;
    pieces.push(route);
  }

  const contextParts: string[] = [];
  if (typeof metadata.selectedSessionCount === 'number') {
    contextParts.push(`${metadata.selectedSessionCount} session${metadata.selectedSessionCount === 1 ? '' : 's'}`);
  }
  if (typeof metadata.selectedDocCount === 'number') {
    contextParts.push(`${metadata.selectedDocCount} doc${metadata.selectedDocCount === 1 ? '' : 's'}`);
  }
  if (typeof metadata.selectedMemoryCount === 'number') {
    contextParts.push(`${metadata.selectedMemoryCount} memor${metadata.selectedMemoryCount === 1 ? 'y' : 'ies'}`);
  }

  if (contextParts.length > 0) {
    pieces.push(`context ${contextParts.join(' · ')}`);
  }

  if (metadata.hasStoredSummary) {
    pieces.push('stored summary');
  }

  return pieces.length > 0 ? pieces.join(' · ') : null;
}
