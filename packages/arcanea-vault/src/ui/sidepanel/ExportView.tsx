import { useState, useEffect } from 'preact/hooks';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { theme } from '../styles/theme';
import type { Platform, ExportFormat, ExportedConversation } from '../../shared/types';

interface ExportViewProps {
  conversation: ExportedConversation | null;
  platform: Platform | null;
}

export function ExportView({ conversation, platform }: ExportViewProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    setProgress(0);
  }, [conversation?.id]);

  async function handleExport(toVault = false) {
    if (!conversation) return;
    setExporting(true);
    setProgress(10);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'EXPORT_CURRENT',
        payload: { format, conversationId: conversation.id, toVault },
      });
      setProgress(100);
      setDone(true);

      if (!toVault && response?.data) {
        const blob = new Blob([response.data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.filename || `${conversation.title}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }

  // Empty state
  if (!conversation) {
    return (
      <div style={`
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100%; gap: 12px; padding: 32px; text-align: center;
      `}>
        <div style={`font-size: 36px; opacity: 0.3;`}>&#128230;</div>
        <p style={`color: ${theme.textMuted}; font-size: 13px;`}>
          {platform
            ? 'Navigate to a conversation to export it.'
            : 'Open an AI chat platform to get started.'}
        </p>
      </div>
    );
  }

  const preview = conversation.messages.slice(0, 3);

  return (
    <div style="display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.3s ease;">
      {/* Header */}
      <Card hover={false} padding="16px">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <h2 style={`font-size: 15px; font-weight: 600; color: ${theme.text}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; margin-right: 8px;`}>
            {conversation.title}
          </h2>
          {platform && <Badge platform={platform} />}
        </div>
        <div style={`display: flex; gap: 16px; font-size: 12px; color: ${theme.textMuted};`}>
          <span>{conversation.metadata.messageCount} messages</span>
          <span>{conversation.metadata.wordCount.toLocaleString()} words</span>
          {conversation.metadata.model && <span>{conversation.metadata.model}</span>}
        </div>
      </Card>

      {/* Format Selector */}
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style={`font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${theme.textDim};`}>
          Export Format
        </label>
        <div style="display: flex; gap: 8px;">
          {(['markdown', 'json', 'zip'] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              style={`
                flex: 1; padding: 8px; border-radius: ${theme.radiusSm}; font-size: 12px; font-weight: 500;
                transition: all ${theme.transition}; text-transform: uppercase; letter-spacing: 0.04em;
                ${f === format
                  ? `background: ${theme.primaryMuted}; color: ${theme.primary}; border: 1px solid ${theme.border};`
                  : `background: ${theme.bgCard}; color: ${theme.textMuted}; border: 1px solid ${theme.borderSubtle};`
                }
              `}
            >
              {f === 'markdown' ? 'MD' : f === 'json' ? 'JSON' : 'ZIP'}
            </button>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div style="display: flex; gap: 8px;">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={exporting}
          onClick={() => handleExport(false)}
        >
          {done ? 'Exported' : 'Export'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={exporting}
          onClick={() => handleExport(true)}
        >
          To Vault
        </Button>
      </div>

      {/* Progress */}
      {exporting && <ProgressBar progress={progress} label="Exporting..." />}

      {/* Preview */}
      {preview.length > 0 && (
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <span style={`font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${theme.textDim};`}>
            Preview
          </span>
          {preview.map((msg, i) => (
            <div
              key={i}
              style={`
                padding: 10px 12px; border-radius: ${theme.radiusSm};
                background: ${msg.role === 'user' ? 'rgba(127,255,212,0.04)' : 'rgba(255,255,255,0.02)'};
                border-left: 2px solid ${msg.role === 'user' ? theme.primary : theme.textDim};
              `}
            >
              <div style={`font-size: 10px; font-weight: 600; text-transform: uppercase; color: ${msg.role === 'user' ? theme.primary : theme.textMuted}; margin-bottom: 4px;`}>
                {msg.role}
              </div>
              <div style={`font-size: 12px; color: ${theme.text}; line-height: 1.5; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;`}>
                {msg.content.slice(0, 200)}{msg.content.length > 200 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
