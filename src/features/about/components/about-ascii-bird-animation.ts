import {
  createAsciiFrame,
  type AsciiFramePlacement,
} from '@/lib/ascii-bird/create-frame';

export const ABOUT_BIRD_FRAME_COLUMNS = 21;
export const ABOUT_BIRD_FRAME_ROWS = 7;

type PoseOptions = {
  speech?: string;
};

function createFrame(face: string, options: PoseOptions = {}) {
  const placements: AsciiFramePlacement[] = [
    { row: 2, value: ',_,' },
    { row: 3, value: face },
    { row: 4, value: '{`"`}' },
    { row: 5, value: '-"-"-' },
  ];

  if (options.speech) {
    placements.push({
      row: 0,
      value: options.speech,
      horizontalOffset: 2,
    });
  }

  return createAsciiFrame({
    columns: ABOUT_BIRD_FRAME_COLUMNS,
    rows: ABOUT_BIRD_FRAME_ROWS,
    placements,
  });
}

export const ABOUT_BIRD_POSES = {
  idle: createFrame('(o,o)'),
  blink: createFrame('(-,-)'),
  helloOne: createFrame('(o,o)', { speech: 'hello' }),
  helloTwo: createFrame('(o,o)', { speech: 'hello!' }),
  helloThree: createFrame('(o,o)', { speech: 'hello!!' }),
} as const;

export type AboutBirdPoseName = keyof typeof ABOUT_BIRD_POSES;

export type AboutBirdStep = {
  pose: AboutBirdPoseName;
  ms: number;
};

export const ABOUT_BIRD_SEQUENCE = [
  { pose: 'idle', ms: 2000 },
  { pose: 'blink', ms: 140 },
  { pose: 'idle', ms: 1000 },
  { pose: 'helloOne', ms: 360 },
  { pose: 'idle', ms: 180 },
  { pose: 'helloTwo', ms: 460 },
  { pose: 'helloThree', ms: 620 },
  { pose: 'idle', ms: 1400 },
  { pose: 'blink', ms: 140 },
  { pose: 'idle', ms: 1800 },
] as const satisfies readonly AboutBirdStep[];

export function drawAboutBirdPose(pose: AboutBirdPoseName) {
  return ABOUT_BIRD_POSES[pose];
}
