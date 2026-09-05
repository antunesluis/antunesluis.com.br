export type AsciiFramePlacement = {
  column?: number;
  horizontalOffset?: number;
  row: number;
  value: string;
};

type AsciiFrameOptions = {
  columns: number;
  placements: readonly AsciiFramePlacement[];
  rows: number;
};

export function createAsciiFrame({
  columns,
  placements,
  rows,
}: AsciiFrameOptions) {
  const grid = Array.from({ length: rows }, () => Array(columns).fill(' '));

  placements.forEach(({ column, horizontalOffset = 0, row, value }) => {
    const characters = [...value];
    const firstColumn =
      (column ?? Math.floor((columns - characters.length) / 2)) +
      horizontalOffset;

    if (
      row < 0 ||
      row >= rows ||
      firstColumn < 0 ||
      firstColumn + characters.length > columns
    ) {
      throw new Error('ASCII frame content exceeds the available space.');
    }

    characters.forEach((character, index) => {
      grid[row][firstColumn + index] = character;
    });
  });

  return grid.map(line => line.join('')).join('\n');
}
