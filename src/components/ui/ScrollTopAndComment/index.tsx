'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon, MessageSquareIcon } from 'lucide-react';

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

  return (
    <div
      className={`fixed right-8 bottom-8 hidden flex-col gap-3 ${
        show ? 'md:flex' : 'md:hidden'
      }`}
    >
      <button
        aria-label='Scroll to comments'
        onClick={handleScrollToComment}
        className='rounded-full bg-slate-200 p-2 text-slate-600 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
      >
        <MessageSquareIcon className='h-5 w-5' />
      </button>

      <button
        aria-label='Scroll to top'
        onClick={handleScrollTop}
        className='rounded-full bg-slate-200 p-2 text-slate-600 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
      >
        <ArrowUpIcon className='h-5 w-5' />
      </button>
    </div>
  );
}
