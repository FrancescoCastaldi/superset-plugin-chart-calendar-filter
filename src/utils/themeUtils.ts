export const COLOR_PALETTES: Record<string, string[]> = {
  supersetColors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  greens: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blues: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  oranges: ['#ebedf0', '#fddfb8', '#fdb87d', '#f59241', '#e66b1f'],
  reds: ['#ebedf0', '#ffd1d1', '#ff9b9b', '#ff6b6b', '#e63946'],
  purples: ['#ebedf0', '#d5c6e0', '#b392c4', '#8c6bb1', '#6a3d9a'],
};

/** Get the base color from a palette (the strongest color) */
export function getBaseColor(paletteName: string): string {
  const palette = COLOR_PALETTES[paletteName];
  return palette ? palette[palette.length - 1] : COLOR_PALETTES.supersetColors[COLOR_PALETTES.supersetColors.length - 1];
}
