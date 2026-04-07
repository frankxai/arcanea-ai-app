import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Profile — Arcanea",
  description: "Your creator profile — showcase your worlds, creations, and achievements.",
  openGraph: {
    title: "Profile — Arcanea",
    description: "Your creator profile — showcase your worlds, creations, and achievements.",
  },
};

export default async function ProfileRedirect() {
  let user = null
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch {
    // Supabase not configured — show fallback
  }

  if (user) redirect(`/profile/${user.id}`)

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your Profile</h1>
        <p className="text-neutral-400 mb-8">
          Sign in to view your profile, track your creative journey through the Gates, and showcase your creations.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/auth/login?next=/profile" className="rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white hover:bg-cyan-500 transition">
            Sign In
          </Link>
          <Link href="/" className="rounded-xl border border-neutral-700 px-6 py-3 font-medium text-neutral-300 hover:border-neutral-500 transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
