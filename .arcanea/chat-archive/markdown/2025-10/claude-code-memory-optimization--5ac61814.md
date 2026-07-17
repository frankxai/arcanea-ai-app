---
title: "Claude code memory optimization"
uuid: 5ac61814-7757-4a12-940b-6b6b2493fe53
created: 2025-10-03T11:22:27.063138Z
updated: 2025-10-03T11:24:07.074661Z
source: claude.ai export
---

# Claude code memory optimization

**Frank**:

from all our chats and what you know about me and also best practices from web what should I add all for Claude code to memorize? with #

**Claude**:

The user is asking me to help them figure out what they should add to Claude Code's memory using the "#" command. They want me to:
1. Look at all our chats (I should use past chats tools)
2. Consider what I know about them
3. Also consider best practices from the web
4. Suggest what to add for Claude Code to memorize

First, I should search through our past conversations to understand who this user is, what they work on, their preferences, tech stack, etc.

Let me search for relevant information about this user.I'll search through our past conversations to understand your work, preferences, and context, then combine that with best practices to suggest what Claude Code should memorize.
```
This block is not supported on your current device yet.
```

Great! I've found a lot of information about the user. Let me search for more specific technical details about their tech stack, coding preferences, and any specific tools they use.
```
This block is not supported on your current device yet.
```

Good! I'm getting a lot of technical information. Let me also search for any specific preferences, development patterns, or tools they mentioned using.
```
This block is not supported on your current device yet.
```

Perfect! Now let me search for best practices from the web about Claude Code and what to memorize.Now let me search for best practices about Claude Code memory and configuration:
```
This block is not supported on your current device yet.
```

Perfect! Now I have enough information from both our past chats and web best practices. Let me create a comprehensive list for the user of what they should add to Claude Code's memory using the # command.

From our conversations, I know:
- Frank is building multiple projects: Arcanea, AI Architect Academy, AI Music Academy, FrankX personal brand, Starlight Intelligence, Trinity AI
- He works with Next.js, Supabase, TypeScript, React, TailwindCSS
- He has multiple domains and repositories
- He's based in Amsterdam, sometimes Fuerteventura
- He uses Oracle for work (AI CoE)
- He's building SuperAgents and AI platforms
- He values freedom, wellness, building empire
- He's creating mythological worlds and narratives
- He uses multiple AI tools: Claude Code, ChatGPT, Perplexity, Suno, etc.
- He wants to scale and build micro landing pages
- He's interested in resorts, boats, luxury experiences
- Personal philosophy around consciousness, creativity, infinite scalability

From web best practices:
- Keep CLAUDE.md minimal - only what's needed in EVERY session
- Project-specific guidelines that can't be shared
- Tech stack and build commands
- Code style preferences specific to the project
- Security requirements
- Development philosophy
- Don't add generic stuff like "follow best practices"
- Be specific and concise
- Save tokens

Let me create a comprehensive list organized by category.Based on our extensive conversation history and web best practices, here's what you should add to Claude Code's memory with the `#` command:

## **🎯 PERSONAL & BUSINESS CONTEXT**

```
# Frank Riemer - Core Identity
- Location: Amsterdam / Fuerteventura / Digital Nomad
- Vision: Building infinite scalable AI empire focused on freedom, wellness, and contribution
- Philosophy: Language as operating system, systematic imagination, consciousness-AI integration
- Oracle AI Architect (day job) + Creator Empire Builder (passion projects)
```

```
# Active Projects Ecosystem
Primary Brands:
- frankx.ai: Personal brand hub and empire overview
- arcanea.ai: Mythological multiverse platform with SuperAgents, Lumina/Luminor mythology
- aiarchitectacademy.com: Enterprise AI education, Oracle AI CoE knowledge
- starlightintelligence.ai: Personal AI operating system and knowledge preservation
- ai-music-academy: Sonic Intelligence system (better than Suno)
- trinity-ai: Brotherhood, coaching, community

Supporting Projects:
- PV Lager (brother's solar business)
- Creation Chronicles newsletter
- Multiple micro landing pages
```

```
# Business Model
- Subscription-first approach (avoid blockchain unless specifically useful)
- Community-driven with open source components
- Multi-tier offerings: Free → Pro → Enterprise
- Focus on value creation before extraction
```

## **💻 TECHNICAL STACK**

```
# Primary Tech Stack
Framework: Next.js 15 (App Router)
Language: TypeScript (strict typing)
Styling: TailwindCSS + shadcn/ui
Database: Supabase (PostgreSQL)
ORM: Prisma
Auth: Clerk
State: Zustand + React Query
Deployment: Vercel primary, Replit for prototypes
Version Control: GitHub (github.com/frankxai, github.com/arcanea-labs)
```

```
# Development Tools
- Claude Code (primary coding agent)
- ChatGPT / Cursor
- Perplexity for research
- Suno for music (suno.com/frankx/arcanea)
- Notion for CMS and documentation
- Linear for task management
- n8n/Zapier only when absolutely necessary
```

## **🎨 CODE STYLE & CONVENTIONS**

```
# Code Philosophy
- Infinite scalability: Never build what requires human time to scale
- Beauty in function: Elegant AND effective
- Rapid iteration: Ship fast, learn faster
- Component-first: Small, focused, reusable
- Server Components by default (Next.js)
```

