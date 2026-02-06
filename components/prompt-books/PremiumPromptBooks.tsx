'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Eye,
  Save,
  Folder,
  Search,
  Settings,
  X
} from 'lucide-react';

// Types
interface PromptTag {
  id: string;
  label: string;
  category: string;
  weight: number;
  color: string;
}

interface PromptSection {
  id: string;
  name: string;
  prompts: PromptItem[];
}

interface PromptItem {
  id: string;
  name: string;
  content: string;
  tags: PromptTag[];
  negativePrompts?: string;
  category: 'txt2img' | 'img2img' | 'prompts';
}

// Premium Color Palette
const COLORS = {
  fire: { primary: '#ff6b35', secondary: '#ff8c42', glow: 'rgba(255, 107, 53, 0.3)' },
  water: { primary: '#4ecdc4', secondary: '#7fdbda', glow: 'rgba(78, 205, 196, 0.3)' },
  earth: { primary: '#8b7b61', secondary: '#a89984', glow: 'rgba(139, 123, 97, 0.3)' },
  air: { primary: '#74b9ff', secondary: '#a8d5ff', glow: 'rgba(116, 185, 255, 0.3)' },
  void: { primary: '#6c5ce7', secondary: '#a29bfe', glow: 'rgba(108, 92, 231, 0.3)' },
  master: { primary: '#fdcb6e', secondary: '#ffeaa7', glow: 'rgba(253, 203, 110, 0.3)' }
};

