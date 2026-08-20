'use server';

import { redirect } from 'next/navigation';
import { asyncDelay } from '@/lib/utils';
import { createLoginSession, verifyPassword } from '@/lib/auth';
import { serverEnv } from '@/config/env/server';

type LoginActionState = {
  username: string;
  error: string;
};

export async function loginAction(state: LoginActionState, formData: FormData) {
  if (!serverEnv.allowLogin) {
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

  const isUserNameValid = username === serverEnv.loginUser;
  const isPasswordValid = await verifyPassword(password, serverEnv.loginPass);

  if (!isUserNameValid || !isPasswordValid) {
    return {
      username,
      error: 'Invalid credentials',
    };
  }

  await createLoginSession(username);
  redirect('/admin/blog');
}
