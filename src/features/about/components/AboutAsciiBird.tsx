'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useMotionEnvironment } from '@/lib/ascii-bird/use-motion-environment';
import {
  ABOUT_BIRD_SEQUENCE,
  drawAboutBirdPose,
  type AboutBirdPoseName,
} from './about-ascii-bird-animation';

type PlaybackStatus = 'greeting' | 'watching' | 'paused' | 'reduced';

type AboutAsciiBirdProps = {
  className?: string;
};

export function AboutAsciiBird({ className }: AboutAsciiBirdProps) {
  const [pose, setPose] = useState<AboutBirdPoseName>('idle');
  const [isHovered, setIsHovered] = useState(false);
  const { isPageVisible, motionReduced } = useMotionEnvironment();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (motionReduced || !isPageVisible) {
      timer = setTimeout(() => setPose('idle'), 0);
      return () => clearTimeout(timer);
    }

    if (isHovered) {
      timer = setTimeout(() => {
        setPose('blink');
        timer = setTimeout(() => setPose('idle'), 140);
      }, 650);

      return () => clearTimeout(timer);
    }

    let stepIndex = 0;

    function tick() {
      const step = ABOUT_BIRD_SEQUENCE[stepIndex];

      setPose(step.pose);
      stepIndex = (stepIndex + 1) % ABOUT_BIRD_SEQUENCE.length;
      timer = setTimeout(tick, step.ms);
    }

    timer = setTimeout(tick, 0);

    return () => clearTimeout(timer);
  }, [isHovered, isPageVisible, motionReduced]);

  const playbackStatus: PlaybackStatus = motionReduced
    ? 'reduced'
    : !isPageVisible
      ? 'paused'
      : isHovered
        ? 'watching'
        : 'greeting';

  return (
    <div
      className={clsx(
        'grid min-h-44 place-items-center lg:min-h-full',
        className,
      )}
      aria-hidden='true'
    >
      <div
        className={clsx(
          'group grid place-items-center rounded-xl p-3 font-mono transition-colors duration-200 hover:text-primary motion-reduce:transition-none lg:p-0',
          pose.startsWith('hello') ? 'text-primary' : 'text-foreground',
        )}
        data-pose={pose}
        data-speaking={pose.startsWith('hello')}
        data-status={playbackStatus}
        onPointerEnter={() => {
          const hasPrecisePointer = window.matchMedia(
            '(hover: hover) and (pointer: fine)',
          ).matches;

          if (motionReduced || !isPageVisible || !hasPrecisePointer) {
            return;
          }

          setPose('idle');
          setIsHovered(true);
        }}
        onPointerLeave={() => {
          setPose('idle');
          setIsHovered(false);
        }}
      >
        <span className='relative block text-[clamp(1rem,4vw,1.15rem)] leading-[1.2] lg:text-2xl'>
          <pre className='w-[21ch] select-none whitespace-pre pb-px'>
            {drawAboutBirdPose(pose)}
          </pre>

          <span
            className='absolute top-[7.65em] left-1/2 h-[0.2rem] w-[3rem] -translate-x-1/2 rounded-[50%] bg-current opacity-10 blur-[0.15rem]'
            aria-hidden='true'
          />
        </span>
      </div>
    </div>
  );
}
