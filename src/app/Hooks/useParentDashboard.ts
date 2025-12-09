
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useParentDashboard() {
    const { data: studentCount, isLoading: loadingStudents, error: studentsError } = useQuery({
        queryKey: ['parent-students-count'],
        queryFn: async () => {
            const res = await api.get('/students/parent');
            return Array.isArray(res) ? res.length : 0;
        }
    });

    const { data: upcomingSessions, isLoading: loadingSessions, error: sessionsError } = useQuery({
        queryKey: ['parent-upcoming-sessions'],
        queryFn: async () => {
            const res = await api.get('/bookings/parent');
            return Array.isArray(res) ? res : [];
        }
    });

    // Fetch full student list for the "My Children" column
    const { data: students, isLoading: loadingStudentList } = useQuery({
        queryKey: ['parent-students-list'],
        queryFn: async () => {
            const res = await api.get('/students/parent');
            return Array.isArray(res) ? res : [];
        }
    });

    return {
        studentCount: studentCount || 0,
        loadingStudents,
        studentsError,
        upcomingSessions: upcomingSessions?.slice(0, 5) || [], // Limit to 5
        loadingSessions,
        sessionsError,
        students: students || [],
        loadingStudentList
    };
}
