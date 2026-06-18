# Arcanea AI App — Gemini Code Review Styleguide

This styleguide informs Gemini Code Assist how to review pull requests for the `arcanea-ai-app` repository. Follow these standards when analyzing diffs and generating review comments.

## Project Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **AI Integration**: Anthropic Claude (claude-sonnet-4-5, claude-opus-4-5)
- **Backend**: Supabase (Postgres + Auth + Realtime)
- **Deployment**: Vercel
- **Package Manager**: pnpm

## Code Style Rules

### TypeScript
- Always use explicit return types on functions and async handlers
- Prefer `interface` over `type` for object shapes; use `type` for unions/intersections
- Never use `any` — use `unknown` with type narrowing or proper generics
- All async functions must handle errors (try/catch or `.catch()`)
- Use `zod` for runtime validation of API inputs and external data

### React / Next.js
- Server Components are preferred by default; only use `'use client'` when strictly necessary (event handlers, hooks, browser APIs)
- Avoid prop drilling deeper than 2 levels — use context or Zustand store
- Keep components focused: split UI, logic, and data-fetching concerns
- Route handlers (`route.ts`) must validate request body/params before processing
- Use `next/image` for all images; never use raw `<img>` tags
- Loading and error states must be handled (`loading.tsx`, `error.tsx`, or suspense boundaries)

### API & Data
- All Supabase queries must check for errors — never ignore the `error` return value
- Use Row Level Security (RLS) — never bypass with service role key in client-facing routes
- Paginate large result sets; never fetch unbounded lists
- Sensitive env vars must use `NEXT_PUBLIC_` prefix only for truly public values

### AI / Claude Integration
- Always set a `max_tokens` limit on Claude API calls
- Use streaming responses where UX benefits from progressive display
- Wrap Claude calls in try/catch and provide graceful fallbacks
- Never log full API responses containing user data
- Prefer `claude-sonnet-4-5` for cost/quality balance; escalate to opus only for complex reasoning

## What to Flag in Reviews

### HIGH severity (always comment)
- Exposed secrets, API keys, or tokens in code
- Missing authentication checks on protected routes
- SQL injection risks or unsafe query construction
- Unhandled promise rejections in production paths
- Use of `dangerouslySetInnerHTML` without sanitization

### MEDIUM severity (comment when clearly wrong)
- Missing error handling on Supabase queries
- `useEffect` with missing or incorrect dependency arrays
- Components over 200 lines without decomposition
- Hardcoded URLs or environment-specific strings
- Missing TypeScript types (implicit `any`)

### LOW severity (suggest, don't block)
- Naming inconsistencies (camelCase vs snake_case mixing)
- Redundant state that could be derived
- Missing JSDoc on exported utility functions
- Console.log statements left in production code

## What NOT to Flag

- Stylistic preferences already handled by ESLint/Prettier config
- Minor wording in UI strings (leave to designer/PM)
- Test file structure (we are iterating on testing approach)
- `TODO` comments (tracked separately in issues)

## Review Tone

- Be concise and actionable — one clear fix per comment
- Explain *why* something is a problem, not just *what* is wrong
- For HIGH severity issues, suggest the specific fix inline
- Don't comment on every line — focus on meaningful impact
- Assume the developer is competent; skip obvious explanations