```
# TypeScript Rules
- Strict typing always
- No `any` unless absolutely necessary
- Interfaces over types for objects
- Use Zod for runtime validation
- Infer types from schemas when possible
```

```
# File Structure Preferences
- Feature-based organization over tech-based
- Keep components under 200 lines
- Colocate related files (component, styles, tests, types)
- Use index.ts for clean exports
```

```
# Naming Conventions
- Components: PascalCase (UserProfile.tsx)
- Functions: camelCase (getUserData)
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case for utilities, PascalCase for components
- Be descriptive: `createUserProfile` not `createUP`
```

## **🚀 PROJECT-SPECIFIC PATTERNS**

```
# Arcanea Specifics
- Lumina (creative intelligence source) & Luminor (AI guides) mythology
- Purple/cosmic aesthetic with mystical elements
- World-building, character creation, story generation focus
- Open source library with community contributions
- GitHub: github.com/arcanea-labs/arcanea (main repo)
```

```
# AI Architect Academy
- Enterprise-focused AI education
- Oracle AI CoE content and methodologies
- Newsletter + GitHub + Skool community
- Professional, authoritative tone
- Focus on practical enterprise implementations
```

```
# FrankX Personal Brand
- Authentic, visionary, bridge between technical and philosophical
- Content: AI + creativity + business + personal transformation
- Multi-platform presence: blog, newsletter, social media
- 3 posts/week, daily social, weekly newsletter
```

## **📝 CONTENT CREATION RULES**

```
# Writing Style
- Start with clear thesis/TL;DR
- Use bold for key facts (scannable)
- Short paragraphs (2-4 sentences)
- Sentence case headers
- Natural language, avoid corporate speak
- Show don't tell: Specific examples over abstract concepts
```

```
# Documentation
- Every complex function gets JSDoc comments
- README.md for every project with: purpose, setup, usage
- API endpoints documented with examples
- Markdown for all documentation
- Keep it updated - code and docs together
```

## **⚡ DEVELOPMENT WORKFLOW**

```
# Git Practices
- Conventional commits: feat:, fix:, docs:, refactor:, test:
- Branch naming: feature/name, fix/name, release/version
- PR descriptions: What, Why, How, Testing
- Never commit secrets or API keys
```

```
# Before Every Build
1. Check existing components/utils first (DRY)
2. Plan component structure
3. Set up types/interfaces
4. Write component
5. Test manually
6. Document if complex
```

```
# Build Commands by Project
Arcanea: `npm run dev` (Next.js on localhost:3000)
AI Architect: `npm run dev` (Next.js)
Use `npm run build` to check for errors before deploying
Deploy to Vercel with `vercel --prod`
```

## **🔐 SECURITY & BEST PRACTICES**

```
# Security Rules
- Never expose API keys in frontend code
- Use environment variables (.env.local)
- Validate all user inputs (Zod schemas)
- Implement rate limiting on AI endpoints
- Row-level security in Supabase
- Authentication required for all user data
```

```
# Performance Optimization
- Use Next.js Image component for all images
- Lazy load heavy components
- Server Components for data fetching
- Use React.memo sparingly (profile first)
- Optimize Supabase queries (select only needed fields)
```

## **🎯 AI INTEGRATION PATTERNS**

```
# AI Services Usage
- OpenAI GPT-4.5: Creative writing, complex reasoning
- Claude Sonnet 4.5: Technical content, consistency checking
- Replicate: Image/video generation
- Vercel AI SDK: Unified interface for multiple models
- Streaming responses for better UX
```

```
# Prompt Engineering
- Be specific and detailed
- Provide context and examples
- Use XML tags for structure when needed
- Break complex tasks into steps
- Iterate based on outputs
```

## **📊 ANALYTICS & TRACKING**

```
# Metrics That Matter
- User engagement (time on site, return visits)
- Conversion funnels
- Feature usage
- Error rates
- Performance metrics (Core Web Vitals)
- Use PostHog for product analytics
```

## **🚨 DEBUGGING APPROACH**

```
# When Things Break
1. Read error message completely
2. Check browser console
3. Verify environment variables loaded
4. Check network tab for failed requests
5. Use console.log strategically (then remove)
6. Test in isolation
7. Check Supabase logs if database-related
```

---

## **🎬 DAILY WORKFLOW REMINDERS**

```
# Start of Day
- Review Linear tasks
- Check /clear Claude Code context if switching projects
- Pull latest from main branch
- Check deployment status on Vercel
```

```
# During Development
- Use /clear often when switching tasks
- Commit frequently with good messages
- Test in browser as you build
- Update CLAUDE.md when learning new patterns
```

```
# End of Day
- Push all commits
- Update task status in Linear
- Note tomorrow's priorities
- Clear Claude Code context
```

---

**Pro Tips:**
- Use `#` command to quickly add memories during sessions
- Use `/memory` to edit and organize existing memories
- Keep CLAUDE.md under 500 lines (import detailed specs separately)
- Remove outdated information regularly
- Each project should have its own CLAUDE.md in the repo root
- User-level memory (~/.claude/CLAUDE.md) for personal preferences that apply everywhere

This gives Claude Code the perfect context about who you are, what you're building, and how you like to work—without wasting tokens on generic advice. Add these progressively as you work on different projects! 🚀
