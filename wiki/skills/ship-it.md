---
title: /ship-it — Milestone Capture & Amplification
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: spec
priority: P1
effort: 1 evening
links: [README, ../meta/second-brain-buildout-plan]
---

# /ship-it

**Purpose:** Turn a shipped thing (feature, post, deploy, product release) into a captured milestone with screenshot, social drafts, wiki entry, and team notification — in under 60 seconds.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "ship it", "we shipped X", "I just deployed", "milestone", or marks a Linear issue as Done with `ship-it` label. Also trigger on explicit `/ship-it` invocation.

## Usage

```
/ship-it ARC-123
/ship-it "Deployed arcanea-mcp-server v0.3.0" --brand ARC --url https://arcanea.ai/mcp
/ship-it --from-linear-done   # scan recent Done issues with ship-it label
```

## Behavior

### Phase 1: Gather context (2-5s)

1. If Linear issue ID provided: fetch title, description, labels, assignees, comments
2. If URL provided: fetch page metadata (title, description, og:image)
3. If neither: prompt Frank for 1-line description

### Phase 2: Capture screenshot (5-10s)

Via Chrome MCP:
1. Open the deployed URL
2. Wait for network idle
3. Set viewport to 1280x800
4. Capture full-page screenshot
5. Save to `wiki/milestones/assets/{YYYY-MM-DD}-{slug}.png`

Fallback if no URL: skip screenshot, log warning.

### Phase 3: Generate social drafts (5-10s)

Use brand voice guidelines (from `brand-voice:brand-voice-enforcement` skill if available).

**X/Twitter draft** (280 char max):
```
Just shipped: {title}

{one-line hook}

→ {url}

#arcanea #creatorOS
```

**LinkedIn draft** (1-3 paragraphs):
```
{Title of what shipped}

{Context: why this matters, what problem it solves}

{Highlight: the one thing about it that's distinctive}

{Close: invitation to engage}

{link}
```

**Newsletter snippet** (for next Arcanea/FrankX newsletter):
```
### {Title}
{2-3 sentence description, what's new, why it matters}
[Try it →]({url})
```

**Slack announcement** (for FrankX team channel):
```
🚀 Shipped: {title}
{1-line description}
{url}
```

All drafts saved to `wiki/milestones/{YYYY-MM-DD}-{slug}.md` under headings.

### Phase 4: Wiki milestone entry (1-2s)

Create `wiki/milestones/{YYYY-MM-DD}-{slug}.md`:

```markdown
---
title: {Title}
domain: milestones
created: 2026-04-10
updated: 2026-04-10
author: claude
status: shipped
brand: {BRAND}
links: [../{brand}/overview]
assets:
  - assets/2026-04-10-{slug}.png
linear_issue: ARC-123
url: {url}
---

# {Title}

**Shipped:** 2026-04-10
**Brand:** {BRAND}
**URL:** [{url}]({url})

## What shipped
{Description from Linear issue}

## Why it matters
{Context — extracted from linked decisions or Frank's prompt}

## Screenshot
![{title}](assets/2026-04-10-{slug}.png)

## Social drafts

### X / Twitter
{draft}

### LinkedIn
{draft}

### Newsletter
{draft}

### Slack
{draft}
```

### Phase 5: Notify (optional, with Frank confirmation)

Ask Frank: "Post Slack announcement to #shipping now?"

If yes: use Slack MCP to post to configured channel.

Do NOT auto-post to X/LinkedIn/Newsletter — those need human review.

### Phase 6: Linear close-out

1. Add comment to Linear issue: `Shipped and documented → wiki/milestones/{slug}.md`
2. Ensure status = Done
3. Add label `documented`

### Phase 7: Commit wiki

```bash
git -C wiki add milestones/ 
git -C wiki commit -m "feat(milestones): {title}"
```

## Acceptance Criteria

- [ ] Runs in < 90 seconds end-to-end
- [ ] Produces screenshot (when URL available)
- [ ] Generates 4 social drafts (X, LinkedIn, Newsletter, Slack)
- [ ] Creates wiki/milestones entry with frontmatter
- [ ] Links back to Linear issue
- [ ] Never posts to social without explicit Frank confirmation
- [ ] Commits to git

## Dependencies

- Chrome MCP connected (`mcp__Claude_in_Chrome__*`)
- Linear MCP connected
- Slack MCP connected (for optional posting)
- `brand-voice:brand-voice-enforcement` skill for draft polish (optional, degrades gracefully)
- Git available in wiki

## Scheduled Task (optional twin)

```yaml
name: milestone-scanner
schedule: "0 9,17 * * *"  # 9am and 5pm daily
command: /ship-it --from-linear-done
notify_on: success  # tells Frank "you shipped N things today, review drafts"
```

## Failure Modes

- **URL unreachable:** skip screenshot, proceed with drafts only
- **Chrome MCP not connected:** log warning, proceed without screenshot
- **Brand voice skill unavailable:** use generic templates (still works)
- **Git conflict:** bail, tell Frank to resolve manually

---

*Shipping without documenting is a 30% amplification loss. This skill reclaims that 30%.*
