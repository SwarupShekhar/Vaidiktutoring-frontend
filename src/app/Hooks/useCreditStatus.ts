import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { CreditStatus } from '@/app/types/credits';

export function useCreditStatus() {
  const {
    data: status,
    isLoading: loading,
    error,
    refetch,
  } = useQuery<CreditStatus>({
    queryKey: ['credit-status'],
    queryFn: async () => {
      const res = await api.get('/credits/trial-status');
      return res.data;
    },
    // Refetch every 60s to keep status current
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  return {
    status: status ?? null,
    loading,
    error,
    refetch,
  };
}
