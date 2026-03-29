type AnalyticsPayload = Record<string, unknown>;

type PostHogLike = {
  capture: (event: string, properties?: AnalyticsPayload) => void;
  identify: (userId: string, traits?: AnalyticsPayload) => void;
};

function getPosthog(): PostHogLike | null {
  if (typeof window === 'undefined') return null;

  const candidate = (window as Window & { posthog?: PostHogLike }).posthog;
  if (!candidate) return null;

  return candidate;
}

function capture(event: string, properties?: AnalyticsPayload) {
  getPosthog()?.capture(event, properties);
}

function identifyUser(userId: string, traits?: AnalyticsPayload) {
  getPosthog()?.identify(userId, traits);
}

export const analytics = {
  // Chat events
  chatSent: (luminorId?: string) => capture("chat_sent", { luminor: luminorId }),
  chatCreationSaved: (type: string) => capture("creation_saved_from_chat", { type }),

  // Imagine events
  imageGenerated: (model?: string) => capture("image_generated", { model }),
  imageSaved: () => capture("image_saved"),

  // Creation events
  creationSaved: (type: string) => capture("creation_saved", { type }),
  creationShared: (method: string) => capture("creation_shared", { method }),

  // Community events
  creatorFollowed: () => capture("creator_followed"),
  discussionCreated: () => capture("discussion_created"),

  // Academy events
  courseStarted: (courseSlug: string) => capture("course_started", { course: courseSlug }),
  gateUnlocked: (gate: string) => capture("gate_unlocked", { gate }),

  // Auth events
  signedUp: (method: string) => capture("signed_up", { method }),
  signedIn: (method: string) => capture("signed_in", { method }),

  // Credit events
  creditsPurchased: (amount: number) => capture("credits_purchased", { amount }),
  creditsSpent: (action: string, cost: number) => capture("credits_spent", { action, cost }),

  // Library events
  textRead: (collection: string, text: string) => capture("text_read", { collection, text }),

  // Engagement
  pageViewed: (page: string) => capture("page_viewed", { page }),
  featureUsed: (feature: string) => capture("feature_used", { feature }),

  // User identification
  identify: (userId: string, traits?: Record<string, unknown>) => identifyUser(userId, traits),
};
