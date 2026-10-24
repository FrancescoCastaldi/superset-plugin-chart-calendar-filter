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
import React, { memo } from 'react';
import { MacroBar, MacroButton } from '../styles/CalendarFilter.styles';
import { useCalendarDisplay } from '../utils/labels';
import type { PresetId } from '../utils/presets';

interface MacroShortcutsProps {
  viewYear: number;
  selectedCount: number;
  onSelectYear: () => void;
  onSelectCurrentMonth: () => void;
  onSelectQuarter: (quarter: 1 | 2 | 3 | 4) => void;
  onSelectWeekdays: () => void;
  onClear: () => void;
  /** Relative-date shortcuts to show after the fixed ones */
  presets?: PresetId[];
  onSelectPreset?: (preset: PresetId) => void;
}

const QUARTERS = [1, 2, 3, 4] as const;

/** Shortcut bar (year, month, quarters, working days, relative periods, clear) */
const MacroShortcuts = memo(function MacroShortcuts({
  viewYear,
  selectedCount,
  onSelectYear,
  onSelectCurrentMonth,
  onSelectQuarter,
  onSelectWeekdays,
  onClear,
  presets = [],
  onSelectPreset,
}: MacroShortcutsProps) {
  const { labels } = useCalendarDisplay();
  return (
    <MacroBar>
      <MacroButton type="button" onClick={onSelectYear}>
        {labels.yearShortcut(viewYear)}
      </MacroButton>
      <MacroButton type="button" onClick={onSelectCurrentMonth}>
        {labels.currentMonth}
      </MacroButton>
      {QUARTERS.map(q => (
        <MacroButton key={q} type="button" onClick={() => onSelectQuarter(q)}>
          {`📊 Q${q}`}
        </MacroButton>
      ))}
      <MacroButton type="button" onClick={onSelectWeekdays}>
        {labels.workdays}
      </MacroButton>
      {onSelectPreset &&
        presets.map(id => (
          <MacroButton key={id} type="button" onClick={() => onSelectPreset(id)}>
            🕒 {labels.presets[id]}
          </MacroButton>
        ))}
      {selectedCount > 0 && (
        <MacroButton type="button" $tone="danger" onClick={onClear}>
          ❌ {labels.clear} ({selectedCount})
        </MacroButton>
      )}
    </MacroBar>
  );
});

export default MacroShortcuts;
