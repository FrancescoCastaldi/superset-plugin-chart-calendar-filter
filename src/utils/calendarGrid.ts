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
import { CalendarDay } from '../types';
import {
  formatDateParts,
  getDaysInMonth,
  getFirstDayOfMonth,
  getISOWeekNumber,
  parseDateValue,
} from './dateUtils';

/** Build a month grid of day cells, padded with nulls to align on full weeks */
export function buildMonthCells(
  year: number,
  month: number,
  firstDayOfWeek: number,
  dataMap: Map<string, number>,
): (CalendarDay | null)[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, firstDayOfWeek);
  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  const cells: (CalendarDay | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateParts(year, month, day);
    const value = dataMap.get(dateStr) ?? null;
    cells.push({ date: dateStr, value, hasData: value !== null });
  }
  while (cells.length < totalCells) {
    cells.push(null);
  }
  return cells;
}

/** Split a month grid into week rows with ISO week numbers */
export function buildWeekRows(
  cells: (CalendarDay | null)[],
): { weekNumber: number; cells: (CalendarDay | null)[] }[] {
  const rows: { weekNumber: number; cells: (CalendarDay | null)[] }[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const weekCells = cells.slice(i, i + 7);
    const firstRealCell = weekCells.find(c => c !== null);
    let weekNumber = 1;
    if (firstRealCell) {
      weekNumber = getISOWeekNumber(parseDateValue(firstRealCell.date) || new Date());
    }
    rows.push({ weekNumber, cells: weekCells });
  }
  return rows;
}
