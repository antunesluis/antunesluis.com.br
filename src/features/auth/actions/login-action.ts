'use server';

import { redirect } from 'next/navigation';
import { createLoginSession, verifyPassword } from '@/lib/auth';
import { serverEnv } from '@/config/env/server';
import { LoginSchema } from '../lib/validation';

type LoginActionState = {
  username: string;
  error: string;
};

const invalidCredentialsState = (username = '') => ({
  username,
  error: 'Invalid credentials',
});

export async function loginAction(
  _state: LoginActionState,
  formData: FormData,
) {
  if (!serverEnv.allowLogin) {
    return {
      username: '',
      error: 'Login not allowed',
    };
  }

  if (!(formData instanceof FormData)) {
    return invalidCredentialsState();
  }

  const parsedCredentials = LoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!parsedCredentials.success) {
    const username = formData.get('username');
    return invalidCredentialsState(
      typeof username === 'string' ? username.trim() : '',
    );
  }

  const { username, password } = parsedCredentials.data;
  const isUserNameValid = username === serverEnv.loginUser;
  const isPasswordValid = await verifyPassword(password, serverEnv.loginPass);

  if (!isUserNameValid || !isPasswordValid) {
    return invalidCredentialsState(username);
  }

  await createLoginSession(username);
  redirect('/admin/blog');
}
