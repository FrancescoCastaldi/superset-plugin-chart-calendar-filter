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
import { render, act } from '@testing-library/react';

import {
  computeTooltipPosition,
  useCalendarTooltip,
} from '../../src/hooks/useCalendarTooltip';
import { CalendarDay } from '../../src/types';

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

function makeElement(rect: { left: number; top: number; width: number }) {
  return {
    getBoundingClientRect: () => ({ ...rect, height: 20, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) }),
  } as unknown as HTMLElement;
}

function makeEvent(element: HTMLElement) {
  return { currentTarget: element } as unknown as React.MouseEvent;
}

describe('computeTooltipPosition', () => {
  it('centers the anchor horizontally on the cell and aligns to its top', () => {
    const element = makeElement({ left: 100, top: 50, width: 40 });
    expect(computeTooltipPosition(element)).toEqual({ x: 120, y: 50 });
  });

  it('returns the exact rect position for a zero-width cell', () => {
    const element = makeElement({ left: 10, top: 200, width: 0 });
    expect(computeTooltipPosition(element)).toEqual({ x: 10, y: 200 });
  });
});

describe('useCalendarTooltip', () => {
  const dataCell: CalendarDay = { date: '2026-12-01', value: 5, hasData: true };
  const emptyCell: CalendarDay = { date: '2026-12-02', value: null, hasData: false };
  // linear scale: value 5 / max 10 -> 50%
  const intensityScale = (val: number | null) => (val == null ? 0 : val / 10);

  it('positions the tooltip from getBoundingClientRect and computes the percentage', () => {
    const { result } = renderHook(() => useCalendarTooltip(intensityScale));
    const element = makeElement({ left: 100, top: 50, width: 40 });

    act(() => {
      result.current.handleMouseEnter(dataCell, makeEvent(element));
    });

    expect(result.current.tooltip).toEqual({
      date: '2026-12-01',
      value: 5,
      percentage: 50,
      x: 120,
      y: 50,
    });
  });

  it('clears the tooltip when hovering a day without data', () => {
    const { result } = renderHook(() => useCalendarTooltip(intensityScale));
    const element = makeElement({ left: 100, top: 50, width: 40 });

    act(() => {
      result.current.handleMouseEnter(dataCell, makeEvent(element));
    });
    act(() => {
      result.current.handleMouseEnter(emptyCell, makeEvent(element));
    });

    expect(result.current.tooltip).toBeNull();
  });

  it('clears the tooltip on mouse leave', () => {
    const { result } = renderHook(() => useCalendarTooltip(intensityScale));
    const element = makeElement({ left: 100, top: 50, width: 40 });

    act(() => {
      result.current.handleMouseEnter(dataCell, makeEvent(element));
    });
    act(() => {
      result.current.handleMouseLeave();
    });

    expect(result.current.tooltip).toBeNull();
  });

  it('rounds the intensity percentage', () => {
    const { result } = renderHook(() => useCalendarTooltip(intensityScale));
    const element = makeElement({ left: 0, top: 0, width: 0 });
    const cell: CalendarDay = { date: '2026-12-03', value: 3.333, hasData: true };

    act(() => {
      result.current.handleMouseEnter(cell, makeEvent(element));
    });

    expect(result.current.tooltip?.percentage).toBe(33);
  });
});
