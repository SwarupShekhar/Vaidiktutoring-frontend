'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogSEOToolkit from './BlogSEOToolkit';
import {
  Type, Tag, Folder, Clock, FileText, Search, AlertCircle, Calendar, Image as ImageIcon, Sparkles, Trash2
} from 'lucide-react';
import ImageUpload from './ImageUpload';
import { blogsApi } from '@/app/lib/blogs';

interface BlogSidebarProps {
  title: string;
  onTitleChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  imageAlt: string;
  onImageAltChange: (value: string) => void;
  excerpt: string;
  onExcerptChange: (value: string) => void;
  seoTitle: string;
  onSeoTitleChange: (value: string) => void;
  seoDescription: string;
  onSeoDescriptionChange: (value: string) => void;
  publishedAt: string;
  onPublishedAtChange: (value: string) => void;
  slug: string;
  onSlugChange: (value: string) => void;
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  lastSaved?: string | null;
  editable: boolean;
  content: string;
  relatedBlogIds: string[];
  onRelatedBlogIdsChange: (ids: string[]) => void;
}

const categories = [
  'Study Tips',
  'Math',
  'Science',
  'English',
  'College Prep',
  'News',
  'Technology',
  'Parenting',
];

export default function BlogSidebar({
  title,
  onTitleChange,
  category,
  onCategoryChange,
  imageUrl,
  onImageUrlChange,
  imageAlt,
  onImageAltChange,
  excerpt,
  onExcerptChange,
  seoTitle,
  onSeoTitleChange,
  seoDescription,
  onSeoDescriptionChange,
  publishedAt,
  onPublishedAtChange,
  slug,
  onSlugChange,
  status,
  lastSaved,
  editable,
  content,
  relatedBlogIds,
  onRelatedBlogIdsChange,
}: BlogSidebarProps) {
  const [showSeoPreview, setShowSeoPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch blogs for search
  const fetchAllBlogs = async () => {
    try {
      const response = await blogsApi.getAll(1, 100);
      setAllBlogs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch blogs for related selection:', error);
    }
  };

  const filteredSearch = searchQuery.length > 2 
    ? allBlogs.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !relatedBlogIds.includes(b.id)
      ).slice(0, 5)
    : [];

  const selectedBlogs = allBlogs.filter(b => relatedBlogIds.includes(b.id));

  // Helper to format Date to local YYYY-MM-DDTHH:mm
  const formatForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-primary" size={20} />
        <h3 className="text-lg font-bold text-(--color-text-primary)">Blog Settings</h3>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-3">
        
        {/* Title - Large Tile */}
        <motion.div 
          className="col-span-1 p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Type size={14} className="text-primary" />
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Title</label>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={!editable}
            placeholder="Enter blog title..."
            className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-sm font-medium focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
          />
        </motion.div>


        {/* Cover Image - Media Library Tile */}
        <motion.div 
          className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={14} className="text-secondary" />
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Cover Media</label>
          </div>
          <ImageUpload 
            value={imageUrl}
            onChange={onImageUrlChange}
            alt={imageAlt}
            onAltChange={onImageAltChange}
            editable={editable}
            suggestedAlt={`${title} cover image`}
          />
        </motion.div>

        {/* Schedule & Category Box */}
        <motion.div 
          className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-4"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Folder size={14} className="text-sapphire" />
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider text-[10px]">Category</label>
            </div>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={!editable}
              className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-sm font-medium focus:ring-2 focus:ring-primary outline-none appearance-none disabled:opacity-50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-primary" />
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider text-[10px]">Publish Date</label>
            </div>
            <input
              type="datetime-local"
              value={formatForInput(publishedAt)}
              onChange={(e) => {
                const localValue = e.target.value;
                if (!localValue) {
                  onPublishedAtChange('');
                  return;
                }
                // Convert chosen local time to UTC ISO string for storage
                onPublishedAtChange(new Date(localValue).toISOString());
              }}
              disabled={!editable}
              className="w-full px-2 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-xs focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            />
          </div>
        </motion.div>

        {/* Related Posts - Curated System */}
        <motion.div 
          className="p-4 rounded-xl bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              <label className="text-xs font-black text-text-secondary uppercase tracking-widest text-[9px]">Manual Related Posts</label>
            </div>
          </div>
          
          {editable && (
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={14} />
              </div>
              <input 
                type="text"
                placeholder="Search blogs to link..."
                value={searchQuery}
                onFocus={fetchAllBlogs}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-xs focus:ring-2 focus:ring-primary outline-none"
              />
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {filteredSearch.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-[#0A0A0B] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl p-2 space-y-1"
                  >
                    {filteredSearch.map((post) => (
                      <button
                        key={post.id}
                        type="button"
                        onClick={() => {
                          onRelatedBlogIdsChange([...relatedBlogIds, post.id]);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {post.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Selected Related Posts List */}
          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
            {selectedBlogs.map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/40 dark:bg-white/5 border border-white/10 group">
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 line-clamp-1">{post.title}</span>
                {editable && (
                  <button 
                    type="button"
                    onClick={() => onRelatedBlogIdsChange(relatedBlogIds.filter(id => id !== post.id))}
                    className="p-1 rounded-md text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            {relatedBlogIds.length === 0 && (
              <p className="text-[10px] text-gray-400 italic text-center py-2 opacity-50">Auto-detecting via category fallback...</p>
            )}
          </div>
        </motion.div>

        {/* Excerpt - Medium Tile */}
        <motion.div 
          className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-purple-500" />
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Excerpt</label>
          </div>
          <textarea
            value={excerpt}
            onChange={(e) => onExcerptChange(e.target.value)}
            disabled={!editable}
            rows={3}
            placeholder="Short description for blog cards..."
            className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-sm font-medium focus:ring-2 focus:ring-primary outline-none resize-none disabled:opacity-50"
          />
          <div className="text-xs text-text-secondary mt-1 text-right">
            {excerpt.length}/200
          </div>
        </motion.div>

        {/* Slug - Editable with Generator */}
        <motion.div 
          className="p-4 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-primary" />
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">URL Slug</label>
            </div>
            <button 
              type="button"
              onClick={() => {
                const generated = title
                  .toLowerCase()
                  .trim()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/[\s_-]+/g, '-')
                  .replace(/^-+|-+$/g, '');
                onSlugChange(generated);
              }}
              disabled={!editable || !title}
              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline disabled:opacity-50"
            >
              Generate
            </button>
          </div>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-mono select-none">/</span>
            <input 
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              disabled={!editable}
              placeholder="url-friendly-slug"
              className="w-full pl-6 pr-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-sm font-mono focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            />
          </div>
        </motion.div>

        {/* SEO Section - Collapsible */}
        <motion.div 
          className="p-4 rounded-xl bg-linear-to-br from-primary/10 to-sapphire/10 border border-primary/20 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            type="button"
            onClick={() => setShowSeoPreview(!showSeoPreview)}
            className="flex items-center justify-between w-full mb-2"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-sapphire" />
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">SEO Settings</label>
            </div>
            <span className="text-xs text-primary">
              {showSeoPreview ? 'Hide' : 'Show'}
            </span>
          </button>

          {showSeoPreview && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 mt-3"
            >
              <div>
                <label className="text-xs text-text-secondary mb-1 block">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => onSeoTitleChange(e.target.value)}
                  disabled={!editable}
                  placeholder={title || 'SEO Title'}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => onSeoDescriptionChange(e.target.value)}
                  disabled={!editable}
                  rows={2}
                  placeholder={excerpt || 'Meta description'}
                  className="w-full px-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-sm focus:ring-2 focus:ring-primary outline-none resize-none disabled:opacity-50"
                />
              </div>
              
              {/* SEO Preview */}
              <div className="p-3 rounded-lg bg-white dark:bg-black/50 border border-border">
                <p className="text-xs text-text-secondary mb-2">Google Preview:</p>
                <div className="space-y-1">
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline cursor-pointer">
                    {seoTitle || title || 'Page Title'}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs">studyhours.com/blogs/{slug || 'slug'}</p>
                  <p className="text-text-secondary text-xs line-clamp-2">
                    {seoDescription || excerpt || 'Add a meta description to improve SEO...'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* SEO Warning */}
        {(seoTitle.length > 60 || seoDescription.length > 160) && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
            <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              {seoTitle.length > 60 && <p>SEO title should be under 60 characters ({seoTitle.length}/60)</p>}
              {seoDescription.length > 160 && <p>Meta description should be under 160 characters ({seoDescription.length}/160)</p>}
            </div>
          </div>
        )}

      </div>

      {/* SEO Toolkit */}
      <div className="pt-4">
        <BlogSEOToolkit 
          content={content}
          title={title}
          excerpt={excerpt}
          seoTitle={seoTitle}
          seoDescription={seoDescription}
          imageAlt={imageAlt}
        />
      </div>

      {/* Last Saved */}
      {lastSaved && (
        <div className="flex items-center gap-2 text-xs text-text-secondary pt-4">
          <Clock size={12} />
          Last saved: {new Date(lastSaved).toLocaleString()}
        </div>
      )}
    </div>
  );
}
