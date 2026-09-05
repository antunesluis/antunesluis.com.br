import { ReactNode } from 'react';

type StatusPageProps = {
  actions: ReactNode;
  content: ReactNode;
  statusCode: string;
  title: string;
  visual: ReactNode;
};

export function StatusPage({
  actions,
  content,
  statusCode,
  title,
  visual,
}: StatusPageProps) {
  const headingId = `status-page-${statusCode}`;

  return (
    <>
      <title>{`${statusCode} - ${title}`}</title>

      <section
        className='mb-16 flex min-h-100 items-center justify-center rounded-xl bg-card p-5 text-center text-card-foreground shadow-xs sm:p-8'
        aria-labelledby={headingId}
      >
        <div className='mx-auto grid w-full max-w-3xl items-center gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-8'>
          <div className='space-y-5 lg:text-left'>
            <p
              className='text-7xl/tight font-extrabold text-card-foreground'
              aria-hidden='true'
            >
              {statusCode}
            </p>

            <div className='space-y-2'>
              <h1
                id={headingId}
                className='text-xl font-semibold text-card-foreground'
              >
                {title}
              </h1>

              <div className='mx-auto max-w-md text-muted-foreground lg:mx-0'>
                {content}
              </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start'>
              {actions}
            </div>
          </div>

          {visual}
        </div>
      </section>
    </>
  );
}
