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
import { render } from '@testing-library/react';

import {
  getQuarterDates,
  getWeekdayDates,
  useMacroActions,
} from '../../src/hooks/useMacroActions';
import { getDatesInMonth, getDatesInYear } from '../../src/utils/dateUtils';

/** Minimal renderHook harness for @testing-library/react v12 (no built-in renderHook). */
function renderHook<T>(callback: () => T): { result: { current: T } } {
  const result: { current: T } = { current: undefined as unknown as T };
  const Probe = () => {
    result.current = callback();
    return null;
  };
  render(<Probe />);
  return { result };
}

describe('getQuarterDates', () => {
  it('returns all dates of Q1 (Jan-Mar) for a non-leap year', () => {
    const dates = getQuarterDates(2026, 1);
    // 31 (Jan) + 28 (Feb) + 31 (Mar)
    expect(dates).toHaveLength(90);
    expect(dates[0]).toBe('2026-01-01');
    expect(dates[dates.length - 1]).toBe('2026-03-31');
  });

  it('includes February 29th in Q1 of a leap year', () => {
    const dates = getQuarterDates(2024, 1);
    expect(dates).toHaveLength(91);
    expect(dates).toContain('2024-02-29');
  });

  it('returns all dates of Q4 (Oct-Dec)', () => {
    const dates = getQuarterDates(2026, 4);
    expect(dates).toHaveLength(92);
    expect(dates[0]).toBe('2026-10-01');
    expect(dates[dates.length - 1]).toBe('2026-12-31');
  });

  it('matches the concatenation of the three underlying months', () => {
    const expected = [
      ...getDatesInMonth(2026, 4),
      ...getDatesInMonth(2026, 5),
      ...getDatesInMonth(2026, 6),
    ];
    expect(getQuarterDates(2026, 2)).toEqual(expected);
  });
});

describe('getWeekdayDates', () => {
  it('returns only Mon-Fri dates of the given month', () => {
    // January 2026: Jan 1st is a Thursday; 5 Saturdays + 4 Sundays
    const weekdays = getWeekdayDates(2026, 1);
    expect(weekdays).toHaveLength(22);
    expect(weekdays[0]).toBe('2026-01-01');
    expect(weekdays).not.toContain('2026-01-03'); // Saturday
    expect(weekdays).not.toContain('2026-01-04'); // Sunday
    weekdays.forEach(date => {
      const day = new Date(`${date}T00:00:00`).getDay();
      expect(day).not.toBe(0);
      expect(day).not.toBe(6);
    });
  });

  it('covers February, the shortest month (28 days, 4 full weekends)', () => {
    // February 2026: Feb 1st is a Sunday; 4 Saturdays + 4 Sundays
    const weekdays = getWeekdayDates(2026, 2);
    expect(weekdays).toHaveLength(20);
  });
});

describe('useMacroActions', () => {
  const emitSelection = jest.fn();

  beforeEach(() => {
    emitSelection.mockClear();
  });

  it('selectEntireYear emits every date of the view year', () => {
    const { result } = renderHook(() => useMacroActions(2026, 12, emitSelection));
    result.current.selectEntireYear();
    expect(emitSelection).toHaveBeenCalledWith(getDatesInYear(2026));
  });

  it('selectCurrentMonth emits every date of the current real month', () => {
    const { result } = renderHook(() => useMacroActions(2026, 12, emitSelection));
    const now = new Date();
    result.current.selectCurrentMonth();
    expect(emitSelection).toHaveBeenCalledWith(
      getDatesInMonth(now.getFullYear(), now.getMonth() + 1),
    );
  });

  it('selectQuarter emits every date of the chosen quarter', () => {
    const { result } = renderHook(() => useMacroActions(2026, 12, emitSelection));
    result.current.selectQuarter(3);
    expect(emitSelection).toHaveBeenCalledWith(getQuarterDates(2026, 3));
  });

  it('selectWeekdays emits the weekdays of the view month', () => {
    const { result } = renderHook(() => useMacroActions(2026, 1, emitSelection));
    result.current.selectWeekdays();
    expect(emitSelection).toHaveBeenCalledWith(getWeekdayDates(2026, 1));
  });
});
