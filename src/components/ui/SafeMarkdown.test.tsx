// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test } from 'vitest';
import { SafeMarkdown } from './SafeMarkdown';

afterEach(cleanup);

test('renders safe Markdown and highlighted code without executable markup', () => {
  const { container } = render(
    <SafeMarkdown
      markdown={`Regular **Markdown** with \`inline code\`.

\`\`\`javascript
const safe = true;
\`\`\`

<script>globalThis.compromised = true</script>

[unsafe link](javascript:alert(1))`}
    />,
  );

  expect(screen.getByText('Markdown')).toBeInstanceOf(HTMLElement);
  expect(screen.getByText('inline code').tagName).toBe('CODE');

  const highlightedCode = container.querySelector('code.language-javascript');
  if (!(highlightedCode instanceof HTMLElement)) {
    throw new Error('Expected a syntax-highlighted JavaScript code block');
  }
  expect(highlightedCode.textContent).toBe('const safe = true;');
  expect(highlightedCode.parentElement?.classList.contains('text-base')).toBe(
    true,
  );
  expect(highlightedCode.parentElement?.classList.contains('md:text-lg')).toBe(
    true,
  );

  expect(container.querySelector('script')).toBeNull();
  expect(container.innerHTML).not.toContain('globalThis.compromised');
  expect(
    screen.getByText('unsafe link').getAttribute('href') ?? '',
  ).not.toContain('javascript:');
});
