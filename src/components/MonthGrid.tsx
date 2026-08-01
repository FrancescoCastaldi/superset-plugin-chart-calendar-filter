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
  CalendarGrid,
  DayHeader,
  WeekNumberCell,
  DayCell,
  DayNumber,
} from '../styles/CalendarFilter.styles';
import { CalendarDay } from '../types';

interface WeekRowCells {
  weekNumber: number;
  cells: (CalendarDay | null)[];
}

interface MonthGridProps {
  cells: (CalendarDay | null)[];
  weekRows: WeekRowCells[];
  dayLabels: string[];
  showWeekNumbers: boolean;
  cellHeight: number;
  baseColor: string;
  intensityScale: (val: number | null) => number;
  selectedDates: Set<string>;
  todayStr: string;
  keyPrefix: string;
  style?: React.CSSProperties;
  onDayClick: (date: string) => void;
  onDayHover?: (cell: CalendarDay, event: React.MouseEvent) => void;
  onDayLeave?: () => void;
  onDayMouseDown?: (date: string) => void;
  onDayMouseUp?: () => void;
  onDayDragEnter?: (date: string) => void;
  /** Enable keyboard access + drag-to-select (interactive contexts only) */
  interactive?: boolean;
}

/** Full month grid with day cells, optional week numbers, hover and selection handlers */
export default function MonthGrid({
  cells,
  weekRows,
  dayLabels,
  showWeekNumbers,
  cellHeight,
  baseColor,
  intensityScale,
  selectedDates,
  todayStr,
  keyPrefix,
  style,
  onDayClick,
  onDayHover,
  onDayLeave,
  onDayMouseDown,
  onDayMouseUp,
  onDayDragEnter,
  interactive = false,
}: MonthGridProps) {
  const renderDayCell = (cell: CalendarDay, key: string) => (
    <DayCell
      key={key}
      intensity={intensityScale(cell.value)}
      isSelected={selectedDates.has(cell.date)}
      isCurrentMonth
      $isToday={cell.date === todayStr}
      baseColor={baseColor}
      $cellHeight={cellHeight}
      onClick={() => onDayClick(cell.date)}
      onMouseDown={onDayMouseDown ? () => onDayMouseDown(cell.date) : undefined}
      onMouseUp={onDayMouseUp}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? e => e.key === 'Enter' && onDayClick(cell.date) : undefined}
      onMouseEnter={e => {
        if (onDayDragEnter) onDayDragEnter(cell.date);
        if (onDayHover) onDayHover(cell, e);
      }}
      onMouseLeave={onDayLeave}
      title=""
    >
      <DayNumber>{cell.date.split('-')[2]}</DayNumber>
    </DayCell>
  );

  return (
    <CalendarGrid showWeekNumbers={showWeekNumbers} style={style}>
      {showWeekNumbers && <div />}
      {dayLabels.map(day => (
        <DayHeader key={`${keyPrefix}-dh-${day}`}>{day}</DayHeader>
      ))}

      {showWeekNumbers
        ? weekRows.map((row, rowIdx) => (
            <React.Fragment key={`${keyPrefix}-row-${rowIdx}`}>
              <WeekNumberCell>{row.weekNumber}</WeekNumberCell>
              {row.cells.map((cell, cellIdx) =>
                cell ? (
                  renderDayCell(cell, `${keyPrefix}-${cell.date}`)
                ) : (
                  <div key={`${keyPrefix}-e-${rowIdx}-${cellIdx}`} />
                ),
              )}
            </React.Fragment>
          ))
        : cells.map((cell, idx) =>
            cell ? (
              renderDayCell(cell, `${keyPrefix}-${cell.date}`)
            ) : (
              <div key={`${keyPrefix}-empty-${idx}`} />
            ),
          )}
    </CalendarGrid>
  );
}
