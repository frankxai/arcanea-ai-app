---
title: Counter-Coach Rule Echo
aliases: [adversarial prompt testing, echo chamber defense, prompt veto]
tags: [atom, prompts, growth]
status: stable
domain: prompts
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/prompt-as-graph]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Counter-Coach Rule Echo

For every upgrade prompt, generate the adversarial opposite prompt and compare outputs before shipping.

Most people test prompts by asking: "Is the output good?" This is confirmation bias baked in. A better test: "What's the most defensible objection to this output?" Then ask a Counter-Coach role to generate the opposite answer, and compare.

The pattern:

1. You write a prompt upgrade: "Generate next quarter's roadmap using these constraints..."
2. You test it on 3-5 examples and like the outputs.
3. **STOP.** Generate the opposite prompt: "What are the 5 strongest reasons *not* to build this roadmap?"
4. Feed the same inputs to both prompts.
5. Compare outputs. Where do they diverge? Those divergences are your blind spots.
6. Ask yourself: which view is more truthful? The upgrade, the opposite, or a blend?
7. Only then ship.

Frank's practice (Prompt OS): every Council upgrade runs through Counter-Coach (the 6th role) *before* the outputs go to decision-makers. The Strategist generates a direction; the Counter-Coach generates the anti-direction. Both are cached. When Frank reads them, he sees the full surface.

The veto: if Counter-Coach generates something that the Strategist can't coherently refute, the upgrade doesn't ship. The prompt is immature.

This is why the Counter-Coach is not optional. It's the error-correction layer. Without it, you're shipping prompts that your own system hasn't challenged.

## Related
- [[../concepts/prompt-as-graph]] — the structure it tests
- [[../../00-MOCs/MOC-Patterns]] — quality assurance
