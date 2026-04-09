/**
 * Herald Claw — Social Queue Scheduling
 *
 * Manages the social post queue via Supabase REST API.
 * Supports timezone-aware scheduling with peak-hour optimization.
 */

import type {
  SocialDraft,
  SocialPlatform,
  QueueEntry,
  QueueStatus,
  ScheduleStrategy,
  SocialQueueInsert,
  SocialQueueRow,
  QueueStatus_EntryStatus,
} from './types.js';
import { PEAK_HOURS } from './types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  return `hq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Get the UTC offset in hours for a given IANA timezone string.
 * Falls back to 0 (UTC) if the timezone is not resolvable.
 */
function getTimezoneOffsetHours(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (!tzPart) return 0;

    // Parse "GMT+2", "GMT-5", "GMT+5:30", "GMT" etc.
    const match = tzPart.value.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
    if (!match) return 0;

    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2] ?? '0', 10);
    const minutes = parseInt(match[3] ?? '0', 10);
    return sign * (hours + minutes / 60);
  } catch {
    return 0;
  }
}

/**
 * Find the next available peak hour for a platform after a given date.
 */
function nextPeakHour(
  platform: SocialPlatform,
  after: Date,
  timezoneOffsetHours: number,
): Date {
  const peaks = PEAK_HOURS[platform];
  const candidate = new Date(after);

  // Try today and next 7 days max
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    for (const peakUtcBase of peaks) {
      const peakUtc = peakUtcBase - timezoneOffsetHours;
      const normalizedHour = ((peakUtc % 24) + 24) % 24;

      candidate.setUTCDate(after.getUTCDate() + dayOffset);
      candidate.setUTCHours(normalizedHour, 0, 0, 0);

      if (candidate.getTime() > after.getTime()) {
        return new Date(candidate);
      }
    }
  }

  // Fallback: next day at first peak hour
  const fallback = new Date(after);
  fallback.setUTCDate(fallback.getUTCDate() + 1);
  const firstPeak = peaks[0] ?? 9;
  fallback.setUTCHours(((firstPeak - timezoneOffsetHours) % 24 + 24) % 24, 0, 0, 0);
  return fallback;
}

// ---------------------------------------------------------------------------
// Supabase REST Client
// ---------------------------------------------------------------------------

interface SupabaseConfig {
  url: string;
  key: string;
}

async function supabaseInsert(
  config: SupabaseConfig,
  table: string,
  rows: SocialQueueInsert[],
): Promise<SocialQueueRow[]> {
  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.key,
      'Authorization': `Bearer ${config.key}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${body}`);
  }

  return (await response.json()) as SocialQueueRow[];
}

async function supabaseSelect(
  config: SupabaseConfig,
  table: string,
  query: string,
): Promise<SocialQueueRow[]> {
  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': config.key,
      'Authorization': `Bearer ${config.key}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase select failed (${response.status}): ${body}`);
  }

  return (await response.json()) as SocialQueueRow[];
}

// ---------------------------------------------------------------------------
// Queue Entry Conversion
// ---------------------------------------------------------------------------

function rowToQueueEntry(row: SocialQueueRow): QueueEntry {
  return {
    id: row.id,
    platform: row.platform as SocialPlatform,
    content: row.content,
    scheduledFor: new Date(row.scheduled_for),
    status: row.status as QueueStatus_EntryStatus,
    createdAt: new Date(row.created_at),
  };
}

function draftToInsertRows(
  draft: SocialDraft,
  publishAt: Date,
): SocialQueueInsert[] {
  return draft.posts.map((post, index) => ({
    platform: draft.platform,
    content: post,
    hashtags: JSON.stringify(draft.hashtags),
    scheduled_for: new Date(publishAt.getTime() + index * 60_000).toISOString(),
    status: 'queued',
  }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Schedule a single social draft for publication.
 *
 * Writes all posts in the draft to the Supabase social_queue table.
 * Posts within a thread/carousel are staggered by 1 minute.
 *
 * @param draft - The social draft to schedule
 * @param publishAt - When to publish
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase anon/service key
 * @returns The created queue entry (first post in the draft)
 */
export async function schedulePost(
  draft: SocialDraft,
  publishAt: Date,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<QueueEntry> {
  if (draft.posts.length === 0) {
    throw new Error('Draft contains no posts to schedule');
  }

  if (publishAt.getTime() < Date.now()) {
    throw new Error('Cannot schedule posts in the past');
  }

  const config: SupabaseConfig = { url: supabaseUrl, key: supabaseKey };
  const rows = draftToInsertRows(draft, publishAt);
  const inserted = await supabaseInsert(config, 'social_queue', rows);

  if (inserted.length === 0) {
    throw new Error('No rows returned from Supabase insert');
  }

  return rowToQueueEntry(inserted[0]!);
}

/**
 * Schedule a full social campaign across multiple platforms.
 *
 * Distributes drafts according to the given strategy:
 * - Respects interval between posts
 * - Optionally restricts to peak engagement hours per platform
 * - Applies timezone offset for accurate local-time scheduling
 *
 * @param drafts - Array of social drafts to schedule
 * @param strategy - Scheduling strategy configuration
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase anon/service key
 * @returns Array of created queue entries (one per draft)
 */
export async function scheduleCampaign(
  drafts: SocialDraft[],
  strategy: ScheduleStrategy,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<QueueEntry[]> {
  if (drafts.length === 0) {
    throw new Error('Campaign requires at least one draft');
  }

  const config: SupabaseConfig = { url: supabaseUrl, key: supabaseKey };
  const tzOffset = getTimezoneOffsetHours(strategy.timezone);
  const intervalMs = strategy.intervalHours * 60 * 60 * 1000;

  let cursor = new Date(strategy.startDate);
  const entries: QueueEntry[] = [];

  for (const draft of drafts) {
    let publishAt: Date;

    if (strategy.peakHoursOnly) {
      publishAt = nextPeakHour(draft.platform, cursor, tzOffset);
    } else {
      publishAt = new Date(cursor);
    }

    const rows = draftToInsertRows(draft, publishAt);
    const inserted = await supabaseInsert(config, 'social_queue', rows);

    if (inserted.length > 0) {
      entries.push(rowToQueueEntry(inserted[0]!));
    }

    // Advance cursor by interval
    cursor = new Date(Math.max(publishAt.getTime(), cursor.getTime()) + intervalMs);
  }

  return entries;
}

/**
 * Get the current state of the social queue.
 *
 * @param supabaseUrl - Supabase project URL
 * @param supabaseKey - Supabase anon/service key
 * @returns Queue status with counts by state and next scheduled post
 */
export async function getQueueStatus(
  supabaseUrl: string,
  supabaseKey: string,
): Promise<QueueStatus> {
  const config: SupabaseConfig = { url: supabaseUrl, key: supabaseKey };

  // Fetch all queue entries (select only needed columns)
  const rows = await supabaseSelect(
    config,
    'social_queue',
    'select=id,status,scheduled_for&order=scheduled_for.asc',
  );

  let pending = 0;
  let published = 0;
  let failed = 0;
  let nextScheduled: Date | null = null;

  for (const row of rows) {
    switch (row.status) {
      case 'queued':
        pending++;
        if (!nextScheduled) {
          nextScheduled = new Date(row.scheduled_for);
        }
        break;
      case 'published':
        published++;
        break;
      case 'failed':
        failed++;
        break;
    }
  }

  return {
    pending,
    published,
    failed,
    total: rows.length,
    nextScheduled,
  };
}
