import { useState, useEffect } from 'preact/hooks';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { theme } from '../styles/theme';
import type { Platform, ExportFormat, VaultMessage } from '../../shared/types';

export function Popup() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    const msg: VaultMessage = { type: 'GET_PLATFORM' };
    chrome.runtime.sendMessage(msg, (response) => {
      if (response?.platform) setPlatform(response.platform);
    });

    const statsMsg: VaultMessage = { type: 'GET_STATS' };
    chrome.runtime.sendMessage(statsMsg, (response) => {
      if (response?.totalConversations) setTotalSaved(response.totalConversations);
    });

    // Load saved default format
    chrome.storage.local.get('vaultSettings', (data) => {
      if (data.vaultSettings?.defaultFormat) {
        setFormat(data.vaultSettings.defaultFormat);
      }
    });
  }, []);

  async function handleExport() {
    setExporting(true);
    setExportResult(null);

    const msg: VaultMessage = { type: 'EXPORT_CURRENT', payload: { format } };
    chrome.runtime.sendMessage(msg, (response) => {
      setExporting(false);
      if (response?.success) {
        setExportResult(`Saved: ${response.title}`);
        setTotalSaved((n) => n + 1);
      } else {
        setExportResult(response?.error || 'Export failed');
      }
    });
  }

  function openSidePanel() {
    const msg: VaultMessage = { type: 'OPEN_SIDEPANEL' };
    chrome.runtime.sendMessage(msg);
    window.close();
  }

  return (
    <div style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 800,
          color: theme.bg,
        }}>A</div>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>Arcanea Vault</span>
        {platform && (
          <div style={{ marginLeft: 'auto' }}>
            <Badge platform={platform} />
          </div>
        )}
      </div>

      {/* Platform status */}
      {platform ? (
        <div style={{
          padding: '10px 12px',
          borderRadius: theme.radiusSm,
          background: theme.primaryMuted,
          border: `1px solid ${theme.border}`,
          fontSize: '12px',
          color: theme.primary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: theme.success,
            boxShadow: `0 0 6px ${theme.success}`,
          }} />
          Connected to {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </div>
      ) : (
        <div style={{
          padding: '10px 12px',
          borderRadius: theme.radiusSm,
          background: theme.bgCard,
          border: `1px solid ${theme.borderSubtle}`,
          fontSize: '12px',
          color: theme.textMuted,
        }}>
          Navigate to an AI chat to export
        </div>
      )}

      {/* Export controls */}
      {platform && (
        <>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['markdown', 'json'] as ExportFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: theme.radiusSm,
                  fontSize: '11px',
                  fontWeight: 500,
                  transition: theme.transition,
                  textTransform: 'uppercase' as const,
                  background: f === format ? theme.primaryMuted : theme.bgCard,
                  color: f === format ? theme.primary : theme.textMuted,
                  border: `1px solid ${f === format ? theme.border : theme.borderSubtle}`,
                  cursor: 'pointer',
                }}
              >
                {f === 'markdown' ? 'MD' : 'JSON'}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            loading={exporting}
            onClick={handleExport}
          >
            {exporting ? 'Exporting...' : 'Export This Chat'}
          </Button>
        </>
      )}

      {/* Result */}
      {exportResult && (
        <div style={{
          padding: '8px 12px',
          borderRadius: theme.radiusSm,
          background: exportResult.startsWith('Saved') ? theme.primaryMuted : theme.dangerMuted,
          border: `1px solid ${exportResult.startsWith('Saved') ? theme.border : 'rgba(255,71,87,0.3)'}`,
          fontSize: '12px',
          color: exportResult.startsWith('Saved') ? theme.primary : theme.danger,
        }}>
          {exportResult}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: `1px solid ${theme.borderSubtle}`,
      }}>
        <span style={{ fontSize: '11px', color: theme.textDim }}>
          {totalSaved} conversations saved
        </span>
        <button
          onClick={openSidePanel}
          style={{
            border: 'none',
            background: 'transparent',
            color: theme.primary,
            fontSize: '12px',
            cursor: 'pointer',
            fontFamily: theme.font,
            padding: '4px 8px',
            borderRadius: '4px',
            transition: theme.transition,
          }}
        >
          Open Vault &rarr;
        </button>
      </div>
    </div>
  );
}
