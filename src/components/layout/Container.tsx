type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className='min-h-svh bg-background text-muted-foreground'>
      <div className='mx-auto flex min-h-svh max-w-[53rem] flex-col px-6'>
        {children}
      </div>
    </div>
  );
}
