/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Pages — server-side helpers: slug generation, source extraction, and the LLM
 * formatter that distils a chat thread into a structured, publishable article.
 *
 * The formatter picks whichever provider has a server key configured (Google →
 * Anthropic → OpenAI), mirroring api/ai/chat's provider precedence. If no key is
 * present it returns null and the caller responds with a BYOK-style 503.
 */

import { generateText, type LanguageModel } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {
  createAnthropic,
  type AnthropicProviderOptions,
} from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { claudeFallbackOptions, isRefusal } from "@/lib/ai/claude-safeguards";
import { claudeRejectsSamplingParams } from "@/lib/gateway/catalog";
import { isHttpUrl, type PageSection, type PageSource } from "./types";

// Re-exported for back-compat: callers (and tests) may import isHttpUrl from here.
export { isHttpUrl };

export interface ThreadMessage {
  role: string;
  content: string;
}

export interface FormattedPage {
  title: string;
  summary: string;
  sections: PageSection[];
  sources: PageSource[];
}

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** URL- and SEO-safe slug derived from the title + a short random suffix. */
export function slugify(title: string): string {
  const base =
    (title || "page")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "") // strip combining diacritics
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "page";
  return `${base}-${randomId().slice(0, 6)}`;
}

interface PageModel {
  model: LanguageModel;
  modelId: string;
}

function pickModel(): PageModel | null {
  const google =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (google) {
    const modelId = "gemini-2.0-flash";
    return {
      model: createGoogleGenerativeAI({ apiKey: google })(modelId),
      modelId,
    };
  }
  const anthropic = process.env.ANTHROPIC_API_KEY;
  if (anthropic) {
    const modelId = "claude-sonnet-5-5";
    return { model: createAnthropic({ apiKey: anthropic })(modelId), modelId };
  }
  const openai = process.env.OPENAI_API_KEY;
  if (openai) {
    const modelId = "gpt-4o";
    return { model: createOpenAI({ apiKey: openai })(modelId), modelId };
  }
  return null;
}

/**
 * Per-call options shared by both formatter calls. Claude 5.x rejects sampling
 * parameters with a 400, so `temperature` is only sent to other providers.
 * Sonnet 5.5 always thinks and its thinking counts toward maxOutputTokens, so
 * effort stays low for this editing work; non-Anthropic providers ignore the
 * `anthropic` provider options.
 */
function callOptions(modelId: string, temperature: number) {
  return {
    ...(claudeRejectsSamplingParams(modelId) ? {} : { temperature }),
    providerOptions: {
      anthropic: {
        effort: "low",
        ...claudeFallbackOptions(modelId),
      } satisfies AnthropicProviderOptions,
    },
  };
}

export function hasPageModel(): boolean {
  return pickModel() !== null;
}

const URL_RE = /https?:\/\/[^\s)\]}>"']+/g;

function toDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Harvest unique URLs cited anywhere in the transcript as fallback sources. */
export function extractSources(messages: ThreadMessage[]): PageSource[] {
  const seen = new Set<string>();
  const out: PageSource[] = [];
  for (const m of messages) {
    const matches = m.content?.match(URL_RE);
    if (!matches) continue;
    for (const raw of matches) {
      const url = raw.replace(/[.,;]+$/, "");
      if (seen.has(url)) continue;
      seen.add(url);
      const domain = toDomain(url);
      out.push({ title: domain || url, url, domain });
    }
  }
  return out.slice(0, 24);
}

function parseJsonBlock(text: string): any | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

const INSTRUCTION = `You are an expert editor. Convert the chat transcript below into a clean, publishable article a reader could share. Keep the author's substance and voice; remove chat artefacts ("sure!", "as an AI", repeated greetings). Use clear section headings and well-structured markdown (lists, bold, short paragraphs). Do not invent facts or citations.`;

