"use client";

type Properties = Record<string, string | number | boolean | null>;

type PostHogWindow = Window & {
  posthog?: {
    capture: (event: string, properties?: Properties) => void;
  };
};

export function captureMeridianEvent(event: string, properties: Properties = {}) {
  if (typeof window === "undefined") return;
  (window as PostHogWindow).posthog?.capture(event, {
    experience: "meridian",
    experiment: "meridian_entry_v1",
    ...properties,
  });
}
