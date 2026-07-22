import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthContext } from '../context/AuthContext';

type TutorBooking = {
    id: string;
    start_time?: string;
    end_time?: string;
    requested_start?: string;
    requested_end?: string;
    date?: string;
};

export function useTutorDashboard() {
    const { user, loading: authLoading } = useAuthContext();
    const isReady = !!user && !authLoading;

    // Fetch tutor's assigned bookings
    const { data: bookings, isLoading: loadingBookings, error: bookingsError, refetch: refetchBookings } = useQuery({
        queryKey: ['tutor-bookings', user?.id],
        queryFn: async () => {
            const res = await api.get('/tutor/bookings');
            return Array.isArray(res.data) ? res.data : [];
        },
        enabled: isReady,
        staleTime: 30_000,
        refetchInterval: 30_000, // Keep dashboard fresh without constant request churn
    });

    // Fetch REAL-TIME Stats from backend
    const { data: backendStats, isLoading: loadingStats } = useQuery({
        queryKey: ['tutor-stats', user?.id],
        queryFn: async () => {
            const res = await api.get('/tutor/stats');
            return res.data;
        },
        enabled: isReady,
        staleTime: 30_000,
        refetchInterval: 30_000,
    });

    // Fetch AVAILABLE (unclaimed) bookings matching tutor's subjects
    const { data: availableJobs, isLoading: loadingAvailable } = useQuery({
        queryKey: ['tutor-available-jobs', user?.id],
        queryFn: async () => {
            try {
                const res = await api.get('/bookings/available');
                return Array.isArray(res.data) ? res.data : [];
            } catch (e) {
                console.warn('Available jobs endpoint not ready', e);
                return [];
            }
        },
        enabled: isReady,
        staleTime: 15_000,
        refetchInterval: 30_000, // Real-time notifications cover urgent job alerts
    });

    // Helper function to extract date from booking
    const getBookingDate = (booking: TutorBooking): Date | null => {
        // Prioritize actual scheduled times. Avoid created_at as it doesn't represent the session time.
        const dateValue = booking.start_time || booking.requested_start || booking.date;
        if (!dateValue) return null;

        try {
            return new Date(dateValue);
        } catch {
            return null;
        }
    };

    const now = new Date();
    // Normalize "today" to verify calendar date match
    const todayString = now.toDateString();



    const todaySessions = (bookings?.filter((b: TutorBooking) => {
        const bookingDate = getBookingDate(b);
        if (!bookingDate) {
            return false;
        }

        // STRICT CHECK: Matches today's calendar date
        const isSameCalendarDay = bookingDate.toDateString() === todayString;

        // STRICT FILTER: Session must not have ended
        const endStr = b.end_time || b.requested_end;
        // If end time is missing, assume 1 hour duration from start
        const sessionEnd = endStr
            ? new Date(endStr)
            : new Date(bookingDate.getTime() + 60 * 60 * 1000);

        // Use a small buffer (e.g. 5 mins) to allow wrapping up? Or strict now? User asked for strict expiry.
        // If sessionEnd < now, it's expired.
        const hasNotEnded = sessionEnd > now;

        return isSameCalendarDay && hasNotEnded;
    }) || []).sort((a: TutorBooking, b: TutorBooking) => {
        const dateA = getBookingDate(a)?.getTime() || 0;
        const dateB = getBookingDate(b)?.getTime() || 0;
        return dateA - dateB;
    });

    const upcomingBookings = (bookings?.filter((b: TutorBooking) => {
        const bookingDate = getBookingDate(b);
        if (!bookingDate) return false;

        // Upcoming = Future dates (tomorrow onwards)
        // logic: bookingDate > end of today?
        // Simpler: bookingDate is in the future AND NOT today
        const isFuture = bookingDate > now;
        const isNotToday = bookingDate.toDateString() !== todayString;

        return isFuture && isNotToday;
    }) || []).sort((a: TutorBooking, b: TutorBooking) => {
        const dateA = getBookingDate(a)?.getTime() || 0;
        const dateB = getBookingDate(b)?.getTime() || 0;
        return dateA - dateB;
    });

    return {
        todaySessions,
        upcomingBookings,
        availableJobs: availableJobs || [],
        stats: {
            todayCount: backendStats?.todayCount ?? todaySessions.length,
            completedCount: backendStats?.completedCount ?? 0,
            totalHours: backendStats?.totalHours ?? 0,
            earnings: backendStats?.earnings ?? 0,
            availableCount: backendStats?.availableCount ?? availableJobs?.length ?? 0,
            quality: backendStats?.quality ?? {
                rating: 0,
                reviewsCount: 0,
                engagement: 0,
                punctuality: 0,
                techScore: 0,
                isInitial: true
            }
        },
        loading: loadingBookings || loadingAvailable || loadingStats,
        error: bookingsError,
        refetch: refetchBookings
    };
}

