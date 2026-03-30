# ARCANEA COUNCIL STRATEGY REPORT
# Honest Assessment of All Strategy Documents

> **Reviewer**: Strategy Reviewer, Arcanea Council
> **Date**: 2026-03-29
> **Verdict**: The strategy is intellectually impressive and architecturally sound. It is also approximately 18 months of work described as 90 days. The gap between vision and execution capacity is the single biggest risk to Arcanea.

---

## 1. FEASIBILITY CHECK

### FRANCHISE_PRODUCTS.md

**Realistic for solo creator with AI tools?** Partially. The content production estimates (1 story/week, 1 visual/week, 1 soundtrack/week) are plausible. The 10-week faction reveal campaign is achievable. The Origin Class Quiz is buildable.

**What requires OTHER PEOPLE the doc assumes are available?**
- Community moderation (Discord with faction halls needs active moderation from Day 1, not after 500 members)
- Fan character review pipeline (requires reviewers who understand the canon deeply)
- The entire "fan submission to canon" pipeline assumes a community that does not yet exist

**What requires MONEY not accounted for?**
- ElevenLabs for audio stories ($22-99/mo)
- Midjourney for consistent visual generation ($30/mo)
- Print-on-demand startup costs (samples, listing fees)
- Discord server boosts for custom features
- Email service (ConvertKit/Substack: $0-59/mo depending on list size)
- Total unaccounted monthly tooling: $100-250/mo

**What requires TIME that conflicts with other priorities?**
- The faction reveal campaign (5 content pieces/week for 10 weeks) directly competes with platform development time
- Writing 10 faction short stories in 3 months while also building interactive products is aggressive
- 30 minutes/day in Discord is 15 hours/month -- that is a real time cost

**Implementable THIS MONTH?**
- The Origin Class Quiz: Yes, this is the one highest-leverage item
- First 2 faction reveals: Yes, if visuals exist
- Codex page template: Yes
- Everything else: No

---

### ECOSYSTEM_MAP.md

**Realistic?** This is a reference document, not an action plan. As a map of what exists and what connects, it is accurate and useful. As a plan, it describes the entire universe but does not prioritize.

**What requires OTHER PEOPLE?**
- 90+ repos listed; most are single-person repos with no contributors
- The "community contributes" assumption is pervasive but unearned -- there is no community yet

**Implementable THIS MONTH?**
- The gap analysis in Section 9 is the most actionable part. The Day 1-2 items (Supabase dashboard config, npm publish) are real and should happen.
- The 90-day roadmap targets 15,000 registered users and $1,000+ MRR by Month 3. This is extremely aggressive with no marketing budget, no email list, no social following, and no paid acquisition strategy described.

---

### OPS_ARCHITECTURE.md

**Realistic?** This is the strongest document. It is grounded in what actually exists (specific workflow files, specific CI jobs, specific environment variables). The recommendations are concrete and time-estimated.

**What requires OTHER PEOPLE?** Nothing. This is genuinely solo-executable.

**What requires MONEY?**
- UptimeRobot: free tier sufficient
- Sentry/PostHog: free tiers sufficient
- No hidden costs

**Implementable THIS MONTH?**
- The "Immediate (do today, 30 minutes)" checklist: Yes, and it should have been done already
- The "This week (2-3 hours)" checklist: Yes
- The dual-deploy fix: Yes, important

---

### ACADEMY_AND_COMMUNITY.md

**Realistic?** This is the most ambitious and least realistic document. It describes a comprehensive agent certification system with 10 Gate levels, 9 courses, benchmark suites, an agent marketplace with revenue sharing, a governance model with an Inner Circle, and a community architecture that assumes thousands of active participants.

**What requires OTHER PEOPLE?**
- Everything in Part 2 (Community Architecture) requires a community that does not exist
- The governance model (Inner Circle of 7-15 members) assumes 7-15 people who care deeply enough to govern
- Community reviewers, moderators, Luminor-rank members -- all assumed
- The Agent Marketplace requires agent CREATORS who are not Frank

**What requires MONEY?**
- Stripe Connect for marketplace payouts: setup time + ongoing compliance
- Community fund administration
- Event infrastructure

