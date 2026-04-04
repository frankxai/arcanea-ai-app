# Agent Playbook

> Recurring prompts for A1-A10 Claude Code instances. Each prompt is self-contained, idempotent, and progress-making. Copy-paste any prompt to an agent and it will execute without asking questions.

---

## 1. Daily Excellence Prompts

Run any of these at any time. They always leave the project better than they found it.

---

### 1.1 E2E Quality Sweep

```
Read .arcanea/MASTER_PLAN.md and pick a random LIVE page that hasn't been audited recently.
Run /quality-standard on that page. For every issue found:
1. Fix it immediately if under 20 lines changed
2. Log it to .arcanea/projects/log/ if it needs a larger refactor
Apply the 7-gate filter: First Principles, Voice, Design, Perf, Journey, Engineering, Strategy.
Commit fixes with conventional commit: "fix(quality): [page-name] — [what was fixed]"
```

### 1.2 Performance Audit

```
Read .arcanea/MASTER_PLAN.md. Pick a LIVE page.
Open it with Playwright at https://arcanea.ai/[route].
Take a screenshot. Measure: LCP, CLS, INP targets (LCP < 2.5s, CLS < 0.1, INP < 200ms).
For each violation:
- Images missing next/image or priority hints → fix
- Missing Suspense/loading.tsx → add
- Large client bundles → convert to server components or lazy load
- Font flash → check font preloading
Commit: "perf([page]): [specific improvement]"
```

### 1.3 Design Consistency Check

```
Read .arcanea/config/design-tokens.yaml and the design system:
- Primary: #7fffd4 (Atlantean Teal), Secondary: #78a6ff (Cosmic Blue), Accent: #ffd700 (Gold)
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code) — NEVER Cinzel
- Glass morphism, aurora gradients, dark-first

Scan 5 random pages in apps/web/app/. For each page check:
1. No arbitrary color values (must use design tokens or Tailwind config)
2. No inline styles that should be Tailwind classes
3. Consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
4. Glass card treatment matches other pages
5. No Cinzel font anywhere
Fix drift. Commit: "style: design consistency — [what was fixed]"
```

### 1.4 Copy Polish (Anti-Slop)

```
Read .arcanea/config/voice.yaml and .arcanea/lore/CANON_LOCKED.md.
Search apps/web/ for these slop patterns:
- "Unleash", "Unlock your potential", "Dive into", "Embark on a journey"
- "Cutting-edge", "Revolutionary", "Game-changing", "Next-level"
- "Seamlessly", "Effortlessly", "Supercharge"
- Generic "Welcome to [X]" headers
- Any text that sounds like a LinkedIn post

Replace with Arcanea voice: elevated but direct, mythic but practical, show-don't-tell.
Use canon terminology: Gates, Elements, Luminors, Guardians, the Arc, Arcane/Song/Mana/Anima.
Never use Hz frequencies in user-facing copy — use poetic taglines instead.
Commit: "copy: replace AI slop with Arcanea voice — [pages touched]"
```

### 1.5 Journey Optimization

```
Pick one of these creator journeys and trace it end-to-end:
A) New visitor: / → /worlds → /academy → signup
B) Creator: /chat → create something → /gallery → share
C) Builder: /showcase → /models → try a model → /chat
D) Learner: /academy → pick a course → complete a lesson → earn progress
E) Explorer: /worlds → pick a world → explore gates → meet a guardian

For each step:
1. Does the next action have a clear, visible CTA?
2. Is loading fast (< 2s) with proper loading states?
3. Does the page explain what to do without reading docs?
4. Is mobile usable at 375px width?
5. Is there a dead end where the user gets stuck?

Fix friction points. Add missing CTAs, loading states, or navigation hints.
Commit: "ux: smooth [journey-name] creator path"
```

### 1.6 Dead Code Removal

```
Run these checks across apps/web/:
1. Search for files not imported anywhere: components, utils, hooks, lib files
2. Search for exported functions/constants not imported by any other file
3. Check package.json for dependencies not imported in any source file
4. Look for commented-out code blocks (> 5 lines)
5. Find empty or near-empty files (< 5 lines of real code)

For each finding:
- If clearly dead → delete it
- If uncertain → add a TODO comment with date
- If it's a dependency → remove from package.json and run npm install

Never delete: canonical lore files, config files, test fixtures, type definitions.
Commit: "chore: remove dead code — [count] files/exports cleaned"
```

