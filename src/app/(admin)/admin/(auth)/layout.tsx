import { MenuAdmin } from '@/features/admin';
import { logoutAction } from '@/features/auth';
import { requireLoginSessionOrRedirect } from '@/lib/auth';

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  await requireLoginSessionOrRedirect();

  return (
    <>
      <MenuAdmin onLogout={logoutAction} />
      {children}
    </>
  );
}
