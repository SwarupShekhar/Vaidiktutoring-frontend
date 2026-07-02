import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';
import type { ProgressSummary } from './useStudentProgress';
import type { CreditStatus } from '@/app/types/credits';

export type ParentDashboardStudent = {
    id: string;
    first_name?: string;
    last_name?: string;
    grade?: string;
    gender?: string;
};

export type PendingRating = {
    sessionId: string;
    tutorId: string;
    tutorName: string;
    studentName?: string;
    sessionDate: string | null;
    subjectName: string;
};

export type ParentDashboardSession = {
    id: string;
    student_id?: string;
    requested_start: string;
    requested_end: string;
    subject?: { name?: string };
    subjects?: { name?: string };
    tutors?: { users?: { first_name?: string; last_name?: string } };
    students?: { id?: string; first_name?: string; last_name?: string };
    sessions?: Array<{
        id: string;
        duration?: number;
        tutor_note?: string | null;
        whiteboard_snapshot_url?: string | null;
        session_recordings?: Array<{ file_url?: string | null }>;
        sticker_rewards?: Array<{ id: string; sticker: string }>;
    }>;
};

type ParentDashboardSummary = {
    students: ParentDashboardStudent[];
    bookings: ParentDashboardSession[];
    pendingRatings: PendingRating[];
    childSummaries: Record<string, ProgressSummary | null>;
    // Per-child credit/trial status (same shape as the student's credit status).
    childCredits: Record<string, CreditStatus | null>;
};

export function useParentDashboard() {
    const { user, loading: authLoading } = useAuthContext();
    const userId = user?.id;

    const { data, isLoading, error, refetch } = useQuery<ParentDashboardSummary>({
        queryKey: ['parent-dashboard-summary', userId],
        queryFn: async () => {
            const res = await api.get('/parent/dashboard-summary');
            return {
                students: Array.isArray(res.data?.students) ? res.data.students : [],
                bookings: Array.isArray(res.data?.bookings) ? res.data.bookings : [],
                pendingRatings: Array.isArray(res.data?.pendingRatings) ? res.data.pendingRatings : [],
                childSummaries: res.data?.childSummaries || {},
                childCredits: res.data?.childCredits || {},
            };
        },
        enabled: !!userId && !authLoading,
        staleTime: 60_000,
        refetchInterval: 120_000,
    });

    const students = data?.students || [];

    const { upcoming, past, sorted } = useMemo(() => {
        const now = new Date();
        const sessions = data?.bookings || [];
        const sortedSessions = [...sessions].sort(
            (a, b) => new Date(a.requested_start).getTime() - new Date(b.requested_start).getTime(),
        );

        return {
            sorted: sortedSessions,
            upcoming: sortedSessions.filter(s => new Date(s.requested_end) > now),
            past: sortedSessions.filter(s => new Date(s.requested_end) <= now).reverse(),
        };
    }, [data?.bookings]);

    const loading = isLoading || authLoading;

    return {
        studentCount: students.length,
        loadingStudents: loading,
        studentsError: error,
        upcomingSessions: upcoming,
        pastSessions: past,
        allSessions: sorted,
        loadingSessions: loading,
        sessionsError: error,
        students,
        loadingStudentList: loading,
        childSummaries: data?.childSummaries || {},
        childCredits: data?.childCredits || {},
        pendingRatings: data?.pendingRatings || [],
        refetch,
    };
}
