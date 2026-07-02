'use client';

import React, { useEffect, useState } from 'react';
import { assignmentsApi, Assignment, Submission } from '@/app/lib/assignments';
import { useAuthContext } from '@/app/context/AuthContext';
import { FileText, Upload, CheckCircle, Clock, Search, Loader2 } from 'lucide-react';
import { useIsAppShell } from '@/app/Hooks/useIsAppShell';
import {
    AppCard,
    AppPillButton,
    AppEmptyState,
    AppSkeletonCard,
    accentRgb,
} from '@/app/components/app-shell/ui';

export default function StudentAssignmentsList() {
    const isAppShell = useIsAppShell();
    const { user } = useAuthContext();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchAssignments();
        }
    }, [user?.id]);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const data = await assignmentsApi.getAssignments({ user_id: user!.id });
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch assignments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (assignmentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(assignmentId);
            
            // Pass the actual file to the API instead of a dummy string
            await assignmentsApi.submitAssignment(assignmentId, file);
            
            // Refresh list to show new submission
            await fetchAssignments();
        } catch (error) {
            console.error('Failed to submit assignment', error);
            alert('Failed to submit assignment');
        } finally {
            setUploading(null);
            if (event.target) event.target.value = '';
        }
    };

    const getStatusInfo = (submission?: Submission) => {
        if (!submission) {
            return {
                label: 'Pending',
                color: 'text-amber-500',
                bg: 'bg-amber-500/10',
                icon: Clock
            };
        }
        if (submission.graded_at) {
            return {
                label: `Graded: ${submission.score}/100`,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10',
                icon: CheckCircle
            };
        }
        return {
            label: 'Submitted',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            icon: Upload
        };
    };

    if (loading) {
        if (isAppShell) {
            return (
                <div className="space-y-4">
                    {[0, 1, 2].map(i => (
                        <AppSkeletonCard key={i} />
                    ))}
                </div>
            );
        }
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    if (assignments.length === 0) {
        if (isAppShell) {
            return (
                <AppEmptyState
                    icon={Search}
                    accent="amber"
                    title="No Assignments Yet"
                    description="When your tutor creates assignments for your curriculum and grade, they will appear here."
                />
            );
        }
        return (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-indigo-500" size={24} />
                </div>
                <h3 className="text-xl font-black text-(--color-text-primary) mb-2">No Assignments Yet</h3>
                <p className="text-text-secondary max-w-md mx-auto">
                    When your tutor creates assignments for your curriculum and grade, they will appear here.
                </p>
            </div>
        );
    }

    if (isAppShell) {
        return (
            <div className="space-y-4">
                {assignments.map(assignment => {
                    const submission = assignment.submissions?.[0];
                    const status = getStatusInfo(submission);
                    const StatusIcon = status.icon;

                    return (
                        <AppCard key={assignment.id} accent="amber">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div
                                        className="p-3 rounded-xl shrink-0"
                                        style={{ background: accentRgb('amber', 0.12), color: accentRgb('amber') }}
                                    >
                                        <FileText size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-white mb-1">{assignment.title}</h3>
                                        {assignment.description && (
                                            <p className="text-sm text-white/60 mb-3 line-clamp-2">{assignment.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.color}`}>
                                                <StatusIcon size={12} />
                                                {status.label}
                                            </span>
                                            {assignment.due_date && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 text-white/45">
                                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    {assignment.vault_assets && (
                                        <AppPillButton
                                            accent="amber"
                                            variant="soft"
                                            className="w-full"
                                            onClick={() => {
                                                if (assignment.vault_assets?.sasUrl) {
                                                    window.open(assignment.vault_assets.sasUrl, '_blank');
                                                } else {
                                                    alert('Worksheet file is currently unavailable.');
                                                }
                                            }}
                                        >
                                            <FileText size={16} />
                                            View Worksheet
                                        </AppPillButton>
                                    )}

                                    {submission && submission.sasUrl && (
                                        <AppPillButton
                                            accent="amber"
                                            variant="ghost"
                                            className="w-full"
                                            onClick={() => {
                                                window.open(submission.sasUrl, '_blank');
                                            }}
                                        >
                                            <FileText size={16} />
                                            View My Submission
                                        </AppPillButton>
                                    )}

                                    {!submission?.graded_at && (
                                        <div className="relative">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                onChange={(e) => handleUpload(assignment.id, e)}
                                                disabled={uploading === assignment.id}
                                            />
                                            <AppPillButton
                                                accent="amber"
                                                variant={submission ? 'soft' : 'solid'}
                                                className="w-full"
                                                disabled={uploading === assignment.id}
                                            >
                                                {uploading === assignment.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                {submission ? 'Resubmit Homework' : 'Submit Homework'}
                                            </AppPillButton>
                                        </div>
                                    )}

                                    {submission?.feedback && (
                                        <div
                                            className="w-full p-3 rounded-xl text-xs"
                                            style={{
                                                background: accentRgb('emerald', 0.1),
                                                border: `1px solid ${accentRgb('emerald', 0.22)}`,
                                                color: accentRgb('emerald'),
                                            }}
                                        >
                                            <span className="font-bold block mb-1">Tutor Feedback:</span>
                                            {submission.feedback}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AppCard>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {assignments.map(assignment => {
                const submission = assignment.submissions?.[0];
                const status = getStatusInfo(submission);
                const StatusIcon = status.icon;

                return (
                    <div key={assignment.id} className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-(--color-text-primary) mb-1">{assignment.title}</h3>
                                    {assignment.description && (
                                        <p className="text-sm text-text-secondary mb-3 line-clamp-2">{assignment.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.color}`}>
                                            <StatusIcon size={12} />
                                            {status.label}
                                        </span>
                                        {assignment.due_date && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40">
                                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 min-w-[200px]">
                                {assignment.vault_assets && (
                                    <button 
                                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-(--color-text-primary) font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                        onClick={() => {
                                            if (assignment.vault_assets?.sasUrl) {
                                                window.open(assignment.vault_assets.sasUrl, '_blank');
                                            } else {
                                                alert('Worksheet file is currently unavailable.');
                                            }
                                        }}
                                    >
                                        <FileText size={16} />
                                        View Worksheet
                                    </button>
                                )}

                                {submission && submission.sasUrl && (
                                    <button 
                                        className="w-full px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                                        onClick={() => {
                                            window.open(submission.sasUrl, '_blank');
                                        }}
                                    >
                                        <FileText size={16} />
                                        View My Submission
                                    </button>
                                )}

                                {!submission?.graded_at && (
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleUpload(assignment.id, e)}
                                            disabled={uploading === assignment.id}
                                        />
                                        <button 
                                            className={`w-full px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${
                                                submission ? 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20' : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                            }`}
                                        >
                                            {uploading === assignment.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Upload size={16} />
                                            )}
                                            {submission ? 'Resubmit Homework' : 'Submit Homework'}
                                        </button>
                                    </div>
                                )}

                                {submission?.feedback && (
                                    <div className="w-full p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 dark:text-emerald-400">
                                        <span className="font-bold block mb-1">Tutor Feedback:</span>
                                        {submission.feedback}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
