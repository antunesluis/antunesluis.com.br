import { describe, expect, test } from 'vitest';
import {
  STATUS_BIRD_CONFIG,
  STATUS_BIRD_FRAME_COLUMNS,
  STATUS_BIRD_FRAME_ROWS,
  STATUS_BIRD_POSES,
  getStatusBirdAccent,
  isStatusBirdLowPose,
  type StatusBirdPoseName,
} from './status-ascii-bird-animation';

describe('Status ASCII bird frames', () => {
  test('keeps every pose inside a fixed frame with safe edges', () => {
    Object.values(STATUS_BIRD_POSES).forEach(frame => {
      const rows = frame.split('\n');

      expect(rows).toHaveLength(STATUS_BIRD_FRAME_ROWS);
      rows.forEach(row => {
        expect(row).toHaveLength(STATUS_BIRD_FRAME_COLUMNS);
        expect(row.at(0)).toBe(' ');
        expect(row.at(-1)).toBe(' ');
      });
    });
  });

  test('keeps the compact bird centered in grounded poses', () => {
    ['lostIdle', 'errorIdle', 'errorWorried'].forEach(pose => {
      const frame = STATUS_BIRD_POSES[pose as keyof typeof STATUS_BIRD_POSES];
      const feet = frame.split('\n').find(row => row.includes('-"-"-'));

      if (pose === 'errorWorried') {
        expect(frame).toContain('(u,u)');
      } else {
        expect(feet?.indexOf('-"-"-')).toBe(6);
      }
    });
  });

  test('uses contextual accents only for meaningful poses', () => {
    expect(getStatusBirdAccent('lostQuestionLeft')).toBe('primary');
    expect(getStatusBirdAccent('errorGlitchRight')).toBe('error');
    expect(getStatusBirdAccent('lostIdle')).toBe('none');
  });

  test('identifies the only grounded pose drawn one row lower', () => {
    const lowPoses = Object.keys(STATUS_BIRD_POSES).filter(pose =>
      isStatusBirdLowPose(pose as StatusBirdPoseName),
    );

    expect(lowPoses).toEqual(['lostCrouch']);
  });
});

describe('Status ASCII bird choreographies', () => {
  test('defines complete ambient and interaction sequences per context', () => {
    Object.values(STATUS_BIRD_CONFIG).forEach(config => {
      const ambientDuration = config.ambient.reduce(
        (total, step) => total + step.ms,
        0,
      );
      const interactionDuration = config.interaction.reduce(
        (total, step) => total + step.ms,
        0,
      );

      expect(ambientDuration).toBeGreaterThanOrEqual(6500);
      expect(interactionDuration).toBeGreaterThanOrEqual(2500);
      expect(interactionDuration).toBeLessThanOrEqual(4000);
      expect(config.interaction.at(-1)?.pose).toBe(config.idlePose);
    });
  });

  test('uses distinct movement vocabularies for not found and error states', () => {
    const notFoundPoses = new Set<StatusBirdPoseName>(
      STATUS_BIRD_CONFIG['not-found'].interaction.map(step => step.pose),
    );
    const errorPoses = new Set<StatusBirdPoseName>(
      STATUS_BIRD_CONFIG.error.interaction.map(step => step.pose),
    );

    expect(notFoundPoses).toContain('lostHop');
    expect(notFoundPoses).toContain('lostQuestionRight');
    expect(errorPoses).toContain('errorPeck');
    expect(errorPoses).toContain('errorWorried');
    expect([...notFoundPoses].some(pose => errorPoses.has(pose))).toBe(false);
  });
});
