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

import { getPresetDates, getPresetRange, normalizePresets, DEFAULT_PRESETS } from '../../src/utils/presets';

// Wednesday 15 April 2026
const NOW = new Date(2026, 3, 15);

describe('presets', () => {
  it.each([
    ['today', '2026-04-15', '2026-04-15'],
    ['yesterday', '2026-04-14', '2026-04-14'],
    ['last_7_days', '2026-04-09', '2026-04-15'],
    ['last_30_days', '2026-03-17', '2026-04-15'],
    ['last_90_days', '2026-01-16', '2026-04-15'],
    ['month_to_date', '2026-04-01', '2026-04-15'],
    ['last_month', '2026-03-01', '2026-03-31'],
    ['last_quarter', '2026-01-01', '2026-03-31'],
    ['year_to_date', '2026-01-01', '2026-04-15'],
    ['last_year', '2025-01-01', '2025-12-31'],
  ] as const)('%s', (id, start, end) => {
    expect(getPresetRange(id, NOW, 1)).toEqual({ start, end });
  });

  it('computes weeks from the configured first day', () => {
    expect(getPresetRange('this_week', NOW, 1)).toEqual({ start: '2026-04-13', end: '2026-04-19' });
    expect(getPresetRange('this_week', NOW, 0)).toEqual({ start: '2026-04-12', end: '2026-04-18' });
    expect(getPresetRange('last_week', NOW, 1)).toEqual({ start: '2026-04-06', end: '2026-04-12' });
  });

  it('rolls over the year boundary', () => {
    const january = new Date(2026, 0, 10);
    expect(getPresetRange('last_month', january)).toEqual({ start: '2025-12-01', end: '2025-12-31' });
    expect(getPresetRange('last_quarter', january)).toEqual({ start: '2025-10-01', end: '2025-12-31' });
  });

  it('handles February in a leap year', () => {
    expect(getPresetRange('last_month', new Date(2024, 2, 5))).toEqual({ start: '2024-02-01', end: '2024-02-29' });
  });

  it('expands to every day of the range', () => {
    const dates = getPresetDates('last_7_days', NOW);
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe('2026-04-09');
    expect(dates[6]).toBe('2026-04-15');
  });

  describe('normalizePresets', () => {
    it('falls back to the defaults when unset', () => {
      expect(normalizePresets(undefined)).toEqual(DEFAULT_PRESETS);
    });
    it('keeps known ids once, in order', () => {
      expect(normalizePresets(['last_year', 'bogus', 'today', 'last_year'])).toEqual(['last_year', 'today']);
    });
    it('allows an empty list', () => {
      expect(normalizePresets([])).toEqual([]);
    });
  });
});
