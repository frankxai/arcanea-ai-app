'use client'

import { useState, useEffect } from 'react'

export type Guardian = {
  id: string
  name: string
  element: string
  personality: string
  color: string
  glowColor: string
  symbol: string
  description: string
  trait: string
}

const GUARDIANS: Guardian[] = [
  {
    id: 'draconia',
    name: 'Draconia',
    element: 'Fire',
    personality: 'fierce, passionate, transformative, and unyielding in pursuit of greatness',
    color: '#ef4444',
    glowColor: 'rgba(239,68,68,0.4)',
    symbol: '✦',
    description: 'Draconia breathes life into dormant embers, turning sparks of thought into blazing masterworks that reshape the world.',
    trait: 'Fierce Passion',
  },
  {
    id: 'leyla',
    name: 'Leyla',
    element: 'Water',
    personality: 'fluid, intuitive, emotionally deep, and endlessly adaptive',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.4)',
    symbol: '◈',
    description: 'Leyla flows through creative blocks like water through stone, shaping worlds with gentle persistence and deep emotional truth.',
    trait: 'Deep Intuition',
  },
  {
    id: 'lyssandria',
    name: 'Lyssandria',
    element: 'Earth',
    personality: 'grounded, methodical, abundant in wisdom, and deeply connected to ancient patterns',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.4)',
    symbol: '⬡',
    description: 'Lyssandria roots your creations in eternal truth, building on foundations that outlast civilizations and echo through ages.',
    trait: 'Ancient Wisdom',
  },
  {
    id: 'maylinn',
    name: 'Maylinn',
    element: 'Wind',
    personality: 'free-spirited, innovative, always seeking new horizons and breaking all boundaries',
    color: '#e2e8f0',
    glowColor: 'rgba(226,232,240,0.35)',
    symbol: '∿',
    description: 'Maylinn carries ideas on celestial currents, delivering inspiration from the very edges of the known universe.',
    trait: 'Boundless Freedom',
  },
]

const QUESTIONS = [
  {
    id: 'element',
    question: 'Which element calls to you?',
    options: [
      { label: 'Fire', sublabel: 'Bold & transformative', value: 'fire', color: '#ef4444', glow: 'rgba(239,68,68,0.25)', icon: <FireIcon /> },
      { label: 'Water', sublabel: 'Fluid & intuitive', value: 'water', color: '#3b82f6', glow: 'rgba(59,130,246,0.25)', icon: <WaterIcon /> },
      { label: 'Earth', sublabel: 'Grounded & enduring', value: 'earth', color: '#22c55e', glow: 'rgba(34,197,94,0.25)', icon: <EarthIcon /> },
      { label: 'Wind', sublabel: 'Free & innovative', value: 'wind', color: '#e2e8f0', glow: 'rgba(226,232,240,0.2)', icon: <WindIcon /> },
    ],
  },
  {
    id: 'approach',
    question: 'How do you approach creation?',
    options: [
      { label: 'Methodical', sublabel: 'Layer by layer, step by step', value: 'methodical', color: '#22c55e', glow: 'rgba(34,197,94,0.2)', icon: <MethodIcon /> },
      { label: 'Intuitive', sublabel: 'Follow emotion and feeling', value: 'feel', color: '#3b82f6', glow: 'rgba(59,130,246,0.2)', icon: <IntuitionIcon /> },
      { label: 'Collaborative', sublabel: 'Build with others and share', value: 'bold', color: '#0d47a1', glow: 'rgba(13,71,161,0.2)', icon: <CollabIcon /> },
      { label: 'Experimental', sublabel: 'Break rules, explore freely', value: 'explore', color: '#ef4444', glow: 'rgba(239,68,68,0.2)', icon: <ExploreIcon /> },
    ],
  },
  {
    id: 'inspiration',
    question: 'What drives your creative fire?',
    options: [
      { label: 'Stories', sublabel: 'Myths, legends, and lore', value: 'myths', color: '#ffd700', glow: 'rgba(255,215,0,0.2)', icon: <StoriesIcon /> },
      { label: 'Beauty', sublabel: 'Aesthetics and the sublime', value: 'nature', color: '#f472b6', glow: 'rgba(244,114,182,0.2)', icon: <BeautyIcon /> },
      { label: 'Innovation', sublabel: 'The unknown and the future', value: 'future', color: '#00bcd4', glow: 'rgba(0,188,212,0.2)', icon: <InnovationIcon /> },
      { label: 'Connection', sublabel: 'Human emotion and empathy', value: 'emotion', color: '#a78bfa', glow: 'rgba(167,139,250,0.2)', icon: <ConnectionIcon /> },
    ],
  },
]

