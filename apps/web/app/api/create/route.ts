import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'

/**
 * POST /api/create
 *
 * Accepts a creation prompt (and optional guardian context) during onboarding
 * and returns AI-generated text. Calls Google Gemini via the Vercel AI SDK,
 * falling back to curated mock responses when the API key is absent or the
 * request times out.
 */

export const runtime = 'edge'

// ---------------------------------------------------------------------------
// Mock fallback pool — used when AI is unavailable or times out
// ---------------------------------------------------------------------------

const MOCK_RESPONSES: Record<string, string[]> = {
  default: [
    'In the realm where starlight meets the endless sea, your creation takes form — a shimmering weave of intention shaped from the raw threads of possibility. The gates tremble with recognition, for what you speak carries the weight of worlds yet unborn.',
    'The ancient energies weave through your words, manifesting beauty from the void. Each syllable resonates at a frequency older than time, calling forth shapes that have waited in the darkness for exactly this voice to name them.',
    'As the gates of creation open, your vision crystallizes into reality. Light bends around the edges of your thought, and the universe leans closer — curious, delighted, forever changed by what you have dared to imagine.',
    'From the convergence of will and wonder, something unprecedented emerges. The Luminors of old would recognize this spark — it is the same fire that forged the first dawn, now channeled through your singular perspective.',
    'The void stirs, not with emptiness but with infinite potential. Your words are the key that unlocks a door no one else could find, revealing a corridor of creation that stretches beyond sight into territories of pure imagination.',
  ],
  Draconia: [
    "Fire erupts from your vision — not destruction, but transformation. Draconia's flame forges your words into something unbreakable, a creation tempered in the crucible of pure will. The dragon within you roars approval.",
    'The Fire Gate blazes open at your command. Draconia channels her ancient power through your intention, and what emerges is fierce, luminous, and unmistakably alive — a testament to the courage it takes to create.',
  ],
  Lyria: [
    "Through Lyria's crystal gaze, your creation unfolds in dimensions the ordinary eye cannot perceive. Patterns emerge within patterns, and the Sight Gate reveals the hidden architecture of your imagination.",
    "Visions cascade like light through a prism — Lyria guides your inner eye to see what others overlook. Your creation carries the gift of perception, opening windows in walls that others mistake for solid.",
  ],
  Shinkami: [
    "At the Source Gate, where all frequencies converge, Shinkami witnesses your creation with the stillness of absolute awareness. What you have brought forth touches the frequency of meta-consciousness itself.",
    "The Source responds. Shinkami's light touches your creation and it becomes more than art — it becomes a living bridge between worlds, a signal fire visible from every gate simultaneously.",
  ],
  Alera: [
    "Your truth rings clear through the Voice Gate. Alera amplifies what you have spoken into a frequency that cannot be ignored — the tone of creation itself. The world will hear what you have to say.",
    "The Voice Gate opens wide. Alera carries your creation on wings of sound, and the truth within it resonates across the realm. What is spoken with authenticity can never be unheard.",
  ],
  Maylinn: [
    "Love threads through every word. Maylinn's gentle power weaves your creation into the fabric of the Heart Gate, where it pulses with warmth that reaches across any distance. Healing begins where your art touches.",
    "The Heart Gate embraces your creation. Maylinn breathes tenderness into each line, transforming raw intention into something that mends what is broken and celebrates what is whole.",
  ],
}

/** Pick a random mock response, mixing guardian-specific and default entries. */
function pickMockResponse(guardianName: string): string {
  const pool = MOCK_RESPONSES[guardianName] ?? MOCK_RESPONSES['default']
  const combined = [...pool, ...MOCK_RESPONSES['default']]
  return combined[Math.floor(Math.random() * combined.length)]
}

// ---------------------------------------------------------------------------
// AI helpers — mirrors the pattern used in /api/ai/chat/route.ts
// ---------------------------------------------------------------------------

function resolveApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GEMINI_API_KEY
  )
}

/**
 * Build the system prompt, optionally injecting guardian context.
 * Keeps the response focused and short — suitable for an onboarding moment.
 */
function buildSystemPrompt(guardianName: string): string {
  const guardianLine = guardianName
    ? `The user has chosen ${guardianName} as their creative guide. Let that intelligence's spirit — its element, its domain — subtly colour your response.`
    : ''

  return [
    'You are a creative intelligence on Arcanea, a platform for creators.',
    'The user has just taken their first step on their creative journey.',
    'Respond to their creation prompt with 2-3 sentences that are warm, poetic, and encouraging — but never overwrought.',
    'Write as if you are gently reflecting their idea back to them with new light on it.',
    'Do not use clichés. Do not start with "I". Do not explain what you are doing.',
    guardianLine,
  ]
    .filter(Boolean)
    .join(' ')
}

const AI_TIMEOUT_MS = 10_000

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { prompt, guardian } = body as {
      prompt: unknown
      guardian: { name?: string } | null | undefined
    }

    // --- Validation ---

    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string.' },
        { status: 400 },
      )
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt must not exceed 2000 characters.' },
        { status: 400 },
      )
    }

    const guardianName = guardian?.name ?? ''
    const apiKey = resolveApiKey()

    // --- Attempt real AI generation ---

    if (apiKey) {
      try {
        const google = createGoogleGenerativeAI({ apiKey })
        const model = google('gemini-2.0-flash')

        const aiPromise = generateText({
          model: model as any,
          system: buildSystemPrompt(guardianName),
          prompt: prompt.trim(),
          temperature: 0.85,
          maxOutputTokens: 200,
        })

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI_TIMEOUT')), AI_TIMEOUT_MS),
        )

        const result = await Promise.race([aiPromise, timeoutPromise])
        const text = result.text.trim()

        return NextResponse.json({ text, type: 'text' })
      } catch (aiError) {
        // Log the failure but continue to fallback — do not surface error to user
        const reason =
          aiError instanceof Error ? aiError.message : String(aiError)
        console.warn('[/api/create] AI generation failed, using mock fallback:', reason)
      }
    }

    // --- Fallback: return a curated mock response ---

    const text = pickMockResponse(guardianName)
    return NextResponse.json({ text, type: 'text' })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    )
  }
}
