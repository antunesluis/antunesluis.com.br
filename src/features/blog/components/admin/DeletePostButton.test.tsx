// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import { DeletePostButton } from './DeletePostButton';

const mocks = vi.hoisted(() => ({
  deletePostAction: vi.fn(),
  dismissToast: vi.fn(),
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

vi.mock('../../actions/delete-post-action', () => ({
  deletePostAction: mocks.deletePostAction,
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

test('confirms a post deletion exactly once through the existing action contract', async () => {
  const user = userEvent.setup();
  mocks.deletePostAction.mockResolvedValue({ success: true, errors: [] });
  render(<DeletePostButton id='post-1' title='Typed cache boundaries' />);

  await user.click(
    screen.getByRole('button', {
      name: 'Delete post Typed cache boundaries',
    }),
  );
  await user.click(screen.getByRole('button', { name: 'Excluir' }));

  await waitFor(() =>
    expect(mocks.deletePostAction).toHaveBeenCalledWith('post-1'),
  );
  expect(mocks.deletePostAction).toHaveBeenCalledOnce();
  expect(mocks.showSuccessToast).toHaveBeenCalledWith(
    'Post "Typed cache boundaries" deleted successfully!',
  );
});
