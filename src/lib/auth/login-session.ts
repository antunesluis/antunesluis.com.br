import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { serverEnv } from '@/config/env/server';
import {
  createLoginToken,
  verifyConfiguredLoginToken,
} from './login-token';

type NodeEnvironment = 'development' | 'test' | 'production';

export function getLoginCookieOptions(
  expires: Date,
  nodeEnv: NodeEnvironment = serverEnv.nodeEnv,
) {
  return {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: 'strict' as const,
    path: '/',
    expires,
  };
}

export async function createLoginSession(username: string) {
  const token = await createLoginToken(username);
  const cookieStore = await cookies();

  cookieStore.set(
    serverEnv.loginCookieName,
    token.value,
    getLoginCookieOptions(token.expiresAt),
  );
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();

  cookieStore.set(serverEnv.loginCookieName, '', {
    ...getLoginCookieOptions(new Date(0)),
    maxAge: 0,
  });
}

export async function getLoginSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(serverEnv.loginCookieName)?.value;

  return verifyConfiguredLoginToken(token);
}

export async function verifyLoginSession() {
  return Boolean(await getLoginSession());
}

export async function requireLoginSessionOrRedirect() {
  if (!(await verifyLoginSession())) {
    redirect('/admin/login?redirected=true');
  }
}
