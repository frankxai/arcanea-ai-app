import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg']
const MAX_SIZE = 100 * 1024 * 1024 // 100MB — matches creations bucket limit

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Require authenticated user — RLS policies enforce user-scoped paths
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData().catch(() => null)
  if (!form) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File exceeds 100MB limit' }, { status: 413 })
  }

  const allAllowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES]
  if (!allAllowed.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
  }

  // Determine subfolder by type
  const subfolder = ALLOWED_IMAGE_TYPES.includes(file.type) ? 'images'
    : ALLOWED_VIDEO_TYPES.includes(file.type) ? 'videos'
    : 'audio'

  // Path enforces user isolation — matches RLS policy: (storage.foldername(name))[1] = user_id
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const filename = `${user.id}/${subfolder}/${crypto.randomUUID()}.${ext}`

  const bytes = await file.arrayBuffer()
  const { data, error } = await supabase.storage
    .from('creations')
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('creations')
    .getPublicUrl(data.path)

  return NextResponse.json({ url: publicUrl, path: data.path })
}
