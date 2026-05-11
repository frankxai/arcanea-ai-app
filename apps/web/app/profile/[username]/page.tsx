/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getProfileStats } from '@/lib/database/services/profile-service'
import { getUserCreations } from '@/lib/database/services/creation-service'
import { ProfilePageClient } from './profile-view'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username: userId } = await params
  const supabase = await createClient()
  const profile = await getProfile(supabase, userId)

  if (!profile) {
    return { title: 'Profile Not Found' }
  }

  return {
    title: `${profile.displayName}`,
    description: profile.bio || `View ${profile.displayName}'s creations on Arcanea`,
    openGraph: {
      title: `${profile.displayName} on Arcanea`,
      description: profile.bio || `Check out ${profile.displayName}'s creations`,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
      type: 'profile',
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username: userId } = await params
  const supabase = await createClient()

  const [profile, stats, creations] = await Promise.all([
    getProfile(supabase, userId),
    getProfileStats(supabase, userId),
    getUserCreations(supabase, userId, { status: 'published', visibility: 'public' }),
  ])

  if (!profile) {
    notFound()
  }

  // Determine if the viewer is the profile owner
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const isOwnProfile = currentUser?.id === profile.id

  return (
    <ProfilePageClient
      profile={profile}
      stats={stats}
      creations={creations}
      isOwnProfile={isOwnProfile}
    />
  )
}
