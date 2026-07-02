import { useQuery } from '@tanstack/react-query';
import { assignmentsApi, Assignment } from '@/app/lib/assignments';
import { useAuthContext } from '@/app/context/AuthContext';

/**
 * Returns the single most-urgent OUTSTANDING homework (no submission yet),
 * sorted by soonest due date (undated assignments sort last). Used to give the
 * homescreen "To do" card an actionable next item instead of just a count.
 * Defensive: any odd/missing response → null so the dashboard never breaks.
 */
export function useNextHomework(): { next: Assignment | null } {
  const { user } = useAuthContext();
  const userId = user?.id;

  const { data } = useQuery<Assignment | null>({
    queryKey: ['next-homework', userId],
    enabled: !!userId,
    queryFn: async () => {
      try {
        const assignments = await assignmentsApi.getAssignments({ user_id: userId! });
        if (!Array.isArray(assignments)) return null;
        const outstanding = assignments.filter((a) => !a?.submissions?.[0]);
        if (outstanding.length === 0) return null;
        outstanding.sort((a, b) => {
          const da = a.due_date ? new Date(a.due_date).getTime() : Infinity;
          const db = b.due_date ? new Date(b.due_date).getTime() : Infinity;
          return da - db;
        });
        return outstanding[0];
      } catch {
        return null;
      }
    },
  });

  return { next: data ?? null };
}
