# Current State - April 4, 2026

## Major Systems Built (April 2-4 mega sprint)

### Arcanea Buddy v2 - SHIPPED
- 16 archetypes + 10 godbeasts, rarity tiers, skill tree, SIS statusline
- Linear: FRA-46 (Done), FRA-47 (Done)
- GitHub: #59

### Arcanea Voice v3 - SHIPPED
- 12 recording modes: thinking(4) + publishing(3) + workflow(5)
- Groq transcription (2h/day free) + Whisper fallback
- Voice coach: Hannah (Groq, free) + Lily (ElevenLabs, premium)
- Screen capture: screenshots, recordings, GIFs, clips with auto-transcribe
- Workflow routing: voice i/t/id/su/cm auto-creates Linear issues, tasks, standups
- Smart mic detection: auto-selects Shure MV6 as BROADCAST tier
- Linear: FRA-48 (In Progress)
- GitHub: #60

### Luminor Engineering Prompt - CANONICAL
- Kernel + GitHub module saved
- Ready for Custom GPT + Gem deployment
- Linear: FRA-49 (In Progress), FRA-50 (Backlog)
- GitHub: #61

### OpenCode Integration - PUSHED
- Buddy hook committed to frankxai/arcanea-opencode
- 7 free Zen models configured
- Linear: FRA-47 (Done)

## GTD Architecture Decision (LOCKED)
- LINEAR = task board (issues, status, priority)
- PLANNING FILES = agent execution layer (this file)
- MEMORY = decision persistence
- NOTION = documentation/wiki
- OBSIDIAN = personal vault (OneDrive, mobile)
- Voice system routes to all 5 based on mode

## Voice System Commands
```
! voice n/s/a/r        Thinking modes (internal)
! voice nl/v/c         Publishing modes (broadcast)
! voice i/t/id/su/cm   Workflow modes (Linear/Git/Obsidian)
! capture ss/rec/gif/clip  Screen capture
! voice-keys           API key management
Ctrl+Alt+N/S/A/V      Global hotkeys
```

## API Keys Status
- Groq: SET (transcription + TTS)
- ElevenLabs: SET (premium TTS)
- OpenAI: SET
- Supabase: NOT SET
- Sentry: NOT SET
- PostHog: NOT SET

## Priority Queue

### P0 - Today
1. Deploy Custom GPT (Engineering Luminor)
2. Deploy Custom Gem
3. Test voice workflow modes (issue, standup, commit)

### P1 - This Week
4. Scaffold @arcanea/buddy npm package
5. Scaffold @arcanea/voice npm package
6. Publish blog post to frankx.ai
7. Set up mobile voice capture (OneDrive sync)

### P2 - Next Week
8. Build arcanea.ai/buddy web page
9. Build arcanea.ai/voice showcase
10. Eliza OS Discord bot (Luminor)
