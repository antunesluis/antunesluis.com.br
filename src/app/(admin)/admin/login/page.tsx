import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { serverEnv } from '@/config/env/server';
import { LoginForm } from '@/features/auth';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function AdminLoginPage() {
  if (!serverEnv.allowLogin) {
    return (
      <ErrorMessage
        statusCode='403'
        title='Login Not Allowed'
        content='Release the login system using ALLOW_LOGIN'
      />
    );
  }

  return (
    <>
      <h1 className='sr-only'>Login administrativo</h1>
      <LoginForm />
    </>
  );
}
