'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ARRIVAL,
  CHOREOGRAPHIES,
  drawPose,
  getNextChoreographyIndex,
  isAirborne,
  type PoseName,
} from './ascii-bird-animation';

type PlaybackStatus =
  'arriving' | 'dancing' | 'switching' | 'paused' | 'reduced';

function choreographyCaption(index: number) {
  return `${CHOREOGRAPHIES[index].label} - click for next`;
}

export function AsciiBird() {
  const [pose, setPose] = useState<PoseName>('idleA');
  const [caption, setCaption] = useState('warming up...');
  const [activeChoreographyIndex, setActiveChoreographyIndex] = useState(0);
  const [motionReduced, setMotionReduced] = useState(false);
  const [playbackStatus, setPlaybackStatus] =
    useState<PlaybackStatus>('arriving');
  const artRef = useRef<HTMLPreElement>(null);
  const nextChoreographyRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const art = artRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let arrivalAnimation: Animation | undefined;
    let status: PlaybackStatus = 'arriving';
    let choreographyIndex = -1;
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
          startChoreography(0);
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

      startChoreography(choreographyIndex < 0 ? 0 : choreographyIndex);
    }

    function handleMotionPreference() {
      clearTimer();
      arrivalAnimation?.cancel();
      setMotionReduced(reducedMotion.matches);
      setCaption(
        reducedMotion.matches
          ? 'motion reduced by system'
          : choreographyCaption(choreographyIndex < 0 ? 0 : choreographyIndex),
      );
      draw('idleA');

      if (reducedMotion.matches) {
        updateStatus('reduced');
      } else {
        startChoreography(choreographyIndex < 0 ? 0 : choreographyIndex);
      }
    }

    nextChoreographyRef.current = () => {
      if (reducedMotion.matches) {
        return;
      }

      arrivalAnimation?.cancel();
      switchChoreography(getNextChoreographyIndex(choreographyIndex));
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
            : `Dancing ASCII bird. Current choreography: ${CHOREOGRAPHIES[activeChoreographyIndex].label}. Click for the next choreography.`
        }
        aria-busy={playbackStatus === 'arriving'}
        data-airborne={isAirborne(pose)}
        data-choreography={CHOREOGRAPHIES[activeChoreographyIndex].id}
        data-status={playbackStatus}
        disabled={motionReduced}
        onClick={() => nextChoreographyRef.current?.()}
      >
        <pre
          ref={artRef}
          className='h-[9.6em] w-[21ch] select-none overflow-hidden whitespace-pre text-[clamp(1.1rem,5.5vw,1.65rem)] leading-[1.2] tracking-[0.02em] sm:text-[1.65rem]'
          aria-hidden='true'
        >
          {drawPose(pose)}
        </pre>

        <span
          className='-mt-8 h-1.5 w-20 rounded-[50%] bg-current opacity-10 blur-[3px] transition-[opacity,transform] duration-100 group-data-[airborne=true]:scale-x-75 group-data-[airborne=true]:opacity-5 motion-reduce:transition-none'
          aria-hidden='true'
        />
      </button>

      <p
        className='pointer-events-none absolute bottom-5 m-0 font-mono text-[11px] tracking-[0.04em] text-muted-foreground opacity-0 transition-opacity duration-200 peer-hover:opacity-100 peer-focus:opacity-100 motion-reduce:transition-none'
        aria-live='polite'
      >
        {caption}
      </p>
    </div>
  );
}