// Weight Control Component
const WeightControl: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}> = ({ value, onChange, min = 0.1, max = 2.0, step = 0.05, label }) => {
  const presets = [0.5, 0.8, 1.0, 1.1, 1.2, 1.5];

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-xs text-text-muted uppercase tracking-wider font-display">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-2 border border-white/10">
        <span className="text-sm font-mono text-arcane-crystal w-12 text-center">
          {value.toFixed(2)}
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-arcane-crystal"
        />
      </div>
      <div className="flex gap-1">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`px-2 py-1 text-xs rounded-lg font-mono transition-all ${
              Math.abs(value - preset) < 0.01
                ? 'bg-arcane-crystal/20 text-arcane-crystal border border-arcane-crystal/30'
                : 'bg-white/[0.03] text-text-muted hover:bg-white/[0.06] border border-white/5'
            }`}
          >
            {preset.toFixed(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

// Tag Builder Component
const TagBuilder: React.FC<{
  tags: PromptTag[];
  onTagsChange: (tags: PromptTag[]) => void;
}> = ({ tags, onTagsChange }) => {
  const categories = [
    { id: 'quality', label: 'Quality', color: 'bg-arcane-void', options: ['masterpiece', 'best quality', 'highly detailed', 'ultra-detailed', '8k', 'intricate'] },
    { id: 'style', label: 'Style', color: 'bg-arcane-fire', options: ['realistic', 'anime', 'digital art', 'oil painting', 'watercolor', 'concept art'] },
    { id: 'lighting', label: 'Lighting', color: 'bg-arcane-gold', options: ['volumetric lighting', 'cinematic lighting', 'dramatic lighting', 'soft lighting', 'golden hour'] },
    { id: 'mood', label: 'Mood', color: 'bg-arcane-water', options: ['epic', 'mysterious', 'serene', 'dark', 'whimsical', 'melancholic'] },
    { id: 'camera', label: 'Camera', color: 'bg-arcane-earth', options: ['wide angle', 'close-up', 'portrait', 'aerial view', 'bokeh', 'depth of field'] },
    { id: 'negative', label: 'Negative', color: 'bg-red-500', options: ['blurry', 'low quality', 'deformed', 'ugly', 'duplicate', 'watermark'] }
  ];

  const addTag = (category: string, label: string, color: string) => {
    const newTag: PromptTag = {
      id: `${Date.now()}_${Math.random()}`,
      label,
      category,
      weight: 1.0,
      color
    };
    onTagsChange([...tags, newTag]);
  };

  const removeTag = (id: string) => {
    onTagsChange(tags.filter(t => t.id !== id));
  };

  const updateTagWeight = (id: string, weight: number) => {
    onTagsChange(tags.map(t => t.id === id ? { ...t, weight } : t));
  };

  return (
    <div className="space-y-4">
      {/* Category Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="relative group">
            <button
              className={`w-full px-3 py-2 rounded-xl text-xs font-display ${cat.color} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}
            >
              {cat.label}
            </button>
            <div className="absolute top-full left-0 mt-1 w-full glass-strong border border-white/10 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none group-hover:pointer-events-auto">
              {cat.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => addTag(cat.id, opt, cat.color)}
                  className="w-full px-3 py-2 text-xs text-left text-text-secondary hover:bg-white/[0.06] hover:text-white first:rounded-t-xl last:rounded-b-xl transition-colors font-body"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active Tags with Weights */}
      <div className="space-y-2">
        {tags.map((tag) => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-2 border border-white/10"
          >
            <span className={`px-2 py-1 rounded-lg text-xs text-white ${tag.color}`}>
              {tag.label}
            </span>
            <WeightControl
              value={tag.weight}
              onChange={(w) => updateTagWeight(tag.id, w)}
              min={0.1}
              max={2.0}
              step={0.05}
            />
            <button
              onClick={() => removeTag(tag.id)}
              className="p-1 text-text-muted hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-4 text-text-disabled text-sm font-body">
          Click a category above to add tags
        </div>
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{
  sections: PromptSection[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}> = ({ sections, activeSection, onSectionChange }) => {
  return (
    <div className="w-64 bg-cosmic-deep border-r border-white/5 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-arcane-crystal to-arcane-water flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-white text-lg">Arcanea</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-disabled" />
          <input
            type="text"
            placeholder="Search prompts..."
            className="w-full pl-9 pr-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-arcane-crystal/50 font-body"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-text-disabled uppercase tracking-wider font-display mb-2 px-2">
          Sections
        </div>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all font-body ${
              activeSection === section.id
                ? 'bg-arcane-crystal/10 text-arcane-crystal border border-arcane-crystal/20'
                : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span className="flex-1 text-left">{section.name}</span>
            <span className="text-xs text-text-disabled">{section.prompts.length}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:bg-white/[0.03] transition-colors font-body">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

// Prompt Editor Component
const PromptEditor: React.FC<{
  prompt: PromptItem | null;
  onSave: (prompt: PromptItem) => void;
}> = ({ prompt, onSave }) => {
  const [content, setContent] = useState(prompt?.content || '');
  const [tags, setTags] = useState<PromptTag[]>(prompt?.tags || []);
  const [negativePrompts, setNegativePrompts] = useState(prompt?.negativePrompts || '');
  const [activeTab, setActiveTab] = useState<'prompts' | 'txt2img' | 'img2img'>('prompts');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prompt) {
      setContent(prompt.content);
      setTags(prompt.tags || []);
      setNegativePrompts(prompt.negativePrompts || '');
    }
  }, [prompt]);

  const generatePrompt = () => {
    const weightedTags = tags.map(t =>
      t.weight === 1.0 ? t.label : `(${t.label}:${t.weight.toFixed(2)})`
    ).join(', ');

    return `${content}${weightedTags ? ', ' + weightedTags : ''}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!prompt) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cosmic-void">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <p className="text-text-disabled font-body">Select a prompt to begin editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-cosmic-void">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-cosmic-deep/50">
        {[
          { id: 'prompts', label: 'Prompts', icon: Sparkles },
          { id: 'txt2img', label: 'Txt2Img', icon: Zap },
          { id: 'img2img', label: 'Img2Img', icon: RefreshCw }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'prompts' | 'txt2img' | 'img2img')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-body transition-all ${
              activeTab === tab.id
                ? 'bg-arcane-crystal/10 text-arcane-crystal border border-arcane-crystal/20'
                : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'prompts' && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Prompt Name */}
              <div>
                <input
                  type="text"
                  value={prompt.name}
                  readOnly
                  className="w-full text-2xl font-display bg-transparent text-white border-none focus:outline-none placeholder-text-disabled"
                />
              </div>

              {/* Main Prompt */}
              <div className="space-y-2">
                <label className="text-sm text-text-muted font-display">Prompt</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-32 p-4 bg-white/[0.03] border border-white/10 rounded-xl text-text-secondary font-body focus:outline-none focus:ring-2 focus:ring-arcane-crystal/50 focus:border-arcane-crystal/30 resize-none"
                  placeholder="Enter your prompt here..."
                />
              </div>

              {/* Tag Builder */}
              <div className="space-y-2">
                <label className="text-sm text-text-muted font-display">Enhancement Tags</label>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <TagBuilder tags={tags} onTagsChange={setTags} />
                </div>
              </div>

              {/* Negative Prompts */}
              <div className="space-y-2">
                <label className="text-sm text-text-muted font-display">Negative Prompts</label>
                <textarea
                  value={negativePrompts}
                  onChange={(e) => setNegativePrompts(e.target.value)}
                  className="w-full h-24 p-4 bg-white/[0.03] border border-red-500/20 rounded-xl text-text-muted font-body focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 resize-none"
                  placeholder="What to avoid in generation..."
                />
              </div>

              {/* Generated Output */}
              <div className="space-y-2">
                <label className="text-sm text-text-muted font-display">Generated Prompt</label>
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                  <div className="font-mono text-sm text-text-secondary leading-relaxed">
                    {generatePrompt()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-arcane-crystal text-cosmic-void rounded-xl font-display shadow-[0_0_25px_rgba(127,255,212,0.3)] hover:shadow-[0_0_35px_rgba(127,255,212,0.5)] transition-all"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSave({ ...prompt, content, tags, negativePrompts })}
                  className="flex items-center gap-2 px-6 py-3 glass border border-white/10 text-text-secondary rounded-xl font-display hover:bg-white/[0.06] transition-all"
                >
                  <Save className="w-5 h-5" />
                  Save
                </motion.button>
              </div>
            </motion.div>
          )}

          {activeTab === 'txt2img' && (
            <motion.div
              key="txt2img"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-arcane-gold mx-auto mb-4" />
                <h3 className="text-xl font-display text-white mb-2">Text to Image</h3>
                <p className="text-text-muted font-body">AI image generation coming soon...</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'img2img' && (
            <motion.div
              key="img2img"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center py-12">
                <RefreshCw className="w-16 h-16 text-arcane-water mx-auto mb-4" />
                <h3 className="text-xl font-display text-white mb-2">Image to Image</h3>
                <p className="text-text-muted font-body">Image transformation coming soon...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Guardian Panel Component
const GuardianPanel: React.FC = () => {
  const [activeGuardian, setActiveGuardian] = useState('dragon-forge');

  const guardians = [
    { id: 'dragon-forge', name: 'Dragon Forge', element: 'fire', icon: Flame, color: COLORS.fire },
    { id: 'river-storyteller', name: 'River Story', element: 'water', icon: Droplets, color: COLORS.water },
    { id: 'crystal-architect', name: 'Crystal Arch', element: 'earth', icon: Mountain, color: COLORS.earth },
    { id: 'whisper-messenger', name: 'Whisper', element: 'air', icon: Wind, color: COLORS.air },
    { id: 'void-gazer', name: 'Void Gazer', element: 'void', icon: Eye, color: COLORS.void }
  ];

  return (
    <div className="w-72 bg-cosmic-deep border-l border-white/5 p-4">
      <div className="text-xs text-text-disabled uppercase tracking-wider font-display mb-4">
        Active Guardian
      </div>

      <div className="space-y-2 mb-6">
        {guardians.map((guardian) => (
          <button
            key={guardian.id}
            onClick={() => setActiveGuardian(guardian.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeGuardian === guardian.id
                ? 'glass border border-white/10'
                : 'hover:bg-white/[0.03]'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${guardian.color.primary}, ${guardian.color.secondary})`,
                boxShadow: `0 0 20px ${guardian.color.glow}`
              }}
            >
              <guardian.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-body text-text-secondary">{guardian.name}</div>
              <div className="text-xs text-text-disabled capitalize">{guardian.element}</div>
            </div>
            {activeGuardian === guardian.id && (
              <div className="w-2 h-2 rounded-full bg-arcane-crystal animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        <div className="text-xs text-text-disabled uppercase tracking-wider font-display">
          Suggestions
        </div>
        <div className="space-y-2">
          {[
            { text: 'Add atmospheric lighting', type: 'lighting' },
            { text: 'Enhance emotional depth', type: 'emotion' },
            { text: 'Try different perspective', type: 'composition' }
          ].map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-3 glass-subtle rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors group"
            >
              <div className="text-xs text-text-secondary group-hover:text-white transition-colors font-body">
                {suggestion.text}
              </div>
              <div className="text-xs text-text-disabled mt-1">{suggestion.type}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Application Component
export default function ArcaneaPromptBooksPremium() {
  const [sections] = useState<PromptSection[]>([
    {
      id: 'default',
      name: 'Default',
      prompts: [
        {
          id: '1',
          name: 'Atlantia',
          content: '/imagine prompt:Atlantia, holding a magical glowing Tulkun, avatar, pandora world, goddess, female embodiment of the Arcane power of the Arcanean Universe, Tulkun, Spade Wing, Skimwing, Sagittaria, Pincer Fish Nalutsa, Ilu, Akula, Anemonoid, musical vibes, vibrant full, tasteful, luxurious power, glowing details, smooth, looking at the viewer, surrounded by magical creatures and mystical landscapes, hourglass body',
          tags: [
            { id: 't1', label: 'best quality', category: 'quality', weight: 1.1, color: 'bg-arcane-void' },
            { id: 't2', label: 'highly detailed', category: 'quality', weight: 1.05, color: 'bg-arcane-void' },
            { id: 't3', label: 'masterpiece', category: 'quality', weight: 1.0, color: 'bg-arcane-void' },
            { id: 't4', label: 'ultra', category: 'quality', weight: 1.0, color: 'bg-arcane-void' }
          ],
          category: 'prompts',
          negativePrompts: 'blurry, low quality, deformed, ugly, duplicate, watermark'
        },
        {
          id: '2',
          name: 'Character Portrait',
          content: 'A mystical character portrait with ethereal lighting and detailed features',
          tags: [
            { id: 't5', label: 'masterpiece', category: 'quality', weight: 1.1, color: 'bg-arcane-void' },
            { id: 't6', label: 'detailed face', category: 'quality', weight: 1.2, color: 'bg-arcane-void' }
          ],
          category: 'prompts'
        },
        {
          id: '3',
          name: 'Fantasy Landscape',
          content: 'An epic fantasy landscape with floating islands and magical aurora',
          tags: [
            { id: 't7', label: 'epic', category: 'mood', weight: 1.1, color: 'bg-arcane-water' },
            { id: 't8', label: '8k', category: 'quality', weight: 1.0, color: 'bg-arcane-void' }
          ],
          category: 'prompts'
        }
      ]
    },
    {
      id: 'characters',
      name: 'Characters',
      prompts: [
        {
          id: '4',
          name: 'Kira Vance',
          content: 'Storm seeker character with cybernetic arm and determined expression',
          tags: [],
          category: 'prompts'
        },
        {
          id: '5',
          name: 'Jaxon Prime',
          content: 'Crystal guardian with ancient wisdom and protective aura',
          tags: [],
          category: 'prompts'
        }
      ]
    },
    {
      id: 'worlds',
      name: 'Worlds',
      prompts: [
        {
          id: '6',
          name: 'Venus Floating Cities',
          content: 'Futuristic floating cities above Venus cloud layers',
          tags: [],
          category: 'prompts'
        }
      ]
    }
  ]);

  const [activeSection, setActiveSection] = useState('default');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(sections[0].prompts[0]);

  const handleSave = (prompt: PromptItem) => {
    console.log('Saving prompt:', prompt);
  };

  return (
    <div className="min-h-screen bg-cosmic-void flex">
      {/* Sidebar */}
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSectionChange={(id) => {
          setActiveSection(id);
          const section = sections.find(s => s.id === id);
          if (section && section.prompts.length > 0) {
            setSelectedPrompt(section.prompts[0]);
          }
        }}
      />

      {/* Prompt List */}
      <div className="w-72 bg-cosmic-deep border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <span className="font-display text-white">
              {sections.find(s => s.id === activeSection)?.name}
            </span>
            <button className="p-2 hover:bg-white/[0.03] rounded-xl transition-colors">
              <Plus className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {sections
            .find(s => s.id === activeSection)?.prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => setSelectedPrompt(prompt)}
              className={`w-full text-left p-3 rounded-xl mb-1 transition-all ${
                selectedPrompt?.id === prompt.id
                  ? 'bg-arcane-crystal/10 border border-arcane-crystal/20'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="font-body text-sm text-text-secondary mb-1">
                {prompt.name}
              </div>
              <div className="text-xs text-text-disabled line-clamp-2 font-body">
                {prompt.content.substring(0, 60)}...
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <PromptEditor prompt={selectedPrompt} onSave={handleSave} />

      {/* Guardian Panel */}
      <GuardianPanel />
    </div>
  );
}
