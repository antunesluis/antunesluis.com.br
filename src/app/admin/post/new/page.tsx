import { Button } from '@/components/Button';
import { BugIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Post Admin - New Post',
};

export default async function AdminPostNewPage() {
  return (
    <>
      <div className='py-16 flex flex-wrap items-center gap-2'>
        <Button variant='default' size='sm' type='submit'>
          <BugIcon />
          Confirma
        </Button>
        <Button variant='ghost' size='md' type='submit'>
          <BugIcon />
          Confirma
        </Button>
        <Button variant='danger' size='lg' type='submit'>
          <BugIcon />
          Confirma
        </Button>
      </div>
      <div className='py-16 flex flex-wrap items-center gap-2'>
        <Button disabled variant='default' size='sm' type='submit'>
          <BugIcon />
          Confirma
        </Button>
        <Button disabled variant='ghost' size='md' type='submit'>
          <BugIcon />
          Confirma
        </Button>
        <Button disabled variant='danger' size='lg' type='submit'>
          <BugIcon />
          Confirma
        </Button>
      </div>
    </>
  );
}
