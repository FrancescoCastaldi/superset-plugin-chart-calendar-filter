import { useMemo } from 'react';
import { parseDateValue, formatDateKey } from '../utils/dateUtils';
import { getBaseColor } from '../utils/themeUtils';

export function useCalendarData(
  data: Record<string, any>[] | undefined,
  dateColumn: string | undefined,
  colorScheme: string,
  viewYear: number,
  today: Date
) {
  // Determine date column and records
  const dataMap = useMemo(() => {
    if (!data || data.length === 0) {
      return { map: new Map<string, number>(), min: 0, max: 0, hasData: false, minDate: null as string | null, maxDate: null as string | null };
    }

    const map = new Map<string, number>();
    let min = Infinity;
    let max = -Infinity;
    let minDate: string | null = null;
    let maxDate: string | null = null;

    const firstRow = data[0] as Record<string, unknown>;
    const keys = Object.keys(firstRow);
    
    let dateKey = dateColumn && keys.includes(dateColumn) ? dateColumn : undefined;
    if (!dateKey) {
      dateKey = keys.find(k => {
        const val = firstRow[k];
        return val && (typeof val === 'string' || val instanceof Date) && parseDateValue(val) !== null;
      });
    }
    if (!dateKey) {
      dateKey = keys.find(k => {
        const val = firstRow[k];
        return val && typeof val === 'number' && val > 31536000000 && parseDateValue(val) !== null;
      });
    }

    const metricKey = keys.find(k => k !== dateKey && typeof firstRow[k] === 'number');

    data.forEach(row => {
      const r = row as Record<string, unknown>;
      const dateVal = dateKey ? r[dateKey] : null;
      const metricVal = metricKey ? Number(r[metricKey]) : 0;
      const d = parseDateValue(dateVal);
      if (d && metricVal != null && !Number.isNaN(metricVal)) {
        const key = formatDateKey(d);
        map.set(key, metricVal);
        if (metricVal < min) min = metricVal;
        if (metricVal > max) max = metricVal;
        if (minDate === null || key < minDate) minDate = key;
        if (maxDate === null || key > maxDate) maxDate = key;
      }
    });

    return { map, min, max, hasData: map.size > 0, minDate, maxDate };
  }, [data, dateColumn]);

  // Use dataMap.minDate/dataMap.maxDate directly - no need for separate memo
  const minDateBound = dataMap.minDate;
  const maxDateBound = dataMap.maxDate;

  // Available years for dropdown - FIXED: removed unnecessary viewYear dependency
  const availableYears = useMemo(() => {
    if (!minDateBound || !maxDateBound) {
      const y = today.getFullYear();
      return [y - 2, y - 1, y, y + 1, y + 2];
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

  // Color scale - stable function reference
  const { intensityScale, baseColor } = useMemo(() => {
    const base = getBaseColor(colorScheme);
    const range = dataMap.max - dataMap.min;
    const scale = (val: number | null): number => {
      if (val == null || range === 0) return 0;
      return (val - dataMap.min) / range;
    };
    return {
      baseColor: base,
      intensityScale: scale,
    };
  }, [colorScheme, dataMap.min, dataMap.max]);

  return {
    dataMap,
    minDateBound,
    maxDateBound,
    availableYears,
    intensityScale,
    baseColor,
  };
}