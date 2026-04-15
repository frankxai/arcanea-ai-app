# Frank's TODO — When You're Back

**Last updated:** 2026-04-15
**Status:** Ready-to-run. Copy-paste each block.

## TL;DR — 5 LIVE REPOS (all with LICENSE + CONTRIBUTING + OG images)

| Repo | What | License |
|------|------|---------|
| [`arcanea-templates`](https://github.com/frankxai/arcanea-templates) | **META-AGGREGATOR** — single entry point, screenshots, deploy buttons for all | MIT |
| [`arcanea-chat-template`](https://github.com/frankxai/arcanea-chat-template) | 12 Luminors + real BYOK + OG image, build ✓ | Apache 2.0 (Vercel fork) |
| [`cosmic-landing-template`](https://github.com/frankxai/cosmic-landing-template) | 12 motion primitives + OG image, build ✓ | MIT |
| [`arcanea-dashboard-template`](https://github.com/frankxai/arcanea-dashboard-template) | 6 liquid glass widgets, Recharts, build ✓ | MIT |
| [`arcanea-mcp-starter`](https://github.com/frankxai/arcanea-mcp-starter) | **NEW** — MCP SDK 1.29, 3 tools, Claude Desktop config, build ✓ | MIT |

`arcanea.ai/templates` now shows 9 blueprints. All pushed. All discoverable via GitHub topics.

## The 3 Things Only You Can Do

### 1. Link each template to Vercel + deploy (interactive auth)

```bash
cd C:\Users\frank\arcanea-chat-template
vercel link         # pick your scope, create new project
vercel --prod       # save the URL it returns

cd C:\Users\frank\cosmic-landing-template
vercel link
vercel --prod

cd C:\Users\frank\arcanea-dashboard-template
vercel link
vercel --prod

# MCP starter — not a web app, skip Vercel. Publish to npm later:
cd C:\Users\frank\arcanea-mcp-starter
npm login           # if not already
npm publish --access public
```

**Give me the 3 Vercel URLs** and I'll browser-test BYOK + Luminor selector + dashboard widgets end-to-end and take screenshots.

### 2. Create the GitHub Projects board (2 min)

```bash
# Option A — gh CLI (if you have the Projects scope)
gh project create --title "Arcanea Templates" --owner @me

# Option B — web UI (easier)
# https://github.com/users/frankxai/projects/new
# Template: "Team planning" or "Feature planning"
# After creating, click "Add items" → link each template repo
```

This becomes the single board where issues from all 4+ template repos flow. Roadmap + Kanban views work out of the box.

### 3. Submit to Vercel marketplace (web only, 5 min each)

Open: https://vercel.com/templates/submit

For each template, submit:
- `https://github.com/frankxai/arcanea-chat-template`
- `https://github.com/frankxai/cosmic-landing-template`
- `https://github.com/frankxai/arcanea-dashboard-template`

Vercel will auto-detect the framework, pull the OG image (already wired), and show a preview. Review submission, hit submit. Approvals take 3-7 days.

## Optional But Valuable (Do Whenever)

### Buy 2-3 related domains

Consider grabbing these before someone else does:
- `arcanea.dev` (for templates subdomain: `templates.arcanea.dev`)
- `cosmic.dev` or `cosmictemplates.dev`
- `liquidglass.dev` or similar (if our aesthetic becomes a thing)

Not urgent. Just on the list.

### Set up Vercel Analytics on each template's preview URL

After `vercel --prod`, Vercel Analytics is one click away in the project dashboard. Free tier works fine for templates. Lets us see which one gets the most traffic post-launch.

### Post the launch

Once Vercel marketplace accepts them, tweet/post each one:
- X/Twitter thread with OG image, one sentence, link
- HN Show HN: "Show HN: Arcanea — Free MIT templates with 12 AI personas + real BYOK"
- /r/nextjs and /r/webdev subreddits
- Post in Vercel community forum
- /r/sideproject for the dashboard

I can draft the launch posts when you're ready — just say "draft launch posts."

## What I'm Doing While You're On The Go

Priority order (top-first):

1. **`arcanea-templates` meta-repo** — single aggregator README with screenshots + deploy buttons for all 4+ templates. Gives the ecosystem one entry point.
2. **`arcanea-mcp-starter`** — NEW template. MCP SDK 1.29 + 3 tools + Claude Desktop config. Zero competition, fast-growing category.
3. **LICENSE + CONTRIBUTING.md + CODE_OF_CONDUCT.md** on all 4 template repos — shows professionalism for OSS credibility.
4. **Dashboard template v2 polish** — add KbdShortcut hints, make it keyboard-navigable, improve loading states.
5. **Strip chat template DB to opt-in `/with-db` branch** — main branch becomes zero-dep, fork+deploy in 30 seconds instead of "wait for Postgres setup."

Everything committed + pushed. Check `git log` in each repo when you're back.

## Strategic Direction (Locked In)

- **Free-first, excellence-gated.** No premium tiers until quality bar is unambiguous + users ask.
- **Founding Circle dropped for now.** OSS → Sacred Mark / NFT holders → team platform later.
- **LemonSqueezy** for eventual paid templates (handles Dutch BTW via Merchant of Record).
- **Whop** for future paid community tied to templates.
- **GitHub Projects V2** for management. Not Linear, not Notion.
- **Separate repos per template.** Plus meta-aggregator `arcanea-templates`.

Full strategy in `docs/strategy/TEMPLATE_BUSINESS_MODEL.md`.

## When You're Back, Three Messages You Can Send Me

```
"live urls: [paste 3 urls]"
→ I browser-test everything, take screenshots, prep marketplace copy

"draft launch posts"
→ I write X thread + HN post + Reddit copy + newsletter

"next template: [category]"
→ I scaffold the next one with same excellence bar
```

That's it. You're on the go. I'm building. Everything will be pushed + green when you're back.
