# Chrome Export Plugins Audit — 2026-04-05

## Research Summary

Audited the entire landscape of AI chat export tools across Chrome extensions and GitHub repos.

---

## Tier 1: Best-of-Breed (Fork & Absorb)

### 1. `Trifall/chat-export` — MULTI-PLATFORM CHAMPION
- **Platforms**: ChatGPT, Claude, Gemini (AI Studio)
- **Formats**: Markdown, XML, JSON, HTML
- **Privacy**: 100% local, zero data sent externally
- **License**: Open source
- **Chrome + Firefox**
- **Why fork**: Closest to what we want. Multi-platform, clean architecture, privacy-first. Absorb the platform-specific DOM parsers.

### 2. `agoramachina/claude-exporter` — CLAUDE SPECIALIST
- **Platforms**: Claude.ai only
- **Formats**: JSON (full data), Markdown, Plain Text
- **Key features**: Bulk export as ZIP, artifact extraction as separate files, branch-aware, conversation browsing, searchable table, model detection
- **Privacy**: 100% local
- **Chrome + Firefox + Safari port exists**
- **Why fork**: Best Claude extractor. Artifact handling is exactly what we need. Absorb artifact extraction logic.

### 3. `Hugo-COLLIN/SaveMyPhind-conversation-exporter` (Save my Chatbot)
- **Platforms**: ChatGPT, Claude, Perplexity, Phind
- **Formats**: Structured Markdown
- **Chrome + Firefox + Edge + Opera + Brave**
- **Why fork**: Only tool that does Perplexity + Claude + ChatGPT. Cross-browser. Good structured markdown output.

### 4. `vincze-tamas/chatgpt-exporter` — CHATGPT BULK CHAMPION
- **Platforms**: ChatGPT
- **Formats**: Markdown ZIP (preserves project folder structure)
- **Chrome 109+ / Chromium**
- **Why fork**: Bulk export with folder structure. No Python needed. Clean.

---

## Tier 2: Useful Components

### 5. `stefanieZhao77/ai-chat-exporter` — OBSIDIAN BRIDGE
- **Platforms**: ChatGPT, Gemini
- **Output**: Direct to Obsidian vault folder
- **Why relevant**: The "write to local folder" pattern is exactly what our vault needs.

### 6. `FredySandoval/ChatGPT-CHROME_EXTENSION`
- **Formats**: JSON, Markdown
- **Why relevant**: Clean codebase, good for reference.

### 7. `rashidazarang/chatgpt-chat-exporter`
- **Browser-based** (not extension), Markdown + PDF
- **Why relevant**: Lightweight approach for quick exports.

---

## Tier 3: Commercial Chrome Web Store Extensions

### 8. ChatGPT Exporter (`chatgptexporter.com`)
- PDF, MD, Text, JSON, CSV
- 3 free PDF/day, MD/Text/JSON always free
- Commercial but solid

### 9. ExportGPT
- MD, Screenshot, PDF, HTML, Excel
- Sidebar buttons, preview panel
- Commercial

### 10. AI Chat Exporter (`claudexporter.com`)
- Claude specialist: PDF, MD, Text, CSV, JSON, Image
- Supports artifacts, reasoning, advanced outputs
- Commercial

### 11. ChatGPT to Markdown Pro
- Code/LaTeX/Table preservation
- Commercial

---

## Perplexity-Specific Extensions

### 12. Perplexity Thread Exporter
- JSON/Markdown export
- Premium version available

### 13. Perplexity Exporter
- MD, JSON, CSV, TXT
- Select specific conversations

### 14. Perplexity to Notion (Batch Export)
- Bulk export thousands of searches
- Auto-sync research library
- Also exports as Markdown for offline/Obsidian

### 15. Perplexity to Obsidian (Batch Export)
- Direct to Obsidian vault
- Batch export full history

---

## Grok-Specific (Already Catalogued)

| Repo | Stars | License | Status |
|------|-------|---------|--------|
| `brndnsmth/grok-imagine-favorites-manager` | 40 | — | ARCHIVED |
| `allophylus/grok-imagine-loop` | 36 | GPL-3.0 | Active |
| `The-Degen-Dev/grok-powertools` | 21 | MIT | Active |
| `josephmqiu/grok-imagine-favorites-downloader` | 28 | MIT | Active |
| `exabeet/grok-viewer` | 17 | GPL-3.0 | Active |
| `nmsbnmsb1/chrome-plugin-grok-spirit` | 1 | MIT | Active |
| **Our `packages/grok-media/`** | — | MIT | Phase 1 Complete |

---

## Fork Priority Matrix

| Repo | Priority | Absorb Into | Key Value |
|------|----------|-------------|-----------|
| `Trifall/chat-export` | P0 | Vault core | Multi-platform extractors |
| `agoramachina/claude-exporter` | P0 | Claude platform | Artifact extraction, bulk ZIP |
| `Hugo-COLLIN/SaveMyPhind-conversation-exporter` | P1 | Perplexity platform | Only Perplexity exporter with code |
| `vincze-tamas/chatgpt-exporter` | P1 | ChatGPT platform | Bulk export with folder structure |
| `stefanieZhao77/ai-chat-exporter` | P2 | Vault storage | Local folder write pattern |
| `The-Degen-Dev/grok-powertools` | P2 | Grok platform | MIT, utility functions |

---

## Decision: ONE Extension Strategy

**Arcanea Vault** replaces ALL of the above with a single, deeply-engineered extension that:
1. Absorbs the best platform extractors from forked repos
2. Adds unified UI (side panel + popup + content overlay)
3. Adds the classification/tagging pipeline
4. Adds local vault filesystem sync
5. Adds Supabase cloud sync (optional)
6. Ships on Chrome Web Store as premium Arcanea product

**Keep alongside Vault:**
- SideTab Pro (tab management UX)
- Auto Tab Discard (performance)
- Perplexity Comet (research companion — different purpose)

**Replace with Vault:**
- Any standalone ChatGPT exporter
- Any standalone Claude exporter
- Any standalone Perplexity exporter
- Any standalone Grok exporter
