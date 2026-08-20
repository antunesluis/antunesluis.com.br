import assert from 'node:assert/strict';
import { before, beforeEach, mock, test } from 'node:test';
import { LoginSchema } from '../lib/validation';

const serverEnv = {
  allowLogin: true,
  loginUser: 'admin',
  loginPass: 'encoded-hash',
};
const verifiedPasswords: Array<[string, string]> = [];
const createdSessions: string[] = [];
let deletedSessions = 0;
let passwordIsValid = false;

mock.module('@/config/env/server', { namedExports: { serverEnv } });
mock.module('@/lib/auth', {
  namedExports: {
    createLoginSession: async (username: string) => {
      createdSessions.push(username);
    },
    deleteLoginSession: async () => {
      deletedSessions += 1;
    },
    verifyPassword: async (password: string, hash: string) => {
      verifiedPasswords.push([password, hash]);
      return passwordIsValid;
    },
  },
});
const redirects: string[] = [];
mock.module('next/navigation', {
  namedExports: {
    redirect: (url: string): never => {
      redirects.push(url);
      throw new Error(`redirect:${url}`);
    },
  },
});

let loginAction: typeof import('./login-action').loginAction;
let logoutAction: typeof import('./logout-action').logoutAction;

before(async () => {
  ({ loginAction } = await import('./login-action'));
  ({ logoutAction } = await import('./logout-action'));
});
beforeEach(() => {
  serverEnv.allowLogin = true;
  passwordIsValid = false;
  verifiedPasswords.length = 0;
  createdSessions.length = 0;
  deletedSessions = 0;
  redirects.length = 0;
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
  assert.equal(createdSessions.length, 0);
});

test('blocks disabled login before comparing credentials', async () => {
  serverEnv.allowLogin = false;
  const result = await loginAction(initialState, new FormData());

  assert.deepEqual(result, { username: '', error: 'Login not allowed' });
  assert.equal(verifiedPasswords.length, 0);
  assert.equal(createdSessions.length, 0);
});

test('preserves password, creates the session and redirects valid login', async () => {
  passwordIsValid = true;
  const formData = new FormData();
  formData.set('username', ' admin ');
  formData.set('password', ' secret ');

  await assert.rejects(
    loginAction(initialState, formData),
    /redirect:\/admin\/blog/,
  );
  assert.deepEqual(verifiedPasswords, [[' secret ', 'encoded-hash']]);
  assert.deepEqual(createdSessions, ['admin']);
  assert.deepEqual(redirects, ['/admin/blog']);
});

test('deletes an absent or existing session and redirects logout immediately', async () => {
  await assert.rejects(logoutAction(), /redirect:\//);
  assert.equal(deletedSessions, 1);
  assert.deepEqual(redirects, ['/']);
});
