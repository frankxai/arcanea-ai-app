/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePromptBooksStore } from '@/lib/prompt-books/store'

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const collectionId = params.collectionId as string
  const { setActiveCollection } = usePromptBooksStore()

  useEffect(() => {
    if (collectionId) {
      setActiveCollection(collectionId)
      // Redirect to main page which reads activeCollectionId from store
      router.replace('/prompt-books')
    }
  }, [collectionId, setActiveCollection, router])

  return null
}
