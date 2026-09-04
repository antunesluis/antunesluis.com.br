// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, expect, test, vi } from 'vitest';
import { SearchButton } from './SearchButton';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));
vi.mock('next/link', async () => {
  const { forwardRef } = await import('react');

  return {
    default: forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
      ({ onClick, ...props }, ref) => (
        <a
          {...props}
          ref={ref}
          onClick={event => {
            event.preventDefault();
            onClick?.(event);
          }}
        />
      ),
    ),
  };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const posts = [
  {
    slug: 'typed-cache-boundaries',
    title: 'Typed cache boundaries',
    excerpt: 'A post about keeping feature boundaries explicit.',
    author: 'Luis Antunes',
    createdAt: '2026-08-24T12:00:00.000Z',
  },
];

test('navigates to the selected result with Enter', async () => {
  const user = userEvent.setup();
  render(<SearchButton posts={posts} />);

  await user.click(screen.getByRole('button', { name: 'Abrir busca' }));
  const input = await screen.findByRole('combobox', { name: 'Buscar posts' });
  await user.type(input, 'cache');
  await user.keyboard('{Enter}');

  expect(mocks.push).toHaveBeenCalledWith('/blog/typed-cache-boundaries');
  expect(screen.queryByRole('dialog')).toBeNull();
});

test('shows a single close action while typing', async () => {
  const user = userEvent.setup();
  render(<SearchButton posts={posts} />);

  await user.click(screen.getByRole('button', { name: 'Abrir busca' }));
  await user.type(
    await screen.findByRole('combobox', { name: 'Buscar posts' }),
    'cache',
  );

  expect(screen.getByRole('button', { name: 'Fechar busca' })).toBeDefined();
  expect(screen.queryByRole('button', { name: 'Limpar busca' })).toBeNull();
});

test('ignores accents, case and surrounding whitespace', async () => {
  const user = userEvent.setup();
  render(
    <SearchButton
      posts={[
        ...posts,
        {
          slug: 'configuracao-do-terminal',
          title: 'Configuração do terminal',
          excerpt: 'Uma introdução prática.',
          author: 'Luís Antunes',
          createdAt: '2026-08-25T12:00:00.000Z',
        },
      ]}
    />,
  );

  await user.click(screen.getByRole('button', { name: 'Abrir busca' }));
  await user.type(
    await screen.findByRole('combobox', { name: 'Buscar posts' }),
    '  CONFIGURACAO  ',
  );

  expect(
    screen.getByRole('option', { name: /configuração do terminal/i }),
  ).toBeDefined();
});

test('focuses the input and restores focus when Escape closes an empty search', async () => {
  const user = userEvent.setup();
  render(<SearchButton posts={posts} />);

  const trigger = screen.getByRole('button', { name: 'Abrir busca' });
  await user.click(trigger);

  const input = await screen.findByRole('combobox', { name: 'Buscar posts' });
  await waitFor(() => expect(document.activeElement).toBe(input));
  expect(input.getAttribute('aria-expanded')).toBe('true');
  expect(input.getAttribute('aria-controls')).toBe(
    screen.getByRole('listbox', { name: 'Resultados da busca' }).id,
  );
  await user.keyboard('{Escape}');

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(document.activeElement).toBe(trigger);
});

test('closes after selecting a result with the mouse', async () => {
  const user = userEvent.setup();
  render(<SearchButton posts={posts} />);

  await user.click(screen.getByRole('button', { name: 'Abrir busca' }));
  await user.type(
    await screen.findByRole('combobox', { name: 'Buscar posts' }),
    'cache',
  );
  await user.click(
    screen.getByRole('option', { name: /typed cache boundaries/i }),
  );

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});
