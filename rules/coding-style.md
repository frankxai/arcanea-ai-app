---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# Arcanea Coding Style

## TypeScript Standards

- **Strict mode always** — no `any` unless absolutely necessary, document why
- **Server Components by default** — only `'use client'` when state/effects/browser APIs needed
- **Explicit return types** on exported functions
- **Interface over type** for object shapes (types for unions/intersections)
- **Const assertions** for literal objects that won't change

## File Organization

- Keep files under 500 lines — split at natural boundaries
- One component per file for React components
- Co-locate types with their consumers (not in a global types/ dump)
- Barrel exports (`index.ts`) only at package boundaries, not within features

## Naming

- **Components**: PascalCase (`GuardianCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useGateProgress.ts`)
- **Utils/helpers**: camelCase (`formatFrequency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`GUARDIAN_CONFIG`)
- **API routes**: kebab-case directories (`/api/chat/sessions`)

## React Patterns

- Prefer composition over inheritance
- Extract custom hooks for reusable logic
- Use `Suspense` boundaries for async data
- Memoize expensive computations, not everything
- Event handlers: `handleX` naming (`handleSubmit`, `handleGateSelect`)

## Imports

- Group: React/Next > third-party > internal (`@/lib`, `@/components`) > relative
- No circular imports
- Prefer named exports over default exports

## Error Handling

- Use error boundaries at route level (18 routes covered)
- API routes: return typed error responses with status codes
- Client: optimistic updates with rollback on failure
- Never swallow errors silently — log or surface them

## Performance

- Dynamic imports for heavy components (`next/dynamic`)
- Image optimization via `next/image`
- Avoid layout shifts — set explicit dimensions
- Debounce user input (search, chat)
