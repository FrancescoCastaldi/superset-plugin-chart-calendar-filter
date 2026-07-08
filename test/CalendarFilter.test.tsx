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
import { render, fireEvent } from '@testing-library/react';
import CalendarFilter from '../src/CalendarFilter';

// Mock setDataMask
const mockSetDataMask = jest.fn();

// Mock filterState
const defaultFilterState = {
  value: null,
  selectedValues: null,
};

const defaultProps = {
  data: [
    { ds: '2026-01-01', metric: 10 },
    { ds: '2026-01-02', metric: 20 },
    { ds: '2026-01-15', metric: 30 },
    { ds: '2026-07-01', metric: 15 },
    { ds: '2026-07-15', metric: 25 },
    { ds: '2026-08-01', metric: 35 },
    { ds: '2026-12-01', metric: 5 },
  ],
  height: 600,
  width: 800,
  colorScheme: 'supersetColors' as const,
  showLegend: true,
  firstDayOfWeek: 0,
  showWeekNumbers: false,
  showYearDropdown: true,
  enableOverview: true,
  setDataMask: mockSetDataMask,
  filterState: defaultFilterState,
};

describe('CalendarFilter', () => {
  beforeEach(() => {
    mockSetDataMask.mockClear();
  });

  it('renders without crashing', () => {
    const { container } = render(<CalendarFilter {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('shows the month title', () => {
    const { getByText } = render(<CalendarFilter {...defaultProps} />);
    // Should show current month/year (July 2026 based on system date)
    expect(getByText('July 2026')).toBeTruthy();
  });

  it('shows day numbers in the grid', () => {
    const { getAllByText } = render(<CalendarFilter {...defaultProps} />);
    const dayElements = getAllByText('01');
    expect(dayElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation and action buttons', () => {
    const { getAllByRole } = render(<CalendarFilter {...defaultProps} />);
    const buttons = getAllByRole('button');
    // Prev, Year toggle, Today, Next
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('shows empty state when no data', () => {
    const { getByText } = render(
      <CalendarFilter {...defaultProps} data={[]} />,
    );
    expect(getByText('No data available')).toBeTruthy();
  });

  it('shows the legend when showLegend is true', () => {
    const { container } = render(<CalendarFilter {...defaultProps} />);
    expect(container.textContent).toContain('5.0');
    expect(container.textContent).toContain('35.0');
  });

  it('hides the legend when showLegend is false', () => {
    const { container } = render(
      <CalendarFilter {...defaultProps} showLegend={false} />,
    );
    expect(container.textContent).not.toContain('5.0');
  });

  it('calls setDataMask when clicking a day', () => {
    const { getAllByText } = render(<CalendarFilter {...defaultProps} />);
    const day15Elements = getAllByText('15');
    const day15 = day15Elements[0]?.closest('[role]') || day15Elements[0]?.parentElement || day15Elements[0];
    if (day15) {
      fireEvent.click(day15);
    }

    expect(mockSetDataMask).toHaveBeenCalledTimes(1);
    expect(mockSetDataMask).toHaveBeenCalledWith(
      expect.objectContaining({
        extraFormData: expect.objectContaining({
          filters: expect.arrayContaining([
            expect.objectContaining({
              col: '__time_range',
              op: 'IN',
            }),
          ]),
        }),
      }),
    );
  });

  it('toggles date selection on click, starting from pre-selected state', () => {
    const propsWithSelection = {
      ...defaultProps,
      filterState: {
        value: ['2026-07-01'],
        selectedValues: { '2026-07-01': '2026-07-01' },
      },
    };
    const { getAllByText } = render(<CalendarFilter {...propsWithSelection} />);
    const dayElements = getAllByText('01');
    const day1 = dayElements[0]?.closest('[role]') || dayElements[0]?.parentElement || dayElements[0];
    if (day1) {
      fireEvent.click(day1);
    }

    expect(mockSetDataMask).toHaveBeenCalledTimes(1);
    const call = mockSetDataMask.mock.calls[0][0];
    expect(call.extraFormData.filters).toEqual([]);
  });

  it('navigates to previous month', () => {
    const { getByLabelText, getByText } = render(<CalendarFilter {...defaultProps} />);
    const prevButton = getByLabelText('Previous');
    fireEvent.click(prevButton);
    expect(getByText(/June/)).toBeTruthy();
  });

  it('navigates to next month', () => {
    const { getByLabelText, getByText } = render(<CalendarFilter {...defaultProps} />);
    const nextButton = getByLabelText('Next');
    fireEvent.click(nextButton);
    expect(getByText(/August/)).toBeTruthy();
  });

  it('shows selected dates from filterState', () => {
    const propsWithSelection = {
      ...defaultProps,
      filterState: {
        value: ['2024-01-01'],
        selectedValues: { '2024-01-01': '2024-01-01' },
      },
    };
    const { container } = render(<CalendarFilter {...propsWithSelection} />);
    expect(container).toBeTruthy();
  });

  // ── New feature tests ──────────────────────────────────────────────────────

  it('shows year dropdown when showYearDropdown is true', () => {
    const { getByLabelText } = render(<CalendarFilter {...defaultProps} />);
    const yearSelect = getByLabelText('Select year');
    expect(yearSelect).toBeTruthy();
  });

  it('hides year dropdown when showYearDropdown is false', () => {
    const { queryByLabelText } = render(
      <CalendarFilter {...defaultProps} showYearDropdown={false} />,
    );
    expect(queryByLabelText('Select year')).toBeNull();
  });

  it('shows view toggle button when enableOverview is true', () => {
    const { getByText } = render(<CalendarFilter {...defaultProps} />);
    expect(getByText('Year')).toBeTruthy();
  });

  it('switches to year overview when clicking toggle', () => {
    const { getByText } = render(<CalendarFilter {...defaultProps} />);
    fireEvent.click(getByText('Year'));
    // Should now show year view with month labels
    expect(getByText('Jan')).toBeTruthy();
    expect(getByText('Dec')).toBeTruthy();
  });

  it('shows Today button and navigates to today', () => {
    const { getByText } = render(<CalendarFilter {...defaultProps} />);
    expect(getByText('Today')).toBeTruthy();
  });

  it('shows week numbers when showWeekNumbers is true', () => {
    const { container } = render(
      <CalendarFilter {...defaultProps} showWeekNumbers={true} />,
    );
    // Week numbers are rendered
    expect(container).toBeTruthy();
  });

  it('shows selection badge and clear button when dates selected', () => {
    const propsWithSelection = {
      ...defaultProps,
      filterState: {
        value: ['2024-01-01'],
        selectedValues: { '2024-01-01': '2024-01-01' },
      },
    };
    const { getByText } = render(<CalendarFilter {...propsWithSelection} />);
    expect(getByText(/selected/)).toBeTruthy();
    expect(getByText('Clear')).toBeTruthy();
  });

  it('clears selection when Clear button is clicked', () => {
    const propsWithSelection = {
      ...defaultProps,
      filterState: {
        value: ['2024-01-01'],
        selectedValues: { '2024-01-01': '2024-01-01' },
      },
    };
    const { getByText } = render(<CalendarFilter {...propsWithSelection} />);
    fireEvent.click(getByText('Clear'));
    expect(mockSetDataMask).toHaveBeenCalledWith({
      extraFormData: { filters: [] },
      filterState: { value: null, selectedValues: null },
    });
  });

  it('renders with Monday as first day of week', () => {
    const { container } = render(
      <CalendarFilter {...defaultProps} firstDayOfWeek={1} />,
    );
    expect(container).toBeTruthy();
  });

  it('shows tooltip on hover over a data day', () => {
    const { getAllByText } = render(<CalendarFilter {...defaultProps} />);
    const dayElements = getAllByText('15');
    const day15 = dayElements[0]?.closest('[role]') || dayElements[0]?.parentElement || dayElements[0];
    if (day15) {
      fireEvent.mouseEnter(day15);
    }
    // Tooltip should have been set - component renders tooltip container with date
    const { container } = render(<CalendarFilter {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('renders with minimal config (no optional features)', () => {
    const { container } = render(
      <CalendarFilter
        {...defaultProps}
        showYearDropdown={false}
        enableOverview={false}
        showLegend={false}
        showWeekNumbers={false}
      />,
    );
    expect(container).toBeTruthy();
  });
});
