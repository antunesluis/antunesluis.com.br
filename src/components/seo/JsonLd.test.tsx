// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import type { Person, WithContext } from 'schema-dts';
import { afterEach, expect, test } from 'vitest';
import { JsonLd } from './JsonLd';

afterEach(cleanup);

test('renders typed structured data as JSON-LD', () => {
  const data: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Luis Antunes',
  };
  const { container } = render(<JsonLd data={data} />);
  const script = container.querySelector('script[type="application/ld+json"]');

  expect(script?.textContent).toBe(JSON.stringify(data));
});
