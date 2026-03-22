'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import {
  PhCamera,
  PhFloppyDisk,
  PhArrowLeft,
  PhSpinner,
  PhCheck,
  PhWarning,
} from '@/lib/phosphor-icons'
import { useAuth } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/client'
import type {
  GateName,
  GuardianName,
  AcademyHouse,
} from '@/lib/database/types/api-responses'

const GATES: GateName[] = [
  'Foundation', 'Flow', 'Fire', 'Heart', 'Voice',
  'Sight', 'Crown', 'Starweave', 'Unity', 'Source',
]

const GUARDIANS: GuardianName[] = [
  'Lyssandria', 'Leyla', 'Draconia', 'Maylinn', 'Alera',
  'Lyria', 'Aiyami', 'Elara', 'Ino', 'Shinkami',
]

const ACADEMY_HOUSES: AcademyHouse[] = [
  'Lumina', 'Nero', 'Pyros', 'Aqualis', 'Terra', 'Ventus', 'Synthesis',
]

const GATE_FREQUENCIES: Record<string, string> = {
  Foundation: 'She builds the ground beneath your feet',
  Flow: 'Where feeling becomes creation',
  Fire: 'The fire that forges your will',
  Heart: 'Love fierce enough to heal',
  Voice: 'The voice that shapes reality',
  Sight: 'She sees what others cannot',
  Crown: 'Light beyond comprehension',
  Starweave: 'The weaver of perspective',
  Unity: 'Where two become infinite',
  Source: 'Where the dreamer and the dream become one',
}

interface FormData {
  display_name: string
  bio: string
  avatar_url: string
  active_gate: string
  guardian: string
  academy_house: string
}

type Toast = {
  type: 'success' | 'error'
  message: string
} | null

