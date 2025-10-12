type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className='min-h-screen text-slate-900 dark:text-slate-50 bg-slate-50 dark:bg-slate-900'>
      <div className='max-w-screen-lg mx-auto px-8'>{children}</div>
    </div>
  );
}
