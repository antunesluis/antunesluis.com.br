import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { after, before, beforeEach, mock, test } from 'node:test';

const validLoginPass =
  'JDJiJDA0JGxNTjBKdGZ4b1kxQ2RYWVA5TWFsUHViQk01b2JlQlgxRExRZjhhdlJLcnFjRTZES0VlaFhL';
const privateEnv = {
  JWT_SECRET_KEY: 'integration-test-secret-with-32-characters',
  LOGIN_USER: 'admin',
  LOGIN_PASS: validLoginPass,
  LOGIN_EXPIRATION_SECONDS: '60',
  LOGIN_COOKIE_NAME: 'integrationSession',
  ALLOW_LOGIN: '1',
  NODE_ENV: 'test',
};
const originalEnv = Object.fromEntries(
  Object.keys(privateEnv).map(key => [key, process.env[key]]),
);
Object.assign(process.env, privateEnv);

type CookieOptions = {
  expires?: Date;
  maxAge?: number;
};

let storedCookie: string | undefined;
const cookieStore = {
  get: (name: string) =>
    name === privateEnv.LOGIN_COOKIE_NAME && storedCookie
      ? { value: storedCookie }
      : undefined,
  set: (name: string, value: string, options: CookieOptions) => {
    if (name !== privateEnv.LOGIN_COOKIE_NAME) return;
    storedCookie = options.maxAge === 0 ? undefined : value;
  },
};
const redirects: string[] = [];

mock.module('next/headers', {
  namedExports: { cookies: async () => cookieStore },
});
mock.module('next/navigation', {
  namedExports: {
    redirect: (url: string): never => {
      redirects.push(url);
      throw new Error(`redirect:${url}`);
    },
  },
});

let serverEnv: typeof import('@/config/env/server').serverEnv;
let createLoginToken: typeof import('@/lib/auth').createLoginToken;
let createLoginSession: typeof import('@/lib/auth').createLoginSession;
let verifyLoginSession: typeof import('@/lib/auth').verifyLoginSession;
let loginAction: typeof import('./actions/login-action').loginAction;
let proxy: typeof import('@/proxy').proxy;

before(async () => {
  ({ serverEnv } = await import('@/config/env/server'));
  ({ createLoginSession, createLoginToken, verifyLoginSession } =
    await import('@/lib/auth'));
  ({ loginAction } = await import('./actions/login-action'));
  ({ proxy } = await import('@/proxy'));
});

beforeEach(() => {
  serverEnv.allowLogin = true;
  storedCookie = undefined;
  redirects.length = 0;
});

after(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function loginForm() {
  const formData = new FormData();
  formData.set('username', privateEnv.LOGIN_USER);
  formData.set('password', 'test-password');
  return formData;
}

function adminRequest(cookie = storedCookie) {
  return {
    nextUrl: { pathname: '/admin/blog' },
    method: 'GET',
    cookies: {
      get: (name: string) =>
        name === privateEnv.LOGIN_COOKIE_NAME && cookie
          ? { value: cookie }
          : undefined,
    },
    url: 'http://localhost:3000/admin/blog',
  } as never;
}

test('crosses configuration, login and session before rejecting expiration', async () => {
  await assert.rejects(
    loginAction({ username: '', error: '' }, loginForm()),
    /redirect:\/admin\/blog/,
  );
  assert(storedCookie);
  assert.deepEqual(redirects, ['/admin/blog']);
  assert.equal(await verifyLoginSession(), true);

  const authorized = await proxy(adminRequest());
  assert.equal(authorized.status, 200);
  assert.equal(authorized.headers.get('x-middleware-next'), '1');

  const expiredToken = await createLoginToken(
    privateEnv.LOGIN_USER,
    new Date(0),
  );
  storedCookie = expiredToken.value;

  assert.equal(await verifyLoginSession(), false);
  const expired = await proxy(adminRequest());
  assert.equal(expired.status, 307);
  assert.equal(
    expired.headers.get('location'),
    'http://localhost:3000/admin/login',
  );
});

test('blocks a new login without revoking an existing session', async () => {
  await createLoginSession(privateEnv.LOGIN_USER);
  const existingCookie = storedCookie;
  assert(existingCookie);

  serverEnv.allowLogin = false;
  const result = await loginAction(
    { username: '', error: '' },
    loginForm(),
  );

  assert.deepEqual(result, { username: '', error: 'Login not allowed' });
  assert.equal(storedCookie, existingCookie);
  assert.equal(await verifyLoginSession(), true);
  assert.equal((await proxy(adminRequest())).status, 200);
});

test('fails an authentication entrypoint without exposing invalid config', () => {
  const receivedSecret = 'leaky-integration-secret';
  const result = spawnSync(
    process.execPath,
    [
      '--conditions=react-server',
      '--import',
      'tsx',
      '--eval',
      "import('./src/lib/auth/login-token.ts')",
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...process.env,
        JWT_SECRET_KEY: receivedSecret,
      },
    },
  );
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.status, 0);
  assert.match(output, /JWT_SECRET_KEY/);
  assert.doesNotMatch(output, new RegExp(receivedSecret));
});
