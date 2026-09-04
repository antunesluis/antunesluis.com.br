'use client';

import { useEffect, useRef, useState } from 'react';

const COLS = 21;
const ROWS = 8;

function put(grid: string[][], row: number, column: number, value: string) {
  [...value].forEach((character, index) => {
    const target = column + index;

    if (row >= 0 && row < ROWS && target >= 0 && target < COLS) {
      grid[row][target] = character;
    }
  });
}

function createFrame(lines: string[], verticalOffset = 0) {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
  const firstRow =
    Math.max(0, Math.floor((ROWS - lines.length) / 2)) + verticalOffset;

  lines.forEach((line, index) => {
    if (line.length > COLS) {
      throw new Error('ASCII frame line exceeds the available columns.');
    }

    const column = Math.floor((COLS - line.length) / 2);
    put(grid, firstRow + index, column, line);
  });

  return grid.map(line => line.join('')).join('\n');
}

const POSES = {
  idleA: createFrame([
    ',_,',
    '(o,o)',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  idleB: createFrame([
    ',_,',
    '(o,o)',
    '/v\\',
    '/( . )\\',
    '/_\\',
    '^ ^',
  ]),
  blink: createFrame([
    ',_,',
    '(-,-)',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  lookL: createFrame([
    '_,',
    '<( o)',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  lookR: createFrame([
    ',_',
    '(o )>',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  tiltL: createFrame([
    ',_,  ',
    '(o,o)  ',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  tiltR: createFrame([
    '  ,_,',
    '  (o,o)',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  chirp: createFrame([
    ',_',
    '(O )> *',
    '/v\\',
    '/( : )\\',
    '/_\\',
    '^ ^',
  ]),
  flapUp: createFrame(
    [
      '\\     ,_,     /',
      ' \\   (o,o)   /',
      '/v\\',
      '( : )',
      '/_\\',
      '> <',
    ],
    -1,
  ),
  flapDown: createFrame(
    [
      ',_,',
      '(o,o)',
      '/v\\',
      '/( : )\\',
      '/  /_\\  \\',
      '> <',
    ],
    -1,
  ),
  crouch: createFrame([
    ',_,',
    '(o,o)',
    '/v\\',
    '/(___)\\',
    '/_\\',
    'v v',
  ]),
  hop: createFrame(
    [',_,', '(o,o)', '/v\\', '/( : )\\', '/_\\', '> <'],
    -1,
  ),
  danceL: createFrame([
    ',_,',
    '(o,o)',
    '/v\\',
    '/( : )',
    '/_\\',
    '^  >',
  ]),
  danceR: createFrame([
    ',_,',
    '(o,o)',
    '/v\\',
    '( : )\\',
    '/_\\',
    '<  ^',
  ]),
  wings: createFrame([
    ',_,',
    '(^,^)',
    '/v\\',
    '\\( : )/',
    '/_\\',
    '^ ^',
  ]),
  bounce: createFrame(
    [',_,', '(o,o)', '/v\\', '<( : )>', '/_\\', '> <'],
    -1,
  ),
} as const;

type PoseName = keyof typeof POSES;

type Step = {
  pose: PoseName;
  ms: number;
};

const ARRIVAL: Step[] = [
  { pose: 'flapUp', ms: 130 },
  { pose: 'flapDown', ms: 130 },
  { pose: 'flapUp', ms: 130 },
  { pose: 'flapDown', ms: 130 },
  { pose: 'flapUp', ms: 140 },
  { pose: 'crouch', ms: 210 },
  { pose: 'idleA', ms: 320 },
  { pose: 'blink', ms: 120 },
  { pose: 'idleA', ms: 380 },
];

const ENCORE: Step[] = [
  { pose: 'wings', ms: 130 },
  { pose: 'danceL', ms: 140 },
  { pose: 'danceR', ms: 140 },
  { pose: 'danceL', ms: 140 },
  { pose: 'danceR', ms: 140 },
  { pose: 'crouch', ms: 100 },
  { pose: 'bounce', ms: 210 },
  { pose: 'crouch', ms: 100 },
  { pose: 'flapUp', ms: 130 },
  { pose: 'flapDown', ms: 130 },
  { pose: 'chirp', ms: 300 },
  { pose: 'wings', ms: 220 },
  { pose: 'idleA', ms: 420 },
];

function drawPose(name: PoseName) {
  return POSES[name];
}

function isAirborne(name: PoseName) {
  return ['flapUp', 'flapDown', 'hop', 'bounce'].includes(name);
}

function danceCycle(): Step[] {
  const beat = 175;
  const steps: Step[] = [
    { pose: 'danceL', ms: beat },
    { pose: 'idleB', ms: beat },
    { pose: 'danceR', ms: beat },
    { pose: 'idleB', ms: beat },
    { pose: 'danceL', ms: beat },
    { pose: 'wings', ms: beat },
    { pose: 'danceR', ms: beat },
    { pose: 'wings', ms: beat },
  ];

  const variation = Math.random();

  if (variation < 0.3) {
    steps.push(
      { pose: 'crouch', ms: 110 },
      { pose: 'hop', ms: 190 },
      { pose: 'crouch', ms: 110 },
      { pose: 'bounce', ms: 210 },
      { pose: 'idleA', ms: 360 },
    );
  } else if (variation < 0.6) {
    steps.push(
      { pose: 'flapUp', ms: 130 },
      { pose: 'flapDown', ms: 130 },
      { pose: 'flapUp', ms: 130 },
      { pose: 'chirp', ms: 280 },
      { pose: 'idleA', ms: 420 },
    );
  } else {
    steps.push(
      { pose: 'lookL', ms: 220 },
      { pose: 'lookR', ms: 220 },
      { pose: 'tiltL', ms: 210 },
      { pose: 'tiltR', ms: 210 },
      { pose: 'blink', ms: 120 },
      { pose: 'idleA', ms: 460 },
    );
  }

  return steps;
}

export function AsciiBird() {
  const [pose, setPose] = useState<PoseName>('idleA');
  const [caption, setCaption] = useState('click for another move');
  const [motionReduced, setMotionReduced] = useState(false);
  const birdRef = useRef<HTMLButtonElement>(null);
  const playEncoreRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const bird = birdRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let arrivalAnimation: Animation | undefined;
    let queue: Step[] = [];
    let interacting = false;
    let disposed = false;

    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
      }
    }

    function draw(name: PoseName) {
      if (!disposed) {
        setPose(name);
      }
    }

    function tick() {
      clearTimer();

      if (document.hidden || reducedMotion.matches || interacting) {
        return;
      }

      if (queue.length === 0) {
        queue = danceCycle();
      }

      const current = queue.shift();

      if (!current) {
        return;
      }

      draw(current.pose);
      timer = setTimeout(tick, current.ms);
    }

    function play(sequence: Step[], done?: () => void) {
      interacting = true;
      clearTimer();
      const steps = [...sequence];

      function next() {
        const current = steps.shift();

        if (!current) {
          interacting = false;
          done?.();
          tick();
          return;
        }

        draw(current.pose);
        timer = setTimeout(next, current.ms);
      }

      next();
    }

    function arrive() {
      if (bird) {
        arrivalAnimation = bird.animate(
          [
            {
              transform: 'translate3d(10rem, -6rem, 0) rotate(8deg)',
              opacity: 0,
            },
            {
              transform: 'translate3d(3rem, -2rem, 0) rotate(-4deg)',
              opacity: 1,
              offset: 0.55,
            },
            {
              transform: 'translate3d(0, .45rem, 0) rotate(1deg)',
              opacity: 1,
              offset: 0.86,
            },
            { transform: 'translate3d(0, 0, 0)', opacity: 1 },
          ],
          {
            duration: 1050,
            easing: 'cubic-bezier(.22, .8, .32, 1)',
            fill: 'both',
          },
        );
      }

      play(ARRIVAL);
    }

    function handleVisibilityChange() {
      clearTimer();

      if (document.hidden) {
        arrivalAnimation?.cancel();
        queue = [];
        interacting = false;
        draw('idleA');
        setCaption('click for another move');
        return;
      }

      tick();
    }

    function handleMotionPreference() {
      clearTimer();
      arrivalAnimation?.cancel();
      queue = [];
      interacting = false;
      setMotionReduced(reducedMotion.matches);
      setCaption(
        reducedMotion.matches
          ? 'motion reduced by system'
          : 'click for another move',
      );
      draw('idleA');

      if (!reducedMotion.matches) {
        tick();
      }
    }

    playEncoreRef.current = () => {
      if (reducedMotion.matches || interacting) {
        return;
      }

      setCaption('encore!');
      play(ENCORE, () => setCaption('click for another move'));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', handleMotionPreference);

    if (reducedMotion.matches) {
      timer = setTimeout(() => {
        setMotionReduced(true);
        setCaption('motion reduced by system');
      }, 0);
    } else {
      arrive();
    }

    return () => {
      disposed = true;
      clearTimer();
      arrivalAnimation?.cancel();
      playEncoreRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <div className='group/stage relative grid min-h-64 w-full place-items-center overflow-hidden sm:min-h-72 md:min-h-80'>
      <button
        ref={birdRef}
        type='button'
        className='group grid cursor-pointer place-items-center rounded-xl border-0 bg-transparent p-5 font-mono text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background motion-reduce:transition-none'
        aria-label={
          motionReduced
            ? 'Dancing ASCII bird. Motion is reduced by your system setting.'
            : 'Dancing ASCII bird. Click for another move.'
        }
        aria-disabled={motionReduced}
        data-airborne={isAirborne(pose)}
        onClick={() => playEncoreRef.current?.()}
      >
        <pre
          className='h-[9.6em] w-[21ch] select-none overflow-hidden whitespace-pre text-[clamp(1rem,4.8vw,1.65rem)] leading-[1.2] tracking-[0.02em] sm:text-[1.65rem]'
          aria-hidden='true'
        >
          {drawPose(pose)}
        </pre>

        <span
          className='-mt-8 h-1.5 w-20 rounded-[50%] bg-current opacity-10 blur-[3px] transition-[opacity,transform] duration-150 group-data-[airborne=true]:scale-x-75 group-data-[airborne=true]:opacity-5 motion-reduce:transition-none'
          aria-hidden='true'
        />
      </button>

      <p
        className='absolute bottom-5 m-0 font-mono text-[11px] tracking-[0.04em] text-muted-foreground opacity-0 transition-opacity duration-200 group-hover/stage:opacity-100 group-focus-within/stage:opacity-100 motion-reduce:transition-none'
        aria-live='polite'
      >
        {caption}
      </p>
    </div>
  );
}
