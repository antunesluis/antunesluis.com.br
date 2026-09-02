type TimelineItem = {
  period: string;
  description: string;
};

const timelineItems: TimelineItem[] = [
  {
    period: '2004',
    description: 'Born in Rio Grande do Sul, Brazil.',
  },
  {
    period: '2023 - Present',
    description:
      'Began my bachelor\'s degree in Computer Science at the Federal University of Santa Maria (UFSM).',
  },
  {
    period: '2026 - Present',
    description:
      'Started my first internship as a full-stack developer at Pitang.',
  },
];

export function Timeline() {
  return (
    <ol className='space-y-3'>
      {timelineItems.map(({ period, description }) => (
        <li
          key={`${period}-${description}`}
          className='grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5'
        >
          <span className='font-semibold text-foreground sm:text-right'>
            {period}
          </span>
          <p className='leading-relaxed text-muted-foreground'>{description}</p>
        </li>
      ))}
    </ol>
  );
}
