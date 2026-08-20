// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { ImageUploader } from './ImageUploader';

const mocks = vi.hoisted(() => ({
  uploadImageAction: vi.fn(),
  dismissToast: vi.fn(),
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

vi.mock('@/components/ui', async () => {
  const { createElement } = await import('react');

  return {
    Button: ({
      children,
      className,
      disabled,
      onClick,
      type,
    }: React.ComponentProps<'button'> & {
      variant?: string;
      size?: string;
    }) =>
      createElement('button', { className, disabled, onClick, type }, children),
  };
});
vi.mock('@/config/env/public', () => ({
  publicEnv: { imageUploadMaxSize: 4 },
}));
vi.mock('../actions/upload-image-action', () => ({
  uploadImageAction: mocks.uploadImageAction,
}));
vi.mock('lucide-react', () => ({ ImageUpIcon: () => null }));
vi.mock('react-toastify', () => ({
  toast: {
    dismiss: mocks.dismissToast,
    error: mocks.showErrorToast,
    success: mocks.showSuccessToast,
  },
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test('rejects an oversized image before invoking the upload action', () => {
  const { container } = render(<ImageUploader />);
  const input = container.querySelector('input[type="file"]');
  const file = new File(['12345'], 'oversized.png', {
    type: 'image/png',
  });

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('Expected the image file input to be rendered');
  }

  fireEvent.change(input, { target: { files: [file] } });

  expect(mocks.dismissToast).toHaveBeenCalledOnce();
  expect(mocks.showErrorToast).toHaveBeenCalledWith(
    'Image too large. Maximum size is 0.00KB.',
  );
  expect(mocks.uploadImageAction).not.toHaveBeenCalled();
  expect(screen.queryByRole('img')).toBeNull();
});
