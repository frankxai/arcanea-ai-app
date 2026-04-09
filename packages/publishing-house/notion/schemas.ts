/**
 * Notion database schema definitions for the Arcanea Publishing House.
 *
 * Each schema is a plain TypeScript object that maps directly to the
 * Notion API `createDatabase` property format. Relations that reference
 * other Publishing House databases use a placeholder string that is
 * resolved at runtime by the setup script.
 */

import type { NotionDatabaseSchema } from './types.js';

// ---------------------------------------------------------------------------
// 1. Editorial Board — the canonical content registry
// ---------------------------------------------------------------------------

export const EDITORIAL_BOARD_SCHEMA: NotionDatabaseSchema = {
  title: 'Editorial Board',
  icon: '📝',
  properties: {
    Title: { type: 'title' },
    Status: {
      type: 'select',
      options: [
        { name: 'draft', color: 'gray' },
        { name: 'review', color: 'yellow' },
        { name: 'approved', color: 'blue' },
        { name: 'published', color: 'green' },
        { name: 'archived', color: 'default' },
      ],
    },
    Collection: { type: 'rich_text' },
    Author: { type: 'rich_text' },
    'Word Count': { type: 'number' },
    'Quality Score': { type: 'number' },
    Language: {
      type: 'select',
      options: [
        { name: 'en', color: 'blue' },
        { name: 'nl', color: 'orange' },
        { name: 'de', color: 'yellow' },
        { name: 'es', color: 'red' },
        { name: 'pt', color: 'green' },
        { name: 'ja', color: 'pink' },
        { name: 'fr', color: 'purple' },
      ],
    },
    'Source Path': { type: 'url' },
    'Last Synced': { type: 'date' },
  },
};

// ---------------------------------------------------------------------------
// 2. Asset Library — covers, illustrations, NFT art
// ---------------------------------------------------------------------------

export const ASSET_LIBRARY_SCHEMA: NotionDatabaseSchema = {
  title: 'Asset Library',
  icon: '🎨',
  properties: {
    Name: { type: 'title' },
    Type: {
      type: 'select',
      options: [
        { name: 'cover', color: 'blue' },
        { name: 'illustration', color: 'purple' },
        { name: 'banner', color: 'yellow' },
        { name: 'social', color: 'pink' },
        { name: 'nft', color: 'green' },
      ],
    },
    'TASTE Score': { type: 'number' },
    Guardian: {
      type: 'select',
      options: [
        { name: 'Aiyami', color: 'purple' },
        { name: 'Alera', color: 'blue' },
        { name: 'Draconia', color: 'red' },
        { name: 'Elara', color: 'pink' },
        { name: 'Ino', color: 'orange' },
        { name: 'Ismael', color: 'green' },
        { name: 'Leyla', color: 'yellow' },
        { name: 'Lumina', color: 'default' },
        { name: 'Lyria', color: 'gray' },
        { name: 'Lyssandria', color: 'brown' },
        { name: 'Maylinn', color: 'blue' },
        { name: 'Shinkami', color: 'purple' },
      ],
    },
    Element: {
      type: 'select',
      options: [
        { name: 'Fire', color: 'red' },
        { name: 'Water', color: 'blue' },
        { name: 'Earth', color: 'brown' },
        { name: 'Air', color: 'default' },
        { name: 'Light', color: 'yellow' },
        { name: 'Shadow', color: 'gray' },
        { name: 'Arcane', color: 'purple' },
      ],
    },
    Approved: { type: 'checkbox' },
    Content: {
      type: 'relation',
      relation_database_id: '__EDITORIAL_BOARD__',
    },
  },
};

// ---------------------------------------------------------------------------
// 3. Distribution Tracker — platform publication status
// ---------------------------------------------------------------------------

