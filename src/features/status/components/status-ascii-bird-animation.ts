import {
  createAsciiFrame,
  type AsciiFramePlacement,
} from '@/lib/ascii-bird/create-frame';

export const STATUS_BIRD_FRAME_COLUMNS = 17;
export const STATUS_BIRD_FRAME_ROWS = 7;

const CENTER_COLUMN = 8;

type FrameOptions = {
  body?: string;
  feet?: string;
  head?: string;
  horizontalOffset?: number;
  leftMark?: string;
  rightMark?: string;
  upperBodyOffset?: number;
  verticalOffset?: number;
};

function createFrame(face: string, options: FrameOptions = {}) {
  const firstRow = 1 + (options.verticalOffset ?? 0);
  const horizontalOffset = options.horizontalOffset ?? 0;
  const upperBodyOffset = options.upperBodyOffset ?? 0;
  const placements: AsciiFramePlacement[] = [
    {
      row: firstRow,
      value: options.head ?? ',_,',
      horizontalOffset: horizontalOffset + upperBodyOffset,
    },
    {
      row: firstRow + 1,
      value: face,
      horizontalOffset: horizontalOffset + upperBodyOffset,
    },
    {
      row: firstRow + 2,
      value: options.body ?? '{`"`}',
      horizontalOffset,
    },
    {
      row: firstRow + 3,
      value: options.feet ?? '-"-"-',
      horizontalOffset,
    },
  ];

  if (options.leftMark) {
    placements.push({
      row: firstRow + 1,
      column: CENTER_COLUMN - 6,
      value: options.leftMark,
      horizontalOffset: 0,
    });
  }

  if (options.rightMark) {
    placements.push({
      row: firstRow + 1,
      column: CENTER_COLUMN + 6,
      value: options.rightMark,
      horizontalOffset: 0,
    });
  }

  return createAsciiFrame({
    columns: STATUS_BIRD_FRAME_COLUMNS,
    rows: STATUS_BIRD_FRAME_ROWS,
    placements,
  });
}

export const STATUS_BIRD_POSES = {
  lostIdle: createFrame('(o,o)'),
  lostBlink: createFrame('(-,-)'),
  lostLookLeft: createFrame('<( o)'),
  lostLookRight: createFrame('(o )>'),
  lostQuestionLeft: createFrame('<( o)', { leftMark: '?' }),
  lostQuestionRight: createFrame('(o )>', { rightMark: '?' }),
  lostCrouch: createFrame('(o,o)', {
    feet: '_"_"_',
    verticalOffset: 1,
  }),
  lostHop: createFrame('(o,o)', {
    feet: '> <',
    verticalOffset: -1,
  }),
  lostSurprise: createFrame('(O,O)', { body: '{`?`}' }),
  errorIdle: createFrame('(o,o)', { body: '{`!`}' }),
  errorBlink: createFrame('(-,-)', { body: '{`!`}' }),
  errorGlitchLeft: createFrame('(o,o)', {
    body: '{`!`}',
    horizontalOffset: -1,
  }),
  errorGlitchRight: createFrame('(o,o)', {
    body: '{`!`}',
    horizontalOffset: 1,
  }),
  errorInspect: createFrame('(o )>', {
    body: '{`!`}',
    rightMark: '!',
  }),
  errorPeck: createFrame('(o )>', {
    body: '{`!`}',
    rightMark: '!',
    upperBodyOffset: 1,
  }),
  errorSurprise: createFrame('(O,O)', { body: '<{`!`}>' }),
  errorWorried: createFrame('(u,u)', { body: '{`!`}' }),
} as const;

export type StatusBirdPoseName = keyof typeof STATUS_BIRD_POSES;

export type StatusBirdStep = {
  pose: StatusBirdPoseName;
  ms: number;
};

const NOT_FOUND_AMBIENT = [
  { pose: 'lostIdle', ms: 1700 },
  { pose: 'lostBlink', ms: 140 },
  { pose: 'lostIdle', ms: 800 },
  { pose: 'lostLookLeft', ms: 650 },
  { pose: 'lostQuestionLeft', ms: 480 },
  { pose: 'lostLookLeft', ms: 300 },
  { pose: 'lostIdle', ms: 400 },
  { pose: 'lostLookRight', ms: 650 },
  { pose: 'lostQuestionRight', ms: 480 },
  { pose: 'lostLookRight', ms: 300 },
  { pose: 'lostIdle', ms: 1600 },
] as const satisfies readonly StatusBirdStep[];

