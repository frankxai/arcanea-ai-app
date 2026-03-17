/**
 * Arc Protocol — Client-Side API Functions
 *
 * Typed functions for calling the /api/arcs endpoints from the web app.
 * Import types from the local arc-protocol package.
 */

import type {
  Arc,
  ArcType,
  ArcStage,
  ArcHistoryEntry,
  Palette,
  Relation,
} from '../../../../packages/arc-protocol/src/types';
import { toAgentContext as toAgentContextCore } from '../../../../packages/arc-protocol/src/arc';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreateArcOptions {
  type: ArcType;
  creator: string;
  spark?: string;
  palette?: Palette;
  sharpen?: string[];
  tags?: string[];
  gate?: number;
  element?: string;
}

export interface AdvanceArcEntry {
  input?: string;
  model?: string;
  output?: string;
  output_hash?: string;
  quality?: number;
  note?: string;
}

export interface ListArcsResponse {
  arcs: Arc[];
  total: number;
  returned: number;
}

export interface ListArcsParams {
  type?: ArcType;
  creator?: string;
  stage?: ArcStage;
  limit?: number;
}

export interface ArcApiError {
  error: string;
  details?: string[];
  retryAfter?: number;
}

// ── Internal Helpers ─────────────────────────────────────────────────────────

const API_BASE = '/api/arcs';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    const err = data as ArcApiError;
    const message = err.error || `Request failed with status ${res.status}`;
    const error = new Error(message) as Error & { status: number; details?: string[] };
    error.status = res.status;
    if (err.details) error.details = err.details;
    throw error;
  }

  return data as T;
}

// ── API Functions ────────────────────────────────────────────────────────────

/**
 * Create a new arc.
 *
 * @example
 * const arc = await createArc({
 *   type: 'character',
 *   creator: 'user_abc123',
 *   spark: 'A fire mage who paints with flame',
 *   palette: 'forge',
 *   sharpen: ['generic fantasy tropes', 'cliched backstory'],
 *   tags: ['fire', 'artist', 'mage'],
 * });
 */
export async function createArc(options: CreateArcOptions): Promise<Arc> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });

  return handleResponse<Arc>(res);
}

/**
 * Get a specific arc by ID.
 */
export async function getArc(id: string): Promise<Arc> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse<Arc>(res);
}

/**
 * Advance an arc to its next lifecycle stage.
 *
 * Stages flow: potential -> manifestation -> experience -> dissolution -> evolved
 * After 'evolved', the arc cycles back to 'potential'.
 */
export async function advanceArc(id: string, entry: AdvanceArcEntry = {}): Promise<Arc> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'advance', ...entry }),
  });

  return handleResponse<Arc>(res);
}

/**
 * Bond one arc to another with a named relation.
 *
 * @param id       - The arc to add the bond to
 * @param targetId - The arc being bonded to
 * @param relation - The type of bond
 * @param note     - Optional description of the bond
 */
export async function bondArcs(
  id: string,
  targetId: string,
  relation: Relation,
  note?: string,
): Promise<Arc> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'bond', targetId, relation, note }),
  });

  return handleResponse<Arc>(res);
}

/**
 * List arcs with optional filters.
 *
 * @param params.type    - Filter by arc type
 * @param params.creator - Filter by creator ID
 * @param params.stage   - Filter by lifecycle stage
 * @param params.limit   - Max results (1-200, default 50)
 */
export async function listArcs(params: ListArcsParams = {}): Promise<ListArcsResponse> {
  const url = new URL(API_BASE, window.location.origin);

  if (params.type) url.searchParams.set('type', params.type);
  if (params.creator) url.searchParams.set('creator', params.creator);
  if (params.stage) url.searchParams.set('stage', params.stage);
  if (params.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  return handleResponse<ListArcsResponse>(res);
}

/**
 * Generate an agent-readable prompt context block from an arc.
 * This runs entirely client-side with no API call.
 *
 * @example
 * const context = toAgentContext(arc);
 * // Returns a string like:
 * // [ARC CONTEXT - character: arc_a1b2c3d4]
 * // Stage: potential
 * // Creator: user_abc123
 * // SPARK: A fire mage who paints with flame
 * // PALETTE: FORGE
 * // SHARPEN: NOT generic fantasy tropes. NOT cliched backstory
 */
export function toAgentContext(arc: Arc): string {
  return toAgentContextCore(arc);
}

// Re-export types for convenience
export type { Arc, ArcType, ArcStage, Palette, Relation } from '../../../../packages/arc-protocol/src/types';
