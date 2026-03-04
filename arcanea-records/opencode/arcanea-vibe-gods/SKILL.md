# Arcanean Vibe Gods — OpenCode Skill

> _"The Vibe Gods descend from the Source to shape your sonic reality."_

## Overview

This is the OpenCode version of the Arcanean Vibe Gods skill. Optimized for:

- File management and batch processing
- Local storage and retrieval
- n8n webhook integration
- Command-line workflows

## Installation

```bash
# Copy to your OpenCode skills
cp -r arcanea-vibe-gods ~/.opencode/skills/

# Or use the path directly
opencode --skill arcanea-vibe-gods /song "ocean waves"
```

## Commands

### Generate Song Concepts

```bash
opencode song "theme" --mood melancholic --genre pop
```

### Write Lyrics

```bash
opencode lyrics "concept" --persona default --output ./lyrics/
```

### Optimize Suno Prompt

```bash
opencode suno-prompt --lyrics ./lyrics/song.txt --output ./prompts/
```

### Generate Cover Art Prompts

```bash
opencode cover "song name" --theme ocean --style ethereal
```

### Create Social Content

```bash
opencode social "song name" --platform tiktok --output ./social/
```

### View Style Profile

```bash
opencode style --user frank
```

### Configure Swarm

```bash
opencode swarm config --agents songseed,lyricist,suno --services manual
```

## File Structure

```
.vibe-gods/
├── songs/           # Generated songs
├── lyrics/          # Written lyrics
├── prompts/         # Suno prompts
├── covers/          # Cover art prompts
├── social/          # Social posts
├── styles/          # Style profiles
├── personas/        # Lyricist personas
└── config.yaml      # Swarm configuration
```

## API Integration

Configure in `.env`:

```bash
SUNO_API_KEY=sk-xxx
N8N_WEBHOOK=http://localhost:5678/webhook/vibe-gods
```

## n8n Triggers

| Event              | Payload                          |
| ------------------ | -------------------------------- |
| `song.created`     | `{ id, title, concept, userId }` |
| `lyrics.generated` | `{ songId, lyrics, persona }`    |
| `prompt.ready`     | `{ songId, prompt, words }`      |
| `cover.generated`  | `{ songId, prompts[] }`          |
| `social.created`   | `{ songId, platform, content }`  |

## Examples

### Full Workflow

```bash
# 1. Generate concept
opencode song "midnight city" --mood energetic --genre synth-pop

# 2. Write lyrics
opencode lyrics "Midnight City" --output ./songs/midnight-city/

# 3. Optimize prompt
opencode suno-prompt --lyrics ./songs/midnight-city/lyrics.txt

# 4. Generate cover
opencode cover "Midnight City" --theme neon --style bold

# 5. Create social
opencode social "Midnight City" --platform tiktok
```

### Batch Processing

```bash
# Process multiple concepts
opencode batch ./concepts/ --output ./songs/

# Apply persona to all
opencode batch ./songs/ --persona "pop-star"
```

---

_The Vibe Gods serve those who seek to express their sonic truth._ 🎵
