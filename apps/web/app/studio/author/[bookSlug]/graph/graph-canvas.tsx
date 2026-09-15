/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  MapPin,
  Sparkle,
  Plus,
  Compass,
  TreeStructure,
  ShieldCheck,
} from '@/lib/phosphor-icons';
import { CharacterDiamondCard } from '../../components/character-diamond-card';
import type { CharacterDiamond } from '@/lib/author/types';

interface GraphCanvasProps {
  bookSlug: string;
  bookTitle: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  characters: CharacterDiamond[];
}

const DEFAULT_CHARACTERS: CharacterDiamond[] = [
  {
    id: 'char-1',
    name: 'Kaelen Voss',
    aliases: ['The Five-Fold Apprentice', 'Stonebreaker'],
    originClass: 'Arcan',
    primaryGate: 'Foundation',
    desire: 'To become a certified master architect and protect his sister.',
    wound: 'Blames himself for the quarry collapse that crippled his father.',
    mask: 'Stoic, obedient stonemason who keeps his head down.',
    truth: 'He must lead beyond stone walls and unite the warring Academies.',
    signatureDialogue: 'Stone remembers every blow. You can’t chisel away the truth without fracturing the foundation.',
    faction: 'Atlantean Mason Guild',
  },
  {
    id: 'char-2',
    name: 'Lyria Nightshade',
    aliases: ['The Sightweaver'],
    originClass: 'Celestial',
    primaryGate: 'Sight',
    desire: 'To uncover the truth behind the vanished 7th Luminary.',
    wound: 'Blindness induced by looking directly into the Abyssal Rift.',
    mask: 'Cold, untouchable high-court seer who predicts without feeling.',
    truth: 'True vision requires feeling the grief of those you see.',
    signatureDialogue: 'I do not predict the future. I listen to what probability refuses to say out loud.',
    faction: 'Draconic Observatory',
  },
  {
    id: 'char-3',
    name: 'Sable Corvo',
    aliases: ['The Ashwalker'],
    originClass: 'Gate-Touched',
    primaryGate: 'Fire',
    desire: 'To burn down the Academy Registry and free the unregistered.',
    wound: 'Branded and hunted as an illegal channeler at age twelve.',
    mask: 'Reckless mercenary who fights for the highest bidder.',
    truth: 'Rebellion without a foundation is just chaos; he needs allies.',
    signatureDialogue: 'The Academies didn’t teach me magic. Survival did.',
    faction: 'Unregistered Underground',
  },
];

export function GraphCanvas({
  bookSlug,
  bookTitle,
  initialNodes,
  initialEdges,
  characters = DEFAULT_CHARACTERS,
}: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedChar, setSelectedChar] = useState<CharacterDiamond | null>(characters[0] || null);
  const [filter, setFilter] = useState<'all' | 'characters' | 'locations' | 'beats'>('all');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const match = characters.find((c) => c.name === node.data.label || c.id === node.id);
      if (match) setSelectedChar(match);
    },
    [characters],
  );

  return (
    <div className="h-screen flex flex-col bg-[var(--arc-cosmic-void)] text-white overflow-hidden">
      {/* Top Navbar */}
      <header className="h-14 px-5 border-b border-white/[0.06] bg-[var(--arc-cosmic-void)]/90 backdrop-blur-md flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href={`/studio/author/${bookSlug}`}
            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
            title="Back to Manuscript"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <TreeStructure size={16} className="text-[var(--arc-brand-atlantean-teal)]" />
              <h1 className="font-display text-sm font-semibold text-white/90">
                Entity & Story Graph — {bookTitle}
              </h1>
            </div>
            <p className="text-[10px] text-white/30">
              Interactive Character Dynamics, Faction Alliances & Narrative Nodes
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white/[0.03] p-0.5 rounded-lg border border-white/[0.06] text-xs">
            {(['all', 'characters', 'locations', 'beats'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans capitalize transition-all ${
                  filter === f
                    ? 'bg-[var(--arc-brand-atlantean-teal)]/20 text-[var(--arc-brand-atlantean-teal)] font-medium border border-[var(--arc-brand-atlantean-teal)]/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <Link
            href={`/studio/author/${bookSlug}`}
            className="px-3 py-1.5 rounded-lg bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/30 text-xs font-sans text-[var(--arc-brand-atlantean-teal)] font-medium hover:bg-[var(--arc-brand-atlantean-teal)]/25 transition-all"
          >
            Open Manuscript Editor
          </Link>
        </div>
      </header>

      {/* Main Workspace: Left Graph Canvas + Right Entity Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* XYFlow React Graph Canvas */}
        <div className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            className="bg-[#050608]"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={16}
              size={1}
              color="rgba(255, 255, 255, 0.08)"
            />
            <Controls
              className="!bg-black/80 !border !border-white/10 !rounded-xl !shadow-2xl [&>button]:!bg-white/[0.04] [&>button]:!border-white/10 [&>button]:!text-white/60"
            />
            <MiniMap
              nodeStrokeColor="#2dd4bf"
              nodeColor="#1a1c23"
              className="!bg-black/70 !border !border-white/10 !rounded-xl overflow-hidden"
            />
          </ReactFlow>
        </div>

        {/* Right Entity & Character Diamond Inspector */}
        <aside className="w-84 flex-shrink-0 border-l border-white/[0.06] bg-[var(--arc-cosmic-void)]/95 backdrop-blur-md p-4 space-y-4 overflow-y-auto z-10">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-display text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Users size={14} className="text-[var(--arc-brand-arcanean-gold)]" />
              Living Character Roster
            </h3>
            <span className="text-[10px] text-white/30">{characters.length} tracked</span>
          </div>

          {selectedChar ? (
            <div className="space-y-3">
              <span className="text-[10px] font-sans text-white/40 uppercase tracking-wider">
                Selected Character
              </span>
              <CharacterDiamondCard character={selectedChar} />
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-white/30">
              Click any node in the graph to inspect character diamonds, wound/desire vectors, and voice swatches.
            </div>
          )}

          {/* Quick Roster List */}
          <div className="space-y-2 pt-2 border-t border-white/[0.04]">
            <span className="text-[10px] font-sans text-white/40 uppercase tracking-wider">
              All Characters
            </span>
            <div className="space-y-1.5">
              {characters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedChar(c)}
                  className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                    selectedChar?.id === c.id
                      ? 'bg-[var(--arc-brand-atlantean-teal)]/15 border-[var(--arc-brand-atlantean-teal)]/30 text-white'
                      : 'bg-white/[0.02] border-white/[0.04] text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="truncate">
                    <p className="text-xs font-medium">{c.name}</p>
                    <p className="text-[10px] text-white/30">{c.originClass} &middot; Gate: {c.primaryGate}</p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40">
                    {c.faction || 'Neutral'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
