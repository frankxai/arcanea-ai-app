'use client';

import { useCallback, useRef, useEffect } from 'react';
import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  StarterKit,
  TiptapLink,
  TiptapImage,
  TiptapUnderline,
  TaskList,
  TaskItem,
  TextStyle,
  Color,
  HighlightExtension,
  Placeholder,
  CodeBlockLowlight,
  HorizontalRule,
  CharacterCount,
  GlobalDragHandle,
  ImageResizer,
  handleImageDrop,
  handleImagePaste,
  createImageUpload,
  createSuggestionItems,
  handleCommandNavigation,
  type JSONContent,
  type EditorInstance,
} from 'novel';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DocEditorSavePayload {
  content_json: JSONContent;
  content_text: string;
  word_count: number;
}

interface DocEditorProps {
  initialContent?: JSONContent;
  placeholder?: string;
  onSave?: (payload: DocEditorSavePayload) => Promise<void> | void;
  /** Debounce delay in ms (default 2000) */
  saveDelay?: number;
  readOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Image upload stub (replace with real Supabase Storage upload)
// ---------------------------------------------------------------------------

const uploadFn = createImageUpload({
  onUpload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url as string;
  },
  validateFn: (file: File) => {
    if (!file.type.startsWith('image/')) return false;
    if (file.size > 10 * 1024 * 1024) return false;
    return true;
  },
});

// ---------------------------------------------------------------------------
// Slash command items
// ---------------------------------------------------------------------------