**What requires TIME?**
- Building benchmark suites for 10 Gates is a research project, not a weekend task
- Each benchmark suite needs real test cases, automated evaluation, and calibration
- The 9-course Academy curriculum is essentially writing a textbook

**Implementable THIS MONTH?**
- Publishing the Ten Gates spec as a public document: Yes
- Building actual benchmark suites: No, this is weeks of work per Gate
- Launching the Agent Marketplace: No
- Forming an Inner Circle: No (requires a community first)

---

### INTERCONNECTION_MAP.md

**Realistic?** This is a presentation/pitch document, not an operational strategy. It is excellent at explaining WHAT Arcanea is. It does not help with DOING anything.

**What requires OTHER PEOPLE/MONEY/TIME?** Not applicable -- this is a conceptual document.

**Implementable THIS MONTH?** The four audience pitches (Creator, Contributor, Partner/Investor, AI Developer) are immediately usable as website copy, pitch decks, or social media posts. That is the only actionable extraction.

---

## 2. REDUNDANCY CHECK

### Overlapping Content (appears in 3+ documents)

| Content | Appears In | Should Live In |
|---------|-----------|---------------|
| Origin Class Quiz description | FRANCHISE, ECOSYSTEM, INTERCONNECTION | FRANCHISE only |
| Membership tiers ($9/$19/invitation) | FRANCHISE, ACADEMY, ECOSYSTEM | ACADEMY only (monetization section) |
| Creator Journey (Discover to Lead) | ECOSYSTEM, ACADEMY, INTERCONNECTION | ACADEMY only |
| Faction Reveal campaign structure | FRANCHISE, ECOSYSTEM, INTERCONNECTION | FRANCHISE only |
| Agent Marketplace architecture | ECOSYSTEM, ACADEMY | ACADEMY only |
| Ten Gates agent capability mapping | ECOSYSTEM, ACADEMY | ACADEMY only |
| Flywheel diagram | FRANCHISE, ECOSYSTEM, ACADEMY, INTERCONNECTION | ONE document only |
| Character Card format specs | FRANCHISE, INTERCONNECTION | FRANCHISE only |
| Revenue projections | ACADEMY (detailed), ECOSYSTEM (targets) | ACADEMY only |
| Six-Layer architecture diagram | ECOSYSTEM, INTERCONNECTION | ECOSYSTEM only |
| 90-day roadmap | ECOSYSTEM (detailed), OPS (checklist) | ECOSYSTEM only |
| Gap analysis | ECOSYSTEM (full), OPS (infrastructure) | Split is reasonable |

### Contradictions Between Documents

