'use client';

import { useEffect } from 'react';
import type { Collection } from '@/lib/content/types';
import { createPublicCatalogTools } from '@/lib/public-catalog.mjs';
import { registerWebTools, type ModelContext } from '@/lib/webmcp.mjs';

export function LibraryWebMCP({ collections }: { collections: Collection[] }) {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    // Only the public collection fields already rendered by LibraryBrowse.
    const records = collections.map(collection => ({
      id: collection.slug,
      title: collection.name,
      summary: collection.description,
      url: '/library/' + encodeURIComponent(collection.slug),
      readWhen: collection.readWhen,
      format: collection.format,
      textCount: collection.textCount,
    }));
    const registration = registerWebTools(context, createPublicCatalogTools('arcanea_library', records),
      { onError: () => console.warn('Library browser tools are unavailable.') });
    return registration.stop;
  }, [collections]);
  return null;
}
