import { ButtonLink } from '@/components/ui/ButtonLink';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';

export function ResumeSection() {
  return (
    <div className='flex flex-wrap items-center gap-3'>
      <ButtonLink
        href='/files/CV-Luis-Antunes.pdf'
        target='_blank'
        variant='default'
        size='sm'
        className='min-h-11'
      >
        <ExternalLinkIcon aria-hidden='true' />
        Open PDF
        <span className='sr-only'> (opens in a new tab)</span>
      </ButtonLink>

      <ButtonLink
        href='/files/CV-Luis-Antunes.pdf'
        download='CV-Luis-Antunes.pdf'
        variant='ghost'
        size='sm'
        className='min-h-11'
      >
        <DownloadIcon aria-hidden='true' />
        Download
      </ButtonLink>
    </div>
  );
}
