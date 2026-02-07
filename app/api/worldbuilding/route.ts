import { generateText, generateObject } from 'ai'
import { z } from 'zod'
import { getModel, getGuardian, getGuardianSystemMessage } from '@/lib/ai'
import type { ModelId } from '@/lib/ai'

const worldbuildingSchema = z.object({
  title: z.string(),
  type: z.enum(['character', 'location', 'story', 'realm']),
  description: z.string(),
  elements: z.array(z.object({
    name: z.string(),
    description: z.string(),
    connections: z.array(z.string()),
  })),
  loreNotes: z.string(),
  suggestedNextSteps: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const { title, type, description, guardianId } = await request.json()

    if (!title || !type || !description) {
      return Response.json(
        { error: 'Title, type, and description are required' },
        { status: 400 }
      )
    }

    const guardian = guardianId ? getGuardian(guardianId) : null
    const resolvedModelId: ModelId = guardian?.preferredModel ?? 'pro'
    const model = getModel(resolvedModelId)

    const systemMessage = guardian
      ? getGuardianSystemMessage(guardian)
      : `You are Arcanea's worldbuilding engine. Create rich, detailed content that fits the Arcanea universe — a living mythology of Ten Guardians, Five Elements (Fire, Water, Earth, Wind, Void/Spirit), the cosmic duality of Lumina and Nero, and Seven Academy Houses.`

    const prompt = `Create a detailed ${type} for a fantasy world:
Title: ${title}
Description: ${description}

Provide:
1. Core concept and unique elements
2. Detailed characteristics with connections to the broader Arcanea world
3. Lore notes explaining how this fits the mythology
4. Suggested next steps for expanding this creation`

    const result = await generateObject({
      model,
      system: systemMessage,
      prompt,
      schema: worldbuildingSchema,
      temperature: 0.8,
    })

    return Response.json({
      success: true,
      data: result.object,
      usage: result.usage,
    })
  } catch (error) {
    console.error('Worldbuilding API error:', error)

    // Fallback to unstructured generation if schema fails
    try {
      const { title, type, description, guardianId } = await request.clone().json()
      const model = getModel('flash')

      const result = await generateText({
        model,
        prompt: `Create a detailed ${type} called "${title}" for the Arcanea fantasy universe. Description: ${description}. Include core concept, characteristics, lore connections, and next steps.`,
        maxOutputTokens: 2048,
      })

      return Response.json({
        success: true,
        data: { text: result.text },
        usage: result.usage,
      })
    } catch (fallbackError) {
      return Response.json(
        { error: 'Worldbuilding creation failed' },
        { status: 500 }
      )
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  if (sessionId) {
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }

  return Response.json({
    types: ['character', 'location', 'story', 'realm'],
    guardians: ['draconia', 'lyssandria', 'maylinn', 'aiyami', 'leyla', 'alera'],
    elements: ['fire', 'water', 'earth', 'wind', 'void'],
  })
}
