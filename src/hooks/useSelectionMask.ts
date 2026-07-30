import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { formatDateKey, getDaysInMonth, getDatesBetween } from '../utils/dateUtils';
import { FilterTypeMode, DefaultValueMode } from '../types';

export function useSelectionMask(
  filterState: any,
  setDataMask: ((mask: any) => void) | undefined,
  filterTypeMode: FilterTypeMode,
  dateColumn: string | undefined,
  defaultValueMode: DefaultValueMode,
  customDefaultStartDate?: string,
  customDefaultEndDate?: string
) {
  // Selected dates from filterState
  const selectedDates: Set<string> = useMemo(() => {
    if (filterState?.selectedValues) {
      return new Set(Object.keys(filterState.selectedValues));
    }
    if (filterState?.value) {
      const vals = Array.isArray(filterState.value) ? filterState.value : [filterState.value];
      return new Set(vals.map(String));
    }
    return new Set<string>();
  }, [filterState]);

  // Unified selection emission handler
  const emitSelection = useCallback(
    (datesArray: string[]) => {
      if (!setDataMask) return;
      const sorted = Array.from(new Set(datesArray)).sort();
      let extraFormData: Record<string, unknown> = {};

      if (sorted.length > 0) {
        if (filterTypeMode === 'time_range') {
          const minD = sorted[0];
          const maxD = sorted[sorted.length - 1];
          extraFormData = {
            time_range: `${minD} : ${maxD}`,
            filters: [
              { col: dateColumn ?? '__timestamp', op: '>=', val: minD },
              { col: dateColumn ?? '__timestamp', op: '<=', val: maxD },
            ],
          };
        } else {
          extraFormData = {
            filters: [{ col: dateColumn ?? '__timestamp', op: 'IN' as const, val: sorted }],
          };
        }
      } else {
        extraFormData = { filters: [] };
      }

      setDataMask({
        extraFormData,
        filterState: {
          value: sorted.length ? sorted : null,
          selectedValues: sorted.length
            ? sorted.reduce((acc, date) => ({ ...acc, [date]: date }), {} as Record<string, string>)
            : null,
        },
      });
    },
    [setDataMask, filterTypeMode, dateColumn],
  );

  // Initialize Default Value on Mount if not already selected
  const defaultInitialized = useRef(false);
  useEffect(() => {
    if (defaultInitialized.current || !setDataMask || selectedDates.size > 0 || defaultValueMode === 'none') {
      return;
    }
    defaultInitialized.current = true;
    const now = new Date();
    const currentY = now.getFullYear();
    const currentM = now.getMonth() + 1;
    const todayFormatted = formatDateKey(now);

    if (defaultValueMode === 'today') {
      emitSelection([todayFormatted]);
    } else if (defaultValueMode === 'current_month') {
      const days = getDaysInMonth(currentY, currentM);
      const monthDates: string[] = [];
      for (let d = 1; d <= days; d++) {
        monthDates.push(`${currentY}-${String(currentM).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
      emitSelection(monthDates);
    } else if (defaultValueMode === 'current_year') {
      const yearDates: string[] = [];
      for (let m = 1; m <= 12; m++) {
        const days = getDaysInMonth(currentY, m);
        for (let d = 1; d <= days; d++) {
          yearDates.push(`${currentY}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
        }
      }
      emitSelection(yearDates);
    } else if (defaultValueMode === 'custom' && customDefaultStartDate && customDefaultEndDate) {
      emitSelection(getDatesBetween(customDefaultStartDate, customDefaultEndDate));
    }
  }, [defaultValueMode, setDataMask, selectedDates.size, customDefaultStartDate, customDefaultEndDate, emitSelection]);

  const clearSelection = useCallback(() => {
    emitSelection([]);
  }, [emitSelection]);

  // Click single or shift select helper
  const handleDayToggle = useCallback(
    (dateStr: string) => {
      if (!setDataMask) return;

      let newSelected = new Set(selectedDates);

      if (selectedDates.size === 1) {
        const firstDate = Array.from(selectedDates)[0];
        if (firstDate === dateStr) {
          newSelected.delete(dateStr);
        } else {
          newSelected.clear();
          const range = getDatesBetween(firstDate, dateStr);
          range.forEach(d => newSelected.add(d));
        }
      } else {
        newSelected.clear();
        newSelected.add(dateStr);
      }

      emitSelection(Array.from(newSelected));
    },
    [setDataMask, selectedDates, emitSelection],
  );

  // Drag to select state
  const [dragState, setDragState] = useState<{ isDragging: boolean; start: string | null; current: string | null }>({
    isDragging: false,
    start: null,
    current: null,
  });

  const handleDragStart = useCallback((dateStr: string) => {
    setDragState({ isDragging: true, start: dateStr, current: dateStr });
  }, []);

  const handleDragEnter = useCallback((dateStr: string) => {
    setDragState(prev => prev.isDragging ? { ...prev, current: dateStr } : prev);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging) return;
    if (dragState.start && dragState.current) {
      if (dragState.start !== dragState.current) {
        // Was a real drag, emit range
        const range = getDatesBetween(dragState.start, dragState.current);
        emitSelection(range);
      } else {
        // Was a click (start == current), let handleDayToggle do its thing
        // Or we can just call handleDayToggle here.
        // But since CalendarFilter might still use onClick, we just do nothing here for single clicks to avoid double fire
      }
    }
    setDragState({ isDragging: false, start: null, current: null });
  }, [dragState, emitSelection]);

  const effectiveSelectedDates = useMemo(() => {
    if (dragState.isDragging && dragState.start && dragState.current && dragState.start !== dragState.current) {
      return new Set(getDatesBetween(dragState.start, dragState.current));
    }
    return selectedDates;
  }, [selectedDates, dragState]);

  return {
    selectedDates: effectiveSelectedDates,
    emitSelection,
    clearSelection,
    handleDayToggle,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
