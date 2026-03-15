/**
 * APL Prompt Formatter — structures prompts in SPARK.SHAPE.SHARPEN format
 */

export interface APLPrompt {
  /** The unique detail that makes this creation yours */
  spark: string;
  /** Sensory palette(s) — what it feels/sounds/looks like */
  shape?: {
    palette: string;
    secondaryPalette?: string;
    description: string;
  };
  /** What it must NOT be — anti-slop constraints */
  sharpen?: string[];
  /** The actual prompt in plain language */
  prompt: string;
  /** Optional world DNA prefix */
  worldDNA?: {
    spark: string;
    shape: string;
    sharpen: string[];
  };
}

/**
 * Format an APL prompt into a string ready for any AI model
 */
export function formatPrompt(apl: APLPrompt): string {
  const parts: string[] = [];

  // World DNA prefix (if building within a world)
  if (apl.worldDNA) {
    parts.push(`[WORLD]`);
    parts.push(`WORLD SPARK: ${apl.worldDNA.spark}`);
    parts.push(`WORLD SHAPE: ${apl.worldDNA.shape}`);
    parts.push(`WORLD SHARPEN: ${apl.worldDNA.sharpen.map((s) => `NOT ${s}`).join('. ')}`);
    parts.push('');
  }

  // SPARK
  parts.push(`SPARK: ${apl.spark}`);

  // SHAPE
  if (apl.shape) {
    const paletteName = apl.shape.secondaryPalette
      ? `${apl.shape.palette.toUpperCase()} + ${apl.shape.secondaryPalette.toUpperCase()}`
      : apl.shape.palette.toUpperCase();
    parts.push(`SHAPE: ${paletteName} — ${apl.shape.description}`);
  }

  // SHARPEN
  if (apl.sharpen && apl.sharpen.length > 0) {
    parts.push(`SHARPEN: ${apl.sharpen.map((s) => `NOT ${s}`).join('. ')}.`);
  }

  // Main prompt
  parts.push('');
  parts.push(apl.prompt);

  return parts.join('\n');
}

/**
 * Parse a text prompt to extract APL structure (best-effort)
 */
export function parsePrompt(text: string): Partial<APLPrompt> {
  const result: Partial<APLPrompt> = {};
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('SPARK:')) {
      result.spark = trimmed.replace('SPARK:', '').trim();
    } else if (trimmed.startsWith('SHAPE:')) {
      const shapeText = trimmed.replace('SHAPE:', '').trim();
      const dashIdx = shapeText.indexOf('—');
      const palette = dashIdx > 0 ? shapeText.slice(0, dashIdx).trim().toLowerCase() : shapeText.toLowerCase();
      const desc = dashIdx > 0 ? shapeText.slice(dashIdx + 1).trim() : '';
      result.shape = { palette, description: desc };
    } else if (trimmed.startsWith('SHARPEN:')) {
      const sharpenText = trimmed.replace('SHARPEN:', '').trim();
      result.sharpen = sharpenText
        .split(/\.\s*/)
        .map((s) => s.replace(/^NOT\s+/i, '').trim())
        .filter(Boolean);
    }
  }

  // Remaining lines as the main prompt
  const promptLines = lines.filter(
    (l) => !l.trim().startsWith('SPARK:') && !l.trim().startsWith('SHAPE:') && !l.trim().startsWith('SHARPEN:') && !l.trim().startsWith('[WORLD]') && !l.trim().startsWith('WORLD ')
  );
  result.prompt = promptLines.join('\n').trim();

  return result;
}
