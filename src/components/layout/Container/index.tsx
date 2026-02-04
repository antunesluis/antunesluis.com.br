type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className='min-h-screen text-foreground bg-background'>
      <div className='max-w-4xl mx-auto px-6'>{children}</div>
    </div>
  );
}
