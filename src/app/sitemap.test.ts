import { expect, test, vi } from 'vitest';
import { SITE_URL } from '@/config/constants';

const mocks = vi.hoisted(() => ({
  findAllPublicPostsCached: vi.fn(),
  findAllPublicProjectCached: vi.fn(),
}));

vi.mock('@/features/blog/lib/queries/public', () => ({
  findAllPublicPostsCached: mocks.findAllPublicPostsCached,
}));
vi.mock('@/features/projects/lib/queries/public', () => ({
  findAllPublicProjectCached: mocks.findAllPublicProjectCached,
}));

import sitemap from './sitemap';

test('uses content dates only for dynamic sitemap entries', async () => {
  mocks.findAllPublicPostsCached.mockResolvedValue([
    {
      slug: 'post-publicado',
      createdAt: new Date('2025-01-02T03:04:05.000Z'),
      updatedAt: new Date('2025-02-03T04:05:06.000Z'),
    },
  ]);
  mocks.findAllPublicProjectCached.mockResolvedValue([
    {
      slug: 'projeto-publicado',
      createdAt: new Date('2025-03-04T05:06:07.000Z'),
      updatedAt: null,
    },
  ]);

  const entries = await sitemap();
  const staticEntries = entries.filter(entry =>
    ['/', '/about', '/blog', '/projects'].includes(
      entry.url.replace(SITE_URL, ''),
    ),
  );

  expect(staticEntries).toHaveLength(4);
  expect(staticEntries.every(entry => entry.lastModified === undefined)).toBe(
    true,
  );
  expect(entries).toContainEqual(
    expect.objectContaining({
      url: `${SITE_URL}/blog/post-publicado`,
      lastModified: new Date('2025-02-03T04:05:06.000Z'),
    }),
  );
  expect(entries).toContainEqual(
    expect.objectContaining({
      url: `${SITE_URL}/projects/projeto-publicado`,
      lastModified: new Date('2025-03-04T05:06:07.000Z'),
    }),
  );
});
