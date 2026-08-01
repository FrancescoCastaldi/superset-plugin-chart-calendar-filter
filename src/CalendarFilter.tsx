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

import { Global } from '@emotion/react';
import {
  Styles, NativeFilterTriggerContainer, NativeFilterPillButton, CalendarHeader, HeaderLeft, HeaderCenter, HeaderRight,
  NavButton, TodayButton, MonthTitle, SelectionBadge, ClearButton, YearSelect, MonthSelect, ViewToggleButton,
  EmptyState, EmptyIcon,
} from './styles/CalendarFilter.styles';
import CalendarModal from './components/CalendarModal';
import MacroShortcuts from './components/MacroShortcuts';
import CalendarTooltip from './components/CalendarTooltip';
import MonthGrid from './components/MonthGrid';
import YearOverview from './components/YearOverview';
import { useCalendarData } from './hooks/useCalendarData';
import { useSelectionMask } from './hooks/useSelectionMask';

import {
  CalendarFilterProps,
  CalendarDay,
  TooltipData,
} from './types';
import {
  parseDateValue,
  formatDateKey,
  formatDateParts,
  getDatesInMonth,
  getDatesInYear,
  getDaysInMonth,
  formatDateRangeBadge as formatSelectionRange,
} from './utils/dateUtils';
import { buildMonthCells, buildWeekRows } from './utils/calendarGrid';



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

  const DAY_LABELS_SUNDAY = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  const DAY_LABELS_MONDAY = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  const dayLabels = firstDayOfWeek === 0 ? DAY_LABELS_SUNDAY : DAY_LABELS_MONDAY;

  const cellHeight = cellDensity === 'normal' ? 38 : 30;

  const {
    dataMap,
    minDateBound,
    maxDateBound,
    availableYears,
    intensityScale,
    baseColor,
  } = useCalendarData(data, dateColumn, colorScheme, viewYear, today);

  const {
    selectedDates,
    emitSelection,
    clearSelection,
    handleDayToggle,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  } = useSelectionMask(
    filterState,
    setDataMask,
    filterTypeMode,
    dateColumn,
    defaultValueMode,
    customDefaultStartDate,
    customDefaultEndDate
  );

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

  // Macro Filter Actions
  const selectEntireYear = useCallback(() => {
    emitSelection(getDatesInYear(viewYear));
  }, [viewYear, emitSelection]);

  const selectCurrentMonth = useCallback(() => {
    const now = new Date();
    emitSelection(getDatesInMonth(now.getFullYear(), now.getMonth() + 1));
  }, [emitSelection]);

  const selectQuarter = useCallback(
    (quarter: 1 | 2 | 3 | 4) => {
      const startMonth = (quarter - 1) * 3 + 1;
      const endMonth = startMonth + 2;
      const qDates: string[] = [];
      for (let m = startMonth; m <= endMonth; m++) {
        qDates.push(...getDatesInMonth(viewYear, m));
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
        weekdays.push(formatDateParts(viewYear, viewMonth, d));
      }
    }
    emitSelection(weekdays);
  }, [viewYear, viewMonth, emitSelection]);

  // Is prev/next disabled?
  const isPrevDisabled = useMemo(() => {
    if (!minDateBound) return false;
    if (viewMode === 'year') {
      return viewYear <= (parseDateValue(minDateBound)?.getFullYear() ?? viewYear);
    }
    const firstOfMonth = formatDateParts(viewYear, viewMonth, 1);
    return firstOfMonth <= minDateBound;
  }, [minDateBound, viewYear, viewMonth, viewMode]);

  const isNextDisabled = useMemo(() => {
    if (!maxDateBound) return false;
    if (viewMode === 'year') {
      return viewYear >= (parseDateValue(maxDateBound)?.getFullYear() ?? viewYear);
    }
    const lastOfMonth = formatDateParts(viewYear, viewMonth, getDaysInMonth(viewYear, viewMonth));
    return lastOfMonth >= maxDateBound;
  }, [maxDateBound, viewYear, viewMonth, viewMode]);

  // Generate calendar grid
  const calendarCells = useMemo(
    () => buildMonthCells(viewYear, viewMonth, firstDayOfWeek, dataMap.map),
    [viewYear, viewMonth, dataMap, firstDayOfWeek],
  );

  // Build week rows for week numbers
  const weekRows = useMemo(() => {
    if (!showWeekNumbers) return [];
    return buildWeekRows(calendarCells);
  }, [calendarCells, showWeekNumbers]);



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
  

  

  // Month labels for dropdown
  const MONTH_LABELS = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('it-IT', { month: 'long' });
    return Array.from({ length: 12 }, (_, i) => {
      const raw = formatter.format(new Date(2000, i, 1));
      return {
        value: i + 1,
        label: raw.charAt(0).toUpperCase() + raw.slice(1),
      };
    });
  }, []);

  // Dropdown selection change handlers (update view AND emit filter to chart)
  const handleMonthSelectChange = useCallback((newMonth: number) => {
    setViewMonth(newMonth);
    emitSelection(getDatesInMonth(viewYear, newMonth));
  }, [viewYear, emitSelection]);

  const handleYearSelectChange = useCallback((newYear: number) => {
    setViewYear(newYear);
    if (viewMode === 'year') {
      emitSelection(getDatesInYear(newYear));
    } else {
      emitSelection(getDatesInMonth(newYear, viewMonth));
    }
  }, [viewMode, viewMonth, emitSelection]);

  // Month label
  const monthLabel = useMemo(() => {
    const date = new Date(viewYear, viewMonth - 1, 1);
    const raw = date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
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
      const pct = intensityScale(cell.value) * 100;

      setTooltip({
        date: cell.date,
        value: cell.value,
        percentage: Math.round(pct),
        x: viewportX,
        y: viewportY,
      });
    },
    [intensityScale],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Year Overview
  const yearOverviewMonths = useMemo(() => {
    if (viewMode !== 'year' && !isModalOpen) return [];
    const months: { month: number; label: string; cells: (CalendarDay | null)[]; weekRows: { weekNumber: number; cells: (CalendarDay | null)[] }[] }[] = [];

    for (let m = 1; m <= 12; m++) {
      const cells = buildMonthCells(viewYear, m, firstDayOfWeek, dataMap.map);
      const wRows = showWeekNumbers ? buildWeekRows(cells) : [];

      const label = new Date(viewYear, m - 1, 1).toLocaleDateString('it-IT', { month: 'short' });
      months.push({ month: m, label, cells, weekRows: wRows });
    }

    return months;
  }, [viewYear, viewMode, isModalOpen, dataMap, firstDayOfWeek, showWeekNumbers]);

  

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
          <CalendarModal
            viewMode={viewMode}
            viewYear={viewYear}
            viewMonth={viewMonth}
            monthLabel={monthLabel}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            enableOverview={enableOverview}
            showYearDropdown={showYearDropdown}
            showMacroShortcuts={showMacroShortcuts}
            showWeekNumbers={showWeekNumbers}
            availableYears={availableYears}
            monthOptions={MONTH_LABELS}
            onMonthSelect={handleMonthSelectChange}
            onYearSelect={handleYearSelectChange}
            dayLabels={dayLabels}
            calendarCells={calendarCells}
            weekRows={weekRows}
            yearOverviewMonths={yearOverviewMonths}
            cellHeight={cellHeight}
            baseColor={baseColor}
            intensityScale={intensityScale}
            selectedDates={selectedDates}
            todayStr={todayStr}
            onClose={() => setIsModalOpen(false)}
            onPrev={goPrevMonth}
            onNext={goNextMonth}
            onPrevYear={() => setViewYear(y => y - 1)}
            onNextYear={() => setViewYear(y => y + 1)}
            onToggleView={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
            onToday={goToToday}
            onDayClick={handleDayToggle}
            onDayHover={handleMouseEnter}
            onDayLeave={handleMouseLeave}
            onDayMouseDown={handleDragStart}
            onDayMouseUp={handleDragEnd}
            onDayDragEnter={handleDragEnter}
            onSelectYear={selectEntireYear}
            onSelectCurrentMonth={selectCurrentMonth}
            onSelectQuarter={selectQuarter}
            onSelectWeekdays={selectWeekdays}
            onClear={clearSelection}
            interactive
          />
        )}
        {tooltip && (
          <CalendarTooltip tooltip={tooltip} maxValue={dataMap.max} />
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
          {viewMode === 'month' && (
            <MonthSelect
              value={viewMonth}
              onChange={e => handleMonthSelectChange(Number(e.target.value))}
              aria-label="Seleziona mese"
            >
              {MONTH_LABELS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </MonthSelect>
          )}
          {showYearDropdown && (
            <YearSelect
              value={viewYear}
              onChange={e => handleYearSelectChange(Number(e.target.value))}
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
        <MacroShortcuts
          viewYear={viewYear}
          selectedCount={selectedDates.size}
          onSelectYear={selectEntireYear}
          onSelectCurrentMonth={selectCurrentMonth}
          onSelectQuarter={selectQuarter}
          onSelectWeekdays={selectWeekdays}
          onClear={clearSelection}
        />
      )}

      {/* Calendar / Year Overview */}
      {viewMode === 'year' ? (
        <YearOverview
          months={yearOverviewMonths}
          dayLabels={dayLabels}
          gridWeekNumbers={showWeekNumbers}
          showWeekRows={showWeekNumbers}
          baseColor={baseColor}
          intensityScale={intensityScale}
          selectedDates={selectedDates}
          todayStr={todayStr}
          keyPrefix=""
          titleWithValue
          onDayClick={handleDayToggle}
        />
      ) : (
        <>
          <MonthGrid
            cells={calendarCells}
            weekRows={weekRows}
            dayLabels={dayLabels}
            showWeekNumbers={showWeekNumbers}
            cellHeight={cellHeight}
            baseColor={baseColor}
            intensityScale={intensityScale}
            selectedDates={selectedDates}
            todayStr={todayStr}
            keyPrefix=""
            onDayClick={handleDayToggle}
            onDayHover={handleMouseEnter}
            onDayLeave={handleMouseLeave}
          />

          {/* Tooltip */}
          {tooltip && (
            <CalendarTooltip tooltip={tooltip} maxValue={dataMap.max} formatNumbers />
          )}
        </>
      )}

      {/* Expandable Modal Popover */}
      {isModalOpen && (
        <CalendarModal
          viewMode={viewMode}
          viewYear={viewYear}
          viewMonth={viewMonth}
          monthLabel={monthLabel}
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          enableOverview={enableOverview}
          showYearDropdown={showYearDropdown}
          showMacroShortcuts={showMacroShortcuts}
          showWeekNumbers={showWeekNumbers}
          availableYears={availableYears}
          monthOptions={MONTH_LABELS}
          onMonthSelect={handleMonthSelectChange}
          onYearSelect={handleYearSelectChange}
          dayLabels={dayLabels}
          calendarCells={calendarCells}
          weekRows={weekRows}
          yearOverviewMonths={yearOverviewMonths}
          cellHeight={cellHeight}
          baseColor={baseColor}
          intensityScale={intensityScale}
          selectedDates={selectedDates}
          todayStr={todayStr}
          onClose={() => setIsModalOpen(false)}
          onPrev={goPrevMonth}
          onNext={goNextMonth}
          onPrevYear={() => setViewYear(y => y - 1)}
          onNextYear={() => setViewYear(y => y + 1)}
          onToggleView={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
          onToday={goToToday}
          onDayClick={handleDayToggle}
          onDayHover={handleMouseEnter}
          onDayLeave={handleMouseLeave}
          onSelectYear={selectEntireYear}
          onSelectCurrentMonth={selectCurrentMonth}
          onSelectQuarter={selectQuarter}
          onSelectWeekdays={selectWeekdays}
          onClear={clearSelection}
        />
      )}
    </Styles>
  );
}