### 1.7 SEO Enhancement

```
Read apps/web/app/sitemap.ts (or sitemap.xml generation).
Check every LIVE page in .arcanea/MASTER_PLAN.md for:
1. Missing or generic <title> (should be unique, < 60 chars, include "Arcanea")
2. Missing or generic <meta description> (unique, 120-160 chars, include a CTA)
3. Missing JSON-LD structured data (WebSite, WebPage, FAQPage, Course, Article)
4. Missing Open Graph tags (og:title, og:description, og:image)
5. Missing from sitemap.ts
6. Broken internal links (href to routes that don't exist)
7. Images without alt text

Fix what you find. Prioritize pages with the most traffic potential.
Commit: "seo: enhance metadata for [pages] — [specific improvements]"
```

### 1.8 Accessibility Pass

```
Pick 3 LIVE pages. For each page:
1. Tab through every interactive element — is focus order logical?
2. Check every button/link has accessible text (not just an icon)
3. Check color contrast ratios (4.5:1 for normal text, 3:1 for large)
4. Check all images have meaningful alt text (not "image" or "icon")
5. Check form inputs have associated labels
6. Check ARIA roles on custom widgets (modals, dropdowns, tabs)
7. Check skip-to-content link exists on pages with navigation
8. Check page has exactly one <h1> and headings don't skip levels

Fix violations. Use semantic HTML over ARIA where possible.
Commit: "a11y: fix accessibility issues on [pages]"
```

### 1.9 Mobile Polish

```
Open Playwright at viewport 375x812 (iPhone SE).
Test 5 LIVE pages. For each check:
1. No horizontal scroll — nothing overflows the viewport
2. Touch targets are at least 44x44px
3. Text is readable without zooming (min 16px body, 14px captions)
4. Navigation is usable — hamburger menu works, no hidden elements
5. Cards and grids restack properly (no overlapping content)
6. Modals/drawers are full-screen on mobile, not floating
7. Fixed/sticky elements don't cover content
8. Images are responsive (not fixed-width desktop sizes)

Fix every breakage found. Test fixes at 375px before committing.
Commit: "mobile: fix responsive issues on [pages]"
```

### 1.10 Security Scan

```
Search the entire codebase for:
1. Hardcoded API keys, tokens, or secrets (any string starting with sk-, pk_, key_, SUPABASE_, etc.)
2. .env files accidentally tracked in git
3. dangerouslySetInnerHTML without sanitization
4. User input rendered without escaping
5. SQL strings built by concatenation (instead of parameterized queries)
6. Exposed server-only secrets in client components (check 'use client' files importing from env)
7. Missing rate limiting on API routes
8. CORS headers that are too permissive (Access-Control-Allow-Origin: *)
9. Cookies without httpOnly/secure/sameSite flags
10. Dependencies with known vulnerabilities (npm audit)

For each finding: fix immediately if possible, or create a doc at docs/security/ with severity and remediation plan.
Commit: "security: fix [specific issue]" — never include the secret in the commit message.
```

---

## 2. Strategic Deep Dives

For 2-4 hour focused sessions that create substantial progress.

---

### 2.1 Homepage Revolution

```
Read .arcanea/MASTER_PLAN.md and apps/web/app/v3/.
The homepage is the most important page. Audit it against the best SaaS homepages (Linear, Vercel, Stripe).

Evaluate and improve:
1. Hero: Does it answer "What is Arcanea?" in 5 seconds? Is the CTA unmissable?
2. Social proof: Are there real numbers, testimonials, or usage stats?
3. Feature showcase: Do the 6 layers (Chat, Worlds, Feed, OSS, Community, Academy) each get a compelling section?
4. Visual hierarchy: Does the eye flow naturally from hero → features → CTA?
5. Performance: Is above-the-fold content server-rendered and fast?
6. Mobile: Does it work beautifully at 375px?
7. Below fold: Does v3-below-fold.tsx tell a compelling story as you scroll?

Apply the Arcanea positioning: "Not a chatbot — a creative multiverse. Not a course — an operating system you fork."
Make it feel like entering a world, not reading a landing page.
Commit changes in logical chunks. Final commit: "feat(homepage): [summary of transformation]"
```

