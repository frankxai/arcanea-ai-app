/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { NextRequest, NextResponse } from 'next/server'

/**
 * PWA Share Target handler.
 * Receives shared text/files from the OS share sheet and redirects
 * to the Quick Capture flow with the content pre-filled.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string | null
    const text = formData.get('text') as string | null
    const url = formData.get('url') as string | null
    const files = formData.getAll('files') as File[]

    // Build the content from whatever was shared
    let content = ''

    if (text) content += text
    if (url) content += (content ? '\n\n' : '') + url
    if (title && !content.includes(title)) content = title + '\n\n' + content

    // If files were shared, read their text content
    for (const file of files) {
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
        const fileText = await file.text()
        content += (content ? '\n\n---\n\n' : '') + fileText
      }
    }

    // Redirect to prompt-books with the content as a query param
    const encoded = encodeURIComponent(content)
    return NextResponse.redirect(
      new URL(`/prompt-books?capture=${encoded}`, request.url),
    )
  } catch {
    return NextResponse.redirect(new URL('/prompt-books', request.url))
  }
}
