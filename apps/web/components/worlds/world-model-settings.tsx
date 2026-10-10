"use client";

export function WorldModelSettings({
  apiKey,
  onChange,
  disabled,
}: {
  apiKey: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <section
      aria-label="World model connection"
      className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5"
    >
      <label htmlFor="world-gemini-key" className="block text-sm font-medium">
        Your Gemini API key
      </label>
      <input
        id="world-gemini-key"
        type="password"
        autoComplete="off"
        spellCheck={false}
        value={apiKey}
        onChange={(event) => onChange(event.target.value)}
        maxLength={8192}
        disabled={disabled}
        aria-describedby="world-key-description"
        className="mt-2 min-h-11 w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
      />
      <p
        id="world-key-description"
        className="mt-3 text-sm leading-relaxed text-white/70"
      >
        Gemini 2.5 Flash uses your quota. Your key stays in memory for this page
        and is sent to Arcanea only for the request to Google. It is cleared
        when your account changes or this page closes.
      </p>
      <a
        href="https://aistudio.google.com/api-keys"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center text-sm text-[var(--arc-brand-atlantean-teal)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2"
      >
        Manage keys in Google AI Studio
      </a>
    </section>
  );
}
