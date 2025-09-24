import Image from 'next/image';

export function AboutHeader() {
  return (
    <div className='flex flex-col md:flex-row items-center gap-4 md:gap-0'>
      <div className='w-24 h-24 rounded-full overflow-hidden'>
        <Image
          src='/images/hero.jpg'
          alt='Luis Antunes'
          width={360}
          height={360}
          className='w-full h-full object-cover'
          priority
        />
      </div>
      <div className='flex flex-col justify-center ml-6'>
        <h1 className='text-xl md:text-2xl text-gray-900 font-semibold font-serif'>
          Luis Fernando Antunes
        </h1>
        <h2 className='text-lg text-gray-500 font-light'>
          Estudante de Ciência da Computação
        </h2>
      </div>
    </div>
  );
}
