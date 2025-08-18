import { isUrlOrRelativePath } from '@/utils/is-url-or-relative-path';
import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

const PostBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, 'Title must have at least 10 characters')
    .max(120, 'Title must have a maximum of 120 characters'),
  content: z
    .string()
    .trim()
    .min(3, 'Content is required')
    .transform(val => sanitizeHtml(val)),
  author: z
    .string()
    .trim()
    .min(4, 'Author needs a minimum of 4 characters')
    .max(100, 'Author name must not have more than 100 characters'),
  excerpt: z
    .string()
    .trim()
    .min(3, 'Excerpt needs a minimum of 3 characters')
    .max(200, 'Excerpt must not have more than 200 characters'),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: 'Cover URL must be a URL or path to image',
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

// PostCreateSchema: same as base for now
export const PostCreateSchema = PostBaseSchema;

// PostUpdateSchema: may include extra fields in the future (e.g.: id)
export const PostUpdateSchema = PostBaseSchema.extend({
  // id: z.string().uuid('Invalid ID'),
});
