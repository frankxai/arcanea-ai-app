'use client';

/**
 * EncounterScene -- Interactive encounter UI combining narrative opening
 * with a chat-like interface for AI-driven character interaction.
 *
 * Uses AI SDK v6 patterns: TextStreamChatTransport, sendMessage, parts[].
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { LazyMotion, domMax, m, AnimatePresence } from 'framer-motion';
import { staggerContainer, staggerItem, transitions, springs } from '@/lib/design/motion';
import type { Encounter, CrewMember, StoryChoice as StoryChoiceType } from '@/lib/living-lore/types';
import { getCrewMember } from '@/lib/living-lore/crew-data';
import { StoryChoice } from './story-choice';
import { getPreChatChoices, getPostChatChoices } from '@/lib/living-lore/encounter-choices';

interface EncounterSceneProps {
  encounter: Encounter;
  crewMembers: CrewMember[];
  choices?: StoryChoiceType[];
}

function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts) return '';
  return msg.parts.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('');
}

export function EncounterScene({ encounter, crewMembers, choices = [] }: EncounterSceneProps) {
  const router = useRouter();
  const [sceneStarted, setSceneStarted] = useState(false);
  const [sceneComplete, setSceneComplete] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Choice state
  const preChatChoices = choices.length > 0 ? getPreChatChoices(encounter.slug) : [];
  const postChatChoices = choices.length > 0 ? getPostChatChoices(encounter.slug) : [];
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>({});
  const [preChatDone, setPreChatDone] = useState(preChatChoices.length === 0);

  const handleChoiceSelect = useCallback((choiceId: string, optionId: string) => {
    setSelectedChoices((prev) => ({ ...prev, [choiceId]: optionId }));
  }, []);

  // Mark pre-chat done when all pre-chat choices are answered
  useEffect(() => {
    if (preChatChoices.length === 0) return;
    const allAnswered = preChatChoices.every((c) => selectedChoices[c.id]);
    if (allAnswered) {
      const timer = setTimeout(() => setPreChatDone(true), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedChoices, preChatChoices]);

  // Build choice context string for the AI prompt
  const choiceContext = Object.entries(selectedChoices)
    .map(([choiceId, optionId]) => {
      const choice = choices.find((c) => c.id === choiceId);
      const option = choice?.options.find((o) => o.id === optionId);
      if (!choice || !option) return '';
      return `[Player chose: "${option.label}" in response to "${choice.prompt}"]`;
    })
    .filter(Boolean)
    .join('\n');

  const crewMap = new Map<string, CrewMember>();
  for (const id of encounter.presentCrew) {
    const member = crewMembers.find((m) => m.id === id) ?? getCrewMember(id);
    if (member) crewMap.set(id, member);
  }

  const { messages, status, sendMessage } = useChat({
    id: `encounter-${encounter.slug}`,
    transport: new TextStreamChatTransport({
      api: '/api/living-lore/encounter',
      body: {
        presentCrew: encounter.presentCrew,
        sceneContext: encounter.sceneContext,
        choiceContext,
      },
    }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        sendMessage({ text: input.trim() });
        setInput('');
      }
    },
    [input, isLoading, sendMessage]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for scene completion in latest message
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'assistant') {
        const text = getMessageText(last);
        if (text.includes('[SCENE_COMPLETE]')) {
          setSceneComplete(true);
        }
      }
    }
  }, [messages]);

  // Escape key to navigate back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Derive firstCrewMember for typing indicator
  const firstCrewMember = crewMap.values().next().value as CrewMember | undefined;

  function resolveCharacter(content: string): { member: CrewMember | null; cleanContent: string } {
    const prefixMatch = content.match(/^\[([^\]]+)\]:\s*/);
    if (prefixMatch) {
      const name = prefixMatch[1].toLowerCase();
      for (const [, member] of crewMap) {
        if (member.name.toLowerCase() === name) {
          return { member, cleanContent: content.slice(prefixMatch[0].length) };
        }
      }
    }
    const firstCrew = crewMap.values().next();
    return {
      member: firstCrew.done ? null : firstCrew.value,
      cleanContent: content,
    };
  }

  const openingParagraphs = encounter.openingScript.split('\n\n');

  return (
    <LazyMotion features={domMax}>
      <div className="flex flex-col h-full max-w-3xl mx-auto">
        {/* Opening script */}
        {!sceneStarted && (
          <div className="liquid-glass-elevated px-4 py-10 flex-1 flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-widest text-text-dim font-semibold mb-3">
              Act {encounter.act} &mdash; Encounter
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-6">
              {encounter.title}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              {Array.from(crewMap.values()).map((member) => (
                <span
                  key={member.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                  style={{ backgroundColor: `${member.color}18` }}
                  title={member.name}
                >
                  {member.avatar}
                </span>
              ))}
            </div>

            <m.div
              variants={staggerContainer('slow')}
              initial="hidden"
              animate="visible"
              className="mb-8 space-y-4"
            >
              {openingParagraphs.map((para, i) => (
                <m.p
                  key={i}
                  variants={staggerItem}
                  className="text-sm text-text-primary/85 leading-relaxed"
                >
                  {para}
                </m.p>
              ))}
            </m.div>

            {/* Pre-chat choices */}
            {preChatChoices.length > 0 && (
              <div className="mb-6">
                {preChatChoices.map((choice) => (
                  <StoryChoice
                    key={choice.id}
                    choice={choice}
                    onSelect={(optionId) => handleChoiceSelect(choice.id, optionId)}
                    selectedId={selectedChoices[choice.id]}
                  />
                ))}
              </div>
            )}

            <div className="border-t border-white/[0.06] pt-6">
              <button
                onClick={() => setSceneStarted(true)}
                disabled={!preChatDone}
                className="animate-pulse-glow font-display text-sm font-semibold px-6 py-3 rounded-xl border border-atlantean-teal-aqua/30 bg-atlantean-teal-aqua/10 text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              >
                Enter the Scene
              </button>
            </div>
          </div>
        )}

        {/* Chat interface */}
        {sceneStarted && (
          <>
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {Array.from(crewMap.values()).map((member) => (
                  <span
                    key={member.id}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs border border-[#09090b]"
                    style={{ backgroundColor: `${member.color}30` }}
                    title={member.name}
                  >
                    {member.avatar}
                  </span>
                ))}
              </div>
              <span className="font-display text-xs font-semibold text-text-primary truncate">
                {encounter.title}
              </span>
              {sceneComplete && (
                <span className="ml-auto text-[10px] font-semibold text-gold-bright uppercase tracking-wider">
                  Scene Complete
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="text-xs text-text-dim italic border-l-2 border-white/[0.08] pl-3 mb-4">
                {encounter.openingScript.length > 200
                  ? encounter.openingScript.slice(0, 200) + '...'
                  : encounter.openingScript}
              </div>

              <div className="h-px w-full bg-white/[0.06] my-4" />

              <AnimatePresence mode="popLayout">
                {messages.map((msg) => {
                  const text = getMessageText(msg);
                  if (!text) return null;

                  if (msg.role === 'user') {
                    return (
                      <m.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={transitions.smooth}
                        className="flex justify-end"
                      >
                        <div className="glass-subtle max-w-[80%] rounded-2xl rounded-br-sm bg-white/[0.08] border border-white/[0.06] px-4 py-2.5">
                          <p className="text-sm text-text-primary leading-relaxed">{text}</p>
                        </div>
                      </m.div>
                    );
                  }

                  const { member, cleanContent } = resolveCharacter(text);

                  return (
                    <m.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transitions.smooth}
                      className="flex items-start gap-3"
                    >
                      {member && (
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm mt-0.5"
                          style={{ backgroundColor: `${member.color}18` }}
                        >
                          {member.avatar}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        {member && (
                          <p
                            className="text-[11px] font-semibold mb-1"
                            style={{ color: member.color }}
                          >
                            {member.name}
                          </p>
                        )}
                        <div
                          className="rounded-2xl rounded-tl-sm border px-4 py-2.5"
                          style={{
                            background: member ? member.color + '08' : 'rgba(255,255,255,0.03)',
                            borderColor: member ? member.color + '15' : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          <p className="text-sm text-text-primary/90 leading-relaxed whitespace-pre-line">
                            {cleanContent.replace('[SCENE_COMPLETE]', '')}
                          </p>
                        </div>
                      </div>
                    </m.div>
                  );
                })}
              </AnimatePresence>

              {isLoading && firstCrewMember && (
                <div className="flex items-center gap-3 px-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm animate-pulse"
                    style={{ backgroundColor: `${firstCrewMember.color}18` }}
                  >
                    {firstCrewMember.avatar}
                  </span>
                  <span className="text-xs animate-pulse" style={{ color: firstCrewMember.color }}>
                    {firstCrewMember.name} is speaking...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {!sceneComplete && (
              <form
                onSubmit={handleSubmit}
                className="px-4 py-3 pb-[env(safe-area-inset-bottom)] border-t border-white/[0.06]"
              >
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 focus-within:border-atlantean-teal-aqua/30 transition-colors">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Speak into the scene..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-dim outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-atlantean-teal-aqua/10 text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 disabled:opacity-30 transition-all"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15l-35.71-75.39,31.25-31.26a8,8,0,0,0-11.32-11.32l-31.25,31.25L21.2,115.29A16,16,0,0,1,23.64,86.56L215.58,28.37l.15,0A16,16,0,0,1,231.4,44.34Z" />
                    </svg>
                  </button>
                </div>
              </form>
            )}

            {sceneComplete && (
              <m.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springs.bouncy}
                className="px-4 py-6 border-t border-white/[0.06]"
              >
                {/* Post-chat choices */}
                {postChatChoices.length > 0 && (
                  <div className="mb-6">
                    {postChatChoices.map((choice) => (
                      <StoryChoice
                        key={choice.id}
                        choice={choice}
                        onSelect={(optionId) => handleChoiceSelect(choice.id, optionId)}
                        selectedId={selectedChoices[choice.id]}
                      />
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <m.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="font-display text-lg font-semibold text-gold-bright text-glow-soft"
                  >
                    Scene Complete
                  </m.p>
                  <p className="text-sm text-atlantean-teal-aqua mt-2">+{encounter.xpReward} XP</p>

                  {/* Bond effects summary */}
                  {Object.keys(selectedChoices).length > 0 && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, ...transitions.smooth }}
                      className="mt-4 flex flex-wrap justify-center gap-2"
                    >
                      {(() => {
                        // Aggregate bond effects from all selected choices
                        const bondMap = new Map<string, number>();
                        for (const [choiceId, optionId] of Object.entries(selectedChoices)) {
                          const choice = choices.find((c) => c.id === choiceId);
                          const option = choice?.options.find((o) => o.id === optionId);
                          if (option?.bondEffect) {
                            for (const effect of option.bondEffect) {
                              bondMap.set(
                                effect.memberId,
                                (bondMap.get(effect.memberId) ?? 0) + effect.change
                              );
                            }
                          }
                        }
                        return Array.from(bondMap.entries()).map(([memberId, change]) => {
                          const member = crewMembers.find((m) => m.id === memberId) ?? getCrewMember(memberId);
                          if (!member || change === 0) return null;
                          return (
                            <span
                              key={memberId}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs"
                              style={{
                                backgroundColor: `${member.color}15`,
                                color: member.color,
                              }}
                            >
                              {member.avatar} {member.name}{' '}
                              {change > 0 ? `+${change}` : change}
                            </span>
                          );
                        });
                      })()}
                    </m.div>
                  )}
                </div>
              </m.div>
            )}
          </>
        )}
      </div>
    </LazyMotion>
  );
}
