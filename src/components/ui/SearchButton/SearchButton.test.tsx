// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, expect, test, vi } from 'vitest';
import { SearchButton } from './SearchButton';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test('navigates to the selected result with Enter', () => {
  render(
    <SearchButton
      posts={[
        {
          slug: 'typed-cache-boundaries',
          title: 'Typed cache boundaries',
          excerpt: 'A post about keeping feature boundaries explicit.',
          author: 'Luis Antunes',
          createdAt: '2026-08-24T12:00:00.000Z',
        },
      ]}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Abrir busca' }));
  fireEvent.change(
    screen.getByPlaceholderText('Buscar posts por título, resumo ou autor...'),
    { target: { value: 'cache' } },
  );
  fireEvent.keyDown(document, { key: 'ArrowDown' });
  fireEvent.keyDown(document, { key: 'Enter' });

  expect(mocks.push).toHaveBeenCalledWith('/blog/typed-cache-boundaries');
  expect(screen.queryByRole('dialog')).toBeNull();
});
