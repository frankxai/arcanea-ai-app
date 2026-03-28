import posthog from "posthog-js";

export const analytics = {
  // Chat events
  chatSent: (luminorId?: string) => posthog.capture("chat_sent", { luminor: luminorId }),
  chatCreationSaved: (type: string) => posthog.capture("creation_saved_from_chat", { type }),

  // Imagine events
  imageGenerated: (model?: string) => posthog.capture("image_generated", { model }),
  imageSaved: () => posthog.capture("image_saved"),

  // Creation events
  creationSaved: (type: string) => posthog.capture("creation_saved", { type }),
  creationShared: (method: string) => posthog.capture("creation_shared", { method }),

  // Community events
  creatorFollowed: () => posthog.capture("creator_followed"),
  discussionCreated: () => posthog.capture("discussion_created"),

  // Academy events
  courseStarted: (courseSlug: string) => posthog.capture("course_started", { course: courseSlug }),
  gateUnlocked: (gate: string) => posthog.capture("gate_unlocked", { gate }),

  // Auth events
  signedUp: (method: string) => posthog.capture("signed_up", { method }),
  signedIn: (method: string) => posthog.capture("signed_in", { method }),

  // Credit events
  creditsPurchased: (amount: number) => posthog.capture("credits_purchased", { amount }),
  creditsSpent: (action: string, cost: number) => posthog.capture("credits_spent", { action, cost }),

  // Library events
  textRead: (collection: string, text: string) => posthog.capture("text_read", { collection, text }),

  // Engagement
  pageViewed: (page: string) => posthog.capture("page_viewed", { page }),
  featureUsed: (feature: string) => posthog.capture("feature_used", { feature }),

  // User identification
  identify: (userId: string, traits?: Record<string, unknown>) => posthog.identify(userId, traits),
};
