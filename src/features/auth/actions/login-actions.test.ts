import assert from 'node:assert/strict';
import { beforeAll, beforeEach, test, vi } from 'vitest';
import { LoginSchema } from '../lib/validation';

const mocks = vi.hoisted(() => ({
  serverEnv: {
    allowLogin: true,
    loginUser: 'admin',
    loginPass: 'encoded-hash',
  },
  verifiedPasswords: [] as Array<[string, string]>,
  createdSessions: [] as string[],
  deletedSessions: 0,
  passwordIsValid: false,
  redirects: [] as string[],
}));

vi.mock('@/config/env/server', () => ({ serverEnv: mocks.serverEnv }));
vi.mock('@/lib/auth', () => ({
  createLoginSession: async (username: string) => {
    mocks.createdSessions.push(username);
  },
  deleteLoginSession: async () => {
    mocks.deletedSessions += 1;
  },
  verifyPassword: async (password: string, hash: string) => {
    mocks.verifiedPasswords.push([password, hash]);
    return mocks.passwordIsValid;
  },
}));
vi.mock('next/navigation', () => ({
  redirect: (url: string): never => {
    mocks.redirects.push(url);
    throw new Error(`redirect:${url}`);
  },
}));

let loginAction: typeof import('./login-action').loginAction;
let logoutAction: typeof import('./logout-action').logoutAction;

beforeAll(async () => {
  ({ loginAction } = await import('./login-action'));
  ({ logoutAction } = await import('./logout-action'));
});
beforeEach(() => {
  mocks.serverEnv.allowLogin = true;
  mocks.passwordIsValid = false;
  mocks.verifiedPasswords.length = 0;
  mocks.createdSessions.length = 0;
  mocks.deletedSessions = 0;
  mocks.redirects.length = 0;
});

const initialState = { username: '', error: '' };

test('validates textual non-empty credentials and normalizes only username', () => {
  assert.deepEqual(
    LoginSchema.parse({ username: ' admin ', password: ' secret ' }),
    { username: 'admin', password: ' secret ' },
  );
  assert.equal(
    LoginSchema.safeParse({ username: '', password: 'secret' }).success,
    false,
  );
  assert.equal(
    LoginSchema.safeParse({ username: 'admin', password: '' }).success,
    false,
  );
  assert.equal(
    LoginSchema.safeParse({ username: 123, password: 'secret' }).success,
    false,
  );
});

test('returns one generic error for malformed, empty and incorrect input', async () => {
  const emptyForm = new FormData();
  emptyForm.set('username', '');
  emptyForm.set('password', '');
  const unknownUserForm = new FormData();
  unknownUserForm.set('username', 'unknown');
  unknownUserForm.set('password', 'secret');
  const wrongPasswordForm = new FormData();
  wrongPasswordForm.set('username', 'admin');
  wrongPasswordForm.set('password', 'wrong');

  const results = [
    await loginAction(initialState, {} as FormData),
    await loginAction(initialState, emptyForm),
    await loginAction(initialState, unknownUserForm),
    await loginAction(initialState, wrongPasswordForm),
  ];
  assert.deepEqual(
    results.map(result => result.error),
    [
      'Invalid credentials',
      'Invalid credentials',
      'Invalid credentials',
      'Invalid credentials',
    ],
  );
  assert.equal(mocks.createdSessions.length, 0);
});

test('blocks disabled login before comparing credentials', async () => {
  mocks.serverEnv.allowLogin = false;
  const result = await loginAction(initialState, new FormData());

  assert.deepEqual(result, { username: '', error: 'Login not allowed' });
  assert.equal(mocks.verifiedPasswords.length, 0);
  assert.equal(mocks.createdSessions.length, 0);
});

test('preserves password, creates the session and redirects valid login', async () => {
  mocks.passwordIsValid = true;
  const formData = new FormData();
  formData.set('username', ' admin ');
  formData.set('password', ' secret ');

  await assert.rejects(
    loginAction(initialState, formData),
    /redirect:\/admin\/blog/,
  );
  assert.deepEqual(mocks.verifiedPasswords, [[' secret ', 'encoded-hash']]);
  assert.deepEqual(mocks.createdSessions, ['admin']);
  assert.deepEqual(mocks.redirects, ['/admin/blog']);
});

test('deletes an absent or existing session and redirects logout immediately', async () => {
  await assert.rejects(logoutAction(), /redirect:\//);
  assert.equal(mocks.deletedSessions, 1);
  assert.deepEqual(mocks.redirects, ['/']);
});
