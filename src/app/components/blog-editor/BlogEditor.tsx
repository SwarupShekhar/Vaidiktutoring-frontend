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
  Image as ImageIcon, Eye, Edit3, CheckCircle, XCircle, Trash2, Search, Globe, FileText, Wand2, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { blogsApi } from '@/app/lib/blogs';
import { SEO_KEYWORD_MAP } from '@/app/lib/seo-keywords';
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

// ===== CORE: Sanitize markdown output from TipTap =====
// TipTap's getMarkdown() produces corrupted output where the Link extension
// wraps URLs with <a> tags inside markdown image/link syntax.
// e.g. ![alt](<a href="url">url</a>) instead of ![alt](url)
// This function cleans ALL such corruption.
function sanitizeMarkdown(raw: string): string {
  if (!raw) return '';
  let cleaned = raw
    // Fix corrupted image tags: ![alt](<a ...>url</a>) → ![alt](url)
    .replace(/!\[([^\]]*)\]\(\s*<a[^>]*href=["']([^"']+)["'][^>]*>[^<]*<\/a>\s*\)/gi, '![$1]($2)')
    // Fix corrupted links: [text](<a ...>url</a>) → [text](url)
    .replace(/\[([^\]]*)\]\(\s*<a[^>]*href=["']([^"']+)["'][^>]*>[^<]*<\/a>\s*\)/gi, '[$1]($2)')
    // Fix backslash-escaped brackets that TipTap sometimes adds
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    // Strip any remaining inline <a> tags (convert to markdown links)
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi, '[$2]($1)')
    // Strip remaining HTML tags like <strong>, <em>, <br>, <p>
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<hr\s*\/?>/gi, '---\n\n')
    // Convert heading HTML to markdown (for legacy content)
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    // Convert img HTML to markdown (for legacy content)
    .replace(/<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)\n\n')
    .replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![$1]($2)\n\n')
    .replace(/<img[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![]($1)\n\n')
    // Convert list items
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // Convert blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    // Strip any remaining HTML tags
    .replace(/<\/?(?:ul|ol|div|span|section|article|figure|figcaption)[^>]*>/gi, '')
    // Clean up excessive newlines
    .replace(/\n{3,}/g, '\n\n')
    // Remove trailing backslashes on heading lines (TipTap artifact)
    .replace(/^(#{1,6}\s.*)\\$/gm, '$1')
    .trim();

  return cleaned;
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
    .replace(/<h1>/g, '<h1 class="text-3xl font-black mt-12 mb-6">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-10 mb-5">')
    .replace(/<h3>/g, '<h3 class="text-xl font-bold mt-8 mb-4">')
    .replace(/<h4>/g, '<h4 class="text-lg font-bold mt-6 mb-3">')
    .replace(/<h5>/g, '<h5 class="text-base font-bold mt-4 mb-2">')
    .replace(/<h6>/g, '<h6 class="text-sm font-bold mt-3 mb-2">');
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
  const [isRawMode, setIsRawMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const isInternalChange = useRef(false);
  const hasShownPasteToast = useRef(false);
  const previewHtml = useRef('');
  const [internalLinks, setInternalLinks] = useState<Record<string, { title: string; url: string }[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showInternalLinks, setShowInternalLinks] = useState(false);
  const [suggestedLinks, setSuggestedLinks] = useState<{ keyword: string; url: string; pos: number }[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  // Magic Link Scanner
  const scanForLinks = () => {
    if (!editor) return;
    const content = (editor.storage as any).markdown.getMarkdown();
    const suggestions: { keyword: string; url: string; pos: number }[] = [];

    Object.entries(SEO_KEYWORD_MAP).forEach(([keyword, url]) => {
      // Regex to find keyword NOT inside a link already
      // This is a naive check but good for a start
      const regex = new RegExp(`(?<!\\[)${keyword}(?!\\]|\\(|\\w)`, 'gi');
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
    const content = (editor.storage as any).markdown.getMarkdown();
    let newContent = content;

    // Sort keywords by length (desc) to avoid partial matching issues
    const sortedKeywords = Object.entries(SEO_KEYWORD_MAP)
      .sort((a, b) => b[0].length - a[0].length);

    sortedKeywords.forEach(([keyword, url]) => {
      // Regex: Case-insensitive, word boundaries, not already in a link
      const regex = new RegExp(`(?<!\\[)${keyword}(?!\\]|\\(|\\w)`, 'gi');
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, (match: string) => {
          linkCount++;
          return `[${match}](${url})`;
        });
      }
    });

    if (linkCount > 0) {
      editor.commands.setContent(newContent);
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
      Markdown.configure({
        html: false,
        tightLists: true,
        tightListClass: 'tight-list',
        bulletListMarker: '-',
        linkify: false,
        breaks: false,
        transformPastedText: true,  // KEY: Parse pasted markdown into proper TipTap nodes
        transformCopiedText: true,  // Copy content as markdown format
      }),
      Placeholder.configure({
        placeholder: 'Start writing your amazing blog post...',
      }),
    ],
    content: content || '',
    editable,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      const rawMarkdown = (editor.storage as any).markdown.getMarkdown();
      // Store the HTML for preview (TipTap's HTML is always correct)
      previewHtml.current = editor.getHTML();
      onChange(sanitizeMarkdown(rawMarkdown));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
      },
      handlePaste: (view, event) => {
        // Detect markdown paste in visual mode
        if (!isRawMode && !hasShownPasteToast.current) {
          const text = event.clipboardData?.getData('text/plain') || '';
          const markdownPatterns = /(^#{1,6}\s|\*\*.+\*\*|\[.+\]\(.+\)|!\[.+\]\(.+\)|^[\-\*]\s|^\d+\.\s|^>\s|^---)/m;
          if (markdownPatterns.test(text)) {
            hasShownPasteToast.current = true;
            // Reset after 10 seconds so it can trigger again later
            setTimeout(() => { hasShownPasteToast.current = false; }, 10000);
            toast('📝 Markdown Detected', {
              description: 'It looks like you pasted Markdown content. Switch to Markdown mode for perfect formatting?',
              action: {
                label: 'Switch to Markdown',
                onClick: () => {
                  setIsRawMode(true);
                  setMode('edit');
                },
              },
              duration: 6000,
            });
          }
        }
        return false; // Let TipTap handle the paste normally
      },
    },
  });

  useEffect(() => {
    if (editor && !isInternalChange.current) {
      const currentMarkdown = (editor.storage as any).markdown.getMarkdown();
      if (content !== currentMarkdown) {
        editor.commands.setContent(content || '');
        // Update preview HTML when content loaded externally
        previewHtml.current = editor.getHTML();
      }
    }
    isInternalChange.current = false;
  }, [content, editor]);

  const setLink = () => {
    if (isRawMode) {
      // Logic for Raw Markdown Textarea
      const textarea = document.querySelector('textarea[aria-label="Raw Markdown Editor"]') as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        
        if (linkUrl === '') {
          // If no URL but text selected, we can't really "unlink" easily in raw text without complex regex, 
          // so we just do nothing or suggest manual edit
          toast.info('In markdown mode, please manually remove the [text](url) syntax to unlink.');
        } else {
          // Insert [selected](url)
          const newText = text.substring(0, start) + `[${selectedText || 'link'}](${linkUrl})` + text.substring(end);
          onChange(newText);
          toast.success('Link added to markdown!');
        }
      }
    } else {
      // Logic for Tiptap Visual Editor
      if (linkUrl === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        toast.success(`Broadcasting link: ${linkUrl}`);
      }
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
              <div className="flex flex-col relative ml-1">
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search pages or paste URL..."
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value);
                        setShowInternalLinks(true);
                      }}
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
                          link.title.toLowerCase().includes(linkUrl.toLowerCase()) || 
                          link.url.toLowerCase().includes(linkUrl.toLowerCase())
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
                          <p className="text-[10px] text-white/50 font-medium">No internal matches for "{linkUrl}"</p>
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
                className="w-full bg-white dark:bg-[#0A0A0B] min-h-[800px] overflow-hidden"
              >
                {/* High-Fidelity Preview Header */}
                <div className="max-w-[1240px] mx-auto px-8 pt-24 pb-12 text-center">
                  <div className="max-w-5xl mx-auto space-y-10">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.05] tracking-tighter">
                      {title || 'Untitled Blog Post'}
                    </h1>

                    <div className="space-y-6">
                      <div className="flex flex-col items-center gap-3">
                        <p className="font-bold text-gray-600 dark:text-gray-400 text-sm">
                          By <span className="text-primary font-black uppercase tracking-tight">{authorName}</span>
                          <span className="mx-2 opacity-30">•</span>
                          <span className="uppercase tracking-widest text-[10px] font-black">{new Date().toLocaleDateString()}</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <span className="px-4 py-1.5 rounded-full border-2 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            {category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl text-gray-400 dark:text-gray-500 leading-relaxed font-serif italic max-w-3xl mx-auto border-t border-gray-100 dark:border-white/10 pt-8">
                        {excerpt || 'Add an excerpt to show a subheadline in the preview...'}
                      </p>
                    </div>
                  </div>

                  {/* 21:9 HERO IMAGE PREVIEW */}
                  <div className="mt-24 relative aspect-21/9 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group bg-white/5">
                    {imageUrl ? (
                      <img src={imageUrl} alt={imageAlt || title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary text-xs font-bold uppercase tracking-tighter italic bg-gray-100 dark:bg-gray-800">
                        No Cover Image Selected
                      </div>
                    )}
                  </div>
                </div>

                {/* TWO-COLUMN PREVIEW LAYOUT */}
                <div className="max-w-[1240px] mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] lg:gap-16 items-start">
                  
                  {/* Left Column: Content */}
                  <div className="w-full pb-24">
                    {/* Mock Quote Box */}
                    <div className="mb-12">
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-8 rounded-r-xl">
                        <p className="text-lg text-blue-900 dark:text-blue-200 italic font-medium">
                          &ldquo;Education is not the filling of a pail, but the lighting of a fire.&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="prose prose-lg md:prose-xl prose-gray dark:prose-invert max-w-none 
                      prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight 
                      prose-p:text-[1.2rem] prose-p:leading-[2rem] prose-p:text-[#242424] dark:prose-p:text-gray-300
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-black
                      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                      prose-blockquote:border-l-4 prose-blockquote:border-gray-900 dark:prose-blockquote:border-white prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                      prose-li:text-[1.125rem] prose-li:text-gray-700 dark:prose-li:text-gray-300
                      first-letter:text-5xl first-letter:font-bold first-letter:text-gray-900 dark:first-letter:text-white first-letter:float-left first-letter:mr-3 first-letter:mt-[-4px]">
                      {isRawMode ? (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            h1: (props) => <h2 className="text-3xl font-black mt-10 mb-6 text-gray-900 dark:text-white leading-tight tracking-tight" {...props} />,
                            h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white leading-snug tracking-tight" {...props} />,
                            h3: (props) => <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />,
                            p: (props) => <p className="mb-6 leading-loose text-lg text-gray-800 dark:text-gray-300" {...props} />,
                            img: (props) => (
                              <span className="block my-10 group relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
                                <img 
                                  className="w-full h-full object-cover transition-transform hover:scale-[1.01]" 
                                  src={props.src || ''}
                                  alt={props.alt || 'Content image'} 
                                />
                                {props.alt && <span className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center text-[10px] text-white uppercase tracking-widest italic">{props.alt}</span>}
                              </span>
                            ),
                            a: (props) => <a className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium transition-colors" {...props} />,
                            ul: (props) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800 dark:text-gray-300" {...props} />,
                            ol: (props) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-lg text-gray-800 dark:text-gray-300" {...props} />,
                            blockquote: (props) => <blockquote className="border-l-4 border-blue-600 pl-6 py-2 italic my-8 bg-blue-50 dark:bg-blue-900/10 text-xl text-gray-900 dark:text-gray-100 font-serif leading-relaxed rounded-r-lg" {...props} />,
                          }}
                        >
                          {content || '*Start writing to see the preview...*'}
                        </ReactMarkdown>
                      ) : (
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: processPreviewHtml(
                              previewHtml.current || editor?.getHTML() || '<p style="opacity:0.5;font-style:italic">Start writing to see the preview...</p>'
                            )
                          }} 
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Column: Sticky Sidebar Mock */}
                  <aside className="hidden lg:block space-y-8 sticky top-6 self-start opacity-70 cursor-not-allowed">
                    <div className="bg-primary rounded-3xl p-6 text-white shadow-xl">
                      <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 border-2 border-white/20 bg-white/10" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">SIDEBAR PREVIEW</span>
                      <h3 className="text-lg font-black mt-1 leading-tight">Conversion CTA Sidebar</h3>
                      <p className="text-white/80 text-xs mt-2">This sidebar stays sticky as readers scroll through your article on the live site.</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded mb-4" />
                      <div className="space-y-4">
                        <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-xl" />
                        <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-xl" />
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
