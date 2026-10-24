import { useMemo } from 'react';
import { parseDateValue, formatDateKey } from '../utils/dateUtils';
import { getBaseColor } from '../utils/themeUtils';
import { buildIntensityScale, getHeatStyle, getPalette, parseThresholds, ScaleType } from '../utils/colorScale';
import type { ValueAggregation } from '../types';

export interface CalendarDataOptions {
  /** Result column holding the metric; falls back to the first numeric column */
  metricKey?: string;
  /** How several rows of the same day are combined (default: sum) */
  aggregation?: ValueAggregation;
  scaleType?: ScaleType;
  scaleThresholds?: string;
}

const SAMPLE_ROWS = 20;

function findDateKey(rows: Record<string, unknown>[], keys: string[], dateColumn?: string): string | undefined {
  if (dateColumn && keys.includes(dateColumn)) return dateColumn;
  const isDateLike = (v: unknown) =>
    Boolean(v) && (typeof v === 'string' || v instanceof Date) && parseDateValue(v) !== null;
  const isEpochMs = (v: unknown) => typeof v === 'number' && v > 31536000000 && parseDateValue(v) !== null;
  return (
    keys.find(k => rows.some(r => isDateLike(r[k]))) ??
    keys.find(k => rows.some(r => isEpochMs(r[k])))
  );
}

function findMetricKey(
  rows: Record<string, unknown>[],
  keys: string[],
  dateKey: string | undefined,
  preferred?: string,
): string | undefined {
  if (preferred && keys.includes(preferred) && preferred !== dateKey) return preferred;
  return keys.find(k => k !== dateKey && rows.some(r => typeof r[k] === 'number'));
}

interface DayAccumulator {
  sum: number;
  count: number;
  min: number;
  max: number;
}

function resolveValue(acc: DayAccumulator, aggregation: ValueAggregation): number {
  switch (aggregation) {
    case 'avg':
      return acc.sum / acc.count;
    case 'max':
      return acc.max;
    case 'min':
      return acc.min;
    case 'count':
      return acc.count;
    default:
      return acc.sum;
  }
}

export function useCalendarData(
  data: Record<string, any>[] | undefined,
  dateColumn: string | undefined,
  colorScheme: string,
  viewYear: number,
  today: Date,
  options: CalendarDataOptions = {},
) {
  const { metricKey: preferredMetric, aggregation = 'sum', scaleType = 'linear', scaleThresholds } = options;

  // Determine date column and records
  const dataMap = useMemo(() => {
    if (!data || data.length === 0) {
      return { map: new Map<string, number>(), min: 0, max: 0, hasData: false, minDate: null as string | null, maxDate: null as string | null };
    }

    const rows = data as Record<string, unknown>[];
    const sample = rows.slice(0, SAMPLE_ROWS);
    const keys = Array.from(new Set(sample.flatMap(r => Object.keys(r))));
    const dateKey = findDateKey(sample, keys, dateColumn);
    const metricKey = findMetricKey(sample, keys, dateKey, preferredMetric);

    // Without a metric every row counts as one record, so the heatmap shows activity per day
    const perDay = new Map<string, DayAccumulator>();
    rows.forEach(r => {
      const d = parseDateValue(dateKey ? r[dateKey] : null);
      if (!d) return;
      const value = metricKey ? Number(r[metricKey]) : 1;
      if (Number.isNaN(value)) return;
      const key = formatDateKey(d);
      const acc = perDay.get(key);
      if (acc) {
        acc.sum += value;
        acc.count += 1;
        acc.min = Math.min(acc.min, value);
        acc.max = Math.max(acc.max, value);
      } else {
        perDay.set(key, { sum: value, count: 1, min: value, max: value });
      }
    });

    const map = new Map<string, number>();
    let min = Infinity;
    let max = -Infinity;
    let minDate: string | null = null;
    let maxDate: string | null = null;
    perDay.forEach((acc, key) => {
      const value = resolveValue(acc, aggregation);
      map.set(key, value);
      if (value < min) min = value;
      if (value > max) max = value;
      if (minDate === null || key < minDate) minDate = key;
      if (maxDate === null || key > maxDate) maxDate = key;
    });

    if (map.size === 0) {
      return { map, min: 0, max: 0, hasData: false, minDate: null as string | null, maxDate: null as string | null };
    }
    return { map, min, max, hasData: true, minDate, maxDate };
  }, [data, dateColumn, preferredMetric, aggregation]);

  // Use dataMap.minDate/dataMap.maxDate directly - no need for separate memo
  const minDateBound = dataMap.minDate;
  const maxDateBound = dataMap.maxDate;

  // Available years for dropdown - FIXED: removed unnecessary viewYear dependency
  const availableYears = useMemo(() => {
    if (!minDateBound || !maxDateBound) {
      const y = today.getFullYear();
      const years: number[] = [];
      for (let offset = -5; offset <= 5; offset++) {
        years.push(y + offset);
      }
      return years;
    }
    const minY = parseDateValue(minDateBound)?.getFullYear() ?? today.getFullYear();
    const maxY = Math.max(
      parseDateValue(maxDateBound)?.getFullYear() ?? today.getFullYear(),
      today.getFullYear()
    );
    const years: number[] = [];
    for (let y = minY; y <= maxY; y++) years.push(y);
    return years;
  }, [minDateBound, maxDateBound, today]); // viewYear removed - years don't depend on current view

  // Color scale - stable function references
  const { intensityScale, baseColor, palette, heatStyle } = useMemo(() => {
    const base = getBaseColor(colorScheme);
    const colors = getPalette(colorScheme);
    const scale = buildIntensityScale(dataMap.min, dataMap.max, scaleType, parseThresholds(scaleThresholds));
    return {
      baseColor: base,
      palette: colors,
      intensityScale: scale,
      heatStyle: (value: number | null, hasData: boolean) => getHeatStyle(colors, scale(value), hasData),
    };
  }, [colorScheme, dataMap.min, dataMap.max, scaleType, scaleThresholds]);

  return {
    dataMap,
    minDateBound,
    maxDateBound,
    availableYears,
    intensityScale,
    baseColor,
    palette,
    heatStyle,
  };
}
