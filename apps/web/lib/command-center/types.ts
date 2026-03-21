// =============================================================================
// Arcanea Command Center + ArcaneaClaw — Shared Type Definitions
// =============================================================================
//
// Asset status flow: new → classified → processed → scored → approved/rejected → published
// Quality tiers:     hero (80+), gallery (60-79), thumbnail (40-59), reject (<40), unscored
// Storage tiers:     vercel_blob (CDN heroes), supabase (user content), r2 (large media), local (staging)
//
// These types mirror the Supabase tables and serve as the contract between
// the web UI, agent communication protocol, and all pipeline systems.
// =============================================================================

// ---------------------------------------------------------------------------
// Canonical Enums — Arcanea Mythology
// ---------------------------------------------------------------------------

/** The 10 Guardians (God/Goddess Gate-keepers) in canonical Gate order. */
export type Guardian =
  | 'Lyssandria'
  | 'Leyla'
  | 'Draconia'
  | 'Maylinn'
  | 'Alera'
  | 'Lyria'
  | 'Aiyami'
  | 'Elara'
  | 'Ino'
  | 'Shinkami';

/** The 5 Elements of the Arcanea cosmos. Void is Nero's aspect (potential). */
export type Element = 'Earth' | 'Water' | 'Fire' | 'Wind' | 'Void';

/** The 10 Gates in ascending frequency order (174 Hz → 1111 Hz). */
export type Gate =
  | 'Foundation'
  | 'Flow'
  | 'Fire'
  | 'Heart'
  | 'Voice'
  | 'Sight'
  | 'Crown'
  | 'Starweave'
  | 'Unity'
  | 'Source';

// ---------------------------------------------------------------------------
// Asset Pipeline Types
// ---------------------------------------------------------------------------

/** Lifecycle status of a media asset as it moves through the pipeline. */
export type AssetStatus =
  | 'new'
  | 'classified'
  | 'processed'
  | 'scored'
  | 'approved'
  | 'rejected'
  | 'published';

/** Quality tier derived from the AI quality score (0-100). */
export type QualityTier = 'hero' | 'gallery' | 'thumbnail' | 'reject' | 'unscored';

/** The intended usage type for a piece of content. */
export type ContentType = 'hero' | 'gallery' | 'thumbnail' | 'social' | 'video' | 'audio' | 'raw';

/** Storage backend where the asset binary lives. */
export type StorageTier = 'vercel_blob' | 'supabase' | 'r2' | 'local';

// ---------------------------------------------------------------------------
// Agent Types
// ---------------------------------------------------------------------------

/** Identifier for the kind of agent operating in the system. */
export type AgentType =
  | 'arcanea-claw'
  | 'claude-code'
  | 'mobile-capture'
  | 'cloud-gemini'
  | 'cloud-suno'
  | 'cloud-dalle'
  | 'cloud-flux';

/** Current operational status of an agent. */
export type AgentStatus = 'online' | 'busy' | 'idle' | 'offline' | 'error';

/** Discrete capabilities an agent can advertise. */
export type AgentCapability =
  | 'scan'
  | 'classify'
  | 'process'
  | 'dedup'
  | 'score'
  | 'upload'
  | 'generate'
  | 'social_prep'
  | 'notify';

// ---------------------------------------------------------------------------
// Social & Publish Types
// ---------------------------------------------------------------------------

/** Supported social media platforms. */
export type SocialPlatform = 'instagram' | 'linkedin' | 'x' | 'youtube' | 'tiktok';

/** Lifecycle status of a social post. */
export type SocialStatus =
  | 'draft'
  | 'ready'
  | 'approved'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed';

/** Where content can be deployed to. */
export type PublishTarget = 'website' | 'social' | 'nft' | 'book' | 'music_platform';

/** Specific deployment action within a publish target. */
export type PublishAction =
  | 'deploy_hero'
  | 'deploy_gallery'
  | 'update_og_image'
  | 'mint_nft'
  | 'publish_track';

/** Lifecycle status of a publish pipeline job. */
export type PublishStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';

// ---------------------------------------------------------------------------
// Event Types
// ---------------------------------------------------------------------------

/** Discriminated union of events that flow through the agent event bus. */
export type AgentEventType =
  | 'asset_new'
  | 'asset_classified'
  | 'asset_processed'
  | 'asset_scored'
  | 'agent_online'
  | 'agent_offline'
  | 'pipeline_complete'
  | 'error';

// =============================================================================
// Interfaces — Mirror Supabase Tables
// =============================================================================

/**
 * A media asset tracked by the Command Center.
 *
 * Mirrors the `assets` Supabase table. Every image, video, or audio file
 * ingested by ArcaneaClaw or uploaded by a creator becomes an AssetMetadata
 * record. The asset moves through the status flow as agents classify, score,
 * and publish it.
 */
