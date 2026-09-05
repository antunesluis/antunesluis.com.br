export const FRAME_COLUMNS = 15;
export const FRAME_ROWS = 7;

type Pose = {
  frame: string;
  airborne: boolean;
};

type PoseOptions = {
  airborne?: boolean;
  horizontalOffset?: number;
  verticalOffset?: number;
};

function put(grid: string[][], row: number, column: number, value: string) {
  [...value].forEach((character, index) => {
    const target = column + index;

    if (row >= 0 && row < FRAME_ROWS && target >= 0 && target < FRAME_COLUMNS) {
      grid[row][target] = character;
    }
  });
}

export function createFrame(
  lines: string[],
  verticalOffset = 0,
  horizontalOffset = 0,
) {
  const grid = Array.from({ length: FRAME_ROWS }, () =>
    Array(FRAME_COLUMNS).fill(' '),
  );
  const firstRow =
    Math.max(0, Math.floor((FRAME_ROWS - lines.length) / 2)) + verticalOffset;

  if (firstRow < 0 || firstRow + lines.length > FRAME_ROWS) {
    throw new Error('ASCII frame exceeds the available rows.');
  }

  lines.forEach((line, index) => {
    if (line.length > FRAME_COLUMNS) {
      throw new Error('ASCII frame line exceeds the available columns.');
    }

    const column =
      Math.floor((FRAME_COLUMNS - line.length) / 2) + horizontalOffset;

    if (column < 0 || column + line.length > FRAME_COLUMNS) {
      throw new Error('ASCII frame line exceeds the available columns.');
    }

    put(grid, firstRow + index, column, line);
  });

  return grid.map(line => line.join('')).join('\n');
}

function createPose(lines: string[], options: PoseOptions = {}): Pose {
  return {
    frame: createFrame(lines, options.verticalOffset, options.horizontalOffset),
    airborne: options.airborne ?? false,
  };
}

const HEAD = ',_,';
const FACE = '(o,o)';
const BODY = '{`"`}';
const FEET = '-"-"-';
const CROUCHED_FEET = '_"_"_';
const TUCKED_FEET = '> <';
const PROFILE_LEFT = '<( o)';
const PROFILE_RIGHT = '(o )>';

export const POSES = {
  idleA: createPose([HEAD, FACE, BODY, FEET]),
  idleB: createPose([HEAD, FACE, BODY, FEET], { verticalOffset: 1 }),
  blink: createPose([HEAD, '(-,-)', BODY, FEET]),
  lookL: createPose([HEAD, PROFILE_LEFT, BODY, FEET]),
  lookR: createPose([HEAD, PROFILE_RIGHT, BODY, FEET]),
  tiltL: createPose([`${HEAD}  `, `${FACE}  `, BODY, FEET]),
  tiltR: createPose([`  ${HEAD}`, `  ${FACE}`, BODY, FEET]),
  chirp: createPose([HEAD, `    ${PROFILE_RIGHT} *`, BODY, FEET]),
  flapUp: createPose(
    ['\\   ,_,   /', '\\ (o,o) /', `\\${BODY}/`, TUCKED_FEET],
    { airborne: true, verticalOffset: -1 },
  ),
  flapDown: createPose([HEAD, FACE, `/${BODY}\\`, TUCKED_FEET], {
    airborne: true,
    verticalOffset: -1,
  }),
  crouch: createPose([HEAD, FACE, BODY, CROUCHED_FEET], {
    verticalOffset: 1,
  }),
  hop: createPose([HEAD, FACE, BODY, TUCKED_FEET], {
    airborne: true,
    verticalOffset: -1,
  }),
  danceL: createPose([HEAD, FACE, `\\${BODY} `, `<${FEET.slice(1)}`], {
    horizontalOffset: -1,
  }),
  danceR: createPose([HEAD, FACE, ` ${BODY}/`, `${FEET.slice(0, -1)}>`], {
    horizontalOffset: 1,
  }),
  wings: createPose([HEAD, '(^,^)', `\\${BODY}/`, FEET]),
  surprise: createPose([HEAD, '(O,O)', '<{`!`}>', FEET]),
  bow: createPose([HEAD, '(-,-)', BODY, CROUCHED_FEET], {
    verticalOffset: 1,
  }),
  bounce: createPose([HEAD, '(^,^)', `<${BODY}>`, TUCKED_FEET], {
    airborne: true,
    verticalOffset: -1,
  }),
} as const satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;

