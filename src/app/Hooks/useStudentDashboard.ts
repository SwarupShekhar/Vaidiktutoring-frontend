import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export interface Booking {
  id: string;
  start_time?: string;
  end_time?: string;
  requested_start?: string;
  requested_end?: string;
  status: "scheduled" | "completed" | "cancelled" | "pending" | "declined";
  subject_id?: string;
  subject?: { name: string; title?: string };
  tutor?: { first_name: string; last_name: string };
  meeting_link?: string;
}

export default function useStudentDashboard() {
  const {
    data: bookings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings/student");
      const rawBookings = res.data || [];

      // Normalize data structure
      return rawBookings.map((b: Booking) => ({
        ...b,
        start_time: b.start_time || b.requested_start, // Fallback for pending sessions
        end_time: b.end_time || b.requested_end,
        subject: {
          ...b.subject,
          name: b.subject?.title || b.subject?.name || "Tutoring Session", // Handle title vs name mismatch
        },
      })) as Booking[];
    },
    staleTime: 60_000,
  });

  // Helper: Sort by start time - Memoized
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a: Booking, b: Booking) => {
      const startA = new Date(a.start_time || a.requested_start || 0).getTime();
      const startB = new Date(b.start_time || b.requested_start || 0).getTime();
      return startA - startB;
    });
  }, [bookings]);

  const now = useMemo(() => new Date(), [bookings]); // Update relative to data change or component mount

  // Upcoming: start_time > now, status != cancelled - Memoized
  const upcomingSessions = useMemo(() => {
    return sortedBookings.filter((b: Booking) => {
      const startStr = b.start_time || b.requested_start;
      const endStr = b.end_time || b.requested_end;

      if (!startStr) return false;

      // If end time is missing, assume 1 hour duration
      const endTime = endStr
        ? new Date(endStr)
        : new Date(new Date(startStr).getTime() + 60 * 60 * 1000);

      const isFuture = endTime > now;
      const isValidStatus = b.status !== "cancelled" && b.status !== "declined";

      return isFuture && isValidStatus;
    });
  }, [sortedBookings, now]);

  // Past: end_time < now OR status is completed - Memoized
  const pastSessions = useMemo(() => {
    return sortedBookings
      .filter((b: Booking) => {
        const endStr = b.end_time || b.requested_end;
        if (!endStr) return b.status === "completed";

        const endTime = new Date(endStr);
        return endTime <= now || b.status === "completed";
      })
      .reverse(); // Most recent past first
  }, [sortedBookings, now]);

  return {
    bookings,
    upcomingSessions,
    pastSessions,
    loading: isLoading,
    error,
  };
}
