# Arcanea Realm v1.0 — VS Code Extension Spec

## Vision
Kilo Code's power + Arcanea's creative magic = the world's first AI coding agent for world builders.

## What It Does (not what it references)

### 1. AI Chat with Guardian Personas
- Full streaming chat in sidebar webview
- Each Guardian = specialized system prompt + personality + domain expertise
- BYOK: Google Gemini, Anthropic Claude, OpenAI — user provides API key
- File context: sends current file, selection, or workspace to AI
- Insert AI-generated code directly into editor
- Guardian auto-routing: describe task → best Guardian responds

### 2. World Building Tools
- **Character Forge**: structured character creation (name, element, gate, backstory, abilities)
- **Realm Builder**: create locations with atmosphere, dangers, magic systems
- **Artifact Designer**: create magical items, tools, weapons with properties
- **Lore Writer**: generate consistent mythology entries
- All outputs saved as structured markdown in workspace

### 3. Image Generation
- **Prompt Architect**: Guardian-specialized image prompt generation
- Each Guardian generates prompts in their domain style
- Copy prompt to clipboard for use in Midjourney/DALL-E/Imagen/Nano Banana
- Gallery of generated prompts with metadata

### 4. Code Agent (Kilo Code-level)
- Read and write files in workspace
- Run terminal commands
- Multi-file context awareness
- Code review with Guardian perspective
- Refactoring suggestions

### 5. Creative Writing
- Story scene generation with world context
- Dialogue writer with character voices
- Description generator (places, creatures, magic)
- Voice Bible enforcement in real-time

## Architecture

```
src/
├── extension.ts           # Entry, commands, activation
├── guardians.ts           # Guardian data + routing (existing)
├── providers/
│   ├── chat-provider.ts   # Webview SPA for chat
│   ├── world-provider.ts  # World building panel
│   └── gallery-provider.ts # Image prompt gallery
├── services/
│   ├── ai-service.ts      # Multi-model AI client
│   ├── file-service.ts    # Workspace file operations
│   ├── world-service.ts   # World building logic
│   └── image-service.ts   # Image prompt generation
├── status-bar.ts          # Guardian status (existing)
├── gate-progress.ts       # Gate tracking (existing)
└── lore-explorer.ts       # Lore browser (existing)
```

## UX Flow

1. Install → Walkthrough → Enter API key
2. Open sidebar → Chat tab active
3. Type anything → Guardian responds with streaming AI
4. Right-click code → "Ask Guardian about this"
5. Command palette → World Building tools
6. Status bar → Active Guardian + Gate progress

## Settings
- `arcanea.apiKey` — API key (stored in VS Code secrets, NOT settings)
- `arcanea.provider` — "gemini" | "claude" | "openai"
- `arcanea.model` — model ID
- All existing settings preserved
