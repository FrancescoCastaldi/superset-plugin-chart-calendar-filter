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
import { ChartProps, supersetTheme } from '@superset-ui/core';
import transformProps from '../../src/plugin/transformProps';

describe('SupersetPluginChartCalendarFilter transformProps', () => {
  const formData = {
    colorScheme: 'supersetColors',
    datasource: '3__table',
    granularity_sqla: 'ds',
    groupby: ['ds'],
    metric: 'sum__num',
    showLegend: true,
    firstDayOfWeek: 1,
    showWeekNumbers: true,
    showYearDropdown: false,
    enableOverview: false,
    viz_type: 'calendar_filter',
  };
  const filterState = {
    value: null,
    selectedValues: null,
  };
  const setDataMask = jest.fn();
  const chartProps = new ChartProps({
    formData,
    width: 800,
    height: 600,
    theme: supersetTheme,
    queriesData: [{
      data: [
        { ds: '2024-01-01', sum__num: 10 },
        { ds: '2024-01-02', sum__num: 20 },
      ],
    }],
    hooks: { setDataMask },
    filterState,
  });

  it('should transform chart props for viz', () => {
    expect(transformProps(chartProps)).toEqual({
      width: 800,
      height: 600,
      colorScheme: 'supersetColors',
      showLegend: true,
      firstDayOfWeek: 1,
      showWeekNumbers: true,
      showYearDropdown: false,
      enableOverview: false,
      cellDensity: 'compact',
      data: [
        { ds: '2024-01-01', sum__num: 10 },
        { ds: '2024-01-02', sum__num: 20 },
      ],
      setDataMask,
      filterState,
      dateColumn: 'ds',
    });
  });

  it('should use defaults when formData is partial', () => {
    const minimalFormData = {
      datasource: '3__table',
      granularity_sqla: 'ds',
      groupby: ['ds'],
      metric: 'sum__num',
      viz_type: 'calendar_filter',
    };
    const minimalProps = new ChartProps({
      formData: minimalFormData,
      width: 400,
      height: 300,
      theme: supersetTheme,
      queriesData: [{
        data: [{ ds: '2024-01-01', sum__num: 10 }],
      }],
      hooks: { setDataMask: jest.fn() },
      filterState: { value: null },
    });
    const result = transformProps(minimalProps);
    expect(result.firstDayOfWeek).toBe(0);
    expect(result.showWeekNumbers).toBe(false);
    expect(result.showYearDropdown).toBe(true);
    expect(result.enableOverview).toBe(true);
    expect(result.dateColumn).toBe('ds');
    expect(result.filterState).toEqual({ value: null });
    expect(typeof result.setDataMask).toBe('function');
  });

  it('should handle empty queriesData without crashing', () => {
    const emptyProps = new ChartProps({
      formData: {
        colorScheme: 'supersetColors',
        datasource: '3__table',
        granularity_sqla: 'ds',
        groupby: ['ds'],
        metric: 'sum__num',
        viz_type: 'calendar_filter',
      },
      width: 400,
      height: 300,
      theme: supersetTheme,
      queriesData: [],
    });
    const result = transformProps(emptyProps);
    expect(result.data).toEqual([]);
    expect(result.dateColumn).toBe('ds');
    expect(typeof result.setDataMask).toBe('function');
  });
});
