/**
 * Arc Protocol — Auto-Save Hook
 *
 * Watches chat messages and silently saves detected creations
 * as arc objects. Non-intrusive — runs after each AI response.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { detectCreation, type DetectedCreation } from './detect';
import { createArc, type CreateArcOptions } from './client';
import type { Arc } from '../../../../packages/arc-protocol/src/types';

// ── Types ────────────────────────────────────────────────────────────────────

export interface AutoSaveState {
  /** All arcs saved during this chat session */
  savedArcs: Arc[];
  /** The most recently saved arc (for UI indicator) */
  lastSaved: Arc | null;
  /** The last detection result (even if not yet saved) */
  lastDetection: DetectedCreation | null;
  /** Whether a save is currently in flight */
  isSaving: boolean;
  /** Notification to show (auto-clears after timeout) */
  notification: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract plain text from a message (AI SDK v6 format) */
function getTextFromMessage(msg: {
  parts?: Array<{ type: string; text?: string }>;
  content?: string;
}): string {
  if (msg.parts && msg.parts.length > 0) {
    const text = msg.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text ?? '')
      .join('');
    if (text) return text;
  }
  if (typeof msg.content === 'string') return msg.content;
  return '';
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAutoSave — Watches chat messages and saves detected creations.
 *
 * @param messages    - The chat messages array from useChat
 * @param isLoading   - Whether the AI is still streaming
 * @param creator     - Creator ID (defaults to 'anonymous' when no auth)
 */
export function useAutoSave(
  messages: Array<{ id: string; role: string; parts?: Array<{ type: string; text?: string }>; content?: string }>,
  isLoading: boolean,
  creator: string = 'anonymous',
): AutoSaveState {
  const [savedArcs, setSavedArcs] = useState<Arc[]>([]);
  const [lastSaved, setLastSaved] = useState<Arc | null>(null);
  const [lastDetection, setLastDetection] = useState<DetectedCreation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Track which spark hashes we've already saved to avoid duplicates
  const savedHashesRef = useRef<Set<string>>(new Set());
  // Track the last message count we processed to avoid re-processing
  const lastProcessedCountRef = useRef(0);
  // Notification timer
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Show a notification that auto-clears */
  const showNotification = useCallback((text: string) => {
    setNotification(text);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(null), 4000);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    };
  }, []);

  // Process new messages when streaming completes
  useEffect(() => {
    // Only process when streaming has just stopped and we have new messages
    if (isLoading) return;
    if (messages.length < 2) return;
    if (messages.length <= lastProcessedCountRef.current) return;

    // Find the last user-assistant pair
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant') return;

    // Find the preceding user message
    let userMsg = null;
    for (let i = messages.length - 2; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMsg = messages[i];
        break;
      }
    }
    if (!userMsg) return;

    const userText = getTextFromMessage(userMsg);
    const aiText = getTextFromMessage(lastMsg);

    if (!userText || !aiText) return;

    // Mark as processed
    lastProcessedCountRef.current = messages.length;

    // Detect creation
    const detection = detectCreation(userText, aiText);
    setLastDetection(detection);

    if (!detection) return;

    // Check for duplicates
    if (savedHashesRef.current.has(detection.sparkHash)) return;

    // Save the arc
    setIsSaving(true);
    savedHashesRef.current.add(detection.sparkHash);

    const options: CreateArcOptions = {
      type: detection.type,
      creator,
      spark: detection.spark,
      palette: detection.palette,
      sharpen: detection.sharpen.length > 0 ? detection.sharpen : undefined,
      tags: detection.tags,
    };

    createArc(options)
      .then((arc) => {
        setSavedArcs((prev) => [...prev, arc]);
        setLastSaved(arc);

        // Friendly type labels for the notification
        const typeLabels: Record<string, string> = {
          character: 'Character',
          world: 'World',
          location: 'Location',
          creature: 'Creature',
          image: 'Image prompt',
          music: 'Music',
          scene: 'Scene',
          story: 'Story',
          code: 'Code',
          system: 'System',
          artifact: 'Artifact',
          agent: 'Agent',
          collection: 'Collection',
          video: 'Video',
        };

        const label = typeLabels[detection.type] || 'Creation';
        showNotification(`${label} saved to your universe`);
      })
      .catch((err) => {
        // Remove from saved hashes so it can be retried
        savedHashesRef.current.delete(detection.sparkHash);
        console.warn('[arc/auto-save] Failed to save creation:', err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [messages, isLoading, creator, showNotification]);

  // Reset when chat is cleared
  useEffect(() => {
    if (messages.length === 0) {
      setSavedArcs([]);
      setLastSaved(null);
      setLastDetection(null);
      lastProcessedCountRef.current = 0;
      savedHashesRef.current.clear();
    }
  }, [messages.length]);

  return {
    savedArcs,
    lastSaved,
    lastDetection,
    isSaving,
    notification,
  };
}
