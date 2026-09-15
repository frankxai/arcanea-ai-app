---
title: "Optimizing Claude Code workflow"
uuid: e60238ce-5c74-427b-8e4e-65ec4f834626
created: 2026-01-12T12:11:43.385468Z
updated: 2026-01-15T12:46:18.078434Z
source: claude.ai export
---

# Optimizing Claude Code workflow

**Frank**:

Am I following this workflow in the best sense or what do I need to optimize? Check all our chats. 

amn — the founder of Claude Code just dropped his entire workflow.
His 13-step system is worth trying: 
1/ Parallel Terminal Sessions 
He runs 5 Claudes simultaneously in his terminal. Tabs numbered 1-5. System notifications alert him when any Claude needs input. While one waits, he's working with another.
2/ Web + Mobile Parallelization 
On top of local sessions, he runs 5-10 more Claudes on claude .ai/code. He hands off local sessions to web using &, teleports back and forth with --teleport, and even kicks off sessions from his phone each morning to check in later.
3/ Model Choice: Opus 4.5 with Thinking Always
Yes, it's bigger and slower than Sonnet. But you steer it less and it handles tools better — making it faster in practice. Less babysitting, more shipping.
4/ Shared CLAUDE md 
The entire team shares a single CLAUDE md file, checked into git. Every time Claude does something wrong, they document it. Claude learns from collective mistakes. Compounding knowledge.
5/ GitHub Integration with @claude 
During code review, he tags @claude on PRs to update CLAUDE. md automatically. Uses the Claude Code GitHub action (/install-github-action). Their version of Compounding Engineering.
6/ Plan Mode First Most sessions start in Plan mode (shift+tab twice). 
He iterates back and forth until the plan is solid. Then switches to auto-accept edits mode and Claude usually one-shots the execution. A good plan is everything.
7/ Slash Commands for Inner Loops 
Every workflow he repeats multiple times a day becomes a slash command. Checked into git at .claude/commands/. His /commit-push-pr runs dozens of times daily. Saves prompting. Claude can use them too.
8/ Subagents for Common Workflows 
He uses dedicated subagents: code-simplifier cleans up after Claude finishes, verify-app has detailed testing instructions, code-architect for design decisions. Stored in .claude/agents/. Automation for the 80% of PR work.
9/ PostToolUse Hooks for Formatting 
A hook auto-formats Claude's code after every edit. Claude usually gets it 90% right — the hook catches the last 10% before CI complains later.
10/ Smart Permissions (Not --dangerously-skip-permissions) 
Instead of skipping all permissions, he uses /permissions to pre-allow specific safe commands. Checked into .claude/settings. json and shared with the team. Security without friction.
11/ MCP Tools Integration   Claude Code uses all his tools: searches and posts to Slack via MCP server, runs BigQuery queries for analytics, grabs Sentry error logs. Config lives in .mcp.json, shared across the team.  12/ Long-Running Task Management   For marathon sessions, he either: (a) prompts Claude to self-verify with a background agent when done, (b) uses an agent Stop hook, or (c) uses the ralph-wiggum plugin. In sandboxes, he'll use --permission-mode=dontAsk so Claude can cook uninterrupted.  13/ The 2-3x Multiplier: Verification   This is the big one. Give Claude a way to verify its own work. Claude tests every change using the Chrome extension — opens a browser, tests the UI, iterates until it works. Could be a bash command, test suite, or phone simulator. Invest in making this rock-solid.