### 2.2 Creator Journey E2E

```
Read .arcanea/MASTER_PLAN.md and trace the FULL creator journey:

Phase 1 — Discovery: Google/social → landing → "I get what this is"
Phase 2 — First Value: Sign up → Chat or Imagine → create something in < 2 minutes
Phase 3 — Depth: Explore Worlds → understand the framework → "I could build my own"
Phase 4 — Investment: Academy → learn world-building → create a character/world
Phase 5 — Social: Gallery/Showcase → share creation → get feedback
Phase 6 — Return: Notification/email → come back → create more

For each phase:
1. Does the transition feel natural? Is there a clear next step?
2. What's the time-to-value? Can it be shortened?
3. Where do users drop off? (missing pages, broken links, confusion)
4. Is the value proposition clear at every stage?

Build or fix whatever is missing. Focus on Phase 2 (first value) above all else.
Commit: "feat(journey): [phase] — [what was built/fixed]"
```

### 2.3 OSS Package Polish

```
Read .arcanea/config.json for the package registry.
Pick ONE npm package from packages/ that needs the most love.

Make it world-class:
1. README: Clear description, install command, quick example, API reference, badge row
2. package.json: Correct metadata (description, keywords, repository, license, exports)
3. TypeScript: Strict mode, no any, exported types for public API
4. Tests: At least 80% coverage on public API functions
5. Build: Runs clean with no warnings
6. Changelog: CHANGELOG.md with recent changes
7. Examples: At least one working example in examples/ or README
8. CI: Builds and tests pass in GitHub Actions

Run: npm run build && npm test in the package directory.
Fix everything that fails. Make it something you'd be proud to find on npm.
Commit: "feat([package-name]): polish to production quality"
```

### 2.4 Content Engine

```
Read apps/web/lib/blog-data.ts and apps/web/app/blog/.
Read apps/web/app/showcase/ and apps/web/app/academy/.

Build or enhance content:
1. Blog: Write 1-2 high-quality articles about Arcanea's unique angles:
   - "Why AI Needs Fantasy Frameworks" (worlds system)
   - "From Tool User to System Architect" (the creator journey)
   - "The Open Source Creative Multiverse" (OSS layer)
   - "How We Built [specific feature]" (engineering story)
   Add to blog-data.ts with proper metadata, OG images, structured data.

2. Showcase: Add 3-5 showcase entries demonstrating what Arcanea can create.
   Real outputs from Chat, Imagine, Worlds, or NFT Forge.

3. Academy: Ensure at least one course has complete lesson content, not just stubs.

All content must pass the anti-slop filter and use Arcanea voice.
Commit per content type: "content(blog): [title]", "content(showcase): [entries]"
```

### 2.5 Community Infrastructure

```
Read .arcanea/MASTER_PLAN.md for the Feed and Community layer status.

Build or enhance social features:
1. Gallery improvements: Better grid, filtering, search, likes/saves
2. User profiles: Avatar, bio, creations list, skill tree progress
3. Discovery: "Explore" feed showing recent community creations
4. Sharing: Copy-link, social media cards, embed codes
5. Collections: Users can curate their own galleries
6. Notifications: Basic system for when someone interacts with your creation

Start with what exists and make it 2x better. Don't build a social network from scratch —
build the minimum viable social layer that makes creators feel seen.
Check Supabase schema for existing tables. Use RLS for security.
Commit: "feat(community): [feature] — [what it enables]"
```

### 2.6 Agent Economy Build

```
Read .arcanea/MASTER_PLAN.md and the agent/skill registries.

Build the marketplace foundation:
1. Agent catalog page: Browse available agents with descriptions, capabilities, usage stats
2. Skill directory: Searchable list of 54+ skills with categories and examples
3. Rating/review system: Simple thumbs up/down + comment on agents/skills
4. Usage tracking: Basic analytics on which agents/skills are most used
5. Contribution guide: How to create and submit your own agent or skill
6. Certification badges: Visual indicators for tested, verified, community-approved

Focus on making the existing ecosystem VISIBLE and DISCOVERABLE.
The 90+ repos, 35 packages, 54 skills are the product — they just need a storefront.
Commit: "feat(marketplace): [component] — agent economy foundation"
```

