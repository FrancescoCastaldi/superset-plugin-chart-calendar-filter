import {
  addDays,
  formatDateKey,
  formatDateParts,
  getDatesBetween,
  getDaysInMonth,
  getWeekDates,
} from './dateUtils';

export type PresetId =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'month_to_date'
  | 'last_month'
  | 'last_quarter'
  | 'year_to_date'
  | 'last_year';

export const PRESET_IDS: PresetId[] = [
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'last_7_days',
  'last_30_days',
  'last_90_days',
  'month_to_date',
  'last_month',
  'last_quarter',
  'year_to_date',
  'last_year',
];

/** Presets shown when the chart does not configure its own list */
export const DEFAULT_PRESETS: PresetId[] = ['last_7_days', 'last_30_days', 'last_month', 'year_to_date'];

export interface DateRange {
  start: string;
  end: string;
}

/**
 * Inclusive date range of a relative preset, evaluated against `now`.
 * "Last N days" counts today as the last day.
 */
export function getPresetRange(id: PresetId, now: Date, firstDayOfWeek = 1): DateRange {
  const today = formatDateKey(now);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  switch (id) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday': {
      const y = addDays(today, -1);
      return { start: y, end: y };
    }
    case 'this_week': {
      const week = getWeekDates(today, firstDayOfWeek);
      return { start: week[0], end: week[6] };
    }
    case 'last_week': {
      const week = getWeekDates(addDays(today, -7), firstDayOfWeek);
      return { start: week[0], end: week[6] };
    }
    case 'last_7_days':
      return { start: addDays(today, -6), end: today };
    case 'last_30_days':
      return { start: addDays(today, -29), end: today };
    case 'last_90_days':
      return { start: addDays(today, -89), end: today };
    case 'month_to_date':
      return { start: formatDateParts(year, month, 1), end: today };
    case 'last_month': {
      const y = month === 1 ? year - 1 : year;
      const m = month === 1 ? 12 : month - 1;
      return { start: formatDateParts(y, m, 1), end: formatDateParts(y, m, getDaysInMonth(y, m)) };
    }
    case 'last_quarter': {
      const currentQuarter = Math.floor((month - 1) / 3);
      const y = currentQuarter === 0 ? year - 1 : year;
      const q = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const startMonth = q * 3 + 1;
      const endMonth = startMonth + 2;
      return {
        start: formatDateParts(y, startMonth, 1),
        end: formatDateParts(y, endMonth, getDaysInMonth(y, endMonth)),
      };
    }
    case 'year_to_date':
      return { start: formatDateParts(year, 1, 1), end: today };
    case 'last_year':
      return { start: formatDateParts(year - 1, 1, 1), end: formatDateParts(year - 1, 12, 31) };
    default:
      return { start: today, end: today };
  }
}

/** Every date key of a preset, ready for `emitSelection` */
export function getPresetDates(id: PresetId, now: Date, firstDayOfWeek = 1): string[] {
  const { start, end } = getPresetRange(id, now, firstDayOfWeek);
  return getDatesBetween(start, end);
}

/** Keep only known preset ids, preserving order and dropping duplicates */
export function normalizePresets(raw: unknown): PresetId[] {
  if (raw == null) return DEFAULT_PRESETS;
  const list = Array.isArray(raw) ? raw : [raw];
  const seen = new Set<string>();
  const result: PresetId[] = [];
  list.forEach(item => {
    const id = String(item) as PresetId;
    if (PRESET_IDS.includes(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  });
  return result;
}
