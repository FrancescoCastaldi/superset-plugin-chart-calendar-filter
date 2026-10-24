import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { formatDateKey, getDatesInMonth, getDatesInYear, getDatesBetween } from '../utils/dateUtils';
import { DefaultValueMode } from '../types';
import { getPresetDates, PRESET_IDS, PresetId } from '../utils/presets';
import { buildExtraFormData, FilterTypeMode, InValueFormat } from '../utils/filterMask';

export function useSelectionMask(
  filterState: any,
  setDataMask: ((mask: any) => void) | undefined,
  filterTypeMode: FilterTypeMode,
  dateColumn: string | undefined,
  defaultValueMode: DefaultValueMode,
  customDefaultStartDate?: string,
  customDefaultEndDate?: string,
  inValueFormat: InValueFormat = 'date',
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
      const extraFormData = buildExtraFormData(sorted, dateColumn, filterTypeMode, inValueFormat);

      // Plain loop: the previous reduce+spread was quadratic on multi-year selections
      let selectedValues: Record<string, string> | null = null;
      if (sorted.length) {
        selectedValues = {};
        sorted.forEach(date => {
          (selectedValues as Record<string, string>)[date] = date;
        });
      }

      setDataMask({
        extraFormData,
        filterState: {
          value: sorted.length ? sorted : null,
          selectedValues,
        },
      });
    },
    [setDataMask, filterTypeMode, dateColumn, inValueFormat],
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
      emitSelection(getDatesInMonth(currentY, currentM));
    } else if (defaultValueMode === 'current_year') {
      emitSelection(getDatesInYear(currentY));
    } else if (PRESET_IDS.includes(defaultValueMode as PresetId)) {
      emitSelection(getPresetDates(defaultValueMode as PresetId, now, 1));
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

  // The cell and the window both report the button release; only the first one counts
  const dragFinished = useRef(true);

  const handleDragStart = useCallback((dateStr: string) => {
    dragFinished.current = false;
    setDragState({ isDragging: true, start: dateStr, current: dateStr });
  }, []);

  const handleDragEnter = useCallback((dateStr: string) => {
    setDragState(prev => prev.isDragging ? { ...prev, current: dateStr } : prev);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!dragState.isDragging || dragFinished.current) return;
    dragFinished.current = true;
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

  // Releasing the button outside any day cell would otherwise leave the drag stuck
  useEffect(() => {
    if (!dragState.isDragging) return undefined;
    window.addEventListener('mouseup', handleDragEnd);
    return () => window.removeEventListener('mouseup', handleDragEnd);
  }, [dragState.isDragging, handleDragEnd]);

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
