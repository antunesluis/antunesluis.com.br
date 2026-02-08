import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { isUrlOrRelativePath } from '@/lib/utils';

const ProjectBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must have at least 3 characters')
    .max(120, 'Name must have a maximum of 120 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must have at least 10 characters')
    .max(500, 'Description must have a maximum of 500 characters'),
  content: z
    .string()
    .trim()
    .min(3, 'Content is required')
    .transform(val => sanitizeHtml(val)),
  repositoryUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: 'Repository URL must be a URL',
  }),
  deployUrl: z
    .string()
    .trim()
    .refine(isUrlOrRelativePath, {
      message: 'deployUrl URL must be a URL',
    })
    .optional()
    .or(z.literal('')),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: 'Cover URL must be a URL or path to image',
  }),
  techStack: z
    .string()
    .transform(val =>
      val
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0),
    )
    .refine(val => val.length > 0, {
      message: 'At least one technology is required',
    }),
  published: z
    .union([
      z.literal('on'),
      z.literal('true'),
      z.literal('false'),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform(val => val === 'on' || val === 'true' || val === true),
});

// ProjectCreateSchema: same as base for now
export const ProjectCreateSchema = ProjectBaseSchema;

// ProjectUpdateSchema: may include extra fields in the future (e.g.: id)
export const ProjectUpdateSchema = ProjectBaseSchema.extend({
  // id: z.string().uuid('Invalid ID'),
});
