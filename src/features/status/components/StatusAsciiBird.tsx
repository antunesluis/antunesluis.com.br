'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useMotionEnvironment } from '@/lib/ascii-bird/use-motion-environment';
import {
  STATUS_BIRD_CONFIG,
  drawStatusBirdPose,
  getStatusBirdAccent,
  isStatusBirdAirborne,
  isStatusBirdLowPose,
  type StatusBirdPoseName,
  type StatusBirdVariant,
} from './status-ascii-bird-animation';

type PlaybackMode = 'ambient' | 'interaction';
type PlaybackStatus = PlaybackMode | 'paused' | 'reduced';

type StatusAsciiBirdProps = {
  variant: StatusBirdVariant;
};

export function StatusAsciiBird({ variant }: StatusAsciiBirdProps) {
  const config = STATUS_BIRD_CONFIG[variant];
  const [pose, setPose] = useState<StatusBirdPoseName>(config.idlePose);
  const [mode, setMode] = useState<PlaybackMode>('ambient');
  const [interactionRun, setInteractionRun] = useState(0);
  const ambientStartIndexRef = useRef(0);
  const { isPageVisible, motionReduced } = useMotionEnvironment();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (motionReduced || !isPageVisible) {
      timer = setTimeout(() => setPose(config.idlePose), 0);
      return () => clearTimeout(timer);
    }

    const sequence =
      mode === 'interaction' ? config.interaction : config.ambient;
    let stepIndex = mode === 'ambient' ? ambientStartIndexRef.current : 0;

    ambientStartIndexRef.current = 0;

    function tick() {
      const step = sequence[stepIndex];

      if (!step) {
        ambientStartIndexRef.current = 1;
        setMode('ambient');
        return;
      }

      setPose(step.pose);
      stepIndex =
        mode === 'ambient' ? (stepIndex + 1) % sequence.length : stepIndex + 1;
      timer = setTimeout(tick, step.ms);
    }

    timer = setTimeout(tick, 0);

    return () => clearTimeout(timer);
  }, [config, interactionRun, isPageVisible, mode, motionReduced]);

  const playbackStatus: PlaybackStatus = motionReduced
    ? 'reduced'
    : !isPageVisible
      ? 'paused'
      : mode;
  const accent = getStatusBirdAccent(pose);
  const commonProps = {
    'data-accent': accent,
    'data-airborne': isStatusBirdAirborne(pose),
    'data-low': isStatusBirdLowPose(pose),
    'data-pose': pose,
    'data-status': playbackStatus,
    'data-variant': variant,
  } as const;
  const art = (
    <span className='relative block text-[clamp(1.125rem,5vw,1.35rem)] leading-[1.2] lg:text-2xl'>
      <pre
        className='w-[17ch] select-none whitespace-pre pb-px'
        aria-hidden='true'
      >
        {drawStatusBirdPose(pose)}
      </pre>

      <span
        className='absolute top-[6.45em] left-1/2 h-[0.2rem] w-[3rem] -translate-x-1/2 rounded-[50%] bg-current opacity-10 blur-[0.15rem] transition-[opacity,transform] duration-150 group-data-[airborne=true]:scale-x-75 group-data-[airborne=true]:opacity-5 group-data-[low=true]:top-[7.65em] motion-reduce:transition-none'
        aria-hidden='true'
      />
    </span>
  );
  const birdClasses = clsx(
    'group grid place-items-center rounded-xl border-0 bg-transparent p-3 font-mono transition-colors duration-150 motion-reduce:transition-none',
    accent === 'primary'
      ? 'text-primary'
      : accent === 'error'
        ? 'text-error'
        : 'text-foreground',
  );

  return (
    <div className='relative grid min-h-48 w-full place-items-center lg:min-h-56'>
      {motionReduced ? (
        <div
          {...commonProps}
          className={birdClasses}
          role='img'
          aria-label={config.reducedAriaLabel}
        >
          {art}
        </div>
      ) : (
        <button
          {...commonProps}
          type='button'
          className={clsx(
            birdClasses,
            'peer cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card',
            accent === 'none' && 'hover:text-primary',
          )}
          aria-label={config.ariaLabel}
          onClick={() => {
            if (!isPageVisible) {
              return;
            }

            setMode('interaction');
            setInteractionRun(run => run + 1);
          }}
        >
          {art}
        </button>
      )}

      {!motionReduced && (
        <p
          className='pointer-events-none absolute bottom-1 m-0 font-mono text-[11px] tracking-[0.03em] text-muted-foreground opacity-0 transition-opacity duration-200 peer-hover:opacity-100 peer-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 motion-reduce:transition-none'
          aria-hidden='true'
        >
          {config.caption}
        </p>
      )}
    </div>
  );
}
