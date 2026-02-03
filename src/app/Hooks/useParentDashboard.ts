
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';

export function useParentDashboard() {
    const { user } = useAuthContext();
    const userId = user?.id;

    const { data: upcomingSessions, isLoading: loadingSessions, error: sessionsError } = useQuery({
        queryKey: ['parent-upcoming-sessions', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get('/bookings/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            return data;
        },
        enabled: !!userId
    });

    // Fetch full student list for the "My Children" column
    const { data: students, isLoading: loadingStudentList, error: studentsError } = useQuery({
        queryKey: ['parent-students-list', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get('/students/parent');
            const data = Array.isArray(res.data) ? res.data : [];
            return data;
        },
        enabled: !!userId
    });

    const allSessions = Array.isArray(upcomingSessions) ? upcomingSessions : [];

    const now = new Date();
    const sorted = [...allSessions].sort((a, b) => new Date(a.requested_start).getTime() - new Date(b.requested_start).getTime());

    const upcoming = sorted.filter(s => new Date(s.requested_end) > now);
    const past = sorted.filter(s => new Date(s.requested_end) <= now).reverse();

    return {
        studentCount: students?.length || 0,
        loadingStudents: loadingStudentList,
        studentsError,
        upcomingSessions: upcoming,
        pastSessions: past,
        allSessions: sorted,
        loadingSessions,
        sessionsError,
        students: students || [],
        loadingStudentList
    };
}
