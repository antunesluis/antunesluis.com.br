'use server';

import { redirect } from 'next/navigation';
import { asyncDelay } from '@/lib/utils';
import { deleteLoginSession } from '@/lib/auth';

export async function logoutAction() {
  await asyncDelay(3000); // Vou Manter
  await deleteLoginSession();
  redirect('/');
}
