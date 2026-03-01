'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/client'
import { updateProfile } from '@/lib/database/services/profile-service'
import Step1Welcome from './onboarding-welcome'
import Step2CreatorType from './step2-creator-type'
import Step3Guardian from './step3-guardian'
import Step4Creation from './step4-creation'
import Step5YourUniverse from './step5-your-universe'
import ProgressStepper from './progress-stepper'
import type { Guardian } from './step3-guardian'
import CosmicParticles from './cosmic-particles'

const STEP_LABELS = ['Welcome', 'Identity', 'Guardian', 'Creation', 'Universe']

const GUARDIAN_GATE_MAP: Record<string, string> = {
  Lyssandria: 'Foundation',
  Leyla: 'Flow',
  Draconia: 'Fire',
  Maylinn: 'Heart',
  Alera: 'Voice',
  Lyria: 'Sight',
  Aiyami: 'Crown',
  Elara: 'Shift',
  Ino: 'Unity',
  Shinkami: 'Source',
}

export default function ArcanealOnboarding() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [transitioning, setTransitioning] = useState(false)
  const [saving, setSaving] = useState(false)

  // Accumulated data
  const [selectedCreatorTypes, setSelectedCreatorTypes] = useState<string[]>([])
  const [matchedGuardian, setMatchedGuardian] = useState<Guardian | null>(null)
  const [firstCreationPrompt, setFirstCreationPrompt] = useState('')
  const [firstCreationResponse, setFirstCreationResponse] = useState('')
  const [completed, setCompleted] = useState(false)

  const goToStep = (target: number) => {
    setTransitioning(true)
    setTimeout(() => {
      setStep(target)
      setTransitioning(false)
    }, 280)
  }

  const next = () => goToStep(step + 1)
  const back = () => goToStep(step - 1)

  // Save onboarding data to Supabase profile
  const saveOnboardingData = useCallback(async () => {
    if (!user) return
    setSaving(true)
    try {
      const supabase = createClient()
      const guardianName = matchedGuardian?.name || null
      const gate = guardianName ? GUARDIAN_GATE_MAP[guardianName] || 'Foundation' : 'Foundation'

      await updateProfile(supabase, user.id, {
        guardian: guardianName as Parameters<typeof updateProfile>[2]['guardian'],
        activeGate: gate as Parameters<typeof updateProfile>[2]['activeGate'],
        metadata: {
          creatorTypes: selectedCreatorTypes,
          onboardingComplete: true,
          onboardingDate: new Date().toISOString(),
          firstCreation: firstCreationPrompt
            ? { prompt: firstCreationPrompt, response: firstCreationResponse }
            : null,
        },
      })
    } catch (err) {
      console.error('Failed to save onboarding data:', err)
    } finally {
      setSaving(false)
    }
  }, [user, matchedGuardian, selectedCreatorTypes, firstCreationPrompt, firstCreationResponse])

  const handleComplete = useCallback(async () => {
    setCompleted(true)
    await saveOnboardingData()
    // Redirect to dashboard after a brief moment
    setTimeout(() => router.push('/dashboard'), 2500)
  }, [saveOnboardingData, router])

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.25), rgba(255,215,0,0.05))',
              border: '1.5px solid rgba(255,215,0,0.5)',
              boxShadow: '0 0 50px rgba(255,215,0,0.4)',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 256 256" fill="#ffd700">
              <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1-8-8V200.94A104.79,104.79,0,0,1,67.81,186.08,8,8,0,0,1,69,173.41a91.66,91.66,0,0,0,60.42,22.59H127A88.08,88.08,0,0,0,195.45,71.16l-4.55-4.54L167,89.47A16,16,0,0,0,164,80V24a8,8,0,0,0-8-8H100a8,8,0,0,0-8,8V80a16,16,0,0,0-3,9.47L65.1,66.62l-4.55,4.54A88.2,88.2,0,0,0,40,128a88.13,88.13,0,0,0,11.84,44.53,8,8,0,1,1-13.88,8A104.14,104.14,0,0,1,24,128,104.21,104.21,0,0,1,62.82,46.41l4.55-4.55a16,16,0,0,1,22.63,0L104,55.86V24h48V55.86l14,14a16,16,0,0,1,22.63,0l4.55,4.55A104.09,104.09,0,0,1,232,128,104.55,104.55,0,0,1,152,224Z" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-bold text-gold-gradient mb-3">
            Welcome to Arcanea
          </h1>
          <p className="text-[#7c7c9a] font-sans text-sm">
            {saving ? 'Weaving your universe...' : 'Your universe has been created. Your journey begins now.'}
          </p>
          {matchedGuardian && (
            <p className="mt-3 text-sm font-sans" style={{ color: matchedGuardian.color }}>
              {matchedGuardian.name} walks beside you.
            </p>
          )}
          <p className="mt-4 text-xs text-[#3a3a5a] font-sans animate-pulse">
            Entering the Studio...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background cosmic particles (subtle, behind everything) */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <CosmicParticles count={40} />
        {/* Static ambient orbs */}
        <div className="absolute top-1/3 left-1/5 w-96 h-96 rounded-full bg-[#8b5cf6]/5 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-[#7fffd4]/4 blur-[100px]" />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full bg-[#ffd700]/3 blur-[90px]" />
      </div>

      {/* Main wizard card */}
      <div className="relative w-full max-w-md" style={{ zIndex: 1 }}>
        {/* Progress stepper — not shown on step 1 */}
        {step > 1 && (
          <div className="mb-10 px-2">
            <ProgressStepper
              currentStep={step}
              totalSteps={5}
              stepLabels={STEP_LABELS}
            />
          </div>
        )}

        {/* Glass card container */}
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            background: 'rgba(11,11,20,0.72)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(24px) saturate(1.5)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.08)',
          }}
        >
          {/* Top edge shimmer */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/40 to-transparent" />

          {/* Step content with cross-fade */}
          <div
            className="p-6 md:p-8 transition-all duration-280"
            style={{
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'translateY(8px) scale(0.99)' : 'translateY(0) scale(1)',
            }}
          >
            {step === 1 && <Step1Welcome onNext={next} />}

            {step === 2 && (
              <Step2CreatorType
                selected={selectedCreatorTypes}
                onSelect={setSelectedCreatorTypes}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 3 && (
              <Step3Guardian
                onGuardianMatched={(g) => setMatchedGuardian(g)}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 4 && (
              <Step4Creation
                guardian={matchedGuardian}
                onCreationSaved={(prompt, response) => {
                  setFirstCreationPrompt(prompt)
                  setFirstCreationResponse(response)
                }}
                onNext={next}
                onBack={back}
              />
            )}

            {step === 5 && (
              <Step5YourUniverse
                creatorTypes={selectedCreatorTypes}
                guardian={matchedGuardian}
                firstCreationPrompt={firstCreationPrompt}
                firstCreationResponse={firstCreationResponse}
                onEnter={handleComplete}
              />
            )}
          </div>

          {/* Bottom edge shimmer */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#7fffd4]/20 to-transparent" />
        </div>

        {/* Step counter below card */}
        {step > 1 && step < 5 && (
          <p className="text-center text-[11px] text-[#3a3a5a] font-sans mt-4 tracking-widest uppercase">
            Step {step} of 5 — {STEP_LABELS[step - 1]}
          </p>
        )}
      </div>
    </main>
  )
}
