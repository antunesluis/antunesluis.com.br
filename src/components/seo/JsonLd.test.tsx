// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react';
import type { Person, WithContext } from 'schema-dts';
import { afterEach, expect, test } from 'vitest';
import { JsonLd } from './JsonLd';

afterEach(cleanup);

test('renders typed structured data as JSON-LD without allowing a script breakout', () => {
  const data: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: '</script><img src=x onerror=alert(1)>',
  };
  const { container } = render(<JsonLd data={data} />);
  const script = container.querySelector('script[type="application/ld+json"]');

  expect(script?.textContent).toContain('\\u003c/script>');
  expect(container.querySelector('img')).toBeNull();
  expect(JSON.parse(script?.textContent ?? '')).toEqual(data);
});
