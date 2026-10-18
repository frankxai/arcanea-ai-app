"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { worldDraftSchema, type WorldDraft } from "@/lib/worlds/draft";

function focusEditorElement(element: HTMLElement | null) {
  // Keep native smooth focus scrolling from competing with section navigation.
  element?.focus({ preventScroll: true });
  element?.scrollIntoView({ behavior: "instant", block: "start" });
}

function replace<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, i) => (i === index ? { ...item, ...patch } : item));
}

function comparableDraft(world: WorldDraft): string {
  return JSON.stringify({
    ...world,
    characters: world.characters.map(({ backstory, ...character }) => ({
      ...character,
      backstory: backstory ?? "",
    })),
    locations: world.locations.map(({ description, ...location }) => ({
      ...location,
      description: description ?? "",
    })),
  });
}

function EditGroup({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="space-y-5 border-t border-white/10 pt-6"
    >
      <h3
        id={id}
        tabIndex={-1}
        className="scroll-mt-28 text-lg focus-visible:outline-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export function WorldDraftEditor({
  world,
  disabled,
  onApply,
  onEditingChange,
  onDirtyChange,
}: {
  world: WorldDraft;
  disabled: boolean;
  onApply: (world: WorldDraft) => boolean;
  onEditingChange: (editing: boolean) => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const [editing, setEditing] = useState<WorldDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editorId = useId();
  const editButton = useRef<HTMLButtonElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const wasEditing = useRef(false);
  const editorOpen = editing !== null;
  const hasChanges =
    editing !== null && comparableDraft(editing) !== comparableDraft(world);

  useEffect(() => {
    if (editorOpen) {
      focusEditorElement(document.getElementById(editorId + "-World-name"));
      wasEditing.current = true;
    } else if (wasEditing.current) {
      focusEditorElement(editButton.current);
      wasEditing.current = false;
    }
  }, [editorOpen, editorId]);

  useEffect(() => {
    if (error) focusEditorElement(errorMessage.current);
  }, [error]);

  useLayoutEffect(() => {
    onDirtyChange(hasChanges);
  }, [hasChanges, onDirtyChange]);

  useLayoutEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  if (!editing) {
    return (
      <button
        ref={editButton}
        disabled={disabled}
        onClick={() => {
          setEditing(structuredClone(world));
          setError(null);
          onEditingChange(true);
        }}
        className="mb-6 min-h-11 scroll-mt-28 rounded-lg border border-white/20 px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)] active:bg-white/10 disabled:opacity-50"
      >
        Edit world draft
      </button>
    );
  }

  const field = (
    label: string,
    value: string | undefined,
    change: (value: string) => void,
    maxLength = 12000,
  ) => (
    <div className="text-sm" key={label}>
      <label
        htmlFor={editorId + "-" + label.replaceAll(" ", "-")}
        className="block"
      >
        {label}
      </label>
      <textarea
        id={editorId + "-" + label.replaceAll(" ", "-")}
        value={value || ""}
        onChange={(event) => change(event.target.value)}
        maxLength={maxLength}
        rows={maxLength <= 500 ? 1 : 3}
        className="mt-2 min-h-11 w-full scroll-mt-28 resize-y rounded-lg border border-white/20 bg-transparent px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
      />
    </div>
  );
  const sections = [
    { id: "details", title: "World details", visible: true },
    { id: "rules", title: "Rules", visible: editing.laws.length > 0 },
    { id: "systems", title: "Systems", visible: editing.systems.length > 0 },
    {
      id: "characters",
      title: "Characters",
      visible: editing.characters.length > 0,
    },
    {
      id: "locations",
      title: "Locations",
      visible: editing.locations.length > 0,
    },
    { id: "event", title: "Founding event", visible: !!editing.first_event },
    { id: "actions", title: "Apply or cancel", visible: true },
  ].filter((section) => section.visible);

  function focusSection(id: string) {
    const heading = document.getElementById(editorId + "-" + id);
    focusEditorElement(heading);
  }

  return (
    <section
      aria-label="Edit world draft"
      className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5"
    >
      <h2 className="text-xl">Edit your working draft</h2>
      <p className="mt-2 max-w-prose text-sm text-white/70">
        Work through your world, then apply the changes. Saving and exporting
        use the applied draft. No model request is needed.
      </p>
      <fieldset disabled={disabled} className="mt-6 min-w-0">
        <div className="grid gap-8 lg:grid-cols-[10rem_minmax(0,1fr)]">
          <nav
            aria-label="World draft sections"
            className="self-start lg:sticky lg:top-24"
          >
            <ul className="flex flex-wrap gap-1 lg:block lg:space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={"#" + editorId + "-" + section.id}
                    onClick={(event) => {
                      event.preventDefault();
                      focusSection(section.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      // Keep keyboard activation in the same explicit focus /
                      // instant-scroll operation as a pointer click.
                      event.preventDefault();
                      focusSection(section.id);
                    }}
                    className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="min-w-0 space-y-8">
            <EditGroup id={editorId + "-details"} title="World details">
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
            </EditGroup>
            {editing.laws.length > 0 && (
              <EditGroup id={editorId + "-rules"} title="Rules">
                {editing.laws.map((law, i) => (
                  <div key={i} className="space-y-3">
                    {field(
                      "Rule " + (i + 1) + " name",
                      law.name,
                      (name) =>
                        setEditing({
                          ...editing,
                          laws: replace(editing.laws, i, { name }),
                        }),
                      160,
                    )}
                    {field(
                      "Rule " + (i + 1) + " consequence",
                      law.description,
                      (description) =>
                        setEditing({
                          ...editing,
                          laws: replace(editing.laws, i, { description }),
                        }),
                    )}
                  </div>
                ))}
              </EditGroup>
            )}
            {editing.systems.length > 0 && (
              <EditGroup id={editorId + "-systems"} title="Systems">
                {editing.systems.map((system, i) => (
                  <div key={i} className="space-y-3">
                    {field(
                      "System " + (i + 1) + " name",
                      system.name,
                      (name) =>
                        setEditing({
                          ...editing,
                          systems: replace(editing.systems, i, { name }),
                        }),
                      160,
                    )}
                    {field(
                      "System " + (i + 1) + " rules",
                      system.rules,
                      (rules) =>
                        setEditing({
                          ...editing,
                          systems: replace(editing.systems, i, { rules }),
                        }),
                    )}
                  </div>
                ))}
              </EditGroup>
            )}
            {editing.characters.length > 0 && (
              <EditGroup id={editorId + "-characters"} title="Characters">
                {editing.characters.map((character, i) => (
                  <div key={i} className="space-y-3">
                    {field(
                      "Character " + (i + 1) + " name",
                      character.name,
                      (name) =>
                        setEditing({
                          ...editing,
                          characters: replace(editing.characters, i, { name }),
                        }),
                      160,
                    )}
                    {field(
                      "Character " + (i + 1) + " backstory",
                      character.backstory,
                      (backstory) =>
                        setEditing({
                          ...editing,
                          characters: replace(editing.characters, i, {
                            backstory,
                          }),
                        }),
                    )}
                  </div>
                ))}
              </EditGroup>
            )}
            {editing.locations.length > 0 && (
              <EditGroup id={editorId + "-locations"} title="Locations">
                {editing.locations.map((location, i) => (
                  <div key={i} className="space-y-3">
                    {field(
                      "Location " + (i + 1) + " name",
                      location.name,
                      (name) =>
                        setEditing({
                          ...editing,
                          locations: replace(editing.locations, i, { name }),
                        }),
                      160,
                    )}
                    {field(
                      "Location " + (i + 1) + " description",
                      location.description,
                      (description) =>
                        setEditing({
                          ...editing,
                          locations: replace(editing.locations, i, {
                            description,
                          }),
                        }),
                    )}
                  </div>
                ))}
              </EditGroup>
            )}
            {editing.first_event && (
              <EditGroup id={editorId + "-event"} title="Founding event">
                {field(
                  "Founding event",
                  editing.first_event.description,
                  (description) =>
                    setEditing({
                      ...editing,
                      first_event: { ...editing.first_event!, description },
                    }),
                )}
              </EditGroup>
            )}
            <section
              aria-labelledby={editorId + "-actions"}
              className="border-t border-white/10 pt-6"
            >
              <h3
                id={editorId + "-actions"}
                tabIndex={-1}
                className="scroll-mt-28 text-lg focus-visible:outline-2 focus-visible:outline-[var(--arc-brand-atlantean-teal)]"
              >
                Working edits
              </h3>
              <p role="status" className="mt-3 text-sm text-white/70">
                {hasChanges
                  ? "Unapplied changes. Download a copy or apply them before leaving."
                  : "No changes yet. Your applied draft is unchanged."}
              </p>
              {error && (
                <p
                  ref={errorMessage}
                  role="alert"
                  tabIndex={-1}
                  className="mt-4 scroll-mt-28 text-sm text-red-300 focus-visible:outline-2"
                >
                  {error}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-[var(--arc-brand-atlantean-teal)] bg-[var(--arc-brand-atlantean-teal)] px-4 py-3 text-sm font-medium text-[var(--arc-cosmic-void)] focus-visible:ring-2 active:opacity-80 disabled:opacity-50"
                  onClick={() => {
                    const parsed = worldDraftSchema.safeParse(editing);
                    if (
                      !parsed.success ||
                      JSON.stringify(parsed.data).length > 140000
                    ) {
                      setError(
                        "Give each item a name and keep this draft within the field limits.",
                      );
                      focusEditorElement(errorMessage.current);
                      return;
                    }
                    if (onApply(parsed.data)) {
                      onDirtyChange(false);
                      setEditing(null);
                      onEditingChange(false);
                    }
                  }}
                >
                  Apply draft changes
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-white/20 px-4 py-3 text-sm focus-visible:ring-2 active:bg-white/10 disabled:opacity-50"
                  onClick={() => {
                    if (
                      hasChanges &&
                      !window.confirm(
                        "Discard these unapplied draft changes? Your applied draft will stay unchanged.",
                      )
                    )
                      return;
                    onDirtyChange(false);
                    setEditing(null);
                    setError(null);
                    onEditingChange(false);
                  }}
                >
                  Cancel draft changes
                </button>
                <button
                  type="button"
                  className="min-h-11 rounded-lg border border-white/20 px-4 py-3 text-sm focus-visible:ring-2 active:bg-white/10 disabled:opacity-50"
                  onClick={() => {
                    let url: string | null = null;
                    try {
                      const copy = JSON.stringify(
                        {
                          format: "arcanea.world-working-edits.v1",
                          world: editing,
                        },
                        null,
                        2,
                      );
                      url = URL.createObjectURL(
                        new Blob([copy], { type: "application/json" }),
                      );
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = editing.slug + "-working-edits.json";
                      document.body.append(link);
                      link.click();
                      link.remove();
                      setError(null);
                    } catch {
                      setError(
                        "The working copy could not be downloaded. Your edits remain on this page.",
                      );
                      focusEditorElement(errorMessage.current);
                    } finally {
                      if (url) URL.revokeObjectURL(url);
                    }
                  }}
                >
                  Download working edits
                </button>
              </div>
              <p className="mt-4 text-xs text-white/70">
                The working copy includes incomplete fields. It does not apply,
                save to your account or publish these changes.
              </p>
            </section>
          </div>
        </div>
      </fieldset>
    </section>
  );
}
