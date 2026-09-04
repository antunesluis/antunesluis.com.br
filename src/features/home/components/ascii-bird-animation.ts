export const FRAME_COLUMNS = 21;
export const FRAME_ROWS = 8;

type Pose = {
  frame: string;
  airborne: boolean;
};

type PoseOptions = {
  airborne?: boolean;
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

export function createFrame(lines: string[], verticalOffset = 0) {
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

    const column = Math.floor((FRAME_COLUMNS - line.length) / 2);
    put(grid, firstRow + index, column, line);
  });

  return grid.map(line => line.join('')).join('\n');
}

function createPose(lines: string[], options: PoseOptions = {}): Pose {
  return {
    frame: createFrame(lines, options.verticalOffset),
    airborne: options.airborne ?? false,
  };
}

export const POSES = {
  idleA: createPose([',_,', '(o,o)', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  idleB: createPose([',_,', '(o,o)', '/v\\', '/( . )\\', '/_\\', '^ ^']),
  blink: createPose([',_,', '(-,-)', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  lookL: createPose(['_,', '<( o)', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  lookR: createPose([',_', '(o )>', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  tiltL: createPose([',_,  ', '(o,o)  ', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  tiltR: createPose(['  ,_,', '  (o,o)', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  chirp: createPose([',_', '(O )> *', '/v\\', '/( : )\\', '/_\\', '^ ^']),
  flapUp: createPose(
    ['\\     ,_,     /', ' \\   (o,o)   /', '/v\\', '( : )', '/_\\', '> <'],
    { airborne: true, verticalOffset: -1 },
  ),
  flapDown: createPose(
    [',_,', '(o,o)', '/v\\', '/( : )\\', '/  /_\\  \\', '> <'],
    { airborne: true, verticalOffset: -1 },
  ),
  crouch: createPose([',_,', '(o,o)', '/v\\', '/(___)\\', '/_\\', 'v v']),
  hop: createPose([',_,', '(o,o)', '/v\\', '/( : )\\', '/_\\', '> <'], {
    airborne: true,
    verticalOffset: -1,
  }),
  danceL: createPose([',_,', '(o,o)', '/v\\', '/( : )', '/_\\', '^  >']),
  danceR: createPose([',_,', '(o,o)', '/v\\', '( : )\\', '/_\\', '<  ^']),
  wings: createPose([',_,', '(^,^)', '/v\\', '\\( : )/', '/_\\', '^ ^']),
  surprise: createPose([',_,', '(O,O)', '/v\\', '<( ! )>', '/_\\', '^ ^']),
  bow: createPose([',_,', '(-,-)', '/v\\', '/(___)\\', '/_\\', 'v v']),
  bounce: createPose([',_,', '(o,o)', '/v\\', '<( : )>', '/_\\', '> <'], {
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
      { pose: 'idleB', ms: 140 },
      { pose: 'crouch', ms: 120 },
      { pose: 'danceL', ms: 160 },
      { pose: 'idleB', ms: 100 },
      { pose: 'danceR', ms: 160 },
      { pose: 'idleB', ms: 100 },
      { pose: 'danceL', ms: 150 },
      { pose: 'danceR', ms: 150 },
      { pose: 'wings', ms: 220 },
      { pose: 'danceL', ms: 150 },
      { pose: 'danceR', ms: 150 },
      { pose: 'wings', ms: 260 },
      { pose: 'idleA', ms: 220 },
    ],
  },
  {
    id: 'takeoff',
    label: 'little takeoff',
    steps: [
      { pose: 'lookR', ms: 180 },
      { pose: 'crouch', ms: 240 },
      { pose: 'flapUp', ms: 160 },
      { pose: 'flapDown', ms: 160 },
      { pose: 'flapUp', ms: 160 },
      { pose: 'flapDown', ms: 160 },
      { pose: 'bounce', ms: 220 },
      { pose: 'flapUp', ms: 160 },
      { pose: 'flapDown', ms: 160 },
      { pose: 'crouch', ms: 240 },
      { pose: 'blink', ms: 170 },
      { pose: 'idleA', ms: 260 },
    ],
  },
  {
    id: 'song',
    label: 'tiny concert',
    steps: [
      { pose: 'tiltL', ms: 180 },
      { pose: 'tiltR', ms: 180 },
      { pose: 'blink', ms: 110 },
      { pose: 'lookL', ms: 160 },
      { pose: 'lookR', ms: 160 },
      { pose: 'chirp', ms: 180 },
      { pose: 'lookR', ms: 100 },
      { pose: 'chirp', ms: 180 },
      { pose: 'lookR', ms: 100 },
      { pose: 'chirp', ms: 260 },
      { pose: 'wings', ms: 240 },
      { pose: 'bow', ms: 300 },
      { pose: 'idleA', ms: 240 },
    ],
  },
  {
    id: 'pogo',
    label: 'happy hops',
    steps: [
      { pose: 'blink', ms: 120 },
      { pose: 'crouch', ms: 180 },
      { pose: 'hop', ms: 180 },
      { pose: 'crouch', ms: 160 },
      { pose: 'danceL', ms: 140 },
      { pose: 'danceR', ms: 140 },
      { pose: 'crouch', ms: 220 },
      { pose: 'bounce', ms: 280 },
      { pose: 'crouch', ms: 200 },
      { pose: 'surprise', ms: 240 },
      { pose: 'blink', ms: 120 },
      { pose: 'idleA', ms: 260 },
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
