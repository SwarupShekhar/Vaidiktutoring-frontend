import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import { useAuthContext } from '@/app/context/AuthContext';
import type { CreditStatus } from '@/app/types/credits';
import type { ProgressSummary } from './useStudentProgress';

export interface Booking {
  id: string;
  start_time?: string;
  end_time?: string;
  requested_start?: string;
  requested_end?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'declined';
  subject_id?: string;
  subject?: { name: string; title?: string };
  tutor?: { first_name: string; last_name: string };
  meeting_link?: string;
}

export interface StudentProfile {
  id: string;
  first_name: string;
  last_name?: string;
  email?: string;
  grade: string;
  school: string;
  curriculum_preference?: string;
  interests?: string[];
  recent_focus?: string;
  struggle_areas?: string[];
  program_id?: string;
  package_id?: string;
  user_id?: string;
  stickers?: string[];
  creditStatus: CreditStatus;
}

export interface EnrollmentStatus {
  status: string;
  sessionsRemaining: number;
  packageEndDate: string | null;
  assignedTutorId: string | null;
  weeklySchedule: {
    bookingId: string;
    date: string;
    end: string | null;
    tutorName: string | null;
  }[];
}

export interface DashboardSummaryData {
  profile: StudentProfile;
  enrollmentStatus: EnrollmentStatus;
  progressSummary: ProgressSummary;
  bookings: Booking[];
  pendingRatings: any[];
}

export function useStudentDashboardSummary() {
  // Wait for auth to be bootstrapped before firing the API call.
  // Without this, the query fires immediately with no token (401) and
  // isLoading flips to false with no data — causing the blank white screen.
  const { token, loading: authLoading } = useAuthContext();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardSummaryData>({
    queryKey: ['student-dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/students/me/dashboard-summary');
      return res.data;
    },
    enabled: !!token && !authLoading, // 🔑 Only run when auth is ready
    staleTime: 30_000, // Cache active data for 30 seconds
    refetchInterval: 60_000, // Auto-refetch in background every 60s
  });

  const bookings = data?.bookings || [];

  // Normalize bookings structure (from useStudentDashboard logic)
  const normalizedBookings = useMemo(() => {
    return bookings.map((b: Booking) => ({
      ...b,
      start_time: b.start_time || b.requested_start,
      end_time: b.end_time || b.requested_end,
      subject: {
        ...b.subject,
        name: b.subject?.title || b.subject?.name || 'Tutoring Session',
      },
    })) as Booking[];
  }, [bookings]);

  // Sort and split bookings into upcoming & past (memoized)
  const sortedBookings = useMemo(() => {
    return [...normalizedBookings].sort((a: Booking, b: Booking) => {
      const startA = new Date(a.start_time || a.requested_start || 0).getTime();
      const startB = new Date(b.start_time || b.requested_start || 0).getTime();
      return startA - startB;
    });
  }, [normalizedBookings]);

  const now = useMemo(() => new Date(), [normalizedBookings]);

  const upcomingSessions = useMemo(() => {
    return sortedBookings.filter((b: Booking) => {
      const startStr = b.start_time || b.requested_start;
      const endStr = b.end_time || b.requested_end;

      if (!startStr) return false;

      const endTime = endStr
        ? new Date(endStr)
        : new Date(new Date(startStr).getTime() + 60 * 60 * 1000);

      const isFuture = endTime > now;
      const isValidStatus = b.status !== 'cancelled' && b.status !== 'declined';

      return isFuture && isValidStatus;
    });
  }, [sortedBookings, now]);

  const pastSessions = useMemo(() => {
    return sortedBookings
      .filter((b: Booking) => {
        const endStr = b.end_time || b.requested_end;
        if (!endStr) return b.status === 'completed';

        const endTime = new Date(endStr);
        return endTime <= now || b.status === 'completed';
      })
      .reverse();
  }, [sortedBookings, now]);

  return {
    studentProfile: data?.profile || null,
    creditStatus: data?.profile?.creditStatus || null,
    progressSummary: data?.progressSummary || null,
    enrollmentStatus: data?.enrollmentStatus || null,
    pendingRatings: data?.pendingRatings || [],
    bookings: normalizedBookings,
    upcomingSessions,
    pastSessions,
    isLoading: isLoading || authLoading, // Treat auth bootstrapping as a loading state too
    error,
    refetch,
  };
}
