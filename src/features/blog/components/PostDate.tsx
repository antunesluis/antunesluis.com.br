import { formatDistanceToNow, formatFullDateTime } from '@/lib/utils';

type PostDateProps = {
  dateTime: string;
};

export function PostDate({ dateTime }: PostDateProps) {
  return (
    <time
      dateTime={dateTime}
      title={formatDistanceToNow(dateTime)}
      className='text-md/tight text-muted-foreground'
    >
      {formatFullDateTime(dateTime)}
    </time>
  );
}
