type PageTitleProps = {
  pageName: string;
};

export function PageTitle({ pageName }: PageTitleProps) {
  return (
    <div>
      <h1 className='text-6xl lg:text-8xl font-bold pb-16 font-serif tracking-tighter'>
        {pageName}
      </h1>
    </div>
  );
}
