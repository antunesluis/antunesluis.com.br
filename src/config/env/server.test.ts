import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { afterAll, beforeAll, describe, test } from 'vitest';

const validLoginPass =
  'JDJiJDA0JGxNTjBKdGZ4b1kxQ2RYWVA5TWFsUHViQk01b2JlQlgxRExRZjhhdlJLcnFjRTZES0VlaFhL';

const validSource = {
  IMAGE_UPLOAD_DIRECTORY: undefined,
  IMAGE_SERVER_URL: undefined,
  JWT_SECRET_KEY: 'a-secure-test-secret-with-32-characters',
  LOGIN_USER: 'admin',
  LOGIN_PASS: validLoginPass,
  LOGIN_EXPIRATION_SECONDS: '3600',
  LOGIN_COOKIE_NAME: 'loginSession',
  ALLOW_LOGIN: '1',
  NODE_ENV: 'test',
};

const privateEnvKeys = Object.keys(validSource) as (keyof typeof validSource)[];
const originalEnv = Object.fromEntries(
  privateEnvKeys.map(key => [key, process.env[key]]),
);

for (const key of privateEnvKeys) {
  const value = validSource[key];

  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

let serverModule: typeof import('./server');

beforeAll(async () => {
  serverModule = await import('./server');
});

afterAll(() => {
  for (const key of privateEnvKeys) {
    const value = originalEnv[key];

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test('parses private values and preserves non-critical defaults', () => {
  const result = serverModule.parseServerEnv(validSource);

  assert.deepEqual(result, {
    imageUploadDirectory: 'uploads',
    imageServerUrl: 'http://localhost:3000/uploads',
    jwtSecretKey: validSource.JWT_SECRET_KEY,
    loginUser: 'admin',
    loginPass: validLoginPass,
    loginExpirationSeconds: 3600,
    loginCookieName: 'loginSession',
    allowLogin: true,
    nodeEnv: 'test',
  });
});

test('accepts ALLOW_LOGIN=0 without weakening the private contract', () => {
  const disabled = serverModule.parseServerEnv({
    ...validSource,
    ALLOW_LOGIN: '0',
  });

  assert.equal(disabled.allowLogin, false);
  assert.throws(
    () =>
      serverModule.parseServerEnv({
        ...validSource,
        ALLOW_LOGIN: '0',
        LOGIN_PASS: undefined,
      }),
    /LOGIN_PASS/,
  );
});

test('rejects external whitespace in LOGIN_USER without exposing it', () => {
  const receivedLoginUser = ' admin ';

  assert.throws(
    () =>
      serverModule.parseServerEnv({
        ...validSource,
        LOGIN_USER: receivedLoginUser,
      }),
    error => {
      assert(error instanceof Error);
      assert.equal(
        error.message,
        'Invalid environment configuration:\n' +
          '- LOGIN_USER: is required, must be a non-empty string and must not contain external whitespace',
      );
      assert.doesNotMatch(error.message, /admin/);
      return true;
    },
  );
});

describe('rejects every invalid critical authentication field', () => {
  const invalidCases = [
    {
      name: 'JWT_SECRET_KEY placeholder',
      field: 'JWT_SECRET_KEY',
      source: { JWT_SECRET_KEY: 'your_jwt_secret_key_here' },
    },
    {
      name: 'LOGIN_USER empty',
      field: 'LOGIN_USER',
      source: { LOGIN_USER: '   ' },
    },
    {
      name: 'LOGIN_PASS not canonical bcrypt Base64',
      field: 'LOGIN_PASS',
      source: { LOGIN_PASS: 'bm90LWEtYmNyeXB0LWhhc2g=' },
    },
    {
      name: 'LOGIN_EXPIRATION_SECONDS not positive',
      field: 'LOGIN_EXPIRATION_SECONDS',
      source: { LOGIN_EXPIRATION_SECONDS: '0' },
    },
    {
      name: 'LOGIN_EXPIRATION_SECONDS not safe',
      field: 'LOGIN_EXPIRATION_SECONDS',
      source: { LOGIN_EXPIRATION_SECONDS: '9007199254740992' },
    },
    {
      name: 'LOGIN_COOKIE_NAME invalid',
      field: 'LOGIN_COOKIE_NAME',
      source: { LOGIN_COOKIE_NAME: 'invalid cookie' },
    },
    {
      name: 'ALLOW_LOGIN not explicit',
      field: 'ALLOW_LOGIN',
      source: { ALLOW_LOGIN: 'true' },
    },
    {
      name: 'NODE_ENV unknown',
      field: 'NODE_ENV',
      source: { NODE_ENV: 'staging' },
    },
  ] as const;

  for (const invalidCase of invalidCases) {
    test(invalidCase.name, () => {
      assert.throws(
        () =>
          serverModule.parseServerEnv({
            ...validSource,
            ...invalidCase.source,
          }),
        error => {
          assert(error instanceof Error);
          assert.match(error.message, new RegExp(invalidCase.field));
          return true;
        },
      );
    });
  }
});

test('sanitizes configuration errors without exposing received values', () => {
  const receivedSecret = 'visible-only-to-the-parser';

  assert.throws(
    () =>
      serverModule.parseServerEnv({
        ...validSource,
        JWT_SECRET_KEY: receivedSecret,
        LOGIN_PASS: receivedSecret,
      }),
    error => {
      assert(error instanceof Error);
      assert.match(error.message, /JWT_SECRET_KEY/);
      assert.match(error.message, /LOGIN_PASS/);
      assert.doesNotMatch(error.message, new RegExp(receivedSecret));
      return true;
    },
  );
});

test('sanitizes malformed private URLs without exposing their value', () => {
  const receivedImageServerUrl = 'sensitive-internal-url';

  assert.throws(
    () =>
      serverModule.parseServerEnv({
        ...validSource,
        IMAGE_SERVER_URL: receivedImageServerUrl,
      }),
    error => {
      assert(error instanceof Error);
      assert.equal(error.name, 'EnvironmentValidationError');
      assert.equal(
        error.message,
        'Invalid environment configuration:\n' +
          '- IMAGE_SERVER_URL: must be an HTTP or HTTPS URL without a trailing slash',
      );
      assert.doesNotMatch(error.message, new RegExp(receivedImageServerUrl));
      return true;
    },
  );
});

test('instrumentation fails with a sanitized critical configuration error', () => {
  const invalidSecret = 'invalid-secret';
  const childEnv = {
    ...process.env,
    IMAGE_UPLOAD_DIRECTORY: 'uploads',
    IMAGE_SERVER_URL: 'http://localhost:3000/uploads',
    LOGIN_USER: validSource.LOGIN_USER,
    LOGIN_PASS: validSource.LOGIN_PASS,
    LOGIN_EXPIRATION_SECONDS: validSource.LOGIN_EXPIRATION_SECONDS,
    LOGIN_COOKIE_NAME: validSource.LOGIN_COOKIE_NAME,
    ALLOW_LOGIN: validSource.ALLOW_LOGIN,
    NODE_ENV: validSource.NODE_ENV,
    NEXT_RUNTIME: 'nodejs',
    JWT_SECRET_KEY: invalidSecret,
    NEXT_PUBLIC_GISCUS_REPO: 'owner/repository',
    NEXT_PUBLIC_GISCUS_REPO_ID: 'repository-id',
    NEXT_PUBLIC_GISCUS_CATEGORY: 'Announcements',
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'category-id',
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
    NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE: '1024',
  };
  const result = spawnSync(
    process.execPath,
    [
      '--conditions=react-server',
      '--import',
      'tsx',
      '--eval',
      "import('./src/instrumentation.ts').then(module => (module.default ?? module).register())",
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: childEnv,
    },
  );
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.status, 0);
  assert.match(output, /JWT_SECRET_KEY/);
  assert.doesNotMatch(output, new RegExp(invalidSecret));
});
