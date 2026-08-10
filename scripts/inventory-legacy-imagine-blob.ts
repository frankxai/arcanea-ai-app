/**
 * Produces a non-destructive manifest for the legacy Arcanea `imagine/` Blob
 * namespace. It does not copy, delete, or mutate a single object.
 *
 * Run from the repository root:
 *   BLOB_READ_WRITE_TOKEN=... pnpm exec tsx scripts/inventory-legacy-imagine-blob.ts
 *
 * Optional output path:
 *   BLOB_READ_WRITE_TOKEN=... pnpm exec tsx scripts/inventory-legacy-imagine-blob.ts reports/media/imagine-blob.json
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { list } from '@vercel/blob';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const outputPath = resolve(
  process.cwd(),
  process.argv[2] ?? 'reports/media/legacy-imagine-blob-inventory.json',
);

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('BLOB_READ_WRITE_TOKEN is required');
}

type InventoryRow = {
  source: {
    provider: 'vercel-blob';
    pathname: string;
    url: string;
    bytes: number;
    uploadedAt: string;
    contentType: string;
  };
  ownership: 'owner-scoped' | 'unresolved-legacy';
  ownerId: string | null;
  migration: {
    status: 'ready-for-owner-mapping' | 'requires-owner-resolution';
    targetAssetId: null;
  };
};

async function main(): Promise<void> {
  const rows: InventoryRow[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({
      prefix: 'imagine/',
      cursor,
      limit: 1_000,
    });

    for (const blob of page.blobs) {
      const [, possibleOwnerId] = blob.pathname.split('/');
      const ownerId = possibleOwnerId && UUID_PATTERN.test(possibleOwnerId)
        ? possibleOwnerId
        : null;
      rows.push({
        source: {
          provider: 'vercel-blob',
          pathname: blob.pathname,
          url: blob.url,
          bytes: blob.size,
          uploadedAt: blob.uploadedAt.toISOString(),
          contentType: blob.contentType,
        },
        ownership: ownerId ? 'owner-scoped' : 'unresolved-legacy',
        ownerId,
        migration: {
          status: ownerId ? 'ready-for-owner-mapping' : 'requires-owner-resolution',
          targetAssetId: null,
        },
      });
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const summary = rows.reduce(
    (value, row) => {
      value.totalBytes += row.source.bytes;
      if (row.ownership === 'owner-scoped') value.ownerScoped += 1;
      else value.unresolvedLegacy += 1;
      return value;
    },
    { total: rows.length, ownerScoped: 0, unresolvedLegacy: 0, totalBytes: 0 },
  );

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), summary, assets: rows }, null, 2)}\n`,
    'utf8',
  );

  console.log(JSON.stringify({ outputPath, summary }));
}

await main();
