'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Book, Eye, Search, Clock, FileText, ChevronLeft } from 'lucide-react';
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { useAuthContext } from '@/app/context/AuthContext';
import ProtectedClient from '@/app/components/ProtectedClient';
import { toast } from 'sonner';

export default function StudentVaultPage() {
  const { user } = useAuthContext();
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        // Currently use the same assets endpoint, but UI will restrict actions
        const data = await vaultApi.getAssets();
        setAssets(Array.isArray(data) ? data : (data.assets || []));
      } catch (err) {
        console.error('Failed to fetch student vault assets', err);
        toast.error('Could not load your materials.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedClient roles={['student']}>
      <div className="container mx-auto py-12 px-6">
        <div className="mb-8">
          <a href="/students/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-2 mb-4 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </a>
          <h1 className="text-4xl font-black text-(--color-text-primary) flex items-center gap-4">
            <Shield className="text-indigo-500" size={36} />
            Study Vault
          </h1>
          <p className="text-text-secondary mt-2">Access all materials and manipulatives shared during your sessions.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all outline-hidden"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface rounded-3xl p-6 border border-border pb-8">
                <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4 animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-surface/50 border border-dashed border-border rounded-[3rem] text-text-secondary">
            <Book size={64} className="mb-6 opacity-20" />
            <p className="text-xl font-bold">No materials shared yet.</p>
            <p className="mt-2 text-sm max-w-md text-center">Your tutors will upload documents and PPTs here during or after your sessions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="group bg-surface rounded-3xl border border-border overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-video bg-indigo-50 dark:bg-indigo-500/5 flex items-center justify-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/10 shadow-lg flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                    {asset.file_type === 'PDF' ? <FileText size={32} /> : <Book size={32} />}
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                    {asset.file_type}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-black text-(--color-text-primary) mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {asset.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-6 min-h-[40px]">
                    {asset.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Clock size={14} />
                      {new Date(asset.created_at).toLocaleDateString()}
                    </div>
                    
                    <button 
                      onClick={() => toast.success('View mode coming in next update. Use in-session vault for now.')}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Eye size={14} />
                      View Only
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedClient>
  );
}
