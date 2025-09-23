'use client';

import { createProjectAction } from '@/actions/project/create-project-action';
import { updateProjectAction } from '@/actions/project/update-project-action';
import { InputText } from '@/components/ui/InputText';
import { makePartialPublicProject, PublicProject } from '@/dto/project/dto';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ImageUploader } from '../ImageUploader';
import { MarkdownEditor } from '@/components/ui/MarkdownEditor';
import { Button } from '@/components/ui/Button';
import { InputCheckbox } from '@/components/ui/InputCheckbox';

type ManageProjectFormUpdateProps = {
  mode: 'update';
  publicProject: PublicProject;
};

type ManageProjectFormCreateProps = {
  mode: 'create';
};

type ManageProjectFormProps =
  | ManageProjectFormUpdateProps
  | ManageProjectFormCreateProps;

export function ManageProjectForm(props: ManageProjectFormProps) {
  const { mode } = props;
  const searchParams = useSearchParams();
  const created = searchParams.get('created');
  const router = useRouter();

  let publicProject;
  if (mode === 'update') {
    publicProject = props.publicProject;
  }

  const actionsMap = {
    update: updateProjectAction,
    create: createProjectAction,
  };

  const initialState = {
    formState: makePartialPublicProject(publicProject),
    errors: [],
  };

  const [state, action, isPending] = useActionState(
    actionsMap[mode],
    initialState,
  );

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss();
      state.errors.forEach(error => toast.error(error));
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.success) {
      toast.dismiss();
      toast.success('Post updated successfully!');
    }
  }, [state]);

  useEffect(() => {
    if (created === '1') {
      toast.dismiss();
      toast.success('Post created successfully!');
      const url = new URL(window.location.href);
      url.searchParams.delete('created');
      router.replace(url.toString());
    }
  }, [created, router]);

  const { formState } = state;
  const [contentValue, setContentValue] = useState(
    publicProject?.content || '',
  );

  return (
    <form action={action} className='mb-16'>
      <div className='flex flex-col gap-6'>
        <InputText
          labelText='ID'
          name='id'
          placeholder='Auto-generated ID'
          type='text'
          defaultValue={formState.id}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText='Slug'
          name='slug'
          placeholder='Auto-generated slug'
          type='text'
          defaultValue={formState.slug}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText='Name'
          name='name'
          placeholder='Enter the project name'
          type='text'
          defaultValue={formState.name}
          disabled={isPending}
        />

        <InputText
          labelText='Description'
          name='description'
          placeholder='Enter the project description'
          type='text'
          defaultValue={formState.description}
          disabled={isPending}
        />

        <InputText
          labelText='Tech Stack'
          name='techStack'
          placeholder='Enter the project tech stack list (separated by commas)'
          type='text'
          defaultValue={formState.techStack}
          disabled={isPending}
        />

        <MarkdownEditor
          labelText='Content'
          value={contentValue}
          setValue={setContentValue}
          textAreaName='content'
          disabled={isPending}
        />

        <InputText
          labelText='Repository URL'
          name='repositoryUrl'
          placeholder='Enter the repository URL'
          type='text'
          defaultValue={formState.repositoryUrl}
          disabled={isPending}
        />

        <InputText
          labelText='Deploy URL'
          name='deployUrl'
          placeholder='Enter the deploy URL'
          type='text'
          defaultValue={formState.deployUrl}
          disabled={isPending}
        />

        <ImageUploader disabled={isPending} />

        <InputText
          labelText='Cover image URL'
          name='coverImageUrl'
          placeholder='Digite a url da imagem'
          type='text'
          defaultValue={formState.coverImageUrl}
          disabled={isPending}
        />

        <InputCheckbox
          labelText='Publish?'
          name='published'
          type='checkbox'
          defaultChecked={formState.published}
          disabled={isPending}
        />

        <div className='mt-4'>
          <Button disabled={isPending} type='submit'>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
