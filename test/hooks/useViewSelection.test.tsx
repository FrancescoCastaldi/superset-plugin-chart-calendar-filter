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

import { useViewSelection } from '../../src/hooks/useViewSelection';
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

describe('useViewSelection', () => {
  const emitSelection = jest.fn();
  const setViewYear = jest.fn();
  const setViewMonth = jest.fn();

  beforeEach(() => {
    emitSelection.mockClear();
    setViewYear.mockClear();
    setViewMonth.mockClear();
  });

  it('month selection updates the view month and emits the month range', () => {
    const { result } = renderHook(() =>
      useViewSelection('month', 2026, 12, setViewYear, setViewMonth, emitSelection),
    );

    result.current.handleMonthSelectChange(3);

    expect(setViewMonth).toHaveBeenCalledWith(3);
    expect(emitSelection).toHaveBeenCalledWith(getDatesInMonth(2026, 3));
  });

  it('year selection in month view emits the month range of the new year', () => {
    const { result } = renderHook(() =>
      useViewSelection('month', 2026, 7, setViewYear, setViewMonth, emitSelection),
    );

    result.current.handleYearSelectChange(2025);

    expect(setViewYear).toHaveBeenCalledWith(2025);
    expect(emitSelection).toHaveBeenCalledWith(getDatesInMonth(2025, 7));
  });

  it('year selection in year view emits the entire year range', () => {
    const { result } = renderHook(() =>
      useViewSelection('year', 2026, 7, setViewYear, setViewMonth, emitSelection),
    );

    result.current.handleYearSelectChange(2027);

    expect(setViewYear).toHaveBeenCalledWith(2027);
    expect(emitSelection).toHaveBeenCalledWith(getDatesInYear(2027));
  });
});
