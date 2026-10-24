import { COLOR_PALETTES } from './themeUtils';

export type ScaleType = 'linear' | 'log' | 'sqrt' | 'steps';

/** Parse "10, 50; 100" into a sorted list of finite numbers */
export function parseThresholds(text: string | undefined | null): number[] {
  if (!text) return [];
  return text
    .split(/[,;\s]+/)
    .map(part => part.trim())
    .filter(Boolean)
    .map(Number)
    .filter(n => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * Map a metric value to an intensity in [0, 1].
 * `null` (no data) and a flat range both give 0.
 */
export function buildIntensityScale(
  min: number,
  max: number,
  type: ScaleType = 'linear',
  thresholds: number[] = [],
): (val: number | null) => number {
  const range = max - min;
  return (val: number | null): number => {
    if (val == null || Number.isNaN(val)) return 0;

    if (type === 'steps' && thresholds.length > 0) {
      const bucket = thresholds.filter(t => val >= t).length;
      return bucket / thresholds.length;
    }
    if (range <= 0) return 0;

    const linear = Math.min(1, Math.max(0, (val - min) / range));
    if (type === 'log') return Math.log1p(linear * (Math.E ** 4 - 1)) / 4;
    if (type === 'sqrt') return Math.sqrt(linear);
    return linear;
  };
}

export interface HeatStyle {
  background: string;
  /** True when the background is dark enough to need light text */
  dark: boolean;
}

/** Palette colors of a scheme, from "no activity" to the strongest shade */
export function getPalette(colorScheme: string): string[] {
  return COLOR_PALETTES[colorScheme] ?? COLOR_PALETTES.supersetColors;
}

/**
 * Color of a cell for a given intensity. Cells without data return `null`
 * so callers can render them neutral; a real value of 0 uses the first
 * shade of the palette, so "zero" and "no data" stay distinguishable.
 */
export function getHeatStyle(
  palette: string[],
  intensity: number,
  hasData: boolean,
): HeatStyle | null {
  if (!hasData || palette.length === 0) return null;
  const idx = Math.min(palette.length - 1, Math.round(intensity * (palette.length - 1)));
  return { background: palette[idx], dark: idx >= Math.ceil((palette.length - 1) * 0.75) };
}
