'use server';

import { redirect } from 'next/navigation';
import { asyncDelay } from '@/lib/utils';
import { createLoginSession, verifyPassword } from '@/lib/auth';

type LoginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));
  if (!allowLogin) {
    return {
      username: '',
      error: 'Login not allowed',
    };
  }

  await asyncDelay(3000); // Vou Manter por segurança

  if (!(formData instanceof FormData)) {
    return {
      username: '',
      error: 'Invalid Data',
    };
  }

  const username = formData.get('username')?.toString().trim() || '';
  const password = formData.get('password')?.toString().trim() || '';

  if (!password || !username) {
    return {
      username,
      error: 'Enter username and password',
    };
  }

  const isUserNameValid = username === process.env.LOGIN_USER;
  const isPasswordValid = await verifyPassword(
    password,
    process.env.LOGIN_PASS || '',
  );

  if (!isUserNameValid || !isPasswordValid) {
    return {
      username,
      error: 'Invalid credentials',
    };
  }

  await createLoginSession(username);
  redirect('/admin/blog');
}