export const DISTRIBUTION_TRACKER_SCHEMA: NotionDatabaseSchema = {
  title: 'Distribution Tracker',
  icon: '🚀',
  properties: {
    Content: { type: 'title' },
    Platform: {
      type: 'multi_select',
      options: [
        { name: 'Kindle', color: 'orange' },
        { name: 'Leanpub', color: 'blue' },
        { name: 'Draft2Digital', color: 'green' },
        { name: 'NFT', color: 'purple' },
        { name: 'Web', color: 'yellow' },
        { name: 'Social', color: 'pink' },
      ],
    },
    Status: {
      type: 'select',
      options: [
        { name: 'pending', color: 'gray' },
        { name: 'submitted', color: 'yellow' },
        { name: 'live', color: 'green' },
        { name: 'failed', color: 'red' },
      ],
    },
    URL: { type: 'url' },
    Revenue: { type: 'number' },
    'Date Published': { type: 'date' },
  },
};

// ---------------------------------------------------------------------------
// 4. Translation Queue — multi-language pipeline
// ---------------------------------------------------------------------------

export const TRANSLATION_QUEUE_SCHEMA: NotionDatabaseSchema = {
  title: 'Translation Queue',
  icon: '🌐',
  properties: {
    Source: { type: 'title' },
    'Target Language': {
      type: 'select',
      options: [
        { name: 'nl', color: 'orange' },
        { name: 'de', color: 'yellow' },
        { name: 'es', color: 'red' },
        { name: 'pt', color: 'green' },
        { name: 'ja', color: 'pink' },
        { name: 'fr', color: 'purple' },
        { name: 'zh', color: 'blue' },
        { name: 'ko', color: 'default' },
      ],
    },
    Status: {
      type: 'select',
      options: [
        { name: 'pending', color: 'gray' },
        { name: 'translating', color: 'yellow' },
        { name: 'reviewing', color: 'blue' },
        { name: 'done', color: 'green' },
      ],
    },
    'Quality Score': { type: 'number' },
    'Output Path': { type: 'url' },
  },
};

// ---------------------------------------------------------------------------
// 5. Analytics — views, revenue, engagement per content + platform
// ---------------------------------------------------------------------------

export const ANALYTICS_SCHEMA: NotionDatabaseSchema = {
  title: 'Analytics',
  icon: '📊',
  properties: {
    Content: { type: 'title' },
    Platform: {
      type: 'select',
      options: [
        { name: 'Kindle', color: 'orange' },
        { name: 'Leanpub', color: 'blue' },
        { name: 'Web', color: 'yellow' },
        { name: 'Social', color: 'pink' },
        { name: 'NFT', color: 'purple' },
      ],
    },
    Views: { type: 'number' },
    Revenue: { type: 'number' },
    Engagement: { type: 'number' },
    Period: { type: 'date' },
  },
};

// ---------------------------------------------------------------------------
// 6. Client Portal — enterprise multi-tenant tracking
// ---------------------------------------------------------------------------

export const CLIENT_PORTAL_SCHEMA: NotionDatabaseSchema = {
  title: 'Client Portal',
  icon: '🏢',
  properties: {
    'Client Name': { type: 'title' },
    Vertical: {
      type: 'select',
      options: [
        { name: 'conscious-ai', color: 'purple' },
        { name: 'music', color: 'pink' },
        { name: 'fiction', color: 'blue' },
        { name: 'non-fiction', color: 'green' },
        { name: 'education', color: 'yellow' },
      ],
    },
    'Content Count': { type: 'number' },
    Status: {
      type: 'select',
      options: [
        { name: 'onboarding', color: 'yellow' },
        { name: 'active', color: 'green' },
        { name: 'churned', color: 'red' },
      ],
    },
    'Agent Fleet': { type: 'rich_text' },
  },
};

// ---------------------------------------------------------------------------
// All schemas indexed for iteration
// ---------------------------------------------------------------------------

export const ALL_SCHEMAS = {
  editorialBoard: EDITORIAL_BOARD_SCHEMA,
  assetLibrary: ASSET_LIBRARY_SCHEMA,
  distributionTracker: DISTRIBUTION_TRACKER_SCHEMA,
  translationQueue: TRANSLATION_QUEUE_SCHEMA,
  analytics: ANALYTICS_SCHEMA,
  clientPortal: CLIENT_PORTAL_SCHEMA,
} as const;
