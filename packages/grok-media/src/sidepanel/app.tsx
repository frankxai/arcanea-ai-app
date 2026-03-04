import { render } from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import type { MediaItem, Message, DownloadProgress, Stats, ScanResult } from '../shared/types';

type Tab = 'library' | 'downloads' | 'settings';
type FilterType = 'all' | 'image' | 'video' | 'hd' | 'sd';

function App() {
  const [tab, setTab] = useState<Tab>('library');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>('all');
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [downloads, setDownloads] = useState<Map<string, DownloadProgress>>(new Map());
  const [stats, setStats] = useState<Stats | null>(null);

  // Keyboard shortcuts for tabs
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === '1') setTab('library');
      if (e.key === '2') setTab('downloads');
      if (e.key === '3') setTab('settings');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Listen for messages from background
  useEffect(() => {
    const listener = (message: Message) => {
      switch (message.type) {
        case 'SCAN_RESULT': {
          const result = message.payload as ScanResult;
          setItems(prev => {
            const existing = new Set(prev.map(i => i.id));
            const newItems = result.items.filter(i => !existing.has(i.id));
            return [...prev, ...newItems];
          });
          setScanning(false);
          break;
        }
        case 'SCAN_PROGRESS':
          setScanCount((message.payload as { found: number }).found);
          break;
        case 'DOWNLOAD_PROGRESS': {
          const progress = message.payload as DownloadProgress;
          setDownloads(prev => new Map(prev).set(progress.mediaId, progress));
          break;
        }
        case 'STREAM_CAPTURE_ITEM': {
          const { item } = message.payload as { item: MediaItem };
          setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev, item]);
          break;
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    loadStats();
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const loadStats = async () => {
    chrome.runtime.sendMessage({ type: 'GET_STATS' } as Message, (response: Stats) => {
      if (response) setStats(response);
    });
  };

  const startScan = useCallback(() => {
    setScanning(true);
    setScanCount(0);
    chrome.runtime.sendMessage({ type: 'SCAN_FAVORITES', payload: {} } as Message);
  }, []);

  const cancelScan = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'CANCEL_OPERATION' } as Message);
    setScanning(false);
  }, []);

  const downloadSelected = useCallback(() => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    chrome.runtime.sendMessage({
      type: 'DOWNLOAD_BATCH',
      payload: { mediaIds: ids },
    } as Message);
    setTab('downloads');
  }, [selected]);

  const downloadAll = useCallback(() => {
    const ids = filteredItems.map(i => i.id);
    chrome.runtime.sendMessage({
      type: 'DOWNLOAD_BATCH',
      payload: { mediaIds: ids },
    } as Message);
    setTab('downloads');
  }, [items, filter]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelected(new Set(filteredItems.map(i => i.id)));
  };

  const clearSelection = () => setSelected(new Set());

  const filteredItems = items.filter(item => {
    if (filter === 'image') return item.type === 'image';
    if (filter === 'video') return item.type === 'video';
    if (filter === 'hd') return item.upscaleStatus === 'done';
    if (filter === 'sd') return item.type === 'video' && item.upscaleStatus !== 'done';
    return true;
  });

  // Build ordered selection array for numbering
  const selectionOrder = Array.from(selected);

  return (
    <>
      {/* Header */}
      <div class="header">
        <h1>Arcanea Media</h1>
        <span class="version">v0.1.0</span>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-value">{stats.totalImages}</span>
            <span class="stat-label">images</span>
          </div>
          <div class="stat">
            <span class="stat-value">{stats.totalVideos}</span>
            <span class="stat-label">videos</span>
          </div>
          <div class="stat">
            <span class="stat-value">{stats.hdVideos}</span>
            <span class="stat-label">HD</span>
          </div>
          <div class="stat">
            <span class="stat-value">{stats.totalDownloaded}</span>
            <span class="stat-label">saved</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div class="tabs">
        <button class={`tab ${tab === 'library' ? 'active' : ''}`} onClick={() => setTab('library')}>
          Library <span class="kbd">1</span>
        </button>
        <button class={`tab ${tab === 'downloads' ? 'active' : ''}`} onClick={() => setTab('downloads')}>
          Downloads {downloads.size > 0 ? `(${downloads.size})` : ''} <span class="kbd">2</span>
        </button>
        <button class={`tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')}>
          Settings <span class="kbd">3</span>
        </button>
      </div>

      {/* Library Tab */}
      {tab === 'library' && (
        <>
          {/* Actions */}
          <div class="actions">
            {scanning ? (
              <button class="btn btn-danger btn-sm" onClick={cancelScan}>
                Cancel ({scanCount} found)
              </button>
            ) : (
              <button class="btn btn-primary btn-sm" onClick={startScan}>
                Scan Favorites
              </button>
            )}
            {selected.size > 0 ? (
              <>
                <button class="btn btn-sm" onClick={downloadSelected}>
                  Download ({selected.size})
                </button>
                <button class="btn btn-sm" onClick={clearSelection}>Clear</button>
              </>
            ) : items.length > 0 ? (
              <>
                <button class="btn btn-sm" onClick={selectAll}>Select All</button>
                <button class="btn btn-sm" onClick={downloadAll}>Download All</button>
              </>
            ) : null}
          </div>

          {/* Filter Bar */}
          {items.length > 0 && (
            <div class="filter-bar">
              {(['all', 'image', 'video', 'hd', 'sd'] as FilterType[]).map(f => (
                <button
                  key={f}
                  class={`filter-chip ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? `All (${items.length})` :
                   f === 'image' ? `Images (${items.filter(i => i.type === 'image').length})` :
                   f === 'video' ? `Videos (${items.filter(i => i.type === 'video').length})` :
                   f === 'hd' ? `HD (${items.filter(i => i.upscaleStatus === 'done').length})` :
                   `SD (${items.filter(i => i.type === 'video' && i.upscaleStatus !== 'done').length})`}
                </button>
              ))}
            </div>
          )}

          {/* Media Grid or Empty/Scanning State */}
          <div class="content">
            {scanning && filteredItems.length === 0 ? (
              <div class="scanning-indicator">
                <div class="scanning-rings" />
                <div class="scanning-text">
                  Found <span class="scanning-count">{scanCount}</span> items...
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div class="media-grid">
                {filteredItems.map((item, idx) => {
                  const isSelected = selected.has(item.id);
                  const orderIdx = isSelected ? selectionOrder.indexOf(item.id) : -1;
                  return (
                    <div
                      key={item.id}
                      class={`media-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSelect(item.id)}
                      style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                    >
                      {item.type === 'video' ? (
                        <video src={item.url} muted preload="metadata" />
                      ) : (
                        <img src={item.thumbnailUrl ?? item.url} alt="" loading="lazy" />
                      )}
                      {isSelected && (
                        <span class="select-order">
                          {String(orderIdx + 1).padStart(2, '0')}
                        </span>
                      )}
                      {item.type === 'video' && <span class="badge badge-video">VID</span>}
                      {item.upscaleStatus === 'done' && <span class="badge badge-hd">HD</span>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div class="empty-state">
                <h3>No media found</h3>
                <p>
                  Open grok.com/imagine/favorites and click
                  "Scan Favorites" to get started.
                </p>
                <div class="breathing-dot" />
              </div>
            )}
          </div>
        </>
      )}

      {/* Downloads Tab */}
      {tab === 'downloads' && (
        <div class="content">
          {downloads.size > 0 ? (
            Array.from(downloads.values()).map(dl => (
              <div key={dl.mediaId} class="queue-item">
                <span class={`status status-${dl.state}`}>
                  {dl.state === 'complete' ? 'Done' :
                   dl.state === 'downloading' ? 'Downloading' :
                   dl.state === 'failed' ? 'Failed' : 'Queued'}
                </span>
                <div class="progress-bar">
                  <div class="progress-fill" style={{ width: `${dl.progress}%` }} />
                </div>
                <span class="status" style={{ minWidth: '28px', textAlign: 'right' }}>
                  {dl.progress}%
                </span>
              </div>
            ))
          ) : (
            <div class="empty-state">
              <h3>No active downloads</h3>
              <p>Select items from the Library tab and click Download.</p>
              <div class="breathing-dot" />
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div class="content">
          <div class="settings-section-title">Download</div>
          <div class="settings-group">
            <label>Download folder</label>
            <input type="text" value="grok-media" />
          </div>
          <div class="settings-group">
            <label>Download delay (ms)</label>
            <input type="number" value="1000" min="200" step="100" />
          </div>

          <div class="settings-section-title">Scanning</div>
          <div class="settings-group">
            <label>Scroll delay (ms)</label>
            <input type="number" value="2000" min="500" step="100" />
          </div>
          <div class="settings-group">
            <label>Max retries</label>
            <input type="number" value="3" min="1" max="10" />
          </div>

          <div style={{ marginTop: '20px' }}>
            <button class="btn btn-primary btn-full">Save Settings</button>
          </div>
        </div>
      )}

      {/* FAB — Scan action */}
      {tab === 'library' && !scanning && (
        <button class="fab" onClick={startScan} title="Scan Favorites">
          &#x21BB;
        </button>
      )}
    </>
  );
}

// Mount
render(<App />, document.getElementById('app')!);
