'use client';

import React, { useEffect, useState } from 'react';
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { getGradeOptions } from '@/app/lib/gradeTokens';
import { format } from 'date-fns';
import { RefreshCw, Plus, FileText, Download, Shield, Trash2, Loader2, UploadCloud } from 'lucide-react';
import { useAuthContext } from '@/app/context/AuthContext';

export default function VaultManagementSection() {
    const { user } = useAuthContext();
    const [assets, setAssets] = useState<VaultAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    
    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        file_type: 'PDF',
        curriculum_id: '',
        grade: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [curriculaOptions, setCurriculaOptions] = useState<{id: string, name: string}[]>([]);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const data = await vaultApi.getAssets();
            setAssets(data);
        } catch (error) {
            console.error('Failed to fetch vault assets', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurricula = async () => {
        try {
            const data = await vaultApi.getCurricula();
            setCurriculaOptions(data);
        } catch (error) {
            console.error('Failed to fetch curricula', error);
        }
    };

    useEffect(() => {
        fetchAssets();
        fetchCurricula();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile);
            if (uploadForm.file_type === 'QUESTION_BANK') {
                formData.append('curriculum_id', uploadForm.curriculum_id);
                formData.append('grade', uploadForm.grade);
                const res = await vaultApi.uploadPracticeSet(formData);
                alert(`Successfully ingested ${res.count} questions to the database!`);
            } else {
                formData.append('title', uploadForm.title);
                formData.append('description', uploadForm.description);
                formData.append('file_type', uploadForm.file_type);
                if (user?.userId) formData.append('uploaded_by', user.userId);

                await vaultApi.upload(formData);
                alert('Asset uploaded successfully to the Vault!');
            }
            
            setShowUploadModal(false);
            setSelectedFile(null);
            setUploadForm({ title: '', description: '', file_type: 'PDF', curriculum_id: '', grade: '' });
            fetchAssets();
        } catch (error: any) {
            console.error('Upload failed', error);
            alert('Failed to upload: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-(--color-text-primary) flex items-center gap-2">
                        {user?.role === 'admin' ? 'Admin Asset Vault' : 'Curriculum Asset Vault'}
                    </h2>
                    <p className="text-sm text-text-secondary">Secure storage for session materials and clean documents.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchAssets}
                        className="p-2 rounded-xl hover:bg-white/10 text-text-secondary transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={18} />
                    </button>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Upload to Vault
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-2" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-4" />
                            <div className="flex justify-between mt-auto pt-4 border-t border-border">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
                            </div>
                        </div>
                    ))
                ) : assets.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-surface/50 border border-dashed border-border rounded-3xl text-text-secondary">
                        <UploadCloud size={48} className="mb-4 opacity-20" />
                        <p>No assets in the vault yet.</p>
                        {user?.role === 'admin' && (
                            <button 
                                onClick={() => setShowUploadModal(true)}
                                className="text-indigo-500 hover:underline mt-2"
                            >
                                Upload your first material
                            </button>
                        )}
                    </div>
                ) : (
                    assets.map((asset) => (
                        <div key={asset.id} className="bg-surface border border-border rounded-2xl p-6 hover:shadow-xl hover:border-indigo-500/30 transition-all group flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${asset.file_type === 'PDF' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                    <FileText size={24} />
                                </div>
                                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-surface-secondary border border-border rounded-lg text-text-secondary">
                                    {asset.file_type}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-lg text-(--color-text-primary) mb-1 line-clamp-1">{asset.title}</h3>
                            <p className="text-sm text-text-secondary mb-4 line-clamp-2 h-10">{asset.description || 'No description provided.'}</p>
                            
                            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-[11px] text-text-secondary">
                                <span>{format(new Date(asset.created_at), 'MMM d, yyyy')}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-indigo-500 transition-colors">
                                        <Download size={14} />
                                    </button>
                                    {user?.role === 'admin' && (
                                        <button className="p-1.5 hover:bg-rose-500/10 rounded-lg text-text-secondary hover:text-rose-500 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-surface border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border bg-linear-to-r from-indigo-500/10 to-blue-500/10">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <UploadCloud size={24} className="text-indigo-500" />
                                Add to Vault
                            </h3>
                            <p className="text-sm text-text-secondary mt-1">Upload a PDF, PPT, or an Excel Question Bank.</p>
                        </div>
                        
                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary">Asset Title</label>
                                <input 
                                    required
                                    className="w-full px-4 py-2.5 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                                    placeholder="e.g. Algebra Basics Phase 1"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary">Description (Optional)</label>
                                <textarea 
                                    className="w-full px-4 py-2 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all h-20 resize-none"
                                    placeholder="What's this document for?"
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                                />
                            </div>

                            {uploadForm.file_type === 'QUESTION_BANK' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-text-secondary">Curriculum</label>
                                        <select 
                                            required
                                            className="w-full px-4 py-2.5 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                                            value={uploadForm.curriculum_id}
                                            onChange={(e) => setUploadForm({...uploadForm, curriculum_id: e.target.value})}
                                        >
                                            <option value="" disabled>Select Curriculum...</option>
                                            {curriculaOptions.map(c => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-text-secondary">Grade Level</label>
                                        <select 
                                            required
                                            disabled={!uploadForm.curriculum_id}
                                            className="w-full px-4 py-2.5 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all disabled:opacity-50"
                                            value={uploadForm.grade}
                                            onChange={(e) => setUploadForm({...uploadForm, grade: e.target.value})}
                                        >
                                            <option value="" disabled>Select Grade...</option>
                                            {getGradeOptions(uploadForm.curriculum_id).map(g => (
                                                <option key={g.value} value={g.value}>{g.label} ({g.value})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary">Format</label>
                                    <select 
                                        className="w-full px-4 py-2 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                                        value={uploadForm.file_type}
                                        onChange={(e) => setUploadForm({...uploadForm, file_type: e.target.value})}
                                    >
                                        <option value="PDF">PDF Document</option>
                                        <option value="PPT">PowerPoint</option>
                                        <option value="QUESTION_BANK">Excel (Question Bank)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary">Select File</label>
                                    <div className="relative cursor-pointer">
                                        <input 
                                            type="file" 
                                            accept={uploadForm.file_type === 'QUESTION_BANK' ? ".xlsx,.xls,.csv" : ".pdf,.pptx,.ppt"}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />
                                        <div className="px-4 py-2 bg-secondary/20 border border-border rounded-xl text-center text-xs truncate">
                                            {selectedFile ? selectedFile.name : 'Choose file...'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-border rounded-xl font-bold text-sm hover:bg-surface-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={uploading || !selectedFile}
                                    className="flex-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Uploading...
                                        </>
                                    ) : 'Complete Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

