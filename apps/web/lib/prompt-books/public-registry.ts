import registry from './public-registry.generated.json'
import type { CreateCollectionInput, CreatePromptInput } from './types'

export const PROMPT_REGISTRY_SCOPES = ['starlight', 'arcanea', 'general', 'frankx'] as const

export type PromptRegistryScope = (typeof PROMPT_REGISTRY_SCOPES)[number]

export interface PublicRegistryPrompt {
  id: string
  title: string
  description: string
  scope: PromptRegistryScope
  lane: string
  category: string
  tags: string[]
  techniques: string[]
  rankScore: number
  version: string
  path: string
  directory: string
  summary: string
  evalScore: number | null
  evalLastRun: string | null
  evalTestCount: number
  redTeamStatus: string
  redTeamAudited: string | null
  redTeamNotes: string | null
  provenanceSource: string | null
  sourceUrl: string | null
  attribution: string | null
  license: string | null
  created: string | null
  updated: string | null
}

export interface PublicRegistryBook {
  id: string
  title: string
  scope: PromptRegistryScope
  status: string
  owner: string | null
  path: string
  directory: string
  summary: string
  linkedPatterns: string[]
  created: string | null
  updated: string | null
}

export interface PublicRegistryScopeCount {
  prompts: number
  books: number
}

export type PublicRegistryScopeCounts = Record<PromptRegistryScope, PublicRegistryScopeCount>

export interface PublicPromptRegistry {
  schema: 'arcanea.publicPromptRegistry.v1'
  generatedAt: string
  source: {
    schema: string
    generatedAt: string | null
    registryPath: string
    promptCount: number
    bookCount: number
  }
  visibility: 'metadata-only'
  counts: {
    prompts: number
    books: number
    byScope: PublicRegistryScopeCounts
  }
  prompts: PublicRegistryPrompt[]
  books: PublicRegistryBook[]
}

export interface PublicRegistrySearchResults {
  prompts: PublicRegistryPrompt[]
  books: PublicRegistryBook[]
}

export const PUBLIC_PROMPT_REGISTRY = registry as unknown as PublicPromptRegistry

export function listPublicRegistryPrompts(scope?: PromptRegistryScope): PublicRegistryPrompt[] {
  if (!scope) return PUBLIC_PROMPT_REGISTRY.prompts
  return PUBLIC_PROMPT_REGISTRY.prompts.filter((prompt) => prompt.scope === scope)
}

export function listPublicRegistryBooks(scope?: PromptRegistryScope): PublicRegistryBook[] {
  if (!scope) return PUBLIC_PROMPT_REGISTRY.books
  return PUBLIC_PROMPT_REGISTRY.books.filter((book) => book.scope === scope)
}

export function getPublicRegistryPrompt(id: string): PublicRegistryPrompt | undefined {
  return PUBLIC_PROMPT_REGISTRY.prompts.find((prompt) => prompt.id === id)
}

export function getPublicRegistryBook(id: string): PublicRegistryBook | undefined {
  return PUBLIC_PROMPT_REGISTRY.books.find((book) => book.id === id)
}

export function getPublicRegistryScopeCounts(): PublicRegistryScopeCounts {
  return PUBLIC_PROMPT_REGISTRY.counts.byScope
}

export function searchPublicRegistry(
  query: string,
  scope?: PromptRegistryScope,
): PublicRegistrySearchResults {
  const terms = normalizeTerms(query)

  if (terms.length === 0) {
    return {
      prompts: listPublicRegistryPrompts(scope),
      books: listPublicRegistryBooks(scope),
    }
  }

  return {
    prompts: listPublicRegistryPrompts(scope).filter((prompt) =>
      terms.every((term) => searchablePromptText(prompt).includes(term)),
    ),
    books: listPublicRegistryBooks(scope).filter((book) =>
      terms.every((term) => searchableBookText(book).includes(term)),
    ),
  }
}

