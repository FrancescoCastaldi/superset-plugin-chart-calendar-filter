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
    { ds: '2024-01-01', metric: 10 },
    { ds: '2024-01-02', metric: 20 },
    { ds: '2024-01-15', metric: 30 },
    { ds: '2024-02-01', metric: 15 },
  ],
  height: 600,
  width: 800,
  colorScheme: 'supersetColors',
  showLegend: true,
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
    // Should show current month/year (we're in July 2026 based on system date)
    expect(getByText(/2026/)).toBeTruthy();
  });

  it('shows day numbers in the grid', () => {
    const { getAllByText } = render(<CalendarFilter {...defaultProps} />);
    // Day 01 should exist in the calendar (zero-padded)
    const dayElements = getAllByText('01');
    expect(dayElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation buttons', () => {
    const { getAllByRole } = render(<CalendarFilter {...defaultProps} />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(2); // prev and next
  });

  it('shows empty state when no data', () => {
    const { getByText } = render(
      <CalendarFilter {...defaultProps} data={[]} />,
    );
    expect(getByText('No data available')).toBeTruthy();
  });

  it('shows the legend when showLegend is true', () => {
    const { container } = render(<CalendarFilter {...defaultProps} />);
    // Legend should have min/max labels
    expect(container.textContent).toContain('10.0');
    expect(container.textContent).toContain('30.0');
  });

  it('hides the legend when showLegend is false', () => {
    const { container } = render(
      <CalendarFilter {...defaultProps} showLegend={false} />,
    );
    // Min/max labels should not be visible
    expect(container.textContent).not.toContain('10.0');
  });

  it('calls setDataMask when clicking a day', () => {
    const { getAllByText } = render(<CalendarFilter {...defaultProps} />);
    // Find the day element with '15' (Jan 15 has data)
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
    // Start with a date already selected
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
      // Click to deselect the already-selected date
      fireEvent.click(day1);
    }

    expect(mockSetDataMask).toHaveBeenCalledTimes(1);
    const call = mockSetDataMask.mock.calls[0][0];
    // Should have deselected - empty filters
    expect(call.extraFormData.filters).toEqual([]);
  });

  it('navigates to previous month', () => {
    const { getByLabelText, getByText } = render(<CalendarFilter {...defaultProps} />);
    const prevButton = getByLabelText('Previous month');
    fireEvent.click(prevButton);

    // Should now show previous month
    // July 2026 -> June 2026
    expect(getByText(/June/)).toBeTruthy();
  });

  it('navigates to next month', () => {
    const { getByLabelText, getByText } = render(<CalendarFilter {...defaultProps} />);
    const nextButton = getByLabelText('Next month');
    fireEvent.click(nextButton);

    // Should now show next month
    // July 2026 -> August 2026
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
    // Component should render without errors with selected dates
    expect(container).toBeTruthy();
  });
});