### 2.7 Brand Amplification

```
Audit Arcanea's discoverability and brand presence:

1. SEO content gap analysis:
   - What terms should arcanea.ai rank for? (AI world building, creative AI, etc.)
   - Create or enhance pages targeting those terms
   - Ensure every page has unique, keyword-rich metadata

2. Social card optimization:
   - Every shareable page needs og:image, og:title, og:description
   - Preview cards should look stunning when shared on X/Discord/LinkedIn
   - Test with https://cards-dev.twitter.com/validator

3. Internal linking:
   - Every page should link to 3-5 related pages
   - Add "Related" sections at bottom of content pages
   - Breadcrumbs on all nested routes

4. Technical SEO:
   - robots.txt is correct and not blocking important pages
   - Sitemap includes ALL live pages with proper lastmod dates
   - Canonical URLs on all pages
   - No duplicate content issues

Commit: "seo: brand amplification — [specific improvements]"
```

### 2.8 Technical Debt Sprint

```
Read apps/web/ and identify the worst technical debt:

1. Type safety: Search for 'any' types, 'as any' casts, @ts-ignore comments. Fix them.
2. Error handling: Find try/catch blocks that swallow errors silently. Add proper error boundaries.
3. Component size: Find components over 200 lines. Extract sub-components.
4. Duplicate code: Find similar code in 3+ places. Extract to shared utilities.
5. Stale dependencies: Run npm outdated. Update non-breaking deps.
6. Missing tests: Find critical utility functions with no tests. Add them.
7. Console.log pollution: Remove all console.log/warn/error from production code (keep error boundaries).
8. TODO/FIXME/HACK: Catalog all TODO comments. Fix the quick ones, ticket the rest.

Timebox each category to 30 minutes. Fix what you can, document what you can't.
Commit per category: "refactor: [category] — [count] issues resolved"
```

---

## 3. Specialist Prompts by Domain

Assign these to agents based on their strength.

---

### 3.1 Frontend Agent

```
Read .arcanea/prompts/luminor-frontend-module.md for your specialization.
Read .arcanea/MASTER_PLAN.md for page status.

Pick a PARTIAL or STUB page and bring it to LIVE quality:
1. Server Component by default, Client Component only for interactivity
2. Loading.tsx and error.tsx for every dynamic route
3. Responsive: works at 375px, 768px, 1024px, 1440px
4. Design system compliant: tokens, fonts, glass cards, aurora gradients
5. Accessible: keyboard nav, screen reader, ARIA labels
6. Fast: LCP < 2.5s, no layout shift, optimized images

Build the page. Test it. Screenshot it at 3 breakpoints.
Commit: "feat([page]): bring to LIVE quality"
```

### 3.2 Backend Agent

```
Read .arcanea/prompts/luminor-backend-module.md for your specialization.
Read apps/web/app/api/ for existing API routes.

Pick one of these backend improvements:
A) API route audit: Find routes missing error handling, validation, or rate limiting. Fix them.
B) Supabase optimization: Check for missing RLS policies, unused tables, or N+1 queries.
C) New API endpoint: Build a needed endpoint (check MASTER_PLAN.md for what's missing).
D) Caching layer: Add proper cache headers, revalidation, or ISR to data-heavy pages.
E) Edge functions: Move appropriate API routes to edge for lower latency.

Every API route must have: input validation, error handling, proper HTTP status codes, TypeScript types.
Commit: "feat(api): [endpoint/improvement]"
```

### 3.3 Lore Agent

