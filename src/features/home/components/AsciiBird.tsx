'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ARRIVAL,
  CHOREOGRAPHIES,
  READY,
  drawPose,
  getNextChoreographyIndex,
  isAirborne,
  isLowPose,
  type PoseName,
} from './ascii-bird-animation';

type PlaybackStatus =
  'arriving' | 'ready' | 'dancing' | 'switching' | 'paused' | 'reduced';

const READY_CAPTION = 'click to start dancing';
const PRECISE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

function hasPrecisePointer() {
  return window.matchMedia(PRECISE_POINTER_QUERY).matches;
}

function choreographyCaption(index: number) {
  return `${CHOREOGRAPHIES[index].label} - click for next`;
}

export function AsciiBird() {
  const [pose, setPose] = useState<PoseName>('idleA');
  const [caption, setCaption] = useState('warming up...');
  const [activeChoreographyIndex, setActiveChoreographyIndex] = useState<
    number | null
  >(null);
  const [motionReduced, setMotionReduced] = useState(false);
  const [playbackStatus, setPlaybackStatus] =
    useState<PlaybackStatus>('arriving');
  const artRef = useRef<HTMLPreElement>(null);
  const nextChoreographyRef = useRef<(() => void) | null>(null);
  const readyAttentionRef = useRef<((engaged: boolean) => void) | null>(null);

  useEffect(() => {
    const art = artRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let arrivalAnimation: Animation | undefined;
    let status: PlaybackStatus = 'arriving';
    let choreographyIndex = -1;
    let readyStepIndex = 0;
    let currentPose: PoseName = 'idleA';
    let disposed = false;

    function clearTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    }

    function updateStatus(nextStatus: PlaybackStatus) {
      if (status === nextStatus) {
        return;
      }

      status = nextStatus;

      if (!disposed) {
        setPlaybackStatus(nextStatus);
      }
    }

    function draw(name: PoseName) {
      currentPose = name;

      if (!disposed) {
        setPose(name);
      }
    }

    function startChoreography(index: number) {
      clearTimer();
      choreographyIndex = index;

      if (document.hidden) {
        updateStatus('paused');
        return;
      }

      if (reducedMotion.matches) {
        updateStatus('reduced');
        return;
      }

      const choreography = CHOREOGRAPHIES[index];
      let stepIndex = 0;

      setActiveChoreographyIndex(index);
      setCaption(choreographyCaption(index));
      updateStatus('dancing');

      function tick() {
        clearTimer();

        if (document.hidden || reducedMotion.matches || status !== 'dancing') {
          return;
        }

        const current = choreography.steps[stepIndex];

        draw(current.pose);
        stepIndex = (stepIndex + 1) % choreography.steps.length;
        timer = setTimeout(tick, current.ms);
      }

      tick();
    }

    function tickReady() {
      clearTimer();

      if (document.hidden || reducedMotion.matches || status !== 'ready') {
        return;
      }

      const current = READY[readyStepIndex];

      if (!current) {
        draw('idleA');
        return;
      }

      draw(current.pose);
      readyStepIndex += 1;
      timer = setTimeout(tickReady, current.ms);
    }

    function startReady() {
      clearTimer();
      choreographyIndex = -1;
      readyStepIndex = 0;
      setActiveChoreographyIndex(null);
      setCaption(READY_CAPTION);

      if (document.hidden) {
        updateStatus('paused');
        draw('idleA');
        return;
      }

      if (reducedMotion.matches) {
        updateStatus('reduced');
        draw('idleA');
        return;
      }

      updateStatus('ready');
      tickReady();
    }

    function switchChoreography(index: number) {
      clearTimer();
      choreographyIndex = index;

      setActiveChoreographyIndex(index);
      setCaption(choreographyCaption(index));

      if (document.hidden) {
        updateStatus('paused');
        draw('idleA');
        return;
      }

      if (reducedMotion.matches) {
        updateStatus('reduced');
        draw('idleA');
        return;
      }

      if (isAirborne(currentPose)) {
        updateStatus('switching');
        draw('crouch');
        timer = setTimeout(() => startChoreography(index), 140);
        return;
      }

      startChoreography(index);
    }

    function arrive() {
      clearTimer();
      updateStatus('arriving');

      if (art) {
        arrivalAnimation = art.animate(
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

      let stepIndex = 0;

      function tick() {
        clearTimer();

        const current = ARRIVAL[stepIndex];

        if (!current) {
          startReady();
          return;
        }

        draw(current.pose);
        stepIndex += 1;
        timer = setTimeout(tick, current.ms);
      }

      tick();
    }

    function handleVisibilityChange() {
      clearTimer();
      arrivalAnimation?.cancel();

      if (document.hidden) {
        updateStatus('paused');
        draw('idleA');
        return;
      }

      if (choreographyIndex < 0) {
        startReady();
      } else {
        startChoreography(choreographyIndex);
      }
    }

    function handleMotionPreference() {
      clearTimer();
      arrivalAnimation?.cancel();
      setMotionReduced(reducedMotion.matches);
      setCaption(
        reducedMotion.matches
          ? 'motion reduced by system'
          : choreographyIndex < 0
            ? READY_CAPTION
            : choreographyCaption(choreographyIndex),
      );
      draw('idleA');

      if (reducedMotion.matches) {
        updateStatus('reduced');
      } else if (choreographyIndex < 0) {
        startReady();
      } else {
        startChoreography(choreographyIndex);
      }
    }

    nextChoreographyRef.current = () => {
      if (
        reducedMotion.matches ||
        (status !== 'ready' && status !== 'dancing')
      ) {
        return;
      }

      arrivalAnimation?.cancel();
      switchChoreography(getNextChoreographyIndex(choreographyIndex));
    };

    readyAttentionRef.current = engaged => {
      if (status !== 'ready') {
        return;
      }

      clearTimer();
      draw('idleA');

      if (!engaged) {
        timer = setTimeout(tickReady, 800);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', handleMotionPreference);

    if (reducedMotion.matches) {
      timer = setTimeout(() => {
        setMotionReduced(true);
        updateStatus('reduced');
        setCaption('motion reduced by system');
        draw('idleA');
      }, 0);
    } else {
      arrive();
    }

    return () => {
      disposed = true;
      clearTimer();
      arrivalAnimation?.cancel();
      nextChoreographyRef.current = null;
      readyAttentionRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <div className='relative grid min-h-64 w-full place-items-center overflow-hidden sm:min-h-72 md:min-h-80'>
      <button
        type='button'
        className='peer group grid touch-manipulation cursor-pointer place-items-center rounded-xl border-0 bg-transparent p-5 font-mono text-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:cursor-default disabled:hover:text-foreground motion-reduce:transition-none'
        aria-label={
          motionReduced
            ? 'Dancing ASCII bird. Motion is reduced by your system setting.'
            : activeChoreographyIndex === null
              ? playbackStatus === 'arriving'
                ? 'ASCII bird is arriving.'
                : 'ASCII bird ready to dance. Activate to start the first choreography.'
              : `Dancing ASCII bird. Current choreography: ${CHOREOGRAPHIES[activeChoreographyIndex].label}. Click for the next choreography.`
        }
        aria-busy={playbackStatus === 'arriving'}
        data-airborne={isAirborne(pose)}
        data-low={isLowPose(pose)}
        data-choreography={
          playbackStatus === 'arriving'
            ? 'arrival'
            : activeChoreographyIndex === null
              ? 'ready'
              : CHOREOGRAPHIES[activeChoreographyIndex].id
        }
        data-status={playbackStatus}
        disabled={motionReduced || playbackStatus === 'arriving'}
        onClick={() => nextChoreographyRef.current?.()}
        onFocus={() => readyAttentionRef.current?.(true)}
        onBlur={() => readyAttentionRef.current?.(false)}
        onPointerEnter={() => {
          if (hasPrecisePointer()) {
            readyAttentionRef.current?.(true);
          }
        }}
        onPointerLeave={() => {
          if (hasPrecisePointer()) {
            readyAttentionRef.current?.(false);
          }
        }}
      >
        <span className='relative block text-[clamp(1.25rem,6vw,1.9rem)] leading-[1.2] sm:text-[1.9rem]'>
          <pre
            ref={artRef}
            className='h-[8.4em] w-[15ch] select-none overflow-hidden whitespace-pre tracking-[0.02em]'
            aria-hidden='true'
          >
            {drawPose(pose)}
          </pre>

          <span
            className='absolute top-[6.45em] left-1/2 h-1.5 w-16 -translate-x-1/2 rounded-[50%] bg-current opacity-10 blur-[3px] transition-[opacity,transform] duration-100 group-data-[airborne=true]:scale-x-75 group-data-[airborne=true]:opacity-5 group-data-[low=true]:top-[7.65em] motion-reduce:transition-none'
            aria-hidden='true'
          />
        </span>
      </button>

      <p
        className='pointer-events-none absolute bottom-5 m-0 font-mono text-[11px] tracking-[0.04em] text-muted-foreground opacity-0 transition-opacity duration-200 peer-data-[status=ready]:opacity-100 peer-hover:opacity-100 peer-focus:opacity-100 motion-reduce:transition-none'
        aria-live='polite'
      >
        {caption}
      </p>
    </div>
  );
}
