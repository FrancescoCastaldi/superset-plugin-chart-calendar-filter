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
import React, { memo, useMemo } from 'react';
import {
  CalendarGrid,
  DayHeader,
  WeekNumberCell,
  DayCell,
  DayNumber,
} from '../styles/CalendarFilter.styles';
import { CalendarDay } from '../types';
import { useCalendarDisplay } from '../utils/labels';
import { handleGridKeyDown, pickTabStop } from '../utils/gridKeys';

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
  selectedDatesT1?: Set<string>;
  selectedDatesT2?: Set<string>;
  todayStr: string;
  keyPrefix: string;
  style?: React.CSSProperties;
  onDayClick: (date: string) => void;
  onDayHover?: (cell: CalendarDay, event: React.MouseEvent) => void;
  onDayLeave?: () => void;
  onDayMouseDown?: (date: string) => void;
  onDayMouseUp?: () => void;
  onDayDragEnter?: (date: string) => void;
  /** Kept for compatibility: keyboard access is now always on */
  interactive?: boolean;
}

/** Full month grid with day cells, optional week numbers, hover and selection handlers */
const MonthGrid = memo(function MonthGrid({
  cells,
  weekRows,
  dayLabels,
  showWeekNumbers,
  cellHeight,
  baseColor,
  intensityScale,
  selectedDates,
  selectedDatesT1,
  selectedDatesT2,
  todayStr,
  keyPrefix,
  style,
  onDayClick,
  onDayHover,
  onDayLeave,
  onDayMouseDown,
  onDayMouseUp,
  onDayDragEnter,
}: MonthGridProps) {
  const { labels, holidays, heatStyle, onWeekSelect } = useCalendarDisplay();

  const tabStop = useMemo(
    () => pickTabStop(cells.filter((c): c is CalendarDay => c !== null).map(c => c.date), selectedDates, todayStr),
    [cells, selectedDates, todayStr],
  );

  const renderDayCell = (cell: CalendarDay, key: string) => {
    const holiday = holidays.get(cell.date);
    const inT1 = selectedDatesT1?.has(cell.date) ?? false;
    const inT2 = selectedDatesT2?.has(cell.date) ?? false;
    let slotType: 'T1' | 'T2' | 'BOTH' | 'STANDARD' | undefined;
    if (selectedDatesT1 || selectedDatesT2) {
      if (inT1 && inT2) slotType = 'BOTH';
      else if (inT1) slotType = 'T1';
      else if (inT2) slotType = 'T2';
    } else {
      slotType = selectedDates.has(cell.date) ? 'STANDARD' : undefined;
    }
    const isSelected = selectedDates.has(cell.date) || inT1 || inT2;
    return (
      <DayCell
        key={key}
        data-date={cell.date}
        role="button"
        aria-pressed={isSelected}
        aria-label={holiday ? `${cell.date} - ${holiday}` : cell.date}
        intensity={intensityScale(cell.value)}
        isSelected={isSelected}
        $selectionSlot={slotType}
        isCurrentMonth
        $isToday={cell.date === todayStr}
        $heat={heatStyle(cell.value, cell.hasData)}
        $isHoliday={Boolean(holiday)}
        baseColor={baseColor}
        $cellHeight={cellHeight}
        onClick={() => onDayClick(cell.date)}
        onMouseDown={onDayMouseDown ? () => onDayMouseDown(cell.date) : undefined}
        onMouseUp={onDayMouseUp}
        tabIndex={cell.date === tabStop ? 0 : -1}
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
  };

  const renderWeekNumber = (row: WeekRowCells) => {
    const firstDate = row.cells.find(c => c !== null)?.date;
    return (
      <WeekNumberCell
        role="button"
        title={labels.weekTitle(row.weekNumber)}
        aria-label={labels.weekTitle(row.weekNumber)}
        onClick={() => firstDate && onWeekSelect?.(firstDate)}
      >
        {row.weekNumber}
      </WeekNumberCell>
    );
  };

  return (
    <CalendarGrid
      showWeekNumbers={showWeekNumbers}
      style={style}
      onKeyDown={e => handleGridKeyDown(e, onDayClick)}
    >
      {showWeekNumbers && <div />}
      {dayLabels.map(day => (
        <DayHeader key={`${keyPrefix}-dh-${day}`}>{day}</DayHeader>
      ))}

      {showWeekNumbers
        ? weekRows.map((row, rowIdx) => (
            <React.Fragment key={`${keyPrefix}-row-${rowIdx}`}>
              {renderWeekNumber(row)}
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
});

export default MonthGrid;
