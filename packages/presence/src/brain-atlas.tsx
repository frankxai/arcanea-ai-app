'use client';

/**
 * BrainAtlas — live packet-flow visualization for the Starlight Voice
 * Operator brain.
 *
 * Connects to the voice-operator's WebSocket (ws://127.0.0.1:7373/ws by
 * default) and renders the dispatch fleet as nodes + recently-routed
 * packets as decaying edges. Click an edge to see the packet JSON in
 * a glass panel.
 *
 * **This is a SKELETON.** The actual force-graph render is delegated
 * to react-force-graph (peer-dep on the consumer side) so packages/
 * presence stays bundle-light. The consumer (apps/web/room or
 * SIS/console) imports react-force-graph and passes it as a prop, OR
 * uses the default `null` render which surfaces a placeholder + the
 * raw packet stream as a list (useful for headless / SSR fallback).
 *
 * Architecture rationale:
 *   - WebSocket connection + packet decoding lives here (one source
 *     of truth)
 *   - Force-graph rendering is a render-prop so SIS/console can pin
 *     to react-force-graph-2d (already in its deps) and a future
 *     apps/web variant can pin to react-force-graph-3d
 *   - State (nodes Map, edges Map with decay timestamps) is maintained
 *     here so swapping renderers doesn't lose data
 *
 * The cinematic moment (Phase C wire): when Frank speaks, the source
 * node pulses → edge draws to target → target node pulses. The investor
 * watching this leans forward.
 */

