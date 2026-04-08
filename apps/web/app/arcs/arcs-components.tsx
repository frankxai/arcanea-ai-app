'use client';

import {
  DemoArc,
  GraphNode,
  Palette,
  PALETTE_COLORS,
  STAGE_COLORS,
  TYPE_ICONS,
  NODE_WIDTH,
  getPalette,
  getSecondaryPalette,
} from './arcs-data';

export function SidePanel({ arc, onClose }: { arc: DemoArc; onClose: () => void }) {
  const palette = PALETTE_COLORS[getPalette(arc)];
  const secondary = getSecondaryPalette(arc);

  return (
    <div
      className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #0c0c0f 0%, #09090b 100%)',
        borderLeft: `1px solid ${palette.border}`,
        boxShadow: `-8px 0 40px ${palette.glow}`,
      }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(9, 9, 11, 0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill={palette.text}>
            <path d={TYPE_ICONS[arc.type]} />
          </svg>
          <span className="text-sm font-medium uppercase tracking-wider" style={{ color: palette.text }}>
            {arc.type}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: STAGE_COLORS[arc.stage].bg, color: STAGE_COLORS[arc.stage].text }}>
            {arc.stage}
          </span>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-neutral-200 transition-colors p-1" aria-label="Close panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {arc.apl?.spark && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Spark</h3>
            <p className="text-sm leading-relaxed text-neutral-200">{arc.apl.spark}</p>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}>
            {getPalette(arc)}
          </span>
          {secondary && (
            <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: PALETTE_COLORS[secondary].bg, color: PALETTE_COLORS[secondary].text, border: `1px solid ${PALETTE_COLORS[secondary].border}` }}>
              +{secondary}
            </span>
          )}
          {arc.element && (
            <span className="text-xs px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-400 border border-neutral-700/30">
              {arc.element}
            </span>
          )}
          {arc.gate && (
            <span className="text-xs px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-400 border border-neutral-700/30">
              Gate {arc.gate}
            </span>
          )}
        </div>

        {arc.apl?.sharpen && arc.apl.sharpen.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Sharpen</h3>
            <div className="flex flex-wrap gap-1.5">
              {arc.apl.sharpen.map((s, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-red-950/30 text-red-400/80 border border-red-900/20">
                  NOT {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {arc.agent && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Agent Context</h3>
            <div className="rounded-lg p-3 text-xs font-mono leading-relaxed text-neutral-300 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p>{arc.agent.context}</p>
              {arc.agent.next_step && (
                <p className="text-neutral-500">
                  <span className="text-neutral-400">NEXT:</span> {arc.agent.next_step}
                </p>
              )}
              {arc.agent.constraints && arc.agent.constraints.length > 0 && (
                <div className="pt-1 border-t border-neutral-800/50">
                  {arc.agent.constraints.map((c, i) => (
                    <p key={i} className="text-red-400/70">- {c}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {arc.history && arc.history.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">History</h3>
            <div className="space-y-2">
              {arc.history.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_COLORS[entry.stage].text }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span style={{ color: STAGE_COLORS[entry.stage].text }}>{entry.stage}</span>
                      <span className="text-neutral-600">{new Date(entry.at).toLocaleDateString()}</span>
                      {entry.model && <span className="text-neutral-500 font-mono text-[10px]">{entry.model}</span>}
                      {entry.quality !== undefined && (
                        <span className="text-neutral-500">q:{entry.quality}</span>
                      )}
                    </div>
                    {(entry.input || entry.note) && (
                      <p className="text-xs text-neutral-400 mt-0.5">{entry.note || entry.input}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {arc.bonds && arc.bonds.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Bonds</h3>
            <div className="space-y-1.5">
              {arc.bonds.map((bond, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-300 font-mono">{bond.relation}</span>
                  <span className="text-neutral-600">&rarr;</span>
                  <span className="text-neutral-400 font-mono">{bond.target}</span>
                  {bond.note && <span className="text-neutral-600 truncate">({bond.note})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {arc.tags && arc.tags.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {arc.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-neutral-800/40 text-neutral-400 border border-neutral-700/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-neutral-800/30 text-[11px] font-mono text-neutral-600 space-y-1">
          <p>id: {arc.id}</p>
          <p>creator: {arc.creator}</p>
          <p>created: {arc.created}</p>
        </div>
      </div>
    </div>
  );
}

export function HoverTooltip({ nodeId, nodes }: { nodeId: string; nodes: GraphNode[] }) {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  const palette = PALETTE_COLORS[getPalette(node.arc)];

  return (
    <div
      className="absolute pointer-events-none z-30 px-3 py-2 rounded-lg text-xs max-w-[240px]"
      style={{
        left: node.x + NODE_WIDTH + 8,
        top: node.y,
        background: 'rgba(12, 12, 15, 0.95)',
        border: `1px solid ${palette.border}`,
        boxShadow: `0 4px 20px ${palette.glow}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <p className="font-medium text-neutral-200 mb-1">{node.arc.type}</p>
      {node.arc.apl?.spark && (
        <p className="text-neutral-400 leading-relaxed">
          {node.arc.apl.spark.length > 100 ? node.arc.apl.spark.slice(0, 100) + '...' : node.arc.apl.spark}
        </p>
      )}
      <p className="text-neutral-600 mt-1 font-mono">Click to explore</p>
    </div>
  );
}
