"use client"

import { useState } from "react"
import {
  Sparkle,
  PaintBrush,
  VideoCamera,
  MusicNote,
  Code,
  Plus,
  FolderSimple,
  Clock,
  Star,
  DotsThree,
  MagnifyingGlass,
  Funnel,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

const recentCreations = [
  {
    id: "1",
    title: "The Oracle's Lament",
    type: "text",
    time: "2 min ago",
    preview: "In the age before time fractured…",
  },
  {
    id: "2",
    title: "Atlantean Skyscape",
    type: "image",
    time: "18 min ago",
    preview: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    title: "Draconic March",
    type: "music",
    time: "1 hr ago",
    preview: null,
  },
  {
    id: "4",
    title: "Siege of Olympus",
    type: "video",
    time: "3 hr ago",
    preview: null,
  },
  {
    id: "5",
    title: "Runic Cipher Engine",
    type: "code",
    time: "Yesterday",
    preview: null,
  },
  {
    id: "6",
    title: "Serpent's Breath",
    type: "image",
    time: "2 days ago",
    preview: "/placeholder.svg?height=40&width=40",
  },
]

const collections = [
  { id: "c1", name: "Mythos Archive", count: 24, starred: true },
  { id: "c2", name: "Elemental Visions", count: 11, starred: false },
  { id: "c3", name: "War of Gods", count: 7, starred: false },
  { id: "c4", name: "Dreamscapes", count: 16, starred: true },
]

const typeIconMap: Record<string, React.ReactNode> = {
  text: <Sparkle size={12} weight="fill" />,
  image: <PaintBrush size={12} weight="fill" />,
  video: <VideoCamera size={12} weight="fill" />,
  music: <MusicNote size={12} weight="fill" />,
  code: <Code size={12} weight="fill" />,
}

const typeColorMap: Record<string, string> = {
  text: "text-[#8b5cf6]",
  image: "text-[#00bcd4]",
  video: "text-rose-400",
  music: "text-amber-400",
  code: "text-sky-400",
}

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const filtered = recentCreations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="flex flex-col h-full w-64 shrink-0 border-r border-[rgba(139,92,246,0.15)] bg-[#0d0d15]">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[rgba(139,92,246,0.12)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center glow-violet">
            <Sparkle size={16} weight="fill" className="text-white" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-foreground tracking-wide">
              Arcanea
            </span>
            <span className="block text-[10px] text-[#ffd700] font-mono uppercase tracking-widest leading-none">
              Studio
            </span>
          </div>
        </div>
      </div>

      {/* New Creation Button */}
      <div className="px-4 py-3">
        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
            bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]
            text-white text-sm font-medium
            hover:from-[#9d70f8] hover:to-[#8b5cf6]
            transition-all duration-200 glow-violet
            shadow-lg shadow-[rgba(139,92,246,0.25)]"
        >
          <Plus size={16} weight="bold" />
          New Creation
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#16161f] border border-[rgba(139,92,246,0.12)]">
          <MagnifyingGlass size={13} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search creations…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <Funnel size={12} className="text-muted-foreground shrink-0" />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 pb-4">
        {/* Recent Creations */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
              <Clock size={10} />
              Recent
            </div>
            <span className="text-[10px] text-[#8b5cf6] cursor-pointer hover:text-[#a78bfa] transition-colors">
              View all
            </span>
          </div>
          <div className="space-y-0.5">
            {filtered.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150",
                  hoveredItem === item.id
                    ? "bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)]"
                    : "hover:bg-[rgba(255,255,255,0.03)] border border-transparent"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center shrink-0",
                    "bg-[rgba(139,92,246,0.1)]",
                    typeColorMap[item.type]
                  )}
                >
                  {typeIconMap[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate leading-tight">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{item.time}</p>
                </div>
                {hoveredItem === item.id && (
                  <button className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                    <DotsThree size={14} weight="bold" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Collections */}
        <section>
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
              <FolderSimple size={10} />
              Collections
            </div>
            <button className="text-[10px] text-[#8b5cf6] cursor-pointer hover:text-[#a78bfa] transition-colors">
              <Plus size={11} weight="bold" />
            </button>
          </div>
          <div className="space-y-0.5">
            {collections.map((col) => (
              <div
                key={col.id}
                className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-all duration-150"
              >
                <FolderSimple
                  size={14}
                  weight={col.starred ? "fill" : "regular"}
                  className={col.starred ? "text-[#ffd700]" : "text-muted-foreground"}
                />
                <span className="flex-1 text-xs text-foreground truncate">{col.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{col.count}</span>
                {col.starred && <Star size={10} weight="fill" className="text-[#ffd700]" />}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 border-t border-[rgba(139,92,246,0.12)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#00bcd4] flex items-center justify-center text-xs font-bold text-white shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Aether Weaver</p>
            <p className="text-[10px] text-[#ffd700] font-mono">
              <Star size={8} weight="fill" className="inline mr-0.5" />
              Arcane Pro
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-mono">Credits</p>
            <p className="text-xs font-bold text-[#00bcd4] font-mono">2,847</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
