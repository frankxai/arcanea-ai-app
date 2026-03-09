'use client'

import { useState, useEffect, useRef } from 'react'
import type { Guardian } from './step3-guardian'

const PLACEHOLDER_EXAMPLES = [
  'A poem about finding your voice in the darkness...',
  'A world where music has color and silence has weight...',
  'A hero who forgets their power every dawn...',
  'An ancient library that writes its own books...',
  'A kingdom built on the bones of forgotten songs...',
  'A letter to the version of you ten years from now...',
]

interface Step4CreationProps {
  guardian: Guardian | null
  onCreationSaved: (prompt: string, response: string) => void
  onNext: () => void
  onBack: () => void
}

export default function Step4Creation({ guardian, onCreationSaved, onNext, onBack }: Step4CreationProps) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [placeholderVisible, setPlaceholderVisible] = useState(true)
  const [visible, setVisible] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Cycle placeholder text
  useEffect(() => {
    if (prompt) return
    const interval = setInterval(() => {
      setPlaceholderVisible(false)
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_EXAMPLES.length)
        setPlaceholderVisible(true)
      }, 400)
    }, 3200)
    return () => clearInterval(interval)
  }, [prompt])

  const generateCreation = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setResponse('')
    setError('')
    setSaved(false)

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), guardian }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setResponse(data.text || 'The cosmos whispers... try again.')
    } catch {
      setError('The arcane connection faltered. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    setSaved(true)
    onCreationSaved(prompt, response)
  }

  const guardianColor = guardian?.color || '#0d47a1'
  const guardianGlow = guardian?.glowColor || 'rgba(13,71,161,0.3)'
  const guardianSymbol = guardian?.symbol || '✦'

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="text-center mb-6 transition-all duration-600"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(18px)' }}
      >
        <div className="text-xs tracking-[0.3em] uppercase text-[#0d47a1] font-semibold mb-3 font-sans">
          Step 4 of 5
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
          Your{' '}
          <span className="text-gold-gradient">First Creation</span>
        </h2>
        {guardian && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif"
              style={{
                background: guardianColor + '22',
                border: `1px solid ${guardianColor}45`,
                color: guardianColor,
              }}
            >
              {guardianSymbol}
            </div>
            <p className="text-sm font-sans" style={{ color: guardianColor }}>
              {guardian.name} guides your creation
            </p>
          </div>
        )}
        <p className="text-[#7c7c9a] text-sm font-sans">
          Describe what you wish to bring into existence
        </p>
      </div>

      {/* Prompt area */}
      <div
        className="mb-4 transition-all duration-600"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(14px)',
          transitionDelay: '0.08s',
        }}
      >
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            border: `1px solid ${prompt.trim() ? guardianColor + '45' : 'rgba(13,71,161,0.2)'}`,
            boxShadow: prompt.trim() ? `0 0 24px ${guardianGlow}` : 'none',
          }}
        >
          <div className="absolute inset-0 bg-[#0d0d1a]/80" style={{ backdropFilter: 'blur(12px)' }} />

          {/* Cycling placeholder overlay (only shows when textarea empty) */}
          {!prompt && (
            <div
              className="absolute top-4 left-4 right-4 pointer-events-none text-sm font-sans leading-relaxed transition-all duration-400"
              style={{
                color: '#4a4465',
                opacity: placeholderVisible ? 1 : 0,
                transform: placeholderVisible ? 'translateY(0)' : 'translateY(-6px)',
              }}
            >
              {PLACEHOLDER_EXAMPLES[placeholderIndex]}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=""
            rows={4}
            maxLength={300}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                generateCreation()
              }
            }}
            className="relative w-full bg-transparent text-[#e8e6f0] text-sm font-sans resize-none focus:outline-none p-4 leading-relaxed"
            style={{ caretColor: guardianColor }}
          />

          <div className="relative flex items-center justify-between px-4 pb-3 gap-2">
            <span className="text-[#4a4465] text-[11px] font-sans">
              {prompt.length}/300
              {prompt.length === 0 && (
                <span className="ml-2 opacity-60">cmd+enter to generate</span>
              )}
            </span>
            <button
              onClick={generateCreation}
              disabled={!prompt.trim() || loading}
              className="px-5 py-2 rounded-xl text-xs font-sans font-semibold text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${guardianColor}, ${guardianColor}bb)`,
                boxShadow: prompt.trim() ? `0 0 14px ${guardianGlow}` : 'none',
              }}
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Channeling...
                </>
              ) : (
                <>
                  <LightningIcon />
                  Manifest
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
            <path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" />
          </svg>
          {error}
        </div>
      )}

      {/* Shimmer loading skeleton */}
      {loading && (
        <div
          className="mb-4 rounded-2xl overflow-hidden"
          style={{
            border: `1px solid ${guardianColor}25`,
            background: `${guardianColor}08`,
          }}
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-full animate-pulse-glow"
                style={{ background: guardianColor + '30' }}
              />
              <div className="h-3 w-24 rounded-full animate-pulse" style={{ background: guardianColor + '25' }} />
            </div>
            <div className="space-y-2">
              {[1, 0.8, 0.9, 0.6].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full"
                  style={{
                    width: `${w * 100}%`,
                    background: 'rgba(255,255,255,0.06)',
                    animation: `pulse 1.8s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
            {/* Shimmer sweep */}
            <div
              className="mt-3 h-px w-full relative overflow-hidden rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="absolute inset-y-0 w-1/3"
                style={{
                  background: `linear-gradient(90deg, transparent, ${guardianColor}60, transparent)`,
                  animation: 'shimmer-sweep 1.6s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Generated response */}
      {response && !loading && (
        <div
          className="mb-4 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${guardianColor}10, ${guardianColor}05)`,
            border: `1px solid ${guardianColor}30`,
            boxShadow: `0 0 32px ${guardianGlow}`,
            animation: 'reveal-scale 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif flex-shrink-0"
                style={{
                  background: guardianColor + '22',
                  border: `1px solid ${guardianColor}40`,
                  color: guardianColor,
                }}
              >
                {guardianSymbol}
              </div>
              <span
                className="text-xs font-semibold font-sans tracking-wider uppercase"
                style={{ color: guardianColor }}
              >
                {guardian ? `${guardian.name}'s Vision` : 'Arcane Vision'}
              </span>
            </div>
            <p className="text-[#d4cfe8] text-sm font-sans leading-relaxed font-serif italic">
              {response}
            </p>
          </div>

          {/* Save button */}
          <div className="px-5 pb-5">
            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full py-2.5 rounded-xl text-xs font-sans font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]"
              style={{
                background: saved ? 'rgba(0,188,212,0.08)' : 'rgba(255,215,0,0.08)',
                border: `1px solid ${saved ? 'rgba(0,188,212,0.3)' : 'rgba(255,215,0,0.25)'}`,
                color: saved ? '#00bcd4' : '#ffd700',
                boxShadow: saved ? '0 0 12px rgba(0,188,212,0.15)' : '0 0 12px rgba(255,215,0,0.1)',
              }}
            >
              {saved ? (
                <>
                  <CheckIcon />
                  Saved to your vault
                </>
              ) : (
                <>
                  <VaultIcon />
                  Save to your vault
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-[#2a2a3e] text-[#7c7c9a] text-sm font-sans font-medium transition-all duration-200 hover:border-[#0d47a1]/40 hover:text-[#a78bfa]"
        >
          Back
        </button>
        <div className="flex-[2] flex flex-col gap-1.5">
          <button
            onClick={onNext}
            className="w-full py-3 rounded-xl text-sm font-sans font-semibold text-white transition-all duration-300 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #0d47a1, #7c3aed)',
              boxShadow: '0 0 22px rgba(13,71,161,0.35)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative">
              {response ? 'View Your Universe' : 'Skip for Now'}
            </span>
          </button>
          {!response && (
            <button
              onClick={onNext}
              className="text-center text-[11px] text-[#4a4465] font-sans hover:text-[#7c7c9a] transition-colors"
            >
              {"I'll create later"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Icons ── */

function LightningIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17Z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  )
}

function VaultIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="M216,56H176V48a24,24,0,0,0-48,0v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM144,48a8,8,0,0,1,16,0v8H144Zm72,152H40V72H216V200Zm-88-84a8,8,0,1,1,8,8A8,8,0,0,1,128,116Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor">
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  )
}