```
Read .arcanea/lore/CANON_LOCKED.md — this is your bible. Never contradict it.
Read .arcanea/config/voice.yaml for writing voice.

Pick one of these lore tasks:
A) Gate content: Pick a Gate missing detailed content. Write its full description:
   mythology, trials, what the creator learns, how it maps to the framework.
B) Guardian depth: Pick a God/Goddess + Godbeast pair. Write their relationship,
   their teaching style, their domain expertise, how they help creators.
C) Academy lesson: Write a complete lesson for a course — not abstract theory,
   but practical world-building exercises using Arcanea concepts.
D) Library text: Write a new text for one of the 17 book/ collections.
   Must be actionable wisdom, not entertainment. "Equipment for living."
E) Creator archetype: Define a new creator archetype — their strengths, growth path,
   which Gates they naturally open, which they struggle with.

All content must pass /canon-check. Use Lumina/Nero duality, Five Elements, Ten Gates.
Save to appropriate location. Commit: "lore: [type] — [title]"
```

### 3.4 Research Agent

```
Read .arcanea/agents/research/ for your team structure.

Pick one research mission:
A) Competitive landscape: Find 5 platforms doing something similar to one Arcanea layer.
   Document: what they do well, what they miss, how Arcanea is different.
   Save to docs/research/github/[topic].md

B) Technology scout: Research a technology Arcanea could benefit from
   (WebGPU, Web Audio API, WebRTC, WASM, etc.). Evaluate feasibility, effort, impact.
   Save to docs/research/papers/[topic].md

C) Trend monitor: What's happening in AI-powered creative tools this week?
   New launches, funding, open source releases, API updates.
   Save to docs/research/synthesis/weekly-[date].md

D) User research proxy: Search GitHub issues, Discord discussions, Reddit posts
   about AI creative tools. What do users want? What frustrates them?
   Save to docs/research/synthesis/user-needs-[date].md

Every research output must end with "Implications for Arcanea" section.
Commit: "research: [topic] — [key finding]"
```

### 3.5 Ops Agent

```
Read .arcanea/prompts/luminor-ops-module.md for your specialization.

Run the operational health check:
1. Build: cd apps/web && npm run build — does it succeed with 0 errors?
2. Lint: npm run lint — fix any new warnings or errors
3. Types: npx tsc --noEmit — fix any type errors
4. Deploy: Check Vercel dashboard — is production deploy healthy?
5. Dependencies: npm audit — any critical/high vulnerabilities?
6. Git hygiene: Are there stale branches that should be cleaned?
7. Disk: Check C: drive free space — alert if < 10GB
8. Process count: Are there zombie node/Claude processes eating resources?

Fix everything you can. Document what needs manual intervention.
Commit: "ops: health check — [count] issues resolved"
```

### 3.6 Quality Agent

```
Pick a recent commit or PR and do a thorough code review:

1. Architecture: Does it follow the project patterns? Server/client boundary correct?
2. Types: Are all public APIs typed? No 'any' escape hatches?
3. Security: Input validated? No XSS vectors? Secrets safe?
4. Performance: No unnecessary re-renders? Images optimized? Bundle impact?
5. Accessibility: Semantic HTML? Keyboard navigable? Screen reader friendly?
6. Error handling: What happens when things fail? Graceful degradation?
7. Tests: Are critical paths tested? Edge cases covered?
8. Voice: Does user-facing copy match Arcanea voice? No slop?

If reviewing your own work: be your own harshest critic.
Fix issues directly rather than just noting them.
Commit: "fix: code review findings — [summary]"
```

### 3.7 Content Agent

```
Read apps/web/lib/blog-data.ts for existing content.
Read .arcanea/config/voice.yaml for writing voice.
Read .arcanea/lore/CANON_LOCKED.md for canonical references.

Create one piece of high-quality content:

A) Blog post: Pick an angle that positions Arcanea uniquely.
   Structure: Hook → Problem → Arcanea's approach → Proof → CTA.
   Length: 800-1500 words. Include code examples or screenshots where relevant.
   Must be useful standalone — someone should learn something even if they never use Arcanea.

B) Documentation: Find a feature with poor or missing docs. Write clear, example-rich docs.
   Structure: What it is → Quick start → Full API → Examples → Troubleshooting.

C) Social content: Write 5 tweet-length posts about different Arcanea features.
   Each must be self-contained, interesting, and link to a specific page.

No slop. No filler. Every sentence must earn its place.
Commit: "content([type]): [title]"
```

