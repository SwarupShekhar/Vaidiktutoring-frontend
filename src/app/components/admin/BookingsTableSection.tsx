import React, { useEffect, useState } from 'react';
import api from '@/app/lib/api';
import { format } from 'date-fns';
import { RefreshCw, Clock, User, BookOpen, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface Booking {
    id: string;
    student?: {
        first_name: string;
        last_name: string;
        email?: string;
        // Backend might send nested user with login name
        user?: { first_name: string; last_name: string; email?: string };
    };
    tutor?: { first_name: string; last_name: string };
    subject?: { name: string };
    curricula?: { name: string };
    requested_start: string;
    requested_end: string;
    start_time?: string;
    status: string;
    sessions?: any[];
}

// Safe formatting helper
const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString) return '-';
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return 'Invalid Date';
        return format(d, 'PP p');
    } catch {
        return 'Invalid Date';
    }
};

export default function BookingsTableSection() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<'all' | 'pending'>('pending');
    const [allocatingId, setAllocatingId] = useState<string | null>(null);


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch from new endpoint
                const res = await api.get(`/admin/bookings?page=${page}&limit=10`);
                // Handle different response structures gracefully
                const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch admin bookings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();

        const handleRefresh = () => fetchBookings();
        window.addEventListener('refresh-bookings-table', handleRefresh);
        
        return () => window.removeEventListener('refresh-bookings-table', handleRefresh);
    }, [page]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-(--color-text-primary)">
                    All Bookings & Allocations
                </h2>
                <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-xl hover:bg-white/10 text-text-secondary transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={18} />
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <button 
                    onClick={() => setFilter('all')} 
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-surface text-text-secondary hover:bg-surface/80'}`}
                >
                    All Bookings
                </button>
                <button 
                    onClick={() => setFilter('pending')} 
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-surface text-text-secondary hover:bg-surface/80'}`}
                >
                    Needs Allocation
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-text-secondary text-sm uppercase">
                            <th className="py-3 px-4">Student</th>
                            <th className="py-3 px-4">Grade</th>
                            <th className="py-3 px-4">Subject</th>
                            <th className="py-3 px-4 hidden md:table-cell">Curriculum</th>
                            <th className="py-3 px-4">Schedule</th>
                            <th className="py-3 px-4 hidden sm:table-cell">Duration</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Tutor</th>
                            <th className="py-3 px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" /></td>
                                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" /></td>
                                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                                </tr>
                            ))
                        ) : (() => {
                            const filteredBookings = filter === 'pending' 
                                ? bookings.filter(b => !b.tutor) 
                                : bookings;

                            if (filteredBookings.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan={9} className="py-8 text-center text-text-secondary">
                                            No bookings found.
                                        </td>
                                    </tr>
                                );
                            }

                            return filteredBookings.map((b) => {
                                const scheduleTime = b.start_time || b.requested_start;
                                const endTime = b.requested_end;
                                
                                let durationMin = 0;
                                if (scheduleTime && endTime) {
                                    const diffMs = new Date(endTime).getTime() - new Date(scheduleTime).getTime();
                                    durationMin = Math.round(diffMs / 60000);
                                }

                                return (
                                <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-(--color-text-primary)">
                                        {(() => {
                                            const fName = b.student?.user?.first_name || b.student?.first_name;
                                            const lName = b.student?.user?.last_name || b.student?.last_name;
                                            const email = b.student?.user?.email || b.student?.email;

                                            const isPlaceholder = (s: string | null | undefined) =>
                                                !s || s.toLowerCase() === 'new' || s.toLowerCase() === 'user' || s.toLowerCase() === 'student';

                                            const validFName = !isPlaceholder(fName) ? fName : '';
                                            const validLName = !isPlaceholder(lName) ? lName : '';

                                            if (validFName || validLName) return `${validFName || ''} ${validLName || ''}`.trim();
                                            if (email) return email.split('@')[0];
                                            return 'Student User';
                                        })()}
                                    </td>
                                    <td className="py-4 px-4 text-text-secondary">
                                        {/* Grade */}
                                        {/* @ts-ignore - safe optional checking */}
                                        {b.student?.grade || '-'}
                                    </td>
                                    <td className="py-4 px-4 text-(--color-text-primary)">
                                        {b.subject?.name || '-'}
                                    </td>
                                    <td className="py-4 px-4 text-text-secondary hidden md:table-cell">
                                        {b.curricula?.name || '-'}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-text-secondary">
                                        {safeFormatDate(scheduleTime)}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-text-secondary hidden sm:table-cell">
                                        {durationMin > 0 ? `${durationMin} mins` : '-'}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`text-xs font-bold uppercase ${b.status === 'confirmed' ? 'text-green-500' :
                                            b.status === 'completed' ? 'text-blue-500' :
                                                b.status === 'cancelled' ? 'text-red-500' :
                                                    'text-gray-500'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        {b.tutor ? (
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                                                {b.tutor.first_name} {b.tutor.last_name}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-bold">
                                                Unassigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                        {!b.tutor && (
                                            <button 
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                                                onClick={() => {
                                                    const evt = new CustomEvent('open-tutor-allocation', { detail: { booking: b } });
                                                    window.dispatchEvent(evt);
                                                }}
                                            >
                                                <User size={14} /> Assign
                                            </button>
                                        )}
                                        {b.sessions && b.sessions.length > 0 && b.status !== 'cancelled' && (
                                            <button 
                                                className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                                onClick={() => {
                                                    const evt = new CustomEvent('open-admin-session-summary', { detail: { sessionId: b.sessions![0].id } });
                                                    window.dispatchEvent(evt);
                                                }}
                                            >
                                                <BookOpen size={14} /> Summary
                                            </button>
                                        )}
                                        </div>
                                    </td>
                                </tr>
                            );
                            });
                        })()}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 rounded-lg border border-border disabled:opacity-50 text-sm"
                >
                    Previous
                </button>
                <div className="px-3 py-1 bg-surface rounded-lg text-sm">{page}</div>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 rounded-lg border border-border disabled:opacity-50 text-sm"
                >
                    Next
                </button>
            </div>

        </div >
    );
}
