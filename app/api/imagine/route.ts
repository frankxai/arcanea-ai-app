import { generateText } from 'ai'
import { getModel } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { prompt, style, quality } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return Response.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Build enhanced image prompt with Arcanea style
    const enhancedPrompt = buildImagePrompt(prompt, style, quality)

    // Use Gemini image model for generation
    const model = getModel('image-flash')

    const result = await generateText({
      model,
      providerOptions: {
        google: { responseModalities: ['IMAGE', 'TEXT'] },
      },
      prompt: enhancedPrompt,
    })

    // Extract generated images from result
    const images = result.files
      ?.filter(f => f.mediaType.startsWith('image/'))
      .map(f => ({
        data: f.base64,
        mimeType: f.mediaType,
      }))

    if (!images || images.length === 0) {
      return Response.json(
        { error: 'No images generated', text: result.text },
        { status: 422 }
      )
    }

    return Response.json({
      success: true,
      images,
      text: result.text,
      usage: result.usage,
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return Response.json(
      { error: 'Image generation failed' },
      { status: 500 }
    )
  }
}

function buildImagePrompt(prompt: string, style?: string, quality?: string): string {
  const styleMap: Record<string, string> = {
    photorealistic: 'Photorealistic, 8K resolution, cinematic lighting, hyperdetailed',
    artistic: 'Digital art, painterly style, rich colors, dramatic composition',
    cinematic: 'Cinematic film still, anamorphic lens, dramatic lighting, movie quality',
    anime: 'Anime art style, detailed line work, vibrant colors, Studio Ghibli inspired',
    'concept-art': 'Concept art, professional illustration, detailed environment design',
    'fantasy-art': 'Epic fantasy art, magical atmosphere, ethereal lighting, Arcanea universe',
    'character-design': 'Character design sheet, multiple angles, detailed costume, professional',
  }

  const stylePrefix = style && styleMap[style] ? styleMap[style] : 'High quality, professional'
  const qualitySuffix = quality === 'hd' ? ', ultra high resolution, maximum detail' : ''

  return `${stylePrefix}. ${prompt}${qualitySuffix}`
}

export async function GET() {
  return Response.json({
    styles: [
      'photorealistic', 'artistic', 'cinematic', 'anime',
      'concept-art', 'fantasy-art', 'character-design',
    ],
    models: ['gemini-2.5-flash-image', 'gemini-3-pro-image'],
    qualities: ['standard', 'hd'],
  })
}
