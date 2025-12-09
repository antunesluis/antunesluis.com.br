'use server';

import {
  makePartialPublicProject,
  makePublicProjectFromDb,
  PublicProject,
} from '@/dto/project/dto';
import { verifyLoginSession } from '@/lib/login/manage-login';
import { ProjectUpdateSchema } from '@/lib/project/validation';
import { projectRepository } from '@/repositories/project';
import { getZodErrorMessages } from '@/utils/get-zod-error-messages';
import { revalidateTag } from 'next/cache';

type UpdateProjectActionState = {
  formState: PublicProject;
  errors: string[];
  success?: true;
};

export async function updateProjectAction(
  prevState: UpdateProjectActionState,
  formData: FormData,
): Promise<UpdateProjectActionState> {
  const isAuthenticated = await verifyLoginSession();

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválidos'],
    };
  }

  const id = formData.get('id')?.toString() || '';

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['ID inválido'],
    };
  }

  const formDataToObj = Object.fromEntries(formData.entries());
  const zodParsedObj = ProjectUpdateSchema.safeParse(formDataToObj);

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
      };
    }

    return {
      formState: makePartialPublicProject(formDataToObj),
      errors: ['Erro desconhecido'],
    };
  }

  revalidateTag('projects', 'fetch');
  revalidateTag(`project-${project.slug}`, 'fetch');

  return {
    formState: makePublicProjectFromDb(project),
    errors: [],
    success: true,
  };
}