export function publicRegistryPromptToCreatePromptInput(
  prompt: PublicRegistryPrompt,
  collectionId?: string,
): CreatePromptInput {
  return {
    title: prompt.title,
    content: formatPublicRegistryPromptMarkdown(prompt),
    promptType: 'general',
    collectionId,
    metadata: {
      source: 'public-prompt-registry',
      registryId: prompt.id,
      scope: prompt.scope,
      lane: prompt.lane,
      category: prompt.category,
      rankScore: prompt.rankScore,
      canonicalPath: prompt.path,
      canonicalDirectory: prompt.directory,
      attribution: prompt.attribution,
      license: prompt.license,
      sourceUrl: prompt.sourceUrl,
      evalScore: prompt.evalScore,
      redTeamStatus: prompt.redTeamStatus,
    },
  }
}

export function publicRegistryBookToCreateCollectionInput(
  book: PublicRegistryBook,
): CreateCollectionInput {
  return {
    name: book.title,
    description: [
      book.summary || null,
      `Scope: ${book.scope}`,
      `Canonical path: ${book.path}`,
    ]
      .filter(Boolean)
      .join('\n'),
    icon: 'books',
    visibility: 'private',
    metadata: {
      source: 'public-prompt-registry',
      registryId: book.id,
      scope: book.scope,
      status: book.status,
      owner: book.owner,
      canonicalPath: book.path,
      canonicalDirectory: book.directory,
      linkedPatterns: book.linkedPatterns,
    },
  }
}

export function formatPublicRegistryPromptMarkdown(prompt: PublicRegistryPrompt): string {
  const lines = [
    `# ${prompt.title}`,
    '',
    prompt.description,
    '',
    '## Registry Metadata',
    '',
    `- Registry ID: ${prompt.id}`,
    `- Scope: ${prompt.scope}`,
    `- Lane: ${prompt.lane}`,
    `- Category: ${prompt.category}`,
    `- Rank score: ${prompt.rankScore}`,
    `- Version: ${prompt.version}`,
    `- Eval score: ${prompt.evalScore ?? 'not run'}`,
    `- Eval tests: ${prompt.evalTestCount}`,
    `- Red-team status: ${prompt.redTeamStatus}`,
    prompt.redTeamNotes ? `- Red-team notes: ${prompt.redTeamNotes}` : null,
    prompt.provenanceSource ? `- Source: ${prompt.provenanceSource}` : null,
    prompt.attribution ? `- Attribution: ${prompt.attribution}` : null,
    prompt.license ? `- License: ${prompt.license}` : null,
    prompt.sourceUrl ? `- Source URL: ${prompt.sourceUrl}` : null,
    '',
    '## Tags',
    '',
    prompt.tags.length > 0 ? prompt.tags.map((tag) => `- ${tag}`).join('\n') : '- none',
    '',
    '## Summary',
    '',
    prompt.summary || 'No summary available.',
    '',
    '## Retrieval',
    '',
    `Canonical file: \`${prompt.path}\``,
    `Canonical directory: \`${prompt.directory}\``,
    '',
    'The full prompt body is managed in the canonical Git prompt library. Use this saved card as the retrieval and provenance record.',
  ].filter((line): line is string => line !== null)

  return lines.join('\n')
}

export function formatPublicRegistryBookMarkdown(book: PublicRegistryBook): string {
  const lines = [
    `# ${book.title}`,
    '',
    book.summary || 'No summary available.',
    '',
    '## Registry Metadata',
    '',
    `- Registry ID: ${book.id}`,
    `- Scope: ${book.scope}`,
    `- Status: ${book.status}`,
    book.owner ? `- Owner: ${book.owner}` : null,
    `- Canonical path: ${book.path}`,
    `- Canonical directory: ${book.directory}`,
    '',
    '## Linked Patterns',
    '',
    book.linkedPatterns.length > 0
      ? book.linkedPatterns.map((pattern) => `- ${pattern}`).join('\n')
      : '- none',
  ].filter((line): line is string => line !== null)

  return lines.join('\n')
}

function normalizeTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)
}

function searchablePromptText(prompt: PublicRegistryPrompt): string {
  return [
    prompt.id,
    prompt.title,
    prompt.description,
    prompt.scope,
    prompt.lane,
    prompt.category,
    prompt.summary,
    prompt.provenanceSource,
    prompt.attribution,
    prompt.license,
    ...prompt.tags,
    ...prompt.techniques,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function searchableBookText(book: PublicRegistryBook): string {
  return [
    book.id,
    book.title,
    book.scope,
    book.status,
    book.owner,
    book.summary,
    ...book.linkedPatterns,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}
