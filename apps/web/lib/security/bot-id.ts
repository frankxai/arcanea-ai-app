/**
 * BotID verification helper for paid routes.
 *
 * Checks Vercel BotID headers (`x-vercel-bot-id`, `x-vercel-bot-score`, `x-bot-score`)
 * and known automated bot signatures to keep bots off paid generation endpoints.
 */

export interface BotVerificationResult {
  isBot: boolean;
  score?: number;
  reason?: string;
}

const BOT_USER_AGENTS = [
  /python-requests/i,
  /httpx/i,
  /scrapy/i,
  /curl\//i,
  /go-http-client/i,
  /postmanruntime/i,
  /headlesschrome/i,
  /phantomjs/i,
  /bot|crawler|spider|slurp/i,
];

export function checkBotId(req: Request): BotVerificationResult {
  const headers = req.headers;

  // 1. Vercel BotID explicit detection header
  const vercelBotId = headers.get("x-vercel-bot-id")?.toLowerCase();
  if (
    vercelBotId === "1" ||
    vercelBotId === "true" ||
    vercelBotId === "bot" ||
    vercelBotId === "detected"
  ) {
    return { isBot: true, reason: "vercel_bot_id" };
  }

  // 2. Vercel BotID score header (0 = bot, 100 = human)
  let parsedScore: number | undefined;
  const scoreHeader =
    headers.get("x-vercel-bot-score") ?? headers.get("x-bot-score");
  if (scoreHeader !== null) {
    const score = parseInt(scoreHeader, 10);
    if (!isNaN(score)) {
      if (score < 30) {
        return { isBot: true, score, reason: "vercel_bot_score" };
      }
      parsedScore = score;
    }
  }

  // 3. User-Agent pattern check for automated headless tools
  const userAgent = headers.get("user-agent") ?? "";
  if (
    userAgent &&
    BOT_USER_AGENTS.some((pattern) => pattern.test(userAgent))
  ) {
    return { isBot: true, score: parsedScore, reason: "bot_user_agent" };
  }

  return { isBot: false, score: parsedScore };
}
