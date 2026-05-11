/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Comment Service - Web App Wrapper
 *
 * Wraps database service for comments on creations
 */

import {
  createComment as dbCreateComment,
  getComments as dbGetComments,
  type Comment,
} from '@/lib/database/services/comment-service';

export type { Comment };

export interface CommentOptions {
  page?: number;
  pageSize?: number;
}

export interface CreateCommentData {
  userId: string;
  creationId: string;
  content: string;
  parentId?: string;
}

export async function getCreationComments(
  creationId: string,
  options: CommentOptions = {}
) {
  const { page = 1, pageSize = 20 } = options;

  // Stub returns array, we add pagination wrapper
  const comments = await dbGetComments(creationId, 'creation');

  // Manual pagination over stub results
  const start = (page - 1) * pageSize;
  const paginatedComments = comments.slice(start, start + pageSize);

  return {
    comments: paginatedComments,
    pagination: {
      page,
      pageSize,
      total: comments.length,
      hasMore: start + pageSize < comments.length,
    },
  };
}

export async function createComment(data: CreateCommentData) {
  const comment = await dbCreateComment({
    userId: data.userId,
    targetId: data.creationId,
    targetType: 'creation',
    content: data.content,
    parentId: data.parentId,
  });

  if (!comment) {
    throw new Error('Failed to create comment');
  }

  return {
    id: comment.id,
    userId: comment.userId,
    creationId: comment.targetId,
    content: comment.content,
    parentId: comment.parentId || null,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
