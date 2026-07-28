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
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { Global } from '@emotion/react';
import {
  CalendarFilterProps,
  CalendarFilterStylesProps,
  CalendarDay,
  TooltipData,
} from './types';
import {
  parseDateValue,
  formatDateKey,
  getFirstDayOfMonth,
  getDaysInMonth,
  getISOWeekNumber,
  formatDateRangeBadge as formatSelectionRange,
} from './utils/dateUtils';

// Color palettes — GitHub-inspired gradients
const COLOR_PALETTES: Record<string, string[]> = {
  supersetColors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  greens: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blues: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  oranges: ['#ebedf0', '#fddfb8', '#fdb87d', '#f59241', '#e66b1f'],
  reds: ['#ebedf0', '#ffd1d1', '#ff9b9b', '#ff6b6b', '#e63946'],
  purples: ['#ebedf0', '#d5c6e0', '#b392c4', '#8c6bb1', '#6a3d9a'],
};

const DAY_LABELS_SUNDAY = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const DAY_LABELS_MONDAY = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

// Styles

const Styles = styled.div<CalendarFilterStylesProps>`
  height: ${({ height }) => (height && height > 120 ? `${height}px` : 'auto')};
  min-height: ${({ height }) => (height && height > 120 ? `${height}px` : '36px')};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme?.typography?.families?.sansSerif || 'sans-serif'};
  overflow: hidden;
  position: relative;
  /* Evita sovrapposizione con la sticky filterbar-action-buttons (116px) */
  padding-bottom: 116px;
`;

const NativeFilterTriggerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px 0;
`;

const NativeFilterPillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  &:hover {
    border-color: #2563eb;
    color: #1d4ed8;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 6px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NavButton = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e2e8f0')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 12px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => (theme?.colors?.secondary?.light1 ?? '#f8fafc')};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#f1f5f9')};
  }
`;

const TodayButton = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e2e8f0')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  line-height: 1.2;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => (theme?.colors?.secondary?.light1 ?? '#f8fafc')};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const MonthTitle = styled.div`
  font-size: ${({ theme }) => (theme?.typography?.sizes?.l ?? 14)}px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  white-space: nowrap;
`;

const SelectionBadge = styled.span`
  font-size: 10px;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  background: ${({ theme }) => (theme?.colors?.primary?.light2 ?? '#e0f5e8')};
  padding: 0 8px;
  border-radius: 10px;
  white-space: nowrap;
  line-height: 20px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 10px;
  color: ${({ theme }) => theme?.colors?.error?.base || '#e74c3c'};
  text-decoration: underline;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme?.colors?.error?.dark1 || '#c0392b'};
  }
`;

const YearSelect = styled.select`
  font-size: 11px;
  padding: 3px 6px;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  cursor: pointer;
`;

const ViewToggleButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  padding: 4px 8px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  }
`;

const CalendarGrid = styled.div<{ showWeekNumbers: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }) =>
    showWeekNumbers ? '24px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  gap: 1px;
  padding: 0 8px 8px;
  flex: 1;
  align-content: start;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 9px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.base ?? '#666'};
  padding: 4px 0;
  text-transform: uppercase;
`;

const WeekNumberCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#bbb'};
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
`;

interface DayCellProps {
  intensity: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  $isToday: boolean;
  baseColor: string;
  $cellHeight: number;
}

const DayCell = styled.div<DayCellProps>`
  height: ${({ $cellHeight }) => $cellHeight}px;
  width: 100%;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 11px;
  cursor: ${({ isCurrentMonth }) => (isCurrentMonth ? 'pointer' : 'default')};
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.3)};
  transition: all 0.2s ease;
  position: relative;
  user-select: none;

  background-color: ${({ isSelected, baseColor }) => {
    if (isSelected) return `${baseColor}35`;
    return '#ffffff';
  }};
  border: 1px solid ${({ isSelected, baseColor }) => (isSelected ? baseColor : '#e2e8f0')};

  ${({ isSelected, baseColor }) =>
    isSelected
      ? `
    box-shadow: 0 0 12px 4px ${baseColor}80, inset 0 0 0 2px ${baseColor};
    font-weight: 800;
    color: ${baseColor};
    z-index: 10;
    `
      : ''}

  ${({ $isToday }) =>
    $isToday
      ? `
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
    }
    `
      : ''}

  &:hover {
    transform: ${({ isCurrentMonth }) => (isCurrentMonth ? 'scale(1.15)' : 'none')};
    z-index: 1;
  }
`;

