// Mock for @superset-ui/core

export const t = (str: string) => str;

export enum Behavior {
  InteractiveChart = 'INTERACTIVE_CHART',
  NativeFilter = 'NATIVE_FILTER',
  DrillToDetail = 'DRILL_TO_DETAIL',
  DrillBy = 'DRILL_BY',
}

export class ChartMetadata {
  description: string;
  name: string;
  thumbnail: any;
  behaviors?: Behavior[];

  constructor({ description, name, thumbnail, behaviors }: any) {
    this.description = description;
    this.name = name;
    this.thumbnail = thumbnail;
    this.behaviors = behaviors;
  }
}

export class ChartPlugin {
  metadata: ChartMetadata;
  buildQuery: any;
  controlPanel: any;
  loadChart: any;
  transformProps: any;

  constructor({ buildQuery, controlPanel, loadChart, metadata, transformProps }: any) {
    this.buildQuery = buildQuery;
    this.controlPanel = controlPanel;
    this.loadChart = loadChart;
    this.metadata = metadata;
    this.transformProps = transformProps;
  }
}

export class ChartProps {
  formData: any;
  width: number;
  height: number;
  theme: any;
  queriesData: any[];
  hooks: { setDataMask?: any; [key: string]: any };
  filterState?: any;
  emitCrossFilters?: boolean;

  constructor({ formData, width, height, theme, queriesData, hooks, filterState, emitCrossFilters }: any) {
    this.formData = formData;
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.queriesData = queriesData;
    this.hooks = hooks || {};
    this.filterState = filterState;
    this.emitCrossFilters = emitCrossFilters;
  }
}

export function buildQueryContext(formData: any, buildQueryFunction: (baseQueryObject: any) => any[]) {
  const baseQueryObject = {
    granularity: formData.granularity,
    granularity_sqla: formData.granularity_sqla,
    time_range: formData.time_range,
    time_grain_sqla: formData.time_grain_sqla,
    groupby: formData.groupby || formData.series,
    columns: formData.groupby || formData.series ? [].concat(formData.groupby || formData.series) : undefined,
  };
  return {
    queries: buildQueryFunction(baseQueryObject),
  };
}

export const supersetTheme = {
  colors: {
    primary: { base: '#20A7C9', light1: '#8FD3E4', dark1: '#147C99' },
    secondary: { base: '#444444', light1: '#888888', light2: '#BBBBBB', dark1: '#222222' },
  },
  gridUnit: 4,
  typography: {
    sizes: { xxs: 10, xs: 12, s: 14, m: 16, l: 20, xl: 24, xxl: 30 },
    weights: { light: 300, normal: 400, bold: 700 },
  },
};

// Use React directly for styled components in tests
import React from 'react';

function createStyledComponent(tag: any) {
  const tagged = (strings: TemplateStringsArray, ...values: any[]) => {
    const styles = strings.reduce((acc: string, str: string, i: number) => {
      return acc + str + (values[i] !== undefined ? (typeof values[i] === 'function' ? '{...}' : String(values[i])) : '');
    }, '');
    const StyledComponent = React.forwardRef((props: any, ref: any) => {
      const { children, ...rest } = props;
      // Filter out styled-specific props that shouldn't be passed to DOM
      const domProps: any = {};
      for (const key of Object.keys(rest)) {
        if (['theme', 'as', 'forwardedRef', 'isSelected', 'isCurrentMonth', 'baseColor', 'intensity', 'showWeekNumbers', 'firstDayOfWeek', 'showYearDropdown', 'enableOverview'].includes(key)) continue;
        domProps[key] = rest[key];
      }
      if (ref) domProps.ref = ref;
      // Pass through children only if they are valid React nodes
      const validChildren = children != null && typeof children !== 'boolean' ? children : undefined;
      return React.createElement(tag, { ...domProps, style: { ...(domProps.style || {}), ...parseStyles(styles, props) } }, validChildren);
    });
    (StyledComponent as any).withConfig = () => tagged;
    return StyledComponent;
  };
  tagged.withConfig = () => tagged;
  return tagged;
}

// Minimal CSS-like parser for theme properties
function parseStyles(css: string, props: any): Record<string, any> {
  const styles: Record<string, any> = {};
  const theme = props.theme || { gridUnit: 4, colors: {}, typography: { sizes: {}, weights: {} } };
  
  // Handle simple CSS props used in our components
  if (css.includes('height')) styles.height = props.height;
  if (css.includes('width')) styles.width = props.width;
  if (css.includes('display: flex')) styles.display = 'flex';
  if (css.includes('flex-direction: column')) styles.flexDirection = 'column';
  if (css.includes('overflow: hidden')) styles.overflow = 'hidden';
  if (css.includes('flex-shrink: 0')) styles.flexShrink = 0;
  if (css.includes('align-content: start')) styles.alignContent = 'start';
  if (css.includes('background-color')) styles.backgroundColor = '#f0f0f0';
  if (css.includes('border-radius')) styles.borderRadius = `${theme.gridUnit * 2}px`;
  if (css.includes('padding')) styles.padding = `${theme.gridUnit * 2}px`;
  if (css.includes('gap')) styles.gap = `${theme.gridUnit}px`;
  if (css.includes('align-items: center')) styles.alignItems = 'center';
  if (css.includes('justify-content: center')) styles.justifyContent = 'center';
  if (css.includes('justify-content: space-between')) styles.justifyContent = 'space-between';
  if (css.includes('text-align: center')) styles.textAlign = 'center';
  if (css.includes('text-transform: uppercase')) styles.textTransform = 'uppercase';
  if (css.includes('position: relative')) styles.position = 'relative';
  if (css.includes('cursor: pointer')) styles.cursor = 'pointer';
  if (css.includes('cursor: default')) styles.cursor = 'default';
  if (css.includes('aspect-ratio: 1')) styles.aspectRatio = '1';
  if (css.includes('pointer-events: none')) styles.pointerEvents = 'none';
  if (css.includes('z-index: 1')) styles.zIndex = 1;
  
  // Handle grid
  if (css.includes('grid-template-columns')) {
    styles.display = 'grid';
    if (css.includes('30px')) {
      styles.gridTemplateColumns = '30px repeat(7, 1fr)';
    } else {
      styles.gridTemplateColumns = 'repeat(7, 1fr)';
    }
  }
  
  return styles;
}

// Support both styled('div') and styled.div
const styled = new Proxy(createStyledComponent as any, {
  get(target: any, tag: string) {
    return createStyledComponent(tag);
  },
  apply(target: any, thisArg: any, args: any[]) {
    return createStyledComponent(args[0]);
  },
}) as any;

export { styled };

export interface DataMask {
  extraFormData?: any;
  filterState?: {
    value?: any;
    selectedValues?: Record<string, any>;
    [key: string]: any;
  };
  ownState?: any;
}

export type SetDataMaskHook = (dataMask: DataMask) => void;
export type QueryFormData = any;
export type TimeseriesDataRecord = any;
export type BinaryQueryObjectFilterClause = any;
