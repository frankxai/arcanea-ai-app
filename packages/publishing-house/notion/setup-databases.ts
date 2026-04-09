/**
 * Arcanea Publishing House — Notion Database Setup
 *
 * Creates 6 linked databases under a given parent page.
 * Idempotent: checks for existing databases by title and skips them.
 *
 * Usage:
 *   npx tsx packages/publishing-house/notion/setup-databases.ts \
 *     --parent-page-id=<NOTION_PAGE_ID>
 *
 * Requires NOTION_TOKEN environment variable (integration token).
 */

import { Client } from '@notionhq/client';
import type {
  CreateDatabaseParameters,
  SearchResponse,
} from '@notionhq/client/build/src/api-endpoints.js';
import type { DatabaseIds, NotionDatabaseSchema, NotionPropertySchema } from './types.js';
import {
  EDITORIAL_BOARD_SCHEMA,
  ASSET_LIBRARY_SCHEMA,
  DISTRIBUTION_TRACKER_SCHEMA,
  TRANSLATION_QUEUE_SCHEMA,
  ANALYTICS_SCHEMA,
  CLIENT_PORTAL_SCHEMA,
} from './schemas.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Relation placeholder used in schemas before Editorial Board ID is known */
const EDITORIAL_BOARD_PLACEHOLDER = '__EDITORIAL_BOARD__';

/**
 * Convert our portable schema format into Notion API property definitions.
 */
function buildNotionProperties(
  schema: NotionDatabaseSchema,
  relationDbIds: Record<string, string>,
): CreateDatabaseParameters['properties'] {
  const properties: Record<string, Record<string, unknown>> = {};

  for (const [name, prop] of Object.entries(schema.properties)) {
    properties[name] = convertProperty(name, prop, relationDbIds);
  }

  return properties as CreateDatabaseParameters['properties'];
}

function convertProperty(
  _name: string,
  prop: NotionPropertySchema,
  relationDbIds: Record<string, string>,
): Record<string, unknown> {
  switch (prop.type) {
    case 'title':
      return { title: {} };
    case 'rich_text':
      return { rich_text: {} };
    case 'number':
      return { number: { format: 'number' } };
    case 'date':
      return { date: {} };
    case 'checkbox':
      return { checkbox: {} };
    case 'url':
      return { url: {} };
    case 'select':
      return {
        select: {
          options: (prop.options ?? []).map((o) => ({
            name: o.name,
            color: o.color ?? 'default',
          })),
        },
      };
    case 'multi_select':
      return {
        multi_select: {
          options: (prop.options ?? []).map((o) => ({
            name: o.name,
            color: o.color ?? 'default',
          })),
        },
      };
    case 'relation': {
      const resolvedId =
        prop.relation_database_id && prop.relation_database_id in relationDbIds
          ? relationDbIds[prop.relation_database_id]
          : prop.relation_database_id ?? '';
      return {
        relation: {
          database_id: resolvedId,
          single_property: {},
        },
      };
    }
    default:
      return { rich_text: {} };
  }
}

/**
 * Search the workspace for an existing database with the given title
 * that is a child of the specified parent page.
 */
async function findExistingDatabase(
  notion: Client,
  title: string,
  parentPageId: string,
): Promise<string | null> {
  const response: SearchResponse = await notion.search({
    query: title,
    filter: { property: 'object', value: 'database' },
    page_size: 50,
  });

  for (const result of response.results) {
    if (result.object !== 'database') continue;
    const db = result as Extract<SearchResponse['results'][number], { object: 'database' }>;

    // Check title match
    const dbTitle =
      'title' in db && Array.isArray(db.title)
        ? db.title.map((t: { plain_text?: string }) => t.plain_text ?? '').join('')
        : '';

    if (dbTitle !== title) continue;

    // Check parent is the expected page
    if (
      'parent' in db &&
      db.parent &&
      typeof db.parent === 'object' &&
      'page_id' in db.parent &&
      typeof db.parent.page_id === 'string' &&
      db.parent.page_id.replace(/-/g, '') === parentPageId.replace(/-/g, '')
    ) {
      return db.id;
    }
  }

  return null;
}

/**
 * Create a single Notion database under the parent page, or return the
 * existing database ID if one with the same title already exists.
 */
