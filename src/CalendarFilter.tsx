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
import React, { useState, useMemo, useCallback } from 'react';
import { styled } from '@superset-ui/core';
import {
  CalendarFilterProps,
  CalendarFilterStylesProps,
  CalendarDay,
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

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Styles ────────────────────────────────────────────────────────────────────

const Styles = styled.div<CalendarFilterStylesProps>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.typography.families?.sansSerif || 'sans-serif'};
  overflow: hidden;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.gridUnit * 2}px;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.secondary.light2};
  border-radius: ${({ theme }) => theme.gridUnit}px;
  cursor: pointer;
  font-size: 16px;
  padding: ${({ theme }) => theme.gridUnit}px ${({ theme }) => theme.gridUnit * 2}px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary.base};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary.light2};
  }
`;

const MonthTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.l}px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.grayscale?.dark1 || '#333'};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  padding: ${({ theme }) => theme.gridUnit * 2}px;
  flex: 1;
  align-content: start;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.sizes.xs}px;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.grayscale?.base || '#666'};
  padding: ${({ theme }) => theme.gridUnit}px 0;
  text-transform: uppercase;
`;

interface DayCellProps {
  intensity: number; // 0-1 scale
  isSelected: boolean;
  isCurrentMonth: boolean;
  baseColor: string;
}

const DayCell = styled.div<DayCellProps>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.gridUnit}px;
  font-size: ${({ theme }) => theme.typography.sizes.xs}px;
  cursor: ${({ isCurrentMonth }) => (isCurrentMonth ? 'pointer' : 'default')};
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.3)};
  transition: all 0.15s ease;
  position: relative;

  background-color: ${({ intensity, baseColor }) => {
    if (intensity === 0) return '#f8f9fa';
    // Interpolate between white and the base color based on intensity
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
  font-size: ${({ theme }) => theme.typography.sizes.xs}px;
  pointer-events: none;
`;

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.gridUnit}px;
  padding: ${({ theme }) => theme.gridUnit * 2}px;
  flex-shrink: 0;
`;

const LegendGradient = styled.div`
  width: 120px;
  height: 12px;
  border-radius: ${({ theme }) => theme.gridUnit}px;
`;

const LegendLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs}px;
  color: ${({ theme }) => theme.colors.grayscale?.base || '#666'};
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.grayscale?.light1 || '#999'};
  font-size: ${({ theme }) => theme.typography.sizes.m}px;
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

/** Get the first day of the month (0=Sun, 1=Mon, ..., 6=Sat) */
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/** Get the number of days in a month */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Get the base color from a palette (the strongest color) */
function getBaseColor(paletteName: string): string {
  const palette = COLOR_PALETTES[paletteName];
  return palette ? palette[palette.length - 1] : COLOR_PALETTES.supersetColors[COLOR_PALETTES.supersetColors.length - 1];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CalendarFilter(props: CalendarFilterProps) {
  const {
    data,
    height,
    width,
    colorScheme = 'supersetColors',
    showLegend = true,
    setDataMask,
    filterState,
  } = props;

  // Current view: defaults to today's month/year
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-12

  // Determine which columns are date vs metric
  const dataMap = useMemo(() => {
    if (!data || data.length === 0) return { map: new Map<string, number>(), min: 0, max: 0, hasData: false };

    const map = new Map<string, number>();
    let min = Infinity;
    let max = -Infinity;

    // Find the metric column (first numeric column after the date column)
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
      }
    });

    return { map, min, max, hasData: map.size > 0 };
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

  // Generate calendar grid for the current month view
  const calendarCells = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
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
  }, [viewYear, viewMonth, dataMap]);

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
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }, [viewMonth, viewYear]);

  const goNextMonth = useCallback(() => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }, [viewMonth, viewYear]);

  // Toggle date selection
  const handleDayClick = useCallback(
    (day: CalendarDay) => {
      if (!setDataMask) return;

      const dateStr = day.date;
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

  // Month label
  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [viewYear, viewMonth]);

  // Legend gradient
  const legendGradient = useMemo(() => {
    const palette = COLOR_PALETTES[colorScheme] || COLOR_PALETTES.supersetColors;
    const stops = palette.slice(1).map((color, i) => {
      const pct = Math.round((i / (palette.length - 2)) * 100);
      return `${color} ${pct}%`;
    });
    return `linear-gradient(to right, ${stops.join(', ')})`;
  }, [colorScheme]);

  // ── Render ──

  if (!data || data.length === 0) {
    return (
      <Styles height={height} width={width}>
        <EmptyState>No data available</EmptyState>
      </Styles>
    );
  }

  return (
    <Styles height={height} width={width}>
      <CalendarHeader>
        <NavButton onClick={goPrevMonth} type="button" aria-label="Previous month">
          ‹
        </NavButton>
        <MonthTitle>{monthLabel}</MonthTitle>
        <NavButton onClick={goNextMonth} type="button" aria-label="Next month">
          ›
        </NavButton>
      </CalendarHeader>

      <CalendarGrid>
        {DAY_LABELS.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}

        {calendarCells.map((cell, idx) => {
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
              onClick={() => handleDayClick(cell)}
              title={`${cell.date}${cell.value != null ? `: ${cell.value}` : ' (no data)'}`}
            >
              <DayNumber>{cell.date.split('-')[2]}</DayNumber>
            </DayCell>
          );
        })}
      </CalendarGrid>

      {showLegend && dataMap.hasData && (
        <LegendContainer>
          <LegendLabel>{dataMap.min.toFixed(1)}</LegendLabel>
          <LegendGradient style={{ background: legendGradient }} />
          <LegendLabel>{dataMap.max.toFixed(1)}</LegendLabel>
        </LegendContainer>
      )}
    </Styles>
  );
}
