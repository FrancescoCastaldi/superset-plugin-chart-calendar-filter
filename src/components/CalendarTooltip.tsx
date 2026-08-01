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
import {
  TooltipContainer,
  TooltipTitle,
  TooltipRow,
  TooltipLabel,
  TooltipValue,
} from '../styles/CalendarFilter.styles';
import { TooltipData } from '../types';

interface CalendarTooltipProps {
  tooltip: TooltipData;
  maxValue: number;
  /** Locale-format numeric values (full chart); raw values for the compact bar */
  formatNumbers?: boolean;
}

/** Hover tooltip showing date, value, max, and percentage of max */
export default function CalendarTooltip({
  tooltip,
  maxValue,
  formatNumbers = false,
}: CalendarTooltipProps) {
  const displayValue = formatNumbers
    ? tooltip.value?.toLocaleString() ?? 'N/D'
    : tooltip.value != null
      ? tooltip.value
      : 'N/D';
  const displayMax = formatNumbers ? maxValue.toLocaleString() : maxValue;

  return (
    <TooltipContainer x={tooltip.x} y={tooltip.y}>
      <TooltipTitle>{tooltip.date}</TooltipTitle>
      <TooltipRow>
        <TooltipLabel>Valore:</TooltipLabel>
        <TooltipValue>{displayValue}</TooltipValue>
      </TooltipRow>
      <TooltipRow>
        <TooltipLabel>Massimo:</TooltipLabel>
        <TooltipValue>{displayMax}</TooltipValue>
      </TooltipRow>
      <TooltipRow>
        <TooltipLabel>% del max:</TooltipLabel>
        <TooltipValue>{tooltip.percentage}%</TooltipValue>
      </TooltipRow>
    </TooltipContainer>
  );
}