export type Step = {
  pose: PoseName;
  ms: number;
};

export type Choreography = {
  id: 'shuffle' | 'takeoff' | 'song' | 'pogo';
  label: string;
  steps: readonly Step[];
};

export const ARRIVAL = [
  { pose: 'flapUp', ms: 130 },
  { pose: 'flapDown', ms: 130 },
  { pose: 'flapUp', ms: 130 },
  { pose: 'flapDown', ms: 130 },
  { pose: 'flapUp', ms: 140 },
  { pose: 'crouch', ms: 210 },
  { pose: 'idleA', ms: 320 },
  { pose: 'blink', ms: 120 },
  { pose: 'idleA', ms: 380 },
] as const satisfies readonly Step[];

export const CHOREOGRAPHIES = [
  {
    id: 'shuffle',
    label: 'side shuffle',
    steps: [
      { pose: 'crouch', ms: 140 },
      { pose: 'danceL', ms: 170 },
      { pose: 'idleB', ms: 100 },
      { pose: 'danceR', ms: 170 },
      { pose: 'idleB', ms: 100 },
      { pose: 'danceL', ms: 160 },
      { pose: 'danceR', ms: 160 },
      { pose: 'wings', ms: 220 },
      { pose: 'danceR', ms: 150 },
      { pose: 'danceL', ms: 150 },
      { pose: 'blink', ms: 120 },
      { pose: 'wings', ms: 220 },
      { pose: 'idleA', ms: 240 },
    ],
  },
  {
    id: 'takeoff',
    label: 'little takeoff',
    steps: [
      { pose: 'lookR', ms: 240 },
      { pose: 'idleA', ms: 100 },
      { pose: 'crouch', ms: 280 },
      { pose: 'flapUp', ms: 190 },
      { pose: 'flapDown', ms: 170 },
      { pose: 'flapUp', ms: 190 },
      { pose: 'flapDown', ms: 170 },
      { pose: 'flapUp', ms: 190 },
      { pose: 'bounce', ms: 240 },
      { pose: 'flapDown', ms: 180 },
      { pose: 'crouch', ms: 260 },
      { pose: 'blink', ms: 150 },
      { pose: 'idleA', ms: 260 },
    ],
  },
  {
    id: 'song',
    label: 'tiny concert',
    steps: [
      { pose: 'tiltL', ms: 170 },
      { pose: 'idleB', ms: 100 },
      { pose: 'tiltR', ms: 170 },
      { pose: 'idleA', ms: 100 },
      { pose: 'blink', ms: 120 },
      { pose: 'lookL', ms: 200 },
      { pose: 'idleA', ms: 100 },
      { pose: 'lookR', ms: 180 },
      { pose: 'chirp', ms: 180 },
      { pose: 'lookR', ms: 100 },
      { pose: 'chirp', ms: 180 },
      { pose: 'lookR', ms: 100 },
      { pose: 'chirp', ms: 260 },
      { pose: 'wings', ms: 220 },
      { pose: 'bow', ms: 280 },
      { pose: 'idleA', ms: 220 },
    ],
  },
  {
    id: 'pogo',
    label: 'happy hops',
    steps: [
      { pose: 'blink', ms: 120 },
      { pose: 'crouch', ms: 180 },
      { pose: 'hop', ms: 220 },
      { pose: 'crouch', ms: 160 },
      { pose: 'hop', ms: 220 },
      { pose: 'crouch', ms: 160 },
      { pose: 'danceL', ms: 140 },
      { pose: 'danceR', ms: 140 },
      { pose: 'crouch', ms: 200 },
      { pose: 'bounce', ms: 260 },
      { pose: 'crouch', ms: 180 },
      { pose: 'surprise', ms: 220 },
      { pose: 'wings', ms: 200 },
      { pose: 'idleA', ms: 240 },
    ],
  },
] as const satisfies readonly Choreography[];

export function getNextChoreographyIndex(previousIndex: number) {
  if (previousIndex < 0) {
    return 0;
  }

  return (previousIndex + 1) % CHOREOGRAPHIES.length;
}

export function drawPose(name: PoseName) {
  return POSES[name].frame;
}

export function isAirborne(name: PoseName) {
  return POSES[name].airborne;
}
