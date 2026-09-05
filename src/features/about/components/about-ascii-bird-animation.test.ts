import { describe, expect, test } from 'vitest';
import {
  ABOUT_BIRD_FRAME_COLUMNS,
  ABOUT_BIRD_FRAME_ROWS,
  ABOUT_BIRD_POSES,
  ABOUT_BIRD_SEQUENCE,
} from './about-ascii-bird-animation';

describe('About ASCII bird frames', () => {
  test('keeps every pose inside a fixed frame with safe edges', () => {
    Object.values(ABOUT_BIRD_POSES).forEach(frame => {
      const rows = frame.split('\n');

      expect(rows).toHaveLength(ABOUT_BIRD_FRAME_ROWS);
      rows.forEach(row => {
        expect(row).toHaveLength(ABOUT_BIRD_FRAME_COLUMNS);
        expect(row.at(0)).toBe(' ');
        expect(row.at(-1)).toBe(' ');
      });
    });
  });

  test('keeps the forward-facing bird anchored while the greeting grows', () => {
    const greetingFrames = [
      ABOUT_BIRD_POSES.helloOne,
      ABOUT_BIRD_POSES.helloTwo,
      ABOUT_BIRD_POSES.helloThree,
    ];

    greetingFrames.forEach(frame => {
      const body = frame.split('\n').find(row => row.includes('{`"`}'));

      expect(body?.indexOf('{`"`}')).toBe(8);
    });

    expect(ABOUT_BIRD_POSES.helloOne).toContain('hello');
    expect(ABOUT_BIRD_POSES.helloTwo).toContain('hello!');
    expect(ABOUT_BIRD_POSES.helloThree).toContain('hello!!');
  });

  test('never turns sideways', () => {
    Object.values(ABOUT_BIRD_POSES).forEach(frame => {
      expect(frame).not.toMatch(/[<>]/);
    });
  });
});

describe('About ASCII bird choreography', () => {
  test('forms a calm complete loop with greeting and blinking', () => {
    const duration = ABOUT_BIRD_SEQUENCE.reduce(
      (total, step) => total + step.ms,
      0,
    );
    const poses = new Set(ABOUT_BIRD_SEQUENCE.map(step => step.pose));

    expect(duration).toBeGreaterThanOrEqual(8000);
    expect(duration).toBeLessThanOrEqual(10000);
    expect(poses).toEqual(
      new Set(['idle', 'blink', 'helloOne', 'helloTwo', 'helloThree']),
    );
  });
});
