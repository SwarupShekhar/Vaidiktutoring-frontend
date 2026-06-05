'use client';

import React, { useEffect, useState } from 'react';
import ProtectedClient from '@/app/components/ProtectedClient';
import api from '@/app/lib/api';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/leads');
            setLeads(res.data || []);
        } catch (e) {
            console.error('Failed to fetch leads', e);
            toast.error('Failed to load leads data');
        } finally {
            setLoading(false);
        }
    };

    const exportCsv = () => {
        if (leads.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Email,Source,Captured At\n"
            + leads.map(l => `${l.id},${l.email},${l.source},${new Date(l.created_at).toLocaleString()}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `studyhours_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <ProtectedClient roles={['admin']}>
            <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700 text-(--color-text-primary)">
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Marketing</p>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Captured Leads</h1>
                        </div>
                    </div>

                    <button 
                        onClick={exportCsv}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>

                <div className="bg-glass dark:bg-slate-900 rounded-4xl p-8 border border-border dark:border-white/5 shadow-sm">
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="w-8 h-8 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="text-center p-12 text-slate-500 dark:text-white/40">
                            <Mail size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-bold">No leads captured yet</p>
                            <p className="text-sm">When users submit the hitlist form, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border dark:border-white/5">
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">Email</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">Source</th>
                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40">Captured At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-border dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                        <Mail size={14} />
                                                    </div>
                                                    <span className="font-bold text-sm text-(--color-text-primary) dark:text-white">{lead.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                                                    {lead.source}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm text-slate-500 dark:text-white/60">
                                                    {new Date(lead.created_at).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </ProtectedClient>
    );
}
