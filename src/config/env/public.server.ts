import 'server-only';

import { z } from 'zod';
import { parseEnv } from './parse-env.server';
import { publicEnv } from './public';

const httpUrlSchema = z.url().refine(
  value => {
    const protocol = new URL(value).protocol;
    return protocol === 'http:' || protocol === 'https:';
  },
  { message: 'Must be an HTTP or HTTPS URL' },
);

export const publicEnvSchema = z.object({
  giscusRepo: z
    .string()
    .regex(/^[^/\s]+\/[^/\s]+$/)
    .optional(),
  giscusRepoId: z.string().min(1).optional(),
  giscusCategory: z.string().min(1).optional(),
  giscusCategoryId: z.string().min(1).optional(),
  siteUrl: httpUrlSchema,
  imageUploadMaxSize: z.number().int().positive().safe(),
});

const publicEnvRules = {
  giscusRepo: {
    name: 'NEXT_PUBLIC_GISCUS_REPO',
    description: 'must use the owner/repository format',
  },
  giscusRepoId: {
    name: 'NEXT_PUBLIC_GISCUS_REPO_ID',
    description: 'must be a non-empty string when provided',
  },
  giscusCategory: {
    name: 'NEXT_PUBLIC_GISCUS_CATEGORY',
    description: 'must be a non-empty string when provided',
  },
  giscusCategoryId: {
    name: 'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
    description: 'must be a non-empty string when provided',
  },
  siteUrl: {
    name: 'NEXT_PUBLIC_SITE_URL',
    description: 'must be an HTTP or HTTPS URL',
  },
  imageUploadMaxSize: {
    name: 'NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE',
    description: 'must be a positive safe integer',
  },
};

export type ValidatedPublicEnv = z.infer<typeof publicEnvSchema>;

export function parsePublicEnv(value: unknown): ValidatedPublicEnv {
  return parseEnv(publicEnvSchema, value, publicEnvRules);
}

export const validatedPublicEnv = parsePublicEnv(publicEnv);
