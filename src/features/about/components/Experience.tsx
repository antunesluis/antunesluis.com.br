import { Heading } from '@/components/ui/Heading';
import { ExternalLinkIcon } from 'lucide-react';

type ExperienceItem = {
  title: string;
  institution: string;
  institutionUrl: string;
  period: string;
};

const experienceItems: ExperienceItem[] = [
  {
    title: 'Full-stack Developer Intern',
    institution: 'Pitang',
    institutionUrl: 'https://www.pitang.com/',
    period: '2026 - Present',
  },
  {
    title: 'B.Sc. in Computer Science',
    institution: 'Federal University of Santa Maria (UFSM)',
    institutionUrl: 'https://www.ufsm.br/',
    period: '2023 - Present',
  },
];

export function Experience() {
  return (
    <ol className='space-y-8'>
      {experienceItems.map(({ title, institution, institutionUrl, period }) => (
        <li key={`${institution}-${title}`} className='space-y-1.5'>
          <Heading as='h3' withUnderline={false}>
            {title}
          </Heading>

          <p>
            <a
              href={institutionUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='group inline-flex items-center gap-1.5 rounded-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none'
            >
              {institution}
              <span className='sr-only'> (opens in a new tab)</span>
              <ExternalLinkIcon
                aria-hidden='true'
                className='size-3.5 shrink-0 opacity-60 transition-[opacity,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 motion-reduce:transform-none motion-reduce:transition-none'
              />
            </a>
          </p>

          <p className='text-sm tabular-nums text-muted-foreground'>{period}</p>
        </li>
      ))}
    </ol>
  );
}
