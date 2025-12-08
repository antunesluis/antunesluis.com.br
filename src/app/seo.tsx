import { Metadata } from 'next';

interface PageSEOProps {
  title: string;
  description: string;
}

export function genPageMetadata({
  title,
  description,
}: PageSEOProps): Metadata {
  return {
    title,
    description,
  };
}
