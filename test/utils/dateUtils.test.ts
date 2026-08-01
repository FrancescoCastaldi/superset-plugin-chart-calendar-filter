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
  parseDateValue,
  formatDateKey,
  formatDateParts,
  getDatesInMonth,
  getDatesInYear,
  getFirstDayOfMonth,
  getDaysInMonth,
  getISOWeekNumber,
  formatDateRangeBadge,
} from '../../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('parseDateValue', () => {
    it('returns null for falsy values', () => {
      expect(parseDateValue(null)).toBeNull();
      expect(parseDateValue(undefined)).toBeNull();
      expect(parseDateValue('')).toBeNull();
    });

    it('returns Date instance unchanged', () => {
      const d = new Date(2026, 2, 15);
      expect(parseDateValue(d)).toBe(d);
    });

    it('parses timestamps', () => {
      const timestamp = 1773532800000;
      const parsed = parseDateValue(timestamp);
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed?.getTime()).toBe(timestamp);
    });

    it('parses YYYY-MM-DD as local midnight without UTC shift', () => {
      const parsed = parseDateValue('2026-03-15');
      expect(parsed).not.toBeNull();
      expect(parsed?.getFullYear()).toBe(2026);
      expect(parsed?.getMonth()).toBe(2); // March = index 2
      expect(parsed?.getDate()).toBe(15);
    });
  });

  describe('formatDateKey', () => {
    it('formats date object to YYYY-MM-DD', () => {
      const d = new Date(2026, 2, 5);
      expect(formatDateKey(d)).toBe('2026-03-05');
    });
  });

  describe('formatDateParts', () => {
    it('pads month and day to two digits', () => {
      expect(formatDateParts(2026, 3, 5)).toBe('2026-03-05');
      expect(formatDateParts(2026, 11, 25)).toBe('2026-11-25');
      expect(formatDateParts(2026, 1, 1)).toBe('2026-01-01');
    });
  });

  describe('getDatesInMonth', () => {
    it('returns every date key in the month', () => {
      expect(getDatesInMonth(2026, 2)).toHaveLength(28);
      expect(getDatesInMonth(2024, 2)).toHaveLength(29); // leap year
      expect(getDatesInMonth(2026, 3)).toHaveLength(31);
      expect(getDatesInMonth(2026, 3)[0]).toBe('2026-03-01');
      expect(getDatesInMonth(2026, 3)[30]).toBe('2026-03-31');
    });
  });

  describe('getDatesInYear', () => {
    it('returns every date key in the year', () => {
      expect(getDatesInYear(2026)).toHaveLength(365);
      expect(getDatesInYear(2024)).toHaveLength(366); // leap year
      expect(getDatesInYear(2026)[0]).toBe('2026-01-01');
      expect(getDatesInYear(2026)[364]).toBe('2026-12-31');
    });
  });

  describe('getFirstDayOfMonth & getDaysInMonth', () => {
    it('calculates first day of month with Sunday start', () => {
      // 2026-03-01 is Sunday (day 0)
      expect(getFirstDayOfMonth(2026, 3, 0)).toBe(0);
      // with Monday start, Sunday is day 6
      expect(getFirstDayOfMonth(2026, 3, 1)).toBe(6);
    });

    it('returns correct days in month', () => {
      expect(getDaysInMonth(2026, 2)).toBe(28); // Feb non-leap
      expect(getDaysInMonth(2024, 2)).toBe(29); // Feb leap year
      expect(getDaysInMonth(2026, 3)).toBe(31); // March
    });
  });

  describe('getISOWeekNumber', () => {
    it('returns correct ISO week number', () => {
      const d = new Date(2026, 0, 1); // 2026-01-01 is Thursday -> Week 1
      expect(getISOWeekNumber(d)).toBe(1);
    });
  });

  describe('formatDateRangeBadge', () => {
    it('returns empty string for empty array', () => {
      expect(formatDateRangeBadge([])).toBe('');
    });

    it('formats single date badge', () => {
      expect(formatDateRangeBadge(['2026-03-15'])).toBe('15 mar 2026');
    });

    it('formats contiguous date range in same month', () => {
      expect(
        formatDateRangeBadge(['2026-03-12', '2026-03-13', '2026-03-14', '2026-03-15']),
      ).toBe('12-15 Mar 2026');
    });
  });
});
