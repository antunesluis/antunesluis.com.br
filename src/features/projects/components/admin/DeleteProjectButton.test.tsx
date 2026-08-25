// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { DeleteProjectButton } from './DeleteProjectButton';

const mocks = vi.hoisted(() => ({
  deleteProjectAction: vi.fn(),
  dismissToast: vi.fn(),
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

vi.mock('../../actions/delete-project-action', () => ({
  deleteProjectAction: mocks.deleteProjectAction,
}));
vi.mock('lucide-react', () => ({ Trash2Icon: () => null }));
vi.mock('react-toastify', () => ({
  toast: {
    dismiss: mocks.dismissToast,
    success: mocks.showSuccessToast,
    error: mocks.showErrorToast,
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test('confirms a project deletion exactly once through the existing action contract', async () => {
  const user = userEvent.setup();
  mocks.deleteProjectAction.mockResolvedValue({ success: true, errors: [] });
  render(<DeleteProjectButton id='project-1' title='Personal blog' />);

  await user.click(
    screen.getByRole('button', { name: 'Delete project Personal blog' }),
  );
  await user.click(screen.getByRole('button', { name: 'Excluir' }));

  await waitFor(() =>
    expect(mocks.deleteProjectAction).toHaveBeenCalledWith('project-1'),
  );
  expect(mocks.deleteProjectAction).toHaveBeenCalledOnce();
  expect(mocks.showSuccessToast).toHaveBeenCalledWith(
    'Project "Personal blog" deleted successfully!',
  );
});
