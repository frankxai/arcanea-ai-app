'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { HeroBanner } from '@/components/gallery/HeroBanner'
import { FilterBar } from '@/components/gallery/FilterBar'
import { MasonryGrid } from '@/components/gallery/MasonryGrid'
import { DetailModal } from '@/components/gallery/DetailModal'
import { SkeletonGrid, InfiniteScrollLoader } from '@/components/gallery/Skeletons'
import { EmptyState } from '@/components/gallery/EmptyState'
import { GALLERY_ITEMS } from '@/lib/gallery-data'
import type { GalleryItem, Element, ContentType } from '@/lib/gallery-data'

const PAGE_SIZE = 8

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [activeElement, setActiveElement] = useState<Element>('All')
  const [activeType, setActiveType] = useState<ContentType>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  // Simulate initial load
  useEffect(() => {
    const t = setTimeout(() => {
      setItems(GALLERY_ITEMS.slice(0, PAGE_SIZE))
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchEl = activeElement === 'All' || item.element === activeElement
    const matchType = activeType === 'All' || item.type === activeType
    const matchSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.element.toLowerCase().includes(searchQuery.toLowerCase())
    return matchEl && matchType && matchSearch
  })

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || isLoading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [isLoading, hasMore, isLoadingMore, items])

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      const nextPage = page + 1
      const start = PAGE_SIZE * page
      const end = PAGE_SIZE * nextPage
      const newItems = GALLERY_ITEMS.slice(start, end)
      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems((prev) => [...prev, ...newItems])
        setPage(nextPage)
      }
      setIsLoadingMore(false)
    }, 1000)
  }, [page, isLoadingMore, hasMore])

  // Like handler
  const handleLike = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    )
    setSelectedItem((prev) =>
      prev && prev.id === id
        ? { ...prev, liked: !prev.liked, likes: prev.liked ? prev.likes - 1 : prev.likes + 1 }
        : prev
    )
  }, [])

  // Bookmark handler
  const handleBookmark = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
      )
    )
    setSelectedItem((prev) =>
      prev && prev.id === id ? { ...prev, bookmarked: !prev.bookmarked } : prev
    )
  }, [])

  // Open modal & increment view count
  const handleOpen = useCallback((item: GalleryItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, views: i.views + 1 } : i))
    )
    setSelectedItem({ ...item, views: item.views + 1 })
  }, [])

  // Related items: same element, exclude current
  const relatedItems = selectedItem
    ? items.filter((i) => i.element === selectedItem.element && i.id !== selectedItem.id).slice(0, 8)
    : []

  const hasActiveFilters =
    activeElement !== 'All' || activeType !== 'All' || searchQuery.trim() !== ''

  return (
    <main
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #111118 100%)' }}
    >
      {/* Hero */}
      <HeroBanner
        onSearch={setSearchQuery}
        totalCount={GALLERY_ITEMS.length}
      />

      {/* Filter bar */}
      <FilterBar
        activeElement={activeElement}
        activeType={activeType}
        onElementChange={setActiveElement}
        onTypeChange={setActiveType}
        resultCount={filteredItems.length}
      />

      {/* Gallery content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <SkeletonGrid />
        ) : filteredItems.length === 0 ? (
          <EmptyState hasSearch={hasActiveFilters} query={searchQuery} />
        ) : (
          <>
            <MasonryGrid
              items={filteredItems}
              onOpen={handleOpen}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="mt-4">
              {isLoadingMore && <InfiniteScrollLoader />}
              {!hasMore && filteredItems.length > 0 && (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <div
                    className="w-16 h-px"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(13,71,161,0.4), transparent)' }}
                    aria-hidden="true"
                  />
                  <p className="text-sm" style={{ color: '#4a3f64' }}>
                    You've reached the end of the known realms
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          relatedItems={relatedItems}
          onClose={() => setSelectedItem(null)}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onOpenRelated={handleOpen}
        />
      )}
    </main>
  )
}
