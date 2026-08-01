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

export type FilterTypeMode = 'time_range' | 'in_clause';
export type DefaultValueMode = 'none' | 'today' | 'current_month' | 'current_year' | 'custom';

interface CalendarFilterCustomizeProps {
  colorScheme: string;
  showLegend: boolean;
  firstDayOfWeek: number; // 0=Sunday, 1=Monday
  showWeekNumbers: boolean;
  showYearDropdown: boolean;
  enableOverview: boolean;
  cellDensity?: 'compact' | 'normal';
  filterTypeMode?: FilterTypeMode;
  defaultValueMode?: DefaultValueMode;
  showMacroShortcuts?: boolean;
  customDefaultStartDate?: string;
  customDefaultEndDate?: string;
}

export type CalendarFilterQueryFormData = QueryFormData &
  CalendarFilterStylesProps &
  CalendarFilterCustomizeProps;

export type CalendarFilterProps = CalendarFilterStylesProps &
  CalendarFilterCustomizeProps & {
    data: TimeseriesDataRecord[];
    setDataMask?: SetDataMaskHook;
    filterState?: DataMask['filterState'];
    dateColumn?: string;
    formData?: QueryFormData;
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

/** Tooltip data shown on hover */
export interface TooltipData {
  date: string;
  value: number | null;
  percentage: number;
  x: number;
  y: number;
}
