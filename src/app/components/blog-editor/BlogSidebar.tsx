'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BlogSEOToolkit from './BlogSEOToolkit';
import { 
  Type, Tag, Folder, Clock, FileText, Search, AlertCircle, Calendar, Image as ImageIcon
} from 'lucide-react';
import ImageUpload from './ImageUpload';

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
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  lastSaved?: string | null;
  editable: boolean;
  content: string;
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
  status,
  lastSaved,
  editable,
  content,
}: BlogSidebarProps) {
  const [showSeoPreview, setShowSeoPreview] = useState(false);

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
              value={publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => onPublishedAtChange(e.target.value)}
              disabled={!editable}
              className="w-full px-2 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-white/20 dark:border-white/10 text-(--color-text-primary) text-xs focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            />
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

        {/* Slug - Read Only */}
        <motion.div 
          className="p-4 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-primary" />
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">URL Slug</label>
          </div>
          <div className="px-3 py-2 rounded-lg bg-white/50 dark:bg-black/30 text-(--color-text-primary) text-sm font-mono">
            /blogs/{slug || '...'}
          </div>
        </motion.div>

        {/* SEO Section - Collapsible */}
        <motion.div 
          className="p-4 rounded-xl bg-linear-to-br from-primary/10 to-sapphire/10 border border-primary/20 dark:border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <button 
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
