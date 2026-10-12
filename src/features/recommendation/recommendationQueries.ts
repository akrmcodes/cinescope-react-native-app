import { useQuery } from '@tanstack/react-query';

import { getRecommendation } from '@/features/recommendation/recommendationApi';

export const recommendationQueryKey = ['recommendation'] as const;

export function useRecommendation() {
  return useQuery({
    queryKey: recommendationQueryKey,
    queryFn: getRecommendation,
    retry: 1,
  });
}
