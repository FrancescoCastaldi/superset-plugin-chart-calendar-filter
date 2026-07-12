/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useState, useMemo, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import {
  CalendarFilterProps,
  CalendarFilterStylesProps,
  CalendarDay,
  TooltipData,
} from './types';

// ─── Color palettes ────────────────────────────────────────────────────────────

const COLOR_PALETTES: Record<string, string[]> = {
  supersetColors: ['#F0F0F0', '#D2E8F4', '#8FD3E4', '#51B5C8', '#20A7C9', '#147C99', '#0E4D64'],
  greens: ['#F0F0F0', '#E5F5E0', '#A1D99B', '#74C476', '#41AB5D', '#238B45', '#005A32'],
  blues: ['#F0F0F0', '#DEEBF7', '#9ECAE1', '#6BAED6', '#4292C6', '#2171B5', '#084594'],
  oranges: ['#F0F0F0', '#FEE6CE', '#FDAE6B', '#FD8D3C', '#F16913', '#D95F0E', '#993404'],
  reds: ['#F0F0F0', '#FEE0D2', '#FCBBA1', '#FC9272', '#FB6A4A', '#EF3B2C', '#99000D'],
  purples: ['#F0F0F0', '#EFEDF5', '#BCBDDC', '#9E9AC8', '#807DBA', '#6A51A3', '#3F007D'],
};

const DAY_LABELS_SUNDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS_MONDAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Styles ────────────────────────────────────────────────────────────────────

const Styles = styled.div<CalendarFilterStylesProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme?.typography?.families?.sansSerif || 'sans-serif'};
  overflow: hidden;
  position: relative;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  cursor: pointer;
  font-size: 16px;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4)}px ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#20A7C9')};
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const TodayButton = styled.button`
  background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  cursor: pointer;
  font-size: 11px;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4)}px ${({ theme }) => (theme?.gridUnit ?? 4) * 1.5}px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#20A7C9')};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => (theme?.colors?.secondary?.light1 ?? '#f0f0f0')};
  }
`;

const MonthTitle = styled.div`
  font-size: ${({ theme }) => (theme?.typography?.sizes?.l ?? 14)}px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  white-space: nowrap;
`;

const SelectionBadge = styled.span`
  font-size: ${({ theme }) => (theme?.typography?.sizes?.s ?? 12)}px;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#20A7C9')};
  background: ${({ theme }) => (theme?.colors?.primary?.light2 ?? '#cce8f0')};
  padding: 0 ${({ theme }) => (theme?.gridUnit ?? 4) * 1.5}px;
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
  white-space: nowrap;
  line-height: 22px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  color: ${({ theme }) => theme?.colors?.error?.base || '#e74c3c'};
  text-decoration: underline;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme?.colors?.error?.dark1 || '#c0392b'};
  }
`;

const YearSelect = styled.select`
  font-size: 12px;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  background: white;
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  cursor: pointer;
`;

const ViewToggleButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  cursor: pointer;
  font-size: 11px;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4)}px ${({ theme }) => (theme?.gridUnit ?? 4) * 1.5}px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#20A7C9')};
  transition: background 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  }
`;

const CalendarGrid = styled.div<{ showWeekNumbers: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }) =>
    showWeekNumbers ? '30px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  gap: 2px;
  padding: 0 ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
  flex: 1;
  align-content: start;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: ${({ theme }) => (theme?.typography?.sizes?.xs ?? 10)}px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.base ?? '#666'};
  padding: ${({ theme }) => (theme?.gridUnit ?? 4)}px 0;
  text-transform: uppercase;
`;

const WeekNumberCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#bbb'};
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
`;

interface DayCellProps {
  intensity: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  baseColor: string;
}

const DayCell = styled.div<DayCellProps>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  font-size: ${({ theme }) => (theme?.typography?.sizes?.xs ?? 10)}px;
  cursor: ${({ isCurrentMonth }) => (isCurrentMonth ? 'pointer' : 'default')};
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.3)};
  transition: all 0.15s ease;
  position: relative;
  user-select: none;

  background-color: ${({ intensity, baseColor }) => {
    if (intensity === 0) return '#f8f9fa';
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    const mix = (c1: number, c2: number, t: number) => Math.round(c1 + (c2 - c1) * t);
    const white = 248;
    return `rgb(${mix(white, r, intensity)}, ${mix(white, g, intensity)}, ${mix(white, b, intensity)})`;
  }};

  ${({ isSelected, baseColor }) =>
    isSelected
      ? `
    box-shadow: 0 0 0 2px white, 0 0 0 4px ${baseColor};
    font-weight: bold;
    `
      : ''}

  &:hover {
    transform: ${({ isCurrentMonth }) => (isCurrentMonth ? 'scale(1.15)' : 'none')};
    z-index: 1;
  }
`;

