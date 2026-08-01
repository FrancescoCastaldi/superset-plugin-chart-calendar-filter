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
import React from 'react';
import {
  YearOverviewGrid,
  MiniMonth,
  MiniMonthTitle,
  MiniMonthGrid,
  MiniDayHeader,
  MiniWeekNum,
  MiniDayCell,
} from '../styles/CalendarFilter.styles';
import { CalendarDay } from '../types';

interface OverviewMonth {
  month: number;
  label: string;
  cells: (CalendarDay | null)[];
  weekRows: { weekNumber: number; cells: (CalendarDay | null)[] }[];
}

interface YearOverviewProps {
  months: OverviewMonth[];
  dayLabels: string[];
  /** CSS flag passed to MiniMonthGrid (always the real showWeekNumbers) */
  gridWeekNumbers: boolean;
  /** Whether to actually render the week number rows */
  showWeekRows: boolean;
  baseColor: string;
  intensityScale: (val: number | null) => number;
  selectedDates: Set<string>;
  todayStr: string;
  keyPrefix: string;
  style?: React.CSSProperties;
  /** Show value in the cell title (full view); modal shows the date only */
  titleWithValue?: boolean;
  onDayClick: (date: string) => void;
  onDayMouseDown?: (date: string) => void;
  onDayMouseUp?: () => void;
  onDayDragEnter?: (date: string) => void;
  /** Enable keyboard access + drag-to-select (interactive contexts only) */
  interactive?: boolean;
}

/** Year overview grid with 12 mini month calendars */
export default function YearOverview({
  months,
  dayLabels,
  gridWeekNumbers,
  showWeekRows,
  baseColor,
  intensityScale,
  selectedDates,
  todayStr,
  keyPrefix,
  style,
  titleWithValue = false,
  onDayClick,
  onDayMouseDown,
  onDayMouseUp,
  onDayDragEnter,
  interactive = false,
}: YearOverviewProps) {
  const renderMiniDay = (cell: CalendarDay, key: string) => (
    <MiniDayCell
      key={key}
      intensity={intensityScale(cell.value)}
      isSelected={selectedDates.has(cell.date)}
      $isToday={cell.date === todayStr}
      baseColor={baseColor}
      onClick={() => onDayClick(cell.date)}
      onMouseDown={onDayMouseDown ? () => onDayMouseDown(cell.date) : undefined}
      onMouseUp={onDayMouseUp}
      onMouseEnter={onDayDragEnter ? () => onDayDragEnter(cell.date) : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? e => e.key === 'Enter' && onDayClick(cell.date) : undefined}
      title={
        titleWithValue
          ? `${cell.date}${cell.value != null ? `: ${cell.value}` : ''}`
          : cell.date
      }
    />
  );

  return (
    <YearOverviewGrid style={style}>
      {months.map(m => (
        <MiniMonth key={m.month}>
          <MiniMonthTitle>{m.label}</MiniMonthTitle>
          <MiniMonthGrid showWeekNumbers={gridWeekNumbers}>
            {dayLabels.map(d => (
              <MiniDayHeader key={d}>{d[0]}</MiniDayHeader>
            ))}
            {showWeekRows && m.weekRows.map((wr, wi) => (
              <React.Fragment key={`${keyPrefix}-wr-${wi}`}>
                <MiniWeekNum>{wr.weekNumber}</MiniWeekNum>
                {wr.cells.map((cell, ci) =>
                  cell ? (
                    renderMiniDay(cell, `${keyPrefix}-${cell.date}`)
                  ) : (
                    <div key={`${keyPrefix}-e-${wi}-${ci}`} />
                  ),
                )}
              </React.Fragment>
            ))}
            {!showWeekRows && m.cells.map((cell, ci) =>
              cell ? (
                renderMiniDay(cell, `${keyPrefix}-${cell.date}`)
              ) : (
                <div key={`${keyPrefix}-e-${m.month}-${ci}`} />
              ),
            )}
          </MiniMonthGrid>
        </MiniMonth>
      ))}
    </YearOverviewGrid>
  );
}