async function createOrFindDatabase(
  notion: Client,
  parentPageId: string,
  schema: NotionDatabaseSchema,
  relationDbIds: Record<string, string>,
): Promise<string> {
  const existingId = await findExistingDatabase(notion, schema.title, parentPageId);
  if (existingId) {
    console.log(`  ✓ "${schema.title}" already exists (${existingId}), skipping.`);
    return existingId;
  }

  const params: CreateDatabaseParameters = {
    parent: { type: 'page_id', page_id: parentPageId },
    title: [{ type: 'text', text: { content: schema.title } }],
    properties: buildNotionProperties(schema, relationDbIds),
  };

  if (schema.icon) {
    params.icon = { type: 'emoji', emoji: schema.icon as CreateDatabaseParameters['icon'] extends { emoji: infer E } ? E : never };
  }

  const db = await notion.databases.create(params);
  console.log(`  + Created "${schema.title}" (${db.id})`);
  return db.id;
}

// ---------------------------------------------------------------------------
// Main setup
// ---------------------------------------------------------------------------

/**
 * Creates all 6 Publishing House databases under the given Notion parent page.
 *
 * Order matters: Editorial Board is created first so that Asset Library
 * can reference it via relation.
 */
export async function setupPublishingDatabases(
  parentPageId: string,
  notionToken?: string,
): Promise<DatabaseIds> {
  const token = notionToken ?? process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error(
      'NOTION_TOKEN is required. Set it as an environment variable or pass it directly.',
    );
  }

  const notion = new Client({ auth: token });

  console.log('Arcanea Publishing House — Notion Database Setup');
  console.log(`Parent page: ${parentPageId}\n`);

  // Track resolved relation database IDs
  const relationDbIds: Record<string, string> = {};

  // 1. Editorial Board — created first (other DBs relate to it)
  const editorialBoardId = await createOrFindDatabase(
    notion,
    parentPageId,
    EDITORIAL_BOARD_SCHEMA,
    relationDbIds,
  );
  relationDbIds[EDITORIAL_BOARD_PLACEHOLDER] = editorialBoardId;

  // 2. Asset Library — has relation to Editorial Board
  const assetLibraryId = await createOrFindDatabase(
    notion,
    parentPageId,
    ASSET_LIBRARY_SCHEMA,
    relationDbIds,
  );

  // 3-6. Independent databases (no relations in current schema)
  const [distributionTrackerId, translationQueueId, analyticsId, clientPortalId] =
    await Promise.all([
      createOrFindDatabase(notion, parentPageId, DISTRIBUTION_TRACKER_SCHEMA, relationDbIds),
      createOrFindDatabase(notion, parentPageId, TRANSLATION_QUEUE_SCHEMA, relationDbIds),
      createOrFindDatabase(notion, parentPageId, ANALYTICS_SCHEMA, relationDbIds),
      createOrFindDatabase(notion, parentPageId, CLIENT_PORTAL_SCHEMA, relationDbIds),
    ]);

  const ids: DatabaseIds = {
    editorialBoard: editorialBoardId,
    assetLibrary: assetLibraryId,
    distributionTracker: distributionTrackerId,
    translationQueue: translationQueueId,
    analytics: analyticsId,
    clientPortal: clientPortalId,
  };

  console.log('\nSetup complete. Database IDs:');
  console.log(JSON.stringify(ids, null, 2));

  return ids;
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const parentArg = args.find((a) => a.startsWith('--parent-page-id='));

  if (!parentArg) {
    console.error('Usage: npx tsx packages/publishing-house/notion/setup-databases.ts --parent-page-id=<id>');
    process.exit(1);
  }

  const parentPageId = parentArg.split('=')[1];
  if (!parentPageId) {
    console.error('Error: --parent-page-id value is empty.');
    process.exit(1);
  }

  await setupPublishingDatabases(parentPageId);
}

// Run only when executed directly (not imported)
const isDirectExecution =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  (process.argv[1].endsWith('setup-databases.ts') ||
    process.argv[1].endsWith('setup-databases.js'));

if (isDirectExecution) {
  main().catch((err: unknown) => {
    console.error('Setup failed:', err);
    process.exit(1);
  });
}
