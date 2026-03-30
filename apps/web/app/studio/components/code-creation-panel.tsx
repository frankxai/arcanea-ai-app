"use client";

import { useState, useCallback } from "react";
import {
  Code,
  Brain,
  Sparkle,
  PaperPlane,
  Terminal,
  Play,
} from "@/lib/phosphor-icons";
import { CODE_SUGGESTIONS } from "./studio-types";

interface CodeCreationPanelProps {
  code: string;
  setCode: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  selectedModel: string;
}

export function CodeCreationPanel({
  code,
  setCode,
  language,
  setLanguage,
  selectedModel,
}: CodeCreationPanelProps) {
  const [codeAiInput, setCodeAiInput] = useState("");
  const [codeAiMessages, setCodeAiMessages] = useState<
    { role: "user" | "luminor"; text: string }[]
  >([]);
  const [isCodeGenerating, setIsCodeGenerating] = useState(false);

  const languages = ["TypeScript", "JavaScript", "Python", "Rust", "Go", "SQL"];

  const handleCodeAI = useCallback(async () => {
    if (!codeAiInput.trim() || isCodeGenerating) return;

    const userMsg = codeAiInput.trim();
    setCodeAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setCodeAiInput("");
    setIsCodeGenerating(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are Shinkami, the Source Luminor — a master programmer. Help with ${language} code. If generating code, wrap it in a code block. Be concise.`,
            },
            ...(code.trim()
              ? [{ role: "user" as const, content: `Current code:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`` }]
              : []),
            ...codeAiMessages.slice(-4).map((m) => ({
              role: (m.role === "luminor" ? "assistant" : "user") as "assistant" | "user",
              content: m.text,
            })),
            { role: "user" as const, content: userMsg },
          ],
          luminorId: "shinkami",
          gatewayModel: selectedModel || undefined,
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        let streamBuffer = "";

        setCodeAiMessages((prev) => [...prev, { role: "luminor", text: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          streamBuffer += decoder.decode(value, { stream: true });
          const lines = streamBuffer.split("\n");
          streamBuffer = lines.pop() || "";
          for (const line of lines) {
            const match = line.match(/^0:"((?:[^"\\]|\\.)*)"/);
            if (match) {
              fullText += match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
            } else if (
              !line.startsWith("e:") &&
              !line.startsWith("d:") &&
              line.trim()
            ) {
              fullText += line;
            }
          }
          setCodeAiMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "luminor", text: fullText };
            return updated;
          });
        }

        // Extract code blocks for apply button
        const codeBlockMatch = fullText.match(
          /```[\w]*\n([\s\S]*?)```/
        );
        if (codeBlockMatch) {
          setCodeAiMessages((prev) => [
            ...prev,
            { role: "luminor", text: `__CODE_BLOCK__${codeBlockMatch[1].trim()}` },
          ]);
        }
      } else {
        setCodeAiMessages((prev) => [
          ...prev,
          {
            role: "luminor",
            text: "Connection is limited right now. Try again in a moment.",
          },
        ]);
      }
    } catch {
      setCodeAiMessages((prev) => [
        ...prev,
        {
          role: "luminor",
          text: "Could not reach the AI. Check your connection.",
        },
      ]);
    } finally {
      setIsCodeGenerating(false);
    }
  }, [codeAiInput, code, language, codeAiMessages, isCodeGenerating, selectedModel]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Left: Code Editor */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <Terminal size={14} className="text-brand-gold" />
          <div className="flex items-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  language === lang
                    ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
                    : "text-text-muted hover:text-text-secondary hover:bg-white/[0.04]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Start writing ${language}...\n// The AI panel can generate, explain, refactor, or debug your code.\n\n`}
          aria-label="Code editor"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[300px] tab-size-2"
          spellCheck={false}
        />

        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/[0.08] bg-white/[0.02] text-xs text-text-muted font-mono">
          <span>{language}</span>
          <span>{code.split("\n").length} lines</span>
          {isCodeGenerating && (
            <span className="flex items-center gap-1.5 text-brand-gold">
              <Sparkle size={10} className="animate-spin" style={{ animationDuration: "2s" }} />
              AI thinking...
            </span>
          )}
        </div>
      </div>

      {/* Right: AI Panel */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold to-brand-primary flex items-center justify-center">
            <Brain size={14} className="text-cosmic-void" />
          </div>
          <span className="text-xs font-semibold text-text-primary">Code AI</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {codeAiMessages.length === 0 ? (
            <>
              <p className="text-xs text-text-muted mb-3 px-1">Code assistance:</p>
              {CODE_SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    setCodeAiInput(s.title);
                    setTimeout(handleCodeAI, 50);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-brand-gold/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <Code size={14} className="text-brand-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-text-primary group-hover:text-brand-gold transition-colors">{s.title}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{s.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            codeAiMessages.map((msg, i) => {
              if (msg.role === "luminor" && msg.text.startsWith("__CODE_BLOCK__")) {
                const extractedCode = msg.text.replace("__CODE_BLOCK__", "");
                return (
                  <div key={i} className="p-2 rounded-xl bg-brand-gold/5 border border-brand-gold/20">
                    <button
                      onClick={() => setCode(extractedCode)}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-medium text-brand-gold hover:bg-brand-gold/10 transition-colors flex items-center gap-1.5"
                    >
                      <Play size={10} weight="fill" />
                      Apply generated code to editor
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand-primary/10 border border-brand-primary/20 text-text-primary ml-6"
                      : "bg-white/[0.03] border border-white/[0.08] text-text-secondary mr-2"
                  }`}
                >
                  {msg.role === "luminor" && (
                    <div className="flex items-center gap-1.5 mb-1.5 text-brand-gold">
                      <Code size={10} />
                      <span className="font-semibold text-[10px] uppercase tracking-wider">Code AI</span>
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">{msg.text}</pre>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={codeAiInput}
              onChange={(e) => setCodeAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && codeAiInput.trim()) handleCodeAI();
              }}
              placeholder="Ask about code..."
              aria-label="Ask about code"
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-brand-gold/40 focus:ring-2 focus:ring-brand-gold/20 transition-colors"
            />
            <button
              onClick={handleCodeAI}
              disabled={!codeAiInput.trim() || isCodeGenerating}
              className="p-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-primary text-cosmic-void hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send code question"
            >
              <PaperPlane size={14} weight="fill" />
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2 px-1">
            Code in the editor is sent as context to the AI.
          </p>
        </div>
      </div>
    </div>
  );
}
