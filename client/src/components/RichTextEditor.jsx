import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, useEffect } from 'react'

const RichTextEditor = ({ value, onChange }) => {
  const [htmlContent, setHtmlContent] = useState(value || '<p></p>')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bold: {},
        italic: {},
      }),
    ],
    content: htmlContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setHtmlContent(html)
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none min-h-[200px] border p-4 w-full max-w-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== htmlContent) {
      editor.commands.setContent(value || '<p></p>')
    }
  }, [value, editor])

  if (!editor) {
    return <div className="border rounded p-4 min-h-[200px] w-full">Loading editor...</div>
  }

  return (
    <div className="rich-text-editor w-full max-w-none">
      <div className="toolbar flex flex-wrap gap-1 mb-2 p-1 bg-gray-100 rounded-t-lg w-full">
        {/* Bold Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        {/* Italic Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Italic"
        >
          <em>I</em>
        </button>

        {/* Heading Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Heading 3"
        >
          H3
        </button>

        {/* List Buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>

        {/* Blockquote Button */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
          title="Blockquote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
      
      <EditorContent 
        editor={editor}
        className="border-t-0 rounded-b-lg w-full"
      />
    </div>
  )
}

export default RichTextEditor