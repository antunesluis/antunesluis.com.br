export function calculatePercentage(part: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return (part / total) * 100;
}
