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
  YearOverviewGrid,
  MiniMonth,
  MiniMonthTitle,
  MiniMonthGrid,
  MiniDayHeader,
  MiniWeekNum,
  MiniDayCell,
} from '../styles/CalendarFilter.styles';
import { CalendarDay } from '../types';
import { useCalendarDisplay } from '../utils/labels';
import { handleGridKeyDown, pickTabStop } from '../utils/gridKeys';

interface OverviewMonth {
  month: number;
  label: string;
  cells: (CalendarDay | null)[];
  weekRows: { weekNumber: number; cells: (CalendarDay | null)[] }[];
}

interface YearOverviewProps {
  months: OverviewMonth[];
  dayLabels: string[];
  /** Kept for compatibility: the week column now follows `showWeekRows` */
  gridWeekNumbers?: boolean;
  /** Whether to actually render the week number rows */
  showWeekRows: boolean;
  baseColor: string;
  intensityScale: (val: number | null) => number;
  selectedDates: Set<string>;
  selectedDatesT1?: Set<string>;
  selectedDatesT2?: Set<string>;
  todayStr: string;
  keyPrefix: string;
  style?: React.CSSProperties;
  /** Show value in the cell title (full view); modal shows the date only */
  titleWithValue?: boolean;
  onDayClick: (date: string) => void;
  onDayMouseDown?: (date: string) => void;
  onDayMouseUp?: () => void;
  onDayDragEnter?: (date: string) => void;
  /** Kept for compatibility: keyboard access is now always on */
  interactive?: boolean;
}

/** Year overview grid with 12 mini month calendars */
const YearOverview = memo(function YearOverview({
  months,
  dayLabels,
  showWeekRows,
  selectedDates,
  baseColor,
  todayStr,
  keyPrefix,
  style,
  titleWithValue = false,
  onDayClick,
  onDayMouseDown,
  onDayMouseUp,
  onDayDragEnter,
}: YearOverviewProps) {
  const { labels, holidays, heatStyle, onWeekSelect, onMonthSelect } = useCalendarDisplay();

  const tabStop = useMemo(
    () =>
      pickTabStop(
        months.flatMap(m => m.cells.filter((c): c is CalendarDay => c !== null).map(c => c.date)),
        selectedDates,
        todayStr,
      ),
    [months, selectedDates, todayStr],
  );

  const renderMiniDay = (cell: CalendarDay, key: string) => {
    const holiday = holidays.get(cell.date);
    const isSelected = selectedDates.has(cell.date);
    return (
      <MiniDayCell
        key={key}
        data-date={cell.date}
        role="button"
        aria-pressed={isSelected}
        aria-label={holiday ? `${cell.date} - ${holiday}` : cell.date}
        isSelected={isSelected}
        $isToday={cell.date === todayStr}
        $heat={heatStyle(cell.value, cell.hasData)}
        $isHoliday={Boolean(holiday)}
        baseColor={baseColor}
        onClick={() => onDayClick(cell.date)}
        onMouseDown={onDayMouseDown ? () => onDayMouseDown(cell.date) : undefined}
        onMouseUp={onDayMouseUp}
        onMouseEnter={onDayDragEnter ? () => onDayDragEnter(cell.date) : undefined}
        tabIndex={cell.date === tabStop ? 0 : -1}
        title={[
          titleWithValue ? `${cell.date}${cell.value != null ? `: ${cell.value}` : ''}` : cell.date,
          holiday,
        ]
          .filter(Boolean)
          .join(' - ')}
      />
    );
  };

  return (
    <YearOverviewGrid style={style} onKeyDown={e => handleGridKeyDown(e, onDayClick)}>
      {months.map(m => (
        <MiniMonth key={m.month}>
          <MiniMonthTitle
            role="button"
            title={labels.monthTitle(m.label)}
            aria-label={labels.monthTitle(m.label)}
            onClick={() => onMonthSelect?.(m.month)}
          >
            {m.label}
          </MiniMonthTitle>
          <MiniMonthGrid showWeekNumbers={showWeekRows}>
            {showWeekRows && <div />}
            {dayLabels.map(d => (
              <MiniDayHeader key={d}>{d[0]}</MiniDayHeader>
            ))}
            {showWeekRows && m.weekRows.map((wr, wi) => (
              <React.Fragment key={`${keyPrefix}-wr-${wi}`}>
                <MiniWeekNum
                  role="button"
                  title={labels.weekTitle(wr.weekNumber)}
                  onClick={() => {
                    const first = wr.cells.find(c => c !== null)?.date;
                    if (first) onWeekSelect?.(first);
                  }}
                >
                  {wr.weekNumber}
                </MiniWeekNum>
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
});

export default YearOverview;
