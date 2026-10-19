# arcanea ceremonies

This file is the production pointer. It does not copy the crew.

Repo: `arcanea-ai-app`
Runner: `node scripts/ceremonies/run.mjs <id> --brief "<brief>" --out <dir>` in `claude-code-config`.

- `/realm` seats World Architect, Lore Keeper, Character Forger, Story Weaver, Art Director, Voice Alchemist. Object `realm-card`. Rival: a world-building chat that forgets the map. Refusal: Does not write CANON_LOCKED.md.
- `/myth` seats Story Weaver, World Architect, Lore Keeper. Object `myth-leaf`. Rival: a lore dump. Refusal: Does not write the canon lock.
- `/casting` seats Character Forger, Voice Alchemist, Art Director. Object `casting-card`. Rival: a character sheet. Refusal: Does not overwrite canon.
- `/lens` seats Art Director, cinematic-image-prompt-master, visual-quality-critic. Object `still-brief`. Rival: a prompt pasted into an image box. Refusal: Does not call Higgsfield.
- `/score` seats suno-prompt-architect, Lore Keeper. Object `score-packet`. Rival: a music prompt with no world under it. Refusal: Does not release the track.
- `/encounter` seats Game Designer, Character Forger, Story Weaver. Object `encounter-card`. Rival: a stat block. Refusal: Does not write the canon lock.
- `/lock` seats canon-guardian, Luminor. Object `canon-proposal`. Rival: a wiki edit. Refusal: Does not write CANON_LOCKED.md.
- `/guild` seats contributor, canon-guardian. Object `guild-proposal`. Rival: fan canon that overwrites the book. Refusal: Does not accept unofficial text as canon.
