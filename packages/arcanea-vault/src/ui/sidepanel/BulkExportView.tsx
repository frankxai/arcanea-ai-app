import { useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { theme } from '../styles/theme';
import type { Platform, ExportFormat } from '../../shared/types';

interface BulkExportViewProps {
  platform: Platform | null;
}

export function BulkExportView({ platform }: BulkExportViewProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBulkExport() {
    if (!platform) return;
    setRunning(true);
    setDone(false);
    setError(null);
    setCurrent(0);

    try {
      // Listen for progress updates
      const listener = (msg: { type: string; payload?: { current?: number; total?: number } }) => {
        if (msg.type === 'EXPORT_PROGRESS' && msg.payload) {
          setCurrent(msg.payload.current || 0);
          setTotal(msg.payload.total || 0);
        }
      };
      chrome.runtime.onMessage.addListener(listener);

      await chrome.runtime.sendMessage({
        type: 'EXPORT_ALL',
        payload: { platform, format },
      });

      chrome.runtime.onMessage.removeListener(listener);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setRunning(false);
    }
  }

  function handleCancel() {
    chrome.runtime.sendMessage({ type: 'EXPORT_CANCEL' });
    setRunning(false);
  }

  if (!platform) {
    return (
      <div style={`
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        height: 100%; gap: 12px; padding: 32px; text-align: center;
      `}>
        <div style="font-size: 36px; opacity: 0.3;">&#127760;</div>
        <p style={`color: ${theme.textMuted}; font-size: 13px;`}>
          Open an AI chat platform to use bulk export.
        </p>
      </div>
    );
  }

  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style="display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.3s ease;">
      {/* Platform Detection */}
      <Card hover={false} glow padding="16px">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style={`font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${theme.textDim}; margin-bottom: 4px;`}>
              Detected Platform
            </div>
            <Badge platform={platform} />
          </div>
          <div style={`
            width: 10px; height: 10px; border-radius: 50%;
            background: ${theme.success};
            box-shadow: 0 0 8px ${theme.success};
          `} />
        </div>
      </Card>

      {/* Format */}
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style={`font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: ${theme.textDim};`}>
          Export Format
        </label>
        <div style="display: flex; gap: 8px;">
          {(['markdown', 'json', 'zip'] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => !running && setFormat(f)}
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

      {/* Progress */}
      {running && (
        <Card hover={false} padding="16px">
          <ProgressBar
            progress={progress}
            label={`Exporting ${current}/${total} conversations...`}
          />
        </Card>
      )}

      {/* Done */}
      {done && !running && (
        <Card hover={false} padding="16px" style={`border-color: ${theme.success}40;`}>
          <div style={`display: flex; align-items: center; gap: 8px; color: ${theme.success}; font-size: 13px; font-weight: 500;`}>
            <span>&#10003;</span>
            <span>Exported {total} conversations successfully</span>
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card hover={false} padding="12px" style={`border-color: ${theme.danger}40;`}>
          <div style={`color: ${theme.danger}; font-size: 12px;`}>{error}</div>
        </Card>
      )}

      {/* Actions */}
      <div style="display: flex; gap: 8px;">
        {running ? (
          <Button variant="danger" size="lg" fullWidth onClick={handleCancel}>
            Cancel
          </Button>
        ) : (
          <Button variant="primary" size="lg" fullWidth onClick={handleBulkExport}>
            {done ? 'Export Again' : 'Export All Conversations'}
          </Button>
        )}
      </div>

      {/* Info */}
      <p style={`font-size: 11px; color: ${theme.textDim}; text-align: center; line-height: 1.5;`}>
        This will export all conversations visible in the sidebar.
        Large exports may take a few minutes.
      </p>
    </div>
  );
}
