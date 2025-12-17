
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useTutorDashboard() {
    // Fetch tutor's assigned bookings
    const { data: bookings, isLoading: loadingBookings, error: bookingsError } = useQuery({
        queryKey: ['tutor-bookings'],
        queryFn: async () => {
            const res = await api.get('/tutor/bookings');
            console.log('[useTutorDashboard] Raw bookings response:', res.data);
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

    // Helper function to extract date from booking
    const getBookingDate = (booking: any): Date | null => {
        // Try multiple possible date fields
        const dateValue = booking.start_time || booking.requested_start || booking.date || booking.created_at;
        if (!dateValue) return null;

        try {
            return new Date(dateValue);
        } catch {
            return null;
        }
    };

    // Get today's date range (start and end of day in local time)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    console.log('[useTutorDashboard] Today range:', { todayStart, todayEnd });
    console.log('[useTutorDashboard] All bookings:', bookings);

    const todaySessions = bookings?.filter((b: any) => {
        const bookingDate = getBookingDate(b);
        if (!bookingDate) {
            console.log('[useTutorDashboard] Booking has no valid date:', b);
            return false;
        }

        const isToday = bookingDate >= todayStart && bookingDate <= todayEnd;

        // STRICT FILTER: Hide sessions that have already ended
        const now = new Date();
        const endStr = b.end_time || b.requested_end;
        // If end time is missing, assume 1 hour duration from start
        const sessionEnd = endStr
            ? new Date(endStr)
            : new Date(bookingDate.getTime() + 60 * 60 * 1000);

        const hasNotEnded = sessionEnd > now;

        console.log('[useTutorDashboard] Checking booking:', {
            id: b.id,
            date: bookingDate,
            sessionEnd,
            isToday,
            hasNotEnded,
            subject: b.subject_name || b.subject?.name
        });

        return isToday && hasNotEnded;
    }) || [];

    const upcomingBookings = bookings?.filter((b: any) => {
        const bookingDate = getBookingDate(b);
        if (!bookingDate) return false;

        // Upcoming = future dates (not today)
        return bookingDate > todayEnd;
    }) || [];

    console.log('[useTutorDashboard] Filtered results:', {
        todayCount: todaySessions.length,
        upcomingCount: upcomingBookings.length,
        totalCount: bookings?.length || 0
    });

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

