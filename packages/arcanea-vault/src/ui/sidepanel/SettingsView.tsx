import { useState, useEffect } from 'preact/hooks';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import type { VaultSettings, ExportFormat } from '../../shared/types';
import { DEFAULT_SETTINGS } from '../../shared/types';

export function SettingsView() {
  const [settings, setSettings] = useState<VaultSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [storageUsed, setStorageUsed] = useState('0 KB');
  const [stats, setStats] = useState({ conversations: 0, words: 0 });
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('vaultSettings', (result) => {
      if (result.vaultSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...result.vaultSettings });
      }
    });

    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then((est) => {
        const used = est.usage || 0;
        if (used > 1_000_000) {
          setStorageUsed(`${(used / 1_000_000).toFixed(1)} MB`);
        } else {
          setStorageUsed(`${(used / 1_000).toFixed(0)} KB`);
        }
      });
    }

    chrome.runtime.sendMessage({ type: 'GET_STATS' }).then((res) => {
      if (res) {
        setStats({
          conversations: res.totalConversations || 0,
          words: res.totalWords || 0,
        });
      }
    }).catch(() => {});
  }, []);

  function update<K extends keyof VaultSettings>(key: K, value: VaultSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    chrome.storage.local.set({ vaultSettings: next }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  async function clearAllData() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    const { db } = await import('../../storage/database');
    await db.delete();
    await db.open();
    setStats({ conversations: 0, words: 0 });
    setStorageUsed('0 KB');
    setConfirmClear(false);
  }

  const sectionLabel: Record<string, string> = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: theme.textDim,
    marginBottom: '8px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
      {/* Saved toast */}
      {saved && (
        <div style={{
          position: 'fixed', top: '8px', right: '8px', padding: '6px 12px',
          borderRadius: theme.radiusSm, background: theme.primaryMuted,
          border: `1px solid ${theme.border}`, color: theme.primary,
          fontSize: '11px', fontWeight: 500, zIndex: 100,
          animation: 'slideDown 0.2s ease',
        }}>
          Settings saved
        </div>
      )}

      {/* Vault Path */}
      <Card hover={false}>
        <div style={sectionLabel}>Vault Path</div>
        <input
          type="text"
          value={settings.vaultPath}
          onInput={(e) => update('vaultPath', (e.target as HTMLInputElement).value)}
          style={{
            width: '100%', padding: '8px 12px', background: theme.bgInput,
            border: `1px solid ${theme.borderSubtle}`, borderRadius: theme.radiusSm,
            color: theme.text, fontSize: '12px', fontFamily: theme.fontMono,
          }}
        />
        <div style={{ fontSize: '11px', color: theme.textDim, marginTop: '4px' }}>
          Relative to downloads folder
        </div>
      </Card>

      {/* Default Format */}
      <Card hover={false}>
        <div style={sectionLabel}>Default Export Format</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['markdown', 'json', 'zip'] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => update('defaultFormat', f)}
              style={{
                flex: 1, padding: '8px', borderRadius: theme.radiusSm,
                fontSize: '12px', fontWeight: 500, transition: theme.transition,
                textTransform: 'uppercase' as const, letterSpacing: '0.04em',
                background: f === settings.defaultFormat ? theme.primaryMuted : theme.bgCard,
                color: f === settings.defaultFormat ? theme.primary : theme.textMuted,
                border: `1px solid ${f === settings.defaultFormat ? theme.border : theme.borderSubtle}`,
                cursor: 'pointer',
              }}
            >
              {f === 'markdown' ? 'MD' : f === 'json' ? 'JSON' : 'ZIP'}
            </button>
          ))}
        </div>
      </Card>

      {/* Toggles */}
      <Card hover={false}>
        <div style={sectionLabel}>Automation</div>
        <ToggleRow
          label="Auto-export on conversation end"
          description="Export when leaving a conversation"
          checked={settings.autoExport}
          onChange={(v) => update('autoExport', v)}
        />
        <ToggleRow
          label="Include images"
          description="Download and bundle generated images"
          checked={settings.includeImages}
          onChange={(v) => update('includeImages', v)}
        />
        <ToggleRow
          label="Include artifacts"
          description="Export code artifacts and documents"
          checked={settings.includeArtifacts}
          onChange={(v) => update('includeArtifacts', v)}
        />
        <ToggleRow
          label="Show overlay button"
          description="Floating export button on chat pages"
          checked={settings.showOverlayButton}
          onChange={(v) => update('showOverlayButton', v)}
        />
      </Card>

      {/* Storage Stats */}
      <Card hover={false}>
        <div style={sectionLabel}>Storage</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: theme.primary }}>
              {stats.conversations}
            </div>
            <div style={{ fontSize: '10px', color: theme.textDim }}>conversations</div>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: theme.accent }}>
              {stats.words >= 1000 ? `${(stats.words / 1000).toFixed(0)}k` : stats.words}
            </div>
            <div style={{ fontSize: '10px', color: theme.textDim }}>words</div>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: theme.text }}>
              {storageUsed}
            </div>
            <div style={{ fontSize: '10px', color: theme.textDim }}>storage</div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card hover={false}>
        <div style={{ ...sectionLabel, color: theme.danger }}>Danger Zone</div>
        <Button variant="danger" fullWidth onClick={clearAllData}>
          {confirmClear ? 'Click again to confirm' : 'Clear All Data'}
        </Button>
        <div style={{ fontSize: '11px', color: theme.textDim, marginTop: '6px' }}>
          Files saved to your vault folder will not be affected.
        </div>
      </Card>

      {/* Version */}
      <div style={{ textAlign: 'center' as const, fontSize: '11px', color: theme.textDim, padding: '8px' }}>
        Arcanea Vault v0.1.0
      </div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px solid ${theme.borderSubtle}`,
    }}>
      <div>
        <div style={{ fontSize: '13px', color: theme.text }}>{label}</div>
        {description && (
          <div style={{ fontSize: '11px', color: theme.textDim, marginTop: '2px' }}>{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          background: checked ? theme.primary : 'rgba(255,255,255,0.1)',
          position: 'relative',
          transition: theme.transition,
          flexShrink: 0,
        }}
      >
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: checked ? theme.bg : theme.textMuted,
          position: 'absolute',
          top: '2px',
          left: checked ? '18px' : '2px',
          transition: theme.transition,
        }} />
      </button>
    </div>
  );
}
