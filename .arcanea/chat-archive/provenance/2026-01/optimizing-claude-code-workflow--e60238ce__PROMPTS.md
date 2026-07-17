# Frank's prompts -- Optimizing Claude Code workflow

Source uuid: e60238ce-5c74-427b-8e4e-65ec4f834626
Created: 2026-01-12T12:11:43.385468Z

Verbatim, chronological.

## Turn 0

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

## Turn 2

Okay I didnt do this yet will do soon, first write me a guide how to use Claude CLI, When to use VS Code Extension, usually i like just terminal if okay but sometimes need VS Code i guess, but have bunch of claude skill.md and agent.md files and not sure from VS Code they can be triggered or when we use Calude Code Cloud agents directly on the repo, or when to use from slack, or when to use new coworker
