import type { Metadata } from 'next';
import { ToastifyContainer } from '@/components/ui/ToastifyContainer';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  description: null,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
  },
};

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <>
      {children}
      <ToastifyContainer />
    </>
  );
}
