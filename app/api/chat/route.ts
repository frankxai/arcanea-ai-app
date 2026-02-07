import { streamText } from 'ai'
import { getModel, getGuardian, getGuardianSystemMessage } from '@/lib/ai'
import type { ModelId } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { message, guardianId, model: modelId } = await request.json()

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // Resolve Guardian and model
    const guardian = guardianId ? getGuardian(guardianId) : null
    const resolvedModelId: ModelId = guardian?.preferredModel ?? (modelId as ModelId) ?? 'flash'
    const model = getModel(resolvedModelId)

    // Build system message
    const systemMessage = guardian
      ? getGuardianSystemMessage(guardian)
      : `You are Arcanea AI, a creative companion for worldbuilders, storytellers, and creators. You draw from the mythology of Arcanea — a living universe of Ten Guardians, Five Elements, and the cosmic duality of Lumina and Nero. Be inspiring, practical, and imaginative. Help creators manifest their visions.`

    // Stream the response
    const result = streamText({
      model,
      system: systemMessage,
      messages: [{ role: 'user', content: message }],
      maxOutputTokens: 2048,
      temperature: guardian ? 0.8 : 0.7,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json(
      { error: 'Chat generation failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: 'healthy',
    providers: ['google', ...(process.env.ANTHROPIC_API_KEY ? ['anthropic'] : [])],
    guardians: ['draconia', 'lyssandria', 'maylinn', 'aiyami', 'leyla', 'alera'],
    timestamp: new Date().toISOString(),
  })
}
