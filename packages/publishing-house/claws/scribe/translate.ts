/**
 * Arcanea Publishing House — Scribe Claw: Translation Pipeline
 *
 * Translates markdown content to target languages via Claude or DeepL.
 * Handles long documents by chunking on section headers, translating
 * each chunk independently, and reassembling the result.
 */

import type {
  Language,
  TranslateOptions,
  TranslateResult,
  TranslateConfig,
  ContentChunk,
  ClaudeTranslateConfig,
  DeepLTranslateConfig,
} from "./types.js";

export type { Language, TranslateOptions, TranslateResult, TranslateConfig };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum words per chunk to stay within model context limits */
const MAX_CHUNK_WORDS = 3000;

const LANGUAGE_NAMES: Record<Language, string> = {
  nl: "Dutch",
  de: "German",
  es: "Spanish",
  pt: "Portuguese",
  ja: "Japanese",
  fr: "French",
  zh: "Chinese (Simplified)",
  ko: "Korean",
};

const DEEPL_LANG_MAP: Record<Language, string> = {
  nl: "NL",
  de: "DE",
  es: "ES",
  pt: "PT-BR",
  ja: "JA",
  fr: "FR",
  zh: "ZH",
  ko: "KO",
};

// ---------------------------------------------------------------------------
// Chunking
// ---------------------------------------------------------------------------

/**
 * Split markdown content into chunks by section headers (## or #).
 * If a single section exceeds MAX_CHUNK_WORDS, it is split further
 * on paragraph boundaries.
 */
export function chunkContent(source: string): ContentChunk[] {
  const sections = source.split(/(?=^#{1,3}\s)/m);
  const chunks: ContentChunk[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const headingMatch = /^(#{1,3})\s+(.*)$/m.exec(trimmed);
    const heading = headingMatch ? headingMatch[2].trim() : undefined;
    const wordCount = trimmed.split(/\s+/).length;

    if (wordCount <= MAX_CHUNK_WORDS) {
      chunks.push({
        index: chunks.length,
        heading,
        text: trimmed,
        wordCount,
      });
    } else {
      // Split large sections on double newlines (paragraphs)
      const paragraphs = trimmed.split(/\n\n+/);
      let buffer = "";
      let bufferWords = 0;

      for (const para of paragraphs) {
        const paraWords = para.split(/\s+/).length;

        if (bufferWords + paraWords > MAX_CHUNK_WORDS && buffer) {
          chunks.push({
            index: chunks.length,
            heading: chunks.length === 0 ? heading : undefined,
            text: buffer.trim(),
            wordCount: bufferWords,
          });
          buffer = "";
          bufferWords = 0;
        }

        buffer += (buffer ? "\n\n" : "") + para;
        bufferWords += paraWords;
      }

      if (buffer.trim()) {
        chunks.push({
          index: chunks.length,
          heading: undefined,
          text: buffer.trim(),
          wordCount: bufferWords,
        });
      }
    }
  }

  return chunks;
}

// ---------------------------------------------------------------------------
// Glossary
// ---------------------------------------------------------------------------

function buildGlossaryInstruction(
  glossary: Record<string, string> | undefined,
): string {
  if (!glossary || Object.keys(glossary).length === 0) return "";

  const entries = Object.entries(glossary)
    .map(([term, translation]) => `  "${term}" -> "${translation}"`)
    .join("\n");

  return `\n\nIMPORTANT: Use this glossary for specific terms:\n${entries}`;
}

// ---------------------------------------------------------------------------
// Claude Provider
// ---------------------------------------------------------------------------

async function translateWithClaude(
  text: string,
  targetLang: Language,
  options: TranslateOptions,
  config: ClaudeTranslateConfig,
): Promise<string> {
  const langName = LANGUAGE_NAMES[targetLang];
  const formatInstruction = options.preserveFormatting
    ? " Preserve all markdown formatting exactly (headers, bold, italic, links, code blocks, lists)."
    : "";
  const glossaryInstruction = buildGlossaryInstruction(options.glossary);

  const systemPrompt = [
    `You are an expert literary translator specializing in ${langName}.`,
    `Translate the following text from English to ${langName}.`,
    `Maintain the original tone, style, and meaning.${formatInstruction}`,
    `Output ONLY the translated text with no preamble or explanation.`,
    glossaryInstruction,
  ].join(" ");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model ?? "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Claude API returned ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((b) => b.type === "text");
  if (!textBlock?.text) {
    throw new Error("Claude API returned no text content");
  }

  return textBlock.text;
}

// ---------------------------------------------------------------------------
// DeepL Provider
// ---------------------------------------------------------------------------

async function translateWithDeepL(
  text: string,
  targetLang: Language,
  _options: TranslateOptions,
  config: DeepLTranslateConfig,
): Promise<string> {
  const params = new URLSearchParams({
    auth_key: config.apiKey,
    text,
    target_lang: DEEPL_LANG_MAP[targetLang],
  });

  if (config.formality && config.formality !== "default") {
    params.set("formality", config.formality);
  }

  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`DeepL API returned ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    translations: Array<{ text: string; detected_source_language: string }>;
  };

  if (!data.translations?.length) {
    throw new Error("DeepL API returned no translations");
  }

  return data.translations[0].text;
}

// ---------------------------------------------------------------------------
// Chunk Translator
// ---------------------------------------------------------------------------

async function translateChunk(
  chunk: ContentChunk,
  targetLang: Language,
  options: TranslateOptions,
  config: TranslateConfig,
): Promise<string> {
  if (options.provider === "claude") {
    if (!config.claude) {
      throw new Error("Claude config not provided (apiKey required)");
    }
    return translateWithClaude(chunk.text, targetLang, options, config.claude);
  }

  if (options.provider === "deepl") {
    if (!config.deepl) {
      throw new Error("DeepL config not provided (apiKey required)");
    }
    return translateWithDeepL(chunk.text, targetLang, options, config.deepl);
  }

  throw new Error(`Unknown translation provider: ${options.provider}`);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Translate content from English to a target language.
 *
 * For long documents, the source is split into chunks by section headers,
 * each chunk is translated independently, and the results are reassembled.
 *
 * @param source     - Source text in English (markdown)
 * @param targetLang - Target language code
 * @param options    - Translation options (provider, formatting, glossary)
 * @param config     - API credentials for the chosen provider
 * @returns Translation result with full translated text and metadata
 * @throws If the provider API returns an error or config is missing
 */
export async function translateContent(
  source: string,
  targetLang: Language,
  options: TranslateOptions,
  config: TranslateConfig,
): Promise<TranslateResult> {
  if (!source.trim()) {
    return {
      translatedText: "",
      sourceLang: "en",
      targetLang,
      provider: options.provider,
      wordCount: 0,
      chunkCount: 0,
    };
  }

  const chunks = chunkContent(source);

  // Translate chunks sequentially to respect API rate limits
  const translatedParts: string[] = [];
  for (const chunk of chunks) {
    const translated = await translateChunk(chunk, targetLang, options, config);
    translatedParts.push(translated);
  }

  const translatedText = translatedParts.join("\n\n");
  const wordCount = translatedText.split(/\s+/).filter(Boolean).length;

  return {
    translatedText,
    sourceLang: "en",
    targetLang,
    provider: options.provider,
    wordCount,
    chunkCount: chunks.length,
  };
}
