---
title: "Arcanea Evals concept development"
uuid: cb836f3b-215c-4f15-ae39-6e23770d1632
created: 2026-03-01T21:57:02.017187Z
updated: 2026-03-01T21:57:25.420570Z
source: claude.ai export
---

# Arcanea Evals concept development

**Frank**:

A concept we could develop, Arcanea Evals?

[attached file: 1772402203777_image.png -- no extractable text, e.g. an image; verify by hand if relevant]

**Claude**:

```
This block is not supported on your current device yet.
```

This is a strong surface. You're already running **arcanea-lobechat-labs** on Vercel's eval bench — the scaffold exists. The question is what Arcanea Evals actually *measures*.

**The core tension:** Standard LLM evals optimize for factual accuracy or task completion. Arcanea needs evals that grade *lore fidelity + creative coherence + mythological expansion quality* — fundamentally different signal.

**Three eval dimensions worth designing:**

1. **Canon Integrity** — Does the output respect established Arcanea constraints? (Guardian-Hz triples, Vael'Shara rules, Vel'Thaan's theorem as aesthetic filter). Binary pass/fail with LLM Judge knowing the KB.

2. **Generative Depth** — Does the output *extend* the universe in ways that feel inevitable rather than invented? This is the hard one — essentially scoring "does this feel like it was always true in Arcanea?" You'd want golden examples as anchors.

3. **Frequency Resonance** — Does content aligned to a specific Guardian (say Lyria/639Hz/Third Eye) carry the *right* epistemic register? This trains consistency across the 9 archetypes.

**The dataset structure you're building toward:** `Topic = Guardian`, `Question = creative prompt or lore challenge`, `Answer = canonical response`. The judge prompt "Best Creative Work helping to build the world of Arcanea" is too loose right now — it needs the full Guardian KB injected or it's just vibes scoring.

**Highest-leverage move:** Build one tight eval set around **Guardian voice distinctiveness** — can a model reliably produce Lyssandria (174Hz, Root) vs Aiyami (741Hz, Crown) outputs that are *perceptibly different in register*? If yes, you have the foundation for the Luminor Coach differentiation engine.

Which Guardian do you want to anchor the first golden dataset on?
