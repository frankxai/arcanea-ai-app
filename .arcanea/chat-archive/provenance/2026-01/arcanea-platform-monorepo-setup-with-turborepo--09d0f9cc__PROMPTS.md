# Frank's prompts -- Arcanea platform monorepo setup with turborepo

Source uuid: 09d0f9cc-3984-4feb-ad82-cdd2db4da14e
Created: 2026-01-23T23:57:21.748915Z

Verbatim, chronological.

## Turn 0

Create Arcanea platform monorepo with automated setup. I need you to:
1. Generate a complete turborepo structure with:
   - apps/web (main Next.js app with all modules)
   - apps/landing (separate landing page)
   - packages/arcanea-core (shared components & types)
   - packages/agent-engine (AI Agent Builder)
   - packages/mcp-integration (MCP client/server)
   - packages/skill-registry (Skill.md plugin system)
   - plugins/ (directory for open-source plugins)
2. Create all necessary configuration files:
   - Root package.json with workspaces
   - tsconfig.json with path aliases (@arcanea/*, @/)
   - turbo.json for build pipeline
   - .env.example for all required vars
3. Set up apps/web with:
   - App router structure (/chat, /agent, /studio, /feed, /skills routes)
   - ModuleRouter component to switch between features
   - Landing page integration
   - Layout with navigation
4. Create package.json files for each package with correct dependencies
5. Generate base component stubs in arcanea-core:
   - ChatInterface component
   - VoiceWaveform component
   - AgentBuilder component
   - ImageStudio placeholder
   - SocialFeed placeholder
6. Create a GitHub workflow file (.github/workflows/deploy.yml) for Vercel deployment
7. Add a comprehensive README.md with setup instructions
8. Create docs/ARCHITECTURE.md explaining the structure
Make it production-ready and ready to integrate v0 components. Use TypeScript throughout. Include proper error handling and loading states.
