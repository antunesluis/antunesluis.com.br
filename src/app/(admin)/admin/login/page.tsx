import { ErrorMessage } from '@/components/ui';
import { LoginForm } from '@/features/auth';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function AdminLoginPage() {
  const allowLogin = Boolean(Number(process.env.ALLOW_LOGIN));
  if (!allowLogin) {
    return (
      <ErrorMessage
        statusCode='403'
        title='Login Not Allowed'
        content='Release the login system using ALLOW_LOGIN'
      />
    );
  }

  return <LoginForm />;
}
