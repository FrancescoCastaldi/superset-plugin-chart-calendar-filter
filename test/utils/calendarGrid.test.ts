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

import { buildMonthCells, buildWeekRows } from '../../src/utils/calendarGrid';

describe('calendarGrid', () => {
  describe('buildMonthCells', () => {
    it('builds a full-week-padded grid with values from the data map', () => {
      // 2026-03-01 is a Sunday, so no leading padding with Sunday start
      const dataMap = new Map<string, number>([
        ['2026-03-01', 5],
        ['2026-03-15', 10],
      ]);
      const cells = buildMonthCells(2026, 3, 0, dataMap);

      expect(cells).toHaveLength(35); // 31 days, Sunday start -> exactly 5 weeks
      expect(cells[0]).not.toBeNull();
      expect(cells[0]?.date).toBe('2026-03-01');
      expect(cells[0]?.value).toBe(5);
      expect(cells[0]?.hasData).toBe(true);
      expect(cells[14]?.date).toBe('2026-03-15');
      expect(cells[30]?.date).toBe('2026-03-31');
      expect(cells[34]).toBeNull(); // trailing padding
    });

    it('pads the start when the month does not begin on the first column', () => {
      // 2026-05-01 is a Friday -> 5 leading nulls with Sunday start
      const cells = buildMonthCells(2026, 5, 0, new Map());
      expect(cells).toHaveLength(42); // 31 + 5 -> 6 weeks
      expect(cells.slice(0, 5).every(c => c === null)).toBe(true);
      expect(cells[5]?.date).toBe('2026-05-01');
      expect(cells[36]).toBeNull(); // trailing padding
    });

    it('respects Monday as first day of week', () => {
      // 2026-03-01 is Sunday -> 6 leading nulls with Monday start
      const cells = buildMonthCells(2026, 3, 1, new Map());
      expect(cells).toHaveLength(42);
      expect(cells[6]?.date).toBe('2026-03-01');
    });
  });

  describe('buildWeekRows', () => {
    it('splits the grid into 7-cell rows with ISO week numbers', () => {
      const cells = buildMonthCells(2026, 3, 0, new Map()); // 35 cells -> 5 rows
      const rows = buildWeekRows(cells);

      expect(rows).toHaveLength(5);
      rows.forEach(row => expect(row.cells).toHaveLength(7));
      expect(rows[0].weekNumber).toBe(9); // ISO week of 2026-03-01
      expect(rows[0].cells[0]?.date).toBe('2026-03-01');
      expect(rows[4].cells[3]).toBeNull();
    });

    it('handles grids with leading padding', () => {
      const cells = buildMonthCells(2026, 5, 0, new Map()); // 42 cells -> 6 rows
      const rows = buildWeekRows(cells);

      expect(rows).toHaveLength(6);
      expect(rows[0].cells.slice(0, 5).every(c => c === null)).toBe(true);
      expect(rows[0].cells[5]?.date).toBe('2026-05-01');
    });
  });
});
