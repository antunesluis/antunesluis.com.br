'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, MessageSquareIcon } from 'lucide-react';
import clsx from 'clsx';

export function ScrollTopAndComment() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  const handleScrollTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const handleScrollToComment = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    document
      .getElementById('comments')
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const scrollAndTopClases = clsx(
    'inline-flex size-11 items-center justify-center rounded-full bg-muted text-card-foreground transition-colors hover:bg-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
  );

  return (
    <div
      className={`fixed right-8 bottom-8 hidden flex-col gap-3 ${
        show ? 'md:flex' : 'md:hidden'
      }`}
    >
      <button
        aria-label='Scroll to comments'
        onClick={handleScrollToComment}
        className={scrollAndTopClases}
      >
        <MessageSquareIcon className='h-5 w-5' />
      </button>

      <button
        aria-label='Scroll to top'
        onClick={handleScrollTop}
        className={scrollAndTopClases}
      >
        <ArrowUpIcon className='h-5 w-5' />
      </button>
    </div>
  );
}
