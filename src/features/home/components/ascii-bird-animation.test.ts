import { describe, expect, test } from 'vitest';
import {
  CHOREOGRAPHIES,
  FRAME_COLUMNS,
  FRAME_ROWS,
  POSES,
  createFrame,
  getNextChoreographyIndex,
} from './ascii-bird-animation';

describe('ASCII bird frames', () => {
  test('keeps every pose inside the fixed frame', () => {
    Object.values(POSES).forEach(({ frame }) => {
      const rows = frame.split('\n');

      expect(rows).toHaveLength(FRAME_ROWS);
      rows.forEach(row => expect(row).toHaveLength(FRAME_COLUMNS));
    });
  });

  test('stores airborne behavior alongside each pose', () => {
    const airborne = Object.entries(POSES)
      .filter(([, pose]) => pose.airborne)
      .map(([name]) => name);

    expect(airborne).toEqual(['flapUp', 'flapDown', 'hop', 'bounce']);
  });

  test('rejects artwork that would be clipped', () => {
    expect(() => createFrame(['x'.repeat(FRAME_COLUMNS + 1)])).toThrow(
      /columns/,
    );
    expect(() => createFrame(Array(FRAME_ROWS + 1).fill('x'))).toThrow(/rows/);
  });
});

describe('ASCII bird choreography', () => {
  test('defines four distinct complete choreographies', () => {
    expect(CHOREOGRAPHIES).toHaveLength(4);
    expect(new Set(CHOREOGRAPHIES.map(({ id }) => id)).size).toBe(4);

    CHOREOGRAPHIES.forEach(({ steps }) => {
      const duration = steps.reduce((total, step) => total + step.ms, 0);
      const poses = new Set(steps.map(step => step.pose));

      expect(duration).toBeGreaterThanOrEqual(1900);
      expect(duration).toBeLessThanOrEqual(2800);
      expect(poses.size).toBeGreaterThanOrEqual(6);
      expect(steps.at(-1)?.pose).toBe('idleA');
      steps.forEach(({ ms }) => {
        expect(ms).toBeGreaterThanOrEqual(100);
        expect(ms).toBeLessThanOrEqual(300);
      });
    });
  });

  test('gives every choreography a recognizable movement signature', () => {
    const posesByChoreography = Object.fromEntries(
      CHOREOGRAPHIES.map(({ id, steps }) => [id, steps.map(step => step.pose)]),
    );

    expect(posesByChoreography.shuffle).toEqual(
      expect.arrayContaining(['danceL', 'danceR', 'wings']),
    );
    expect(posesByChoreography.takeoff).toEqual(
      expect.arrayContaining(['flapUp', 'flapDown', 'bounce']),
    );
    expect(posesByChoreography.song).toEqual(
      expect.arrayContaining(['chirp', 'wings', 'bow']),
    );
    expect(posesByChoreography.pogo).toEqual(
      expect.arrayContaining(['hop', 'bounce', 'surprise']),
    );
  });

  test('advances choreographies in order and wraps around', () => {
    const sequence: number[] = [];
    let index = -1;

    for (let step = 0; step < 5; step += 1) {
      index = getNextChoreographyIndex(index);
      sequence.push(index);
    }

    expect(sequence).toEqual([0, 1, 2, 3, 0]);
  });
});
