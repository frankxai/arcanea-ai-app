/**
 * Search Provider Abstraction
 *
 * Multi-provider web search with automatic fallback.
 * Same pattern as lib/gateway/catalog.ts but for web search.
 *
 * Priority: Tavily (best quality) > Brave (freemium) > DuckDuckGo (free fallback)
 *
 * Supports BYOK: clients can pass their own API keys via the `apiKey` option,
 * which takes priority over server-side env vars.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  answer?: string | null;
  query: string;
  provider: string;
}

export interface SearchProvider {
  id: string;
  name: string;
  envKey?: string;
  requiresKey: boolean;
  cost: 'free' | 'freemium' | 'paid';
  description: string;
  docsUrl?: string;
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Provider catalog
// ---------------------------------------------------------------------------

export const SEARCH_PROVIDERS: SearchProvider[] = [
  {
    id: 'tavily',
    name: 'Tavily',
    envKey: 'TAVILY_API_KEY',
    requiresKey: true,
    cost: 'paid',
    description: 'AI-optimized search with answer generation',
    docsUrl: 'https://tavily.com',
    placeholder: 'tvly-...',
  },
  {
    id: 'brave',
    name: 'Brave Search',
    envKey: 'BRAVE_API_KEY',
    requiresKey: true,
    cost: 'freemium',
    description: 'Privacy-focused — 2,000 free searches/month',
    docsUrl: 'https://brave.com/search/api/',
    placeholder: 'BSA...',
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    requiresKey: false,
    cost: 'free',
    description: 'Free instant answers — no API key needed',
  },
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface SearchOptions {
  /** Preferred provider ID, or 'auto' for automatic fallback */
  provider?: string;
  /** BYOK key from client — overrides server env var */
  apiKey?: string;
  maxResults?: number;
}

/**
 * Execute a web search using the specified provider.
 * Falls back through providers if the primary fails.
 *
 * Auto mode priority: tavily > brave > duckduckgo
 */
export async function executeSearch(
  query: string,
  options?: SearchOptions
): Promise<SearchResponse> {
  const maxResults = Math.min(options?.maxResults || 5, 10);
  const preferredProvider = options?.provider || 'auto';

  if (preferredProvider === 'auto') {
    // 1. Tavily if key available
    const tavilyKey = options?.apiKey || process.env.TAVILY_API_KEY;
    if (tavilyKey) {
      try {
        return await searchTavily(query, tavilyKey, maxResults);
      } catch {
        // Fall through to next provider
      }
    }
    // 2. Brave if key available
    const braveKey = process.env.BRAVE_API_KEY;
    if (braveKey) {
      try {
        return await searchBrave(query, braveKey, maxResults);
      } catch {
        // Fall through to next provider
      }
    }
    // 3. DuckDuckGo (always free, no key)
    try {
      return await searchDuckDuckGo(query, maxResults);
    } catch {
      // All providers failed
    }

    throw new Error('No search provider available');
  }

  // Specific provider requested
  switch (preferredProvider) {
    case 'tavily': {
      const key = options?.apiKey || process.env.TAVILY_API_KEY;
      if (!key) throw new Error('Tavily API key required');
      return searchTavily(query, key, maxResults);
    }
    case 'brave': {
      const key = options?.apiKey || process.env.BRAVE_API_KEY;
      if (!key) throw new Error('Brave API key required');
      return searchBrave(query, key, maxResults);
    }
    case 'duckduckgo':
      return searchDuckDuckGo(query, maxResults);
    default:
      throw new Error(`Unknown search provider: ${preferredProvider}`);
  }
}

// ---------------------------------------------------------------------------
// Provider implementations
// ---------------------------------------------------------------------------

async function searchTavily(
  query: string,
  apiKey: string,
  maxResults: number
): Promise<SearchResponse> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      search_depth: 'basic',
      include_answer: true,
      include_raw_content: false,
    }),
  });
  if (!res.ok) throw new Error(`Tavily: ${res.status}`);
  const data = await res.json();
  return {
    query,
    provider: 'tavily',
    answer: data.answer || null,
    results: (data.results || []).map(
      (r: { title: string; url: string; content: string; score?: number }) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })
    ),
  };
}

async function searchBrave(
  query: string,
  apiKey: string,
  maxResults: number
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    count: String(maxResults),
  });
  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${params}`,
    {
      headers: {
        'X-Subscription-Token': apiKey,
        Accept: 'application/json',
      },
    }
  );
  if (!res.ok) throw new Error(`Brave: ${res.status}`);
  const data = await res.json();
  return {
    query,
    provider: 'brave',
    answer: null,
    results: (data.web?.results || [])
      .slice(0, maxResults)
      .map(
        (r: { title: string; url: string; description?: string }) => ({
          title: r.title,
          url: r.url,
          content: r.description || '',
          score: undefined,
        })
      ),
  };
}

async function searchDuckDuckGo(
  query: string,
  maxResults: number
): Promise<SearchResponse> {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    no_html: '1',
    skip_disambig: '1',
  });
  const res = await fetch(`https://api.duckduckgo.com/?${params}`);
  if (!res.ok) throw new Error(`DuckDuckGo: ${res.status}`);
  const data = await res.json();

  const results: SearchResult[] = [];

  // Abstract (main answer)
  if (data.Abstract) {
    results.push({
      title: data.Heading || query,
      url: data.AbstractURL || '',
      content: data.Abstract,
    });
  }

  // Related topics
  if (data.RelatedTopics) {
    for (const topic of data.RelatedTopics.slice(
      0,
      maxResults - results.length
    )) {
      if (topic.Text && topic.FirstURL) {
        results.push({
          title: topic.Text.slice(0, 100),
          url: topic.FirstURL,
          content: topic.Text,
        });
      }
    }
  }

  // If DDG returned no useful results, throw so the auto-fallback
  // reports "No search provider available" instead of silently
  // returning an empty response.
  if (results.length === 0) {
    throw new Error('DuckDuckGo: no results');
  }

  return {
    query,
    provider: 'duckduckgo',
    answer: data.Abstract || null,
    results: results.slice(0, maxResults),
  };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Get the first available search provider (for display / status checks) */
export function getActiveSearchProvider(): string {
  if (process.env.TAVILY_API_KEY) return 'tavily';
  if (process.env.BRAVE_API_KEY) return 'brave';
  return 'duckduckgo';
}
