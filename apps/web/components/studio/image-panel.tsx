"use client";

import { useState, useCallback } from "react";
import {
  Image,
  Sparkle,
  Download,
  Eye,
  Info,
} from "@/lib/phosphor-icons";
import { IMAGE_STYLES, ASPECT_RATIOS } from "./studio-types";
import type { GeneratedImageData } from "./studio-types";
import type { ImagineGenerationResponse } from "@/lib/imagine/contracts";

// ---------------------------------------------------------------------------
// Image Creation Panel
// ---------------------------------------------------------------------------

interface ImageCreationPanelProps {
  imagePrompt: string;
  setImagePrompt: (val: string) => void;
  generatedImages: GeneratedImageData[];
  setGeneratedImages: (val: GeneratedImageData[]) => void;
}

export function ImageCreationPanel({
  imagePrompt,
  setImagePrompt,
  generatedImages,
  setGeneratedImages,
}: ImageCreationPanelProps) {
  const [style, setStyle] = useState("Fantasy Art");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!imagePrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setImageError(null);

    const fullPrompt = `${imagePrompt.trim()}, ${style.toLowerCase()} style`;

    try {
      const res = await fetch("/api/imagine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt, count: 4, aspectRatio }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Generation failed (${res.status})`);
      }

      const data = (await res.json()) as ImagineGenerationResponse;
      const images: GeneratedImageData[] = (data.images || []).map(
        (
          img: {
            url?: string;
            data?: string;
            mimeType?: string;
            prompt?: string;
          },
          i: number
        ) => ({
          id: `studio_img_${Date.now()}_${i}`,
          url:
            img.url ||
            (img.data
              ? `data:${img.mimeType || "image/png"};base64,${img.data}`
              : ""),
          prompt: img.prompt || fullPrompt,
        })
      );

      setGeneratedImages(images);
      if (images.length > 0) setSelectedImage(images[0].id);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : "Image generation failed"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [imagePrompt, style, aspectRatio, isGenerating, setGeneratedImages]);

  const activeImage = generatedImages.find((img) => img.id === selectedImage);

  return (
    <div className="flex flex-col lg:flex-row gap-0 flex-1 min-h-0">
      {/* Prompt Input */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">
            Describe your vision
          </span>
        </div>

        <textarea
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              (e.metaKey || e.ctrlKey) &&
              imagePrompt.trim()
            ) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Describe the image you want to create...

Example: A solitary figure on a cliff edge at twilight,
crystalline light spreading across the horizon,
in the style of epic fantasy concept art."
          aria-label="Image prompt"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#7fffd4]/20 focus:ring-inset min-h-[200px]"
        />

        {/* Controls */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02] space-y-3">
          <div>
            <p className="text-xs text-text-muted mb-2">Style:</p>
            <div className="flex flex-wrap gap-2">
              {IMAGE_STYLES.map((s) => (
                <PillBtn
                  key={s}
                  active={style === s}
                  onClick={() => setStyle(s)}
                >
                  {s}
                </PillBtn>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-2">Aspect ratio:</p>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((r) => (
                <PillBtn
                  key={r}
                  active={aspectRatio === r}
                  onClick={() => setAspectRatio(r)}
                  mono
                >
                  {r}
                </PillBtn>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={!imagePrompt.trim() || isGenerating}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isGenerating
                ? "rgba(127,255,212,0.12)"
                : "linear-gradient(135deg, #7fffd4, #00bcd4)",
              color: isGenerating ? "#7fffd4" : "#0a0a1a",
            }}
          >
            {isGenerating ? (
              <>
                <Sparkle
                  size={14}
                  className="animate-spin"
                  style={{ animationDuration: "2s" }}
                />
                Generating...
              </>
            ) : (
              <>
                <Sparkle size={14} weight="fill" />
                Generate Image
              </>
            )}
          </button>
          <p className="text-[10px] text-text-muted text-center">
            {imagePrompt.trim()
              ? "Ctrl+Enter to generate"
              : "Enter a prompt to begin"}
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="lg:w-[400px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Eye size={14} className="text-text-muted" />
          <span className="text-xs font-semibold text-text-primary">
            Preview
          </span>
          {generatedImages.length > 0 && (
            <span className="text-[10px] text-text-muted ml-auto">
              {generatedImages.length} image
              {generatedImages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {imageError && (
            <div className="mb-3 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-300 flex items-center justify-between">
              <span>{imageError}</span>
              <button
                onClick={() => setImageError(null)}
                className="text-red-400 hover:text-red-300 ml-2 shrink-0"
                aria-label="Dismiss error"
              >
                <Info size={12} />
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 flex items-center justify-center">
                <Sparkle
                  size={24}
                  className="text-[#7fffd4] animate-spin"
                  style={{ animationDuration: "2s" }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-primary">
                  Generating your vision...
                </p>
                <p className="text-[11px] text-text-muted mt-1">
                  This may take 10-30 seconds
                </p>
              </div>
            </div>
          )}

          {!isGenerating && generatedImages.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#7fffd4]/10 border border-[#7fffd4]/20 flex items-center justify-center">
                <Image size={28} className="text-[#7fffd4]/60" />
              </div>
              <div className="text-center">
                <p className="text-sm text-text-muted">
                  {imagePrompt.trim()
                    ? "Ready to generate"
                    : "Describe your image"}
                </p>
                <p className="text-[11px] text-text-muted/60 mt-1">
                  {imagePrompt.trim()
                    ? `Style: ${style} | ${aspectRatio}`
                    : "Your creation will appear here"}
                </p>
              </div>
            </div>
          )}

          {!isGenerating && activeImage && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-white/[0.08] group">
                <img
                  src={activeImage.url}
                  alt={activeImage.prompt}
                  className="w-full object-contain bg-black/20"
                />
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={activeImage.url}
                    download={`arcanea-${activeImage.id}.png`}
                    className="p-2 rounded-lg bg-black/60 border border-white/[0.12] text-white hover:bg-black/80 transition-colors"
                    title="Download"
                  >
                    <Download size={12} />
                  </a>
                </div>
              </div>

              {generatedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {generatedImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                        selectedImage === img.id
                          ? "border-[#7fffd4]/50 ring-1 ring-[#7fffd4]/30"
                          : "border-white/[0.06] hover:border-white/[0.12]"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared Pill Button
// ---------------------------------------------------------------------------

function PillBtn({
  active,
  onClick,
  children,
  mono,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
        mono ? "font-mono" : ""
      } ${
        active
          ? "border-[#7fffd4]/40 bg-[#7fffd4]/15 text-[#7fffd4]"
          : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
      }`}
    >
      {children}
    </button>
  );
}
