
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTutorDashboard() {
    // Fetch tutor's assigned bookings
    const { data: bookings, isLoading: loadingBookings, error: bookingsError } = useQuery({
        queryKey: ['tutor-bookings'],
        queryFn: async () => {
            const res = await api.get('/tutor/bookings');
            return Array.isArray(res.data) ? res.data : [];
        }
    });

    // Fetch AVAILABLE (unclaimed) bookings matching tutor's subjects
    const { data: availableJobs, isLoading: loadingAvailable } = useQuery({
        queryKey: ['tutor-available-jobs'],
        queryFn: async () => {
            try {
                const res = await api.get('/bookings/available');
                return Array.isArray(res.data) ? res.data : [];
            } catch (e) {
                // Endpoint may not exist yet, gracefully return empty
                console.warn('Available jobs endpoint not ready', e);
                return [];
            }
        },
        refetchInterval: 30000, // Poll every 30 seconds for new jobs
    });

    // Calculate stats and filtered lists locally for now
    const today = new Date().toDateString();

    const todaySessions = bookings?.filter((b: any) => {
        const bookingDate = new Date(b.date || b.start_time).toDateString();
        return bookingDate === today;
    }) || [];

    const upcomingBookings = bookings?.filter((b: any) => {
        const bookingDate = new Date(b.date || b.start_time);
        return bookingDate > new Date() && b.status === 'confirmed';
    }) || [];


    return {
        todaySessions,
        upcomingBookings,
        availableJobs: availableJobs || [],
        stats: {
            todayCount: todaySessions.length,
            weekCount: bookings?.length || 0,
            availableCount: availableJobs?.length || 0
        },
        loading: loadingBookings || loadingAvailable,
        error: bookingsError
    };
}

