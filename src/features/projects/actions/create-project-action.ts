'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';
import { makePartialPublicProject, PublicProject } from '../dto/project-dto';
import { ProjectCreateSchema } from '../lib/validation';
import { getZodErrorMessages, makeSlugFromText } from '@/lib/utils';
import { ProjectModel } from '../models/project-model';
import { projectRepository } from '../repositories';
import { verifyLoginSession } from '@/lib/auth';
import type { FormActionState } from '@/lib/action-result';
import { PROJECTS_CACHE_TAG } from '../lib/cache-tags';

type CreateProjectActionState = FormActionState<PublicProject>;

export async function createProjectAction(
  prevState: CreateProjectActionState,
  formData: FormData,
): Promise<CreateProjectActionState> {
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

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = ProjectCreateSchema.safeParse(formDataToObj);

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicProject(formDataToObj),
      success: false,
    };
  }

  const validProjectData = zodParsedObj.data;
  const newProject: ProjectModel = {
    ...validProjectData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidV4(),
    slug: makeSlugFromText(validProjectData.name),
  };

  try {
    await projectRepository.create(newProject);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: newProject,
        errors: [e.message],
        success: false,
      };
    }

    return {
      formState: newProject,
      errors: ['Unknown error'],
      success: false,
    };
  }

  updateTag(PROJECTS_CACHE_TAG);
  redirect(`/admin/projects/${newProject.id}?created=1`);
}
