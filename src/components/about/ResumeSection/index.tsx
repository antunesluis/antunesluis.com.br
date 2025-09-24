'use client';

import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';

export function ResumeSection() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/files/CV-Luis-Antunes.pdf';
    link.download = 'CV-Luis-Antunes.pdf.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open('/files/CV-Luis-Antunes.pdf', '_blank');
  };

  return (
    <div className='space-y-4'>
      <Heading as='h3'>Currículo</Heading>

      <p className='text-slate-800 text-md'>
        Se tiver interesse, você pode visualizar ou baixar meu currículo.
      </p>

      <div className='flex gap-3 justify-center sm:justify-start'>
        <Button onClick={handleView} variant='default' size='md'>
          <ExternalLinkIcon />
          Visualizar
        </Button>

        <Button onClick={handleDownload} variant='ghost' size='md'>
          <DownloadIcon />
          Download
        </Button>
      </div>
    </div>
  );
}
