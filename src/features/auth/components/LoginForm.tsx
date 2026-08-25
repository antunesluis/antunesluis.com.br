'use client';

import clsx from 'clsx';
import { HourglassIcon, LogInIcon } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loginAction } from '../actions/login-action';
import { Button } from '@/components/ui/Button';
import { InputText } from '@/components/ui/InputText';

export function LoginForm() {
  const initialState = {
    username: '',
    error: '',
  };
  const [state, action, isPending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast.dismiss();
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div
      className={clsx(
        'flex items-center justify-center',
        'mt-8',
        'text-foreground',
      )}
    >
      <form
        action={action}
        className='flex-1 flex flex-col gap-6'
        aria-busy={isPending}
      >
        <InputText
          type='text'
          name='username'
          labelText='Usuário'
          placeholder='Seu usuário'
          disabled={isPending}
          defaultValue={state.username}
        />

        <InputText
          type='password'
          name='password'
          labelText='Senha'
          placeholder='Sua senha'
          disabled={isPending}
        />

        <Button disabled={isPending} type='submit' className='mt-4'>
          {isPending ? <HourglassIcon /> : <LogInIcon />}
          {isPending ? 'Entrando...' : 'Entrar'}
        </Button>

        {!!state.error && (
          <p className='text-error' aria-live='polite'>
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