export default function EditProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const supabaseRef = useRef(createClient())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<FormData>({
    display_name: '',
    bio: '',
    avatar_url: '',
    active_gate: '',
    guardian: '',
    academy_house: '',
  })
  const [profileLoading, setProfileLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?next=/profile/edit')
    }
  }, [authLoading, user, router])

  // Load current profile
  const loadProfile = useCallback(async () => {
    if (!user) return
    setProfileLoading(true)

    try {
      const { data, error } = await supabaseRef.current
        .from('profiles')
        .select('display_name, bio, avatar_url, active_gate, guardian, academy_house')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setFormData({
          display_name: data.display_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          active_gate: data.active_gate || '',
          guardian: data.guardian || '',
          academy_house: data.academy_house || '',
        })
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
      showToast('error', 'Failed to load your profile.')
    } finally {
      setProfileLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image must be under 5 MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      showToast('error', 'File must be an image.')
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setAvatarPreview(objectUrl)
    setIsUploading(true)

    try {
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabaseRef.current.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabaseRef.current.storage
        .from('avatars')
        .getPublicUrl(path)

      // Append cache-buster to force refresh
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }))
      setAvatarPreview(null)
      showToast('success', 'Avatar uploaded.')
    } catch (err) {
      console.error('Avatar upload failed:', err)
      showToast('error', 'Failed to upload avatar. Try again.')
      setAvatarPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    // Client-side validation
    if (!formData.display_name.trim()) {
      showToast('error', 'Display name is required.')
      return
    }
    if (formData.display_name.length > 100) {
      showToast('error', 'Display name must be under 100 characters.')
      return
    }
    if (formData.bio.length > 500) {
      showToast('error', 'Bio must be under 500 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload: Record<string, string | undefined> = {
        displayName: formData.display_name.trim(),
        bio: formData.bio.trim(),
      }

      if (formData.avatar_url) {
        payload.avatarUrl = formData.avatar_url
      }
      if (formData.active_gate) {
        payload.activeGate = formData.active_gate
      }
      if (formData.guardian) {
        payload.guardian = formData.guardian
      }
      if (formData.academy_house) {
        payload.academyHouse = formData.academy_house
      }

      const res = await fetch(`/api/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Update failed')
      }

      showToast('success', 'Profile updated successfully.')
    } catch (err) {
      console.error('Profile update failed:', err)
      showToast('error', err instanceof Error ? err.message : 'Failed to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <PhSpinner size={32} weight="duotone" className="text-[#00bcd4] animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const displayAvatar = avatarPreview || formData.avatar_url
  const initials = formData.display_name
    ? formData.display_name.slice(0, 2).toUpperCase()
    : '??'

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen bg-black">
        {/* Toast */}
        {toast && (
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-xl font-body text-sm ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? (
              <PhCheck size={16} weight="duotone" />
            ) : (
              <PhWarning size={16} weight="duotone" />
            )}
            {toast.message}
          </m.div>
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="inline-flex items-center gap-2 text-white/[0.25] hover:text-white/[0.40] transition-colors font-body text-sm mb-4"
            >
              <PhArrowLeft size={16} weight="duotone" />
              Back to Profile
            </button>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="text-white/[0.25] font-body mt-1">Shape your identity in the Arcanea universe</p>
          </m.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06]"
            >
              <h2 className="text-lg font-display font-bold text-white mb-5">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 rounded-full p-0.5 bg-gradient-to-br from-[#00bcd4] to-[#0d47a1]">
                    <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center relative">
                      {displayAvatar ? (
                        <Image
                          src={displayAvatar}
                          alt="Avatar"
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-display font-bold text-white/[0.40]">
                          {initials}
                        </span>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <PhSpinner size={24} weight="duotone" className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
                  >
                    <PhCamera size={24} weight="duotone" className="text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <div>
                  <p className="text-white/[0.40] font-body text-sm">
                    Click the avatar to upload a new picture
                  </p>
                  <p className="text-white/[0.20] font-body text-xs mt-1">
                    JPG, PNG or WebP. Max 5 MB.
                  </p>
                </div>
              </div>
            </m.div>

            {/* Basic Info */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] space-y-5"
            >
              <h2 className="text-lg font-display font-bold text-white">Basic Information</h2>

              <FieldGroup label="Display Name" required>
                <input
                  type="text"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.06] focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/30 focus:outline-none transition-all font-body text-sm placeholder:text-white/[0.12]"
                  placeholder="Your display name"
                  required
                />
              </FieldGroup>

              <FieldGroup label="Bio" hint={`${formData.bio.length}/500`}>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.06] focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/30 focus:outline-none transition-all font-body text-sm resize-none placeholder:text-white/[0.12]"
                  placeholder="Tell the world about your creative journey..."
                />
              </FieldGroup>
            </m.div>

            {/* Arcanea Identity */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.06] space-y-5"
            >
              <h2 className="text-lg font-display font-bold text-white">Arcanea Identity</h2>
              <p className="text-white/[0.25] font-body text-sm -mt-2">
                Choose your path through the universe
              </p>

              <FieldGroup label="Active Gate" hint={formData.active_gate ? GATE_FREQUENCIES[formData.active_gate] : undefined}>
                <select
                  name="active_gate"
                  value={formData.active_gate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.06] focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/30 focus:outline-none transition-all font-body text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-black text-white/[0.25]">
                    Select a gate...
                  </option>
                  {GATES.map((gate) => (
                    <option key={gate} value={gate} className="bg-black text-white">
                      {gate} ({GATE_FREQUENCIES[gate]})
                    </option>
                  ))}
                </select>
              </FieldGroup>

              <FieldGroup label="Guardian">
                <select
                  name="guardian"
                  value={formData.guardian}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.06] focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/30 focus:outline-none transition-all font-body text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-black text-white/[0.25]">
                    Select a guardian...
                  </option>
                  {GUARDIANS.map((g) => (
                    <option key={g} value={g} className="bg-black text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </FieldGroup>

              <FieldGroup label="Academy House">
                <select
                  name="academy_house"
                  value={formData.academy_house}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] text-white border border-white/[0.06] focus:border-[#00bcd4]/50 focus:ring-1 focus:ring-[#00bcd4]/30 focus:outline-none transition-all font-body text-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-black text-white/[0.25]">
                    Select a house...
                  </option>
                  {ACADEMY_HOUSES.map((house) => (
                    <option key={house} value={house} className="bg-black text-white">
                      House {house}
                    </option>
                  ))}
                </select>
              </FieldGroup>
            </m.div>

            {/* Action Buttons */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 justify-end"
            >
              <button
                type="button"
                onClick={() => router.push(`/profile/${user.id}`)}
                className="px-5 py-2.5 border border-white/[0.12] rounded-lg text-white/[0.40] hover:bg-white/[0.04] transition-colors font-body text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00bcd4] hover:bg-[#00acc1] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-body text-sm font-medium"
              >
                {isSubmitting ? (
                  <>
                    <PhSpinner size={16} weight="duotone" className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <PhFloppyDisk size={16} weight="duotone" />
                    Save Changes
                  </>
                )}
              </button>
            </m.div>
          </form>
        </div>
      </div>
    </LazyMotion>
  )
}

function FieldGroup({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-white/[0.40] font-body text-sm font-medium">
          {label}
          {required && <span className="text-[#00bcd4] ml-0.5">*</span>}
        </label>
        {hint && (
          <span className="text-white/[0.12] font-body text-xs">{hint}</span>
        )}
      </div>
      {children}
    </div>
  )
}