import { useEffect, useMemo, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Types — match voice-operator's packet schema (service/packet.py)
// ---------------------------------------------------------------------------

export type IntentClass =
  | 'capture' | 'command' | 'build' | 'search'
  | 'organize' | 'reflect' | 'external' | 'handoff-to-concierge';

export type ApprovalTier = 'A' | 'B' | 'C';

export interface BrainAtlasNode {
  id: string;
  label: string;
  /** Type of agent — colors the node */
  kind: 'voice-operator' | 'cli' | 'mcp' | 'browser' | 'cloud' | 'human';
  /** Decay timestamp — node pulses brighter the more recently it was hit */
  lastActiveAt?: number;
  /** Visual color override (otherwise derived from kind) */
  color?: string;
}

export interface BrainAtlasEdge {
  id: string;
  source: string;
  target: string;
  packetId: string;
  intent?: IntentClass;
  tier?: ApprovalTier;
  /** Created timestamp for decay animation (ms epoch) */
  createdAt: number;
  /** Whether the edge is decayed and should be culled */
  expired?: boolean;
}

export interface PacketEnvelope {
  packet_id: string;
  classification?: { intent_class?: IntentClass; confidence?: string };
  target_system?: string;
  source?: string;
  approval?: { tier?: ApprovalTier; required?: boolean };
  route_history?: string[];
  task?: string;
  spoken_update_for_user?: string;
}

export interface ForceGraphRenderProps {
  nodes: BrainAtlasNode[];
  edges: BrainAtlasEdge[];
  onNodeClick?: (node: BrainAtlasNode) => void;
  onEdgeClick?: (edge: BrainAtlasEdge) => void;
}

export interface BrainAtlasProps {
  /** WebSocket URL for the voice-operator packet stream.
   *  Default: 'ws://127.0.0.1:7373/ws'. Bearer token via wsToken if remote. */
  wsUrl?: string;
  /** Optional bearer token for non-loopback voice-operator instances */
  wsToken?: string;
  /** Edge decay window in ms — edges fade after this and get culled. Default 6000. */
  edgeDecayMs?: number;
  /** Render-prop hook for the force-graph. Pass a component that consumes
   *  ForceGraphRenderProps. Skeleton renders a placeholder list when omitted. */
  render?: (props: ForceGraphRenderProps) => React.ReactNode;
  /** Initial nodes (e.g. the dispatch fleet). Edges added as packets arrive. */
  initialNodes?: BrainAtlasNode[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_DISPATCH_FLEET: BrainAtlasNode[] = [
  { id: 'voice-operator', label: 'Voice Operator', kind: 'voice-operator', color: '#00bcd4' },
  { id: 'claude-api', label: 'Claude API', kind: 'cloud', color: '#d4a574' },
  { id: 'codex', label: 'Codex CLI', kind: 'cli', color: '#10a37f' },
  { id: 'gemini', label: 'Gemini CLI', kind: 'cli', color: '#4285f4' },
  { id: 'opencode', label: 'OpenCode', kind: 'cli', color: '#888888' },
  { id: 'mcp', label: 'MCP', kind: 'mcp', color: '#a78bfa' },
  { id: 'browser', label: 'Browser', kind: 'browser', color: '#0d47a1' },
  { id: 'approval-gate', label: 'Approval Gate', kind: 'human', color: '#ffd700' },
];

const DEFAULT_WS_URL = 'ws://127.0.0.1:7373/ws';
const DEFAULT_DECAY_MS = 6000;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BrainAtlas({
  wsUrl = DEFAULT_WS_URL,
  wsToken,
  edgeDecayMs = DEFAULT_DECAY_MS,
  render,
  initialNodes = DEFAULT_DISPATCH_FLEET,
  className,
}: BrainAtlasProps) {
  const [nodes, setNodes] = useState<BrainAtlasNode[]>(initialNodes);
  const [edges, setEdges] = useState<BrainAtlasEdge[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // -------------------------------------------------------------------------
  // WebSocket lifecycle
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = wsToken ? `${wsUrl}?token=${encodeURIComponent(wsToken)}` : wsUrl;

    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch (e) {
      setError(`WebSocket construction failed: ${(e as Error).message}`);
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      setError(`WebSocket error connecting to ${wsUrl}. Is voice-operator running?`);
      setConnected(false);
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as { packet?: PacketEnvelope; ok?: boolean; spoken_update?: string };
        if (msg.packet) ingestPacket(msg.packet);
      } catch {
        // ignore non-JSON frames
      }
    };

    return () => {
      try { ws.close(); } catch {}
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, wsToken]);

  // -------------------------------------------------------------------------
  // Edge decay sweep (cull expired edges every 1s)
  // -------------------------------------------------------------------------

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      setEdges((prev) => prev.filter((e) => now - e.createdAt < edgeDecayMs));
    }, 1000);
    return () => window.clearInterval(id);
  }, [edgeDecayMs]);

  // -------------------------------------------------------------------------
  // Packet ingestion — derive new nodes (if unknown target) + edges from
  // packet.route_history
  // -------------------------------------------------------------------------

  function ingestPacket(packet: PacketEnvelope) {
    const route = packet.route_history ?? [];
    const target = packet.target_system;
    if (!target && route.length === 0) return;

    const now = Date.now();
    const path: string[] = [...route];
    if (target && path[path.length - 1] !== target) path.push(target);

    // Add unknown nodes
    setNodes((prev) => {
      const known = new Set(prev.map((n) => n.id));
      const additions: BrainAtlasNode[] = [];
      for (const id of path) {
        if (!known.has(id)) {
          additions.push({
            id,
            label: id,
            kind: 'cloud',
            lastActiveAt: now,
            color: '#888888',
          });
          known.add(id);
        }
      }
      // Update lastActiveAt for nodes hit
      const next = prev.map((n) => (path.includes(n.id) ? { ...n, lastActiveAt: now } : n));
      return [...next, ...additions];
    });

    // Add edges along the route
    if (path.length >= 2) {
      const newEdges: BrainAtlasEdge[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        newEdges.push({
          id: `${packet.packet_id}-${i}`,
          source: path[i],
          target: path[i + 1],
          packetId: packet.packet_id,
          intent: packet.classification?.intent_class,
          tier: packet.approval?.tier,
          createdAt: now,
        });
      }
      setEdges((prev) => [...prev, ...newEdges]);
    }
  }

  // -------------------------------------------------------------------------
  // Render — delegate to provided render-prop or fall back to a list view
  // -------------------------------------------------------------------------

  const renderProps: ForceGraphRenderProps = useMemo(
    () => ({ nodes, edges }),
    [nodes, edges],
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '320px',
        background: '#09090b',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'var(--font-geist), system-ui, sans-serif',
      }}
    >
      <ConnectionBadge connected={connected} error={error} wsUrl={wsUrl} />

      {render ? (
        render(renderProps)
      ) : (
        <SkeletonView nodes={nodes} edges={edges} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ConnectionBadge({
  connected,
  error,
  wsUrl,
}: {
  connected: boolean;
  error: string | null;
  wsUrl: string;
}) {
  const color = error ? '#ef4444' : connected ? '#00bcd4' : '#888888';
  const label = error ? 'OFFLINE' : connected ? 'LIVE' : 'CONNECTING';
  return (
    <div
      style={{
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.375rem 0.75rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '999px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10,
      }}
      title={error ?? wsUrl}
    >
      <span
        style={{
          width: '0.375rem',
          height: '0.375rem',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: connected ? `0 0 12px ${color}` : `0 0 4px ${color}40`,
        }}
      />
      <span
        style={{
          fontSize: '9px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SkeletonView({
  nodes,
  edges,
}: {
  nodes: BrainAtlasNode[];
  edges: BrainAtlasEdge[];
}) {
  return (
    <div
      style={{
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '1.5rem',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <h3
          style={{
            fontSize: '10px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            marginBottom: '0.75rem',
          }}
        >
          Dispatch Fleet ({nodes.length})
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.375rem' }}>
          {nodes.map((n) => (
            <li
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '0.5rem',
                opacity: n.lastActiveAt && Date.now() - n.lastActiveAt < 8000 ? 1 : 0.55,
              }}
            >
              <span
                style={{
                  width: '0.375rem',
                  height: '0.375rem',
                  borderRadius: '50%',
                  backgroundColor: n.color ?? '#888',
                  boxShadow: `0 0 8px ${n.color ?? '#888'}`,
                }}
              />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>{n.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3
          style={{
            fontSize: '10px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            marginBottom: '0.75rem',
          }}
        >
          Recent Routes ({edges.length})
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.375rem' }}>
          {edges.length === 0 && (
            <li style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
              No packets routed yet — speak through /room to populate.
            </li>
          )}
          {edges
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 12)
            .map((e) => (
              <li
                key={e.id}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '0.5rem',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{e.source}</span>
                <span style={{ margin: '0 0.5rem', color: 'rgba(0,188,212,0.8)' }}>→</span>
                <span>{e.target}</span>
                {e.tier && (
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      color: e.tier === 'A' ? '#0d47a1' : e.tier === 'B' ? '#00bcd4' : '#ffd700',
                    }}
                  >
                    [{e.tier}]
                  </span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
