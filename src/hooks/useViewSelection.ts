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
import React, { useCallback } from 'react';

import { getDatesInMonth, getDatesInYear } from '../utils/dateUtils';

export type CalendarViewMode = 'month' | 'year';

/**
 * Dropdown-driven dataMask propagation: month/year select changes update
 * the calendar view AND immediately emit the corresponding date selection
 * to the chart via `emitSelection`.
 */
export function useViewSelection(
  viewMode: CalendarViewMode,
  viewYear: number,
  viewMonth: number,
  setViewYear: React.Dispatch<React.SetStateAction<number>>,
  setViewMonth: React.Dispatch<React.SetStateAction<number>>,
  emitSelection: (dates: string[]) => void,
) {
  const handleMonthSelectChange = useCallback(
    (newMonth: number) => {
      setViewMonth(newMonth);
      emitSelection(getDatesInMonth(viewYear, newMonth));
    },
    [viewYear, setViewMonth, emitSelection],
  );

  const handleYearSelectChange = useCallback(
    (newYear: number) => {
      setViewYear(newYear);
      if (viewMode === 'year') {
        emitSelection(getDatesInYear(newYear));
      } else {
        emitSelection(getDatesInMonth(newYear, viewMonth));
      }
    },
    [viewMode, viewMonth, setViewYear, emitSelection],
  );

  return { handleMonthSelectChange, handleYearSelectChange };
}
