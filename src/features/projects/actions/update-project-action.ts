'use server';

import { updateTag } from 'next/cache';
import {
  makePartialPublicProject,
  makePublicProjectFromDb,
  PublicProject,
} from '../dto/project-dto';
import { ProjectUpdateSchema } from '../lib/validation';
import { getZodErrorMessages } from '@/lib/utils';
import { projectRepository } from '../repositories';
import { verifyLoginSession } from '@/lib/auth';
import type { FormActionState } from '@/lib/action-result';
import {
  getProjectCacheTag,
  PROJECTS_CACHE_TAG,
} from '../lib/cache-tags';

type UpdateProjectActionState = FormActionState<PublicProject>;

export async function updateProjectAction(
  prevState: UpdateProjectActionState,
  formData: FormData,
): Promise<UpdateProjectActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!isAuthenticated) {
    return {
      formState: prevState.formState,
      errors: ['Log in again before continuing'],
      success: false,
    };
  }

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Invalid data'],
      success: false,
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['Invalid ID'],
      success: false,
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = ProjectUpdateSchema.safeParse(formDataToObj);

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicProject(formDataToObj),
      success: false,
    };
  }

  const validProjectData = zodParsedObj.data;
  const newProject = {
    ...validProjectData,
  };

  let project;
  try {
    project = await projectRepository.update(id, newProject);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePartialPublicProject(formDataToObj),
        errors: [e.message],
        success: false,
      };
    }

    return {
      formState: makePartialPublicProject(formDataToObj),
      errors: ['Unknown error'],
      success: false,
    };
  }

  updateTag(PROJECTS_CACHE_TAG);
  updateTag(getProjectCacheTag(project.slug));

  return {
    formState: makePublicProjectFromDb(project),
    errors: [],
    success: true,
  };
}
