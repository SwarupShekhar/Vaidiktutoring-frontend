'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, AlertCircle } from 'lucide-react';
import { api } from '@/app/lib/api';
import { useRouter } from 'next/navigation';

interface EditStudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any; // The student object
    onUpdate?: () => void; // Callback to refresh data
}

interface ProfileForm {
    interests: string;
    recent_focus: string;
    struggle_areas: string;
}

export const EditStudentProfileModal: React.FC<EditStudentProfileModalProps> = ({ isOpen, onClose, student, onUpdate }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileForm>();
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        if (student) {
            reset({
                interests: Array.isArray(student.interests) ? student.interests.join(', ') : '',
                recent_focus: student.recent_focus || '',
                struggle_areas: Array.isArray(student.struggle_areas) ? student.struggle_areas.join(', ') : '',
            });
        }
    }, [student, reset]);

    const onSubmit = async (data: ProfileForm) => {
        setError(null);
        try {
            // Parse comma-separated strings back to arrays
            const payload = {
                interests: data.interests.split(',').map(s => s.trim()).filter(Boolean),
                recent_focus: data.recent_focus,
                struggle_areas: data.struggle_areas.split(',').map(s => s.trim()).filter(Boolean),
            };

            await api.patch(`/students/${student.id}`, payload);

            if (onUpdate) onUpdate();
            onClose();
            router.refresh(); // Refresh server components if any
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/10">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Update Your Profile</h2>
                        <p className="text-xs text-gray-500 max-w-[280px]">Help your tutors understand you better by keeping this updated!</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Interests */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                Interests & Hobbies
                            </label>
                            <input
                                {...register('interests')}
                                type="text"
                                placeholder="e.g. Space, Dinosaurs, Minecraft, Drawing"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black transition-all outline-none font-medium"
                            />
                            <p className="text-[10px] text-gray-400 mt-1 pl-1">Separate with commas</p>
                        </div>

                        {/* Recent Focus */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                Current Learning Focus
                            </label>
                            <input
                                {...register('recent_focus')}
                                type="text"
                                placeholder="e.g. Fractions, Essay Writing, Photosynthesis"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black transition-all outline-none font-medium"
                            />
                        </div>

                        {/* Struggle Areas */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                                Challenges / Things to work on
                            </label>
                            <textarea
                                {...register('struggle_areas')}
                                rows={3}
                                placeholder="e.g. I get stuck on word problems, I confuse 'their' and 'there'"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-black transition-all outline-none font-medium resize-none"
                            />
                            <p className="text-[10px] text-gray-400 mt-1 pl-1">Separate specific items with commas</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] px-4 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Profile
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
