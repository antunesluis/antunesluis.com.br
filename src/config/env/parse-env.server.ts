import 'server-only';

import { z } from 'zod';

export const httpUrlSchema = z.string().refine(
  value => {
    try {
      const protocol = new URL(value).protocol;
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'Must be an HTTP or HTTPS URL' },
);

type EnvRule = {
  name: string;
  description: string;
};

type EnvRules = Record<string, EnvRule>;

export class EnvironmentValidationError extends Error {
  constructor(invalidFields: string[]) {
    super(
      `Invalid environment configuration:\n${invalidFields
        .map(field => `- ${field}`)
        .join('\n')}`,
    );
    this.name = 'EnvironmentValidationError';
  }
}

export function parseEnv<Output>(
  schema: z.ZodType<Output>,
  value: unknown,
  rules: EnvRules,
): Output {
  const result = schema.safeParse(value);

  if (result.success) {
    return result.data;
  }

  const invalidFields = Array.from(
    new Set(
      result.error.issues.map(issue => {
        const field = issue.path.join('.') || 'environment';
        const rule = rules[field];

        return rule
          ? `${rule.name}: ${rule.description}`
          : `${field}: must contain a valid value`;
      }),
    ),
  );

  throw new EnvironmentValidationError(invalidFields);
}