function matchGuardian(answers: Record<string, string>): Guardian {
  const scores: Record<string, number> = { draconia: 0, leyla: 0, lyssandria: 0, maylinn: 0 }

  if (answers.element === 'fire') scores.draconia += 3
  if (answers.element === 'water') scores.leyla += 3
  if (answers.element === 'earth') scores.lyssandria += 3
  if (answers.element === 'wind') scores.maylinn += 3

  if (answers.approach === 'bold') { scores.draconia += 2; scores.leyla += 1 }
  if (answers.approach === 'feel') scores.leyla += 2
  if (answers.approach === 'methodical') scores.lyssandria += 2
  if (answers.approach === 'explore') scores.maylinn += 2

  if (answers.inspiration === 'myths') { scores.draconia += 1; scores.lyssandria += 1 }
  if (answers.inspiration === 'nature') { scores.leyla += 1; scores.lyssandria += 1 }
  if (answers.inspiration === 'emotion') { scores.leyla += 1.5 }
  if (answers.inspiration === 'future') { scores.maylinn += 2 }

  const topId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return GUARDIANS.find((g) => g.id === topId) || GUARDIANS[0]
}

interface Step3GuardianProps {
  onGuardianMatched: (guardian: Guardian) => void
  onNext: () => void
  onBack: () => void
}

