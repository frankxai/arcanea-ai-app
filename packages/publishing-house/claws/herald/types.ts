/**
 * Herald Claw — Social Marketing Types
 *
 * All types for the Herald Claw social content generation and scheduling system.
 */

// ---------------------------------------------------------------------------
// Platform & Content Input
// ---------------------------------------------------------------------------

export type SocialPlatform = 'x' | 'instagram' | 'linkedin' | 'threads' | 'bluesky';

export interface ContentInput {
  title: string;
  summary: string;
  excerpt: string;
  coverImageUrl?: string;
  author: string;
  tags: string[];
  collection?: string;
  worldGraphContext?: string;
}

// ---------------------------------------------------------------------------
// Social Drafts
// ---------------------------------------------------------------------------

export interface SocialDraft {
  platform: SocialPlatform;
  posts: string[];
  hashtags: string[];
  suggestedImages: string[];
  scheduledFor?: Date;
}

// ---------------------------------------------------------------------------
// Platform Constraints
// ---------------------------------------------------------------------------

export interface PlatformConstraints {
  maxChars: number;
  minPosts: number;
  maxPosts: number;
  maxHashtags: number;
  tone: string;
}

export const PLATFORM_CONSTRAINTS: Record<SocialPlatform, PlatformConstraints> = {
  x: { maxChars: 280, minPosts: 3, maxPosts: 7, maxHashtags: 5, tone: 'punchy' },
  instagram: { maxChars: 2200, minPosts: 1, maxPosts: 10, maxHashtags: 30, tone: 'emoji-rich' },
  linkedin: { maxChars: 1300, minPosts: 1, maxPosts: 1, maxHashtags: 5, tone: 'professional' },
  threads: { maxChars: 500, minPosts: 3, maxPosts: 5, maxHashtags: 5, tone: 'conversational' },
  bluesky: { maxChars: 300, minPosts: 1, maxPosts: 3, maxHashtags: 5, tone: 'community-focused' },
};

// ---------------------------------------------------------------------------
// Scheduling
// ---------------------------------------------------------------------------

export type QueueStatus_EntryStatus = 'queued' | 'published' | 'failed';

export interface QueueEntry {
  id: string;
  platform: SocialPlatform;
  content: string;
  scheduledFor: Date;
  status: QueueStatus_EntryStatus;
  createdAt: Date;
}

export interface ScheduleStrategy {
  startDate: Date;
  intervalHours: number;
  timezone: string;
  peakHoursOnly: boolean;
}

export interface QueueStatus {
  pending: number;
  published: number;
  failed: number;
  total: number;
  nextScheduled: Date | null;
}

/**
 * Peak engagement hours per platform (UTC base).
 * Timezone offsets are applied at scheduling time.
 */
export const PEAK_HOURS: Record<SocialPlatform, number[]> = {
  x: [9, 12, 17],
  instagram: [11, 13, 19],
  linkedin: [8, 10, 12],
  threads: [10, 14, 20],
  bluesky: [9, 11, 16],
};

// ---------------------------------------------------------------------------
// Supabase Row Types (mirrors social_queue table)
// ---------------------------------------------------------------------------

export interface SocialQueueRow {
  id: string;
  platform: string;
  content: string;
  hashtags: string;
  scheduled_for: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SocialQueueInsert {
  platform: string;
  content: string;
  hashtags: string;
  scheduled_for: string;
  status: string;
}
