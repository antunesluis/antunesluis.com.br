import { clsx } from 'clsx';

export default function NotFoundPage() {
  return (
    <div
      className={clsx(
        'min-h-[400px] bg-slate-900 text-slate-100',
        'mb-16 p-8 rounded-xl',
        'flex items-center justify-center',
        'text-center',
      )}
    >
      <div className='space-y-6'>
        <h1 className='text-7xl/tight mb-4 font-extrabold text-slate-100'>
          404
        </h1>
        <div className='space-y-2'>
          <p className='text-xl font-semibold text-slate-200'>
            Página não encontrada
          </p>
          <p className='text-slate-400 max-w-md'>
            A página que você está tentando acessar não existe ou foi movida.
          </p>
        </div>
      </div>
    </div>
  );
}