export default function Step3Guardian({ onGuardianMatched, onNext, onBack }: Step3GuardianProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [questionVisible, setQuestionVisible] = useState(true)
  const [matchedGuardian, setMatchedGuardian] = useState<Guardian | null>(null)
  const [guardianVisible, setGuardianVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleAnswer = (value: string) => {
    if (selectedOption) return
    setSelectedOption(value)

    setTimeout(() => {
      const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: value }
      setAnswers(newAnswers)
      setQuestionVisible(false)
      setSelectedOption(null)

      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ((q) => q + 1)
          setQuestionVisible(true)
        } else {
          const guardian = matchGuardian(newAnswers)
          setMatchedGuardian(guardian)
          onGuardianMatched(guardian)
          setTimeout(() => setGuardianVisible(true), 150)
        }
      }, 300)
    }, 220)
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="text-center mb-6 animate-reveal-up">
        <div className="text-xs tracking-[0.3em] uppercase text-[#0d47a1] font-semibold mb-3 font-sans">
          Step 3 of 5
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
          {matchedGuardian ? 'Meet ' : 'Find Your '}
          <span className="text-gold-gradient">
            {matchedGuardian ? matchedGuardian.name : 'Intelligence'}
          </span>
        </h2>
        {!matchedGuardian && (
          <p className="text-[#7c7c9a] text-sm font-sans">
            Answer 3 questions to find the intelligence that fits how you think
          </p>
        )}
      </div>

      {!matchedGuardian ? (
        <div className="min-h-[320px]">
          {/* Quiz progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-400"
                style={{
                  width: i === currentQ ? '24px' : '8px',
                  height: '8px',
                  background:
                    i < currentQ
                      ? '#0d47a1'
                      : i === currentQ
                      ? '#ffd700'
                      : '#2a2a3e',
                  boxShadow: i === currentQ ? '0 0 10px rgba(255,215,0,0.6)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Question card */}
          <div
            style={{
              opacity: questionVisible ? 1 : 0,
              transform: questionVisible ? 'translateY(0)' : 'translateY(-14px)',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <div className="glass rounded-2xl p-5 mb-2">
              <p className="text-white font-serif text-lg font-semibold text-center mb-5">
                {QUESTIONS[currentQ]?.question}
              </p>

              {/* 2x2 grid for question 1 (elements), list for others */}
              {currentQ === 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {QUESTIONS[currentQ]?.options.map((opt) => {
                    const isSelected = selectedOption === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        className="group relative flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all duration-200 focus:outline-none"
                        style={{
                          background: isSelected ? `${opt.color}18` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? opt.color + '60' : 'rgba(255,255,255,0.07)'}`,
                          boxShadow: isSelected ? `0 0 20px ${opt.glow}` : 'none',
                          transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
                          style={{
                            background: `${opt.color}18`,
                            color: opt.color,
                          }}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold font-sans" style={{ color: opt.color }}>
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-[#6b6485] font-sans mt-0.5">
                            {opt.sublabel}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {QUESTIONS[currentQ]?.options.map((opt) => {
                    const isSelected = selectedOption === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        className="group flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 focus:outline-none"
                        style={{
                          background: isSelected ? `${opt.color}14` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? opt.color + '50' : 'rgba(255,255,255,0.07)'}`,
                          boxShadow: isSelected ? `0 0 14px ${opt.glow}` : 'none',
                          transform: isSelected ? 'scale(0.99)' : 'scale(1)',
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                          style={{ background: `${opt.color}18`, color: opt.color }}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold font-sans text-[#e8e6f0]">
                            {opt.label}
                          </div>
                          <div className="text-xs text-[#6b6485] font-sans leading-relaxed">
                            {opt.sublabel}
                          </div>
                        </div>
                        <div
                          className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity text-sm"
                          style={{ color: opt.color }}
                        >
                          →
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Guardian Reveal ── */
        <div
          style={{
            opacity: guardianVisible ? 1 : 0,
            transform: guardianVisible
              ? 'scale(1) translateY(0)'
              : 'scale(0.88) translateY(24px)',
            filter: guardianVisible ? 'blur(0)' : 'blur(10px)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.8s ease',
          }}
        >
          <div
            className="relative rounded-3xl p-6 mb-5 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${matchedGuardian.color}16, ${matchedGuardian.color}06)`,
              border: `1px solid ${matchedGuardian.color}40`,
              boxShadow: `0 0 50px ${matchedGuardian.glowColor}, inset 0 1px 0 ${matchedGuardian.color}15`,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute top-0 right-0 w-56 h-56 rounded-full blur-[80px] pointer-events-none"
              style={{ background: matchedGuardian.glowColor, opacity: 0.25 }}
            />
            <div
              className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
              style={{ background: matchedGuardian.glowColor, opacity: 0.15 }}
            />

            {/* Guardian emblem */}
            <div className="text-center mb-4 relative">
              <div className="relative inline-block">
                <div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-serif mb-3 relative"
                  style={{
                    background: `radial-gradient(circle, ${matchedGuardian.color}28, ${matchedGuardian.color}08)`,
                    border: `1.5px solid ${matchedGuardian.color}50`,
                    boxShadow: `0 0 40px ${matchedGuardian.glowColor}, 0 0 80px ${matchedGuardian.glowColor}`,
                    color: matchedGuardian.color,
                  }}
                >
                  {matchedGuardian.symbol}
                  {/* Orbiting ring */}
                  <div
                    className="absolute inset-[-6px] rounded-full animate-spin-slow"
                    style={{ border: `1px dashed ${matchedGuardian.color}25` }}
                  />
                </div>
              </div>

              <div
                className="text-xs tracking-[0.3em] uppercase font-sans font-semibold mb-1"
                style={{ color: matchedGuardian.color }}
              >
                Guardian of {matchedGuardian.element}
              </div>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">
                {matchedGuardian.name}
              </h3>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-sans"
                style={{
                  background: matchedGuardian.color + '1a',
                  border: `1px solid ${matchedGuardian.color}30`,
                  color: matchedGuardian.color,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51-31,51.07,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z" />
                </svg>
                {matchedGuardian.trait}
              </div>
            </div>

            <p className="text-[#a09ab8] text-sm font-sans leading-relaxed text-center relative">
              {matchedGuardian.description}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-[#2a2a3e] text-[#7c7c9a] text-sm font-sans font-medium transition-all duration-200 hover:border-[#0d47a1]/40 hover:text-[#a78bfa]"
        >
          Back
        </button>
        {matchedGuardian && (
          <button
            onClick={onNext}
            className="flex-[2] py-3 rounded-xl text-sm font-sans font-semibold text-white transition-all duration-300 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${matchedGuardian.color}, ${matchedGuardian.color}cc)`,
              boxShadow: `0 0 24px ${matchedGuardian.glowColor}`,
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative">Start Creating</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Question Icons ── */

function FireIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M181.23,172.94C170.18,198.47,145.5,216,128,216a72,72,0,0,1-72-72c0-57.23,55.47-105,81.71-126.06a8,8,0,0,1,10.58,12C124.49,48.4,72,91.86,72,144a56.06,56.06,0,0,0,56,56c13,0,33.11-14.28,41.63-34.69a48.09,48.09,0,0,0,2.54-27.18C168.59,124.82,162,111,155.89,99.41A88.37,88.37,0,0,1,144,56c0-12.09,3-22.51,8.34-33.63a8,8,0,0,1,13.77,8.1C161.39,40.1,160,47.3,160,56a71.85,71.85,0,0,0,9.22,34.85c5.56,9.84,12.38,21.2,15.91,34.17A64.31,64.31,0,0,1,181.23,172.94Z" />
    </svg>
  )
}

function WaterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75ZM128,216a72.08,72.08,0,0,1-72-72c0-57.23,55.47-105,72-118.29C144.53,39,200,87,200,144A72.08,72.08,0,0,1,128,216Zm55.89-62.66a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.77,2.68Z" />
    </svg>
  )
}

function EarthIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M246,186.65l-48-112A8,8,0,0,0,184,72H136V48h8a8,8,0,0,0,0-16H112a8,8,0,0,0,0,16h8V72H72A8,8,0,0,0,58,74.65l-48,112A8,8,0,0,0,16,200a8,8,0,0,0,8,8H232a8,8,0,0,0,8-8A8,8,0,0,0,246,186.65ZM34.67,192,74,98.63,96.43,152H76a8,8,0,0,0,0,16h104a8,8,0,0,0,0-16H159.57L182,98.63,221.33,192Z" />
    </svg>
  )
}

function WindIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 256 256" fill="currentColor">
      <path d="M184,72a32,32,0,0,0-32-32,8,8,0,0,0,0,16,16,16,0,1,1,16,16H24a8,8,0,0,0,0,16H168A32,32,0,0,0,184,72Zm24,56H24a8,8,0,0,0,0,16H208a16,16,0,1,1-16,16,8,8,0,0,0-16,0,32,32,0,1,0,32-32Zm-48,72H24a8,8,0,0,0,0,16H160a16,16,0,1,1-16-16,8,8,0,0,0,0-16,32,32,0,1,0,32,32A32,32,0,0,0,160,200Z" />
    </svg>
  )
}

function MethodIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </svg>
  )
}

function IntuitionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M174,47.75a254.19,254.19,0,0,0-41.45-38.3,8,8,0,0,0-9.18,0A254.19,254.19,0,0,0,82,47.75C54.51,79.32,40,112.6,40,144a88,88,0,0,0,176,0C216,112.6,201.49,79.32,174,47.75Z" />
    </svg>
  )
}

function CollabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1-7.37-4.89,8,8,0,0,1,1.75-8.78l.28-.28a8,8,0,0,1,11.31,0A56,56,0,0,1,256,160,8,8,0,0,1,244.8,150.4ZM192,72a40,40,0,1,1,40,40A40,40,0,0,1,192,72Zm-24,64a8,8,0,0,0-8-8H96a8,8,0,0,0-8,8c0,44.18,22.4,80,56,80S224,180.18,224,136ZM136,200c-18.48,0-34.62-18.32-39.12-48h78.24C170.62,181.68,154.48,200,136,200ZM40,112A40,40,0,1,0,0,72,40,40,0,0,0,40,112Z" />
    </svg>
  )
}

function ExploreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Zm-80-8H104a8,8,0,0,0,0,16h24v24a8,8,0,0,0,16,0V120A8,8,0,0,0,136,120Zm0-48a12,12,0,1,0,12,12A12,12,0,0,0,136,72Z" />
    </svg>
  )
}

function StoriesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80H88a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16Zm0,32H88a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16Z" />
    </svg>
  )
}

function BeautyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M200.77,53.89A103.27,103.27,0,0,0,128,24h-1.07A104,104,0,0,0,24,128c0,43,26.58,79.06,69.36,94.17A32,32,0,0,0,136,192a16,16,0,0,1,16-16h46.21a31.81,31.81,0,0,0,31.2-24.88,104.43,104.43,0,0,0,2.59-24A103.28,103.28,0,0,0,200.77,53.89Z" />
    </svg>
  )
}

function InnovationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,1,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,1-6.23-12.66A87.59,87.59,0,0,1,40,104a88,88,0,0,1,176,0Z" />
    </svg>
  )
}

function ConnectionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
      <path d="M178,40c-20.09,0-37.92,7.93-49.9,20.89C116,48,98.07,40,78,40a68,68,0,0,0-68,68c0,70.76,109.39,146.26,113.83,149.21a8,8,0,0,0,8.34,0C136.61,254.26,246,178.76,246,108A68.07,68.07,0,0,0,178,40Z" />
    </svg>
  )
}
