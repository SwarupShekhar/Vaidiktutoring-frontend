import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';

export interface ProgressSummary {
  streakWeeks: number;
  totalSessions: number;
  totalHoursLearned: number;
  sessionsThisMonth: number;
  attendanceRate: number;
  packageSessionsRemaining: number;
  packageSessionsTotal: number;
  badges: string[];
  stickers: string[];
  topicsThisMonth: string[];
  subjectProgress: {
    subject: string;
    level: 'improving' | 'steady' | 'needs_work';
  }[];
  recentFeedback?: {
    sessionId: string;
    date: string;
    subject: string;
    note: string;
  }[];
  recentRecordings?: {
    sessionId: string;
    date: string;
    subject: string;
    recordingId: string;
    blobName: string;
  }[];
}

export function useStudentProgress(studentId?: string) {
  const endpoint = studentId ? `/students/${studentId}/progress-summary` : '/students/me/progress-summary';
  
  const {
    data: progressSummary,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ProgressSummary>({
    queryKey: ['student-progress', studentId],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
    enabled: true, // Always enabled since we handle 'me'
  });

  return {
    progressSummary: progressSummary ?? null,
    loading,
    error,
    refetch,
  };
}
