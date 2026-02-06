'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { Sparkles, ExternalLink } from 'lucide-react'

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'AI Chat', href: '/chat' },
      { label: 'Generation Suite', href: '/imagine' },
      { label: 'Worldbuilding', href: '/create' },
      { label: 'Spatial Studio', href: '/studio' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'World Gallery', href: '/gallery' },
      { label: 'Templates', href: '/templates' },
      { label: 'Challenges', href: '/challenges' },
      { label: 'Discord', href: 'https://discord.gg/arcanea', external: true },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'API Documentation', href: '/docs', external: true },
      { label: 'SDK', href: '/sdk', external: true },
      { label: 'GitHub', href: 'https://github.com/arcanea', external: true },
      { label: 'Status', href: '/status' },
    ],
  },
] as const

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, margin: '-50px' })

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-white/5"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-void to-cosmic-deep/80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-arcane-crystal to-arcane-fire rounded-xl flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display text-white group-hover:text-arcane-crystal transition-colors duration-300">
                Arcanea
              </span>
              <Badge
                variant="crystal"
                className="text-[10px] px-1.5 py-0.5 border-arcane-crystal/20 text-arcane-crystal/70 font-sans"
              >
                AI
              </Badge>
            </Link>

            <p className="text-text-muted font-body text-sm leading-relaxed max-w-sm mb-6">
              The definitive AI platform for creative worldbuilding. Multi-LLM superagent,
              multi-modal generation, and Guardian AI companions — all unified in one
              intelligent spatial platform.
            </p>

            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-sans text-text-muted">All systems operational</span>
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={staggerItem}>
              <h4 className="text-sm font-sans font-semibold text-white mb-4 tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-sans text-text-muted hover:text-arcane-crystal transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm font-sans text-text-muted hover:text-arcane-crystal transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted font-sans">
            &copy; {new Date().getFullYear()} Arcanea AI Platform. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-sans text-text-muted hover:text-arcane-crystal transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
