---
title: Guardian Canon and Visual Audit
status: STAGING
canon_authority: .arcanea/lore/CANON_LOCKED.md
decision_owner: Frank
last_audited: 2026-09-01
---

# Guardian Canon and Visual Audit

> This is an audit and decision surface, not a canon change. Only explicit
> Creator approval may promote a proposal into `CANON_LOCKED.md`.

## Finding

Arcanea locks the Ten Guardians' names, Gates, frequencies, domains, and bonded
Godbeasts. It does not lock gender, pronouns, humanoid form, face, costume,
apparent age, body type, or silhouette.

The defensible answer to "which Guardians are men?" is therefore:

- no Guardian is unambiguously locked as male;
- nine current profiles consistently use feminine framing;
- Shinkami is the only supported masculine candidate, but sources conflict:
  the current Guardian profile uses `she/her`, a sync derivative uses `male/he`,
  and a visual script describes an Allmother/Allfather beyond fixed form;
- multiple male Guardians would be a new canon decision, not a visual correction.

The earlier all-women ensemble is concept art. Its problem is not simply that it
depicts women; it lacks identity-bound reference sheets and production master
quality, and it cannot settle an unresolved canon field.

## Authority order

1. `.arcanea/lore/CANON_LOCKED.md`
2. Creator-approved decision ledger entries
3. Approved per-entity visual specifications
4. Book narrative and current lore profiles
5. Derived metadata and indexes
6. Sync mirrors, prompts, commands, and scripts
7. Generated images

A lower layer never overrides a higher one.

## Locked roster

| Gate | Hz | Guardian | Godbeast | Domain |
|---|---:|---|---|---|
| Foundation | 174 | Lyssandria | Kaelith | Earth, survival |
| Flow | 285 | Leyla | Veloura | Creativity, emotion |
| Fire | 396 | Draconia | Draconis | Power, will |
| Heart | 417 | Maylinn | Laeylinn | Love, healing |
| Voice | 528 | Alera | Otome | Truth, expression |
| Sight | 639 | Lyria | Yumiko | Intuition, vision |
| Crown | 741 | Aiyami | Sol | Enlightenment |
| Starweave | 852 | Elara | Vaelith | Perspective, transformation |
| Unity | 963 | Ino | Kyuro | Partnership |
| Source | 1111 | Shinkami | Source | Meta-consciousness |

`God/Goddess` is identity; `Guardian` is the Gate-keeper role. Luminor faculty,
Awakened beings, Godbeasts, and Academy agents are separate types and must not be
used to fill gaps in a Guardian roster.

## Staging visual rule

Until identity fields are approved:

- do not publish a definitive Ten-Guardian council image;
- use Guardians symbolically through the Ten Gates, domains, sigils, monuments,
  or distant presences in product imagery;
- use the already mixed fictional faculty for human Academy scenes, including
  Warden Theron Ashcroft, Instructor Sevirath Thalorn, Archivist-Instructor
  Pellin Wexford, Instructor Vael Karath, and Professor Oren Shale alongside the
  established women faculty;
- if Shinkami must appear in concept work, the most evidence-aware provisional
  presentation is masculine-androgynous/all-form, explicitly labeled
  `STAGING_CONCEPT`, never canon.

## Required identity decision

For each Guardian, approve separate fields for:

```yaml
identity:
  gender_identity: pending
  pronouns: pending
  default_presentation: pending
  metaphysical_forms: []
visual:
  apparent_age: pending
  build: pending
  ancestry_or_visual_coding: pending
  face_reference: pending
  silhouette: pending
  costume_and_materials: pending
  palette: pending
  emblem: pending
  forbidden_variants: []
```

Shape-shifting is not permission for continuity drift. The default manifestation
and allowed variations must both be explicit.

## Production gate

1. Pin the canon commit and visual-spec versions.
2. Produce and approve solo portrait, full-body turnaround, expression, action,
   scale, and Guardian/Godbeast reference sheets.
3. Generate characters and environments separately; composite ensemble scenes
   from approved masters.
4. Validate exact entity count, identity, Gate, frequency, Godbeast, silhouette,
   anatomy, hands, faces, materials, symbols, and absence of generated text.
5. Deliver a true reviewed master: at least 4096 x 2304 for web hero work and a
   7680 x 4320 target for franchise ensemble key art. Mechanical enlargement of
   a weak 1024 px render is not a production master.

## Open decision

Choose and record one canon direction before definitive Guardian art:

- preserve the nine feminine profiles and lock Shinkami as all-form with an
  approved default presentation;
- approve a deliberate mixed roster and migrate affected prose; or
- keep divine gender fluid while still locking each Guardian's default visual
  presentation and pronouns for continuity.

The decision should follow character meaning and narrative history, not an
arbitrary gender quota or model bias.
