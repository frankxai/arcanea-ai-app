import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const estateRoot = path.resolve(repoRoot, '..')
const promptLibraryRoot = path.join(estateRoot, 'prompt-library')

const sourceRegistryPath = process.env.PROMPT_LIBRARY_REGISTRY
  ? path.resolve(process.env.PROMPT_LIBRARY_REGISTRY)
  : path.join(promptLibraryRoot, 'registry', 'index.json')

const targetRegistryPath = path.join(
  repoRoot,
  'apps',
  'web',
  'lib',
  'prompt-books',
  'public-registry.generated.json',
)

const SCOPES = ['starlight', 'arcanea', 'general', 'frankx']
const SCOPE_SET = new Set(SCOPES)

function relativeToRepo(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/')
}

function asString(value, fallback = '') {
  if (typeof value === 'string') return value
  if (value === null || value === undefined) return fallback
  return String(value)
}

function asNullableString(value) {
  const normalized = asString(value).trim()
  return normalized ? normalized : null
}

function asArray(value) {
  if (!Array.isArray(value)) return []
  return value.map((item) => asString(item).trim()).filter(Boolean)
}

function asNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function normalizeScope(scope) {
  const normalized = asString(scope, 'general').toLowerCase()
  return SCOPE_SET.has(normalized) ? normalized : 'general'
}

function compareScopedRank(a, b) {
  const scopeDelta = SCOPES.indexOf(a.scope) - SCOPES.indexOf(b.scope)
  if (scopeDelta !== 0) return scopeDelta
  return b.rankScore - a.rankScore || a.title.localeCompare(b.title)
}

function emptyScopeCounts() {
  return Object.fromEntries(SCOPES.map((scope) => [scope, { prompts: 0, books: 0 }]))
}

function buildCounts(prompts, books) {
  const byScope = emptyScopeCounts()

  for (const prompt of prompts) {
    byScope[prompt.scope].prompts += 1
  }

  for (const book of books) {
    byScope[book.scope].books += 1
  }

  return {
    prompts: prompts.length,
    books: books.length,
    byScope,
  }
}

function mapPrompt(prompt) {
  const provenance = prompt.provenance && typeof prompt.provenance === 'object'
    ? prompt.provenance
    : {}
  const evaluation = prompt.eval && typeof prompt.eval === 'object' ? prompt.eval : {}
  const redTeam = prompt.red_team && typeof prompt.red_team === 'object' ? prompt.red_team : {}

  return {
    id: asString(prompt.id),
    title: asString(prompt.title, asString(prompt.id)),
    description: asString(prompt.description),
    scope: normalizeScope(prompt.scope),
    lane: asString(prompt.lane, 'cross-lab'),
    category: asString(prompt.category, 'create'),
    tags: asArray(prompt.tags),
    techniques: asArray(prompt.techniques),
    rankScore: asNumber(prompt.rank_score ?? prompt.rankScore),
    version: asString(prompt.version, '0.0.0'),
    path: asString(prompt.path),
    directory: asString(prompt.directory),
    summary: asString(prompt.summary),
    evalScore: evaluation.score === null || evaluation.score === undefined
      ? null
      : asNumber(evaluation.score),
    evalLastRun: asNullableString(evaluation.last_run),
    evalTestCount: asNumber(evaluation.test_count),
    redTeamStatus: asString(redTeam.status, 'unknown'),
    redTeamAudited: asNullableString(redTeam.audited),
    redTeamNotes: asNullableString(redTeam.notes),
    provenanceSource: asNullableString(provenance.source),
    sourceUrl: asNullableString(provenance.source_url),
    attribution: asNullableString(provenance.attribution),
    license: asNullableString(provenance.license),
    created: asNullableString(prompt.created),
    updated: asNullableString(prompt.updated),
  }
}

function mapBook(book) {
  return {
    id: asString(book.id),
    title: asString(book.title, asString(book.id)),
    scope: normalizeScope(book.scope),
    status: asString(book.status, 'draft'),
    owner: asNullableString(book.owner),
    path: asString(book.path),
    directory: asString(book.directory),
    summary: asString(book.summary),
    linkedPatterns: asArray(book.linked_patterns ?? book.linkedPatterns),
    created: asNullableString(book.created),
    updated: asNullableString(book.updated),
  }
}

async function main() {
  const sourceText = await readFile(sourceRegistryPath, 'utf8')
  const source = JSON.parse(sourceText)

  const prompts = (Array.isArray(source.prompts) ? source.prompts : [])
    .map(mapPrompt)
    .filter((prompt) => prompt.id && prompt.title)
    .sort(compareScopedRank)

  const books = (Array.isArray(source.books) ? source.books : [])
    .map(mapBook)
    .filter((book) => book.id && book.title)
    .sort((a, b) => {
      const scopeDelta = SCOPES.indexOf(a.scope) - SCOPES.indexOf(b.scope)
      if (scopeDelta !== 0) return scopeDelta
      return a.title.localeCompare(b.title)
    })

  const registry = {
    schema: 'arcanea.publicPromptRegistry.v1',
    generatedAt: new Date().toISOString(),
    source: {
      schema: asString(source.schema),
      generatedAt: asNullableString(source.generatedAt),
      registryPath: relativeToRepo(sourceRegistryPath),
      promptCount: asNumber(source.promptCount, prompts.length),
      bookCount: asNumber(source.bookCount, books.length),
    },
    visibility: 'metadata-only',
    counts: buildCounts(prompts, books),
    prompts,
    books,
  }

  await mkdir(path.dirname(targetRegistryPath), { recursive: true })
  await writeFile(targetRegistryPath, `${JSON.stringify(registry, null, 2)}\n`)

  console.log(
    `Synced ${prompts.length} prompts and ${books.length} books to ${relativeToRepo(targetRegistryPath)}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