export async function formatThreadToPage(
  messages: ThreadMessage[],
  titleHint?: string,
): Promise<FormattedPage | null> {
  const picked = pickModel();
  if (!picked) return null;
  const { model, modelId } = picked;

  const transcript = messages
    .filter((m) => m.content?.trim())
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n")
    .slice(0, 24000);

  if (!transcript.trim()) return null;

  const prompt = `${INSTRUCTION}

Return STRICT JSON only (no markdown code fences) matching exactly this shape:
{
  "title": string,            // <= 80 chars, compelling, no quotes around it
  "summary": string,          // 1-2 sentence deck/standfirst
  "sections": [ { "heading": string, "markdown": string } ],  // 2-6 sections
  "sources": [ { "title": string, "url": string } ]           // URLs referenced in the transcript; [] if none
}

${titleHint ? `Preferred title (use unless a clearly better one fits): ${titleHint}\n` : ""}Transcript:
${transcript}`;

  let raw = "";
  try {
    const { text, finishReason } = await generateText({
      model,
      ...callOptions(modelId, 0.4),
      // Headroom for Sonnet 5.5's thinking on top of the ~2.4K-token article.
      maxOutputTokens: 4096,
      prompt,
    });
    // A refusal that survived the server-side fallback has no article to parse.
    if (isRefusal(finishReason)) {
      console.warn("[pages/format] declined by the model safety checks");
      return null;
    }
    raw = text;
  } catch (e) {
    console.error("[pages/format] generation failed:", (e as Error).message);
    return null;
  }

  const parsed = parseJsonBlock(raw);
  if (!parsed || !Array.isArray(parsed.sections)) return null;

  const sections: PageSection[] = parsed.sections
    .filter((s: any) => s && (s.heading || s.markdown))
    .slice(0, 8)
    .map((s: any) => ({
      id: randomId(),
      heading: String(s.heading || "").slice(0, 160),
      markdown: String(s.markdown || "").slice(0, 8000),
      imageUrl: null,
    }));

  if (sections.length === 0) return null;

  // Merge model-cited sources with URLs harvested directly from the transcript.
  const modelSources: PageSource[] = Array.isArray(parsed.sources)
    ? parsed.sources
        .filter((s: any) => s && isHttpUrl(s.url))
        .map((s: any) => ({
          title: String(s.title || toDomain(s.url) || s.url).slice(0, 200),
          url: s.url,
          domain: toDomain(s.url),
        }))
    : [];

  const merged: PageSource[] = [];
  const seen = new Set<string>();
  for (const s of [...modelSources, ...extractSources(messages)]) {
    if (!s.url || seen.has(s.url)) continue;
    seen.add(s.url);
    merged.push(s);
  }

  return {
    title: String(parsed.title || titleHint || "Untitled Page").slice(0, 120),
    summary: String(parsed.summary || "").slice(0, 400),
    sections,
    sources: merged.slice(0, 24),
  };
}

/**
 * Revise a single section's markdown per a natural-language instruction
 * (Perplexity "highlight + describe the change"). Returns the new markdown body
 * only, or null if no model is configured / generation failed.
 */
export async function reviseSectionMarkdown(
  heading: string,
  markdown: string,
  instruction: string,
): Promise<string | null> {
  const picked = pickModel();
  if (!picked) return null;
  const { model, modelId } = picked;

  const prompt = `Revise the following article section according to the instruction. Return ONLY the revised markdown body — no section heading, no preamble, no code fences.

Instruction: ${instruction}

Section heading: ${heading}

Current markdown:
${markdown.slice(0, 8000)}`;

  try {
    const { text, finishReason } = await generateText({
      model,
      ...callOptions(modelId, 0.5),
      // Headroom for Sonnet 5.5's thinking on top of the ~1.6K-token section.
      maxOutputTokens: 2400,
      prompt,
    });
    // Never save a refusal (or its partial text) over the creator's section.
    if (isRefusal(finishReason)) {
      console.warn("[pages/revise] declined by the model safety checks");
      return null;
    }
    const cleaned = text
      .replace(/^```(?:markdown)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    return cleaned || null;
  } catch (e) {
    console.error("[pages/revise] failed:", (e as Error).message);
    return null;
  }
}
