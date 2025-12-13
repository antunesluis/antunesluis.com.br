'use server';

import { verifyLoginSession } from '@/lib/login/manage-login';
import { projectRepository } from '@/repositories/project';
import { updateTag } from 'next/cache';

export async function deleteProjectAction(id: string) {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      errors: ['Log in again before continuing'],
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      error: 'Invalid data',
    };
  }

  let project;
  try {
    project = await projectRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }

    return {
      error: 'Unknown error',
    };
  }

  updateTag('projects');
  updateTag(`project-${project.slug}`);

  return {
    error: '',
  };
}