export interface AssetMetadata {
  /** Primary key (UUID). */
  id: string;
  /** Human-readable filename or title. */
  filename: string;
  /** Original file path or URL before ingestion. */
  source_path: string;
  /** MIME type (e.g. "image/webp", "audio/mp3"). */
  mime_type: string;
  /** File size in bytes. */
  file_size: number;
  /** Image/video width in pixels, null for audio. */
  width: number | null;
  /** Image/video height in pixels, null for audio. */
  height: number | null;
  /** Current lifecycle status. */
  status: AssetStatus;
  /** Quality tier derived from quality_score. */
  quality_tier: QualityTier;
  /** AI-assigned quality score (0-100), null if unscored. */
  quality_score: number | null;
  /** Intended content usage type. */
  content_type: ContentType;
  /** Storage backend where the binary resides. */
  storage_tier: StorageTier;
  /** Public URL for the stored asset (CDN or signed). */
  storage_url: string | null;
  /** SHA-256 hash for deduplication. */
  hash: string | null;
  /** Perceptual hash for near-duplicate detection (images only). */
  phash: string | null;
  /** Associated Guardian, null if unclassified. */
  guardian: Guardian | null;
  /** Associated Element, null if unclassified. */
  element: Element | null;
  /** Associated Gate, null if unclassified. */
  gate: Gate | null;
  /** Free-form tags for search and filtering. */
  tags: string[];
  /** AI-generated description of the asset. */
  ai_description: string | null;
  /** Agent that ingested or created this asset. */
  source_agent: AgentType | null;
  /** Creator user ID (Supabase auth.users FK). */
  creator_id: string | null;
  /** Whether this asset has been flagged for human review. */
  flagged: boolean;
  /** Arbitrary metadata (prompt used, model, generation params, etc.). */
  metadata: Record<string, unknown>;
  /** Row creation timestamp. */
  created_at: string;
  /** Last modification timestamp. */
  updated_at: string;
}

/**
 * An agent registered in the Command Center.
 *
 * Mirrors the `agent_registry` Supabase table. Each agent (ArcaneaClaw local
 * daemon, cloud generation service, mobile capture app, etc.) registers itself
 * and sends periodic heartbeats so the dashboard can display live status.
 */
export interface AgentRegistry {
  /** Primary key (UUID). */
  id: string;
  /** Human-readable agent name (e.g. "claw-frank-desktop"). */
  name: string;
  /** Kind of agent. */
  agent_type: AgentType;
  /** Current operational status. */
  status: AgentStatus;
  /** Capabilities this agent advertises. */
  capabilities: AgentCapability[];
  /** Semantic version of the agent software. */
  version: string;
  /** Hostname or device identifier where the agent runs. */
  hostname: string | null;
  /** Total assets this agent has processed since registration. */
  assets_processed: number;
  /** Number of errors encountered since last restart. */
  error_count: number;
  /** ISO timestamp of last successful heartbeat. */
  last_heartbeat: string | null;
  /** ISO timestamp of agent registration. */
  registered_at: string;
  /** Arbitrary agent-specific configuration. */
  config: Record<string, unknown>;
}

/**
 * A social media post queued for publishing.
 *
 * Mirrors the `social_queue` Supabase table. When an asset is approved for
 * social distribution, a SocialQueueItem is created for each target platform.
 * The item moves through draft → ready → approved → scheduled → published.
 */
export interface SocialQueueItem {
  /** Primary key (UUID). */
  id: string;
  /** FK to the asset being posted. */
  asset_id: string;
  /** Target social platform. */
  platform: SocialPlatform;
  /** Current lifecycle status. */
  status: SocialStatus;
  /** Post caption / body text. */
  caption: string;
  /** Hashtags to include. */
  hashtags: string[];
  /** Scheduled publish time (ISO), null if not yet scheduled. */
  scheduled_at: string | null;
  /** Actual publish time (ISO), null if not yet published. */
  published_at: string | null;
  /** Platform-specific post URL after publishing. */
  published_url: string | null;
  /** Platform-specific post ID after publishing. */
  platform_post_id: string | null;
  /** Agent that prepared this social post. */
  prepared_by: AgentType | null;
  /** User who approved this post (Supabase auth.users FK). */
  approved_by: string | null;
  /** Error message if status is 'failed'. */
  error_message: string | null;
  /** Row creation timestamp. */
  created_at: string;
  /** Last modification timestamp. */
  updated_at: string;
}

/**
 * A deployment job in the publish pipeline.
 *
 * Mirrors the `publish_pipeline` Supabase table. When content needs to go
 * live — deploying a hero image to the website, minting an NFT, updating
 * OG images — a PublishPipelineItem tracks the job through to completion.
 */
