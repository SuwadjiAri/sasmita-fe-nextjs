'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = 'Mulai menulis...' }: Props) {
  const editor = useEditor({
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
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm italic ${editor.isActive('italic') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded text-sm line-through ${editor.isActive('strike') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          S
        </button>
        <span className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          H3
        </button>
        <span className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          &ldquo; Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded text-sm font-mono ${editor.isActive('codeBlock') ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          {'</>'}
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
