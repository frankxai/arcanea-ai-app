"use client";

import { useState, useCallback } from "react";
import { Sparkle, Eye, Copy, Download } from "@/lib/phosphor-icons";
import type { GeneratedImageData } from "./studio-types";

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
  const prompt = imagePrompt;
  const setPrompt = setImagePrompt;

  const styles = [
    "Fantasy Art",
    "Cosmic Abstract",
    "Character Portrait",
    "Landscape",
    "Concept Art",
    "Watercolor",
    "Digital Painting",
  ];

  const ratios = ["1:1", "16:9", "9:16", "4:3", "3:2"];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setImageError(null);

    const fullPrompt = `${prompt.trim()}, ${style.toLowerCase()} style`;

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

      const data = await res.json();
      const images: GeneratedImageData[] = (data.images || []).map(
        (img: { url?: string; data?: string; mimeType?: string; prompt?: string }, i: number) => ({
          id: `studio_img_${Date.now()}_${i}`,
          url: img.url || (img.data ? `data:${img.mimeType || "image/png"};base64,${img.data}` : ""),
          prompt: img.prompt || fullPrompt,
        })
      );

      setGeneratedImages(images);
      if (images.length > 0) setSelectedImage(images[0].id);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, style, aspectRatio, isGenerating, setGeneratedImages]);

  const activeImage = generatedImages.find((img) => img.id === selectedImage);

  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
      {/* Left: Prompt Input */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <span className="text-xs text-text-muted font-mono">
            Describe your vision
          </span>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && prompt.trim()) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Describe the image you want to create...

Example: A solitary figure on a cliff edge at twilight,
crystalline light spreading across the horizon,
in the style of epic fantasy concept art."
          aria-label="Image prompt"
          className="flex-1 w-full resize-none bg-transparent text-text-primary placeholder-text-muted/40 p-4 font-body text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:ring-inset min-h-[200px]"
        />

        {/* Style & Ratio selectors */}
        <div className="px-4 py-3 border-t border-white/[0.08] bg-white/[0.02] space-y-3">
          <div>
            <p className="text-xs text-text-muted mb-2">Style:</p>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    style === s
                      ? "border-red-400/40 bg-red-400/15 text-red-400"
                      : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-2">Aspect Ratio:</p>
            <div className="flex flex-wrap gap-2">
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    aspectRatio === r
                      ? "border-red-400/40 bg-red-400/15 text-red-400"
                      : "border-white/[0.06] bg-white/[0.04] text-text-muted hover:border-white/[0.12]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 transition-opacity disabled:opacity-30 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkle size={16} className="animate-spin" style={{ animationDuration: "2s" }} />
                Generating...
              </>
            ) : (
              "Generate Images"
            )}
          </button>

          {imageError && (
            <p className="text-xs text-red-400">{imageError}</p>
          )}
        </div>
      </div>

      {/* Right: Generated Images */}
      <div className="lg:w-[340px] flex flex-col border-l border-white/[0.08] min-h-0">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-white/[0.02]">
          <Eye size={14} className="text-red-400" />
          <span className="text-xs font-semibold text-text-primary">Generated</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {generatedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-xs text-text-muted">
                Your generated images will appear here.
              </p>
              <p className="text-[10px] text-text-muted/50 mt-2">
                Ctrl+Enter to generate
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Main preview */}
              {activeImage && (
                <div className="relative rounded-xl overflow-hidden border border-white/[0.08]">
                  <img
                    src={activeImage.url}
                    alt={activeImage.prompt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-2">
                    <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Copy">
                      <Copy size={12} className="text-white" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Download">
                      <Download size={12} className="text-white" />
                    </button>
                  </div>
                </div>
              )}
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {generatedImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.id)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.id
                        ? "border-red-400/60"
                        : "border-transparent hover:border-white/20"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
