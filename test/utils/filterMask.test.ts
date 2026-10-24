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

import { buildExtraFormData, formatInValue } from '../../src/utils/filterMask';
import { addDays, getWeekDates, isContiguousSelection } from '../../src/utils/dateUtils';

describe('buildExtraFormData', () => {
  it('ends the range on the day after the last selected day', () => {
    expect(buildExtraFormData(['2026-04-01', '2026-04-02', '2026-04-03'], 'ds', 'time_range')).toEqual({
      time_range: '2026-04-01 : 2026-04-04',
      filters: [{ col: 'ds', op: 'TEMPORAL_RANGE', val: '2026-04-01 : 2026-04-04' }],
    });
  });

  it('does not produce an empty range for a single day', () => {
    const result = buildExtraFormData(['2026-12-31'], 'ds', 'time_range') as any;
    expect(result.time_range).toBe('2026-12-31 : 2027-01-01');
  });

  it('sorts and de-duplicates input', () => {
    const result = buildExtraFormData(['2026-04-03', '2026-04-01', '2026-04-01', '2026-04-02'], 'ds', 'in_clause') as any;
    expect(result.filters[0].val).toEqual(['2026-04-01', '2026-04-02', '2026-04-03']);
  });

  it('auto uses a range when contiguous and a list otherwise', () => {
    const range = buildExtraFormData(['2026-04-01', '2026-04-02'], 'ds', 'auto') as any;
    expect(range.filters[0].op).toBe('TEMPORAL_RANGE');
    const list = buildExtraFormData(['2026-04-01', '2026-04-03'], 'ds', 'auto') as any;
    expect(list.filters[0]).toEqual({ col: 'ds', op: 'IN', val: ['2026-04-01', '2026-04-03'] });
    expect(list.time_range).toBeUndefined();
  });

  it('formats list values for timestamp and epoch columns', () => {
    const ts = buildExtraFormData(['2026-04-01'], 'ts', 'in_clause', 'datetime') as any;
    expect(ts.filters[0].val).toEqual(['2026-04-01 00:00:00']);
    const epoch = buildExtraFormData(['2026-04-01'], 'ms', 'in_clause', 'epoch_ms') as any;
    expect(epoch.filters[0].val).toEqual([Date.UTC(2026, 3, 1)]);
  });

  it('emits no filter without a target column or without dates', () => {
    expect(buildExtraFormData(['2026-04-01'], undefined, 'auto')).toEqual({ filters: [] });
    expect(buildExtraFormData([], 'ds', 'auto')).toEqual({ filters: [] });
  });

  it('keeps the invalid key as is when it cannot be converted', () => {
    expect(formatInValue('not-a-date', 'epoch_ms')).toBe('not-a-date');
  });
});

describe('date helpers used by the filter', () => {
  it('addDays crosses month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29');
  });

  it('addDays is safe across the daylight saving change', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-29', 1)).toBe('2026-03-30');
    expect(addDays('2026-10-24', 1)).toBe('2026-10-25');
    expect(addDays('2026-10-25', 1)).toBe('2026-10-26');
  });

  it('getWeekDates honours the first day of the week', () => {
    expect(getWeekDates('2026-04-15', 1)).toEqual([
      '2026-04-13', '2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19',
    ]);
    expect(getWeekDates('2026-04-12', 0)[0]).toBe('2026-04-12');
    expect(getWeekDates('2026-04-12', 1)[0]).toBe('2026-04-06');
  });

  it('isContiguousSelection', () => {
    expect(isContiguousSelection([])).toBe(true);
    expect(isContiguousSelection(['2026-04-01'])).toBe(true);
    expect(isContiguousSelection(['2026-12-31', '2027-01-01'])).toBe(true);
    expect(isContiguousSelection(['2026-04-01', '2026-04-03'])).toBe(false);
  });
});
