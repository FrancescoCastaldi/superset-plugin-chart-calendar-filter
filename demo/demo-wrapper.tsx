import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@emotion/react';
import CalendarFilter from '../src/CalendarFilter';
import { TimeseriesDataRecord, SetDataMaskHook } from '@superset-ui/core';

const theme = {
  gridUnit: 8,
  typography: {
    families: { sansSerif: '-apple-system, BlinkMacSystemFont, sans-serif' },
    sizes: { l: 16, m: 14, s: 12, xs: 10 },
    weights: { bold: 700 },
  },
  colors: {
    primary: { base: '#20A7C9', light2: '#8FD3E4' },
    secondary: { light1: '#F5F5F5', light2: '#F0F0F0' },
    grayscale: { base: '#000000', light1: '#333333', light2: '#666666' },
    error: '#E04355',
    text: { label: '#333', help: '#666' },
    warning: { base: '#FFD700', light2: '#FFF8E1' },
    alert: { base: '#FF6B6B', light2: '#FFE0E0' },
    success: { base: '#4CAF50', light2: '#E8F5E9' },
    info: { base: '#2196F3', light2: '#E3F2FD' },
  },
};

// Generate mock data for a full year (2026)
function generateMockData(): TimeseriesDataRecord[] {
  const data: TimeseriesDataRecord[] = [];
  const start = new Date(2026, 0, 1);
  const end = new Date(2026, 11, 31);
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 5 + Math.floor(Math.random() * 10) : 20 + Math.floor(Math.random() * 30);
    const seasonal = 1 + Math.sin((current.getMonth()) / 11 * Math.PI) * 0.5;
    const value = Math.round(baseValue * seasonal);

    data.push({
      __timestamp: current.getTime(),
      metric: Math.max(1, value),
    } as any);

    current.setDate(current.getDate() + 1);
  }
  return data;
}

const mockData = generateMockData();
const mockSetDataMask: SetDataMaskHook = (dataMask: any) => {
  console.log('setDataMask called:', JSON.stringify(dataMask));
};

// Self-rendering function
export function renderDemo(rootId: string = 'root', height: number = 700, width: number = 920) {
  const rootEl = document.getElementById(rootId);
  if (!rootEl) {
    console.error(`Element #${rootId} not found`);
    return;
  }

  ReactDOM.render(
    React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(CalendarFilter, {
        data: mockData,
        height,
        width,
        colorScheme: 'supersetColors',
        showLegend: true,
        firstDayOfWeek: 0,
        showWeekNumbers: true,
        showYearDropdown: true,
        enableOverview: true,
        setDataMask: mockSetDataMask,
        filterState: { value: null, selectedValues: null },
      })
    ),
    rootEl
  );
}
