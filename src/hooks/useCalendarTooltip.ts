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
import React, { useCallback, useState } from 'react';

import { CalendarDay, TooltipData } from '../types';

/**
 * Viewport coordinates for the tooltip anchor: horizontally centered on
 * the hovered cell, vertically at its top edge.
 */
export function computeTooltipPosition(element: HTMLElement): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top };
}

/**
 * Tooltip state for the calendar: tracks the hovered day and positions
 * the tooltip in viewport coordinates via `getBoundingClientRect`.
 */
export function useCalendarTooltip(
  intensityScale: (val: number | null) => number,
) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handleMouseEnter = useCallback(
    (cell: CalendarDay, event: React.MouseEvent) => {
      if (!cell.hasData) {
        setTooltip(null);
        return;
      }
      const { x, y } = computeTooltipPosition(event.currentTarget as HTMLElement);
      const pct = intensityScale(cell.value) * 100;

      setTooltip({
        date: cell.date,
        value: cell.value,
        percentage: Math.round(pct),
        x,
        y,
      });
    },
    [intensityScale],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return { tooltip, handleMouseEnter, handleMouseLeave };
}
