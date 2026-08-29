# Arcanea cinematic reader page spec

**Status:** Working specification
**Canonical route family:** `/books/[bookSlug]`
**Preview route:** `/books/[bookSlug]/read/[chapterSlug]`
**Owner:** Arcanea cinematic book initiative
**Design authority:** `TASTE.md`, then `DESIGN.md`, then `@arcanea/design-system`

## Product sentence

A premium, quiet web reader that lets a visitor experience a complete cinematic opening for free, understand exactly what the paid edition contains, and continue reading after a server-verified one-time purchase without losing place or trust.

## Primary reader

An adult/crossover fantasy reader, approximately 24–40, who wants emotional intelligence, mythic scale, serious magic training, and beautiful art without juvenile UI, generic fantasy marketing, or AI-production spectacle.

## Reader jobs

1. Decide in ten seconds whether the story is for me.
2. Start reading without creating an account or confronting a checkout.
3. Read comfortably on a phone with one hand.
4. Know where I am, what is free, what is paid, and whether my progress is private.
5. Buy once, return on another device, and continue from the same place.
6. See art and world context without losing the story.
7. Explore how the edition was made only when I choose.

## Success outcomes

- The first viewport shows a real story artifact: title, one precise promise, edition status, and “Read the opening.”
- A visitor can reach prose in one action.
- The free movement is substantial enough to judge voice and character, not a marketing excerpt.
- The paid boundary explains the edition before requesting payment.
- A buyer never has to paste an order ID or depend on a browser cookie to regain access.
- Reduced-motion and no-JavaScript reading remain complete and comprehensible.

## Information architecture

### Library

`/books`

- Curated published/preview-ready editions first.
- Development archives and bibles do not masquerade as finished books.
- Each card states one honest status: Preview, Complete, In revision, or Archive.
- No unsupported aggregate word-count or publication-success claim.

### Edition landing

`/books/[bookSlug]`

1. Story-first hero.
2. Read free opening.
3. Edition contents and status.
4. Character triad.
5. One cinematic proof sequence.
6. Reader promise and content note.
7. Purchase block or “Continue reading” state.
8. Optional Creator's Ledger preview.
9. Exit ramp to the Arcanea story/library.

### Reader

`/books/[bookSlug]/read/[chapterSlug]`

- Chapter title, location/time when narratively useful, reading progress.
- Prose column.
- Previous/next chapter controls.
- Table of contents and reading settings.
- Optional art plate/world note attached to a paragraph or act boundary.
- Paid boundary after the complete Chapter 4 convergence scene.
- The boundary previews the next chapter title, “Terms of measurement,” and one spoiler-safe sentence naming the immediate threat before presenting the edition invitation.
- Account/access recovery state.

### Creator's Ledger

`/books/[bookSlug]/ledger`

- Separate from the prose route.
- Story spoilers grouped by act and hidden by default.
- Human direction, tools/models/skills, final safe prompts, sources, rights, and verification.
- No raw chain-of-thought, hidden prompts, private data, or production secrets.

## Edition landing: viewport and sequence

### First viewport

Required:

- Arcanea mark in restrained navigation.
- Eyebrow in sentence case: “A Chronicles of Arcanea novel.”
- Working title and one-line story promise.
- Honest status, estimated reading length only after manuscript proof, and edition type.
- Primary action: “Read the opening.”
- Secondary action: “See the cinematic edition.”
- Cover or a single approved cinematic key art with readable art direction at 375 px.

Forbidden:

- all-caps labels or `text-transform: uppercase`;
- decorative portal/lore grid before the story action;
- autoplay video/audio;
- generic fantasy tagline;
- “AI-powered,” model logos, prompt counts, or process claims above the fold;
- fake ratings, student outcomes, awards, bestseller status, scarcity, or countdowns.

### Story proof

- 350–600 words from the final opening, not placeholder copy.
- One reader-controlled transition into Chapter 1.
- Art supports place or consequence; it never duplicates the text literally.

### Character triad

- Arion: responsibility can become self-erasure.
- Mera: truth can violate as easily as silence.
- Emilia: systems can liberate or quietly remove choice.
- Each receives a verb, a pressure, and a distinctive owned object—not a class label or power-stat card.

### Cinematic edition proof

- Cover.
- 3 inspected sample plates.
- A concise list of paid contents.
- A labeled sample from the Creator's Ledger.
- No promise of an art count or downloadable format until those assets pass.

### Purchase state

Logged out:

- Explain one-time access and what account continuity is for.
- “Sign in to continue to secure checkout.”
- Preserve the return URL and reading position.

Signed in, not entitled:

- Show final price inclusive/exclusive of tax according to Polar checkout behavior; do not invent tax copy.
- “Buy the cinematic edition.”
- Open embedded/hosted checkout through a server-created session.

Entitled:

- Replace sales CTA with “Continue reading.”
- Show the last confirmed chapter and progress.
- Provide links to downloads and ledger only when those benefits exist.

Pending/reconciling:

- “Confirming your edition access.”
- Offer a retry/reconcile action and support path.
- Never imply access is lost while a verified order is being reconciled.

Refunded/revoked:

- Explain state in plain language.
- Preserve reading progress and account history.
- Do not expose payment details or shame the user.

## Reader layout

### Mobile, 320–479 px

