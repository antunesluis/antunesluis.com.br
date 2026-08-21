import { Buffer } from 'node:buffer';
import { expect, test } from 'vitest';
import { hashPassword, verifyPassword } from './password-hashing';

test('hashes as Base64 bcrypt and accepts only the exact original password', async () => {
  const password = '  exact password with spaces  ';
  const base64Hash = await hashPassword(password);
  const decodedHash = Buffer.from(base64Hash, 'base64').toString('utf8');

  expect(decodedHash).toMatch(/^\$2[aby]\$10\$/);
  await expect(verifyPassword(password, base64Hash)).resolves.toBe(true);
  await expect(verifyPassword(password.trim(), base64Hash)).resolves.toBe(
    false,
  );
  await expect(verifyPassword(`${password}!`, base64Hash)).resolves.toBe(false);
});
