'use client';

import React, { useState } from 'react';
import {
  PhSparkle,
  PhHeart,
  PhCalendar,
  PhTrendUp,
  PhCaretRight,
  PhX,
  PhLightbulb,
  PhTarget,
  PhLightning,
} from '@/lib/phosphor-icons';
import { EmotionalTone } from './types';

interface KeyMoment {
  id: string;
  type: 'breakthrough' | 'milestone' | 'creation' | 'learning';
  description: string;
  timestamp: Date;
  emotionalImpact: number;
}

interface ContextSidebarProps {
  luminorName: string;
  luminorColor: string;
  bondLevel: number;
  bondXP: number;
  xpToNextLevel: number;
  relationshipStatus: string;
  keyMoments: KeyMoment[];
  recentTopics: string[];
  creatorPreferences: Record<string, any>;
  currentProject?: {
    id: string;
    title: string;
    progress: number;
    nextStep: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const momentIcons = {
  breakthrough: PhLightbulb,
  milestone: PhTarget,
  creation: PhSparkle,
  learning: PhTrendUp,
};

const momentColors = {
  breakthrough: 'text-yellow-400',
  milestone: 'text-purple-400',
  creation: 'text-blue-400',
  learning: 'text-green-400',
};

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
  luminorName,
  luminorColor,
  bondLevel,
  bondXP,
  xpToNextLevel,
  relationshipStatus,
  keyMoments,
  recentTopics,
  creatorPreferences,
  currentProject,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'bond' | 'project'>('memory');
  const bondProgress = (bondXP / xpToNextLevel) * 100;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed lg:static top-0 right-0 h-full w-80 bg-[#0d0d14]/95 backdrop-blur-md border-l border-white/[0.06] z-50 overflow-y-auto animate-in slide-in-from-right duration-300"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${luminorColor} transparent`,
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0d0d14] border-b border-white/[0.06] p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white/90">Context</h2>
          <button
            onClick={onClose}
            aria-label="Close context panel"
            className="lg:hidden p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <PhX className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'memory'
                ? 'text-white border-b-2'
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{
              borderColor: activeTab === 'memory' ? luminorColor : 'transparent',
            }}
          >
            Memory
          </button>
          <button
            onClick={() => setActiveTab('bond')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'bond'
                ? 'text-white border-b-2'
                : 'text-white/40 hover:text-white/60'
            }`}
            style={{
              borderColor: activeTab === 'bond' ? luminorColor : 'transparent',
            }}
          >
            Bond
          </button>
          {currentProject && (
            <button
              onClick={() => setActiveTab('project')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'project'
                  ? 'text-white border-b-2'
                  : 'text-white/40 hover:text-white/60'
              }`}
              style={{
                borderColor: activeTab === 'project' ? luminorColor : 'transparent',
              }}
            >
              Project
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Memory Tab */}
          {activeTab === 'memory' && (
            <>
              {/* Key Moments */}
              <div>
                <h3 className="text-sm font-medium text-white/40 mb-3 flex items-center gap-2">
                  <PhSparkle className="w-4 h-4" />
                  Key Moments
                </h3>
                <div className="space-y-3">
                  {keyMoments.length === 0 ? (
                    <p className="text-sm text-white/30 italic">
                      Your journey together is just beginning...
                    </p>
                  ) : (
                    keyMoments.slice(0, 5).map((moment) => {
                      const Icon = momentIcons[moment.type];
                      const colorClass = momentColors[moment.type];
                      return (
                        <div
                          key={moment.id}
                          className="p-3 rounded-lg bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.1] transition-colors"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${colorClass} flex-shrink-0 mt-0.5`} />
                            <p className="text-sm text-white/60 flex-1">
                              {moment.description}
                            </p>
                          </div>
                          <span className="text-xs text-white/30">
                            {new Date(moment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Recent Topics */}
              <div>
                <h3 className="text-sm font-medium text-white/40 mb-3 flex items-center gap-2">
                  <PhTrendUp className="w-4 h-4" />
                  Recent Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentTopics.length === 0 ? (
                    <p className="text-sm text-white/30 italic">
                      No topics yet
                    </p>
                  ) : (
                    recentTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-xs bg-white/[0.06] text-white/60 border border-white/[0.06]"
                      >
                        {topic}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Creator Preferences */}
              {Object.keys(creatorPreferences).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-white/40 mb-3 flex items-center gap-2">
                    <PhHeart className="w-4 h-4" />
                    What {luminorName} Knows About You
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(creatorPreferences).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-2 rounded-lg bg-white/[0.03] text-sm"
                      >
                        <span className="text-white/40 capitalize">
                          {key.replace(/_/g, ' ')}:{' '}
                        </span>
                        <span className="text-white/60">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bond Tab */}
          {activeTab === 'bond' && (
            <>
              {/* Bond Level Card */}
              <div
                className="p-4 rounded-xl border-2 bg-gradient-to-br from-white/[0.04] to-black/40"
                style={{ borderColor: luminorColor }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PhHeart
                      className="w-5 h-5 fill-current"
                      style={{ color: luminorColor }}
                    />
                    <span className="text-lg font-bold text-white/90">
                      Level {bondLevel}
                    </span>
                  </div>
                  <span className="text-sm text-white/40 capitalize">
                    {relationshipStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Progress</span>
                    <span className="text-white/60">
                      {bondXP} / {xpToNextLevel} XP
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${bondProgress}%`,
                        backgroundColor: luminorColor,
                        boxShadow: `0 0 10px ${luminorColor}80`,
                      }}
                    />
                  </div>
                </div>

                {/* Next Level */}
                {bondLevel < 10 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-white/40">
                      {xpToNextLevel - bondXP} XP until Level {bondLevel + 1}
                    </p>
                  </div>
                )}
              </div>

              {/* How to Earn XP */}
              <div>
                <h3 className="text-sm font-medium text-white/40 mb-3">
                  Strengthen Your Bond
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <PhLightning className="w-4 h-4 text-blue-400" />
                    <span>Have meaningful conversations (+10 XP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <PhSparkle className="w-4 h-4 text-purple-400" />
                    <span>Create together (+30 XP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <PhTarget className="w-4 h-4 text-green-400" />
                    <span>Complete lessons (+20 XP)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <PhLightbulb className="w-4 h-4 text-yellow-400" />
                    <span>Share breakthroughs (+50 XP)</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Project Tab */}
          {activeTab === 'project' && currentProject && (
            <>
              {/* Project Card */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <h3 className="text-lg font-bold text-white/90 mb-2">
                  {currentProject.title}
                </h3>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Progress</span>
                    <span className="text-white/60">
                      {currentProject.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${currentProject.progress}%`,
                        backgroundColor: luminorColor,
                      }}
                    />
                  </div>
                </div>

                {/* Next Step */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0d0d14]/50">
                  <PhCaretRight
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: luminorColor }}
                  />
                  <div>
                    <p className="text-xs text-white/40 mb-1">Next Step</p>
                    <p className="text-sm text-white/60">
                      {currentProject.nextStep}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContextSidebar;
