import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface AttendanceSession {
  sessionId: string;
  title: string;
  scheduledStart: string;
  status: AttendanceStatus;
  joinedAt: string | null;
  leftAt: string | null;
  minutesAttended: number | null;
}

export interface AttendanceSummary {
  totalSessions: number;
  attended: number;
  absent: number;
  late: number;
  attendanceRate: number;
  totalMinutes: number;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  summary: AttendanceSummary;
  sessions: AttendanceSession[];
}

/**
 * Fetches the attendance report for a given student.
 * Matches the locked backend contract: GET /students/:id/attendance-report
 *
 * @param studentId - The student whose report to fetch. Query is disabled when undefined/null.
 */
export function useAttendanceReport(studentId?: string | null) {
  const {
    data: report,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<AttendanceReport>({
    queryKey: ['attendance-report', studentId],
    queryFn: async () => {
      const res = await api.get(`/students/${studentId}/attendance-report`);
      return res.data;
    },
    enabled: !!studentId,
    staleTime: 60_000,
  });

  return {
    report: report ?? null,
    loading,
    error,
    refetch,
  };
}
