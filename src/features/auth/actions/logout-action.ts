'use server';

import { redirect } from 'next/navigation';
import { deleteLoginSession } from '@/lib/auth';

export async function logoutAction() {
  await deleteLoginSession();
  redirect('/');
}
