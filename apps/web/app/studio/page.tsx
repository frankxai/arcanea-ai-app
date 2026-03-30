"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth/context";
import { ModelSelector } from "@/components/chat/model-selector";
import {
  Pen,
  Image,
  Code,
  MusicNote,
  Sparkle,
  Star,
  Copy,
  Download,
  Trash,
  Info,
  Gear,
  ArrowRight,
  Clock,
  Lightning,
} from "@/lib/phosphor-icons";

import {
  TextCreationPanel,
  ImageCreationPanel,
  CodeCreationPanel,
  MusicCreationPanel,
  MODES,
  QUICK_START_CARDS,
  RECENT_CREATIONS,
  type CreationMode,
  type GeneratedImageData,
} from "./components";

// ---------------------------------------------------------------------------
// Main Studio Page
// ---------------------------------------------------------------------------

export default function StudioPage() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<CreationMode>("text");
  const [textContent, setTextContent] = useState("");
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "luminor"; text: string }[]
  >([]);
  const [aiInput, setAiInput] = useState("");

  // Intelligence Gateway model selection
  const [selectedModel, setSelectedModel] = useState("arcanea-auto");

  // Lifted state for image panel
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);

  // Lifted state for code panel
  const [codeContent, setCodeContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("TypeScript");

  const currentMode = MODES.find((m) => m.id === activeMode)!;

  const handleAskAI = useCallback(() => {
    if (!aiInput.trim()) return;

    const userMsg = aiInput.trim();
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");

    (async () => {
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: `You are ${currentMode.guardian}, a ${currentMode.element} Luminor of Arcanea. Help the creator with their ${activeMode} work. Be concise, wise, and practical. Respond in 2-3 sentences.` },
              ...aiMessages.slice(-6).map((m) => ({
                role: m.role === 'luminor' ? 'assistant' : 'user',
                content: m.text,
              })),
              { role: 'user', content: userMsg },
            ],
            luminorId: currentMode.guardian.toLowerCase(),
            gatewayModel: selectedModel || undefined,
          }),
        });

        if (res.ok && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';
          let streamBuffer = '';

          setAiMessages((prev) => [...prev, { role: 'luminor', text: '' }]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            streamBuffer += decoder.decode(value, { stream: true });
            const lines = streamBuffer.split('\n');
            streamBuffer = lines.pop() || '';
            for (const line of lines) {
              const match = line.match(/^0:"((?:[^"\\]|\\.)*)"/);
              if (match) {
                fullText += match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
              } else if (!line.startsWith('e:') && !line.startsWith('d:') && line.trim()) {
                fullText += line;
              }
            }
            setAiMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'luminor', text: fullText };
              return updated;
            });
          }
        } else {
          setAiMessages((prev) => [
            ...prev,
            { role: 'luminor', text: 'Connection is limited right now. Try again in a moment, or keep writing — sometimes the work itself is the best guide.' },
          ]);
        }
      } catch {
        setAiMessages((prev) => [
          ...prev,
          { role: 'luminor', text: 'Begin writing, and let the work reveal its own direction. The best ideas come from momentum.' },
        ]);
      }
    })();
  }, [aiInput, currentMode.guardian, currentMode.element, activeMode, aiMessages, selectedModel]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleManifest = useCallback(async () => {
    let contentBody: string;
    let contentPayload: Record<string, unknown>;
    let title: string;
    let description: string;

    switch (activeMode) {
      case 'text':
        contentBody = textContent.trim();
        if (!contentBody) {
          setSaveMessage('Write something first.');
          setTimeout(() => setSaveMessage(''), 3000);
          return;
        }
        title = contentBody.split('\n')[0].slice(0, 100) || 'Text creation';
        description = contentBody.slice(0, 500);
        contentPayload = { body: contentBody, mode: 'text' };
        break;

      case 'image':
        if (generatedImages.length === 0) {
          setSaveMessage('Generate an image first.');
          setTimeout(() => setSaveMessage(''), 3000);
          return;
        }
        title = imagePrompt.slice(0, 100) || 'Image creation';
        description = imagePrompt.slice(0, 500);
        contentPayload = {
          prompt: imagePrompt,
          images: generatedImages.map((img) => ({ url: img.url, prompt: img.prompt })),
          mode: 'image',
        };
        break;

      case 'code':
        contentBody = codeContent.trim();
        if (!contentBody) {
          setSaveMessage('Write some code first.');
          setTimeout(() => setSaveMessage(''), 3000);
          return;
        }
        title = `${codeLanguage} — ${contentBody.split('\n')[0].replace(/^\/\/\s*/, '').slice(0, 80) || 'Code creation'}`;
        description = contentBody.slice(0, 500);
        contentPayload = { body: contentBody, language: codeLanguage, mode: 'code' };
        break;

      case 'music':
        setSaveMessage('Music saving is not available yet.');
        setTimeout(() => setSaveMessage(''), 3000);
        return;

      default:
        return;
    }

    setIsSaving(true);
    setSaveMessage('');

    if (!user) {
      setSaveMessage('Sign in to save your creations.');
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    try {
      let res: Response;
      const activeProjectId =
        typeof window !== 'undefined' ? localStorage.getItem('arcanea_active_chat_project') : null;
      const activeSessionId =
        typeof window !== 'undefined' ? localStorage.getItem('arcanea_active_chat_session') : null;

      if (activeMode === 'image') {
        const primaryImage = generatedImages[0];
        res = await fetch('/api/studio/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: primaryImage.url,
            prompt: imagePrompt,
            title: title.trim(),
            element: currentMode.element,
            gate: currentMode.gate,
            guardian: currentMode.guardian,
            ...(activeProjectId ? { projectId: activeProjectId } : {}),
            ...(activeSessionId ? { sourceSessionId: activeSessionId } : {}),
          }),
        });
      } else {
        res = await fetch('/api/creations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            title: title.trim(),
            description: description.trim(),
            content: contentPayload,
            type: activeMode === 'text' ? 'text' : activeMode === 'code' ? 'code' : 'mixed',
            status: 'draft',
            visibility: 'private',
            element: currentMode.element as 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit',
            gate: currentMode.gate as 'Foundation' | 'Flow' | 'Fire' | 'Heart' | 'Voice' | 'Sight' | 'Crown' | 'Starweave' | 'Unity' | 'Source',
            guardian: currentMode.guardian,
            ...(activeProjectId ? { projectId: activeProjectId } : {}),
            ...(activeSessionId ? { sourceSessionId: activeSessionId } : {}),
          }),
        });
      }

      if (res.ok) {
        setSaveMessage('Saved as draft.');
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveMessage(data.error?.message || 'Sign in to save creations.');
      }
    } catch {
      setSaveMessage('Could not save. Check your connection.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 4000);
    }
  }, [textContent, imagePrompt, generatedImages, codeContent, codeLanguage, activeMode, currentMode.element, currentMode.gate, currentMode.guardian, user]);


  const modeIconMap: Record<CreationMode, React.ComponentType<Record<string, unknown>>> = {
    text: Pen,
    image: Image,
    code: Code,
    music: MusicNote,
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-[#060612] to-black -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display text-white/90">
              Studio
            </h1>
            <p className="text-xs text-white/30 mt-1">
              Create with the power of the Luminors
            </p>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-3">
            <ModelSelector
              value={selectedModel}
              onChange={setSelectedModel}
            />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <Lightning size={12} className="text-[#00bcd4]" />
              <span className="text-[10px] text-white/40">AI Connected</span>
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {MODES.map((mode) => {
            const ModeIcon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                  isActive
                    ? "border-white/[0.15] bg-white/[0.06] text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                <ModeIcon
                  size={16}
                  weight={isActive ? "fill" : "regular"}
                  style={{ color: isActive ? mode.elementColor : undefined }}
                />
                <span className="font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Creation Area */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] backdrop-blur-sm overflow-hidden min-h-[500px] flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: currentMode.elementColor,
                  boxShadow: `0 0 8px ${currentMode.elementColor}60`,
                }}
              />
              <span className="text-xs font-medium text-white/60">
                {currentMode.guardian}
              </span>
              <span className="text-white/15">—</span>
              <span className="text-xs text-white/30">
                {currentMode.description}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const content =
                    activeMode === "text" ? textContent :
                    activeMode === "code" ? codeContent :
                    activeMode === "image" ? imagePrompt : "";
                  if (content) navigator.clipboard.writeText(content);
                }}
                className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                title="Copy"
                aria-label="Copy content"
              >
                <Copy size={14} />
              </button>
              <button
                className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                title="Download"
                aria-label="Download content"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => {
                  if (activeMode === 'text') { setTextContent(""); setAiMessages([]); }
                  else if (activeMode === 'code') { setCodeContent(""); }
                  else if (activeMode === 'image') { setImagePrompt(""); setGeneratedImages([]); }
                }}
                className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                title="Clear"
                aria-label="Clear content"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          {activeMode === "text" && (
            <TextCreationPanel
              content={textContent}
              setContent={setTextContent}
              aiMessages={aiMessages}
              onAskAI={handleAskAI}
              aiInput={aiInput}
              setAiInput={setAiInput}
            />
          )}
          {activeMode === "image" && (
            <ImageCreationPanel
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              generatedImages={generatedImages}
              setGeneratedImages={setGeneratedImages}
            />
          )}
          {activeMode === "code" && (
            <CodeCreationPanel
              code={codeContent}
              setCode={setCodeContent}
              language={codeLanguage}
              setLanguage={setCodeLanguage}
              selectedModel={selectedModel}
            />
          )}
          {activeMode === "music" && <MusicCreationPanel />}
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-white/30">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentMode.elementColor, boxShadow: `0 0 6px ${currentMode.elementColor}60` }}
            />
            <span>{currentMode.label}</span>
            <span className="text-white/15">|</span>
            <span className="text-white/20">{currentMode.guardian}</span>
          </div>

          <div className="flex-1" />

          <button
            className="px-3 py-2 rounded-lg border border-white/[0.06] bg-white/[0.03] text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors flex items-center gap-2"
          >
            <Gear size={14} />
            Settings
          </button>

          {saveMessage && (
            <span className="text-xs text-[#00bcd4] animate-pulse">{saveMessage}</span>
          )}

          <button
            onClick={handleManifest}
            disabled={isSaving}
            className="group relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all overflow-hidden disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, #00bcd4, ${currentMode.elementColor}cc, #00bcd4)`,
              backgroundSize: "200% 200%",
              color: "#0a0a1a",
            }}
          >
            <span className="relative flex items-center gap-2">
              <Star size={16} weight="fill" />
              Save
            </span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.08] transition-colors" />
          </button>
        </div>

        {/* Recent Creations Section */}
        <section className="mt-6 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white/60 flex items-center gap-2">
              <Clock size={14} className="text-white/30" />
              Recent Creations
            </h2>
            <button className="text-[11px] text-[#00bcd4]/60 hover:text-[#00bcd4] transition-colors flex items-center gap-1">
              View all
              <ArrowRight size={10} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {RECENT_CREATIONS.map((creation) => {
              const CreationIcon = modeIconMap[creation.mode];
              const modeConfig = MODES.find((m) => m.id === creation.mode)!;
              return (
                <button
                  key={creation.id}
                  onClick={() => setActiveMode(creation.mode)}
                  className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-3.5 text-left transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.10]"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${modeConfig.elementColor}15` }}
                    >
                      <CreationIcon
                        size={14}
                        weight="duotone"
                        style={{ color: modeConfig.elementColor }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white/70 truncate group-hover:text-white/90 transition-colors">
                        {creation.title}
                      </p>
                      <p className="text-[10px] text-white/25 mt-0.5">{creation.timeAgo}</p>
                    </div>
                  </div>
                  {creation.preview && (
                    <p className="text-[10px] text-white/20 mt-2 line-clamp-1 italic">
                      {creation.preview}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