### 3.8 Strategy Agent

```
Read .arcanea/MASTER_PLAN.md for current priorities.
Read the memory files for project context.

Pick one strategic analysis:

A) Conversion audit: Trace the path from visitor to active user.
   Where are the drop-off points? What's missing? What's confusing?
   Propose 3 specific, buildable improvements with expected impact.

B) Monetization review: What's the current revenue model?
   Map: free tier → paid features → enterprise. Are the boundaries clear?
   Is the open-core model (tools free, creation services paid) well-communicated?

C) Roadmap prioritization: Look at all PLANNED and STUB pages.
   Rank them by: user impact x effort x strategic alignment.
   Propose the next 5 things to build, in order, with rationale.

D) Positioning audit: Read the homepage, about page, and 3 feature pages.
   Is Arcanea's unique position clear? ("Not a chatbot — a creative multiverse")
   Propose copy and structural changes to sharpen positioning.

Save analysis to docs/strategy/[topic]-[date].md with clear action items.
Commit: "docs(strategy): [topic] analysis"
```

---

## 4. Multi-Agent Coordinated Missions

For when 3+ agents work in parallel on a shared goal.

---

### 4.1 Launch Campaign

> Assign to 4 agents: Content, Frontend, SEO, Strategy

```
MISSION: Prepare a feature launch for maximum impact.

AGENT 1 (Content): Write the announcement blog post, 3 social posts, and changelog entry.
Read .arcanea/config/voice.yaml. No slop. Feature benefits over specifications.
Commit: "content: [feature] launch content"

AGENT 2 (Frontend): Build or polish the feature's page to showcase quality.
Screenshot-worthy design. Loading states. Mobile perfect. Interactive demo if possible.
Commit: "feat: [feature] page polish for launch"

AGENT 3 (SEO): Optimize the feature page metadata, JSON-LD, OG tags, sitemap entry.
Create internal links from 5 related pages. Check social card preview renders correctly.
Commit: "seo: [feature] launch optimization"

AGENT 4 (Strategy): Write the launch brief: target audience, key messages,
distribution channels, success metrics. Save to docs/strategy/launch-[feature].md.
Commit: "docs: [feature] launch strategy"

COORDINATION: All agents read MASTER_PLAN.md first. Feature page is the anchor.
Content links to it. SEO optimizes it. Strategy defines its positioning.
```

### 4.2 Feature Sprint

> Assign to 4 agents: Planner, Builder, Tester, Deployer

```
MISSION: Ship a complete feature in one session.

AGENT 1 (Planner): Read MASTER_PLAN.md. Pick the highest-priority PLANNED feature.
Write the spec: user stories, data model, API endpoints, UI components, edge cases.
Save to docs/specs/[feature]-spec.md. Define acceptance criteria.
Commit: "docs: [feature] specification"

AGENT 2 (Builder): Wait for Agent 1's spec. Build the feature:
- Database schema (if needed) → API routes → UI components → Page integration
- Server Components by default. TypeScript strict. Design system compliant.
- Error boundaries, loading states, mobile responsive.
Commit in logical chunks: "feat([feature]): [component]"

AGENT 3 (Tester): Wait for Agent 2's implementation. Test everything:
- Happy path works end-to-end
- Error states handled gracefully
- Mobile works at 375px
- Accessibility passes
- Performance acceptable
Fix what you find. Report what you can't fix.
Commit: "test: [feature] — [fixes applied]"

AGENT 4 (Deployer): After Agent 3 signs off:
- Run full build: npm run build (must pass clean)
- Run lint: npm run lint (must pass clean)
- Verify no regressions on existing pages
- Update MASTER_PLAN.md page status to LIVE
Commit: "ops: [feature] deploy verification"
```

### 4.3 Excellence Sweep

> Assign to 4 agents: Quality, Design, Performance, Accessibility

