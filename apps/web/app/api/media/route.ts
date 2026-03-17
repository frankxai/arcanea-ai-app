/**
 * Media API — /api/media
 *
 * Lists canonical Arcanea images from the typed registry.
 * Supports filtering by category, guardian, element, gate, version, and format.
 *
 * GET /api/media
 * GET /api/media?category=guardians
 * GET /api/media?category=godbeasts&guardian=draconia
 * GET /api/media?category=guardians&element=fire&format=webp
 * GET /api/media?guardian=lyria&version=v3
 * GET /api/media?gate=sight
 *
 * Response shape:
 * {
 *   images: ImageRecord[],
 *   total: number,
 *   filters: { category?, guardian?, element?, gate?, version?, format? }
 * }
 */

import { type NextRequest, NextResponse } from 'next/server';
import {
  MEDIA_REGISTRY,
  filterImages,
  type ImageCategory,
  type ImageVersion,
} from '@/lib/media/image-registry';

const VALID_CATEGORIES: ImageCategory[] = ['guardians', 'godbeasts', 'gallery', 'luminors'];
const VALID_VERSIONS: ImageVersion[] = ['v1', 'v2', 'v3'];
const VALID_FORMATS = ['webp', 'jpg', 'jpeg', 'png', 'all'] as const;
type ImageFormat = typeof VALID_FORMATS[number];

// Cache for 10 minutes on CDN, 5 minutes stale-while-revalidate
const CACHE_CONTROL = 'public, max-age=600, s-maxage=600, stale-while-revalidate=300';

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;

  // ── Parse and validate query params ─────────────────────────────────────

  const rawCategory = searchParams.get('category');
  const rawGuardian = searchParams.get('guardian');
  const rawElement  = searchParams.get('element');
  const rawGate     = searchParams.get('gate');
  const rawVersion  = searchParams.get('version');
  const rawFormat   = searchParams.get('format');

  // Validate category
  let category: ImageCategory | undefined;
  if (rawCategory !== null) {
    if (!VALID_CATEGORIES.includes(rawCategory as ImageCategory)) {
      return badRequest(
        `Invalid category "${rawCategory}". Valid values: ${VALID_CATEGORIES.join(', ')}`
      );
    }
    category = rawCategory as ImageCategory;
  }

  // Validate version
  let version: ImageVersion | undefined;
  if (rawVersion !== null) {
    if (!VALID_VERSIONS.includes(rawVersion as ImageVersion)) {
      return badRequest(
        `Invalid version "${rawVersion}". Valid values: ${VALID_VERSIONS.join(', ')}`
      );
    }
    version = rawVersion as ImageVersion;
  }

  // Validate format — used only as a filter on URL extension
  let format: ImageFormat | undefined;
  if (rawFormat !== null) {
    const normalized = rawFormat.toLowerCase();
    if (!VALID_FORMATS.includes(normalized as ImageFormat)) {
      return badRequest(
        `Invalid format "${rawFormat}". Valid values: ${VALID_FORMATS.join(', ')}`
      );
    }
    format = normalized === 'all' ? undefined : (normalized as ImageFormat);
  }

  // Sanitise string params (no path traversal, strip leading/trailing whitespace)
  function sanitizeParam(value: string | null): string | undefined {
    if (value === null) return undefined;
    const trimmed = value.trim().toLowerCase();
    // Allow only alphanumeric, hyphen, underscore
    if (!/^[a-z0-9_-]+$/.test(trimmed)) return undefined;
    return trimmed;
  }

  const guardian = sanitizeParam(rawGuardian);
  const element  = sanitizeParam(rawElement);
  const gate     = sanitizeParam(rawGate);

  // Reject if a provided param sanitised to undefined (likely injection attempt)
  if (rawGuardian !== null && guardian === undefined) {
    return badRequest('Invalid guardian parameter.');
  }
  if (rawElement !== null && element === undefined) {
    return badRequest('Invalid element parameter.');
  }
  if (rawGate !== null && gate === undefined) {
    return badRequest('Invalid gate parameter.');
  }

  // ── Filter registry ──────────────────────────────────────────────────────

  let results = filterImages({ category, guardian, element, gate, version });

  // Apply format filter if requested
  if (format) {
    results = results.filter((r) => r.url.endsWith(`.${format}`));
  }

  // ── Build response ───────────────────────────────────────────────────────

  const activeFilters: Record<string, string> = {};
  if (category)  activeFilters.category = category;
  if (guardian)  activeFilters.guardian = guardian;
  if (element)   activeFilters.element  = element;
  if (gate)      activeFilters.gate     = gate;
  if (version)   activeFilters.version  = version;
  if (format)    activeFilters.format   = format;

  const body = {
    images: results,
    total: results.length,
    registryTotal: MEDIA_REGISTRY.length,
    filters: activeFilters,
  };

  return NextResponse.json(body, {
    status: 200,
    headers: {
      'Cache-Control': CACHE_CONTROL,
      'Content-Type': 'application/json',
    },
  });
}
