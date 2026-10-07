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
import { useCallback } from 'react';

import {
  getDatesInMonth,
  getDatesInYear,
  getDaysInMonth,
  formatDateParts,
} from '../utils/dateUtils';

export type Quarter = 1 | 2 | 3 | 4;

/** All date keys (YYYY-MM-DD) in a calendar quarter of the given year. */
export function getQuarterDates(year: number, quarter: Quarter): string[] {
  const startMonth = (quarter - 1) * 3 + 1;
  const endMonth = startMonth + 2;
  const dates: string[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    dates.push(...getDatesInMonth(year, m));
  }
  return dates;
}

/** All weekday (Mon-Fri) date keys of the given month. */
export function getWeekdayDates(year: number, month: number): string[] {
  const weekdays: string[] = [];
  const daysInM = getDaysInMonth(year, month);
  for (let d = 1; d <= daysInM; d++) {
    const dt = new Date(year, month - 1, d);
    const dayOfWeek = dt.getDay(); // 0 = Sun, 6 = Sat
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays.push(formatDateParts(year, month, d));
    }
  }
  return weekdays;
}

/**
 * Macro filter actions: one-click date selections (whole year, current
 * month, calendar quarter, weekdays of the month) that propagate through
 * the shared `emitSelection` dataMask dispatcher.
 */
export function useMacroActions(
  viewYear: number,
  viewMonth: number,
  emitSelection: (dates: string[]) => void,
) {
  const selectEntireYear = useCallback(() => {
    emitSelection(getDatesInYear(viewYear));
  }, [viewYear, emitSelection]);

  const selectCurrentMonth = useCallback(() => {
    const now = new Date();
    emitSelection(getDatesInMonth(now.getFullYear(), now.getMonth() + 1));
  }, [emitSelection]);

  const selectQuarter = useCallback(
    (quarter: Quarter) => {
      emitSelection(getQuarterDates(viewYear, quarter));
    },
    [viewYear, emitSelection],
  );

  const selectWeekdays = useCallback(() => {
    emitSelection(getWeekdayDates(viewYear, viewMonth));
  }, [viewYear, viewMonth, emitSelection]);

  return { selectEntireYear, selectCurrentMonth, selectQuarter, selectWeekdays };
}
