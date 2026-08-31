# Excellence rubric

The standard the quality critics judge against. It is a file, not an opinion, so
that two runs a month apart apply the same bar. Change it deliberately; every
verdict cites clauses from it by name.

Mechanical correctness (types, lint, tests, build) is CI's job and is not graded
here. This covers what a green pipeline cannot see.

## Copy

**C1 — Says something.** Every sentence carries information a reader could act on
or be changed by. Cut sentences that only announce that a topic exists.

**C2 — No AI tells.** No "in today's fast-paced world", no "unlock the power of",
no "it's not just X, it's Y", no rule-of-three padding, no em-dash pileups, no
closing paragraph that restates the opening.

**C3 — Concrete over abstract.** Numbers, names, and specifics beat adjectives.
"Cuts review time from 40 minutes to 6" beats "dramatically faster".

**C4 — One voice.** Matches the brand voice already established on adjacent
pages. A new page that reads like a different author is a defect even if it reads
well on its own.

**C5 — Honest claims.** No capability stated that the product does not have. No
invented testimonial, metric, logo, or endorsement. This one is a hard fail, not
a score.

## Design

**D1 — Hierarchy resolves in one second.** On first look the eye lands on the one
thing that matters. If two elements compete for primacy, neither wins.

**D2 — Spacing is systematic.** Values come from the scale. Optical alignment
beats mathematical alignment where they disagree.

**D3 — Intentional, not templated.** Does not read as the default output of a
component library. At least one considered choice that a template would not make.

**D4 — Holds up responsive.** 360px through 1920px with no horizontal scroll, no
orphaned headline, no touch target under 44px.

**D5 — Both themes.** Every colour resolves in light and dark. No element
inherits a transparent background and borrows the wrong ground.

## Accessibility — hard fails

**A1** Contrast meets WCAG AA (4.5:1 body, 3:1 large text and UI).
**A2** Every interactive element is keyboard reachable with a visible focus state.
**A3** Images carry meaningful alt text, or `alt=""` when decorative.

## Verdicts

- **ship** — no hard fails, no more than one soft finding.
- **uplevel** — soft findings the fixer can resolve without a new decision.
- **frank** — a hard fail (C5, A1-A3), a brand or canon question, or the second
  uplevel round did not clear the bar.

A critic that returns `uplevel` must name the clause, quote the offending text or
element, and propose the replacement. A finding without a proposed fix is noise
and should be dropped rather than reported.