const DayNumber = styled.span`
  font-size: ${({ theme }) => (theme?.typography?.sizes?.xs ?? 10)}px;
  pointer-events: none;
  line-height: 1;
`;

const TooltipContainer = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${({ x }) => Math.min(x, window.innerWidth - 200)}px;
  top: ${({ y }) => Math.max(y - 40, 0)}px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  line-height: 1.5;
  font-family: ${({ theme }) => theme?.typography?.families?.sansSerif || 'sans-serif'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const TooltipTitle = styled.div`
  font-weight: bold;
  margin-bottom: 2px;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const TooltipLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

const TooltipValue = styled.span`
  font-weight: 600;
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
  flex-shrink: 0;
`;

const LegendGradient = styled.div`
  width: 120px;
  height: 12px;
  border-radius: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
`;

const LegendLabel = styled.span`
  font-size: ${({ theme }) => (theme?.typography?.sizes?.xs ?? 10)}px;
  color: ${({ theme }) => theme?.colors?.grayscale?.base ?? '#666'};
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#999'};
  font-size: ${({ theme }) => (theme?.typography?.sizes?.m ?? 12)}px;
`;

// ─── Year Overview Styles ──────────────────────────────────────────────────────

const YearOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => (theme?.gridUnit ?? 4) * 3}px;
  padding: ${({ theme }) => (theme?.gridUnit ?? 4) * 2}px;
  flex: 1;
  overflow-y: auto;
`;

const MiniMonth = styled.div`
  display: flex;
  flex-direction: column;
`;

const MiniMonthTitle = styled.div`
  text-align: center;
  font-size: 11px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  margin-bottom: ${({ theme }) => (theme?.gridUnit ?? 4)}px;
`;

const MiniMonthGrid = styled.div<{ showWeekNumbers: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }) =>
    showWeekNumbers ? '18px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  gap: 1px;
`;

const MiniDayHeader = styled.div`
  text-align: center;
  font-size: 7px;
  font-weight: bold;
  color: ${({ theme }) => theme?.colors?.grayscale?.base ?? '#666'};
  text-transform: uppercase;
`;

const MiniWeekNum = styled.div`
  font-size: 7px;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#bbb'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface MiniDayCellProps {
  intensity: number;
  isSelected: boolean;
  baseColor: string;
}

const MiniDayCell = styled.div<MiniDayCellProps>`
  aspect-ratio: 1;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;

  background-color: ${({ intensity, baseColor }) => {
    if (intensity === 0) return '#f8f9fa';
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    const mix = (c1: number, c2: number, t: number) => Math.round(c1 + (c2 - c1) * t);
    const white = 248;
    return `rgb(${mix(white, r, intensity)}, ${mix(white, g, intensity)}, ${mix(white, b, intensity)})`;
  }};

  ${({ isSelected, baseColor }) =>
    isSelected
      ? `box-shadow: 0 0 0 1.5px white, 0 0 0 3px ${baseColor};`
      : ''}

  &:hover {
    transform: scale(1.3);
    z-index: 1;
  }
`;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Parse a date value into a Date object */
function parseDateValue(val: unknown): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'number') return new Date(val);
  const d = new Date(String(val));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format a Date to YYYY-MM-DD */
function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Get the first day of the month adjusted for firstDayOfWeek */
function getFirstDayOfMonth(year: number, month: number, firstDayOfWeek: number): number {
  const raw = new Date(year, month - 1, 1).getDay();
  // Shift: if firstDayOfWeek=1 (Monday), raw Sunday=0 becomes 6, raw Monday=1 becomes 0, etc.
  return (raw - firstDayOfWeek + 7) % 7;
}

