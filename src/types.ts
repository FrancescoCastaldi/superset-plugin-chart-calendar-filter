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
import {
  QueryFormData,
  TimeseriesDataRecord,
  SetDataMaskHook,
  DataMask,
} from '@superset-ui/core';

export interface CalendarFilterStylesProps {
  height: number;
  width: number;
}

interface CalendarFilterCustomizeProps {
  colorScheme: string;
  showLegend: boolean;
  firstDayOfWeek: number; // 0=Sunday, 1=Monday
  showWeekNumbers: boolean;
  showYearDropdown: boolean;
  enableOverview: boolean;
  cellDensity?: 'compact' | 'normal';
}

export type CalendarFilterQueryFormData = QueryFormData &
  CalendarFilterStylesProps &
  CalendarFilterCustomizeProps;

export type CalendarFilterProps = CalendarFilterStylesProps &
  CalendarFilterCustomizeProps & {
    data: TimeseriesDataRecord[];
    setDataMask: SetDataMaskHook;
    filterState?: DataMask['filterState'];
  };

/** Calendar day data point */
export interface CalendarDay {
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Raw metric value */
  value: number | null;
  /** Whether this day has data */
  hasData: boolean;
}

/** Calendar month data for rendering */
export interface CalendarMonth {
  /** Year (e.g. 2024) */
  year: number;
  /** Month (1-12) */
  month: number;
  /** Display label */
  label: string;
  /** Days in the month grid (including padding for week alignment) */
  days: CalendarDay[];
  /** Number of leading empty cells for first day of month */
  startPadding: number;
  /** Total cells including padding */
  totalCells: number;
}

/** Week info for a row in the calendar grid */
export interface WeekRow {
  /** ISO week number */
  weekNumber: number;
  /** Days in this week row (may include null padding) */
  cells: (CalendarDay | null)[];
  /** Indices for shift-click range selection */
  startIndex: number;
  endIndex: number;
}

/** Tooltip data shown on hover */
export interface TooltipData {
  date: string;
  value: number | null;
  percentage: number;
  x: number;
  y: number;
}
