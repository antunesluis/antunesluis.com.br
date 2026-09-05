import { describe, expect, test } from 'vitest';
import { createAsciiFrame } from './create-frame';

describe('createAsciiFrame', () => {
  test('centers content and preserves fixed dimensions', () => {
    const frame = createAsciiFrame({
      columns: 7,
      rows: 3,
      placements: [{ row: 1, value: 'bird' }],
    });
    const lines = frame.split('\n');

    expect(lines).toHaveLength(3);
    expect(lines.every(line => line.length === 7)).toBe(true);
    expect(lines[1]).toBe(' bird  ');
  });

  test.each([
    [{ row: -1, value: 'x' }],
    [{ row: 2, value: 'x' }],
    [{ row: 0, column: -1, value: 'x' }],
    [{ row: 0, column: 3, value: 'xx' }],
  ])('rejects content outside the frame: %o', placement => {
    expect(() =>
      createAsciiFrame({
        columns: 4,
        rows: 2,
        placements: [placement],
      }),
    ).toThrow('ASCII frame content exceeds the available space.');
  });
});