[attached file: 1768219830337_image.png -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me check your Notion workspace for current project status and compare against the workflow framework:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now I have full context. Let me analyze the workflow from the image against your actual practice:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

---

# 🎯 FrankX Commander - Claude Code Workflow Analysis

Frank, I've analyzed your entire chat history against amn's 13-step workflow. Here's the honest assessment:

---

## 📊 YOUR SCORE: 5.5 / 13

| Best Practice | Your Status | Gap |
|---------------|-------------|-----|
| **1. Parallel Sessions** | 🟡 Partial | No numbered tabs, no notifications |
| **2. Web + Mobile** | 🟡 Partial | Not using `--teleport` or mobile kickoffs |
| **3. Opus 4.5 + Thinking** | ✅ Good | Already using |
| **4. Shared CLAUDE.md** | 🟡 Partial | No mistake documentation, not shared across repos |
| **5. GitHub @claude** | 🟡 Partial | No PR tagging, no GH Action installed |
| **6. Plan Mode First** | ✅ Good | You plan well (maybe too much) |
| **7. Slash Commands** | 🔴 Weak | No `/commit-push-pr`, typing full prompts |
| **8. Subagents** | ✅ Excellent | 37 agents, but creative not operational |
| **9. PostToolUse Hooks** | 🔴 Missing | ESLint errors in sessions, no auto-format |
| **10. Smart Permissions** | 🔴 Missing | Manual confirmations wasting time |
| **11. MCP Integration** | ✅ Good | 8 servers, but config split issues |
| **12. Long-Running Tasks** | 🔴 Missing | No self-verify, no notifications |
| **13. VERIFICATION LOOP** | 🔴 **CRITICAL** | **This is your killer** |

---

## 🚨 THE BRUTAL TRUTH

### Your Pattern:
```
BUILD → PERFECT → BUILD MORE → PERFECT MORE → NEVER SHIP
```

### amn's Pattern:
```
PLAN → BUILD → VERIFY → SHIP → LEARN → IMPROVE → REPEAT
```

### The Missing Link: **VERIFICATION**

amn says: *"Give Claude a way to verify its own work. Invest in making this rock-solid."*

**You have:**
- ❌ No automated tests
- ❌ No smoke tests
- ❌ No Lighthouse CI
- ❌ No visual regression tests
- ❌ No post-deploy verification

**Result:**
- You build beautiful code (200,000+ lines)
- You're afraid to deploy (because no verification = unknown state)
- Code sits in branches forever
- Zero products generating revenue

---

## 🎯 YOUR 3 HIGHEST-LEVERAGE FIXES

### Fix #1: Create Verification Command (TODAY - 30 min)
```markdown
# Create: .claude/commands/verify-deploy.md

Claude will:
1. npm run build (must pass)
2. Run Playwright smoke test
3. Deploy to Vercel if tests pass
4. curl live URL to confirm
5. Report success/failure
```

### Fix #2: Create Slash Commands (TODAY - 15 min)
```bash
# .claude/commands/commit-push-pr.md
# Replaces typing "commit this, push, make PR" every time
# amn uses this dozens of times daily - you should too
```

### Fix #3: Setup PostToolUse Hook (THIS WEEK - 1 hr)
```json
// Every file edit → auto-format
{
  "postToolUse": [{
    "trigger": "file_write",
    "action": "eslint --fix && prettier --write"
  }]
}
```

---

## 💡 KEY INSIGHT FROM YOUR SESSIONS

From your Jan 9 Notion status report:
> *"Production Deploys: 🔴 3/10"*
> *"All the excellent work sits in a feature branch. Estimated fix time: 15 minutes."*

**amn's workflow prevents this because:**
1. Verification happens automatically
2. If tests pass → deploy happens
3. No manual step to forget

**Your workflow allows this because:**
1. No verification = fear of breaking things
2. Fear = "I'll deploy tomorrow"
3. Tomorrow becomes never

---

## 🚀 YOUR NEXT CLAUDE CODE SESSION PROMPT

```markdown
# SESSION: Setup Verification Loop

## Goal
Create the verification system that lets me ship with confidence.

## Tasks
1. Create Playwright config in frankx-ai repo
2. Write smoke test: homepage loads, key elements visible
3. Create .claude/commands/verify-deploy.md
4. Test the full loop: build → test → deploy → verify live URL

## Success Criteria
After this session, I can run:
/verify-deploy

And Claude will automatically verify and ship.

## DO NOT
- Start new features
- Optimize existing code  
- Plan new projects

## ONLY
- Verification infrastructure
- Deploy the code that's ready
```

---

## 📈 IF YOU FIX VERIFICATION:

| Current State | With Verification |
|---------------|-------------------|
| Code sits in branches | Code ships when ready |
| Manual deploy fear | Automated confidence |
| "I'll do it tomorrow" | "It's already done" |
| 200K lines, €0 revenue | Live products, real users |

---

**The document with full analysis is attached.** Read it, then open Claude Code and build your verification loop.

That's the one thing that will 2-3x your output *today*.

**Frank**:

Okay I didnt do this yet will do soon, first write me a guide how to use Claude CLI, When to use VS Code Extension, usually i like just terminal if okay but sometimes need VS Code i guess, but have bunch of claude skill.md and agent.md files and not sure from VS Code they can be triggered or when we use Calude Code Cloud agents directly on the repo, or when to use from slack, or when to use new coworker

**Claude**:

```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Now let me create a comprehensive guide for you:
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

---

# 🎯 Complete Guide: Claude Code Ecosystem

Frank, here's your definitive guide. Let me give you the quick summary:

---

## 📊 TL;DR - When to Use What

| Interface | Best For | Your Skills/Agents Work? |
|-----------|----------|--------------------------|
| **CLI (Terminal)** | Deep work, parallel sessions, context rewind | ✅ YES |
| **VS Code Extension** | Visual diffs, @-mentions, beginners | ✅ YES |
| **GitHub @claude** | Async PR review, team workflows | ✅ Via CLAUDE.md |
| **Slack** | Mobile kickoff, async tasks | ❌ Different scope |
| **Coworker Mode** | Long-running background work | ✅ YES |

---

## 🔑 Key Insights for You

### 1. **Stick with CLI (Terminal)** - You're Right!
CLI excels at context control through message editing that rewinds both conversation and code state, plus keyboard-driven workflows that eliminate mouse dependency.

**CLI-Only Features:**
- **Context Rewind** (double-ESC) - Unavailable in VS Code
- **--dangerously-skip-permissions** - Unavailable in VS Code
- **Better performance** - Lightweight process

### 2. **Your Skills/Agents WORK in VS Code**
Claude Code settings (~/.claude/settings.json): These settings are shared between the VS Code extension and the CLI. Use this file for allowed commands and directories, environment variables, hooks, and MCP servers.

Skills load from:
```
Project: .claude/skills/  ← Your 96+ skills
Global: ~/.claude/skills/
```

They trigger the same way - by description keywords or explicit `/skill name`.

### 3. **GitHub @claude = Async Superpower**
With a simple @claude mention in any PR or issue, Claude can analyze your code, create pull requests, implement features, and fix bugs - all while following your project's standards.

Setup in 30 seconds:
```bash
# In Claude Code terminal:
/install-github-app
```

Then in any PR: `@claude review this PR`

### 4. **Coworker Mode for Long Tasks**
When Claude needs to work 30+ minutes unattended:
```bash
claude --permission-mode=dontAsk
# Claude works until done without interrupting you
```

---

## 🎯 Your Optimal Daily Flow

```
MORNING (Mobile/Slack)
├─ Quick task kickoff: "Research X while I commute"

WORK SESSION (CLI - Terminal)
├─ Tab 1: frankx-ai
├─ Tab 2: arcanea  
├─ Tab 3: ai-architect-academy
├─ Switch as each waits for you
├─ /ship when ready to deploy

PR REVIEW (GitHub @claude - Async)
├─ @claude reviews your PRs automatically
├─ Updates CLAUDE.md with learnings
├─ You approve/reject suggestions

LONG TASKS (Coworker Mode)
├─ "Refactor entire test suite"
├─ Get notified when done
```

---

## ⚡ Your 3 Immediate Actions

### Action 1: Create Your First Command (5 min)
```bash
mkdir -p ~/.claude/commands
# Create: ~/.claude/commands/ship.md
```

### Action 2: Install GitHub Action (30 sec)
```bash
# In Claude Code:
/install-github-app
```

### Action 3: Setup PostToolUse Hook (10 min)
Add auto-formatting so code is always clean:
```json
// ~/.claude/settings.json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "eslint --fix $FILE && prettier --write $FILE"
      }]
    }]
  }
}
```

---

**The full guide (attached) covers:**
- All 5 interfaces in detail
- Skill/Agent formats and trigger patterns
- Slash command creation
- MCP server configuration
- Your recommended directory structure

**Bottom Line:** Terminal CLI is your main driver. VS Code only when you need visual diffs. GitHub @claude for async PR work. Your skills/agents work everywhere.
