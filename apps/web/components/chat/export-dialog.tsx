'use client';

import React, { useState, useMemo } from 'react';
import { PhDownload, PhX, PhFileText, PhCode, PhTextAlignLeft, PhCopy, PhCheck } from '@/lib/phosphor-icons';

interface ExportDialogProps {
  messages: Array<{ role: string; parts?: Array<{ type: string; text?: string }>; content?: string }>;
  luminorName?: string;
  modelLabel?: string;
  onClose: () => void;
}

function getMessageText(msg: { parts?: Array<{ type: string; text?: string }>; content?: string }): string {
  if (msg.parts && msg.parts.length > 0) {
    const text = msg.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('');
    if (text) return text;
  }
  if (typeof msg.content === 'string') return msg.content;
  return '';
}

type ExportFormat = 'markdown' | 'json' | 'text';

function generateContent(messages: ExportDialogProps['messages'], format: ExportFormat, name: string, modelLabel: string): string {
  const date = new Date().toISOString().slice(0, 10);

  if (format === 'markdown') {
    let content = `# Conversation with ${name}\n**Model**: ${modelLabel} | **Date**: ${date} | **Messages**: ${messages.length}\n\n---\n\n`;
    content += messages.map((msg) => {
      const role = msg.role === 'user' ? '**You**' : `**${name}**`;
      return `### ${role}\n\n${getMessageText(msg)}\n`;
    }).join('\n---\n\n');
    content += `\n---\n\n*Exported from [Arcanea](https://arcanea.ai)*`;
    return content;
  }

  if (format === 'json') {
    return JSON.stringify({
      metadata: { name, model: modelLabel, date, messageCount: messages.length, exportedFrom: 'arcanea.ai' },
      messages: messages.map(msg => ({ role: msg.role, content: getMessageText(msg) })),
    }, null, 2);
  }

  let content = `Conversation with ${name}\nModel: ${modelLabel} | Date: ${date}\n${'='.repeat(50)}\n\n`;
  content += messages.map((msg) => {
    const role = msg.role === 'user' ? 'You' : name;
    return `${role}:\n${getMessageText(msg)}`;
  }).join('\n\n---\n\n');
  return content;
}

export function ExportDialog({ messages, luminorName, modelLabel, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const name = luminorName || 'Arcanea';
  const model = modelLabel || 'Auto';

  const preview = useMemo(() => generateContent(messages, format, name, model), [messages, format, name, model]);

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10);
    const ext = format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt';
    const mimeType = format === 'markdown' ? 'text/markdown' : format === 'json' ? 'application/json' : 'text/plain';

    const blob = new Blob([preview], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcanea-chat-${date}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(preview);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = preview;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formats = [
    { id: 'markdown' as const, label: 'Markdown', icon: PhFileText, desc: 'Rich formatting with headers' },
    { id: 'json' as const, label: 'JSON', icon: PhCode, desc: 'Structured data for APIs' },
    { id: 'text' as const, label: 'Plain Text', icon: PhTextAlignLeft, desc: 'Simple, universal' },
  ];

  const wordCount = messages.reduce((acc, msg) => acc + getMessageText(msg).split(/\s+/).length, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-[#14141e] to-[#0e0e16] border border-white/[0.08] rounded-2xl w-[420px] max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_1px_rgba(255,255,255,0.06)]"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInUp 200ms cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <h3 className="text-sm font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Export Conversation
            </h3>
            <p className="text-[10px] text-white/25 mt-0.5">
              {messages.length} messages · ~{wordCount.toLocaleString()} words
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          >
            <PhX className="w-4 h-4" />
          </button>
        </div>

        {/* Format selector */}
        <div className="px-5 space-y-1.5 mb-4">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                format === f.id
                  ? 'border-[#00bcd4]/30 bg-gradient-to-r from-[#00bcd4]/8 to-transparent text-white/90 shadow-[inset_0_0_0_1px_rgba(0,188,212,0.1)]'
                  : 'border-white/[0.05] text-white/45 hover:border-white/[0.1] hover:bg-white/[0.02]'
              }`}
            >
              <f.icon className={`w-4 h-4 shrink-0 ${format === f.id ? 'text-[#00bcd4]' : ''}`} />
              <div className="text-left flex-1">
                <div className="text-xs font-medium">{f.label}</div>
                <div className="text-[10px] text-white/25">{f.desc}</div>
              </div>
              {format === f.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] shadow-[0_0_6px_rgba(0,188,212,0.4)]" />
              )}
            </button>
          ))}
        </div>

        {/* Preview toggle */}
        <div className="px-5 mb-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-[11px] text-white/30 hover:text-white/50 transition-colors"
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>

        {/* Preview pane */}
        {showPreview && (
          <div className="mx-5 mb-4 rounded-lg bg-[#0a0a10] border border-white/[0.05] max-h-[200px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <pre className="p-3 text-[10px] text-white/40 font-mono whitespace-pre-wrap leading-relaxed">
              {preview.slice(0, 2000)}{preview.length > 2000 ? '\n\n... truncated ...' : ''}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.04] hover:text-white/80 transition-all"
          >
            {copied ? (
              <>
                <PhCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <PhCopy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00bcd4] to-[#00897b] text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(0,188,212,0.3)] transition-all"
          >
            <PhDownload className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
