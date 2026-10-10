"use client";

import { useId, useState } from "react";
import { worldDraftSchema, type WorldDraft } from "@/lib/worlds/draft";

function replace<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

export function WorldDraftEditor({
  world,
  disabled,
  onApply,
  onEditingChange,
}: {
  world: WorldDraft;
  disabled: boolean;
  onApply: (world: WorldDraft) => boolean;
  onEditingChange: (editing: boolean) => void;
}) {
  const [editing, setEditing] = useState<WorldDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editorId = useId();
  if (!editing)
    return (
      <button
        disabled={disabled}
        onClick={() => {
          setEditing(structuredClone(world));
          setError(null);
          onEditingChange(true);
        }}
        className="mb-6 min-h-11 rounded-lg border border-white/20 px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] disabled:opacity-50"
      >
        Edit world draft
      </button>
    );
  const field = (
    label: string,
    value: string | undefined,
    change: (value: string) => void,
    maxLength = 12000,
  ) => (
    <div className="text-sm" key={label}>
      <label
        htmlFor={`${editorId}-${label.replaceAll(" ", "-")}`}
        className="block"
      >
        {label}
      </label>
      <textarea
        id={`${editorId}-${label.replaceAll(" ", "-")}`}
        value={value || ""}
        onChange={(event) => change(event.target.value)}
        maxLength={maxLength}
        rows={maxLength <= 500 ? 1 : 3}
        className="mt-2 min-h-11 w-full resize-y rounded-lg border border-white/20 bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
      />
    </div>
  );
  return (
    <section
      aria-label="Edit world draft"
      className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5"
    >
      <h2 className="text-xl">Edit your working draft</h2>
      <p className="mt-2 text-sm text-white/70">
        Apply your changes before saving or exporting. No model request is
        needed.
      </p>
      <fieldset disabled={disabled} className="mt-5 space-y-5">
        {field(
          "World name",
          editing.name,
          (name) => setEditing({ ...editing, name }),
          160,
        )}
        {field(
          "Tagline",
          editing.tagline,
          (tagline) => setEditing({ ...editing, tagline }),
          500,
        )}
        {field("World description", editing.description, (description) =>
          setEditing({ ...editing, description }),
        )}
        {editing.laws.map((law, i) => (
          <div key={i} className="space-y-3">
            {field(
              `Rule ${i + 1} name`,
              law.name,
              (name) =>
                setEditing({
                  ...editing,
                  laws: replace(editing.laws, i, { name }),
                }),
              160,
            )}
            {field(
              `Rule ${i + 1} consequence`,
              law.description,
              (description) =>
                setEditing({
                  ...editing,
                  laws: replace(editing.laws, i, { description }),
                }),
            )}
          </div>
        ))}
        {editing.systems.map((system, i) => (
          <div key={i} className="space-y-3">
            {field(
              `System ${i + 1} name`,
              system.name,
              (name) =>
                setEditing({
                  ...editing,
                  systems: replace(editing.systems, i, { name }),
                }),
              160,
            )}
            {field(`System ${i + 1} rules`, system.rules, (rules) =>
              setEditing({
                ...editing,
                systems: replace(editing.systems, i, { rules }),
              }),
            )}
          </div>
        ))}
        {editing.characters.map((character, i) => (
          <div key={i} className="space-y-3">
            {field(
              `Character ${i + 1} name`,
              character.name,
              (name) =>
                setEditing({
                  ...editing,
                  characters: replace(editing.characters, i, { name }),
                }),
              160,
            )}
            {field(
              `Character ${i + 1} backstory`,
              character.backstory,
              (backstory) =>
                setEditing({
                  ...editing,
                  characters: replace(editing.characters, i, { backstory }),
                }),
            )}
          </div>
        ))}
        {editing.locations.map((location, i) => (
          <div key={i} className="space-y-3">
            {field(
              `Location ${i + 1} name`,
              location.name,
              (name) =>
                setEditing({
                  ...editing,
                  locations: replace(editing.locations, i, { name }),
                }),
              160,
            )}
            {field(
              `Location ${i + 1} description`,
              location.description,
              (description) =>
                setEditing({
                  ...editing,
                  locations: replace(editing.locations, i, { description }),
                }),
            )}
          </div>
        ))}
        {editing.first_event &&
          field(
            "Founding event",
            editing.first_event.description,
            (description) =>
              setEditing({
                ...editing,
                first_event: { ...editing.first_event!, description },
              }),
          )}
        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            className="min-h-11 rounded-lg border border-white/30 px-4 py-3 focus-visible:ring-2"
            onClick={() => {
              const parsed = worldDraftSchema.safeParse(editing);
              if (
                !parsed.success ||
                JSON.stringify(parsed.data).length > 140000
              ) {
                setError(
                  "Give each item a name and keep this draft within the field limits.",
                );
                return;
              }
              if (onApply(parsed.data)) {
                setEditing(null);
                onEditingChange(false);
              }
            }}
          >
            Apply draft changes
          </button>
          <button
            className="min-h-11 rounded-lg border border-white/20 px-4 py-3 focus-visible:ring-2"
            onClick={() => {
              setEditing(null);
              onEditingChange(false);
            }}
          >
            Cancel draft changes
          </button>
        </div>
      </fieldset>
    </section>
  );
}
