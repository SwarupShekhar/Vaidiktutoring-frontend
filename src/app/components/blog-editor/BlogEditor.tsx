'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bold, Italic, Heading1, List, Link as LinkIcon,
  Image as ImageIcon, Eye, Edit3, CheckCircle, XCircle, Trash2, Search, Globe, FileText, Wand2, Sparkles, AlertCircle, ChevronRight, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { blogsApi } from '@/app/lib/blogs';
import { SEO_KEYWORD_MAP } from '@/app/lib/seo-keywords';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import { useRef } from 'react';
import DOMPurify from 'dompurify';

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



// Post-process TipTap HTML for preview rendering
// When users paste markdown into Visual mode, TipTap wraps markdown syntax
// in <p> tags: <p># Heading</p> instead of <h1>Heading</h1>
// This function fixes those patterns in the HTML output.
function processPreviewHtml(html: string): string {
  if (!html) return '';
  let processed = html
    // Convert <p># text</p> → <h1>text</h1> (handle h1-h6)
    .replace(/<p>######\s+(.*?)<\/p>/gi, '<h6>$1</h6>')
    .replace(/<p>#####\s+(.*?)<\/p>/gi, '<h5>$1</h5>')
    .replace(/<p>####\s+(.*?)<\/p>/gi, '<h4>$1</h4>')
    .replace(/<p>###\s+(.*?)<\/p>/gi, '<h3>$1</h3>')
    .replace(/<p>##\s+(.*?)<\/p>/gi, '<h2>$1</h2>')
    .replace(/<p>#\s+(.*?)<\/p>/gi, '<h1>$1</h1>')
    // Convert <p>---</p> → <hr>
    .replace(/<p>---<\/p>/gi, '<hr class="my-10 border-white/10">')
    // Convert markdown bold in paragraphs: **text** → <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Convert markdown italic: *text* → <em>text</em> (but not ** which is bold)
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
    // Convert markdown image syntax that survived: ![alt](url) → <img>
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-2xl border border-white/10 shadow-2xl mx-auto block max-w-full my-10">')
    // Style headings
    .replace(/<h1>/g, '<h1 class="text-3xl font-black mt-16 mb-8 tracking-tighter">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-black mt-12 mb-6 tracking-tighter">')
    .replace(/<h3>/g, '<h3 class="text-xl font-black mt-10 mb-5 tracking-tight">')
    .replace(/<h4>/g, '<h4 class="text-lg font-black mt-8 mb-4">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary bg-primary/5 py-8 px-10 rounded-3xl italic my-16 font-serif">');
    
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(processed, {
      ADD_TAGS: ['img', 'blockquote', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      ADD_ATTR: ['target', 'class', 'src', 'alt']
    });
  }
  return processed;
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
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const hasLoadedInitialContent = useRef(false);
  const hasShownPasteToast = useRef(false);
  const previewHtml = useRef('');
  const isInternalChange = useRef(false);
  const [internalLinks, setInternalLinks] = useState<Record<string, { title: string; url: string }[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showInternalLinks, setShowInternalLinks] = useState(false);
  const [debouncedLinkUrl, setDebouncedLinkUrl] = useState('');
  const [suggestedLinks, setSuggestedLinks] = useState<{ keyword: string; url: string; pos: number }[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  // Debounce link search
  const updateLinkSearch = useCallback(
    debounce((val: string) => setDebouncedLinkUrl(val), 200),
    []
  );

  const handleLinkUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLinkUrl(val);
    setShowInternalLinks(true);
    updateLinkSearch(val);
  };

  // Magic Link Scanner
  const scanForLinks = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const suggestions: { keyword: string; url: string; pos: number }[] = [];

    Object.entries(SEO_KEYWORD_MAP).forEach(([keyword, url]) => {
      // Regex to find keyword NOT inside a link already
      // This is a naive check but good for a start
      const regex = new RegExp(`(?<!<a[^>]*>)${keyword}(?!</a>|\\w)`, 'gi');
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        suggestions.push({
          keyword: match[0],
          url,
          pos: match.index
        });
      }
    });

    setSuggestedLinks(suggestions);
    setShowScanner(true);
    if (suggestions.length === 0) {
      toast.info('Scan Complete: No unlinked SEO keywords found. Great job!');
    } else {
      toast.success(`Found ${suggestions.length} linking opportunities!`);
    }
  };

  const applySuggestedLink = (suggestion: { keyword: string; url: string }) => {
    if (!editor) return;
    setLinkUrl(suggestion.url);
    setShowLinkInput(true);
    toast.info(`Ready to link "${suggestion.keyword}". Highlight it and click the checkmark.`);
  };

  const applyAllLinks = () => {
    if (!editor) return;
    
    let linkCount = 0;
    const content = editor.getHTML();
    let newContent = content;

    // Sort keywords by length (desc) to avoid partial matching issues
    const sortedKeywords = Object.entries(SEO_KEYWORD_MAP)
      .sort((a, b) => b[0].length - a[0].length);

    sortedKeywords.forEach(([keyword, url]) => {
      // Regex: Case-insensitive, word boundaries, not already in a link
      const regex = new RegExp(`(?<!<a[^>]*>)${keyword}(?!</a>|\\w)`, 'gi');
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, (match: string) => {
          linkCount++;
          return `<a target="_blank" rel="noopener noreferrer nofollow" class="text-primary underline" href="${url}">${match}</a>`;
        });
      }
    });

    if (linkCount > 0) {
      if (!confirm(`Apply ${linkCount} internal links? This will clear the undo history for this action. You can restore via Version History if needed.`)) return;
      isInternalChange.current = true;
      editor.commands.setContent(newContent);
      onChange(newContent);
      setSuggestedLinks([]);
      setShowScanner(false);
      toast.success(`✨ Magic Complete! Added ${linkCount} links.`, {
        description: "Check the 'Preview' tab to verify internal linking before saving.",
        duration: 5000,
        action: {
          label: "Preview Now",
          onClick: () => {
            setMode('preview');
          }
        }
      });
    } else {
      toast.info('No new links to apply.');
    }
  };

  // Fetch internal links on mount
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const links = await blogsApi.getInternalLinks();
        setInternalLinks(links);
      } catch (error) {
        console.error('Failed to fetch internal links', error);
      }
    };
    fetchLinks();
  }, []);

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
      const htmlContent = editor.getHTML();
      // Store the HTML for preview
      previewHtml.current = htmlContent;
      onChange(htmlContent);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
      handlePaste: (view, event) => {
        // Let TipTap handle the paste normally. It natively understands both HTML and Markdown paste.
        return false;
      },
    },
  });

  useEffect(() => {
    // Only set the initial content once when the component mounts or receives its first DB fetch
    if (editor && !hasLoadedInitialContent.current && content !== undefined) {
      editor.commands.setContent(content || '');
      previewHtml.current = editor.getHTML();
      hasLoadedInitialContent.current = true;
    }
  }, [content, editor]);

  const setLink = () => {
    // Logic for Tiptap Visual Editor
    if (linkUrl === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      toast.success(`Broadcasting link: ${linkUrl}`);
    }
    
    setShowLinkInput(false);
    setShowInternalLinks(false);
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

  const handleBlockFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editor) return;
    const val = e.target.value;
    if (val === 'p') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(val.charAt(1)) as any }).run();
    }
  };

  const getBlockFormat = () => {
    if (editor?.isActive('heading', { level: 2 })) return 'h2';
    if (editor?.isActive('heading', { level: 3 })) return 'h3';
    if (editor?.isActive('heading', { level: 4 })) return 'h4';
    if (editor?.isActive('heading', { level: 5 })) return 'h5';
    if (editor?.isActive('heading', { level: 6 })) return 'h6';
    return 'p';
  };
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();

  if (!editor) return null;

  const isActive = (type: string, opts?: any) => editor.isActive(type, opts);

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

          {/* Edit/Preview/Text Toggle */}
          <div className="flex bg-white/10 dark:bg-white/5 rounded-lg p-1 border border-white/20 dark:border-white/10">
            <button
              type="button"
              aria-label="Switch to Visual Editor"
              aria-pressed={mode === 'edit'}
              onClick={() => {
                setMode('edit');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all relative ${
                mode === 'edit'
                  ? 'text-white' 
                  : 'text-text-secondary hover:text-(--color-text-primary)'
              }`}
            >
              {mode === 'edit' && (
                <motion.div layoutId="mode-bg" className="absolute inset-0 bg-primary rounded-md z-0" />
              )}
              <Edit3 size={14} className="relative z-10" /> 
              <span className="relative z-10">Visual</span>
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
            className="flex items-center gap-1 px-3 py-2 mb-3 rounded-xl bg-black/60 dark:bg-white/20 backdrop-blur-md border border-white/20 dark:border-white/10 relative z-50"
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleBold}
              className={`p-2 rounded-lg transition-colors ${isActive('bold') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleItalic}
              className={`p-2 rounded-lg transition-colors ${isActive('italic') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <div className="w-px h-5 bg-white/30 mx-1" />
            <div className="w-px h-5 bg-white/30 mx-2" />
            <select
              value={getBlockFormat()}
              onChange={handleBlockFormatChange}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer pr-6 relative"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em 1em',
              }}
            >
              <option value="p" className="text-gray-900">Paragraph</option>
              <option value="h2" className="text-gray-900">Heading 2</option>
              <option value="h3" className="text-gray-900">Heading 3</option>
              <option value="h4" className="text-gray-900">Heading 4</option>
              <option value="h5" className="text-gray-900">Heading 5</option>
              <option value="h6" className="text-gray-900">Heading 6</option>
            </select>
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
              <div className="flex flex-col relative ml-1">
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search pages or paste URL..."
                      value={linkUrl}
                      onChange={handleLinkUrlChange}
                      onFocus={() => setShowInternalLinks(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          setLink();
                        }
                      }}
                      className="w-56 px-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 outline-none focus:border-primary/50 transition-all"
                      autoFocus
                    />
                    {linkUrl && (
                      <button 
                        onClick={() => { setLinkUrl(''); setShowInternalLinks(false); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                      >
                        <XCircle size={12} />
                      </button>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={setLink} 
                    className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setShowLinkInput(false); setShowInternalLinks(false); }}
                    className="p-1.5 text-white/50 hover:text-white transition-all"
                  >
                    <XCircle size={14} />
                  </button>
                </div>

                {/* Internal Links Dropdown */}
                <AnimatePresence>
                  {showInternalLinks && (linkUrl.length > 0 || Object.keys(internalLinks).length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 mt-2 w-64 max-h-60 overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 py-1 scrollbar-hide"
                    >
                      <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 border-b border-white/5 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Search size={10} /> 
                          {editor && !editor.state.selection.empty ? 'Link selection to...' : 'Link Suggestions'}
                        </span>
                        <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded italic">Internal Only</span>
                      </div>
                      
                      {Object.entries(internalLinks).map(([category, links]) => {
                        const filteredLinks = links.filter(link => 
                          link.title.toLowerCase().includes(debouncedLinkUrl.toLowerCase()) || 
                          link.url.toLowerCase().includes(debouncedLinkUrl.toLowerCase())
                        );

                        if (filteredLinks.length === 0) return null;

                        return (
                          <div key={category} className="mb-2">
                            <div className="px-3 py-1 flex items-center gap-2 text-[9px] font-bold text-primary/70 uppercase tracking-tighter">
                              {category === 'Site Pages' && <Search size={8} />}
                              {category === 'Curriculum Pillars' && <Globe size={8} />}
                              {category === 'Blog Posts' && <FileText size={8} />}
                              {category}
                            </div>
                            {filteredLinks.map((link, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  if (!editor) return;
                                  
                                  const selection = editor.state.selection;
                                  const hasSelection = !selection.empty;
                                  
                                  // If there is a selection, apply it immediately
                                  if (hasSelection) {
                                    editor.chain().focus().extendMarkRange('link').setLink({ href: link.url }).run();
                                    setShowInternalLinks(false);
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                    toast.success(`Linked selection to ${link.title}!`);
                                  } else {
                                    // Otherwise just populate the input like before
                                    setLinkUrl(link.url);
                                    setShowInternalLinks(false);
                                    toast.info('Link URL set. Now highlight text and click the checkmark or press Enter.');
                                  }
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-primary/20 group transition-all"
                              >
                                <div className="text-xs font-bold text-white group-hover:text-primary transition-colors flex items-center justify-between">
                                  <span>{link.title}</span>
                                  <span className="text-[8px] opacity-0 group-hover:opacity-100 bg-primary/20 px-1 rounded text-primary">SELECT</span>
                                </div>
                                <div className="text-[10px] text-white/40 truncate font-mono">{link.url}</div>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                      
                      {Object.values(internalLinks).flat().filter(link => 
                        link.title.toLowerCase().includes(linkUrl.toLowerCase()) || 
                        link.url.toLowerCase().includes(linkUrl.toLowerCase())
                      ).length === 0 && (
                        <div className="px-3 py-6 text-center">
                          <p className="text-[10px] text-white/50 font-medium">No internal matches for "{debouncedLinkUrl}"</p>
                          <p className="text-[9px] text-primary mt-2 font-bold italic animate-pulse">Press Enter for external URL</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowLinkInput(true)}
                className={`p-2 rounded-lg transition-colors ${isActive('link') ? 'bg-primary text-white' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
                title="Add Link"
              >
                <LinkIcon size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={scanForLinks}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ml-1 ${showScanner ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary hover:bg-primary/10'}`}
              title="Magic Link Scanner"
            >
              <Wand2 size={16} className={showScanner ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Magic Scan</span>
            </button>

            <div className="w-px h-5 bg-white/30 mx-1" />
            
            {showImageInput ? (
              <div className="flex items-center gap-1 ml-1">
                <input
                  type="url"
                  placeholder="Image URL..."
                  value={inlineImageUrl}
                  onChange={(e) => setInlineImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImage();
                    }
                  }}
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

      {/* Magic Scanner Results Overlay */}
      <AnimatePresence>
        {showScanner && suggestedLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-16 right-0 w-80 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl z-50 overflow-hidden"
          >
            <div className="bg-primary/10 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-white">SEO Opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={applyAllLinks}
                  className="text-[9px] font-black bg-white text-primary px-2 py-1 rounded hover:bg-white/90 transition-colors shadow-lg"
                >
                  LINK ALL
                </button>
                <button 
                  type="button"
                  onClick={() => setShowScanner(false)} 
                  className="text-white/30 hover:text-white"
                >
                  <XCircle size={14} />
                </button>
              </div>
            </div>
            
            <div className="max-h-72 overflow-y-auto p-2 space-y-2 scrollbar-hide">
              {suggestedLinks.map((s, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">"{s.keyword}"</span>
                    <button 
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySuggestedLink(s)}
                      className="px-2 py-1 bg-primary/20 hover:bg-primary text-primary hover:text-white text-[10px] font-bold rounded-lg transition-all"
                    >
                      Use Link
                    </button>
                  </div>
                  <div className="text-[10px] text-white/30 truncate font-mono">{s.url}</div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-white/5 border-t border-white/5 flex items-center gap-2">
              <AlertCircle size={10} className="text-white/40" />
              <p className="text-[9px] text-white/40 leading-tight">
                Interlinking these keywords improves topical authority and site crawlability.
              </p>
            </div>
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
                <EditorContent 
                  editor={editor} 
                  className={`min-h-[500px] ${!editable ? 'pointer-events-none opacity-70' : ''}`}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="preview-view"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="w-full bg-white dark:bg-[#0A0A0B] min-h-[800px] overflow-hidden"
              >
                {/* High-Fidelity Preview Header */}
                <div className="max-w-[1240px] mx-auto px-8 pt-24 pb-12 text-center">
                  <div className="max-w-5xl mx-auto space-y-10">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tighter">
                      {title || 'Untitled Blog Post'}
                    </h1>

                    <div className="space-y-8">
                      <div className="flex flex-col items-center gap-4">
                        <p className="font-bold text-gray-500 dark:text-gray-400 text-sm">
                          By <span className="text-primary font-black uppercase tracking-tight">{authorName || 'StudyHours Editorial'}</span>
                          <span className="mx-3 opacity-20">•</span>
                          <span className="uppercase tracking-[0.2em] text-[10px] font-black">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <span className="px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.25em]">
                            {category || 'Education'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl text-gray-400 dark:text-gray-500 leading-relaxed font-serif italic max-w-3xl mx-auto border-t border-gray-100 dark:border-white/10 pt-10">
                        {excerpt || 'Add an excerpt to show a subheadline in the preview...'}
                      </p>
                    </div>
                  </div>

                  {/* 16:9 HERO IMAGE PREVIEW */}
                  <div className="mt-28 relative aspect-video rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] group bg-white/5 border border-white/10">
                    {imageUrl ? (
                      <img src={imageUrl} alt={imageAlt || title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic bg-gray-50 dark:bg-gray-800/50">
                        Academic Resource Placeholder
                      </div>
                    )}
                  </div>
                </div>

                {/* THREE-COLUMN PREVIEW LAYOUT */}
                <div className="max-w-[1500px] mx-auto px-8 mt-24 lg:grid lg:grid-cols-[1fr_300px] xl:grid-cols-[250px_1fr_350px] lg:gap-10 xl:gap-16 items-start relative">
                  
                  {/* Left Column: TOC Mockup */}
                  <aside className="hidden xl:block space-y-10 opacity-30 pointer-events-none sticky top-12 self-start pb-10">
                    <div className="flex items-center gap-2 font-black text-gray-400 uppercase tracking-[0.3em] text-[9px]">
                        <List size={14} className="text-gray-400" />
                        Index
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded" />
                      <div className="h-4 w-40 bg-gray-100 dark:bg-white/5 rounded" />
                      <div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded" />
                    </div>
                  </aside>

                  {/* Center Column: Content */}
                  <div className="w-full min-w-0 pb-24">
                    <div className="prose prose-lg md:prose-xl prose-gray dark:prose-invert max-w-none 
                      prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tighter 
                      prose-p:text-[1.125rem] prose-p:leading-[2.1] prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:mb-10
                      prose-a:text-primary prose-a:font-bold prose-a:underline-offset-4
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:my-16
                      prose-li:text-[1.125rem] prose-li:leading-[2] prose-li:mb-4
                      first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-4 first-letter:mt-2 first-letter:float-left">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(processPreviewHtml(
                              previewHtml.current || editor?.getHTML() || '<p style="opacity:0.5;font-style:italic">Start writing to see the preview...</p>'
                            ), { ADD_ATTR: ['class', 'style'] })
                          }}
                        />
                    </div>
                  </div>

                  {/* Right Column: Sticky Sidebar Premium Mock */}
                  <aside className="hidden lg:block space-y-12 sticky top-12 self-start opacity-70 cursor-not-allowed pb-20">
                    <div className="relative group overflow-hidden rounded-[3rem] bg-[#0F1115] p-8 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border border-white/5">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Sparkles size={12} className="text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Insight Premium</span>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black leading-[1.1] tracking-tighter">Master the Curriculum.</h3>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">Expert 1-on-1 guidance for IB & IGCSE tailored to your goals.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 w-full py-5 bg-primary text-white font-black text-sm rounded-2xl shadow-xl shadow-primary/20">
                                    Start Free Session <ChevronRight size={16} />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <span>Global Faculty</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>24/7 Peer Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-white/20 rounded-[3rem] p-8 border border-gray-100 dark:border-white/5 opacity-50">
                        <h3 className="text-[10px] font-black text-gray-900 dark:text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Compendium
                        </h3>
                        <div className="space-y-10">
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 shrink-0 rounded-2xl bg-gray-100 dark:bg-white/5" />
                            <div className="space-y-2">
                              <div className="h-3 w-16 bg-gray-100 dark:bg-white/5 rounded" />
                              <div className="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded" />
                            </div>
                          </div>
                        </div>
                    </div>
                  </aside>
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
