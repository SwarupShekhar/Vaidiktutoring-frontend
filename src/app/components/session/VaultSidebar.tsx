'use client';

import React, { useEffect, useState } from 'react';
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { Search, FileText, Check, Loader2, ShieldCheck, Info } from 'lucide-react';

interface VaultSidebarProps {
  onSelectAsset: (asset: VaultAsset) => void;
  selectedAssetId?: string;
  currentSubject?: string;
}

export default function VaultSidebar({ onSelectAsset, selectedAssetId, currentSubject }: VaultSidebarProps) {
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await vaultApi.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch session materials from vault', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-surface border-l border-border select-none">
      <div className="p-4 border-b border-border bg-linear-to-b from-indigo-500/5 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-500 uppercase tracking-wider">
            <ShieldCheck size={16} />
            Safe Vault Materials
          </h3>
          <button 
            onClick={fetchAssets}
            disabled={loading}
            className="p-1 hover:bg-indigo-500/10 rounded-lg text-indigo-500 transition-all active:rotate-180 disabled:opacity-50"
            title="Refresh vault"
          >
            <Loader2 size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        <p className="text-[10px] text-text-secondary mt-1">Admin-approved session assets.</p>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
          <input 
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 outline-hidden transition-all"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-secondary">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-[10px]">Accessing Vault...</span>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-12 text-text-secondary flex flex-col items-center gap-2">
            <Info size={20} className="opacity-20" />
            <span className="text-[10px]">No materials found.</span>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredAssets
              .sort((a, b) => {
                // Highlight current subject matches
                if (currentSubject) {
                  const aMatch = a.title.toLowerCase().includes(currentSubject.toLowerCase());
                  const bMatch = b.title.toLowerCase().includes(currentSubject.toLowerCase());
                  if (aMatch && !bMatch) return -1;
                  if (!aMatch && bMatch) return 1;
                }
                return 0;
              })
              .map((asset) => {
                const isSubjectMatch = currentSubject && (
                  asset.title.toLowerCase().includes(currentSubject.toLowerCase()) ||
                  asset.description?.toLowerCase().includes(currentSubject.toLowerCase())
                );

                return (
                  <button
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className={`w-full group text-left p-3 rounded-xl border transition-all flex items-start gap-3 relative overflow-hidden ${
                      selectedAssetId === asset.id 
                        ? 'bg-indigo-500/10 border-indigo-500/30' 
                        : 'bg-transparent border-transparent hover:bg-surface-secondary hover:border-border'
                    }`}
                  >
                    {isSubjectMatch && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-bl-lg" />
                    )}
                <div className={`mt-0.5 p-2 rounded-lg ${
                  asset.file_type === 'PDF' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  <FileText size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-text-primary truncate">{asset.title}</span>
                    {selectedAssetId === asset.id && <Check size={14} className="text-indigo-500 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">{asset.description || 'No description'}</p>
                </div>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      <div className="p-3 bg-surface-secondary/50 border-t border-border mt-auto">
        <div className="bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
          <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-tight block mb-1">Collaborative Annotation</span>
          <p className="text-[9px] text-text-secondary italic">Annotations made here are session-specific and will not affect the clean original document.</p>
        </div>
      </div>
    </div>
  );
}
