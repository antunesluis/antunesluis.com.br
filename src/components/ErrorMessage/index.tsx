import { clsx } from 'clsx';
import { ReactNode } from 'react';

type ErrorMessageProps = {
  statusCode?: number;
  title?: string;
  content: ReactNode;
  className?: string;
  showStatusCode?: boolean;
};

export default function ErrorMessage({
  statusCode,
  title,
  content,
  className,
  showStatusCode = true,
}: ErrorMessageProps) {
  return (
    <>
      <title>{title}</title>
      <div
        className={clsx(
          'min-h-[400px] bg-slate-900 text-slate-100',
          'mb-16 p-8 rounded-xl',
          'flex items-center justify-center',
          'text-center',
          className,
        )}
      >
        <div className='space-y-6'>
          {showStatusCode && statusCode && (
            <h1 className='text-7xl/tight mb-4 font-extrabold text-slate-100'>
              {statusCode}
            </h1>
          )}

          <div className='space-y-2'>
            {title && (
              <p className='text-xl font-semibold text-slate-200'>{title}</p>
            )}

            <div className='text-slate-400 max-w-md'>{content}</div>
          </div>
        </div>
      </div>
    </>
  );
}
