'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PhPaperPlane,
  PhMicrophone,
  PhImage,
  PhBrain,
  PhMagnifyingGlass,
  PhX,
  PhPaperclip,
  PhCaretDown,
  PhImageSquare,
} from '@/lib/phosphor-icons';
import { CHAT_MODELS, getModelById } from '@/components/chat/model-selector';
import { MentionPopup, type MentionItem } from './mention-popup';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChatInputBarProps {
  onSend: (message: string, attachments?: File[]) => void;
  onModelChange: (modelId: string) => void;
  currentModel: string;
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

// ---------------------------------------------------------------------------
// Compact model picker (inline in toggles row)
// ---------------------------------------------------------------------------

function CompactModelPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selected = getModelById(value) || CHAT_MODELS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Model: ${selected.shortName}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1 px-2 py-1 min-h-[44px] rounded-md text-[11px] font-medium transition-colors
          border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.04] text-white/50 hover:text-white/70
          focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
      >
        <span>{selected.shortName}</span>
        <PhCaretDown
          className={`w-3 h-3 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select model"
          className="absolute bottom-full left-0 sm:left-0 mb-2 w-64 max-w-[min(320px,calc(100vw-2rem))] max-h-[60vh] sm:max-h-[320px] overflow-y-auto rounded-xl border border-white/[0.08] bg-[#0d0d14]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 animate-scale-in"
          style={{ scrollbarWidth: 'thin' }}
        >
          {CHAT_MODELS.map((model) => (
            <button
              key={model.id}
              type="button"
              role="option"
              aria-selected={model.id === value}
              onClick={() => {
                onChange(model.id);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                model.id === value
                  ? 'bg-white/[0.04] text-[#00bcd4]'
                  : 'text-white/60 hover:bg-white/[0.03] hover:text-white/80'
              }`}
            >
              <span className="text-xs font-medium">{model.shortName}</span>
              <span className="text-[10px] text-white/20 font-mono">{model.provider}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle button
// ---------------------------------------------------------------------------

function ToolToggle({
  icon: Icon,
  label,
  active,
  disabled,
  tooltip,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  disabled?: boolean;
  tooltip?: string;
  onClick: () => void;
}) {
  return (
    <div className="relative group/toggle">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={tooltip ?? label}
        aria-label={label}
        aria-pressed={active}
        className={`relative flex items-center justify-center w-8 h-8 min-h-[44px] min-w-[44px] rounded-md text-xs transition-all focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none ${
          disabled
            ? 'opacity-30 cursor-not-allowed'
            : active
              ? 'bg-[#00bcd4]/10 border border-[#00bcd4]/25 text-[#00bcd4] shadow-[0_0_8px_rgba(0,188,212,0.1)]'
              : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/60 hover:bg-white/[0.06]'
        }`}
      >
        <Icon className="w-4 h-4" />
      </button>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-[#1a1a2e] text-white/70 text-[10px] whitespace-nowrap opacity-0 group-hover/toggle:opacity-100 transition-opacity pointer-events-none border border-white/[0.06] shadow-lg z-30">
          {tooltip}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ChatInputBar({
  onSend,
  onModelChange,
  currentModel,
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
  const audioChunksRef = useRef<Blob[]>([]);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // -------------------------------------------------------------------------
  // Auto-resize textarea
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // -------------------------------------------------------------------------
  // Send logic
  // -------------------------------------------------------------------------

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !isStreaming;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [canSend, message, attachments, onSend]);

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
    [message, mentionStart],
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
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        showValidationToast(`"${file.name}" exceeds 10MB limit`);
      } else {
        valid.push(file);
      }
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
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
              setMessage((prev) => (prev ? prev + ' ' + text : text));
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
  }, [stopRecording, showValidationToast]);

  // -------------------------------------------------------------------------
  // Derived state
  // -------------------------------------------------------------------------

  const charCount = message.length;
  const showCharCount = charCount > CHAR_WARN_THRESHOLD;
  const isNearLimit = charCount > MAX_CHARS * 0.95;

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
        <div className="absolute inset-0 z-20 bg-[#00bcd4]/10 border-2 border-dashed border-[#00bcd4]/40 rounded-2xl flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <PhImageSquare className="w-8 h-8 text-[#00bcd4] mx-auto mb-2" />
            <p className="text-sm text-[#00bcd4]">Drop images here</p>
          </div>
        </div>
      )}

      <div
        className="rounded-2xl border backdrop-blur-xl transition-all duration-150"
        style={{
          borderColor: message.trim()
            ? 'rgba(0,188,212,0.3)'
            : isDragOver
              ? 'rgba(0,188,212,0.4)'
              : 'rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(13,13,20,0.8)',
          boxShadow: message.trim()
            ? '0 0 30px rgba(0,188,212,0.08), inset 0 0 30px rgba(0,188,212,0.02)'
            : '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {/* Attachment preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 px-4 pt-3 pb-1 flex-wrap">
            {attachments.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="relative group/attach w-16 h-16 rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm"
              >
                {file.type.startsWith('image/') ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
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

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Listening... speak now
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
            placeholder="Type a message... (@mention for agents)"
            aria-label="Message input"
            disabled={isStreaming}
            rows={1}
            className="w-full px-4 py-3 pr-20 bg-transparent text-white/90 placeholder-white/25 resize-none focus:outline-none focus:shadow-[0_0_12px_rgba(0,188,212,0.1)] disabled:opacity-40 text-[15px] rounded-2xl transition-shadow"
            style={{ minHeight: '52px', maxHeight: '200px' }}
          />

          {/* Right-side buttons (mic + send/stop) */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            {/* Voice input */}
            {!message.trim() && !isStreaming && (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-9 h-9 min-h-[44px] rounded-xl flex items-center justify-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none ${
                  isRecording
                    ? 'bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                <PhMicrophone className="w-4 h-4" />
              </button>
            )}

            {/* Send or Stop button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="w-9 h-9 min-h-[44px] rounded-xl flex items-center justify-center bg-white/10 text-white/70 hover:bg-white/15 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
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
                className={`w-9 h-9 min-h-[44px] rounded-xl flex items-center justify-center transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none ${
                  canSend
                    ? 'bg-gradient-to-r from-[#00bcd4] to-[#00acc1] shadow-[0_0_12px_rgba(0,188,212,0.3)] hover:shadow-[0_0_20px_rgba(0,188,212,0.4)]'
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
        <div className="flex items-center justify-between px-3 py-2 border-t border-white/[0.04]" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {/* Model selector */}
            <CompactModelPicker value={currentModel} onChange={onModelChange} />

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
              className="flex items-center justify-center w-8 h-8 min-h-[44px] min-w-[44px] rounded-md text-white/40 hover:text-white/60 hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-[#00bcd4]/40 focus-visible:outline-none"
              aria-label="Attach file"
              title="Attach file"
            >
              <PhPaperclip className="w-4 h-4" />
            </button>

            {/* Image generation toggle */}
            <ToolToggle
              icon={PhImage}
              label="Image generation"
              tooltip="Generate images from text descriptions"
              active={enabledTools.has('image')}
              onClick={() => onToggleTool('image')}
            />

            {/* Think / reasoning toggle */}
            <ToolToggle
              icon={PhBrain}
              label="Extended thinking"
              tooltip="Extended reasoning for complex problems"
              active={enabledTools.has('think')}
              onClick={() => onToggleTool('think')}
            />

            {/* Search toggle */}
            <ToolToggle
              icon={PhMagnifyingGlass}
              label="Web search"
              tooltip="Search the web for current information"
              active={enabledTools.has('search')}
              onClick={() => onToggleTool('search')}
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