- Single prose column, 18–20 px reader font, user-adjustable within bounded presets.
- Target line length: 38–55 characters.
- Sticky controls only when they do not cover prose; hide on downward reading motion and return on intent.
- Bottom-sheet table of contents and settings with focus trapping and a clear close action.
- Art uses deliberate portrait/landscape crops and captions; no sideways scrolling.
- Safe-area insets for controls.

### Tablet, 480–899 px

- Single prose column with expanded margins.
- Optional compact chapter rail when space allows without reducing line comfort.
- Art may break the column at act boundaries.

### Desktop, 900 px and above

- Prose remains approximately 65–75 characters per line.
- Left rail: chapter navigation/progress.
- Right margin: optional world note, art detail, or ledger marker; never both at once.
- Full-bleed art belongs between reading movements, not behind body text.
- Desktop adds context and cinematic scale, not a denser prose column.

## Reading settings

- Font size: small, standard, large, extra large.
- Line height: compact, standard, spacious.
- Theme: night, ink, parchment only if all meet contrast and brand gates.
- Reduced motion follows OS setting; no separate motion toggle required unless research proves value.
- Progress sync is opt-in through account use and described in plain language.
- Settings persist locally; signed-in sync may be added only with a documented data contract.

## Flagship interaction

One “story layers” control appears only at approved story anchors:

- Story: uninterrupted prose.
- World note: canon-safe context with no future spoiler.
- Making of: buyer-only creation note with final prompt/provenance.

Changing layers preserves scroll position, highlights the anchor, works by keyboard, and exposes the same content statically when JavaScript is unavailable. The control is absent from ordinary paragraphs.

## Motion and sound

- One choreographed landing-page set-piece may show the three character paths converging at the Academy.
- It must demonstrate relationship and custody pressure, not decorate the hero.
- Static composition communicates the full idea under reduced motion.
- Reader route motion is limited to route continuity, control state, and optional art reveal.
- No scroll hijacking in prose.
- Sound is off by default, user-initiated, clearly stoppable, and not required for comprehension.

## Content, privacy, and trust

- Generated suggestions and Creator's Ledger material are labeled as drafts/process records where applicable.
- Never ask readers to submit confidential story IP to access the book.
- The reader states what progress data is stored and where.
- Checkout is handled by Polar; sensitive payment data does not pass through Arcanea application code.
- Paid prose is rendered only after server authorization and is not serialized into a free page payload.

## Accessibility

- WCAG 2.2 AA target.
- Semantic headings, landmarks, chapter navigation, and `<article>` structure.
- Skip link to chapter prose.
- Keyboard-operable TOC, settings, layer control, checkout, and modal states.
- Visible focus states using design tokens.
- Minimum 44×44 px touch targets for persistent controls.
- Alt text describes the story-relevant function of art; decorative atmosphere uses empty alt.
- Captions do not reveal spoilers earlier than prose.
- Text remains selectable and zoomable to 200% without loss.
- No meaning communicated by color or animation alone.

## Performance budgets

- Landing LCP below 2.5 s on target mobile profile.
- Reader prioritizes prose; cover/art must not block first text render.
- Above-fold image uses `next/image`, explicit dimensions, `sizes`, and inspected WebP/AVIF.
- No reader JavaScript required for prose.
- Lazy-load ledger, secondary art, and nonessential interaction.
- No autoplay media.

## Metadata and discovery

- Canonical URL uses `https://arcanea.ai`, redirecting bare domain to the chosen canonical host consistently.
- Book/CreativeWork JSON-LD only when publication fields are true.
- OG image is the approved cover/key art, with title-safe crop.
- Metadata distinguishes Preview, Complete, and Archive.
- Do not expose internal series bible, prompt archive, or development word counts as finished-publication proof.

## Analytics events

Collect only actionable events with documented privacy behavior:

- `book_viewed`
- `opening_started`
- `opening_completed`
- `paywall_viewed`
- `checkout_started`
- `checkout_completed`
- `chapter_started`
- `chapter_completed`
- `ledger_opened`
- `download_requested`

Never send prose text, prompt content, payment details, or private reading notes in analytics payloads.

## Error states

- Missing chapter: return to edition TOC with the missing slug logged server-side.
- Entitlement service unavailable: preserve free preview; show honest retry state for paid chapters.
- Checkout unavailable: keep edition details visible and offer notification/support, not a dead button.
- Asset missing: render prose and caption without layout shift; never broken-image chrome.
- Progress sync failure: continue locally and explain that sync will retry.

## Verification matrix

- 375×812 mobile landing and reader.
- 768×1024 tablet.
- 1440×900 desktop.
- Keyboard-only.
- Screen-reader landmarks and chapter flow.
- 200% zoom.
- Reduced motion.
- No JavaScript prose path.
- Logged out, signed in/no entitlement, entitled, pending, refunded.
- Slow image network and entitlement API failure.
- Webhook paid/refund/replay cases.

## Release blocker list

- Manuscript incomplete or not independently edited.
- Public title/naming IP review unresolved.
- Cover/character identity not locked.
- Paid prose present in a free client payload.
- Polar fulfillment or refunds not verified.
- All-caps UI, Unicode icon, raw visual constant, autoplay, or decorative portal violation.
- Mobile crop, typography, or accessibility below acceptance bar.
- Claims not backed by a current source ledger.
