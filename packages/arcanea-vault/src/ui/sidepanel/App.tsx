import { useState, useEffect } from 'preact/hooks';
import { ExportView } from './ExportView';
import { LibraryView } from './LibraryView';
import { BulkExportView } from './BulkExportView';
import { SettingsView } from './SettingsView';
import { theme } from '../styles/theme';
import type { Platform, ExportedConversation } from '../../shared/types';

type Tab = 'export' | 'library' | 'bulk' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'export', label: 'Export', icon: '\u2B07' },
  { id: 'library', label: 'Library', icon: '\u2630' },
  { id: 'bulk', label: 'Bulk', icon: '\u21CA' },
  { id: 'settings', label: 'Settings', icon: '\u2699' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('export');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [conversation, setConversation] = useState<ExportedConversation | null>(null);

  useEffect(() => {
    // Ask background for current tab's platform
    chrome.runtime.sendMessage({ type: 'GET_PLATFORM' }).then((res) => {
      if (res?.platform) setPlatform(res.platform);
    }).catch(() => {});

    // Listen for updates from background / content script
    const listener = (msg: { type: string; payload?: Record<string, unknown> }) => {
      if (msg.type === 'TAB_PLATFORM_DETECTED' && msg.payload) {
        setPlatform((msg.payload.platform as Platform) || null);
      }
      if (msg.type === 'CONVERSATION_DATA' && msg.payload) {
        setConversation(msg.payload.conversation as ExportedConversation);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: theme.bg,
      color: theme.text,
      fontFamily: theme.font,
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.borderSubtle}`,
        flexShrink: 0,
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 800,
          color: theme.bg,
        }}>A</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: theme.text }}>
            Arcanea Vault
          </div>
          <div style={{ fontSize: '10px', color: theme.textDim }}>
            AI Chat Exporter
          </div>
        </div>
        {platform && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: theme.textMuted,
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: theme.success,
              boxShadow: `0 0 6px ${theme.success}`,
            }} />
            {platform}
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <nav style={{
        display: 'flex',
        padding: '0 8px',
        borderBottom: `1px solid ${theme.borderSubtle}`,
        flexShrink: 0,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 0 8px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? theme.primary : theme.textDim,
              fontSize: '10px',
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
              borderBottom: activeTab === tab.id
                ? `2px solid ${theme.primary}`
                : '2px solid transparent',
              transition: theme.transition,
              fontFamily: theme.font,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {activeTab === 'export' && (
          <ExportView conversation={conversation} platform={platform} />
        )}
        {activeTab === 'library' && <LibraryView />}
        {activeTab === 'bulk' && <BulkExportView platform={platform} />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}
