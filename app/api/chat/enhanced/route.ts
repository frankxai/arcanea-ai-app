import { streamText, generateObject } from 'ai'
import { z } from 'zod'
import { getModel, getGuardian, getGuardianSystemMessage } from '@/lib/ai'
import type { ModelId } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { message, guardianId, model: modelId, autoEnhance, context } = await request.json()

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    const guardian = guardianId ? getGuardian(guardianId) : null
    const resolvedModelId: ModelId = guardian?.preferredModel ?? (modelId as ModelId) ?? 'flash'
    const model = getModel(resolvedModelId)

    // Build system message with enhancement context
    let systemMessage = guardian
      ? getGuardianSystemMessage(guardian)
      : `You are Arcanea AI, a creative companion for worldbuilders and storytellers. Be inspiring and imaginative.`

    if (autoEnhance) {
      systemMessage += `\n\nAuto-Enhancement Mode: Provide rich, detailed responses. Include creative suggestions, alternative approaches, and connections to Arcanea mythology where relevant. Structure your response with clear sections.`
    }

    // Build messages array with context history
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = []
    if (context && Array.isArray(context)) {
      for (const ctx of context) {
        if (ctx.role === 'user' || ctx.role === 'assistant') {
          messages.push({ role: ctx.role, content: ctx.content })
        }
      }
    }
    messages.push({ role: 'user', content: message })

    const result = streamText({
      model,
      system: systemMessage,
      messages,
      maxOutputTokens: 4096,
      temperature: 0.8,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Enhanced chat API error:', error)
    return Response.json(
      { error: 'Enhanced chat failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    status: 'healthy',
    version: '2.0.0',
    features: {
      autoEnhance: true,
      multimodal: true,
      guardianMode: true,
      streaming: true,
    },
    timestamp: new Date().toISOString(),
  })
}
