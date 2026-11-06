import type { WebTool } from './webmcp.mjs'
export type PublicCatalogRecord = { id: string; title: string; summary: string; url: string; [key: string]: unknown }
export function createPublicCatalogTools(prefix: string, entries: readonly PublicCatalogRecord[]): WebTool[]

