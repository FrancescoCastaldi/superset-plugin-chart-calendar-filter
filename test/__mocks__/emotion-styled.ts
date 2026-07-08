// Mock for @emotion/styled

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

  // Handle simple CSS props used in our components
  if (css.includes('height')) styles.height = props.height;
  if (css.includes('width')) styles.width = props.width;
  if (css.includes('display: flex')) styles.display = 'flex';
  if (css.includes('flex-direction: column')) styles.flexDirection = 'column';
  if (css.includes('overflow: hidden')) styles.overflow = 'hidden';
  if (css.includes('flex-shrink: 0')) styles.flexShrink = 0;
  if (css.includes('align-content: start')) styles.alignContent = 'start';
  if (css.includes('background-color')) styles.backgroundColor = '#f0f0f0';
  if (css.includes('border-radius')) styles.borderRadius = '8px';
  if (css.includes('padding')) styles.padding = '8px';
  if (css.includes('gap')) styles.gap = '4px';
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
  if (css.includes('font-family')) styles.fontFamily = 'sans-serif';

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

export default styled;
