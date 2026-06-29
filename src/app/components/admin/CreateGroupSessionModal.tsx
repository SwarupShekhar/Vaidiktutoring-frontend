import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Users, UserCheck, RefreshCw } from 'lucide-react';
import api from '@/app/lib/api';
import { toast } from 'sonner';

interface CreateGroupSessionModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CreateGroupSessionModal({ onClose, onSuccess }: CreateGroupSessionModalProps) {
    const [tutors, setTutors] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    
    const [selectedTutor, setSelectedTutor] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('60');
    const [provider, setProvider] = useState<'ZOOM' | 'DAILYCO'>('ZOOM');
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all active tutors
        api.get('/admin/tutors?status=active')
            .then(res => setTutors(Array.isArray(res.data) ? res.data : res.data.data || []))
            .catch(err => console.error('Failed to fetch tutors', err));
        
        // Fetch students
        api.get('/admin/students')
            .then(res => setStudents(Array.isArray(res.data) ? res.data : res.data.data || []))
            .catch(err => console.error('Failed to fetch students', err));
    }, []);

    const toggleStudent = (studentId: string) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedTutor) return toast.error("Please select a tutor.");
        if (selectedStudents.length === 0) return toast.error("Please select at least one student.");
        if (!startTime) return toast.error("Please select a start time.");
        
        setLoading(true);
        try {
            const start = new Date(startTime);
            const end = new Date(start.getTime() + parseInt(duration) * 60000);
            
            await api.post('/admin/group-sessions', {
                tutorId: selectedTutor,
                studentIds: selectedStudents,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                provider,
            });
            
            toast.success("Group Session Created Successfully!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create group session.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1A1C23] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Schedule Group Session</h2>
                            <p className="text-sm text-gray-400">Create a session for multiple students</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <form id="groupSessionForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Provider Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300">Video Provider</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${provider === 'ZOOM' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}>
                                    <input type="radio" name="provider" className="hidden" checked={provider === 'ZOOM'} onChange={() => setProvider('ZOOM')} />
                                    <Video size={18} />
                                    <span className="font-medium">Zoom Meeting</span>
                                </label>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${provider === 'DAILYCO' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}>
                                    <input type="radio" name="provider" className="hidden" checked={provider === 'DAILYCO'} onChange={() => setProvider('DAILYCO')} />
                                    <Video size={18} />
                                    <span className="font-medium">Daily.co (Native)</span>
                                </label>
                            </div>
                        </div>

                        {/* Timing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" /> Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                    <Clock size={16} className="text-gray-400" /> Duration (mins)
                                </label>
                                <select 
                                    value={duration} 
                                    onChange={e => setDuration(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                    <option value="120">120 minutes</option>
                                </select>
                            </div>
                        </div>

                        {/* Tutor Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <UserCheck size={16} className="text-gray-400" /> Assign Tutor
                            </label>
                            <select
                                required
                                value={selectedTutor}
                                onChange={e => setSelectedTutor(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            >
                                <option value="">Select a tutor...</option>
                                {tutors.map(tutor => (
                                    <option key={tutor.id} value={tutor.id}>
                                        {tutor.first_name} {tutor.last_name} ({tutor.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Students Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <Users size={16} className="text-gray-400" /> Select Students
                                </div>
                                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                                    {selectedStudents.length} selected
                                </span>
                            </label>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2 max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                                {students.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500">Loading students...</div>
                                ) : (
                                    students.map(student => (
                                        <label key={student.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedStudents.includes(student.id)}
                                                onChange={() => toggleStudent(student.id)}
                                                className="w-4 h-4 rounded border-white/20 bg-black/20 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                                                    {student.first_name} {student.last_name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {student.student_email || student.parent?.email}
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        form="groupSessionForm"
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Schedule Session'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
