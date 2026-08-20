import assert from 'node:assert/strict';
import { decodeProtectedHeader, SignJWT } from 'jose';
import { after, before, mock, test } from 'node:test';

const privateEnv = {
  JWT_SECRET_KEY: 'a-secure-test-secret-with-32-characters',
  LOGIN_USER: 'admin',
  LOGIN_PASS:
    'JDJiJDA0JGxNTjBKdGZ4b1kxQ2RYWVA5TWFsUHViQk01b2JlQlgxRExRZjhhdlJLcnFjRTZES0VlaFhL',
  LOGIN_EXPIRATION_SECONDS: '3600',
  LOGIN_COOKIE_NAME: 'loginSession',
  ALLOW_LOGIN: '0',
  NODE_ENV: 'test',
};

const originalEnv = Object.fromEntries(
  Object.keys(privateEnv).map(key => [key, process.env[key]]),
);
Object.assign(process.env, privateEnv);

type CookieSetCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

const cookieSetCalls: CookieSetCall[] = [];
let storedCookie: string | undefined;
const cookieStore = {
  get: (name: string) =>
    name === privateEnv.LOGIN_COOKIE_NAME && storedCookie
      ? { value: storedCookie }
      : undefined,
  set: (
    name: string,
    value: string,
    options: Record<string, unknown>,
  ) => {
    cookieSetCalls.push({ name, value, options });
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

let tokenModule: typeof import('./login-token');
let sessionModule: typeof import('./login-session');

before(async () => {
  tokenModule = await import('./login-token');
  sessionModule = await import('./login-session');
});

after(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test('creates HS256 claims and uses their exact expiration on the cookie', async () => {
  cookieSetCalls.length = 0;
  await sessionModule.createLoginSession(privateEnv.LOGIN_USER);

  assert.equal(cookieSetCalls.length, 1);
  const [cookie] = cookieSetCalls;
  const payload = await tokenModule.verifyLoginToken(cookie.value);

  assert(payload);
  assert.equal(decodeProtectedHeader(cookie.value).alg, 'HS256');
  assert.deepEqual(Object.keys(payload).sort(), ['exp', 'iat', 'username']);
  assert.equal(payload.username, privateEnv.LOGIN_USER);
  assert.equal(payload.exp - payload.iat, 3600);
  assert.equal(
    (cookie.options.expires as Date).getTime(),
    payload.exp * 1000,
  );
  assert.deepEqual(cookie.options, {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    path: '/',
    expires: new Date(payload.exp * 1000),
  });
});

test('uses secure cookies only in production', () => {
  const expiresAt = new Date(0);
  assert.equal(
    sessionModule.getLoginCookieOptions(expiresAt, 'development').secure,
    false,
  );
  assert.equal(
    sessionModule.getLoginCookieOptions(expiresAt, 'test').secure,
    false,
  );
  assert.equal(
    sessionModule.getLoginCookieOptions(expiresAt, 'production').secure,
    true,
  );
});

test('rejects malformed, altered, expired and invalid-shape tokens', async () => {
  const validToken = await tokenModule.createLoginToken(privateEnv.LOGIN_USER);
  const replacement = validToken.value.endsWith('x') ? 'y' : 'x';
  const alteredToken = `${validToken.value.slice(0, -1)}${replacement}`;
  const expiredToken = await tokenModule.createLoginToken(
    privateEnv.LOGIN_USER,
    new Date(Date.now() - 3_700_000),
  );
  const invalidShapeToken = await new SignJWT({ username: 123 })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(privateEnv.JWT_SECRET_KEY));

  assert.equal(await tokenModule.verifyLoginToken('malformed'), false);
  assert.equal(await tokenModule.verifyLoginToken(alteredToken), false);
  assert.equal(await tokenModule.verifyLoginToken(expiredToken.value), false);
  assert.equal(await tokenModule.verifyLoginToken(invalidShapeToken), false);
});

test('rejects another user and ignores ALLOW_LOGIN for an existing session', async () => {
  const otherUserToken = await tokenModule.createLoginToken('other-user');
  const validToken = await tokenModule.createLoginToken(privateEnv.LOGIN_USER);

  assert.equal(
    await tokenModule.verifyConfiguredLoginToken(otherUserToken.value),
    false,
  );
  storedCookie = validToken.value;
  assert.equal(await sessionModule.verifyLoginSession(), true);
});

test('removes the cookie compatibly and remains idempotent', async () => {
  cookieSetCalls.length = 0;
  await sessionModule.deleteLoginSession();
  await sessionModule.deleteLoginSession();

  assert.equal(cookieSetCalls.length, 2);
  for (const cookie of cookieSetCalls) {
    assert.equal(cookie.name, privateEnv.LOGIN_COOKIE_NAME);
    assert.equal(cookie.value, '');
    assert.deepEqual(cookie.options, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      expires: new Date(0),
      maxAge: 0,
    });
  }
});

test('redirects an unauthenticated layout request to the login page', async () => {
  storedCookie = undefined;
  redirects.length = 0;
  await assert.rejects(
    sessionModule.requireLoginSessionOrRedirect(),
    /redirect:\/admin\/login\?redirected=true/,
  );
  assert.deepEqual(redirects, ['/admin/login?redirected=true']);
});
