import { getAvailableProviders } from '@/lib/ai'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeframe = searchParams.get('timeframe') || 'hour'

  const providers = getAvailableProviders()

  return Response.json({
    timestamp: new Date().toISOString(),
    timeframe,
    status: 'healthy',
    providers,
    guardians: {
      active: ['draconia', 'lyssandria', 'maylinn', 'aiyami', 'leyla', 'alera'],
      elementalBalance: { fire: 85, water: 78, earth: 72, void: 92, wind: 68 },
    },
    capabilities: {
      textGeneration: true,
      imageGeneration: true,
      streaming: true,
      structuredOutput: true,
      guardianMode: true,
    },
  })
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    const results: Record<string, unknown> = {
      usage_trends: {
        insights: [
          'Using Vercel AI SDK with Google Gemini',
          'Streaming enabled for all chat routes',
          'Image generation via Gemini Flash Image',
        ],
      },
      guardian_synergy: {
        synergyMatrix: {
          draconia_lyssandria: 0.78,
          draconia_maylinn: 0.85,
          lyssandria_aiyami: 0.92,
          maylinn_aiyami: 0.88,
        },
        optimalTeams: [
          ['draconia', 'maylinn'],
          ['lyssandria', 'aiyami'],
        ],
      },
    }

    return Response.json(results[query] ?? { error: 'Unknown query' })
  } catch (error) {
    return Response.json({ error: 'Analytics failed' }, { status: 500 })
  }
}
