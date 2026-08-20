import 'server-only';

import { z } from 'zod';
import { httpUrlSchema, parseEnv } from './parse-env.server';

type ServerEnvSource = {
  IMAGE_UPLOAD_DIRECTORY: string | undefined;
  IMAGE_SERVER_URL: string | undefined;
  JWT_SECRET_KEY: string | undefined;
  LOGIN_USER: string | undefined;
  LOGIN_PASS: string | undefined;
  LOGIN_EXPIRATION_SECONDS: string | undefined;
  LOGIN_COOKIE_NAME: string | undefined;
  ALLOW_LOGIN: string | undefined;
  NODE_ENV: string | undefined;
};

function isCanonicalBcryptBase64(value: string) {
  let decoded: string;

  try {
    decoded = atob(value);
  } catch {
    return false;
  }

  return (
    btoa(decoded) === value &&
    /^\$2[aby]\$(0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/.test(decoded)
  );
}

export const serverEnvSchema = z.object({
  imageUploadDirectory: z.string().min(1).default('uploads'),
  imageServerUrl: httpUrlSchema
    .refine(value => !value.endsWith('/'))
    .default('http://localhost:3000/uploads'),
  jwtSecretKey: z
    .string()
    .min(32)
    .refine(value => value !== 'your_jwt_secret_key_here'),
  loginUser: z
    .string()
    .refine(value => value.length > 0 && value === value.trim()),
  loginPass: z.string().refine(isCanonicalBcryptBase64),
  loginExpirationSeconds: z.coerce.number().int().positive().safe(),
  loginCookieName: z.string().regex(/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/),
  allowLogin: z.enum(['0', '1']).transform(value => value === '1'),
  nodeEnv: z.enum(['development', 'test', 'production']),
});

const serverEnvRules = {
  imageUploadDirectory: {
    name: 'IMAGE_UPLOAD_DIRECTORY',
    description: 'must be a non-empty directory path',
  },
  imageServerUrl: {
    name: 'IMAGE_SERVER_URL',
    description: 'must be an HTTP or HTTPS URL without a trailing slash',
  },
  jwtSecretKey: {
    name: 'JWT_SECRET_KEY',
    description:
      'is required, must not use the documented placeholder and must contain at least 32 characters',
  },
  loginUser: {
    name: 'LOGIN_USER',
    description:
      'is required, must be a non-empty string and must not contain external whitespace',
  },
  loginPass: {
    name: 'LOGIN_PASS',
    description: 'is required and must be canonical Base64 for a bcrypt hash',
  },
  loginExpirationSeconds: {
    name: 'LOGIN_EXPIRATION_SECONDS',
    description: 'must be a positive safe integer',
  },
  loginCookieName: {
    name: 'LOGIN_COOKIE_NAME',
    description: 'is required and must be a valid HTTP cookie name',
  },
  allowLogin: {
    name: 'ALLOW_LOGIN',
    description: 'must be explicitly set to 0 or 1',
  },
  nodeEnv: {
    name: 'NODE_ENV',
    description: 'must be development, test or production',
  },
};

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(source: ServerEnvSource): ServerEnv {
  return parseEnv(
    serverEnvSchema,
    {
      imageUploadDirectory: source.IMAGE_UPLOAD_DIRECTORY,
      imageServerUrl: source.IMAGE_SERVER_URL,
      jwtSecretKey: source.JWT_SECRET_KEY,
      loginUser: source.LOGIN_USER,
      loginPass: source.LOGIN_PASS,
      loginExpirationSeconds: source.LOGIN_EXPIRATION_SECONDS,
      loginCookieName: source.LOGIN_COOKIE_NAME,
      allowLogin: source.ALLOW_LOGIN,
      nodeEnv: source.NODE_ENV,
    },
    serverEnvRules,
  );
}

export const serverEnv = parseServerEnv({
  IMAGE_UPLOAD_DIRECTORY: process.env.IMAGE_UPLOAD_DIRECTORY,
  IMAGE_SERVER_URL: process.env.IMAGE_SERVER_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  LOGIN_USER: process.env.LOGIN_USER,
  LOGIN_PASS: process.env.LOGIN_PASS,
  LOGIN_EXPIRATION_SECONDS: process.env.LOGIN_EXPIRATION_SECONDS,
  LOGIN_COOKIE_NAME: process.env.LOGIN_COOKIE_NAME,
  ALLOW_LOGIN: process.env.ALLOW_LOGIN,
  NODE_ENV: process.env.NODE_ENV,
});
