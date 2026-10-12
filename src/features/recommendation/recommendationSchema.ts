import { z } from 'zod';

function formatZodError(context: string, error: z.ZodError): string {
  const details = error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    })
    .join('; ');
  return `${context} parse failed: ${details}`;
}

function nullishStringToEmpty(value: unknown): string {
  if (value == null) {
    return '';
  }
  return String(value);
}

const recommendationItemSchema = z.object({
  title: z.string().min(1, 'title is required'),
  reason: z.preprocess(nullishStringToEmpty, z.string()),
  movieId: z.number(),
  posterPath: z.preprocess(nullishStringToEmpty, z.string()),
  rating: z.number(),
});

export const recommendationSchema = z.object({
  recommendation: recommendationItemSchema,
});

export type Recommendation = z.infer<typeof recommendationItemSchema>;

/** Parses the Staff Pick API envelope; throws when the payload is invalid. */
export function parseRecommendation(raw: unknown): Recommendation {
  const parsed = recommendationSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(formatZodError('Staff Pick recommendation', parsed.error));
  }

  return parsed.data.recommendation;
}
