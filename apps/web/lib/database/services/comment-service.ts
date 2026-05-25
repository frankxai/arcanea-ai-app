/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
// Comment Service - Stub implementation

export interface Comment {
  id: string
  content: string
  userId: string
  targetId: string
  targetType: 'creation' | 'post'
  parentId?: string
  likesCount: number
  createdAt: string
  updatedAt: string
}

export async function getComments(targetId: string, targetType: string): Promise<Comment[]> {
  return []
}

export async function createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'likesCount'>): Promise<Comment | null> {
  return null
}

export async function updateComment(commentId: string, content: string): Promise<Comment | null> {
  return null
}

export async function deleteComment(commentId: string): Promise<boolean> {
  return true
}
