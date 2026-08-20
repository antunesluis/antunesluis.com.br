import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import { serverEnv } from '@/config/env/server';

const jwtEncodedKey = new TextEncoder().encode(serverEnv.jwtSecretKey);

type JwtPayload = {
  username: string;
  expiresAt: Date;
};

export async function createLoginSession(username: string) {
  const expiresAt = new Date(
    Date.now() + serverEnv.loginExpirationSeconds * 1000,
  );
  const loginSession = await signJwt({ username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(serverEnv.loginCookieName, loginSession, {
    // read only by the server
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: expiresAt,
  });
}

export async function deleteLoginSession() {
  const cookieStore = await cookies();
  cookieStore.set(serverEnv.loginCookieName, '', {
    expires: new Date(0),
  });
  cookieStore.delete(serverEnv.loginCookieName);
}

export async function getLoginSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(serverEnv.loginCookieName)?.value;

  if (!jwt) return false;

  return verifyJwt(jwt);
}

export async function requireLoginSessionOrRedirect() {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    redirect('/admin/login?redirected=true');
  }
}

export async function verifyLoginSession() {
  const jwtPayload = await getLoginSession();

  if (!jwtPayload) return false;

  return jwtPayload.username === serverEnv.loginUser;
}

export async function signJwt(jwtPayload: JwtPayload) {
  return new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(
      Math.floor(Date.now() / 1000) + serverEnv.loginExpirationSeconds,
    )
    .sign(jwtEncodedKey);
}

export async function verifyJwt(jwt: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(jwt, jwtEncodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return false;
  }
}
