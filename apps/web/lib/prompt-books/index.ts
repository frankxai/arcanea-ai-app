/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// Arcanea Prompt Books — Public API

// Types
export type {
  Collection, Prompt, Tag, PromptVersion, Template,
  TemplateVariable, ContextConfig, FewShotExample, ChainStep,
  ContextPackage,
  GuardianId, ElementType, Visibility, PromptType,
  InjectPosition, TagCategory,
  CreateCollectionInput, UpdateCollectionInput,
  CreatePromptInput, UpdatePromptInput,
  CreateTagInput, UpdateTagInput,
  PromptFilters, TemplateFilters,
  DiffLine, SyncStatus, SyncEvent,
} from './types'

// Constants
export {
  GUARDIAN_THEMES,
  PROMPT_TYPES,
  DEFAULT_TAGS,
  TAG_CATEGORIES,
  WEIGHT_SYNTAX,
} from './constants'
export type { GuardianTheme, PromptTypeConfig, DefaultTag } from './constants'

// Service
export * as promptService from './service'

// Store
export { usePromptBooksStore } from './store'

// Context Engine
export { compilePrompt, compileChain, resolveVariables, extractVariables } from './context-engine'

// Markdown
export { parseMd, serializeMd, promptToMd, mdToPromptData, isPromptMarkdown } from './markdown'

// Weight Syntax
export { parseWeight, formatWeight, extractWeights, applyWeight, stripWeights } from './weight-syntax'

// Sync
export { PromptBooksSync } from './sync'
