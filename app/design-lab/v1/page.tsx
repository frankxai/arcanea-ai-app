'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  staggerContainer,
  staggerItem,
  cosmicFadeIn,
  cosmicFadeInUp,
  scrollReveal,
  fadeInViewport,
  heroTitle,
  heroSubtitle,
} from '@/lib/animations'
import {
  Palette,
  Copy,
  Check,
  Type,
  ArrowRight,
  Sparkles,
  Eye,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Moon,
  Sun,
  Crown,
} from 'lucide-react'

// ============================================
// COLOR DATA
// ============================================

const cosmicPalette = [
  { name: 'Void', token: 'cosmic-void', hex: '#0b0e14', desc: 'Deepest background' },
  { name: 'Deep', token: 'cosmic-deep', hex: '#121826', desc: 'Card backgrounds' },
  { name: 'Surface', token: 'cosmic-surface', hex: '#1a2332', desc: 'Elevated surfaces' },
  { name: 'Raised', token: 'cosmic-raised', hex: '#242f42', desc: 'Interactive elements' },
  { name: 'Elevated', token: 'cosmic-elevated', hex: '#2d3a52', desc: 'Hover states' },
  { name: 'Overlay', token: 'cosmic-overlay', hex: '#364562', desc: 'Popover surfaces' },
]

const elementalColors = [
  { name: 'Crystal', token: 'arcane-crystal', hex: '#7fffd4', bright: '#99ffe0', deep: '#5ce6b8', icon: Sparkles },
  { name: 'Fire', token: 'arcane-fire', hex: '#ff6b35', bright: '#ff8c5a', deep: '#d94e1f', icon: Flame },
  { name: 'Water', token: 'arcane-water', hex: '#78a6ff', bright: '#9dbfff', deep: '#5a8ce6', icon: Droplets },
  { name: 'Void', token: 'arcane-void', hex: '#9966ff', bright: '#b38cff', deep: '#7a4dcc', icon: Moon },
  { name: 'Gold', token: 'arcane-gold', hex: '#ffd700', bright: '#ffe44d', deep: '#ccac00', icon: Crown },
  { name: 'Wind', token: 'arcane-wind', hex: '#00ff88', bright: '#33ffaa', deep: '#00cc6d', icon: Wind },
  { name: 'Earth', token: 'arcane-earth', hex: '#8b7355', bright: '#a89070', deep: '#6e5940', icon: Mountain },
]

const textHierarchy = [
  { name: 'Primary', token: 'text-primary', hex: '#e6eefc', desc: 'Headings, key content' },
  { name: 'Secondary', token: 'text-secondary', hex: '#9bb1d0', desc: 'Body text, descriptions' },
  { name: 'Muted', token: 'text-muted', hex: '#708094', desc: 'Captions, metadata' },
  { name: 'Disabled', token: 'text-disabled', hex: '#515b6b', desc: 'Inactive states' },
]

const academyColors = [
  { name: 'Atlantean Primary', token: 'arcane-atlantean-primary', hex: '#0f3566' },
  { name: 'Atlantean Glow', token: 'arcane-atlantean-glow', hex: '#00e6e6' },
  { name: 'Atlantean Bio', token: 'arcane-atlantean-bio', hex: '#26cccc' },
  { name: 'Draconic Primary', token: 'arcane-draconic-primary', hex: '#d92952' },
  { name: 'Draconic Gold', token: 'arcane-draconic-gold', hex: '#ffc61a' },
  { name: 'Creation Primary', token: 'arcane-creation-primary', hex: '#ffcc33' },
  { name: 'Creation Glow', token: 'arcane-creation-glow', hex: '#ffffff' },
]

const semanticColors = [
  { name: 'Success', hex: '#20cc73', desc: 'Confirmations, positive' },
  { name: 'Warning', hex: '#ffa500', desc: 'Caution, attention' },
  { name: 'Error', hex: '#f52952', desc: 'Errors, destructive' },
  { name: 'Info', hex: '#26b8e6', desc: 'Informational' },
]

