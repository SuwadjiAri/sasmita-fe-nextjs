'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Minus, Undo2, Redo2,
  Pilcrow,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = 'Mulai menulis...' }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-5 py-4',
      },
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    icon: Icon,
    title,
  }: {
    onClick: () => void;
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active
          ? 'bg-emas-100 text-emas-800 shadow-sm'
          : 'text-tinta-500 hover:bg-tinta-100 hover:text-tinta-700'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const Divider = () => <span className="w-px h-6 bg-tinta-200 mx-0.5" />;

  return (
    <div className="border border-tinta-200 rounded-xl overflow-hidden bg-white shadow-sm resize-y" style={{ minHeight: '500px', overflow: 'auto' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-tinta-200/70 bg-tinta-50/80">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={Bold}
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={Italic}
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={Strikethrough}
          title="Strikethrough"
        />

        <Divider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph')}
          icon={Pilcrow}
          title="Paragraf"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          icon={Heading3}
          title="Heading 3"
        />

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={ListOrdered}
          title="Numbered List"
        />

        <Divider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={Quote}
          title="Kutipan"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={Code2}
          title="Code Block"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          active={false}
          icon={Minus}
          title="Garis Pemisah"
        />

        <Divider />

        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          icon={Undo2}
          title="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          icon={Redo2}
          title="Redo (Ctrl+Y)"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Footer - word count */}
      <div className="px-4 py-2 border-t border-tinta-200/70 bg-tinta-50/50 text-xs text-tinta-400 flex justify-between">
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} karakter</span>
        <span>{editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} kata</span>
      </div>
    </div>
  );
}