export interface PublishPipelineItem {
  /** Primary key (UUID). */
  id: string;
  /** FK to the asset being published. */
  asset_id: string;
  /** Where the content is being deployed. */
  target: PublishTarget;
  /** Specific deployment action. */
  action: PublishAction;
  /** Current job status. */
  status: PublishStatus;
  /** Target-specific destination path or identifier. */
  destination: string | null;
  /** URL of the deployed content after completion. */
  result_url: string | null;
  /** Agent executing this publish job. */
  executed_by: AgentType | null;
  /** Number of retry attempts so far. */
  retry_count: number;
  /** Maximum allowed retries before marking as failed. */
  max_retries: number;
  /** Error message if status is 'failed'. */
  error_message: string | null;
  /** Rollback info for reverting a failed publish. */
  rollback_info: Record<string, unknown> | null;
  /** Row creation timestamp. */
  created_at: string;
  /** Timestamp when the job completed (success or failure). */
  completed_at: string | null;
}

// =============================================================================
// Event Payloads
// =============================================================================

/**
 * Heartbeat payload sent by agents at regular intervals.
 *
 * Agents POST this to the heartbeat endpoint (or broadcast via Supabase
 * Realtime) to prove liveness and report current workload.
 */
export interface AgentHeartbeat {
  /** Agent ID (FK to agent_registry). */
  agent_id: string;
  /** Agent type for quick filtering. */
  agent_type: AgentType;
  /** Current operational status. */
  status: AgentStatus;
  /** Number of tasks currently in progress. */
  active_tasks: number;
  /** CPU usage percentage (0-100), null if unavailable. */
  cpu_percent: number | null;
  /** Memory usage in MB, null if unavailable. */
  memory_mb: number | null;
  /** Disk usage percentage (0-100), null if unavailable. */
  disk_percent: number | null;
  /** Queue depth — how many items are waiting to be processed. */
  queue_depth: number;
  /** ISO timestamp of this heartbeat. */
  timestamp: string;
}

/**
 * Generic event that flows through the agent event bus.
 *
 * All agent-to-agent and agent-to-dashboard communication uses this envelope.
 * The `payload` shape depends on `type` — consumers should narrow on `type`
 * before accessing payload fields.
 */
export interface AgentEvent {
  /** Unique event ID (UUID). */
  id: string;
  /** Discriminator for the event kind. */
  type: AgentEventType;
  /** Agent that emitted this event. */
  source_agent: string;
  /** ISO timestamp of event emission. */
  timestamp: string;
  /** Event-specific data. Shape varies by `type`. */
  payload: Record<string, unknown>;
}

// =============================================================================
// Dashboard & UI Types
// =============================================================================

/**
 * Aggregate statistics for the Command Center dashboard.
 *
 * Computed server-side (API route or Supabase RPC) and consumed by the
 * dashboard overview cards, charts, and status indicators.
 */
export interface CommandCenterStats {
  /** Total number of assets in the system. */
  total_assets: number;
  /** Assets that have been classified by an agent. */
  classified_count: number;
  /** Assets still awaiting classification. */
  unclassified_count: number;
  /** Number of assets associated with each Guardian. */
  guardian_coverage: Record<Guardian, number>;
  /** Number of assets associated with each Element. */
  element_distribution: Record<Element, number>;
  /** Number of assets in each quality tier. */
  tier_breakdown: Record<QualityTier, number>;
  /** Number of agents currently reporting 'online' or 'busy'. */
  agents_online: number;
  /** Social posts in the queue (not yet published). */
  social_queued: number;
  /** Social posts successfully published. */
  social_published: number;
}

/**
 * Filter state for the Command Center inbox UI.
 *
 * Represents the current filter selections in the inbox sidebar. All fields
 * are optional — omitted fields mean "no filter" for that dimension.
 */
export interface InboxFilter {
  /** Filter by asset lifecycle status. */
  status?: AssetStatus;
  /** Filter by associated Guardian. */
  guardian?: Guardian;
  /** Filter by associated Element. */
  element?: Element;
  /** Filter by quality tier. */
  quality_tier?: QualityTier;
  /** Filter by the agent that ingested the asset. */
  source_agent?: AgentType;
  /** Filter by date range [start, end] as ISO strings. */
  date_range?: [string, string];
  /** Free-text search across filename, tags, and AI description. */
  search?: string;
}

/**
 * Props for the visual media card component.
 *
 * Used by the inbox grid and gallery views to render a single asset card
 * with thumbnail, metadata badges, and action buttons.
 */
export interface MediaCardProps {
  /** The asset to display. */
  asset: AssetMetadata;
  /** Whether this card is currently selected in multi-select mode. */
  selected?: boolean;
  /** Callback when the card is clicked. */
  onClick?: (asset: AssetMetadata) => void;
  /** Callback when the selection checkbox is toggled. */
  onSelect?: (asset: AssetMetadata, selected: boolean) => void;
  /** Callback when a quick action is triggered (approve, reject, etc.). */
  onAction?: (asset: AssetMetadata, action: string) => void;
  /** Whether to show the full metadata panel or just the thumbnail. */
  compact?: boolean;
}
