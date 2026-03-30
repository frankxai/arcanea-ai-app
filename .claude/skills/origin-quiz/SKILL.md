---
name: origin-quiz
description: Discover your Arcanean origin class through an interactive personality quiz
gate: sight
guardian: Lyria
version: 1.0.0
---

# Origin Quiz — What's Your Origin Class?

## What This Skill Does
Interactive personality quiz that determines which of the 8 Arcanean origin classes best fits the user. The single highest-leverage acquisition tool in the franchise.

## When to Use
- New user onboarding
- Social media engagement
- Content creation (shareable results)
- Community events

## The 8 Questions

**Q1: How did your greatest strength first appear?**
A) Through years of study and practice → Arcan
B) In a moment of crisis, without warning → Gate-Touched
C) Through deep analysis and pattern recognition → Awakened
D) Someone built it into you (mentors, training, systems) → Synth
E) Through a bond with something/someone else → Bonded
F) You've always had it — it feels older than you → Celestial
G) Through pain, loss, or darkness → Voidtouched
H) By seeing how things REALLY work underneath → Architect

**Q2: When facing an impossible problem, you...**
A) Research, plan, apply proven methods → Arcan
B) Act on instinct — your body knows before your mind → Gate-Touched
C) Process all available data, find the pattern → Awakened
D) Optimize the system, remove inefficiency → Synth
E) Ask: who can I work with on this? → Bonded
F) Trust that the answer will come — it always does → Celestial
G) Push through the darkness — you've survived worse → Voidtouched
H) Change the rules of the problem itself → Architect

**Q3: What do others notice about you first?**
A) Your knowledge and composure → Arcan
B) Your intensity and unpredictability → Gate-Touched
C) Your precision and insight → Awakened
D) Your reliability and beauty of execution → Synth
E) Your loyalty and the bond you share with others → Bonded
F) Something they can't quite name — you feel different → Celestial
G) Your edge — something about you is slightly unsettling → Voidtouched
H) Your calm — you seem to know something everyone else doesn't → Architect

**Q4-Q8:** [Continue with questions about: what you fear most, what you create, how you lead, what you'd sacrifice for, what power means to you]

## Scoring
Each answer adds +3 to one origin class. Secondary answers add +1 to adjacent classes. Final tally determines primary origin, with secondary shown.

## Result Format

```
YOUR ORIGIN CLASS: [CLASS NAME]

[2-3 sentence description of the class]

Famous [Class] in Arcanea:
- [Character 1] — [one-line description]
- [Character 2] — [one-line description]

Your power source: [Power Source]
Your natural Gate: [Gate Name]
Your Guardian: [Guardian Name]

"[Thematic quote from the origin class]"

Share your result: "I'm a [Class] in Arcanea. [Tagline]"
```

## Implementation Notes
- This should also become an interactive page at `/quiz` on arcanea.ai
- Results should be shareable (generate OG image with result)
- Quiz completion → account creation prompt
- Store result in user profile if logged in

## Canon References
- Origin classes: `.arcanea/lore/FACTIONS.md`
- Power sources and Gates: `.arcanea/lore/CANON_LOCKED.md`
