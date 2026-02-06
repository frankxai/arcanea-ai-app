'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useState, useRef } from 'react'
import { Badge } from '@/components/ui/badge'

export interface PerformanceStats {
  fps: number
  memory: number
  drawCalls: number
  quality: 'low' | 'medium' | 'high'
}

interface PerformanceMonitorProps {
  onStatsUpdate: (stats: PerformanceStats) => void
}

export function PerformanceMonitor({ onStatsUpdate }: PerformanceMonitorProps) {
  const { gl } = useThree()
  const statsRef = useRef({
    fps: 60,
    frameCount: 0,
    lastTime: performance.now(),
    memory: 0
  })

  useFrame(() => {
    const now = performance.now()
    const delta = now - statsRef.current.lastTime
    statsRef.current.frameCount++

    if (delta >= 1000) {
      const fps = Math.round((statsRef.current.frameCount * 1000) / delta)

      let memory = 0
      interface PerformanceMemory {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
      }

      interface ExtendedPerformance extends Performance {
        memory?: PerformanceMemory
      }

      const extPerformance = performance as ExtendedPerformance
      if (extPerformance.memory) {
        memory = Math.round(extPerformance.memory.usedJSHeapSize / 1048576)
      }

      const stats: PerformanceStats = {
        fps,
        memory,
        drawCalls: gl.info.render.calls,
        quality: fps >= 50 ? 'high' : fps >= 30 ? 'medium' : 'low'
      }

      onStatsUpdate(stats)

      statsRef.current.frameCount = 0
      statsRef.current.lastTime = now
      statsRef.current.memory = memory
    }
  })

  return null
}

interface AdaptiveRenderingProps {
  quality: 'low' | 'medium' | 'high'
}

export function AdaptiveRendering({ quality }: AdaptiveRenderingProps) {
  const { gl, camera } = useThree()

  useEffect(() => {
    switch (quality) {
      case 'low':
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1))
        gl.shadowMap.enabled = false
        camera.far = 30
        break
      case 'medium':
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        gl.shadowMap.enabled = true
        gl.shadowMap.type = 2
        camera.far = 50
        break
      case 'high':
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        gl.shadowMap.enabled = true
        gl.shadowMap.type = 3
        camera.far = 100
        break
    }
  }, [quality, gl, camera])

  return null
}

export function PerformancePanel({ stats }: { stats: PerformanceStats }) {
  const getQualityVariant = (quality: string) => {
    switch (quality) {
      case 'high': return 'earth' as const
      case 'medium': return 'gold' as const
      case 'low': return 'fire' as const
      default: return 'crystal' as const
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 glass-strong rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-arcane-earth rounded-full animate-pulse" />
        <span className="text-arcane-crystal text-xs font-display">Performance</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-text-muted">FPS:</span>
          <span className={`font-mono ${
            stats.fps >= 50 ? 'text-arcane-earth' :
            stats.fps >= 30 ? 'text-arcane-gold' : 'text-arcane-fire'
          }`}>
            {stats.fps}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted">Quality:</span>
          <Badge variant={getQualityVariant(stats.quality)} className="text-xs">
            {stats.quality}
          </Badge>
        </div>

        {stats.memory > 0 && (
          <div className="flex items-center gap-2 col-span-2">
            <span className="text-text-muted">Memory:</span>
            <span className={`font-mono ${
              stats.memory < 100 ? 'text-arcane-earth' :
              stats.memory < 200 ? 'text-arcane-gold' : 'text-arcane-fire'
            }`}>
              {stats.memory}MB
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 col-span-2">
          <span className="text-text-muted">Draw Calls:</span>
          <span className="font-mono text-arcane-crystal">{stats.drawCalls}</span>
        </div>
      </div>
    </div>
  )
}
