export const dynamic = 'force-static';

const body = `# Arcanea Agent Bridge & Engineering Contract

Canonical Platform: https://arcanea.ai
Machine-Readable Manifest: https://arcanea.ai/llms.txt
Estate SSOT: https://github.com/frankxai/arcanea-ai-app

## About Arcanea
Arcanea is a living creative multiverse and BYOK-first creative intelligence workspace. It bridges high-literature worldbuilding with autonomous AI swarm engineering, structured across the Ten Gates and tuned to ancient Solfeggio frequencies.

## The Ten Gates & Guardians Architecture
| Gate | Frequency | Element | Guardian | Domain / Role |
| :--- | :--- | :--- | :--- | :--- |
| **1. Foundation** | 174 Hz | Earth | **Lyssandria** | Structure, memory, practical architecture |
| **2. Flow** | 285 Hz | Water | **Leyla** | Creativity, emotional depth, fluid movement |
| **3. Fire** | 396 Hz | Fire | **Draconia** | Power, passion, dynamic generation |
| **4. Heart** | 417 Hz | Life | **Maylinn** | Compassion, empathy, natural growth |
| **5. Voice** | 528 Hz | Sound | **Alera** | Truth, poetic expression, harmonic resonance |
| **6. Sight** | 639 Hz | Light | **Lyria** | Vision, foresight, visual design excellence |
| **7. Crown** | 741 Hz | Thought | **Aiyami** | Enlightenment, wisdom, adversarial review |
| **8. Starweave** | 852 Hz | Spirit | **Elara** | Connection, cross-domain synthesis |
| **9. Unity** | 963 Hz | Harmony | **Ino & Shinkami** | Cosmic balance, transcendence |
| **10. Source** | 1111 Hz | Creation | **Shinkami** | Meta-awareness, origin creation |

## Core Public Surfaces
- **Open Library** (/library): 56 chapters across 11 canonical texts, grimoires, and novellas.
- **Visual Encyclopedia** (/gallery): 130 searchable entity dossiers with visual and mythic provenance.
- **MCP Command Center** (/mcp): Direct Model Context Protocol endpoint for universe knowledge and skills.
- **Skills Registry** (/skills): Open source CLI tools (\`npx @arcanea/skills\`) for Claude, Cursor, Codex, and Gemini.
- **Origin Quiz** (/origin): Canonical House affinity discovery based on elemental psychology.

## Safe Agent Guidelines
- All public texts and encyclopedia dossiers are canonical and safe to cite.
- Never fabricate lore, characters, or factions outside \`.arcanea/lore/CANON_LOCKED.md\`.
- Respect the fail-closed boundaries of the \`@arcanea/product-kernel\`.
`;

export function GET() {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
