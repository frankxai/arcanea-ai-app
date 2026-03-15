// Arcanea API Response Types — matches actual Supabase schema

export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_SERVICE_ERROR'
  | 'ALREADY_EXISTS'
  | 'INVALID_INPUT'
  | 'METHOD_NOT_ALLOWED'
  | 'CONFLICT'

export interface ApiError {
  code: ErrorCode
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
    timestamp?: string
  }
}

// Arcanea domain enums
export type MagicRank = 'Apprentice' | 'Mage' | 'Master' | 'Archmage' | 'Luminor'
export type GateName = 'Foundation' | 'Flow' | 'Fire' | 'Heart' | 'Voice' | 'Sight' | 'Crown' | 'Starweave' | 'Unity' | 'Source'
export type GuardianName = 'Lyssandria' | 'Leyla' | 'Draconia' | 'Maylinn' | 'Alera' | 'Lyria' | 'Aiyami' | 'Elara' | 'Ino' | 'Shinkami'
export type ElementName = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit'
export type AcademyHouse = 'Lumina' | 'Nero' | 'Pyros' | 'Aqualis' | 'Terra' | 'Ventus' | 'Synthesis'
export type CreationType = 'text' | 'image' | 'video' | 'audio' | 'code' | 'mixed'
export type CreationStatus = 'draft' | 'published' | 'archived'
export type Visibility = 'private' | 'unlisted' | 'public'

export interface CreationFilters {
  type?: CreationType
  element?: ElementName
  gate?: GateName
  guardian?: GuardianName
  status?: CreationStatus
  visibility?: Visibility
  tags?: string[]
  sortBy?: 'recent' | 'popular' | 'trending' | 'created_at' | 'updated_at' | 'like_count' | 'view_count'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
  page?: number
  pageSize?: number
}

export const VALIDATION_RULES = {
  displayName: {
    minLength: 1,
    maxLength: 100
  },
  bio: {
    maxLength: 500
  },
  title: {
    minLength: 1,
    maxLength: 200
  },
  description: {
    maxLength: 2000
  },
  tags: {
    maxCount: 10,
    maxLength: 50
  }
}

// Profile types — matches profiles table
export interface Profile {
  id: string
  displayName: string
  avatarUrl?: string | null
  bio?: string | null
  magicRank: MagicRank
  gatesOpen: number
  activeGate?: GateName | null
  guardian?: GuardianName | null
  academyHouse?: AcademyHouse | null
  xp: number
  level: number
  streakDays: number
  lastActiveAt?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface ProfileStats {
  creationsCount: number
  followersCount: number
  followingCount: number
  likesReceived: number
  totalViews: number
}

// Creation types — matches creations table
export interface Creation {
  id: string
  title: string
  description?: string | null
  content?: Record<string, unknown> | null
  type: CreationType
  status: CreationStatus
  visibility: Visibility
  element?: ElementName | null
  gate?: GateName | null
  guardian?: GuardianName | null
  tags: string[]
  thumbnailUrl?: string | null
  viewCount: number
  likeCount: number
  aiModel?: string | null
  aiPrompt?: string | null
  userId: string
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

// Collection types — matches collections table
export interface Collection {
  id: string
  userId: string
  title: string
  description?: string | null
  coverUrl?: string | null
  visibility: Visibility
  sortOrder: number
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

// Activity types — matches activity_log table
export interface Activity {
  id: string
  userId: string
  action: string
  entityType: string
  entityId?: string | null
  metadata?: Record<string, unknown> | null
  createdAt: string
}

// Luminor Bond types — used by bond-service
export interface LuminorBond {
  id: string
  userId: string
  luminorId: string
  level: number
  bondLevel: number
  xp: number
  relationshipType: string
  memories: Memory[]
  createdAt: string
  updatedAt: string
}

export interface Memory {
  id: string
  content: string
  emotionalTone?: string
  createdAt: string
}

// Notification types — used by notification-service
export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  metadata?: Record<string, unknown> | null
  createdAt: string
}
