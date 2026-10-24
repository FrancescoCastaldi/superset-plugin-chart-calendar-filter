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

import { useCalendarData, CalendarDataOptions } from '../../src/hooks/useCalendarData';

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

const TODAY = new Date(2026, 3, 15);

function run(data: Record<string, unknown>[], dateColumn: string | undefined, options: CalendarDataOptions = {}) {
  return renderHook(() => useCalendarData(data, dateColumn, 'greens', 2026, TODAY, options)).result.current;
}

describe('useCalendarData', () => {
  it('combines rows of the same day (sum by default)', () => {
    const { dataMap } = run(
      [
        { ts: '2026-04-01', amount: 10 },
        { ts: '2026-04-01', amount: 5 },
        { ts: '2026-04-02', amount: 7 },
      ],
      'ts',
    );
    expect(dataMap.map.get('2026-04-01')).toBe(15);
    expect(dataMap.map.get('2026-04-02')).toBe(7);
    expect(dataMap.max).toBe(15);
  });

  it.each([
    ['avg', 7.5],
    ['max', 10],
    ['min', 5],
    ['count', 2],
  ] as const)('aggregation %s', (aggregation, expected) => {
    const { dataMap } = run(
      [
        { ts: '2026-04-01', amount: 10 },
        { ts: '2026-04-01', amount: 5 },
      ],
      'ts',
      { aggregation },
    );
    expect(dataMap.map.get('2026-04-01')).toBe(expected);
  });

  it('uses the requested metric column, not the first numeric one', () => {
    const rows = [{ ts: '2026-04-01', rows: 3, revenue: 900 }];
    expect(run(rows, 'ts').dataMap.map.get('2026-04-01')).toBe(3);
    expect(run(rows, 'ts', { metricKey: 'revenue' }).dataMap.map.get('2026-04-01')).toBe(900);
  });

  it('counts rows when there is no metric column', () => {
    const { dataMap } = run([{ ts: '2026-04-01' }, { ts: '2026-04-01' }, { ts: '2026-04-03' }], 'ts');
    expect(dataMap.map.get('2026-04-01')).toBe(2);
    expect(dataMap.map.get('2026-04-03')).toBe(1);
  });

  it('finds the date column by content when the configured one is absent', () => {
    const { dataMap } = run([{ day: '2026-04-01', n: 4 }], 'order_date');
    expect(dataMap.map.get('2026-04-01')).toBe(4);
  });

  it('detects the date column when the first row has a null date', () => {
    const { dataMap } = run(
      [
        { day: null, n: 1 },
        { day: '2026-04-02', n: 6 },
      ],
      undefined,
    );
    expect(dataMap.map.get('2026-04-02')).toBe(6);
  });

  it('reports no data for an empty result', () => {
    const { dataMap, heatStyle } = run([], 'ts');
    expect(dataMap.hasData).toBe(false);
    expect(heatStyle(null, false)).toBeNull();
  });

  it('colors days with data and leaves the others neutral', () => {
    const { heatStyle } = run(
      [
        { ts: '2026-04-01', n: 0 },
        { ts: '2026-04-02', n: 100 },
      ],
      'ts',
    );
    expect(heatStyle(100, true)?.dark).toBe(true);
    expect(heatStyle(0, true)).not.toBeNull();
    expect(heatStyle(null, false)).toBeNull();
  });

  it('applies the chosen scale', () => {
    const rows = [
      { ts: '2026-04-01', n: 1 },
      { ts: '2026-04-02', n: 1000 },
    ];
    const linear = run(rows, 'ts').intensityScale(10);
    const log = run(rows, 'ts', { scaleType: 'log' }).intensityScale(10);
    expect(log).toBeGreaterThan(linear);
    const steps = run(rows, 'ts', { scaleType: 'steps', scaleThresholds: '5, 50' }).intensityScale(60);
    expect(steps).toBeCloseTo(1);
  });
});
