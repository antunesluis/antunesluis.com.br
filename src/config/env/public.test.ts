import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';

const envKeys = [
  'NEXT_PUBLIC_GISCUS_REPO',
  'NEXT_PUBLIC_GISCUS_REPO_ID',
  'NEXT_PUBLIC_GISCUS_CATEGORY',
  'NEXT_PUBLIC_GISCUS_CATEGORY_ID',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE',
] as const;

const originalEnv = Object.fromEntries(
  envKeys.map(key => [key, process.env[key]]),
);

Object.assign(process.env, {
  NEXT_PUBLIC_GISCUS_REPO: 'owner/repository',
  NEXT_PUBLIC_GISCUS_REPO_ID: 'repository-id',
  NEXT_PUBLIC_GISCUS_CATEGORY: 'Announcements',
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'category-id',
  NEXT_PUBLIC_SITE_URL: 'https://example.com',
  NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE: '1024',
});

let publicModule: typeof import('./public');
let publicServerModule: typeof import('./public.server');

before(async () => {
  publicModule = await import('./public');
  publicServerModule = await import('./public.server');
});

after(() => {
  for (const key of envKeys) {
    const value = originalEnv[key];

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test('creates typed public values and converts the upload limit', () => {
  const result = publicModule.createPublicEnv({
    NEXT_PUBLIC_GISCUS_REPO: 'owner/repository',
    NEXT_PUBLIC_GISCUS_REPO_ID: 'repository-id',
    NEXT_PUBLIC_GISCUS_CATEGORY: 'Announcements',
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'category-id',
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
    NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE: '2048',
  });

  assert.deepEqual(result, {
    giscusRepo: 'owner/repository',
    giscusRepoId: 'repository-id',
    giscusCategory: 'Announcements',
    giscusCategoryId: 'category-id',
    siteUrl: 'https://example.com',
    imageUploadMaxSize: 2048,
  });
});

test('preserves the intentional public defaults', () => {
  const result = publicModule.createPublicEnv({
    NEXT_PUBLIC_GISCUS_REPO: 'owner/repository',
    NEXT_PUBLIC_GISCUS_REPO_ID: 'repository-id',
    NEXT_PUBLIC_GISCUS_CATEGORY: 'Announcements',
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'category-id',
    NEXT_PUBLIC_SITE_URL: undefined,
    NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE: undefined,
  });

  assert.equal(result.siteUrl, 'https://antunesluis.com.br');
  assert.equal(result.imageUploadMaxSize, 921600);
});

test('rejects invalid public formats on the server', () => {
  const baseValue = {
    giscusRepo: 'owner/repository',
    giscusRepoId: 'repository-id',
    giscusCategory: 'Announcements',
    giscusCategoryId: 'category-id',
    siteUrl: 'https://example.com',
    imageUploadMaxSize: 1024,
  };

  assert.throws(() =>
    publicServerModule.parsePublicEnv({
      ...baseValue,
      giscusRepo: 'invalid-repository',
    }),
  );
  assert.throws(() =>
    publicServerModule.parsePublicEnv({
      ...baseValue,
      siteUrl: 'not-a-url',
    }),
  );
  assert.throws(() =>
    publicServerModule.parsePublicEnv({
      ...baseValue,
      imageUploadMaxSize: Number.NaN,
    }),
  );
  assert.throws(() =>
    publicServerModule.parsePublicEnv({
      ...baseValue,
      imageUploadMaxSize: 0,
    }),
  );
});

test('validates the exact public collection exposed to consumers', () => {
  assert.deepEqual(
    publicServerModule.validatedPublicEnv,
    publicModule.publicEnv,
  );
});
