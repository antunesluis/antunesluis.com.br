import { describe, expect, test } from 'vitest';
import {
  CHOREOGRAPHIES,
  FRAME_COLUMNS,
  FRAME_ROWS,
  POSES,
  createFrame,
  getNextChoreographyIndex,
  isAirborne,
} from './ascii-bird-animation';

function visibleLines(pose: keyof typeof POSES) {
  return POSES[pose].frame
    .split('\n')
    .filter(row => row.trim())
    .map(row => row.trim());
}

function mirrorFrame(frame: string) {
  const mirroredCharacters: Record<string, string> = {
    '<': '>',
    '>': '<',
    '/': '\\',
    '\\': '/',
    '(': ')',
    ')': '(',
    '{': '}',
    '}': '{',
  };

  return frame
    .split('\n')
    .map(row =>
      [...row]
        .reverse()
        .map(character => mirroredCharacters[character] ?? character)
        .join(''),
    )
    .join('\n');
}

describe('ASCII bird frames', () => {
  test('keeps every pose inside the fixed frame', () => {
    Object.values(POSES).forEach(({ frame }) => {
      const rows = frame.split('\n');

      expect(rows).toHaveLength(FRAME_ROWS);
      rows.forEach(row => expect(row).toHaveLength(FRAME_COLUMNS));
    });
  });

  test('uses the compact four-line model as the resting pose', () => {
    const artwork = POSES.idleA.frame
      .split('\n')
      .filter(row => row.trim())
      .map(row => row.trim());

    expect(artwork).toEqual([',_,', '(o,o)', '{`"`}', '-"-"-']);
  });

  test('uses coherent one-eyed profiles with the beak at the outer edge', () => {
    expect(visibleLines('lookL')).toEqual([',_,', '<( o)', '{`"`}', '-"-"-']);
    expect(visibleLines('lookR')).toEqual([',_,', '(o )>', '{`"`}', '-"-"-']);
  });

  test('keeps directional and wing poses perfectly mirrored', () => {
    expect(mirrorFrame(POSES.lookL.frame)).toBe(POSES.lookR.frame);
    expect(mirrorFrame(POSES.tiltL.frame)).toBe(POSES.tiltR.frame);
    expect(mirrorFrame(POSES.danceL.frame)).toBe(POSES.danceR.frame);
    expect(mirrorFrame(POSES.flapUp.frame)).toBe(POSES.flapUp.frame);
    expect(mirrorFrame(POSES.flapDown.frame)).toBe(POSES.flapDown.frame);
    expect(mirrorFrame(POSES.wings.frame)).toBe(POSES.wings.frame);
  });

  test('uses tucked feet instead of duplicating the grounded stance in the air', () => {
    Object.values(POSES)
      .filter(pose => pose.airborne)
      .forEach(({ frame }) => {
        expect(frame).toContain('> <');
        expect(frame).not.toContain('-"-"-');
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
    expect(() => createFrame(['x'.repeat(FRAME_COLUMNS)], 0, 1)).toThrow(
      /columns/,
    );
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

  test('uses crouches to prepare and finish every airborne passage', () => {
    CHOREOGRAPHIES.forEach(({ steps }) => {
      steps.forEach((step, index) => {
        if (!isAirborne(step.pose)) {
          return;
        }

        const previous = steps[index - 1];
        const next = steps[index + 1];

        if (!previous || !isAirborne(previous.pose)) {
          expect(previous?.pose).toBe('crouch');
        }

        if (!next || !isAirborne(next.pose)) {
          expect(next?.pose).toBe('crouch');
        }
      });
    });
  });

  test('avoids repeated adjacent frames in every choreography', () => {
    CHOREOGRAPHIES.forEach(({ steps }) => {
      steps.slice(1).forEach((step, index) => {
        expect(step.pose).not.toBe(steps[index].pose);
      });
    });
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