const DayNumber = styled.span`
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
  line-height: 1;
  color: #1a1a1a;
`;

const TooltipContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  left: ${({ x }) => Math.min(x, window.innerWidth - 200)}px;
  top: ${({ y }) => Math.max(y - 40, 0)}px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 11px;
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#999'};
  font-size: ${({ theme }) => (theme?.typography?.sizes?.m ?? 12)}px;
  gap: 8px;
`;

const EmptyIcon = styled.div`
  font-size: 16px;
  line-height: 1;
`;

// Year Overview Styles

const YearOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
`;

const MiniMonth = styled.div`
  display: flex;
  flex-direction: column;
`;

const MiniMonthTitle = styled.div`
  text-align: center;
  font-size: 10px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  margin-bottom: 4px;
`;

const MiniMonthGrid = styled.div<{ showWeekNumbers: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }) =>
    showWeekNumbers ? '14px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
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
  $isToday: boolean;
  baseColor: string;
}

const MiniDayCell = styled.div<MiniDayCellProps>`
  aspect-ratio: 0.8;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;

  background-color: ${({ isSelected, baseColor }) => {
    if (isSelected) return `${baseColor}35`;
    return '#ffffff';
  }};
  border: 1px solid ${({ isSelected, baseColor }) => (isSelected ? baseColor : '#e2e8f0')};

  ${({ isSelected, baseColor }) =>
    isSelected
      ? `
    box-shadow: 0 0 8px 2px ${baseColor}80, inset 0 0 0 1px ${baseColor};
    z-index: 10;
    `
      : ''}

  ${({ $isToday }) =>
    $isToday
      ? `
    &::after {
      content: '';
      position: absolute;
      bottom: 1px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: currentColor;
    }
    `
      : ''}

  &:hover {
    transform: scale(1.3);
    z-index: 1;
  }
`;

// Native Filter Modal & Macro Shortcuts Styles

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 999999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 210px 24px 24px 24px;
`;

const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 96%;
  max-width: 1350px;
  height: auto;
  max-height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
`;

const ModalCloseButton = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 10px;
  color: #475569;
  transition: all 0.2s ease;
  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

const MacroBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const MacroButton = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #e0f5e8;
    border-color: #40c463;
    color: #216e39;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Helpers

/** Get the base color from a palette (the strongest color) */
function getBaseColor(paletteName: string): string {
  const palette = COLOR_PALETTES[paletteName];
  return palette ? palette[palette.length - 1] : COLOR_PALETTES.supersetColors[COLOR_PALETTES.supersetColors.length - 1];
}

/** Get all dates between two dates (inclusive) */
function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = parseDateValue(start);
  const endDate = parseDateValue(end);
  if (!current || !endDate) return dates;
  const step = current <= endDate ? 1 : -1;

  while (step > 0 ? current <= endDate : current >= endDate) {
    dates.push(formatDateKey(current));
    current.setDate(current.getDate() + step);
  }

  return dates;
}

// Component

