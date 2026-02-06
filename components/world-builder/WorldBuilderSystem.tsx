'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Crown } from 'lucide-react'

export default function WorldBuilderSystem() {
  return (
    <div className="min-h-screen bg-cosmic-void">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-arcane-earth/10 border border-arcane-earth/20 mb-6">
            <Globe className="w-8 h-8 text-arcane-earth" />
          </div>
          <h1 className="text-fluid-4xl font-display text-gradient-cosmic mb-4">
            World Builder
          </h1>
          <p className="text-text-secondary text-lg font-body max-w-xl mx-auto">
            Create immersive worlds with Guardian guidance
          </p>
        </motion.div>
      </div>
    </div>
  )
}
