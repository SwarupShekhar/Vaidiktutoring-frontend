'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, Link as LinkIcon,
  Image as ImageIcon, Eye, Edit3, CheckCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface BlogEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable: boolean;
  canPublish: boolean;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  onPublishToggle: (status: 'PUBLISHED' | 'PENDING') => void;
  lastSaved?: string | null;
}

export default function BlogEditor({
  content,
  onChange,
  editable,
  canPublish,
  status,
  onPublishToggle,
  lastSaved
}: BlogEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-white/10 shadow-lg mx-auto block max-w-full my-8',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post...',
      }),
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  const setLink = () => {
    if (linkUrl === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkInput(false);
      setLinkUrl('');
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    }
    setShowImageInput(false);
    setImageUrl('');
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleH1 = () => {
    // Check if an H1 already exists in the document
    const h1Count = (editor?.getHTML().match(/<h1/g) || []).length;
    const isCurrentH1 = editor?.isActive('heading', { level: 1 });

    if (h1Count >= 1 && !isCurrentH1) {
      toast.error('SEO Tip: Only one H1 is allowed per blog for best search ranking.');
      return;
    }
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  };

  const toggleH2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleH3 = () => editor?.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleH4 = () => editor?.chain().focus().toggleHeading({ level: 4 }).run();
  const toggleH5 = () => editor?.chain().focus().toggleHeading({ level: 5 }).run();
  const toggleH6 = () => editor?.chain().focus().toggleHeading({ level: 6 }).run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();

  if (!editor) return null;

  const isActive = (type: string, opts?: any) => editor.isActive(type, opts);
  
  // Logic to disable H1 button if one already exists elsewhere
  const isH1Disabled = !isActive('heading', { level: 1 }) && (editor.getHTML().match(/<h1/g) || []).length >= 1;

  return (
    <div className="relative">
      {/* Mode Toggle & Status Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
            status === 'PUBLISHED' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : status === 'REJECTED'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {status === 'PUBLISHED' ? <CheckCircle size={12} /> : status === 'REJECTED' ? <XCircle size={12} /> : null}
            {status}
          </div>

          {/* Last Saved */}
          {lastSaved && (
            <span className="text-xs text-text-secondary">
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Publish Toggle - Admin Only */}
          {canPublish && (
            <button
              type="button"
              onClick={() => onPublishToggle(status === 'PUBLISHED' ? 'PENDING' : 'PUBLISHED')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                status === 'PUBLISHED'
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
              }`}
            >
              {status === 'PUBLISHED' ? (
                <>
                  <XCircle size={14} /> Unpublish
                </>
              ) : (
                <>
                  <CheckCircle size={14} /> Publish
                </>
              )}
            </button>
          )}

          {/* Edit/Preview Toggle */}
          <div className="flex bg-white/10 dark:bg-white/5 rounded-lg p-1 border border-white/20 dark:border-white/10">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                mode === 'edit' 
                  ? 'bg-primary text-white shadow' 
                  : 'text-text-secondary hover:text-(--color-text-primary)'
              }`}
            >
              <Edit3 size={14} /> Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                mode === 'preview' 
                  ? 'bg-primary text-white shadow' 
                  : 'text-text-secondary hover:text-(--color-text-primary)'
              }`}
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Toolbar - Only in Edit mode */}
      <AnimatePresence>
        {mode === 'edit' && editable && editor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1 px-3 py-2 mb-3 rounded-xl bg-black/60 dark:bg-white/20 backdrop-blur-md border border-white/20 dark:border-white/10"
          >
            <button
              type="button"
              onClick={toggleBold}
              className={`p-2 rounded-lg transition-colors ${isActive('bold') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onClick={toggleItalic}
              className={`p-2 rounded-lg transition-colors ${isActive('italic') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <div className="w-px h-5 bg-white/30 mx-1" />
            <button
              type="button"
              onClick={toggleH1}
              disabled={isH1Disabled}
              className={`p-1.5 rounded-lg transition-colors ${
                isActive('heading', { level: 1 }) 
                  ? 'bg-primary text-white' 
                  : isH1Disabled 
                    ? 'text-white/20 cursor-not-allowed' 
                    : 'text-white/80 hover:text-white hover:bg-white/20'
              }`}
              title={isH1Disabled ? "H1 already exists" : "Heading 1"}
            >
              <Heading1 size={14} />
            </button>
            <button
              type="button"
              onClick={toggleH2}
              className={`p-1.5 rounded-lg transition-colors ${isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Heading 2"
            >
              <Heading2 size={14} />
            </button>
            <button
              type="button"
              onClick={toggleH3}
              className={`p-1.5 rounded-lg transition-colors ${isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Heading 3"
            >
              <Heading3 size={14} />
            </button>
            <button
              type="button"
              onClick={toggleH4}
              className={`p-1.5 rounded-lg transition-colors ${isActive('heading', { level: 4 }) ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Heading 4"
            >
              <Heading4 size={14} />
            </button>
            <button
              type="button"
              onClick={toggleH5}
              className={`p-1.5 rounded-lg transition-colors ${isActive('heading', { level: 5 }) ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Heading 5"
            >
              <Heading5 size={14} />
            </button>
            <button
              type="button"
              onClick={toggleH6}
              className={`p-1.5 rounded-lg transition-colors ${isActive('heading', { level: 6 }) ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Heading 6"
            >
              <Heading6 size={14} />
            </button>
            <div className="w-px h-5 bg-white/30 mx-1" />
            <button
              type="button"
              onClick={toggleBulletList}
              className={`p-2 rounded-lg transition-colors ${isActive('bulletList') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <div className="w-px h-5 bg-white/30 mx-1" />
            {showLinkInput ? (
              <div className="flex items-center gap-1 ml-1">
                <input
                  type="url"
                  placeholder="Enter URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setLink()}
                  className="w-36 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 outline-none"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={setLink} 
                  className="p-1.5 text-white/80 hover:text-white"
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLinkInput(true)}
                className={`p-2 rounded-lg transition-colors ${isActive('link') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
                title="Add Link"
              >
                <LinkIcon size={16} />
              </button>
            )}

            <div className="w-px h-5 bg-white/30 mx-1" />
            
            {showImageInput ? (
              <div className="flex items-center gap-1 ml-1">
                <input
                  type="url"
                  placeholder="Image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImage()}
                  className="w-36 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white placeholder:text-white/50 outline-none"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={addImage} 
                  className="p-1.5 text-white/80 hover:text-white"
                >
                  <CheckCircle size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowImageInput(true)}
                className={`p-2 rounded-lg transition-colors text-white/80 hover:text-white hover:bg-white/20`}
                title="Add Image"
              >
                <ImageIcon size={16} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Container - Glassmorphism */}
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl border border-white/20 dark:border-white/10 overflow-hidden"
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/40 backdrop-blur-md" />
        
        {/* Editor Content */}
        <div className="relative z-10 min-h-[500px]">
          {mode === 'edit' ? (
            <>
              {!editable && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                  <Eye size={12} /> Read-Only
                </div>
              )}
              <EditorContent 
                editor={editor} 
                className={`min-h-[500px] ${!editable ? 'pointer-events-none opacity-70' : ''}`}
              />
            </>
          ) : (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none p-6 min-h-[500px]"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-text-secondary italic">Nothing to preview yet...</p>' }}
            />
          )}
        </div>
      </motion.div>

      {/* Read-Only Warning Banner */}
      {!editable && (
        <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Eye className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Read-Only Mode</h4>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                You can only edit blogs that you have authored. This blog is owned by another author.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
