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
    <div className='mx-auto mt-16 mb-32 max-w-sm'>
      <h1 className='text-2xl font-extrabold text-foreground'>
        Login administrativo
      </h1>
      <LoginForm />
    </div>
  );
}
