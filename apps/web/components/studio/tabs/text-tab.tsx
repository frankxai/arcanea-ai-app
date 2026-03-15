"use client"

import { useState } from "react"
import {
  Sparkle,
  Lightning,
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  Quotes,
  Code as CodeIcon,
  TextH,
  Link,
  Image as ImageIcon,
} from '@/lib/phosphor-icons'
import { cn } from "@/lib/utils"

interface TextTabProps {
  generationState: "idle" | "generating" | "complete" | "error"
}

const formatActions = [
  { icon: <TextH size={14} />, label: "Heading" },
  { icon: <TextB size={14} />, label: "Bold" },
  { icon: <TextItalic size={14} />, label: "Italic" },
  { icon: <TextUnderline size={14} />, label: "Underline" },
  { icon: <ListBullets size={14} />, label: "List" },
  { icon: <Quotes size={14} />, label: "Quote" },
  { icon: <CodeIcon size={14} />, label: "Code" },
  { icon: <Link size={14} />, label: "Link" },
  { icon: <ImageIcon size={14} />, label: "Image" },
]

const aiPrompts = [
  "Continue this narrative with mythic tension",
  "Rewrite in ancient oracle verse",
  "Add a prophecy fragment",
  "Expand the lore details",
]

const defaultContent = `In the age before time fractured, when the Celestial Forge still burned at the heart of creation, the Arcanea weavers shaped reality with nothing more than intent and belief.

The First Myth speaks of a goddess who stitched the stars into constellations not for navigation, but as a warning — each cluster a memory of what happened when mortals reached too far into the Aether.

Now you stand at the loom, thread in hand…`

export function TextTab({ generationState }: TextTabProps) {
  const [content, setContent] = useState(defaultContent)
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [wordCount] = useState(67)

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-5 py-2.5 border-b border-[rgba(13,71,161,0.1)] bg-[rgba(10,10,15,0.5)]">
        <div className="flex items-center gap-0.5 pr-3 border-r border-[rgba(255,255,255,0.08)]">
          {formatActions.map((action) => (
            <button
              key={action.label}
              title={action.label}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[rgba(13,71,161,0.1)] transition-all duration-150"
            >
              {action.icon}
            </button>
          ))}
        </div>
        {/* Word count */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[10px] text-muted-foreground font-mono">{wordCount} words</span>
          <div className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />
          <span className="text-[10px] text-muted-foreground font-mono">Markdown</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        {generationState === "generating" ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 px-10">
            <div className="w-16 h-16 rounded-full bg-[rgba(13,71,161,0.1)] border border-[rgba(13,71,161,0.3)] flex items-center justify-center pulse-glow">
              <Sparkle size={28} className="text-[#0d47a1] animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <div className="text-center">
              <p className="font-serif text-lg text-foreground mb-1">Weaving narrative threads…</p>
              <p className="text-sm text-muted-foreground">Generating your text</p>
            </div>
            <div className="w-full max-w-md space-y-2">
              {[100, 85, 70, 55].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded shimmer"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-full resize-none bg-transparent px-8 py-6 text-base leading-relaxed text-foreground outline-none font-sans",
              "placeholder:text-muted-foreground",
              generationState === "error" && "border-2 border-red-500/20"
            )}
            placeholder="Begin weaving your myth… describe ancient battles, divine prophecies, or forgotten realms."
          />
        )}
        {/* Glow cursor effect when focused */}
        {generationState === "complete" && (
          <div className="absolute bottom-4 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,188,212,0.08)] border border-[rgba(0,188,212,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00bcd4]" />
            <span className="text-[11px] text-[#00bcd4] font-mono">Narrative complete</span>
          </div>
        )}
        {generationState === "error" && (
          <div className="absolute bottom-4 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[11px] text-red-400 font-mono">Generation failed</span>
          </div>
        )}
      </div>

      {/* AI Assist Bar */}
      <div className="px-5 py-3 border-t border-[rgba(13,71,161,0.1)] bg-[rgba(10,10,15,0.3)]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-[#ffd700] font-mono shrink-0">
            <Lightning size={11} weight="fill" />
            AI Assist:
          </div>
          {aiPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setSelectedPrompt(prompt)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[11px] border transition-all duration-200",
                selectedPrompt === prompt
                  ? "bg-[rgba(13,71,161,0.2)] border-[rgba(13,71,161,0.4)] text-[#a78bfa]"
                  : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-muted-foreground hover:text-foreground hover:border-[rgba(13,71,161,0.2)]"
              )}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