const NOT_FOUND_INTERACTION = [
  { pose: 'lostCrouch', ms: 220 },
  { pose: 'lostHop', ms: 280 },
  { pose: 'lostCrouch', ms: 200 },
  { pose: 'lostIdle', ms: 180 },
  { pose: 'lostLookLeft', ms: 260 },
  { pose: 'lostQuestionLeft', ms: 420 },
  { pose: 'lostLookRight', ms: 260 },
  { pose: 'lostQuestionRight', ms: 420 },
  { pose: 'lostSurprise', ms: 400 },
  { pose: 'lostIdle', ms: 400 },
] as const satisfies readonly StatusBirdStep[];

const ERROR_AMBIENT = [
  { pose: 'errorIdle', ms: 1800 },
  { pose: 'errorBlink', ms: 140 },
  { pose: 'errorIdle', ms: 900 },
  { pose: 'errorGlitchLeft', ms: 130 },
  { pose: 'errorGlitchRight', ms: 130 },
  { pose: 'errorIdle', ms: 1400 },
  { pose: 'errorInspect', ms: 700 },
  { pose: 'errorIdle', ms: 1800 },
] as const satisfies readonly StatusBirdStep[];

const ERROR_INTERACTION = [
  { pose: 'errorSurprise', ms: 300 },
  { pose: 'errorInspect', ms: 350 },
  { pose: 'errorPeck', ms: 180 },
  { pose: 'errorInspect', ms: 140 },
  { pose: 'errorPeck', ms: 180 },
  { pose: 'errorGlitchLeft', ms: 120 },
  { pose: 'errorGlitchRight', ms: 120 },
  { pose: 'errorWorried', ms: 650 },
  { pose: 'errorIdle', ms: 600 },
] as const satisfies readonly StatusBirdStep[];

export type StatusBirdVariant = 'not-found' | 'error';

type StatusBirdConfig = {
  ambient: readonly StatusBirdStep[];
  ariaLabel: string;
  caption: string;
  idlePose: StatusBirdPoseName;
  interaction: readonly StatusBirdStep[];
  reducedAriaLabel: string;
};

export const STATUS_BIRD_CONFIG = {
  'not-found': {
    ambient: NOT_FOUND_AMBIENT,
    ariaLabel: 'Pássaro ASCII procurando a página. Ative para ajudar na busca.',
    caption: 'ajude a procurar',
    idlePose: 'lostIdle',
    interaction: NOT_FOUND_INTERACTION,
    reducedAriaLabel:
      'Ilustração de um pássaro ASCII procurando a página. Movimento reduzido pela configuração do sistema.',
  },
  error: {
    ambient: ERROR_AMBIENT,
    ariaLabel:
      'Pássaro ASCII investigando o erro. Ative para acompanhar a investigação.',
    caption: 'ajude a investigar',
    idlePose: 'errorIdle',
    interaction: ERROR_INTERACTION,
    reducedAriaLabel:
      'Ilustração de um pássaro ASCII investigando o erro. Movimento reduzido pela configuração do sistema.',
  },
} as const satisfies Record<StatusBirdVariant, StatusBirdConfig>;

export function drawStatusBirdPose(pose: StatusBirdPoseName) {
  return STATUS_BIRD_POSES[pose];
}

export function getStatusBirdAccent(pose: StatusBirdPoseName) {
  if (pose === 'lostQuestionLeft' || pose === 'lostQuestionRight') {
    return 'primary';
  }

  if (pose === 'errorGlitchLeft' || pose === 'errorGlitchRight') {
    return 'error';
  }

  return 'none';
}

export function isStatusBirdAirborne(pose: StatusBirdPoseName) {
  return pose === 'lostHop';
}

export function isStatusBirdLowPose(pose: StatusBirdPoseName) {
  return pose === 'lostCrouch';
}
