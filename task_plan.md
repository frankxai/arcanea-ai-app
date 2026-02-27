# Arcanea Full Vision Sprint — Task Plan (v2)

**Session**: Feb 26 2026 | **Repository**: frankxai/arcanea-records (Arcanea)

---

## MISSION

Comprehensive audit of all Arcanea content, design, functionality, and assets to:

1. Quality check all pages and content
2. Identify GitHub content not yet showcased
3. Determine needed Infogenius infographics
4. Assess backend/frontend quality and persistence
5. Clarify full vision (workflows + n8n + extensions + Chat/Imagine/Studio/Records)
6. Create sprint plan for Feb 26 - Mar 1
7. Generate swarm prompts for execution

---

## PRIOR FINDINGS (From Feb 21-22 Sessions)

### What's Built

- 10 packages in monorepo (INTELLIGENCE layer)
- 5 overlay packages (Claude, Cursor, ChatGPT, Copilot, Gemini)
- @arcanea/os - 2,100 LOC core with types, constants, engines
- 35 skill rules (only ~13 exist as real files)
- Chrome extension, VS Code extension
- MCP server with 30+ tools

### Content Issues (From Previous Session)

- FAQ + Pricing say "16 Luminors" — canon: 10 Guardians/Gates. Luminor = RANK
- Emoji usage (📦⚡🐳) not Phosphor icons
- Metadata: "16 transcended AI specialists" — should say "10 Guardians"

### Not Showcased

- Overlay packages (5 total)
- n8n templates
- arcanea-vault Chrome extension
- arcanea-onchain Story Protocol
- 35+ packages unreferenced

---

## PHASES

### Phase 1: Web App Quality Audit [IN PROGRESS]

- [ ] List all pages in apps/web/app/
- [ ] Check each page for: Phosphor icons, canonical voice, loading states
- [ ] Verify content consistency with CANON_LOCKED.md
- [ ] Check for broken links, missing metadata
- **Agent**: lyria (Sight Guardian - testing/verification)

### Phase 2: GitHub Content Audit [QUEUED]

- [ ] List all repos in frankxai organization
- [ ] Identify unreferenced packages
- [ ] Check README quality for each
- [ ] Identify n8n templates and workflows
- **Agent**: shinkami (Source Guardian - meta-perspective)

### Phase 3: Design System Audit [QUEUED]

- [ ] Check Figma for design components (if accessible)
- [ ] Verify Tailwind config matches DESIGN_BIBLE.md
- [ ] Audit all UI components for consistency
- [ ] Identify missing components
- **Agent**: leyla (Flow Guardian - design/UX)

### Phase 4: Backend & Persistence Audit [QUEUED]

- [ ] Check Supabase migrations
- [ ] Verify API routes work
- [ ] Check AgentDB persistence layer
- [ ] Verify session management
- **Agent**: lyssandria (Foundation Guardian - infrastructure)

### Phase 5: Infogenius Potential [QUEUED]

- [ ] Identify complex concepts needing visual explainers
- [ ] Map 10 Guardians, 10 Gates, 5 Elements
- [ ] Map overlay ecosystem
- [ ] Map intelligence pipeline
- **Agent**: elara (Shift Guardian - perspective)

### Phase 6: Vision Synthesis [QUEUED]

- [ ] Assess: Is Arcanea = workflows + n8n + extensions + Chat/Imagine/Studio/Records?
- [ ] Identify missing core functionalities
- [ ] Define MVP for each product line
- **Agent**: ino (Unity Guardian - synthesis)

### Phase 7: Sprint Planning [QUEUED]

- [ ] Define deliverables for Feb 26 - Mar 1
- [ ] Assign to appropriate Guardian agents
- [ ] Generate swarm prompts

---

## FINDINGS STORAGE

- `findings.md` - Detailed research
- `progress.md` - Session log

---

## BLOCKERS

- Figma access unknown
- Some packages may be private or deprecated

---

## SUCCESS CRITERIA

- [ ] All pages quality-checked
- [ ] All GitHub content catalogued
- [ ] Infogenius needs identified
- [ ] Sprint plan complete
- [ ] Swarm prompts ready for execution