const suggestionItems = createSuggestionItems([
  {
    title: 'Text',
    description: 'Plain paragraph',
    searchTerms: ['text', 'paragraph', 'p'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Large section heading',
    searchTerms: ['h1', 'heading', 'title'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading',
    searchTerms: ['h2', 'heading', 'subtitle'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading',
    searchTerms: ['h3', 'heading'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Unordered list',
    searchTerms: ['ul', 'list', 'bullet', 'unordered'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Ordered list',
    searchTerms: ['ol', 'list', 'numbered', 'ordered'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'To-Do',
    description: 'Task checklist item',
    searchTerms: ['todo', 'task', 'check', 'checkbox'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Block quotation',
    searchTerms: ['blockquote', 'quote'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code',
    description: 'Code block with syntax highlighting',
    searchTerms: ['code', 'codeblock', 'pre'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Divider',
    description: 'Horizontal rule',
    searchTerms: ['hr', 'divider', 'separator', 'rule'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Image',
    description: 'Upload or embed an image',
    searchTerms: ['image', 'img', 'photo', 'picture'],
    command: ({ editor, range }: { editor: EditorInstance; range: { from: number; to: number } }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (!input.files?.[0]) return;
        const url = await uploadFn(input.files[0], editor.view);
        if (url) {
          editor.chain().focus().setImage({ src: url as string }).run();
        }
      };
      input.click();
    },
  },
]);

// ---------------------------------------------------------------------------
// Extensions
// ---------------------------------------------------------------------------

const extensions = [
  StarterKit.configure({ codeBlock: false }),
  TiptapLink.configure({ openOnClick: false }),
  TiptapImage.configure({ allowBase64: false }),
  TiptapUnderline,
  TaskList,
  TaskItem.configure({ nested: true }),
  TextStyle,
  Color,
  HighlightExtension.configure({ multicolor: true }),
  Placeholder.configure({ placeholder: 'Type / for commands…' }),
  CodeBlockLowlight,
  HorizontalRule,
  CharacterCount,
  GlobalDragHandle,
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DocEditor({
  initialContent,
  onSave,
  saveDelay = 2000,
  readOnly = false,
}: DocEditorProps) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<EditorInstance | null>(null);

  const triggerSave = useCallback(
    (editor: EditorInstance) => {
      if (!onSave) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const json = editor.getJSON();
        const text = editor.getText();
        const wordCount =
          (editor.storage as { characterCount?: { words?: () => number } })
            .characterCount?.words?.() ?? text.split(/\s+/).filter(Boolean).length;
        await onSave({ content_json: json, content_text: text, word_count: wordCount });
      }, saveDelay);
    },
    [onSave, saveDelay]
  );

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        if (editorRef.current && onSave) {
          const editor = editorRef.current;
          const json = editor.getJSON();
          const text = editor.getText();
          const wordCount = text.split(/\s+/).filter(Boolean).length;
          void onSave({ content_json: json, content_text: text, word_count: wordCount });
        }
      }
    };
  }, [onSave]);

  return (
    <div className="doc-editor relative min-h-[60vh]">
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          editable={!readOnly}
          className="prose prose-invert prose-sm sm:prose-base max-w-none focus:outline-none [&_.ProseMirror]:min-h-[60vh] [&_.ProseMirror]:px-0 [&_.ProseMirror]:py-2 [&_.ProseMirror_h1]:font-display [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:font-display [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h3]:font-display [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-white/20 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-white/50 [&_.ProseMirror_code]:bg-white/[0.06] [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:text-[#7fffd4] [&_.ProseMirror_pre]:bg-white/[0.04] [&_.ProseMirror_pre]:rounded-xl [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-white/[0.06]"
          onUpdate={({ editor }) => {
            editorRef.current = editor;
            triggerSave(editor);
          }}
          onCreate={({ editor }) => {
            editorRef.current = editor;
          }}
          editorProps={{
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event as DragEvent, moved, uploadFn),
            handlePaste: (view, event) =>
              handleImagePaste(view, event as ClipboardEvent, uploadFn),
            handleKeyDown: (_view, event) => {
              return handleCommandNavigation(event) ?? false;
            },
            attributes: {
              class: 'outline-none',
            },
          }}
        >
          {/* Slash command menu */}
          <EditorCommand className="z-50 h-auto max-h-[24rem] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0f0f17]/95 backdrop-blur-xl px-1.5 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all">
            <EditorCommandEmpty className="px-3 py-2 text-xs text-white/30 font-sans">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  key={item.title}
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full cursor-pointer select-none items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06] data-[selected]:bg-white/[0.08] data-[selected]:text-white font-sans"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-white/80">{item.title}</span>
                    {item.description && (
                      <span className="text-[11px] text-white/35">{item.description}</span>
                    )}
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* Bubble toolbar */}
          <EditorBubble
            tippyOptions={{ duration: 100, placement: 'top' }}
            className="flex items-center gap-0.5 rounded-xl border border-white/[0.10] bg-[#0f0f17]/95 backdrop-blur-xl px-1.5 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <BubbleButton
              label="Bold"
              shortcut="B"
              onSelect={(editor) => editor.chain().focus().toggleBold().run()}
              isActive={(editor) => editor.isActive('bold')}
            />
            <BubbleButton
              label="Italic"
              shortcut="I"
              onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
              isActive={(editor) => editor.isActive('italic')}
            />
            <BubbleButton
              label="U"
              shortcut="U"
              onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}
              isActive={(editor) => editor.isActive('underline')}
            />
            <BubbleButton
              label="S"
              shortcut="S"
              className="line-through"
              onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
              isActive={(editor) => editor.isActive('strike')}
            />
            <div className="w-px h-4 bg-white/[0.10] mx-0.5" />
            <BubbleButton
              label="Mark"
              onSelect={(editor) => editor.chain().focus().toggleHighlight().run()}
              isActive={(editor) => editor.isActive('highlight')}
              highlight
            />
            <BubbleButton
              label="Code"
              onSelect={(editor) => editor.chain().focus().toggleCode().run()}
              isActive={(editor) => editor.isActive('code')}
              mono
            />
            <BubbleButton
              label="Link"
              onSelect={(editor) => {
                const url = window.prompt('URL:');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              isActive={(editor) => editor.isActive('link')}
            />
          </EditorBubble>

          {/* Image resize handle */}
          <ImageResizer />
        </EditorContent>
      </EditorRoot>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bubble button helper
// ---------------------------------------------------------------------------

function BubbleButton({
  label,
  onSelect,
  isActive,
  highlight,
  mono,
  className = '',
}: {
  label: string;
  shortcut?: string;
  onSelect: (editor: EditorInstance) => void;
  isActive: (editor: EditorInstance) => boolean;
  highlight?: boolean;
  mono?: boolean;
  className?: string;
}) {
  return (
    <EditorBubbleItem
      onSelect={(editor) => onSelect(editor)}
      className={[
        'cursor-pointer select-none rounded-lg px-2.5 py-1.5 text-xs transition-colors font-sans',
        highlight ? 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30' : '',
        mono ? 'font-mono text-[#7fffd4]' : '',
        !highlight && !mono ? 'text-white/50 hover:bg-white/[0.08] hover:text-white' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </EditorBubbleItem>
  );
}
