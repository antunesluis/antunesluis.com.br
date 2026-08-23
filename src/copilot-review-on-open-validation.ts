export function formatRatio(value: number, total: number): string {
  return `${Math.round((value / total) * 100)}%`;
}
