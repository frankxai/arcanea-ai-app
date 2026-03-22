'use client';

import React, { useState } from 'react';
import { PhDownload, PhX, PhFileText, PhCode, PhTextAlignLeft } from '@/lib/phosphor-icons';

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

export function ExportDialog({ messages, luminorName, modelLabel, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<'markdown' | 'json' | 'text'>('markdown');

  const exportContent = () => {
    let content: string;
    let filename: string;
    let mimeType: string;
    const date = new Date().toISOString().slice(0, 10);
    const name = luminorName || 'Arcanea';

    if (format === 'markdown') {
      content = `# Conversation with ${name}\n**Model**: ${modelLabel || 'Auto'} | **Date**: ${date}\n\n---\n\n`;
      content += messages.map((msg) => {
        const role = msg.role === 'user' ? '**You**' : `**${name}**`;
        return `### ${role}\n\n${getMessageText(msg)}\n`;
      }).join('\n---\n\n');
      filename = `arcanea-chat-${date}.md`;
      mimeType = 'text/markdown';
    } else if (format === 'json') {
      content = JSON.stringify(messages.map(msg => ({ role: msg.role, content: getMessageText(msg) })), null, 2);
      filename = `arcanea-chat-${date}.json`;
      mimeType = 'application/json';
    } else {
      content = messages.map((msg) => {
        const role = msg.role === 'user' ? 'You' : name;
        return `${role}:\n${getMessageText(msg)}`;
      }).join('\n\n---\n\n');
      filename = `arcanea-chat-${date}.txt`;
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const formats = [
    { id: 'markdown' as const, label: 'Markdown', icon: PhFileText, desc: 'Rich formatting' },
    { id: 'json' as const, label: 'JSON', icon: PhCode, desc: 'Raw data' },
    { id: 'text' as const, label: 'Plain Text', icon: PhTextAlignLeft, desc: 'Simple' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#111113] border border-white/[0.08] rounded-2xl p-6 w-[360px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/80">Export Conversation</h3>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded text-white/30 hover:text-white/60 hover:bg-white/[0.04]">
            <PhX className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2 mb-5">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                format === f.id
                  ? 'border-[#00bcd4]/30 bg-[#00bcd4]/5 text-white/90'
                  : 'border-white/[0.06] text-white/50 hover:border-white/[0.12] hover:bg-white/[0.02]'
              }`}
            >
              <f.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs font-medium">{f.label}</div>
                <div className="text-[10px] text-white/30">{f.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={exportContent}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00bcd4] text-white text-sm font-medium hover:bg-[#00bcd4]/80 transition-colors"
        >
          <PhDownload className="w-4 h-4" />
          Export {messages.length} messages
        </button>
      </div>
    </div>
  );
}
