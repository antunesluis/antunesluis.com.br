'use server';

import { makePartialPublicProject, PublicProject } from '@/dto/project/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import { ProjectCreateSchema } from '@/lib/project/validation';
import { ProjectModel } from '@/models/project/project-model';
import { projectRepository } from '@/repositories/project';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { makeSlugFromText } from '@/utils/make-slug-from-text';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';

type CreateProjectActionState = {
  formState: PublicProject;
  errors: string[];
  success?: true;
};

export async function createProjectAction(
  prevState: CreateProjectActionState,
  formData: FormData,
) {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = ProjectCreateSchema.safeParse(formDataToObj);

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicProject(formDataToObj),
      errors: ['Log in to another tab before continuing'],
    };
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error);
    return {
      errors,
      formState: makePartialPublicProject(formDataToObj),
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
      };
    }

    return {
      formState: newProject,
      errors: ['Erro desconhecido'],
    };
  }

  revalidateTag('projects');
  redirect(`/admin/projects/${newProject.id}?created=1`);
}
