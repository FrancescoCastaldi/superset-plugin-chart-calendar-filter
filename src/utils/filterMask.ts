import { addDays, dateKeyToEpochMs, isContiguousSelection } from './dateUtils';

/**
 * - `time_range`: always one native range from the first to the last day
 * - `in_clause`: always the list of selected values
 * - `auto`: one range when the days are contiguous, otherwise the list
 */
export type FilterTypeMode = 'time_range' | 'in_clause' | 'auto';

/** Shape of the values sent in an `IN` filter, to match the column type */
export type InValueFormat = 'date' | 'datetime' | 'epoch_ms';

export function formatInValue(dateKey: string, format: InValueFormat): string | number {
  if (format === 'datetime') return `${dateKey} 00:00:00`;
  if (format === 'epoch_ms') return dateKeyToEpochMs(dateKey) ?? dateKey;
  return dateKey;
}

/**
 * `extraFormData` for a set of selected date keys.
 *
 * Superset time ranges are `[start, end)`: the end is the day after the last
 * selected day, otherwise the last day (or a single day) would be excluded.
 * Without a target column no filter can be built, so nothing is emitted.
 */
export function buildExtraFormData(
  dates: string[],
  column: string | undefined,
  mode: FilterTypeMode = 'auto',
  inFormat: InValueFormat = 'date',
): Record<string, unknown> {
  const sorted = Array.from(new Set(dates)).sort();
  if (sorted.length === 0 || !column) return { filters: [] };

  const useRange = mode === 'time_range' || (mode === 'auto' && isContiguousSelection(sorted));
  if (useRange) {
    const range = `${sorted[0]} : ${addDays(sorted[sorted.length - 1], 1)}`;
    return {
      time_range: range,
      filters: [{ col: column, op: 'TEMPORAL_RANGE', val: range }],
    };
  }
  return {
    filters: [{ col: column, op: 'IN', val: sorted.map(d => formatInValue(d, inFormat)) }],
  };
}
