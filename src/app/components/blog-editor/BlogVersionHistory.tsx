'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Clock, User, ChevronRight, RotateCcw, 
  Eye, FileText, CheckCircle2, X
} from 'lucide-react';
import { blogsApi, BlogVersion, BlogPost } from '@/app/lib/blogs';
import { format } from 'date-fns';

interface BlogVersionHistoryProps {
  blogId: string;
  currentContent: string;
  onRestore: (restoredBlog: BlogPost) => void;
  onClose: () => void;
}

export default function BlogVersionHistory({
  blogId,
  currentContent,
  onRestore,
  onClose
}: BlogVersionHistoryProps) {
  const [versions, setVersions] = useState<BlogVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<BlogVersion | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await blogsApi.getVersions(blogId);
        setVersions(data);
      } catch (error) {
        console.error('Failed to fetch versions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVersions();
  }, [blogId]);

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? Your current unsaved changes will be lost.')) return;
    
    setRestoring(true);
    try {
      const restored = await blogsApi.restoreVersion(blogId, versionId);
      onRestore(restored);
      alert('Version restored successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to restore version:', error);
      alert('Failed to restore version');
    } finally {
      setRestoring(false);
    }
  };

  const simpleDiff = (oldText: string, newText: string) => {
    // Very basic line-based diff
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diff: { type: 'added' | 'removed' | 'same'; text: string }[] = [];
    
    // Simplistic algorithm for visualization
    let i = 0, j = 0;
    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        diff.push({ type: 'same', text: oldLines[i] });
        i++; j++;
      } else if (j < newLines.length && (!oldLines.includes(newLines[j], i))) {
        diff.push({ type: 'added', text: newLines[j] });
        j++;
      } else if (i < oldLines.length) {
        diff.push({ type: 'removed', text: oldLines[i] });
        i++;
      }
    }
    return diff;
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-950 border-l border-white/10 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <History size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Version History</h2>
            <p className="text-xs text-text-secondary">Compare and restore previous edits</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-secondary hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Version List */}
        <div className="w-1/3 border-r border-white/10 overflow-y-auto p-4 space-y-3 bg-black/20">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-10">
              <Clock size={32} className="mx-auto text-white/10 mb-2" />
              <p className="text-xs text-text-secondary">No versions found</p>
            </div>
          ) : (
            versions.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVersion(v)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedVersion?.id === v.id 
                    ? 'bg-primary/20 border-primary/50 shadow-lg shadow-primary/10' 
                    : 'bg-white/5 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black text-primary uppercase">
                    {format(new Date(v.created_at), 'MMM d, h:mm a')}
                  </span>
                  {v === versions[0] && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase">Latest</span>
                  )}
                </div>
                <p className="text-sm font-bold text-white line-clamp-1 mb-2">{v.summary || 'Updated content'}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-medium">
                  <User size={10} />
                  <span>{v.author?.first_name} {v.author?.last_name?.[0]}.</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Comparison View */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/40">
          <AnimatePresence mode="wait">
            {!selectedVersion ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-10"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Eye size={40} className="text-white/20" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Select a version to compare</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  Click on any version from the left panel to see what changed and restore it if needed.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedVersion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Comparison Actions */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase italic">Viewing Snapshot</h4>
                    <p className="text-xs text-text-secondary">{format(new Date(selectedVersion.created_at), 'PPPpppp')}</p>
                  </div>
                  <button
                    onClick={() => handleRestore(selectedVersion.id)}
                    disabled={restoring}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    {restoring ? 'Restoring...' : 'Restore This Version'}
                  </button>
                </div>

                {/* Diff Content */}
                <div className="space-y-6">
                  {/* Title Diff */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Metadata Snapshots</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[8px] text-primary uppercase block mb-1">Title</span>
                        <p className="text-xs font-bold text-white leading-tight">{selectedVersion.title}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                        <span className="text-[8px] text-sapphire uppercase block mb-1">Category</span>
                        <p className="text-xs font-bold text-white">{selectedVersion.category}</p>
                      </div>
                    </div>
                    {selectedVersion.image_url && (
                      <div className="p-3 rounded-xl bg-black/30 border border-white/5 mt-3">
                        <span className="text-[8px] text-green-500 uppercase block mb-1">Image Alt Text</span>
                        <p className="text-xs italic text-text-secondary">"{selectedVersion.image_alt || 'No alt text provided'}"</p>
                      </div>
                    )}
                  </div>

                  {/* Content Diff */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Content Breakdown</label>
                    <div className="rounded-2xl border border-white/10 overflow-hidden text-sm">
                      {simpleDiff(selectedVersion.content, currentContent).map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`p-1.5 px-4 font-mono break-all ${
                            item.type === 'added' ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500/50' : 
                            item.type === 'removed' ? 'bg-rose-500/10 text-rose-400 border-l-4 border-rose-500/50 line-through' : 
                            'text-slate-400 opacity-60'
                          }`}
                        >
                          <span className="select-none inline-block w-4 mr-2 opacity-50">
                            {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                          </span>
                          {item.text || '\u00A0'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
