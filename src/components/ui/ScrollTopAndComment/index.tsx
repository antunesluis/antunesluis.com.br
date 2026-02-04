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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToComment = () => {
    document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollAndTopClases = clsx(
    'rounded-full bg-muted p-2 text-card-foreground transition-all hover:bg-primary/50',
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
