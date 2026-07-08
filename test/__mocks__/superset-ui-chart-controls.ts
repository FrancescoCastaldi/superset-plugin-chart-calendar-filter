// Mock for @superset-ui/chart-controls

export const t = (str: string) => str;

export const sections = {
  legacyTimeseriesTime: {
    label: 'Time',
    expanded: true,
    controlSetRows: [],
  },
};

export const sharedControls = {
  groupby: {
    type: 'SelectControl' as const,
    label: 'Group by',
    description: 'Columns to group by',
    multi: true,
    freeForm: true,
  },
  metrics: {
    type: 'MetricsControl' as const,
    label: 'Metrics',
    description: 'Metrics to display',
    multi: true,
  },
  metric: {
    type: 'MetricsControl' as const,
    label: 'Metric',
    description: 'Metric to display',
    multi: false,
  },
  row_limit: {
    type: 'SelectControl' as const,
    label: 'Row limit',
    default: 10000,
  },
};

export function getStandardizedControls() {
  return {
    controls: [],
    setControls: (controls: any[]) => {},
  };
}

export type ControlPanelConfig = any;
