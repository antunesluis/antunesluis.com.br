import {
  formatDistanceToNow,
  formatFullDateTime,
  formatShortDate,
} from '@/lib/utils';
import clsx from 'clsx';

type PostDateProps = {
  dateTime: string;
  compact?: boolean;
};

export function PostDate({ dateTime, compact = false }: PostDateProps) {
  return (
    <time
      dateTime={dateTime}
      title={formatDistanceToNow(dateTime)}
      className={clsx(
        'text-muted-foreground',
        compact ? 'text-sm/tight tabular-nums' : 'text-base/tight',
      )}
    >
      {compact ? formatShortDate(dateTime) : formatFullDateTime(dateTime)}
    </time>
  );
}
