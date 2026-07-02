import { useQuery } from '@tanstack/react-query';
import { assignmentsApi, Assignment } from '@/app/lib/assignments';
import { useAuthContext } from '@/app/context/AuthContext';

/**
 * Returns the count of OUTSTANDING homework for the current student.
 *
 * Outstanding = an assignment the student still needs to act on, i.e. there is
 * no submission yet (status "Pending" in StudentAssignmentsList). Assignments
 * that have been submitted or graded are not counted.
 *
 * Defensive about response shape: if anything is missing/odd we fall back to 0
 * so the dashboard never breaks.
 */
export function useHomeworkCount(): { count: number; loading: boolean } {
  const { user } = useAuthContext();
  const userId = user?.id;

  const { data, isLoading } = useQuery<number>({
    queryKey: ['homework-count', userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const assignments = await assignmentsApi.getAssignments({ user_id: userId! });
        if (!Array.isArray(assignments)) return 0;
        return assignments.reduce((acc: number, a: Assignment) => {
          const submission = a?.submissions?.[0];
          // Outstanding when there is no submission at all.
          const outstanding = !submission;
          return acc + (outstanding ? 1 : 0);
        }, 0);
      } catch {
        return 0;
      }
    },
  });

  return { count: data ?? 0, loading: !!userId && isLoading };
}
