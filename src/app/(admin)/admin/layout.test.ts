import { expect, test } from 'vitest';
import { metadata } from './layout';

test('prevents administrative routes from inheriting public indexing metadata', () => {
  expect(metadata.robots).toMatchObject({
    index: false,
    follow: false,
  });
  expect(metadata.alternates?.canonical).toBeNull();
  expect(metadata.description).toBeNull();
});
