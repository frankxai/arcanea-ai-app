'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GuardianConfig } from '@/types/guardian'
import {
  Sparkles,
  UserPlus,
  MapPin,
  BookOpen,
  Zap,
} from 'lucide-react'

// Dynamic imports for Three.js components (SSR disabled)
const SpatialStudio = dynamic(
  () => import('@/components/spatial-studio').then((mod) => mod.SpatialStudio),
  { ssr: false }
)
const GuardianEntity = dynamic(
  () => import('@/components/guardian-entity').then((mod) => mod.GuardianEntity),
  { ssr: false }
)
const GuardianRealm = dynamic(
  () => import('@/components/guardian-entity').then((mod) => mod.GuardianRealm),
  { ssr: false }
)
const OrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
)
const Environment = dynamic(
  () => import('@react-three/drei').then((mod) => mod.Environment),
  { ssr: false }
)
const ContactShadows = dynamic(
  () => import('@react-three/drei').then((mod) => mod.ContactShadows),
  { ssr: false }
)

const guardians: GuardianConfig[] = [
  {
    name: 'Draconia',
    element: 'fire',
    frequency: 528,
    description: 'Guardian of transformation and creative fire',
    power: 85,
  },
  {
    name: 'Lyssandria',
    element: 'earth',
    frequency: 396,
    description: 'Guardian of foundation and security',
    power: 75,
  },
  {
    name: 'Maylinn',
    element: 'water',
    frequency: 639,
    description: 'Guardian of heart and community',
    power: 90,
  },
  {
    name: 'Alera',
    element: 'wind',
    frequency: 741,
    description: 'Guardian of voice and communication',
    power: 70,
  },
  {
    name: 'Aiyami',
    element: 'void',
    frequency: 963,
    description: 'Guardian of crown and architecture',
    power: 95,
  },
]

export default function SpatialStudioPage() {
  const [activeGuardian, setActiveGuardian] = useState<string>('Draconia')
  const [isInteracting, setIsInteracting] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const selectedGuardian = guardians.find((g) => g.name === activeGuardian)

  return (
    <div className="w-full h-screen relative bg-cosmic-void">
      {/* Header controls */}
      <div className="absolute top-4 right-4 z-20 glass-strong rounded-2xl p-5 max-w-sm">
        <h1 className="text-xl font-display text-white mb-4">
          Spatial Worldbuilding Studio
        </h1>

        <div className="space-y-4">
          <div className="text-text-secondary text-sm font-sans font-medium">Active Guardian:</div>

          {/* Guardian selection */}
          <div className="grid grid-cols-2 gap-2">
            {guardians.map((guardian) => (
              <button
                key={guardian.name}
                onClick={() => setActiveGuardian(guardian.name)}
                className={`px-3 py-2 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                  activeGuardian === guardian.name
                    ? 'bg-gradient-to-r from-arcane-crystal/20 to-arcane-water/20 border border-arcane-crystal/30 text-white'
                    : 'bg-white/[0.03] border border-white/5 text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                {guardian.name}
              </button>
            ))}
          </div>

          {/* Selected guardian info */}
          {selectedGuardian && (
            <div className="glow-card rounded-xl p-4">
              <div className="text-white font-display text-sm mb-1">{selectedGuardian.name}</div>
              <div className="text-text-muted text-xs font-body mb-2">
                {selectedGuardian.description}
              </div>
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="text-text-muted">
                  Frequency: {selectedGuardian.frequency} Hz
                </span>
                <Badge variant="fire" className="text-xs">
                  Power: {selectedGuardian.power}%
                </Badge>
              </div>
            </div>
          )}

          {/* Creation tools */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-text-secondary text-sm font-sans font-medium mb-3">
              Creation Tools:
            </div>
            <div className="space-y-2">
              {[
                { icon: UserPlus, label: 'Create Character' },
                { icon: MapPin, label: 'Design Location' },
                { icon: BookOpen, label: 'Craft Story' },
              ].map((tool) => (
                <Button
                  key={tool.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-text-secondary hover:text-white font-sans"
                >
                  <tool.icon className="w-4 h-4 mr-2" />
                  {tool.label}
                </Button>
              ))}
              <Button variant="fire" size="sm" className="w-full font-sans">
                <Zap className="w-4 h-4 mr-2" />
                Begin Creation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Spatial Interface */}
      {isClient && selectedGuardian && (
        <SpatialStudio enableVR={true} enableAR={false}>
          <GuardianRealm guardian={selectedGuardian}>
            <GuardianEntity
              guardian={selectedGuardian!}
              isActive={true}
              onClick={() => setIsInteracting(!isInteracting)}
              position={[0, 1, 0]}
            />

            {/* Creation manifestation nodes */}
            <group position={[3, 0.5, -2]}>
              <mesh rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color="#7fffd4"
                  emissive="#7fffd4"
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <ContactShadows position={[0, -0.5, 0]} opacity={0.3} />
            </group>

            <group position={[-3, 0.5, -2]}>
              <mesh rotation={[0, -Math.PI / 4, 0]}>
                <tetrahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color="#ffd700"
                  emissive="#ffd700"
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <ContactShadows position={[0, -0.5, 0]} opacity={0.3} />
            </group>

            <group position={[0, 0.5, -4]}>
              <mesh rotation={[0, 0, Math.PI / 6]}>
                <octahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                  color="#78a6ff"
                  emissive="#78a6ff"
                  emissiveIntensity={0.25}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <ContactShadows position={[0, -0.5, 0]} opacity={0.3} />
            </group>

            {/* Energy flow connections */}
            {isInteracting && <EnergyFlowNodes guardian={selectedGuardian!} />}
          </GuardianRealm>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />

          <Environment preset="night" />
        </SpatialStudio>
      )}

      {/* Interactive status */}
      {isInteracting && (
        <div className="absolute bottom-4 left-4 z-20 glass-strong rounded-2xl p-4 max-w-sm border-arcane-crystal/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-arcane-crystal rounded-full animate-pulse" />
            <span className="text-white font-sans font-medium text-sm">
              {selectedGuardian?.name} Active
            </span>
          </div>
          <p className="text-text-secondary text-sm font-body">
            Guardian is ready to guide your creation. Choose a creation tool to begin.
          </p>
        </div>
      )}
    </div>
  )
}

function EnergyFlowNodes({ guardian }: { guardian: GuardianConfig }) {
  return (
    <group>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 1, 0, 3, 0.5, -2]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7fffd4" opacity={0.6} transparent />
      </line>

      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 1, 0, -3, 0.5, -2]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffd700" opacity={0.6} transparent />
      </line>

      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 1, 0, 0, 0.5, -4]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#78a6ff" opacity={0.6} transparent />
      </line>
    </group>
  )
}
