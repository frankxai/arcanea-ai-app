'use client'

import { GalleryCard } from './GalleryCard'
import type { GalleryItem } from '@/lib/gallery-data'

interface MasonryGridProps {
  items: GalleryItem[]
  onOpen: (item: GalleryItem) => void
  onLike: (id: string) => void
  onBookmark: (id: string) => void
}

export function MasonryGrid({ items, onOpen, onLike, onBookmark }: MasonryGridProps) {
  if (items.length === 0) return null

  // Distribute items into columns based on index
  const col2: GalleryItem[] = []
  const col3: GalleryItem[] = []
  const col4a: GalleryItem[] = []
  const col4b: GalleryItem[] = []
  const col4c: GalleryItem[] = []
  const col4d: GalleryItem[] = []

  items.forEach((item, i) => {
    col2.push(item)
    if (i % 3 === 0) col3.push(item)
    else if (i % 3 === 1) { col3.push(item) }
    else { col3.push(item) }

    if (i % 4 === 0) col4a.push(item)
    else if (i % 4 === 1) col4b.push(item)
    else if (i % 4 === 2) col4c.push(item)
    else col4d.push(item)
  })

  // Build column arrays directly
  const columns2 = [
    items.filter((_, i) => i % 2 === 0),
    items.filter((_, i) => i % 2 === 1),
  ]
  const columns3 = [
    items.filter((_, i) => i % 3 === 0),
    items.filter((_, i) => i % 3 === 1),
    items.filter((_, i) => i % 3 === 2),
  ]
  const columns4 = [
    items.filter((_, i) => i % 4 === 0),
    items.filter((_, i) => i % 4 === 1),
    items.filter((_, i) => i % 4 === 2),
    items.filter((_, i) => i % 4 === 3),
  ]

  return (
    <div className="w-full" role="list" aria-label="Gallery creations">
      {/* 2-col: mobile */}
      <div className="flex gap-4 sm:hidden">
        {columns2.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((item) => (
              <div key={item.id} role="listitem">
                <GalleryCard
                  item={item}
                  onOpen={onOpen}
                  onLike={onLike}
                  onBookmark={onBookmark}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 3-col: sm to lg */}
      <div className="hidden sm:flex lg:hidden gap-4">
        {columns3.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((item) => (
              <div key={item.id} role="listitem">
                <GalleryCard
                  item={item}
                  onOpen={onOpen}
                  onLike={onLike}
                  onBookmark={onBookmark}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 4-col: lg+ */}
      <div className="hidden lg:flex gap-4">
        {columns4.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((item) => (
              <div key={item.id} role="listitem">
                <GalleryCard
                  item={item}
                  onOpen={onOpen}
                  onLike={onLike}
                  onBookmark={onBookmark}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
