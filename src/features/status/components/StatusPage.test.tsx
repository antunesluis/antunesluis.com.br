// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { StatusPage } from './StatusPage';

afterEach(cleanup);

test('uses the descriptive title as the page heading', () => {
  render(
    <StatusPage
      statusCode='404'
      title='Página não encontrada'
      content='Conteúdo'
      actions={<button type='button'>Voltar</button>}
      visual={<div>Visual</div>}
    />,
  );

  expect(
    screen.getByRole('heading', { level: 1, name: 'Página não encontrada' }),
  ).not.toBeNull();
  expect(screen.getByText('404').getAttribute('aria-hidden')).toBe('true');
  expect(screen.getByRole('button', { name: 'Voltar' })).not.toBeNull();
});
