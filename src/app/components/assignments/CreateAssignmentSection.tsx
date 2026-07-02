'use client';

import React, { useEffect, useState } from 'react';
import { vaultApi, VaultAsset } from '@/app/lib/vault';
import { getGradeOptions } from '@/app/lib/gradeTokens';
import { assignmentsApi } from '@/app/lib/assignments';
import { useAuthContext } from '@/app/context/AuthContext';
import { Plus, BookOpen, Loader2 } from 'lucide-react';

export default function CreateAssignmentSection() {
    const { user } = useAuthContext();
    const [assets, setAssets] = useState<VaultAsset[]>([]);
    const [curriculaOptions, setCurriculaOptions] = useState<{id: string, name: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        curriculum_id: '',
        grade: '',
        asset_id: '',
        due_date: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [assetsData, curriculaData] = await Promise.all([
                    vaultApi.getAssets(),
                    vaultApi.getCurricula()
                ]);
                // Filter to only show PDFs and Documents
                setAssets(assetsData.filter((a: VaultAsset) => a.file_type === 'PDF' || a.file_type === 'DOC'));
                setCurriculaOptions(curriculaData);
            } catch (err) {
                console.error('Failed to fetch data for assignments', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await assignmentsApi.createAssignment({
                ...form,
                due_date: form.due_date ? new Date(form.due_date).toISOString() : undefined
            });
            alert('Assignment created successfully!');
            setForm({
                title: '',
                description: '',
                curriculum_id: '',
                grade: '',
                asset_id: '',
                due_date: ''
            });
        } catch (error: any) {
            console.error('Failed to create assignment', error);
            alert('Error creating assignment: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center p-12 text-text-secondary"><Loader2 className="animate-spin" size={32} /></div>;
    }

    return (
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-(--color-text-primary)">Create New Assignment</h2>
                    <p className="text-sm text-text-secondary">Assign a document from the vault to a specific grade and curriculum.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Assignment Title</label>
                        <input 
                            required
                            className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all"
                            placeholder="e.g. Weekly Math Worksheet 1"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Due Date (Optional)</label>
                        <input 
                            type="datetime-local"
                            className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all text-(--color-text-primary)"
                            value={form.due_date}
                            onChange={e => setForm({...form, due_date: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Instructions / Description</label>
                    <textarea 
                        className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all h-24 resize-none"
                        placeholder="Provide any specific instructions for the students..."
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Curriculum</label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all text-(--color-text-primary)"
                            value={form.curriculum_id}
                            onChange={e => setForm({...form, curriculum_id: e.target.value, grade: ''})}
                        >
                            <option value="" disabled>Select Curriculum...</option>
                            {curriculaOptions.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Grade</label>
                        <select 
                            required
                            disabled={!form.curriculum_id}
                            className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all text-(--color-text-primary) disabled:opacity-50"
                            value={form.grade}
                            onChange={e => setForm({...form, grade: e.target.value})}
                        >
                            <option value="" disabled>Select Grade...</option>
                            {getGradeOptions(form.curriculum_id).map(g => (
                                <option key={g.value} value={g.value}>{g.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary">Select Vault Asset (Worksheet)</label>
                    <select 
                        required
                        className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all text-(--color-text-primary)"
                        value={form.asset_id}
                        onChange={e => setForm({...form, asset_id: e.target.value})}
                    >
                        <option value="" disabled>Select Document...</option>
                        {assets.map(a => (
                            <option key={a.id} value={a.id}>{a.title} ({a.file_type})</option>
                        ))}
                    </select>
                    {assets.length === 0 && (
                        <p className="text-xs text-rose-500 mt-1">No PDF documents found in Vault. Upload one first.</p>
                    )}
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit"
                        disabled={submitting || !form.curriculum_id || !form.grade || !form.asset_id}
                        className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/25"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        Publish Assignment
                    </button>
                </div>
            </form>
        </div>
    );
}
