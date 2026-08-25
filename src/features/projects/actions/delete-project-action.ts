'use server';

import { updateTag } from 'next/cache';
import { projectRepository } from '../repositories';
import { verifyLoginSession } from '@/lib/auth';
import type { ActionResult } from '@/lib/action-result';
import {
  getProjectCacheTag,
  PROJECTS_CACHE_TAG,
} from '../lib/cache-tags';

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      errors: ['Log in again before continuing'],
      success: false,
    };
  }

  if (!id || typeof id !== 'string') {
    return {
      errors: ['Invalid data'],
      success: false,
    };
  }

  let project;
  try {
    project = await projectRepository.delete(id);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        errors: [e.message],
        success: false,
      };
    }

    return {
      errors: ['Unknown error'],
      success: false,
    };
  }

  updateTag(PROJECTS_CACHE_TAG);
  updateTag(getProjectCacheTag(project.slug));

  return {
    errors: [],
    success: true,
  };
}