| Issue | Doc A | Doc B | Resolution |
|-------|-------|-------|------------|
| Gate 8 naming | ACADEMY calls it "Shift" (Elara's Gate) | Canon uses "Starweave" | Use "Starweave" -- ACADEMY has a typo |
| Revenue Month 12 | ACADEMY: $23,000/mo | ECOSYSTEM: "$1,000+ MRR" by Month 3 | These are not contradictory but the Month 3 target in ECOSYSTEM is aggressive |
| Agent count | ECOSYSTEM: "50+" | MASTER_PLAN: "38 agents" | Use MASTER_PLAN (source of truth) |
| Marketplace timing | FRANCHISE: Month 6+ | ACADEMY: Phase 2 (Months 4-6) | Minor, but should be aligned |

### Documents That Could Be Merged

1. **INTERCONNECTION_MAP.md should be absorbed into ECOSYSTEM_MAP.md.** The Interconnection Map is a presentation-format restatement of the Ecosystem Map with added pitch decks. The pitches should become a separate `PITCH_DECKS.md` file; the mindmap duplicates the Ecosystem Map.

2. **The monetization section of FRANCHISE_PRODUCTS.md overlaps heavily with ACADEMY_AND_COMMUNITY.md Section 2.4.** Pick one canonical location. Recommendation: ACADEMY owns the monetization architecture; FRANCHISE references it.

### Clear Hierarchy

The documents lack an explicit hierarchy. Here is the correct one:

```
MASTER_PLAN.md (single source of truth -- operational state)
    |
    +-- OPS_ARCHITECTURE.md (how we build and deploy)
    +-- ECOSYSTEM_MAP.md (what exists and how it connects)
    +-- FRANCHISE_PRODUCTS.md (what we sell and how we market)
    +-- ACADEMY_AND_COMMUNITY.md (how community and agents work)
    +-- INTERCONNECTION_MAP.md (presentation/pitch material -- NOT operational)
```

When documents conflict, MASTER_PLAN.md wins. When MASTER_PLAN does not address the topic, OPS wins for technical matters, FRANCHISE wins for product matters, ACADEMY wins for community/agent matters.

---

## 3. ACTIONABILITY SCORES

### FRANCHISE_PRODUCTS.md

| Dimension | Score | Notes |
|-----------|-------|-------|
| Specificity | 9/10 | Extremely detailed -- exact content formats, cadence, tools, dimensions. This is a production bible. |
| Sequencing | 8/10 | Clear "Week 1, Week 2" structure. The 12-month calendar is well-sequenced. |
| Dependencies | 5/10 | Does not acknowledge that the PLATFORM must be built before many products can launch. Quiz needs a page. Codex needs pages. Cards need a distribution mechanism. |
| Metrics | 4/10 | No acquisition cost estimates. No conversion rate assumptions. "Build it and they will come" energy. |
| Timeline | 6/10 | The weekly output estimates in the "Solo Creator Reality Check" are honest. The overall calendar assumes all platform features ship on time. |
| **Overall** | **6.4/10** | |

**Impressive but no first step**: The Worldbuilding Kit ($29-79) is described in detail but there is no indication of where the content comes from, who designs the PDF, or how it gets to a purchase page.

---

### ECOSYSTEM_MAP.md

| Dimension | Score | Notes |
|-----------|-------|-------|
| Specificity | 7/10 | Good at mapping what exists. Less specific about what to DO with it. |
| Sequencing | 6/10 | The 90-day roadmap has sequencing. The rest is an encyclopedia. |
| Dependencies | 7/10 | The gap analysis (Section 9) correctly identifies blockers. |
| Metrics | 5/10 | The 90-day targets (15,000 users, 500 npm installs) are stated but not justified. |
| Timeline | 4/10 | The roadmap compresses 6-12 months of work into 90 days. |
| **Overall** | **5.8/10** | |

**Impressive but no first step**: The "From 1 Site to Ecosystem of Tools" section describes 8 tool distribution channels. None of them have a first step.

---

### OPS_ARCHITECTURE.md

| Dimension | Score | Notes |
|-----------|-------|-------|
| Specificity | 9/10 | Exact file names, exact YAML, exact commands. This is a runbook. |
| Sequencing | 9/10 | "Immediate (do today, 30 minutes)" / "This week" / "This month" / "Future". Clear priority order. |
| Dependencies | 8/10 | Identifies blockers (VERCEL_TOKEN not set, Sentry needs API key). |
| Metrics | 7/10 | Build success rate, CWV targets, quality score formula. Measurable. |
| Timeline | 8/10 | Time estimates are realistic (15 min, 30 min, 1h, 2h). |
| **Overall** | **8.2/10** | |

This is the best document in the strategy stack. Follow it.

---

### ACADEMY_AND_COMMUNITY.md

| Dimension | Score | Notes |
|-----------|-------|-------|
| Specificity | 9/10 | The 10 Gates are defined with extreme precision. Evaluation criteria, training patterns, example tasks. This is graduate-level curriculum design. |
| Sequencing | 6/10 | Phase 1/2/3 exists but each phase contains 5-10 major deliverables without internal ordering. |
| Dependencies | 3/10 | The entire community architecture depends on having users. The document does not address how to GET users. |
| Metrics | 6/10 | Journey Metrics table is specific (30% of Discover become Try). But these are targets, not measured baselines. |
| Timeline | 4/10 | "Phase 1: Months 1-3" includes launching 3 Academy courses, building Gate benchmark suites, launching Discord, implementing Gate progression, AND launching the fan submission pipeline. Each of these is weeks of work. |
| **Overall** | **5.6/10** | |

**Impressive but no first step**: The Agent Certification System is beautiful engineering. But there are zero external agents to certify. Building the certification system before there are agents to certify is building a DMV before there are cars.

---

### INTERCONNECTION_MAP.md

| Dimension | Score | Notes |
|-----------|-------|-------|
| Specificity | 6/10 | High-level connections are clear. No actionable detail. |
| Sequencing | 2/10 | No sequencing at all. This is a map, not a plan. |
| Dependencies | 3/10 | Dependencies are implicit in the connection arrows but not called out. |
| Metrics | 1/10 | No metrics. |
| Timeline | 1/10 | No timeline. |
| **Overall** | **2.6/10** | |

This document is a pitch deck, not a strategy. Grade it as a pitch deck and it is a 9/10. Grade it as a strategy document and it is a 3/10. It should be reclassified.

---

## 4. HONEST GAP ANALYSIS

### Revenue Assumptions -- Are They Realistic?

The $23,000/mo by Month 12 projection assumes 1,500 paid subscribers at $12/mo average. To get 1,500 paid subscribers, you need approximately 15,000-50,000 monthly active users (1-3% paid conversion is typical for freemium). To get 15,000 MAU with no marketing budget, you need viral organic growth or a content marketing engine that takes 6-12 months to compound.

**The honest answer**: $23K/mo in Month 12 is possible but requires everything to go right. A more realistic range is $2,000-8,000/mo in Month 12 if the quiz goes viral and the faction reveal campaign lands.

The $700/mo in Month 3 is also optimistic. It assumes 100 paid subscribers in 90 days with no existing audience, no email list, and no paid acquisition. The first paid subscriber requires: working auth, working payment processing, a product worth paying for, and a way to find people who want it.

### Community Growth -- What Is the Actual Acquisition Strategy?

The strategy documents describe a flywheel (content drives discovery drives community drives creation drives content) but do not describe **how the flywheel starts turning**. Flywheels require initial energy.

**What is missing**:
- Where does traffic come from? No SEO strategy, no paid ads, no influencer partnerships, no content distribution plan beyond "post on social media"
- Who are the first 100 users? Friends? AI developer communities? Fantasy readers? Each audience requires a different acquisition channel
- What is the cost per acquisition? Even organic acquisition has a time cost
- What is the retention curve? How many Day 1 users return on Day 7? Day 30? There is no measurement plan

### Competition -- Who Else Is Doing This?

The documents claim "Arcanea competes against nothing." This is true in the narrow sense that no one else is building a "Universe Operating System." But users do not buy categories -- they buy solutions to problems.

**Real competitors for each user need**:
- "I want to write fantasy": WorldAnvil, Campfire, Scrivener, plain ChatGPT
- "I want AI-generated images": Midjourney, DALL-E, Stable Diffusion, Leonardo.ai
- "I want to build AI agents": Claude Code, Cursor, Replit, LangChain
- "I want a creative community": DeviantArt, ArtStation, Discord servers, Reddit r/worldbuilding
- "I want to learn worldbuilding": YouTube, Brandon Sanderson's lectures (free), Holly Lisle's courses

The Arcanea advantage is integration -- all of these in one place with a shared mythology. The Arcanea disadvantage is that each individual piece is worse than the best-in-class standalone tool. The quiz and faction identity system is the unique differentiator that none of the above offer.

### Technical Debt Being Papered Over

- **CWV scores are terrible**: Homepage 35, Chat 18, Imagine 49. A Chat page scoring 18 on Lighthouse means real users on mobile are having a bad experience. The strategy documents mention Lighthouse CI but do not treat performance as a blocker for user acquisition.
- **TypeScript errors are informational, not blocking**: This means the type system is not actually protecting the codebase. Every informational type error is a potential runtime bug.
- **190 pages exist, target is 80**: The platform has 2.4x more pages than it should. Pruning stubs would improve both performance and maintenance burden.
- **13 npm packages unpublished**: The OSS ecosystem exists on paper but not in reality.
- **Auth is 90% complete**: The remaining 10% (Supabase dashboard config) has been "15 minutes of Frank's time" for an unknown duration. This is the single biggest blocker.

### Single Point of Failure

Everything depends on Frank. If Frank is unavailable for one week:
- No code merges to main (no other maintainers)
- No content production (no other creators)
- No community management (no moderators)
- No strategic decisions (no delegated authority)
- No financial operations (all accounts are single-owner)

The strategy documents describe a future with governance, maintainers, and shared ownership. But until the first community member reaches Luminor rank (which takes months of sustained engagement), Frank IS Arcanea.

**Mitigation that should exist but does not**: A "bus factor" document listing all critical accounts, credentials, and operational procedures. If Frank cannot work for a month, what keeps running automatically? Currently: Vercel deploys. Everything else stops.

---

## 5. THE OPS ARCHITECTURE SPECIFICALLY

### GitHub Actions YAML -- Is the Syntax Correct?

**canon-lint.yml**: Valid YAML. The workflow is well-structured. The shell script logic is correct. It properly uses `tj-actions/changed-files@v44` for path-filtered checks. The anti-slop grep patterns use `-P` (Perl regex) which is available on ubuntu-latest. The exit code logic (exit 1 on errors, continue on warnings) is correct.

**Issues found**:
- The `${{ steps.changed.outputs.all_changed_files }}` in the for loop is not quoted. If any file path contains spaces, it will break. Wrap it: `for file in "${{ steps.changed.outputs.all_changed_files }}"` -- though this is unlikely with the paths involved.
- The Hz check (`[0-9]\+\s*Hz`) will flag Hz frequencies in the lore documents themselves, which DO contain Hz frequencies as backend reference. This is a false positive problem. The check should exclude `.arcanea/lore/CANON_LOCKED.md` and other reference files.

### Is the CI Pipeline Actually Useful?

**Yes, with caveats.**
- `quality-gate.yml` runs lint, type-check, build, security audit, and e2e smoke. This is a solid gate.
- The dual-deploy situation (Vercel git integration + deploy-web.yml CLI deploy) is correctly identified as a race condition. The recommendation to keep Vercel git integration and repurpose deploy-web.yml as validation-only is the right call.
- The `ci.yml` and `canon-lint.yml` workflows exist and are valid. They add real value.

**What is cargo-culted**: The Lighthouse CI step references `lighthouserc.json` which the Ops doc says "needs to be created." The step will fail until that file exists. The AgentOps quality scoring formula (`score = build_pass * 30 + ...`) is theoretical -- there is no automation to calculate or store these scores.

### Does the Canon-Lint Workflow Catch Real Problems?

**Yes.** It catches:
1. Hz frequencies in user-facing content (real problem per project memory)
2. Anti-slop patterns (real problem with AI-generated content)
3. "Nero is evil" mischaracterization (real canon violation)
4. Malachar title inconsistency (real canon issue)
5. Gate name typos (real formatting issue)
6. Four-elements error (real canon violation)

**What it misses**:
- Misspelled Guardian names (checking for wrong names is harder than checking for wrong patterns)
- Incorrect Gate ordering (if someone lists Gates out of canonical order)
- New characters that contradict existing ones (requires semantic understanding, not regex)

The workflow is genuinely useful for what it does. It will not catch everything, but it will catch the most common drift patterns.

### Is the AgentOps Framework Practical or Theoretical?

**Mostly theoretical.** The session lifecycle (read MASTER_PLAN, check priority queue, update status) is already practiced manually. The quality scoring formula exists on paper but:
- No automation calculates the score
- No storage tracks scores over time
- No dashboard visualizes trends
- The "Aggregate Metrics" section describes metrics nobody is collecting

**What is practical**: The "Agents CAN / Agents CANNOT" safety rails are concrete and enforceable through CLAUDE.md instructions. The "Hard Stops" list is real and useful. The session lifecycle protocol is already in the CLAUDE.md and is followed.

### What Monitoring Actually Needs Setup vs Nice-to-Have?

**Must set up this week (30 minutes total)**:
1. Sentry DSN on Vercel (see errors in production)
2. PostHog key on Vercel (see if anyone is using the site)
3. Vercel Analytics enabled (free, one click)

**Nice to have (do when there are users)**:
- UptimeRobot (free, useful but Vercel is already reliable)
- OpenTelemetry collector (overkill for current traffic)
- PagerDuty/Opsgenie (overkill for a solo project)
- Lighthouse CI trending dashboard (useful after CWV baseline improves)

---

## 6. THE MONETIZATION SPECIFICALLY

### Are the Pricing Tiers Justified?

**$9/mo (Starlight Pass)**: This is in the right range for a creative tool subscription. Comparable: WorldAnvil Master ($5/mo), Campfire Pro ($6/mo), Notion Personal ($8/mo). The value proposition (unlimited Chat/Imagine, full creator tools, Gate progression) justifies $9 IF the tools work well.

**$19/mo (Archon Circle)**: This is the "serious creator" tier. Comparable: Midjourney Standard ($30/mo), ChatGPT Plus ($20/mo). The 50 high-quality images/month plus early access plus Academy courses makes this reasonable IF the image generation quality is competitive.

**Invitation-only (Luminor)**: This is smart pricing design -- scarcity and earned status. But "premium pricing TBD" means there is no price. You cannot earn revenue from an unpriced tier. Recommendation: $49/mo or $399/yr, justified by the custom agent builds (1 per quarter) and governance rights.

### Is the Year 1 Revenue Projection Realistic?

| Metric | Strategy Assumption | Reality Check |
|--------|-------------------|---------------|
| Month 3: 100 paid subs | Requires ~3,000 unique visitors converting at 3% | No traffic source identified |
| Month 6: 500 paid subs | Requires ~15,000 unique visitors | Still no marketing budget |
| Month 12: 1,500 paid subs | Requires ~50,000 unique visitors | Possible only if quiz goes viral |
| Month 3: $700/mo total | Achievable IF 100 subs exist | Subscriptions alone would be $1,200 at $12 avg, so the $700 is the total including lower actual sub count |
| Month 12: $23K/mo | Requires all 5 revenue streams producing | Agent Marketplace and Education unlikely to be significant in Year 1 |

**Honest projection**: $500-2,000/mo by Month 6. $3,000-10,000/mo by Month 12. This assumes the quiz generates traffic and the platform is compelling enough to convert visitors.

### Customer Acquisition Cost

Not mentioned anywhere. This is a critical gap.

For an unknown brand with no existing audience:
- Organic social: $0 cash but 5-10 hours/week of content creation
- Paid social (if ever used): $2-5 per quiz completion, $10-30 per email capture, $50-200 per paid subscriber
- SEO: 3-6 months before meaningful traffic, essentially free in cash but expensive in time
- Product Hunt launch: free, one-time spike of 500-5,000 visitors

The strategy assumes organic virality (quiz sharing, faction reveals). This can work -- BuzzFeed-style quizzes have proven viral mechanics -- but there is no Plan B if the quiz does not go viral.

### Where Does the First $1 of Revenue Come From?

The strategy does not answer this directly. Working backward:

**Fastest path to first $1**: Sell the Chronicles of Arcanea Book 1 as an ebook on Amazon/Gumroad. The book exists. Amazon KDP is free to publish. This can happen THIS WEEK.

**Fastest path to first subscriber**: Build the quiz, launch it with a social push, gate the full Character Diamond result behind email capture, then offer Starlight Pass. This takes 2-4 weeks if the quiz is the only priority.

**Fastest path to first $100/mo**: 10 Starlight Pass subscribers at $9/mo + 2 Worldbuilding Kit sales at $29 each. This requires: working auth, working Stripe integration, a quiz that converts, and a product worth paying for. Timeline: 6-10 weeks minimum.

### Minimum Viable Product for Paid Users

The strategy does not define an MVP for paid users. It should. Here is one:

**Starlight Pass MVP** (what must work on Day 1 of paid launch):
1. Account creation with persistent identity (origin class, House)
2. Unlimited Chat with Lumina (no rate limit for paid users)
3. Character Creator that saves to their profile
4. Access to all Library content
5. Gate Progression tracker showing their rank

**What can be missing on Day 1**: Crew Builder, image generation, audio stories, Discord role sync, Agent Marketplace access.

---

## 7. OVERALL STRATEGY GRADE

| Document | Grade | Assessment |
|----------|-------|------------|
| **FRANCHISE_PRODUCTS.md** | **B+** | Excellent creative strategy. Detailed, well-sequenced, honest about solo creator limits. Loses points for weak acquisition strategy and dependency blindness. Follow this document for WHAT to build. |
| **ECOSYSTEM_MAP.md** | **B-** | Comprehensive reference document. Good gap analysis. The 90-day roadmap is overambitious. Useful as a "where are we" reference, not as a "what to do next" plan. |
| **OPS_ARCHITECTURE.md** | **A-** | The best document. Grounded, specific, time-estimated, and immediately actionable. The AgentOps section is theoretical but the DevOps/GitOps sections are production-ready. Follow this document for HOW to build. |
| **ACADEMY_AND_COMMUNITY.md** | **B** | Intellectually impressive. The Ten Gates framework is genuinely innovative as an agent evaluation system. But it is a 12-month research project described as Phase 1. The community architecture is solid design but requires a community that does not exist. Build the Gates spec as a published document; defer everything else. |
| **INTERCONNECTION_MAP.md** | **C+** | A beautiful pitch document. Explains Arcanea's vision better than any other document. Zero operational value. Reclassify as marketing material, not strategy. |

---

## 8. IF YOU COULD ONLY DO 3 THINGS THIS WEEK

### Action 1: COMPLETE AUTH AND PAYMENTS (Blocks all revenue)

**Why**: Nothing else matters if users cannot sign in and pay.

**Specific tasks**:
1. Frank: 15 minutes -- Supabase Dashboard: set Site URL to `https://arcanea.ai`, add redirect URL `https://arcanea.ai/auth/callback`, enable Google + GitHub OAuth providers
2. Frank: 15 minutes -- Verify Stripe secret key is set on Vercel. If not, set it
3. Verify the full flow: Sign up -> OAuth -> Profile created -> Payment page -> Subscription created
4. If any step fails, fix it before doing anything else

**This unblocks**: Every revenue stream. Community accounts. Saved creations. Gate progression.

### Action 2: BUILD AND SHIP THE ORIGIN CLASS QUIZ (Highest-leverage single asset)

**Why**: Every strategy document identifies this as the top-of-funnel. It is the one asset that creates identity investment, generates social sharing, and converts visitors to accounts. Without it, there is no acquisition engine.

**Specific tasks**:
1. Build `/quiz` page with 10-12 questions mapping to 8 origin classes
2. Result page shows: origin class, tagline, visual, brief lore
3. Share card generation (one-click social image with class name and emblem)
4. Email capture gate AFTER showing result (not before)
5. Link result to account creation (Academy Enrollment lite)

**Constraint**: Ship the quiz in 5 days or less. It does not need to be perfect. It needs to exist.

### Action 3: SET UP MONITORING AND SHIP THE OPS CHECKLIST (See what is happening)

**Why**: You cannot improve what you cannot measure. Right now, if the site is broken for users, you do not know. If nobody is visiting, you do not know. The Ops Architecture "Immediate" checklist is 30 minutes of work that gives you eyes on the system.

**Specific tasks**:
1. Set Sentry DSN on Vercel (15 min)
2. Set PostHog key on Vercel (15 min)
3. Enable Vercel Analytics in dashboard (1 min)
4. Commit the Dependabot config (5 min)
5. Create `lighthouserc.json` at repo root (10 min)
6. Resolve the dual-deploy race condition (30 min)

**This unblocks**: Error visibility, user analytics, performance tracking, dependency management.

---

## CLOSING ASSESSMENT

The Arcanea strategy documents represent an extraordinary amount of creative and architectural thinking. The vision is coherent, the mythology is rich, and the technical architecture is sound. The franchise product architecture (one worldbuilding decision generating nine product types) is a genuinely novel insight.

The critical weakness is not vision -- it is velocity. The documents describe 18 months of execution as if it can happen in 90 days. The community architecture assumes a community. The revenue projections assume traffic. The agent marketplace assumes agent creators. Each assumption depends on the previous one being true first.

**The single most important strategic insight across all five documents is buried in the FRANCHISE_PRODUCTS.md "Solo Creator Reality Check"**: one person with AI tools can produce approximately 1 visual, 1 story, 1 soundtrack, 3-5 social posts, and 1 Codex page per week. Everything in the strategy must be measured against this production capacity.

**The single most important action is completing auth and payments.** Every day that passes without working auth is a day that no user can create an account, no creation can be saved, no subscription can be sold, and no community can form. This has been "15 minutes of Frank's time" for too long.

Strategy without execution is fiction. Execute the three actions above. Then reassess.

---

*"The Arc turns: Potential to Manifestation to Experience to Dissolution to Evolved Potential. The strategy documents are Potential. Shipping the quiz is Manifestation. Everything else follows."*
