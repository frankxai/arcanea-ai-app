# OpenAI / Codex Image Limit Notes

Date checked: 2026-06-26

## Official Findings

Sources checked:

- Codex pricing: https://developers.openai.com/codex/pricing
- ChatGPT Pro plan help: https://help.openai.com/en/articles/9793128-about-chatgpt-pro-plans
- OpenAI image generation API guide: https://developers.openai.com/api/docs/guides/image-generation

Key facts:

- Codex CLI version checked locally: `codex-cli 0.139.0`.
- `codex --help` and `codex exec --help` do not expose a command that prints remaining image quota.
- The official Codex pricing page lists Pro tiers. The 20x Pro tier is the closest official match to the user's EUR 200/month "Max" phrasing.
- Codex image generation uses the included Codex limits about 3-5x faster than a similar non-image turn, according to the Codex pricing page.
- Official docs do not publish a stable "images per hour" number for this Codex app image tool.
- API fallback is a different budget surface: it uses the OpenAI Platform project, organization limits, and billable API pricing rather than the ChatGPT/Codex subscription path.

## Practical Interpretation

Do not promise a fixed quota such as "100 images per hour" unless the current UI shows it.

Use this policy instead:

1. Generate in small batches of 4.
2. Record timestamps, source paths, prompts, scores, and verdicts.
3. Check Codex `/status` or the visible usage dashboard between batches when possible.
4. Back off when rate-limit warnings, slowdowns, failed generations, or quality drops appear.
5. Prefer fewer better images over raw volume when the output is for brand canon.

## Current Local Throughput

Current measured report: `THROUGHPUT.md`.

This run produced 34 tracked images.

Observed active generation windows from file timestamps:

| Batch | Images | Source timestamp window | Active min | Observed rate |
| --- | ---: | --- | ---: | ---: |
| batch-000 | 4 | 03:50:41-03:58:15 | 8 | 30/hr |
| batch-001 | 4 | 04:12:48-04:17:05 | 4 | 60/hr |
| batch-002 | 4 | 04:32:26-04:38:46 | 6 | 40/hr |
| batch-003 | 4 | 13:46:01-13:50:35 | 5 | 48/hr |
| batch-004 | 4 | 13:52:57-13:58:54 | 6 | 40/hr |
| batch-005 | 2 | 14:01:32-14:03:06 | 2 | 60/hr |
| batch-006 | 4 | 16:52:06-16:57:47 | 6 | 40/hr |
| batch-007 | 4 | 21:24:31-21:28:21 | 4 | 60/hr |
| batch-008 | 4 | 21:35:48-21:43:10 | 7 | 34.3/hr |

Weighted active rate: 34 images / 49 active minutes = about 41.6 images/hour.

This is throughput evidence, not quota evidence. A safe operating cadence for quality work is 4 images every 10-15 minutes for generation, plus separate review/scoring time, until the visible usage surface says otherwise.

## Target 100 Images

For a target of 100 high-quality Arcanea images:

- Fast draft mode at observed speed: about 95 active generation minutes remain for 66 more images, but quality review will lag.
- Quality-gated mode: 8-10 hours is more realistic because every 4-image batch needs prompt refinement, inspection, scoring, and queue planning.
- Recommended cadence: 20-24 images/hour maximum for unattended prep loops; 8-16 images/hour for real art-direction loops.

## Automation Boundary

The current Codex tool discovery did not expose an `automation_update` tool in this thread. The Codex manual says app automations exist, but actual creation requires the app automation tool to be available in-session or configured through the Codex app UI.

Until that tool is available, this run uses local scripts and docs to prepare an automation-ready loop rather than pretending a background image generator has been scheduled.