const fluidSizes = [
  { name: 'fluid-xs', clamp: 'clamp(0.7rem, 0.65rem + 0.25vw, 0.8rem)', sample: 'Metadata & Fine Print' },
  { name: 'fluid-sm', clamp: 'clamp(0.8rem, 0.75rem + 0.25vw, 0.9rem)', sample: 'Captions & Labels' },
  { name: 'fluid-base', clamp: 'clamp(0.9rem, 0.85rem + 0.25vw, 1rem)', sample: 'Body text and paragraphs' },
  { name: 'fluid-lg', clamp: 'clamp(1.1rem, 1rem + 0.5vw, 1.25rem)', sample: 'Lead paragraphs' },
  { name: 'fluid-xl', clamp: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', sample: 'Section introductions' },
  { name: 'fluid-2xl', clamp: 'clamp(1.5rem, 1.25rem + 1.25vw, 2rem)', sample: 'Sub-headings' },
  { name: 'fluid-3xl', clamp: 'clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)', sample: 'Section Titles' },
  { name: 'fluid-4xl', clamp: 'clamp(2.25rem, 1.75rem + 2.5vw, 3rem)', sample: 'Page Titles' },
  { name: 'fluid-5xl', clamp: 'clamp(3rem, 2rem + 5vw, 4.5rem)', sample: 'Display' },
  { name: 'fluid-hero', clamp: 'clamp(3rem, 1.5rem + 7.5vw, 7rem)', sample: 'HERO' },
]

// ============================================
// COMPONENTS
// ============================================

function ColorSwatch({ name, token, hex, desc, size = 'md' }: {
  name: string
  token: string
  hex: string
  desc?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [copied, setCopied] = useState(false)

  const copyHex = useCallback(() => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [hex])

  const sizeClasses = {
    sm: 'h-14 w-full',
    md: 'h-20 w-full',
    lg: 'h-28 w-full',
  }

  return (
    <motion.button
      onClick={copyHex}
      variants={staggerItem}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group text-left w-full"
    >
      <div
        className={`${sizeClasses[size]} rounded-xl border border-white/10 group-hover:border-arcane-crystal/30 transition-all duration-300 relative overflow-hidden`}
        style={{ backgroundColor: hex }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-sm">
          {copied ? (
            <Check className="w-5 h-5 text-arcane-crystal" />
          ) : (
            <Copy className="w-4 h-4 text-white/80" />
          )}
        </div>
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-sm font-sans font-medium text-text-primary">{name}</p>
        <p className="text-xs font-mono text-arcane-crystal/70">{hex}</p>
        {token && (
          <p className="text-[10px] font-mono text-text-muted">{token}</p>
        )}
        {desc && (
          <p className="text-xs text-text-muted font-sans">{desc}</p>
        )}
      </div>
    </motion.button>
  )
}

function ElementalColorCard({ name, token, hex, bright, deep, icon: Icon }: {
  name: string
  token: string
  hex: string
  bright: string
  deep: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyColor = useCallback((color: string) => {
    navigator.clipboard.writeText(color)
    setCopied(color)
    setTimeout(() => setCopied(null), 1500)
  }, [])

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 group hover:border-arcane-crystal/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${hex}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: hex }} />
        </div>
        <div>
          <h4 className="font-display text-white text-sm">{name}</h4>
          <p className="text-xs font-mono text-text-muted">{token}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { label: 'Deep', color: deep },
          { label: 'Base', color: hex },
          { label: 'Bright', color: bright },
        ].map(({ label, color }) => (
          <button
            key={label}
            onClick={() => copyColor(color)}
            className="flex-1 group/swatch"
          >
            <div
              className="h-12 rounded-lg border border-white/5 hover:border-white/20 transition-all duration-200 relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/swatch:opacity-100 transition-opacity bg-black/30">
                {copied === color ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <Copy className="w-3 h-3 text-white/70" />
                )}
              </div>
            </div>
            <p className="text-[10px] font-sans text-text-muted mt-1 text-center">{label}</p>
            <p className="text-[10px] font-mono text-text-disabled text-center">{color}</p>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================
// PAGE
// ============================================

export default function DesignLabV1() {
  return (
    <div className="space-y-20 pb-20">
      {/* === HERO === */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center space-y-6"
      >
        <motion.div variants={cosmicFadeIn}>
          <Badge variant="crystal" className="font-sans">
            <Palette className="w-3 h-3 mr-1" />
            V1 &mdash; Foundation
          </Badge>
        </motion.div>

        <motion.h1
          variants={heroTitle}
          className="text-fluid-4xl md:text-fluid-5xl font-display text-gradient-crystal"
        >
          Colors & Typography
        </motion.h1>

        <motion.p
          variants={heroSubtitle}
          className="text-fluid-lg text-text-secondary font-body max-w-2xl mx-auto leading-relaxed"
        >
          The visual language of Arcanea. A cosmic color system drawn from elemental forces
          and a fluid type scale that breathes across every viewport.
        </motion.p>
      </motion.section>

      {/* === COSMIC PALETTE === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-crystal/10 flex items-center justify-center">
              <Moon className="w-4 h-4 text-arcane-crystal" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">Cosmic Palette</h2>
              <p className="text-sm font-sans text-text-muted">
                Six depth layers from the void to the surface. Click any swatch to copy.
              </p>
            </div>
          </div>

          {/* Full-width gradient strip */}
          <div className="h-16 rounded-2xl overflow-hidden flex">
            {cosmicPalette.map((color) => (
              <div
                key={color.token}
                className="flex-1 transition-all duration-300 hover:flex-[2]"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>

          {/* Individual swatches */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-4"
          >
            {cosmicPalette.map((color) => (
              <ColorSwatch key={color.token} {...color} size="lg" />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === ELEMENTAL COLORS === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-fire/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-arcane-fire" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">Elemental Colors</h2>
              <p className="text-sm font-sans text-text-muted">
                Each element has three variants: deep, base, and bright.
              </p>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {elementalColors.map((color) => (
              <ElementalColorCard key={color.token} {...color} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === TEXT HIERARCHY === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-water/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-arcane-water" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">Text Hierarchy</h2>
              <p className="text-sm font-sans text-text-muted">
                Four levels of text emphasis for clear information architecture.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {textHierarchy.map((item) => (
              <motion.div
                key={item.token}
                variants={staggerItem}
                className="glass rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl border border-white/10 flex-shrink-0"
                    style={{ backgroundColor: item.hex }}
                  />
                  <div>
                    <p className="text-lg font-body" style={{ color: item.hex }}>
                      {item.name} &mdash; {item.desc}
                    </p>
                    <p className="text-xs font-mono text-text-muted mt-1">
                      color: {item.token} | {item.hex}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-sans" style={{ color: item.hex }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === ACADEMY & SEMANTIC COLORS === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Academy Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-arcane-gold/10 flex items-center justify-center">
                <Crown className="w-4 h-4 text-arcane-gold" />
              </div>
              <h3 className="text-fluid-xl font-display text-white">Academy Colors</h3>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 sm:grid-cols-4 gap-3"
            >
              {academyColors.map((color) => (
                <ColorSwatch key={color.token} {...color} size="sm" />
              ))}
            </motion.div>
          </div>

          {/* Semantic Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Sun className="w-4 h-4 text-arcane-gold" />
              </div>
              <h3 className="text-fluid-xl font-display text-white">Semantic Colors</h3>
            </div>
            <div className="space-y-3">
              {semanticColors.map((color) => (
                <div
                  key={color.name}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-sans font-medium text-white">{color.name}</p>
                    <p className="text-xs text-text-muted">{color.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted">{color.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === GRADIENT TEXT === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-void/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-arcane-void-bright" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">Gradient Text</h2>
              <p className="text-sm font-sans text-text-muted">
                Four gradient presets for headlines and accent text.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: 'Crystal', className: 'text-gradient-crystal', token: 'text-gradient-crystal' },
              { name: 'Fire', className: 'text-gradient-fire', token: 'text-gradient-fire' },
              { name: 'Cosmic', className: 'text-gradient-cosmic', token: 'text-gradient-cosmic' },
              { name: 'Gold', className: 'text-gradient-gold', token: 'text-gradient-gold' },
            ].map((gradient) => (
              <motion.div
                key={gradient.name}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-8 text-center space-y-3"
              >
                <p className={`text-fluid-3xl font-display ${gradient.className}`}>
                  {gradient.name}
                </p>
                <p className="text-xs font-mono text-text-muted">.{gradient.token}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === TYPOGRAPHY SCALE === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-crystal/10 flex items-center justify-center">
              <Type className="w-4 h-4 text-arcane-crystal" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">Fluid Type Scale</h2>
              <p className="text-sm font-sans text-text-muted">
                10 sizes using <span className="font-mono text-arcane-crystal/70">clamp()</span>
                &mdash; fluid from mobile to 4K.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {fluidSizes.map((size, i) => (
              <motion.div
                key={size.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 group hover:border-arcane-crystal/20 transition-all"
              >
                <div className="sm:w-32 flex-shrink-0">
                  <span className="text-xs font-mono text-arcane-crystal">.text-{size.name}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`text-${size.name} font-display text-white truncate`}>
                    {size.sample}
                  </p>
                </div>
                <div className="sm:w-72 flex-shrink-0 hidden lg:block">
                  <span className="text-[10px] font-mono text-text-disabled">{size.clamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === FONT FAMILIES === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <h2 className="text-fluid-2xl font-display text-white">Font Families</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Cinzel',
                token: 'font-display',
                usage: 'Headlines, Titles, Gates',
                sample: 'The First Dawn Illuminates',
                sampleClass: 'font-display text-fluid-2xl text-white',
              },
              {
                name: 'Crimson Pro',
                token: 'font-body',
                usage: 'Body text, Library content',
                sample: 'Through the gates of creation, every soul discovers its light.',
                sampleClass: 'font-body text-fluid-lg text-text-secondary',
              },
              {
                name: 'Inter',
                token: 'font-sans',
                usage: 'UI labels, navigation, metadata',
                sample: 'Dashboard settings and interface elements',
                sampleClass: 'font-sans text-fluid-base text-text-secondary',
              },
              {
                name: 'JetBrains Mono',
                token: 'font-mono',
                usage: 'Code, tokens, technical values',
                sample: 'const arcane = { crystal: "#7fffd4" }',
                sampleClass: 'font-mono text-fluid-sm text-arcane-crystal',
              },
            ].map((font) => (
              <motion.div
                key={font.name}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-6 space-y-4 hover:border-arcane-crystal/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-white">{font.name}</h3>
                  <Badge variant="crystal" className="font-mono text-[10px]">
                    {font.token}
                  </Badge>
                </div>
                <p className="text-xs font-sans text-text-muted">{font.usage}</p>
                <div className="border-t border-white/5 pt-4">
                  <p className={font.sampleClass}>{font.sample}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === CSS CUSTOM PROPERTIES === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <h2 className="text-fluid-2xl font-display text-white">CSS Custom Properties</h2>
          <p className="text-text-secondary font-body">
            All design tokens are available as CSS variables on <span className="font-mono text-arcane-crystal">:root</span>.
          </p>

          <div className="glass rounded-2xl p-6 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code>
                <span className="text-arcane-void-bright">{':root'}</span> {'{\n'}
                {'  '}<span className="text-text-muted">/* Cosmic palette */</span>{'\n'}
                {'  '}<span className="text-arcane-crystal">--cosmic-void</span>: <span className="text-arcane-gold">#0b0e14</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--cosmic-deep</span>: <span className="text-arcane-gold">#121826</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--cosmic-surface</span>: <span className="text-arcane-gold">#1a2332</span>;{'\n'}
                {'\n'}
                {'  '}<span className="text-text-muted">/* Elemental accents */</span>{'\n'}
                {'  '}<span className="text-arcane-crystal">--arcane-crystal</span>: <span className="text-arcane-gold">#7fffd4</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--arcane-fire</span>: <span className="text-arcane-gold">#ff6b35</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--arcane-water</span>: <span className="text-arcane-gold">#78a6ff</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--arcane-void</span>: <span className="text-arcane-gold">#9966ff</span>;{'\n'}
                {'\n'}
                {'  '}<span className="text-text-muted">/* Glass tokens */</span>{'\n'}
                {'  '}<span className="text-arcane-crystal">--glass-bg</span>: <span className="text-arcane-gold">rgba(18, 24, 38, 0.7)</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--glass-border</span>: <span className="text-arcane-gold">rgba(127, 255, 212, 0.15)</span>;{'\n'}
                {'  '}<span className="text-arcane-crystal">--glass-blur</span>: <span className="text-arcane-gold">16px</span>;{'\n'}
                {'}'}
              </code>
            </pre>
          </div>
        </div>
      </motion.section>

      {/* === NAVIGATION === */}
      <motion.div
        {...fadeInViewport}
        variants={cosmicFadeInUp}
        className="flex items-center justify-between pt-8"
      >
        <div />
        <Link href="/design-lab/v2">
          <Button variant="crystal" size="lg" className="group">
            V2: Components
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
