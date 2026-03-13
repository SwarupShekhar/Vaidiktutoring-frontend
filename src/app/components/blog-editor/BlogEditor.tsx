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
  Image as ImageIcon, Eye, Edit3, CheckCircle, XCircle, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { Markdown } from 'tiptap-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { useRef } from 'react';

interface BlogEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  editable: boolean;
  canPublish: boolean;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  onPublishToggle: (status: 'PUBLISHED' | 'PENDING') => void;
  lastSaved?: string | null;
  // Metadata for Full Preview
  title?: string;
  category?: string;
  imageUrl?: string;
  imageAlt?: string;
  excerpt?: string;
  authorName?: string;
}

export default function BlogEditor({
  content,
  onChange,
  editable,
  canPublish,
  status,
  onPublishToggle,
  lastSaved,
  title,
  category,
  imageUrl,
  imageAlt,
  excerpt,
  authorName = 'Vaidik Author'
}: BlogEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isRawMode, setIsRawMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const isInternalChange = useRef(false);

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
      Markdown.configure({
        html: false, // Force pure markdown without HTML tags
        tightLists: true,
        tightListClass: 'tight-list',
        bulletListMarker: '-',
        linkify: false, // Avoid conflicting with Link extension
        breaks: false, // Use standard markdown breaks
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post...',
      }),
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      // Mark this change as internal so we don't trigger the sync useEffect
      isInternalChange.current = true;
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
  });

  useEffect(() => {
    // Only update the editor if the content prop changes from an EXTERNAL source
    // (e.g., initial load, restore version, or external edit)
    if (editor && !isInternalChange.current) {
      const currentMarkdown = (editor.storage as any).markdown.getMarkdown();
      if (content !== currentMarkdown) {
        editor.commands.setContent(content || '');
      }
    }
    isInternalChange.current = false;
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
    if (inlineImageUrl) {
      editor?.chain().focus().setImage({ src: inlineImageUrl }).run();
    }
    setShowImageInput(false);
    setInlineImageUrl('');
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

  const handlePaste = (e: React.ClipboardEvent) => {
    // Only detect if in visual mode
    if (mode === 'edit' && !isRawMode) {
      const pastedText = e.clipboardData.getData('text');
      // Detect markdown patterns: # Header, **bold**, [link](...), ![] image, - list
      const markdownRegex = /(^#\s|\*\*|\[.*\]\(.*\)|\!\[.*\]\(.*\)|\n[\-\*]\s)/m;
      
      if (markdownRegex.test(pastedText)) {
        toast('Markdown Detected', {
          description: 'It looks like you are pasting Markdown. Switch to Markdown mode for better results?',
          action: {
            label: 'Switch to Markdown',
            onClick: () => {
              setIsRawMode(true);
              setMode('edit');
            }
          },
          duration: 5000,
        });
      }
    }
  };

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
              aria-label="Switch to Visual Editor"
              aria-pressed={mode === 'edit' && !isRawMode}
              onClick={() => {
                setMode('edit');
                setIsRawMode(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${
                mode === 'edit' && !isRawMode
                  ? 'text-white' 
                  : 'text-text-secondary hover:text-(--color-text-primary)'
              }`}
            >
              {mode === 'edit' && !isRawMode && (
                <motion.div layoutId="mode-bg" className="absolute inset-0 bg-primary rounded-md z-0" />
              )}
              <Edit3 size={14} className="relative z-10" /> 
              <span className="relative z-10">Visual</span>
            </button>
            <button
              type="button"
              aria-label="Switch to Raw Markdown Editor"
              aria-pressed={mode === 'edit' && isRawMode}
              onClick={() => {
                setMode('edit');
                setIsRawMode(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${
                mode === 'edit' && isRawMode
                  ? 'text-white' 
                  : 'text-text-secondary hover:text-(--color-text-primary)'
              }`}
            >
              {mode === 'edit' && isRawMode && (
                <motion.div layoutId="mode-bg" className="absolute inset-0 bg-indigo-600 rounded-md z-0" />
              )}
              <span className="text-[10px] relative z-10">#</span> 
              <span className="relative z-10">Markdown</span>
            </button>
            <button
              type="button"
              aria-label="Switch to Preview Mode"
              aria-pressed={mode === 'preview'}
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${
                mode === 'preview' 
                  ? 'text-white' 
                  : 'text-text-secondary hover:text-(--color-text-primary)'
              }`}
            >
              {mode === 'preview' && (
                <motion.div layoutId="mode-bg" className="absolute inset-0 bg-primary rounded-md z-0" />
              )}
              <Eye size={14} className="relative z-10" /> 
              <span className="relative z-10">Preview</span>
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
                  value={inlineImageUrl}
                  onChange={(e) => setInlineImageUrl(e.target.value)}
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
        <div className="relative z-10 min-h-[500px]" onPaste={handlePaste}>
          <AnimatePresence mode="wait">
            {mode === 'edit' ? (
              <motion.div
                key="edit-view"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {!editable && (
                  <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full flex items-center gap-1.5 border border-yellow-200 dark:border-yellow-800">
                    <Eye size={12} /> Read-Only Mode
                  </div>
                )}
                {isRawMode ? (
                  <textarea
                    aria-label="Raw Markdown Editor"
                    value={content}
                    onChange={(e) => {
                      onChange(e.target.value);
                    }}
                    className="w-full min-h-[600px] p-10 bg-black/5 dark:bg-black/40 text-(--color-text-primary) font-mono text-sm leading-relaxed focus:bg-white/5 outline-none transition-all resize-none border-b border-white/5"
                    placeholder="Paste or write your raw markdown here... Use ## for headers, ** for bold, etc."
                  />
                ) : (
                  <EditorContent 
                    editor={editor} 
                    className={`min-h-[500px] ${!editable ? 'pointer-events-none opacity-70' : ''}`}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="preview-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#FDFDFC] dark:bg-black/20 min-h-[800px] overflow-hidden"
              >
              {/* High-Fidelity Preview Header */}
              <div className="max-w-[1000px] mx-auto px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        {category || 'Uncategorized'}
                      </span>
                      <span className="text-text-secondary text-xs font-bold">Preview Mode</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-(--color-text-primary) leading-[1.1] tracking-tight">
                      {title || 'Untited Blog Post'}
                    </h1>
                    <p className="text-lg text-text-secondary leading-relaxed font-serif italic border-l-2 border-primary/20 pl-4">
                      {excerpt || 'Add an excerpt to show a subheadline in the preview...'}
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-6">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-sapphire flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-(--color-text-primary) text-sm">{authorName}</p>
                        <p className="text-xs text-text-secondary">Education Specialist • {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group bg-white/5">
                    {imageUrl ? (
                      <img src={imageUrl} alt={imageAlt || title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs font-bold uppercase tracking-tighter italic">
                        No Cover Image Selected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* High-Fidelity Quote Box */}
              <div className="max-w-3xl mx-auto px-8 mb-12">
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                  <p className="text-base text-primary font-medium italic">
                    "This is a high-fidelity preview of how your article will look to the world. Ensure your headings and images are perfectly placed."
                  </p>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="max-w-[750px] mx-auto px-8 pb-24">
                <div className="prose prose-lg dark:prose-invert max-w-none 
                  prose-headings:font-black prose-headings:tracking-tight 
                  prose-p:text-text-secondary prose-p:leading-relaxed
                  prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-white/10
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5
                  first-letter:text-5xl first-letter:font-black first-letter:text-(--color-text-primary) first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: (props) => <h1 className="text-3xl font-black mt-12 mb-6 text-(--color-text-primary)" {...props} />,
                      h2: (props) => <h2 className="text-2xl font-bold mt-10 mb-5 text-(--color-text-primary)" {...props} />,
                      h3: (props) => <h3 className="text-xl font-bold mt-8 mb-4 text-(--color-text-primary)" {...props} />,
                      p: (props) => <p className="mb-6" {...props} />,
                      img: (props) => (
                        <span className="block my-10 group">
                          <img 
                            className="rounded-2xl border border-white/10 shadow-2xl mx-auto block max-w-full transition-transform hover:scale-[1.01]" 
                            {...props} 
                            alt={props.alt || 'Content image'} 
                          />
                          {props.alt && <span className="block text-center text-[10px] text-text-secondary mt-3 uppercase tracking-widest italic">{props.alt}</span>}
                        </span>
                      ),
                      a: (props) => <a className="text-primary hover:underline font-bold transition-all" {...props} />,
                      ul: (props) => <ul className="list-disc ml-6 space-y-3 mb-8" {...props} />,
                      ol: (props) => <ol className="list-decimal ml-6 space-y-3 mb-8" {...props} />,
                      blockquote: (props) => <blockquote className="border-l-4 border-primary bg-primary/5 px-6 py-4 italic rounded-r-xl my-10" {...props} />,
                    }}
                  >
                    {content || '*Start writing to see the preview...*'}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
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
