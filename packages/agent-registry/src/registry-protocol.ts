// Arcanea Agent Registry Protocol
// Shared types for multi-tenant agent discovery, deployment,
// and revenue attribution across platforms.

import type { AgentDefinition } from './index.js';

// ─── Platforms ──────────────────────────────────────────────

export interface Platform {
  id: string;
  name: string;
  ownerId: string;
  description?: string;
  apiKeyHash: string;
  allowedOrigins: string[];
  feeOverride?: number;
  agentCount: number;
  deploymentCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Creators ───────────────────────────────────────────────

export interface CreatorProfile {
  userId: string;
  displayName: string;
  walletAddress?: string;
  attributionScore: number;
  totalEarned: number;
  agentCount: number;
  skillCount: number;
  bio?: string;
  avatarUrl?: string;
  links?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// ─── Deployments ────────────────────────────────────────────

export type DeploymentStatus = 'active' | 'paused' | 'revoked';

export interface Deployment {
  id: string;
  agentId: string;
  platformId: string | null;
  deployerId: string;
  config: Record<string, unknown>;
  status: DeploymentStatus;
  apiKeysRef: Record<string, string>;
  lastActiveAt?: string;
  deployedAt: string;
  updatedAt: string;
}

// ─── Usage Events ───────────────────────────────────────────

export interface UsageEvent {
  id: string;
  deploymentId: string | null;
  agentId: string;
  platformId: string | null;
  userId: string | null;
  tokensUsed: number;
  durationMs: number;
  creditsConsumed: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── Revenue Events ─────────────────────────────────────────

export type RevenueEventType = 'deploy' | 'usage' | 'affiliate' | 'tip';

export interface RevenueEvent {
  id: string;
  agentId: string;
  creatorId: string;
  platformId: string | null;
  deploymentId: string | null;
  grossAmount: number;
  platformFee: number;
  creatorPayout: number;
  affiliateId?: string;
  affiliatePayout: number;
  eventType: RevenueEventType;
  createdAt: string;
}

// ─── Registry Skills ────────────────────────────────────────

export interface RegistrySkill {
  id: string;
  agentId?: string;
  creatorId: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  guardianAffinity: string[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  isPublished: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Search ─────────────────────────────────────────────────

export interface RegistrySearchParams {
  query?: string;
  capabilities?: string[];
  category?: string;
  platformId?: string;
  tags?: string[];
  isOpen?: boolean;
  limit?: number;
  offset?: number;
}

export interface RegistryAgentResult {
  agent: AgentDefinition & {
    platformId?: string;
    version?: string;
    tags?: string[];
    isOpen?: boolean;
    sourceUrl?: string;
    license?: string;
    priceCredits?: number;
    rating?: number;
    usageCount?: number;
    mcpEndpoint?: string;
  };
  similarity?: number;
}

export interface RegistrySearchResult {
  agents: RegistryAgentResult[];
  total: number;
}

// ─── Publish ────────────────────────────────────────────────

export interface PublishAgentInput {
  name: string;
  title: string;
  category: string;
  description: string;
  longDescription?: string;
  capabilities: string[];
  tags?: string[];
  spec: Record<string, unknown>;
  priceCredits?: number;
  isOpen?: boolean;
  license?: string;
  sourceUrl?: string;
  mcpEndpoint?: string;
  skills?: PublishSkillInput[];
}

export interface PublishSkillInput {
  name: string;
  version?: string;
  description: string;
  capabilities: string[];
  guardianAffinity?: string[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

// ─── Deploy ─────────────────────────────────────────────────

export interface DeployAgentInput {
  agentId: string;
  platformId?: string;
  config?: Record<string, unknown>;
  apiKeysRef?: Record<string, string>;
}

// ─── Revenue Split ──────────────────────────────────────────

export interface RevenueSplit {
  platformFee: number;
  creatorPayout: number;
}

export const DEFAULT_PLATFORM_FEE_RATE = 0.15;

// ─── Platform API Keys ──────────────────────────────────────

export type ApiKeyScope = 'read' | 'write' | 'deploy' | 'admin';

export interface PlatformApiKey {
  id: string;
  platformId: string;
  label: string;
  scopes: ApiKeyScope[];
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}
