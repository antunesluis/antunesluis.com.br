// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { ConfirmationDialog } from './ConfirmationDialog';

afterEach(() => {
  cleanup();
});

function renderDialog(onConfirm = vi.fn().mockResolvedValue(undefined)) {
  render(
    <ConfirmationDialog
      title='Delete post?'
      content='This action cannot be undone.'
      onConfirm={onConfirm}
      trigger={
        <button type='button' aria-label='Delete post'>
          Delete
        </button>
      }
    />,
  );

  return { onConfirm };
}

test('opens, contains focus, closes with Escape, and restores focus to the trigger', async () => {
  const user = userEvent.setup();
  renderDialog();

  const trigger = screen.getByRole('button', { name: 'Delete post' });
  await user.click(trigger);

  const dialog = await screen.findByRole('alertdialog');
  const cancel = screen.getByRole('button', { name: 'Cancelar' });
  const confirm = screen.getByRole('button', { name: 'Ok' });

  await waitFor(() => expect(document.activeElement).toBe(cancel));
  await user.tab();
  expect(document.activeElement).toBe(confirm);
  await user.tab();
  await waitFor(() => expect(document.activeElement).toBe(cancel));
  await user.tab({ shift: true });
  await waitFor(() => expect(document.activeElement).toBe(confirm));

  await user.keyboard('{Escape}');

  await waitFor(() => expect(dialog.isConnected).toBe(false));
  expect(document.activeElement).toBe(trigger);
});

test('disables interaction and runs the confirmation action only once while pending', async () => {
  const user = userEvent.setup();
  let resolveConfirmation: (() => void) | undefined;
  const onConfirm = vi.fn(
    () =>
      new Promise<void>(resolve => {
        resolveConfirmation = resolve;
      }),
  );
  renderDialog(onConfirm);

  const trigger = screen.getByRole('button', { name: 'Delete post' });
  await user.click(trigger);

  const dialog = await screen.findByRole('alertdialog');
  const confirm = screen.getByRole('button', { name: 'Ok' });
  await user.click(confirm);
  await user.click(confirm);

  expect(onConfirm).toHaveBeenCalledOnce();
  expect(dialog.getAttribute('aria-busy')).toBe('true');
  expect((confirm as HTMLButtonElement).disabled).toBe(true);
  expect(
    (screen.getByRole('button', { name: 'Cancelar' }) as HTMLButtonElement)
      .disabled,
  ).toBe(true);

  await user.keyboard('{Escape}');
  expect(dialog.isConnected).toBe(true);

  resolveConfirmation?.();

  await waitFor(() => expect(dialog.isConnected).toBe(false));
  expect(document.activeElement).toBe(trigger);
});
