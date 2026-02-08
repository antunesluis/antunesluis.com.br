'use client';

import { Button } from '@/components/ui';
import { DownloadIcon, ExternalLinkIcon } from 'lucide-react';

export function ResumeSection() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/files/CV-Luis-Antunes.pdf';
    link.download = 'CV-Luis-Antunes.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open('/files/CV-Luis-Antunes.pdf', '_blank');
  };

  return (
    <div className='space-y-4'>
      <p className='text-md'>
        If you’re interested, you can view or download my resume.
      </p>

      <div className='flex gap-3 justify-center sm:justify-start'>
        <Button onClick={handleView} variant='default' size='md'>
          <ExternalLinkIcon />
          View
        </Button>

        <Button onClick={handleDownload} variant='ghost' size='md'>
          <DownloadIcon />
          Download
        </Button>
      </div>
    </div>
  );
}
