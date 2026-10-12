import { recommendationBaseUrl } from '@/core/config/env';

import {
  parseRecommendation,
  type Recommendation,
} from '@/features/recommendation/recommendationSchema';

export async function getRecommendation(): Promise<Recommendation> {
  const response = await fetch(recommendationBaseUrl);

  if (!response.ok) {
    throw new Error(`Staff Pick request failed with status ${response.status}`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new Error('Staff Pick response was not valid JSON');
  }

  return parseRecommendation(json);
}
