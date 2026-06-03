'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  PhPaperPlane,
  PhMicrophone,
  PhImage,
  PhBrain,
  PhMagnifyingGlass,
  PhX,
  PhPaperclip,
  PhImageSquare,
} from '@/lib/phosphor-icons';
import { MentionPopup, type MentionItem } from './mention-popup';
import { VoiceWaveform } from './voice-waveform';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatInputBarProps {
  onSend: (message: string, attachments?: File[]) => void;
  isStreaming: boolean;
  onStop?: () => void;
  enabledTools: Set<string>;
  onToggleTool: (tool: string) => void;
  /** External value to inject into the input (e.g. from starter chips). Cleared after consumption. */
  externalMessage?: string;
  /** Called after the component has consumed externalMessage */
  onExternalMessageConsumed?: () => void;
  /** Ref forwarded to the internal textarea for external focus control */
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_CHARS = 4000;
const CHAR_WARN_THRESHOLD = 3000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Create object URLs for image files, keyed by File identity, and revoke them
 * when the file is removed or the component unmounts. Prevents the blob-URL
 * leak from calling URL.createObjectURL on every render.
 */
function useObjectUrls(files: File[]): Map<File, string> {
  // Create blob URLs in a memo (recomputed only when the files array changes),
  // and revoke the previous batch via the effect cleanup. Available on first paint.
  const map = useMemo(() => {
    const m = new Map<File, string>();
    for (const file of files) {
      if (file.type.startsWith('image/')) m.set(file, URL.createObjectURL(file));
    }
    return m;
  }, [files]);

  useEffect(() => {
    return () => {
      for (const url of map.values()) URL.revokeObjectURL(url);
    };
  }, [map]);

  return map;
}

// ---------------------------------------------------------------------------
// Tools popover — replaces inline tool toggles
// ---------------------------------------------------------------------------

function ToolsPopover({
  enabledTools,
  onToggleTool,
}: {
  enabledTools: Set<string>;
  onToggleTool: (tool: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeCount = enabledTools.size;

  const tools = [
    { id: 'image', icon: PhImage, label: 'Image Generation', desc: 'Generate images from descriptions', color: 'var(--arc-fire)' },
    { id: 'think', icon: PhBrain, label: 'Extended Thinking', desc: 'Deep reasoning for complex problems', color: 'var(--arc-void)' },
    { id: 'search', icon: PhMagnifyingGlass, label: 'Web Search', desc: 'Search the web for current info', color: 'var(--arc-wind)' },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center w-8 h-8 min-h-[44px] min-w-[44px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none ${
          activeCount > 0
            ? 'bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)]'
            : 'bg-white/[0.03] border border-white/[0.06] text-white/35 hover:text-white/60 hover:bg-white/[0.06]'
        }`}
        aria-label={`Tools (${activeCount} active)`}
        title="Tools: Image gen, Thinking, Web search"
      >
        <PhBrain className="w-4 h-4" />
        {activeCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--arc-brand-atlantean-teal)] text-[8px] text-black font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 w-64 rounded-xl bg-[var(--arc-cosmic-void)] border border-white/[0.08] shadow-2xl z-50 py-2">
            <p className="px-3 py-1 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Tools</p>
            {tools.map((t) => {
              const active = enabledTools.has(t.id);
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => onToggleTool(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                    style={active ? {
                      backgroundColor: `${t.color}15`,
                      borderColor: `${t.color}40`,
                      color: t.color,
                    } : {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      borderColor: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${active ? 'text-white/80' : 'text-white/50'}`}>{t.label}</p>
                    <p className="text-[9px] text-white/20">{t.desc}</p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all ${
                      active ? 'border-current bg-current' : 'border-white/15'
                    }`}
                    style={active ? { borderColor: t.color, backgroundColor: t.color } : undefined}
                  >
                    {active && (
                      <svg viewBox="0 0 16 16" fill="none" stroke="black" strokeWidth="2.5" className="w-full h-full">
                        <polyline points="3,8 6,11 12,5" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ChatInputBar({
  onSend,
  isStreaming,
  onStop,
  enabledTools,
  onToggleTool,
  externalMessage,
  onExternalMessageConsumed,
  textareaRef: externalTextareaRef,
}: ChatInputBarProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  // Active mic stream in state (not just a ref) so the waveform can render from it
  // without reading a ref during render.
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [voiceAutoSend, setVoiceAutoSend] = useState(true);
  const [validationToast, setValidationToast] = useState<string | null>(null);

  // @mention state
  const [mentionVisible, setMentionVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStart, setMentionStart] = useState(-1);

  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef || internalTextareaRef;

  // Consume external message when it changes (e.g. from starter chip click)
  useEffect(() => {
    if (externalMessage !== undefined && externalMessage !== '') {
      // Sync external input (starter chips / hero handoff) into local state. Intentional.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessage(externalMessage);
      onExternalMessageConsumed?.();
      // Focus the textarea so the user can edit or press Enter
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }, [externalMessage, onExternalMessageConsumed, textareaRef]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup voice recording on unmount to prevent timeout firing on unmounted component
  useEffect(() => {
    return () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
        voiceTimeoutRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Auto-resize textarea
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message, textareaRef]);

  // -------------------------------------------------------------------------
  // Send logic
  // -------------------------------------------------------------------------

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isStreaming;

  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- depends on `canSend` (derived) plus the raw inputs; the manual deps are intentional and correct.
  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    // Reset textarea height and keep focus so the user can keep typing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [canSend, message, attachments, onSend, textareaRef]);

  // -------------------------------------------------------------------------
  // Keyboard
  // -------------------------------------------------------------------------

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // If mention popup is visible, let it handle navigation keys
      if (mentionVisible && ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key)) {
        return; // MentionPopup handles via document listener
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend, mentionVisible],
  );

  // -------------------------------------------------------------------------
  // @mention detection
  // -------------------------------------------------------------------------

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, MAX_CHARS);
    setMessage(val);

    const cursorPos = e.target.selectionStart ?? val.length;
    // Look backward from cursor for an unmatched @
    const textBeforeCursor = val.slice(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex >= 0) {
      const textBetween = textBeforeCursor.slice(atIndex + 1);
      // Only trigger if @ is at start or preceded by whitespace, and no spaces in query
      const charBefore = atIndex > 0 ? textBeforeCursor[atIndex - 1] : ' ';
      if (/\s/.test(charBefore) || atIndex === 0) {
        if (!/\s/.test(textBetween)) {
          setMentionVisible(true);
          setMentionQuery(textBetween);
          setMentionStart(atIndex);
          return;
        }
      }
    }

    setMentionVisible(false);
    setMentionQuery('');
    setMentionStart(-1);
  }, []);

  const handleMentionSelect = useCallback(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization -- manual deps (message, mentionStart, textareaRef) are intentional; textareaRef is a stable ref.
    (item: MentionItem) => {
      if (mentionStart < 0) return;
      const before = message.slice(0, mentionStart);
      const cursorPos = textareaRef.current?.selectionStart ?? message.length;
      const after = message.slice(cursorPos);
      const insertText = `@${item.name} `;
      const newMessage = before + insertText + after;
      setMessage(newMessage);
      setMentionVisible(false);
      setMentionQuery('');
      setMentionStart(-1);

      // Restore focus and cursor position
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const pos = before.length + insertText.length;
          textareaRef.current.setSelectionRange(pos, pos);
        }
      });
    },
    [message, mentionStart, textareaRef],
  );

  const handleMentionDismiss = useCallback(() => {
    setMentionVisible(false);
    setMentionQuery('');
    setMentionStart(-1);
  }, []);

  // -------------------------------------------------------------------------
  // Paste images from clipboard
  // -------------------------------------------------------------------------

  const showValidationToast = useCallback((msg: string) => {
    setValidationToast(msg);
    setTimeout(() => setValidationToast(null), 4000);
  }, []);

  const filterFilesBySize = useCallback((files: File[]): File[] => {
    const valid: File[] = [];
    const oversized: string[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        oversized.push(file.name);
      } else {
        valid.push(file);
      }
    }
    if (oversized.length === 1) {
      showValidationToast(`"${oversized[0]}" exceeds 10MB limit`);
    } else if (oversized.length > 1) {
      showValidationToast(`${oversized.length} files exceed 10MB limit`);
    }
    return valid;
  }, [showValidationToast]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageItems = Array.from(items).filter((item) => item.type.startsWith('image/'));
    if (imageItems.length > 0) {
      e.preventDefault();
      const files = filterFilesBySize(
        imageItems.map((item) => item.getAsFile()).filter((f): f is File => f !== null),
      );
      if (files.length > 0) {
        setAttachments((prev) => [...prev, ...files]);
      }
    }
  }, [filterFilesBySize]);

  // -------------------------------------------------------------------------
  // Drag and drop
  // -------------------------------------------------------------------------

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = filterFilesBySize(
      Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/')),
    );
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
    }
  }, [filterFilesBySize]);

  // -------------------------------------------------------------------------
  // File input
  // -------------------------------------------------------------------------

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = filterFilesBySize(Array.from(e.target.files || []));
    if (files.length > 0) {
      setAttachments((prev) => [...prev, ...files]);
    }
    if (e.target) e.target.value = '';
  }, [filterFilesBySize]);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // -------------------------------------------------------------------------
  // Voice recording
  // -------------------------------------------------------------------------

  const stopRecording = useCallback(() => {
    if (voiceTimeoutRef.current) {
      clearTimeout(voiceTimeoutRef.current);
      voiceTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaStreamRef.current = null;
    setRecordingStream(null);
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      showValidationToast('Voice input is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setRecordingStream(stream);
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });

        try {
          const formData = new FormData();
          const ext = mediaRecorder.mimeType.includes('webm') ? 'webm' : 'mp4';
          formData.append('audio', blob, `recording.${ext}`);
          const res = await fetch('/api/ai/transcribe', { method: 'POST', body: formData });
          if (res.ok) {
            const { text } = await res.json();
            if (text) {
              if (voiceAutoSend) {
                // One-step voice: transcribe → send immediately
                const combined = message.trim() ? message + ' ' + text : text;
                onSend(combined, attachments.length > 0 ? attachments : undefined);
                setMessage('');
                setAttachments([]);
              } else {
                setMessage((prev) => (prev ? prev + ' ' + text : text));
              }
            }
          }
        } catch (e) {
          console.warn('Transcription failed:', e);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Auto-stop after 60 seconds
      voiceTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, 60_000);
    } catch (e) {
      console.warn('Microphone access denied:', e);
      showValidationToast('Microphone access denied. Check browser permissions.');
    }
  }, [stopRecording, showValidationToast, voiceAutoSend, message, onSend, attachments]);

  // -------------------------------------------------------------------------
  // Derived state
  // -------------------------------------------------------------------------

  const charCount = message.length;
  const showCharCount = charCount > CHAR_WARN_THRESHOLD;
  const isNearLimit = charCount > MAX_CHARS * 0.95;

  // Lifecycle-managed blob preview URLs (created once per file, revoked on removal/unmount)
  const previewUrls = useObjectUrls(attachments);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div
      className="relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Validation toast */}
      {validationToast && (
        <div className="absolute -top-12 left-4 right-4 flex items-center justify-center z-20">
          <div className="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-medium shadow-lg backdrop-blur-sm flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {validationToast}
          </div>
        </div>
      )}

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-20 bg-[var(--arc-brand-atlantean-teal)]/10 border-2 border-dashed border-[var(--arc-brand-atlantean-teal)]/40 rounded-2xl flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <PhImageSquare className="w-8 h-8 text-[var(--arc-brand-atlantean-teal)] mx-auto mb-2" />
            <p className="text-sm text-[var(--arc-brand-atlantean-teal)]">Drop images here</p>
          </div>
        </div>
      )}

      <div
        className="relative rounded-2xl backdrop-blur-xl transition-all duration-300 group/input"
        style={{
          background: message.trim()
            ? 'linear-gradient(135deg, rgba(13,13,20,0.92), rgba(0,30,40,0.88))'
            : 'linear-gradient(135deg, rgba(13,13,20,0.85), rgba(16,16,26,0.85))',
          boxShadow: message.trim()
            ? '0 0 40px rgba(0,188,212,0.1), 0 0 80px rgba(0,188,212,0.04), inset 0 1px 0 rgba(255,255,255,0.04)'
            : '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        {/* Gradient border overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            padding: '1px',
            background: message.trim()
              ? 'linear-gradient(135deg, rgba(0,188,212,0.4), rgba(13,71,161,0.3), rgba(0,137,123,0.4))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04), rgba(255,255,255,0.06))',
            mask: 'linear-gradient(var(--arc-text-primary) 0 0) content-box, linear-gradient(var(--arc-text-primary) 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />
        {/* Attachment preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 px-4 pt-3 pb-1 flex-wrap">
            {attachments.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="relative group/attach w-16 h-16 rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm"
              >
                {file.type.startsWith('image/') ? (
                  // Plain <img>: next/image cannot optimize blob: URLs, and we
                  // manage the object-URL lifecycle ourselves via useObjectUrls.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls.get(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <PhPaperclip className="w-4 h-4 text-white/30" />
                    <span className="text-[8px] text-white/30 truncate max-w-[56px] px-1">
                      {file.name}
                    </span>
                  </div>
                )}
                {/* Filename + size overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/attach:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-1">
                  <span className="text-[9px] text-white/80 truncate max-w-full">{file.name}</span>
                  <span className="text-[8px] text-white/40">{formatFileSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover/attach:opacity-100 transition-opacity z-10"
                  aria-label={`Remove ${file.name}`}
                >
                  <PhX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Voice waveform visualization */}
        {isRecording && recordingStream && (
          <VoiceWaveform stream={recordingStream} onStop={stopRecording} />
        )}

        {/* Active tools indicator */}
        {enabledTools.size > 0 && (
          <div className="flex items-center gap-2 px-4 py-1.5">
            {enabledTools.has('image') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--arc-fire)]/10 text-[var(--arc-fire)] border border-[var(--arc-fire)]/20 animate-[fadeIn_0.2s_ease-out]">
                <PhImage className="w-3 h-3" />
                Image generation on
              </span>
            )}
            {enabledTools.has('think') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--arc-void)]/10 text-[var(--arc-void)] border border-[var(--arc-void)]/20 animate-[fadeIn_0.2s_ease-out]">
                <PhBrain className="w-3 h-3" />
                Extended thinking on
              </span>
            )}
            {enabledTools.has('search') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--arc-wind)]/10 text-[var(--arc-wind)] border border-[var(--arc-wind)]/20 animate-[fadeIn_0.2s_ease-out]">
                <PhMagnifyingGlass className="w-3 h-3" />
                Web search on
              </span>
            )}
          </div>
        )}

        {/* Textarea + mention popup container */}
        <div className="relative">
          {/* @mention popup */}
          <MentionPopup
            query={mentionQuery}
            visible={mentionVisible}
            onSelect={handleMentionSelect}
            onDismiss={handleMentionDismiss}
          />

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              enabledTools.has('image')
                ? 'Describe the image you want to create...'
                : enabledTools.has('search')
                  ? 'Ask anything — I\'ll search the web for answers...'
                  : enabledTools.has('think')
                    ? 'Ask a complex question — I\'ll think deeply...'
                    : 'Type a message... (@mention for agents)'
            }
            aria-label="Message input"
            disabled={isStreaming}
            rows={1}
            className="w-full px-4 py-3 pr-20 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none focus:shadow-[0_0_12px_rgba(0,188,212,0.1)] disabled:opacity-40 text-[15px] rounded-2xl transition-shadow"
            style={{ minHeight: '52px', maxHeight: '200px' }}
          />

          {/* Right-side buttons (mic + send/stop) */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {/* Voice input — always visible, coexists with typing */}
            {!isStreaming && !isRecording && (
              <div className="relative group/voice">
                <button
                  type="button"
                  onClick={startRecording}
                  className={`w-9 h-9 min-h-[44px] rounded-xl flex items-center justify-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none ${
                    message.trim()
                      ? 'text-white/20 hover:text-[var(--arc-brand-atlantean-teal)]/70 hover:bg-[var(--arc-brand-atlantean-teal)]/5'
                      : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}
                  aria-label={voiceAutoSend ? 'Voice input (auto-send)' : 'Voice input (transcribe only)'}
                >
                  <PhMicrophone className="w-4 h-4" />
                  {voiceAutoSend && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[var(--arc-brand-atlantean-teal)]" />
                  )}
                </button>
                {/* Auto-send toggle tooltip on hover */}
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/voice:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--arc-cosmic-void)]/95 border border-white/[0.06] backdrop-blur-xl shadow-lg whitespace-nowrap z-50">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setVoiceAutoSend(!voiceAutoSend); }}
                    className="flex items-center gap-1.5 text-[10px]"
                    aria-label="Toggle auto-send"
                  >
                    <span className={`w-6 h-3.5 rounded-full relative transition-colors ${voiceAutoSend ? 'bg-[var(--arc-brand-atlantean-teal)]' : 'bg-white/10'}`}>
                      <span className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform ${voiceAutoSend ? 'translate-x-3' : 'translate-x-0.5'}`} />
                    </span>
                    <span className="text-white/50">Auto-send</span>
                  </button>
                </div>
              </div>
            )}

            {/* Send or Stop button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="w-9 h-9 min-h-[44px] rounded-xl flex items-center justify-center bg-white/10 text-white/70 hover:bg-white/15 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none"
                aria-label="Stop generating"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="2" width="10" height="10" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                className={`w-9 h-9 min-h-[44px] rounded-xl flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none ${
                  canSend
                    ? 'bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] via-[var(--arc-brand-atlantean-teal)] to-[var(--arc-brand-cosmic-blue)] shadow-[0_0_16px_rgba(0,188,212,0.35),0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_0_24px_rgba(0,188,212,0.5),0_4px_12px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95'
                    : 'bg-white/[0.04] text-white/20'
                }`}
                aria-label="Send message"
              >
                <PhPaperPlane className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Character count */}
        {showCharCount && (
          <div className="px-4 pb-1" role="status" aria-live="polite">
            <span
              className={`text-[10px] ${
                isNearLimit ? 'text-orange-400' : 'text-white/20'
              }`}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        )}

        {/* Toggles row */}
        <div className="flex items-center justify-between px-3 py-2 sm:py-2 border-t border-white/[0.05] gap-2" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {/* Attach file */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.md,.csv,.json"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-8 h-8 min-h-[44px] min-w-[44px] rounded-md text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40 focus-visible:outline-none"
              aria-label="Attach file"
              title="Attach file"
            >
              <PhPaperclip className="w-4 h-4" />
            </button>

            {/* Tools popover toggle */}
            <ToolsPopover
              enabledTools={enabledTools}
              onToggleTool={onToggleTool}
            />
          </div>

          {/* Keyboard hints */}
          <span className="text-[10px] text-white/15 hidden sm:inline">
            ⏎ Send · ⇧⏎ New line
          </span>
          <div className="sr-only" role="note">
            Keyboard shortcuts: Enter to send, Shift+Enter for new line,
            @ to mention agents, Escape to close popups
          </div>
        </div>
      </div>
    </div>
  );
}
