// Creation Service — matches actual Supabase schema
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Creation, CreationFilters } from '../types/api-responses'

export async function getCreation(
  client: SupabaseClient,
  id: string
): Promise<Creation | null> {
  const { data, error } = await client
    .from('creations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return mapCreation(data)
}

export async function getCreations(
  client: SupabaseClient,
  filters: CreationFilters = {}
): Promise<Creation[]> {
  let query = client.from('creations').select('*')

  if (filters.type) query = query.eq('type', filters.type)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.visibility) query = query.eq('visibility', filters.visibility)
  if (filters.element) query = query.eq('element', filters.element)
  if (filters.gate) query = query.eq('gate', filters.gate)
  if (filters.guardian) query = query.eq('guardian', filters.guardian)
  if (filters.tags && filters.tags.length > 0) query = query.overlaps('tags', filters.tags)

  const sortCol = filters.sortBy === 'popular' ? 'like_count'
    : filters.sortBy === 'view_count' ? 'view_count'
    : 'created_at'
  query = query.order(sortCol, { ascending: filters.sortOrder === 'asc' })

  if (filters.limit) query = query.limit(filters.limit)
  if (filters.offset) query = query.range(filters.offset, (filters.offset || 0) + (filters.limit || 10) - 1)

  const { data, error } = await query

  if (error || !data) return []

  return data.map(mapCreation)
}

export const listCreations = getCreations

export async function getUserCreations(
  client: SupabaseClient,
  userId: string,
  filters: CreationFilters = {}
): Promise<Creation[]> {
  let query = client
    .from('creations')
    .select('*')
    .eq('user_id', userId)

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.visibility) query = query.eq('visibility', filters.visibility)

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error || !data) return []

  return data.map(mapCreation)
}

export async function createCreation(
  client: SupabaseClient,
  userId: string,
  creation: {
    title: string
    description?: string
    content?: Record<string, unknown>
    type?: string
    status?: string
    visibility?: string
    element?: string
    gate?: string
    guardian?: string
    tags?: string[]
    thumbnailUrl?: string
    aiModel?: string
    aiPrompt?: string
    projectId?: string
    sourceSessionId?: string
  }
): Promise<Creation | null> {
  const { data, error } = await client
    .from('creations')
    .insert({
      title: creation.title,
      description: creation.description,
      content: creation.content,
      type: creation.type || 'text',
      status: creation.status || 'draft',
      visibility: creation.visibility || 'private',
      element: creation.element,
      gate: creation.gate,
      guardian: creation.guardian,
      tags: creation.tags || [],
      thumbnail_url: creation.thumbnailUrl,
      ai_model: creation.aiModel,
      ai_prompt: creation.aiPrompt,
      project_id: creation.projectId,
      source_session_id: creation.sourceSessionId,
      user_id: userId,
    })
    .select()
    .single()

  if (error || !data) return null

  return mapCreation(data)
}

export async function updateCreation(
  client: SupabaseClient,
  id: string,
  _userId: string,
  updates: Partial<Creation>
): Promise<Creation | null> {
  const payload: Record<string, unknown> = {}
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.description !== undefined) payload.description = updates.description
  if (updates.content !== undefined) payload.content = updates.content
  if (updates.type !== undefined) payload.type = updates.type
  if (updates.visibility !== undefined) payload.visibility = updates.visibility
  if (updates.status !== undefined) payload.status = updates.status
  if (updates.element !== undefined) payload.element = updates.element
  if (updates.gate !== undefined) payload.gate = updates.gate
  if (updates.guardian !== undefined) payload.guardian = updates.guardian
  if (updates.tags !== undefined) payload.tags = updates.tags

  const { data, error } = await client
    .from('creations')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return null

  return mapCreation(data)
}

export async function deleteCreation(
  client: SupabaseClient,
  id: string,
  _userId: string
): Promise<boolean> {
  const { error } = await client
    .from('creations')
    .delete()
    .eq('id', id)

  return !error
}

export async function incrementViewCount(
  client: SupabaseClient,
  creationId: string
): Promise<void> {
  await client.rpc('increment_view_count', { creation_id: creationId })
}

function mapCreation(data: Record<string, unknown>): Creation {
  return {
    id: data.id as string,
    title: data.title as string,
    description: data.description as string | null,
    content: data.content as Record<string, unknown> | null,
    type: (data.type || 'text') as Creation['type'],
    status: (data.status || 'draft') as Creation['status'],
    visibility: (data.visibility || 'private') as Creation['visibility'],
    element: data.element as Creation['element'],
    gate: data.gate as Creation['gate'],
    guardian: data.guardian as Creation['guardian'],
    tags: (data.tags || []) as string[],
    thumbnailUrl: data.thumbnail_url as string | null,
    viewCount: (data.view_count || 0) as number,
    likeCount: (data.like_count || 0) as number,
    aiModel: data.ai_model as string | null,
    aiPrompt: data.ai_prompt as string | null,
    userId: data.user_id as string,
    metadata: data.metadata as Record<string, unknown> | null,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  }
}