```
MISSION: Raise the quality bar across the entire site.

AGENT 1 (Quality): Run the Quality Sweep (prompt 1.1) on 5 pages.
Focus on: code quality, error handling, type safety, dead code.
Commit: "fix(quality): sweep — [count] issues across [count] pages"

AGENT 2 (Design): Run the Design Consistency Check (prompt 1.3) on 5 DIFFERENT pages.
Focus on: token compliance, spacing, typography, glass card consistency, color palette.
Commit: "style: design sweep — [count] fixes across [count] pages"

AGENT 3 (Performance): Run the Performance Audit (prompt 1.2) on 5 DIFFERENT pages.
Focus on: LCP, CLS, bundle size, image optimization, Suspense boundaries.
Commit: "perf: sweep — [count] improvements across [count] pages"

AGENT 4 (Accessibility): Run the Accessibility Pass (prompt 1.8) on 5 DIFFERENT pages.
Focus on: keyboard nav, contrast, alt text, ARIA, semantic HTML, heading structure.
Commit: "a11y: sweep — [count] fixes across [count] pages"

COORDINATION: Each agent picks DIFFERENT pages. No overlap. Together you cover 20 pages.
Check MASTER_PLAN.md for LIVE pages list. Divide alphabetically or by route group.
```

### 4.4 Revenue Engine

> Assign to 3 agents: Strategy, Frontend, Backend

```
MISSION: Build or improve the conversion and monetization infrastructure.

AGENT 1 (Strategy): Audit the current pricing, value proposition, and conversion funnel.
- Map every place a user could convert (sign up, subscribe, purchase)
- Identify missing conversion points
- Write pricing page copy that makes the open-core model clear
- Define A/B test hypotheses for top 3 conversion improvements
Save to docs/strategy/revenue-audit-[date].md
Commit: "docs(strategy): revenue engine audit"

AGENT 2 (Frontend): Build or improve conversion UI:
- Pricing page (if missing or stub) with clear tiers
- CTA buttons on every page with proper styling and positioning
- Social proof elements (user counts, testimonials, GitHub stars)
- Upgrade prompts at natural friction points
Commit: "feat(conversion): [component]"

AGENT 3 (Backend): Build conversion infrastructure:
- Analytics events on key conversion points (PostHog ready)
- Stripe checkout flow (if applicable)
- Usage tracking for rate-limited features
- Email capture / waitlist endpoints
Commit: "feat(api): conversion infrastructure"

COORDINATION: Strategy defines what to build. Frontend makes it visible. Backend makes it work.
```

---

## 5. Quick Reference: Prompt Selection Guide

| Situation | Prompt | Time |
|-----------|--------|------|
| "I have 15 minutes" | 1.4 Copy Polish, 1.6 Dead Code | 15 min |
| "I have 30 minutes" | 1.1 Quality Sweep, 1.7 SEO | 30 min |
| "I have 1 hour" | 1.5 Journey Optimization, 1.2 Perf Audit | 60 min |
| "I have 2-4 hours" | Any Section 2 Deep Dive | 2-4 hrs |
| "I have a full day" | Section 4 Coordinated Mission | 4-8 hrs |
| "Ship a feature" | 4.2 Feature Sprint | 3-6 hrs |
| "Make everything better" | 4.3 Excellence Sweep | 2-4 hrs |
| "Grow the business" | 4.4 Revenue Engine | 3-5 hrs |
| "Agent sitting idle" | 1.10 Security, 1.8 A11y, 1.6 Dead Code | 20 min |

## 6. Rules for All Agents

1. **Read before writing.** Always read .arcanea/MASTER_PLAN.md and the file you're editing before making changes.
2. **Conventional commits.** Format: `type(scope): description` — types: feat, fix, perf, style, a11y, seo, ops, docs, refactor, chore, content, lore, research, security, test.
3. **No slop.** Every piece of user-facing text must sound like Arcanea, not like a LinkedIn post.
4. **No secrets.** Never commit API keys, tokens, or .env files.
5. **Test your work.** Run `npm run build` before committing. If it breaks, fix it.
6. **Mobile first.** If you touch UI, test at 375px.
7. **Canon compliance.** If you touch lore, check CANON_LOCKED.md.
8. **Leave it better.** Every session should leave the project measurably improved.
9. **Max 4 Claude instances.** Check process count before spawning. Kill zombies.
10. **Update state.** After significant work, update MASTER_PLAN.md page status if applicable.