export default function CalendarFilter(props: CalendarFilterProps) {
  const {
    data,
    height,
    width,
    formData,
    colorScheme = 'supersetColors',
    firstDayOfWeek = 0,
    showWeekNumbers = false,
    showYearDropdown = true,
    enableOverview = true,
    cellDensity = 'compact',
    filterTypeMode = 'in_clause',
    defaultValueMode = 'none',
    showMacroShortcuts = true,
    customDefaultStartDate,
    customDefaultEndDate,
    setDataMask,
    filterState,
    dateColumn,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  // Current view: defaults to today's month/year
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDateKey(today), [today]);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-12
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dayLabels = firstDayOfWeek === 0 ? DAY_LABELS_SUNDAY : DAY_LABELS_MONDAY;

  // Cell height based on density
  const cellHeight = cellDensity === 'normal' ? 38 : 30;

  // Determine date column and records
  const dataMap = useMemo(() => {
    if (!data || data.length === 0) return { map: new Map<string, number>(), min: 0, max: 0, hasData: false, minDate: null as string | null, maxDate: null as string | null };

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

  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current && dataMap.maxDate) {
      const maxD = parseDateValue(dataMap.maxDate);
      if (maxD) {
        setViewYear(maxD.getFullYear());
        setViewMonth(maxD.getMonth() + 1);
      }
      hasInitialized.current = true;
    }
  }, [dataMap.maxDate]);

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

  // Macro Filter Actions
  const selectEntireYear = useCallback(() => {
    const yearDates: string[] = [];
    for (let m = 1; m <= 12; m++) {
      const days = getDaysInMonth(viewYear, m);
      for (let d = 1; d <= days; d++) {
        yearDates.push(`${viewYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    }
    emitSelection(yearDates);
  }, [viewYear, emitSelection]);

  const selectCurrentMonth = useCallback(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const days = getDaysInMonth(y, m);
    const monthDates: string[] = [];
    for (let d = 1; d <= days; d++) {
      monthDates.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    }
    emitSelection(monthDates);
  }, [emitSelection]);

  const selectQuarter = useCallback(
    (quarter: 1 | 2 | 3 | 4) => {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      const qDates: string[] = [];
      for (let m = startMonth; m <= endMonth; m++) {
        const days = getDaysInMonth(viewYear, m);
        for (let d = 1; d <= days; d++) {
          qDates.push(`${viewYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
        }
      }
      emitSelection(qDates);
    },
    [viewYear, emitSelection],
  );

  const selectWeekdays = useCallback(() => {
    const weekdays: string[] = [];
    const daysInM = getDaysInMonth(viewYear, viewMonth);
    for (let d = 1; d <= daysInM; d++) {
      const dt = new Date(viewYear, viewMonth - 1, d);
      const dayOfWeek = dt.getDay(); // 0 = Sun, 6 = Sat
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        weekdays.push(`${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
      }
    }
    emitSelection(weekdays);
  }, [viewYear, viewMonth, emitSelection]);

  // Parse min/max dates for navigation constraints
  const { minDateBound, maxDateBound } = useMemo(() => {
    if (!dataMap.minDate || !dataMap.maxDate) {
      return { minDateBound: null, maxDateBound: null };
    }
    return { minDateBound: dataMap.minDate, maxDateBound: dataMap.maxDate };
  }, [dataMap.minDate, dataMap.maxDate]);

  // Available years for dropdown
  const availableYears = useMemo(() => {
    if (!minDateBound || !maxDateBound) {
      const y = today.getFullYear();
      return [y - 2, y - 1, y, y + 1, y + 2];
    }
    const minY = parseDateValue(minDateBound)?.getFullYear() ?? viewYear;
    const maxY = parseDateValue(maxDateBound)?.getFullYear() ?? viewYear;
    const years: number[] = [];
    for (let y = minY; y <= maxY; y++) years.push(y);
    return years;
  }, [minDateBound, maxDateBound, today, viewYear]);

  // Is prev/next disabled?
  const isPrevDisabled = useMemo(() => {
    if (!minDateBound) return false;
    if (viewMode === 'year') {
      return viewYear <= (parseDateValue(minDateBound)?.getFullYear() ?? viewYear);
    }
    const firstOfMonth = `${viewYear}-${String(viewMonth).padStart(2, '0')}-01`;
    return firstOfMonth <= minDateBound;
  }, [minDateBound, viewYear, viewMonth, viewMode]);

  const isNextDisabled = useMemo(() => {
    if (!maxDateBound) return false;
    if (viewMode === 'year') {
      return viewYear >= (parseDateValue(maxDateBound)?.getFullYear() ?? viewYear);
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

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const value = dataMap.map.get(dateStr) ?? null;
      cells.push({
        date: dateStr,
        value,
        hasData: value !== null,
      });
    }

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
      const firstRealCell = weekCells.find(c => c !== null);
      let weekNumber = 1;
      if (firstRealCell) {
        weekNumber = getISOWeekNumber(parseDateValue(firstRealCell.date) || new Date());
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

  const clearSelection = useCallback(() => {
    emitSelection([]);
  }, [emitSelection]);

  // Month label
  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth - 1, 1);
    return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  }, [viewYear, viewMonth]);

  // Selection badge text
  const selectionBadgeText = useMemo(() => {
    const sorted = Array.from(selectedDates).sort();
    return formatSelectionRange(sorted);
  }, [selectedDates]);

  // Tooltip handlers
  const handleMouseEnter = useCallback(
    (cell: CalendarDay, event: React.MouseEvent) => {
      if (!cell.hasData) {
        setTooltip(null);
        return;
      }
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const viewportX = rect.left + rect.width / 2;
      const viewportY = rect.top;
      const pct = dataMap.max > dataMap.min
        ? ((cell.value ?? 0) - dataMap.min) / (dataMap.max - dataMap.min) * 100
        : 0;

      setTooltip({
        date: cell.date,
        value: cell.value,
        percentage: Math.round(pct),
        x: viewportX,
        y: viewportY,
      });
    },
    [dataMap],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Year Overview
  const yearOverviewMonths = useMemo(() => {
    if (viewMode !== 'year' && !isModalOpen) return [];
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
          if (firstReal) wn = getISOWeekNumber(parseDateValue(firstReal.date) || new Date());
          wRows.push({ weekNumber: wn, cells: weekCells });
        }
      }

      const label = new Date(viewYear, m - 1, 1).toLocaleDateString('it-IT', { month: 'short' });
      months.push({ month: m, label, cells, weekRows: wRows });
    }

    return months;
  }, [viewYear, viewMode, isModalOpen, dataMap, firstDayOfWeek, showWeekNumbers]);

  const handleMiniDayClick = useCallback(
    (dateStr: string) => {
      if (!setDataMask) return;

      const newSelected = new Set(selectedDates);
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

  const isCompactNativeFilter = Boolean(formData?.inView || (height && height <= 120));

  // Render for Compact Native Filter Bar
  if (isCompactNativeFilter) {
    const selectionText = selectedDates.size === 0 
      ? 'Seleziona Date Calendario' 
      : selectionBadgeText 
        ? `${selectedDates.size} date (${selectionBadgeText})` 
        : `${selectedDates.size} date selezionate`;

    return (
      <Styles height={height} width={width} ref={containerRef}>
        <Global styles={`
          [data-test="filterbar-action-buttons"] {
            pointer-events: none;
          }
          [data-test="filterbar-action-buttons"] button {
            pointer-events: auto;
          }
        `} />
        <NativeFilterTriggerContainer>
          <NativeFilterPillButton type="button" onClick={() => setIsModalOpen(true)}>
            <span>📅 {selectionText}</span>
            <span style={{ fontSize: 10, color: '#6b7280' }}>▼</span>
          </NativeFilterPillButton>
        </NativeFilterTriggerContainer>

        {/* Expandable Modal Popover */}
        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>📅 Calendar Filter — Vista Annuale {viewYear}</ModalTitle>
                <ModalCloseButton type="button" onClick={() => setIsModalOpen(false)}>
                  ✕ Chiudi
                </ModalCloseButton>
              </ModalHeader>
              {showMacroShortcuts && (
                <MacroBar>
                  <MacroButton type="button" onClick={selectEntireYear}>
                    🎯 Anno {viewYear}
                  </MacroButton>
                  <MacroButton type="button" onClick={selectCurrentMonth}>
                    📅 Mese Corrente
                  </MacroButton>
                  <MacroButton type="button" onClick={() => selectQuarter(1)}>📊 Q1</MacroButton>
                  <MacroButton type="button" onClick={() => selectQuarter(2)}>📊 Q2</MacroButton>
                  <MacroButton type="button" onClick={() => selectQuarter(3)}>📊 Q3</MacroButton>
                  <MacroButton type="button" onClick={() => selectQuarter(4)}>📊 Q4</MacroButton>
                  <MacroButton type="button" onClick={selectWeekdays}>💼 Feriali</MacroButton>
                  {selectedDates.size > 0 && (
                    <MacroButton type="button" onClick={clearSelection} style={{ color: '#e74c3c', borderColor: '#f5c6cb' }}>
                      ❌ Azzera ({selectedDates.size})
                    </MacroButton>
                  )}
                </MacroBar>
              )}
              <YearOverviewGrid style={{ flex: 1, padding: 16 }}>
                {yearOverviewMonths.map(m => (
                  <MiniMonth key={m.month}>
                    <MiniMonthTitle>{m.label}</MiniMonthTitle>
                    <MiniMonthGrid showWeekNumbers={showWeekNumbers}>
                      {dayLabels.map(d => (
                        <MiniDayHeader key={d}>{d[0]}</MiniDayHeader>
                      ))}
                      {m.cells.map((cell, ci) => {
                        if (!cell) return <div key={`modal-e-${m.month}-${ci}`} />;
                        return (
                          <MiniDayCell
                            key={cell.date}
                            intensity={intensityScale(cell.value)}
                            isSelected={selectedDates.has(cell.date)}
                            $isToday={cell.date === todayStr}
                            baseColor={baseColor}
                            onClick={() => handleMiniDayClick(cell.date)}
                            title={cell.date}
                          />
                        );
                      })}
                    </MiniMonthGrid>
                  </MiniMonth>
                ))}
              </YearOverviewGrid>
            </ModalContent>
          </ModalOverlay>
        )}
      </Styles>
    );
  }

  // Render for full chart
  if (!data || data.length === 0) {
    return (
      <Styles height={height} width={width}>
        <EmptyState>
          <EmptyIcon>📅</EmptyIcon>
          <span>Nessun dato disponibile</span>
        </EmptyState>
      </Styles>
    );
  }

  return (
    <Styles height={height} width={width} ref={containerRef}>
      {/* Header */}
      <CalendarHeader>
        <HeaderLeft>
          <NavButton
            onClick={goPrevMonth}
            type="button"
            aria-label="Precedente"
            disabled={isPrevDisabled}
            title={isPrevDisabled ? 'Nessun dato prima di questa data' : 'Precedente'}
          >
            ◀
          </NavButton>
          {showYearDropdown && (
            <YearSelect
              value={viewYear}
              onChange={e => setViewYear(Number(e.target.value))}
              aria-label="Seleziona anno"
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
              {viewMode === 'month' ? 'Anno' : 'Mese'}
            </ViewToggleButton>
          )}
        </HeaderLeft>

        <HeaderCenter>
          <MonthTitle>
            {viewMode === 'year' ? viewYear : monthLabel}
          </MonthTitle>
          {selectedDates.size > 0 && (
            <>
              <SelectionBadge>
                {selectedDates.size}{selectionBadgeText ? ` · ${selectionBadgeText}` : ''}
              </SelectionBadge>
              <ClearButton type="button" onClick={clearSelection}>
                Azzera
              </ClearButton>
            </>
          )}
        </HeaderCenter>

        <HeaderRight>
          <ViewToggleButton type="button" onClick={() => setIsModalOpen(true)} title="Apri vista espansa in modal">
            🖥️ Espandi
          </ViewToggleButton>
          <TodayButton type="button" onClick={goToToday}>
            Oggi
          </TodayButton>
          <NavButton
            onClick={goNextMonth}
            type="button"
            aria-label="Successivo"
            disabled={isNextDisabled}
            title={isNextDisabled ? 'Nessun dato dopo questa data' : 'Successivo'}
          >
            ▶
          </NavButton>
        </HeaderRight>
      </CalendarHeader>

      {/* Macro Filter Shortcuts */}
      {showMacroShortcuts && (
        <MacroBar>
          <MacroButton type="button" onClick={selectEntireYear}>
            🎯 Anno {viewYear}
          </MacroButton>
          <MacroButton type="button" onClick={selectCurrentMonth}>
            📅 Mese Corrente
          </MacroButton>
          <MacroButton type="button" onClick={() => selectQuarter(1)}>
            📊 Q1
          </MacroButton>
          <MacroButton type="button" onClick={() => selectQuarter(2)}>
            📊 Q2
          </MacroButton>
          <MacroButton type="button" onClick={() => selectQuarter(3)}>
            📊 Q3
          </MacroButton>
          <MacroButton type="button" onClick={() => selectQuarter(4)}>
            📊 Q4
          </MacroButton>
          <MacroButton type="button" onClick={selectWeekdays}>
            💼 Feriali
          </MacroButton>
          {selectedDates.size > 0 && (
            <MacroButton type="button" onClick={clearSelection} style={{ color: '#e74c3c', borderColor: '#f5c6cb' }}>
              ❌ Azzera ({selectedDates.size})
            </MacroButton>
          )}
        </MacroBar>
      )}

      {/* Calendar / Year Overview */}
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
                          $isToday={cell.date === todayStr}
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
                      $isToday={cell.date === todayStr}
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
            {showWeekNumbers && <div />}
            {dayLabels.map(day => (
              <DayHeader key={day}>{day}</DayHeader>
            ))}

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
                          $isToday={cell.date === todayStr}
                          baseColor={baseColor}
                          $cellHeight={cellHeight}
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
                      $isToday={cell.date === todayStr}
                      baseColor={baseColor}
                      $cellHeight={cellHeight}
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
                <TooltipLabel>Valore:</TooltipLabel>
                <TooltipValue>{tooltip.value?.toLocaleString() ?? 'N/D'}</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel>Massimo:</TooltipLabel>
                <TooltipValue>{dataMap.max.toLocaleString()}</TooltipValue>
              </TooltipRow>
              <TooltipRow>
                <TooltipLabel>% del max:</TooltipLabel>
                <TooltipValue>{tooltip.percentage}%</TooltipValue>
              </TooltipRow>
            </TooltipContainer>
          )}
        </>
      )}

      {/* Expandable Modal Popover */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>📅 Calendar Filter — Vista Annuale {viewYear}</ModalTitle>
              <ModalCloseButton type="button" onClick={() => setIsModalOpen(false)}>
                ✕ Chiudi
              </ModalCloseButton>
            </ModalHeader>
            {showMacroShortcuts && (
              <MacroBar>
                <MacroButton type="button" onClick={selectEntireYear}>
                  🎯 Anno {viewYear}
                </MacroButton>
                <MacroButton type="button" onClick={selectCurrentMonth}>
                  📅 Mese Corrente
                </MacroButton>
                <MacroButton type="button" onClick={() => selectQuarter(1)}>📊 Q1</MacroButton>
                <MacroButton type="button" onClick={() => selectQuarter(2)}>📊 Q2</MacroButton>
                <MacroButton type="button" onClick={() => selectQuarter(3)}>📊 Q3</MacroButton>
                <MacroButton type="button" onClick={() => selectQuarter(4)}>📊 Q4</MacroButton>
                <MacroButton type="button" onClick={selectWeekdays}>💼 Feriali</MacroButton>
                {selectedDates.size > 0 && (
                  <MacroButton type="button" onClick={clearSelection} style={{ color: '#e74c3c', borderColor: '#f5c6cb' }}>
                    ❌ Azzera ({selectedDates.size})
                  </MacroButton>
                )}
              </MacroBar>
            )}
            <YearOverviewGrid style={{ flex: 1, padding: 16 }}>
              {yearOverviewMonths.map(m => (
                <MiniMonth key={m.month}>
                  <MiniMonthTitle>{m.label}</MiniMonthTitle>
                  <MiniMonthGrid showWeekNumbers={showWeekNumbers}>
                    {dayLabels.map(d => (
                      <MiniDayHeader key={d}>{d[0]}</MiniDayHeader>
                    ))}
                    {m.cells.map((cell, ci) => {
                      if (!cell) return <div key={`modal-e-${m.month}-${ci}`} />;
                      return (
                        <MiniDayCell
                          key={cell.date}
                          intensity={intensityScale(cell.value)}
                          isSelected={selectedDates.has(cell.date)}
                          $isToday={cell.date === todayStr}
                          baseColor={baseColor}
                          onClick={() => handleMiniDayClick(cell.date)}
                          title={cell.date}
                        />
                      );
                    })}
                  </MiniMonthGrid>
                </MiniMonth>
              ))}
            </YearOverviewGrid>
          </ModalContent>
        </ModalOverlay>
      )}
    </Styles>
  );
}
