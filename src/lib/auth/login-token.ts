import { jwtVerify, SignJWT } from 'jose';
import { serverEnv } from '@/config/env/server';

const jwtEncodedKey = new TextEncoder().encode(serverEnv.jwtSecretKey);

export type LoginTokenPayload = {
  username: string;
  iat: number;
  exp: number;
};

type LoginToken = {
  value: string;
  expiresAt: Date;
};

export async function createLoginToken(
  username: string,
  now = new Date(),
): Promise<LoginToken> {
  const issuedAt = Math.floor(now.getTime() / 1000);
  const expiresAtSeconds = issuedAt + serverEnv.loginExpirationSeconds;
  const value = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAtSeconds)
    .sign(jwtEncodedKey);

  return {
    value,
    expiresAt: new Date(expiresAtSeconds * 1000),
  };
}

export async function verifyLoginToken(
  token: string | undefined,
): Promise<LoginTokenPayload | false> {
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, jwtEncodedKey, {
      algorithms: ['HS256'],
    });

    if (
      typeof payload.username !== 'string' ||
      !Number.isSafeInteger(payload.iat) ||
      !Number.isSafeInteger(payload.exp) ||
      (payload.iat as number) >= (payload.exp as number)
    ) {
      return false;
    }

    return {
      username: payload.username,
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch {
    return false;
  }
}

export async function verifyConfiguredLoginToken(
  token: string | undefined,
): Promise<LoginTokenPayload | false> {
  const payload = await verifyLoginToken(token);

  if (!payload || payload.username !== serverEnv.loginUser) return false;

  return payload;
}
