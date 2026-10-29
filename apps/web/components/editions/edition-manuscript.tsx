"use client";

import { moveSection, type EditionDraft } from "@/lib/editions/edition";
import styles from "./edition-workspace.module.css";

export function EditionManuscript({
  draft,
  paper,
  preview,
  disabled,
  onChange,
}: {
  draft: EditionDraft;
  paper: boolean;
  preview: boolean;
  disabled: boolean;
  onChange: (next: EditionDraft) => void;
}) {
  function edit(id: string, patch: { title?: string; text?: string }) {
    onChange({
      ...draft,
      sections: draft.sections.map((section) =>
        section.id === id ? { ...section, ...patch } : section,
      ),
    });
  }
  return (
    <section
      className={styles.canvas}
      data-paper={paper}
      aria-label="Edition manuscript"
    >
      {preview ? (
        <h2 className={styles.editionTitle}>
          {draft.title || "Untitled edition"}
        </h2>
      ) : (
        <label className={styles.titleLabel}>
          Edition title
          <input
            aria-label="Edition title"
            maxLength={500}
            value={draft.title}
            disabled={disabled}
            onChange={(event) =>
              onChange({ ...draft, title: event.target.value })
            }
          />
        </label>
      )}
      {draft.sections.length === 0 && (
        <div className={styles.empty}>
          <h2>Your first page starts here.</h2>
          <p>
            Add writing from your project, or begin a new section. Read the
            whole edition before exporting.
          </p>
        </div>
      )}
      {draft.sections.map((section, index) => (
        <article key={section.id} className={styles.section}>
          {preview ? (
            <>
              <h3>{section.title}</h3>
              <p className={styles.reading}>
                {section.text || "This section is empty."}
              </p>
            </>
          ) : (
            <>
              <div className={styles.sectionHeader}>
                <label>
                  Section {index + 1} title
                  <input
                    maxLength={500}
                    value={section.title}
                    disabled={disabled}
                    onChange={(event) =>
                      edit(section.id, { title: event.target.value })
                    }
                  />
                </label>
                <div className={styles.sectionActions}>
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    aria-label={`Move ${section.title} earlier`}
                    onClick={() => onChange(moveSection(draft, section.id, -1))}
                  >
                    Earlier
                  </button>
                  <button
                    type="button"
                    disabled={disabled || index === draft.sections.length - 1}
                    aria-label={`Move ${section.title} later`}
                    onClick={() => onChange(moveSection(draft, section.id, 1))}
                  >
                    Later
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Remove ${section.title} from edition`}
                    onClick={() =>
                      onChange({
                        ...draft,
                        sections: draft.sections.filter(
                          (item) => item.id !== section.id,
                        ),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
              <label className={styles.bodyLabel}>
                Section {index + 1} writing
                <textarea
                  value={section.text}
                  disabled={disabled}
                  onChange={(event) =>
                    edit(section.id, { text: event.target.value })
                  }
                />
              </label>
            </>
          )}
          <p className={styles.sourceLine}>
            {section.source
              ? `Source revision ${section.source.revision} · imported snapshot`
              : "Written in this edition"}
          </p>
        </article>
      ))}
      <footer className={styles.review}>
        Draft. Editorial quality, canon alignment, and reuse rights have not
        been reviewed.
      </footer>
    </section>
  );
}