/** Get the number of days in a month */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** ISO 8601 week number */
function getISOWeekNumber(d: Date): number {
  const temp = new Date(d.valueOf());
  const dayNum = (d.getDay() + 6) % 7;
  temp.setDate(temp.getDate() - dayNum + 3);
  const firstThursday = temp.valueOf();
  temp.setMonth(0, 1);
  if (temp.getDay() !== 4) {
    temp.setMonth(0, 1 + ((4 - temp.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - temp.valueOf()) / 604800000);
}

/** Get the base color from a palette (the strongest color) */
function getBaseColor(paletteName: string): string {
  const palette = COLOR_PALETTES[paletteName];
  return palette ? palette[palette.length - 1] : COLOR_PALETTES.supersetColors[COLOR_PALETTES.supersetColors.length - 1];
}

/** Convert a color name to a DayJS-compatible format or just pass through */
/** Not needed since we use native Date */

/** Get all dates between two dates (inclusive) */
function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  const step = current <= endDate ? 1 : -1;

  while (step > 0 ? current <= endDate : current >= endDate) {
    dates.push(formatDateKey(current));
    current.setDate(current.getDate() + step);
  }

  return dates;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CalendarFilter(props: CalendarFilterProps) {
  const {
    data,
    height,
    width,
    colorScheme = 'supersetColors',
    showLegend = true,
    firstDayOfWeek = 0,
    showWeekNumbers = false,
    showYearDropdown = true,
    enableOverview = true,
    setDataMask,
    filterState,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  // Current view: defaults to today's month/year
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-12
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [lastClickedDate, setLastClickedDate] = useState<string | null>(null);

  const dayLabels = firstDayOfWeek === 0 ? DAY_LABELS_SUNDAY : DAY_LABELS_MONDAY;

  // Determine which columns are date vs metric
  const dataMap = useMemo(() => {
    if (!data || data.length === 0) return { map: new Map<string, number>(), min: 0, max: 0, hasData: false, minDate: null as string | null, maxDate: null as string | null };

    const map = new Map<string, number>();
    let min = Infinity;
    let max = -Infinity;
    let minDate: string | null = null;
    let maxDate: string | null = null;

    const firstRow = data[0] as Record<string, unknown>;
    const keys = Object.keys(firstRow);
    const dateKey = keys.find(k => {
      const val = firstRow[k];
      return val && (typeof val === 'string' || typeof val === 'number' || val instanceof Date) &&
        !Number.isNaN(new Date(String(val)).getTime());
    });
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
  }, [data]);

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

  // Parse min/max dates for navigation constraints
  const { minDateBound, maxDateBound } = useMemo(() => {
    if (!dataMap.minDate || !dataMap.maxDate) {
      return { minDateBound: null, maxDateBound: null };
    }
    return { minDateBound: dataMap.minDate, maxDateBound: dataMap.maxDate };
  }, [dataMap.minDate, dataMap.maxDate]);

  // Available years for the dropdown
  const availableYears = useMemo(() => {
    if (!minDateBound || !maxDateBound) {
      const y = today.getFullYear();
      return [y - 2, y - 1, y, y + 1, y + 2];
    }
    const minY = new Date(minDateBound).getFullYear();
    const maxY = new Date(maxDateBound).getFullYear();
    const years: number[] = [];
    for (let y = minY; y <= maxY; y++) years.push(y);
    return years;
  }, [minDateBound, maxDateBound, today]);

  // Is prev/next disabled?
  const isPrevDisabled = useMemo(() => {
    if (!minDateBound) return false;
    if (viewMode === 'year') {
      return viewYear <= new Date(minDateBound).getFullYear();
    }
    const firstOfMonth = `${viewYear}-${String(viewMonth).padStart(2, '0')}-01`;
    return firstOfMonth <= minDateBound;
  }, [minDateBound, viewYear, viewMonth, viewMode]);

  const isNextDisabled = useMemo(() => {
    if (!maxDateBound) return false;
    if (viewMode === 'year') {
      return viewYear >= new Date(maxDateBound).getFullYear();
    }
    const lastOfMonth = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(getDaysInMonth(viewYear, viewMonth)).padStart(2, '0')}`;
    return lastOfMonth >= maxDateBound;
  }, [maxDateBound, viewYear, viewMonth, viewMode]);

  // Generate calendar grid
  const calendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth, firstDayOfWeek);
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    const cells: (CalendarDay | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const value = dataMap.map.get(dateStr) ?? null;
      cells.push({
        date: dateStr,
        value,
        hasData: value !== null,
      });
    }

    // Trailing empty cells
    while (cells.length < totalCells) {
      cells.push(null);
    }

    return cells;
  }, [viewYear, viewMonth, dataMap, firstDayOfWeek]);

  // Build week rows for week numbers
  const weekRows = useMemo(() => {
    if (!showWeekNumbers) return [];
    const rows: { weekNumber: number; cells: (CalendarDay | null)[]; startIndex: number; endIndex: number }[] = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
      const weekCells = calendarCells.slice(i, i + 7);
      // Find the first non-null cell to determine the date for week number
      const firstRealCell = weekCells.find(c => c !== null);
      let weekNumber = 1;
      if (firstRealCell) {
        weekNumber = getISOWeekNumber(new Date(firstRealCell.date));
      }
      rows.push({ weekNumber, cells: weekCells, startIndex: i, endIndex: i + 6 });
    }
    return rows;
  }, [calendarCells, showWeekNumbers]);

  // Color scale
  const { intensityScale, baseColor } = useMemo(() => {
    const base = getBaseColor(colorScheme);
    const range = dataMap.max - dataMap.min;
    return {
      baseColor: base,
      intensityScale: (val: number | null): number => {
        if (val == null || range === 0) return 0;
        return (val - dataMap.min) / range;
      },
    };
  }, [colorScheme, dataMap.min, dataMap.max]);

  // Navigation
  const goPrevMonth = useCallback(() => {
    if (viewMode === 'year') {
      setViewYear(y => y - 1);
      return;
    }
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth, viewYear, viewMode]);

  const goNextMonth = useCallback(() => {
    if (viewMode === 'year') {
      setViewYear(y => y + 1);
      return;
    }
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth, viewYear, viewMode]);

  const goToToday = useCallback(() => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth() + 1);
  }, []);

  // Toggle date selection
  const handleDayClick = useCallback(
    (day: CalendarDay, event?: React.MouseEvent) => {
      if (!setDataMask) return;

      const dateStr = day.date;
      let newSelected = new Set(selectedDates);

      // Shift-click range selection
      if (event?.shiftKey && lastClickedDate) {
        const range = getDatesBetween(lastClickedDate, dateStr);
        range.forEach(d => {
          // Only add dates that exist in data
          if (dataMap.map.has(d)) {
            newSelected.add(d);
          } else {
            newSelected.add(d);
          }
        });
      } else {
        // Toggle
        if (newSelected.has(dateStr)) {
          newSelected.delete(dateStr);
        } else {
          newSelected.add(dateStr);
        }
      }

      setLastClickedDate(dateStr);
      const selectedArray = Array.from(newSelected).sort();

      setDataMask({
        extraFormData: {
          filters: selectedArray.length
            ? [{ col: '__time_range', op: 'IN' as const, val: selectedArray }]
            : [],
        },
        filterState: {
          value: selectedArray.length ? selectedArray : null,
          selectedValues: selectedArray.length
            ? selectedArray.reduce((acc, date) => ({ ...acc, [date]: date }), {} as Record<string, string>)
            : null,
        },
      });
    },
    [setDataMask, selectedDates, lastClickedDate, dataMap.map],
  );

  const clearSelection = useCallback(() => {
    if (!setDataMask) return;
    setLastClickedDate(null);
    setDataMask({
      extraFormData: {
        filters: [],
      },
      filterState: {
        value: null,
        selectedValues: null,
      },
    });
  }, [setDataMask]);

  // Month label
  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [viewYear, viewMonth]);

  // Selection count
  const selectionCount = selectedDates.size;

  // Legend gradient
  const legendGradient = useMemo(() => {
    const palette = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.supersetColors;
    const stops = palette.slice(1).map((color, i) => {
      const pct = Math.round((i / (palette.length - 2)) * 100);
      return `${color} ${pct}%`;
    });
    return `linear-gradient(to right, ${stops.join(', ')})`;
  }, [colorScheme]);

  // Tooltip handlers
  const handleMouseEnter = useCallback(
    (cell: CalendarDay, event: React.MouseEvent) => {
      if (!cell.hasData) {
        setTooltip(null);
        return;
      }
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      const relX = rect.left - (containerRect?.left || 0) + rect.width / 2;
      const relY = rect.top - (containerRect?.top || 0);
      const pct = dataMap.max > dataMap.min
        ? ((cell.value ?? 0) - dataMap.min) / (dataMap.max - dataMap.min) * 100
        : 0;

      setTooltip({
        date: cell.date,
        value: cell.value,
        percentage: Math.round(pct),
        x: relX,
        y: relY,
      });
    },
    [dataMap],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // ── Year Overview ──

  const yearOverviewMonths = useMemo(() => {
    if (viewMode !== 'year') return [];
    const months: { month: number; label: string; cells: (CalendarDay | null)[]; weekRows: { weekNumber: number; cells: (CalendarDay | null)[] }[] }[] = [];

    for (let m = 1; m <= 12; m++) {
      const daysInMonth = getDaysInMonth(viewYear, m);
      const firstDay = getFirstDayOfMonth(viewYear, m, firstDayOfWeek);
      const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
      const cells: (CalendarDay | null)[] = [];

      for (let i = 0; i < firstDay; i++) cells.push(null);
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${viewYear}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const value = dataMap.map.get(dateStr) ?? null;
        cells.push({ date: dateStr, value, hasData: value !== null });
      }
      while (cells.length < totalCells) cells.push(null);

      const wRows: { weekNumber: number; cells: (CalendarDay | null)[] }[] = [];
      if (showWeekNumbers) {
        for (let i = 0; i < cells.length; i += 7) {
          const weekCells = cells.slice(i, i + 7);
          const firstReal = weekCells.find(c => c !== null);
          let wn = 1;
          if (firstReal) wn = getISOWeekNumber(new Date(firstReal.date));
          wRows.push({ weekNumber: wn, cells: weekCells });
        }
      }

      const label = new Date(viewYear, m - 1, 1).toLocaleDateString('en-US', { month: 'short' });
      months.push({ month: m, label, cells, weekRows: wRows });
    }

    return months;
  }, [viewYear, viewMode, dataMap, firstDayOfWeek, showWeekNumbers]);

  const handleMiniDayClick = useCallback(
    (dateStr: string) => {
      if (!setDataMask) return;

      const newSelected = new Set(selectedDates);
      if (newSelected.has(dateStr)) {
        newSelected.delete(dateStr);
      } else {
        newSelected.add(dateStr);
      }

      const selectedArray = Array.from(newSelected).sort();
      setDataMask({
        extraFormData: {
          filters: selectedArray.length
            ? [{ col: '__time_range', op: 'IN' as const, val: selectedArray }]
            : [],
        },
        filterState: {
          value: selectedArray.length ? selectedArray : null,
          selectedValues: selectedArray.length
            ? selectedArray.reduce((acc, date) => ({ ...acc, [date]: date }), {} as Record<string, string>)
            : null,
        },
      });
    },
    [setDataMask, selectedDates],
  );

  // ── Render ──

  if (!data || data.length === 0) {
    return (
      <Styles height={height} width={width}>
        <EmptyState>No data available</EmptyState>
      </Styles>
    );
  }

  return (
    <Styles height={height} width={width} ref={containerRef}>
      {/* ── Header ── */}
      <CalendarHeader>
        <HeaderLeft>
          <NavButton
            onClick={goPrevMonth}
            type="button"
            aria-label="Previous"
            disabled={isPrevDisabled}
            title={isPrevDisabled ? 'No data before this date' : 'Previous'}
          >
            ‹
          </NavButton>
          {showYearDropdown && (
            <YearSelect
              value={viewYear}
              onChange={e => setViewYear(Number(e.target.value))}
              aria-label="Select year"
            >
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </YearSelect>
          )}
          {enableOverview && (
            <ViewToggleButton
              type="button"
              onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
            >
              {viewMode === 'month' ? 'Year' : 'Month'}
            </ViewToggleButton>
          )}
        </HeaderLeft>

        <HeaderCenter>
          <MonthTitle>
            {viewMode === 'year' ? viewYear : monthLabel}
          </MonthTitle>
          {selectionCount > 0 && (
            <>
              <SelectionBadge>
                {selectionCount} selected
              </SelectionBadge>
              <ClearButton type="button" onClick={clearSelection}>
                Clear
              </ClearButton>
            </>
          )}
        </HeaderCenter>

        <HeaderRight>
          <TodayButton type="button" onClick={goToToday}>
            Today
          </TodayButton>
          <NavButton
            onClick={goNextMonth}
            type="button"
            aria-label="Next"
            disabled={isNextDisabled}
            title={isNextDisabled ? 'No data after this date' : 'Next'}
          >
            ›
          </NavButton>
        </HeaderRight>
      </CalendarHeader>

      {/* ── Calendar / Year Overview ── */}
      {viewMode === 'year' ? (
        <YearOverviewGrid>
          {yearOverviewMonths.map(m => (
            <MiniMonth key={m.month}>
              <MiniMonthTitle>{m.label}</MiniMonthTitle>
              <MiniMonthGrid showWeekNumbers={showWeekNumbers}>
                {dayLabels.map(d => (
                  <MiniDayHeader key={d}>{d[0]}</MiniDayHeader>
                ))}
                {showWeekNumbers && m.weekRows.map((wr, wi) => (
                  <React.Fragment key={`wr-${wi}`}>
                    <MiniWeekNum>{wr.weekNumber}</MiniWeekNum>
                    {wr.cells.map((cell, ci) => {
                      if (!cell) return <div key={`e-${wi}-${ci}`} />;
                      return (
                        <MiniDayCell
                          key={cell.date}
                          intensity={intensityScale(cell.value)}
                          isSelected={selectedDates.has(cell.date)}
                          baseColor={baseColor}
                          onClick={() => handleMiniDayClick(cell.date)}
                          title={`${cell.date}${cell.value != null ? `: ${cell.value}` : ''}`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
                {(!showWeekNumbers) && m.cells.map((cell, ci) => {
                  if (!cell) return <div key={`e-${m.month}-${ci}`} />;
                  return (
                    <MiniDayCell
                      key={cell.date}
                      intensity={intensityScale(cell.value)}
                      isSelected={selectedDates.has(cell.date)}
                      baseColor={baseColor}
                      onClick={() => handleMiniDayClick(cell.date)}
                      title={`${cell.date}${cell.value != null ? `: ${cell.value}` : ''}`}
                    />
                  );
                })}
              </MiniMonthGrid>
            </MiniMonth>
          ))}
        </YearOverviewGrid>
      ) : (
        <>
          <CalendarGrid showWeekNumbers={showWeekNumbers}>
            {/* Day headers */}
            {showWeekNumbers && <div />}
            {dayLabels.map(day => (
              <DayHeader key={day}>{day}</DayHeader>
            ))}

            {/* Week rows */}
            {showWeekNumbers
              ? weekRows.map((row, rowIdx) => (
                  <React.Fragment key={`row-${rowIdx}`}>
                    <WeekNumberCell>{row.weekNumber}</WeekNumberCell>
                    {row.cells.map((cell, cellIdx) => {
                      if (!cell) {
                        return <div key={`e-${rowIdx}-${cellIdx}`} />;
                      }
                      return (
                        <DayCell
                          key={cell.date}
                          intensity={intensityScale(cell.value)}
                          isSelected={selectedDates.has(cell.date)}
                          isCurrentMonth
                          baseColor={baseColor}
                          onClick={(e) => handleDayClick(cell, e)}
                          onMouseEnter={(e) => handleMouseEnter(cell, e)}
                          onMouseLeave={handleMouseLeave}
                          title=""
                        >
                          <DayNumber>{cell.date.split('-')[2]}</DayNumber>
                        </DayCell>
                      );
                    })}
                  </React.Fragment>
                ))
              : calendarCells.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} />;
                  }
                  return (
                    <DayCell
                      key={cell.date}
                      intensity={intensityScale(cell.value)}
                      isSelected={selectedDates.has(cell.date)}
                      isCurrentMonth
                      baseColor={baseColor}
                      onClick={(e) => handleDayClick(cell, e)}
                      onMouseEnter={(e) => handleMouseEnter(cell, e)}
                      onMouseLeave={handleMouseLeave}
                      title=""
                    >
                      <DayNumber>{cell.date.split('-')[2]}</DayNumber>
                    </DayCell>
                  );
                })}
          </CalendarGrid>

          {/* Tooltip */}
          {tooltip && (
            <TooltipContainer x={tooltip.x} y={tooltip.y}>
              <TooltipTitle>{tooltip.date}</TooltipTitle>
              <TooltipRow>
                <TooltipLabel>Value:</TooltipLabel>
                <TooltipValue>{tooltip.value?.toLocaleString() ?? 'N/A'}</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel>Max:</TooltipLabel>
                <TooltipValue>{dataMap.max.toLocaleString()}</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel>% of max:</TooltipLabel>
                <TooltipValue>{tooltip.percentage}%</TooltipValue>
              </TooltipRow>
            </TooltipContainer>
          )}
        </>
      )}

      {/* ── Legend ── */}
      {showLegend && dataMap.hasData && viewMode === 'month' && (
        <LegendContainer>
          <LegendLabel>{dataMap.min.toFixed(1)}</LegendLabel>
          <LegendGradient style={{ background: legendGradient }} />
          <LegendLabel>{dataMap.max.toFixed(1)}</LegendLabel>
        </LegendContainer>
      )}
    </Styles>
  );
}
