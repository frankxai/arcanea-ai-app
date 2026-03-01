'use client'

import { useState, useEffect } from 'react'

export type CreatorType = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
  glowColor: string
}

const CREATOR_TYPES: CreatorType[] = [
  {
    id: 'writer',
    label: 'Writer',
    description: 'Write fiction, essays, scripts, and poetry',
    icon: <QuillIcon />,
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
  },
  {
    id: 'visual-artist',
    label: 'Visual Artist',
    description: 'Design visuals, illustrations, and concepts',
    icon: <PaletteIcon />,
    color: '#7fffd4',
    glowColor: 'rgba(127,255,212,0.3)',
  },
  {
    id: 'musician',
    label: 'Musician',
    description: 'Compose melodies, write lyrics, produce tracks',
    icon: <MusicIcon />,
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.3)',
  },
  {
    id: 'developer',
    label: 'Developer',
    description: 'Build software, apps, and systems',
    icon: <CodeIcon />,
    color: '#60a5fa',
    glowColor: 'rgba(96,165,250,0.3)',
  },
  {
    id: 'storyteller',
    label: 'Storyteller',
    description: 'Build worlds, develop characters, craft narratives',
    icon: <StarIcon />,
    color: '#f472b6',
    glowColor: 'rgba(244,114,182,0.3)',
  },
  {
    id: 'polymath',
    label: 'Polymath',
    description: 'Work across multiple creative disciplines',
    icon: <PolymathIcon />,
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.35)',
  },
]

interface Step2CreatorTypeProps {
  selected: string[]
  onSelect: (selected: string[]) => void
  onNext: () => void
  onBack: () => void
}

export default function Step2CreatorType({ selected, onSelect, onNext, onBack }: Step2CreatorTypeProps) {
  const [visible, setVisible] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((s) => s !== id))
    } else {
      onSelect([...selected, id])
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="text-center mb-8 transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <div className="text-xs tracking-[0.3em] uppercase text-[#8b5cf6] font-semibold mb-3 font-sans">
          Step 2 of 5
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
          What do you{' '}
          <span className="text-gold-gradient">create?</span>
        </h2>
        <p className="text-[#7c7c9a] text-sm font-sans">
          Pick everything that applies
        </p>
      </div>

      {/* Grid of creator cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {CREATOR_TYPES.map((type, i) => {
          const isSelected = selected.includes(type.id)
          const isHovered = hoveredId === type.id
          return (
            <button
              key={type.id}
              onClick={() => toggle(type.id)}
              onMouseEnter={() => setHoveredId(type.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative p-4 rounded-2xl text-left transition-all duration-300 focus:outline-none"
              style={{
                transform: isSelected ? 'scale(1.02)' : isHovered ? 'scale(1.015)' : 'scale(1)',
                animationDelay: `${i * 0.07}s`,
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ${i * 0.06}s ease, transform 0.25s ease`,
              }}
            >
              {/* Glass base */}
              <div
                className="absolute inset-0 rounded-2xl transition-all duration-300"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${type.color}22, ${type.color}0a)`
                    : isHovered
                    ? `linear-gradient(135deg, ${type.color}14, rgba(17,17,30,0.7))`
                    : 'rgba(17,17,30,0.6)',
                  border: isSelected
                    ? `1px solid ${type.color}70`
                    : isHovered
                    ? `1px solid ${type.color}35`
                    : '1px solid rgba(139,92,246,0.15)',
                  boxShadow: isSelected
                    ? `0 0 28px ${type.glowColor}, inset 0 1px 0 ${type.color}20`
                    : isHovered
                    ? `0 0 14px ${type.glowColor}`
                    : 'none',
                  backdropFilter: 'blur(16px)',
                }}
              />

              {/* Teal selection ring */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1.5px #7fffd460`,
                  }}
                />
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <div
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#7fffd4', boxShadow: '0 0 10px rgba(127,255,212,0.5)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 4-4" stroke="#0a0a0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              {/* Content */}
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
                  style={{
                    background: isSelected ? type.color + '30' : 'rgba(139,92,246,0.1)',
                    color: isSelected ? type.color : isHovered ? type.color : '#8b5cf6',
                    boxShadow: isSelected ? `0 0 14px ${type.glowColor}` : 'none',
                  }}
                >
                  {type.icon}
                </div>
                <div
                  className="text-sm font-semibold font-sans mb-1 transition-colors duration-300"
                  style={{ color: isSelected ? type.color : '#e8e6f0' }}
                >
                  {type.label}
                </div>
                <div className="text-xs text-[#6b6485] font-sans leading-relaxed">
                  {type.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selection count */}
      <div className="text-center mb-6 h-5">
        {selected.length > 0 && (
          <span
            className="text-xs font-sans tracking-wider transition-all duration-300"
            style={{ color: '#7fffd4' }}
          >
            {selected.length} {selected.length === 1 ? 'identity' : 'identities'} chosen
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-[#2a2a3e] text-[#7c7c9a] text-sm font-sans font-medium transition-all duration-200 hover:border-[#8b5cf6]/40 hover:text-[#a78bfa]"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex-[2] py-3 rounded-xl text-sm font-sans font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
          style={{
            background:
              selected.length > 0
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : '#1a1a2e',
            color: 'white',
            boxShadow:
              selected.length > 0
                ? '0 0 24px rgba(139,92,246,0.4)'
                : 'none',
          }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="relative">Continue</span>
        </button>
      </div>
    </div>
  )
}

/* ── Icons ── */

function QuillIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,56a96.1,96.1,0,0,1-96,96H102.4L83.9,191.1A16.1,16.1,0,0,1,69.2,200H40a16,16,0,0,1-14.8-22.1l.1-.3,0-.1C71.6,68.3,148.5,18,224,24A8,8,0,0,1,232,32V48A8.1,8.1,0,0,1,224,56Z" />
    </svg>
  )
}

function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89ZM84,168a12,12,0,1,1,12-12A12,12,0,0,1,84,168Zm0-56a12,12,0,1,1,12-12A12,12,0,0,1,84,112Zm44-52a12,12,0,1,1,12-12A12,12,0,0,1,128,60Zm44,52a12,12,0,1,1,12-12A12,12,0,0,1,172,112Z" />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M212.92,20.84A8,8,0,0,0,206.33,20l-128,24A8,8,0,0,0,72,52V164.5a36,36,0,1,0,16,29.5V120l112-21v52.5a36,36,0,1,0,16,29.5V28A8,8,0,0,0,212.92,20.84Z" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.07,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z" />
    </svg>
  )
}

function PolymathIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M197.58,129.06l-51.61-19.63L126.34,58.2a8,8,0,0,0-14.86,0L91.94,109.43,40.33,129.06a8,8,0,0,0,0,14.91l51.61,19.63,19.59,51.23a8,8,0,0,0,14.86,0l19.63-51.23,51.56-19.63a8,8,0,0,0,0-14.91ZM218.83,72.17l-13-4.93-4.93-13a8,8,0,0,0-14.92,0l-4.93,13-13,4.93a8,8,0,0,0,0,14.92l13,4.93,4.93,13a8,8,0,0,0,14.92,0l4.93-13,13-4.93a8,8,0,0,0,0-14.92Z" />
    </svg>
  )
}
