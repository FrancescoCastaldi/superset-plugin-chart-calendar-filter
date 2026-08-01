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
import { MacroBar, MacroButton } from '../styles/CalendarFilter.styles';

interface MacroShortcutsProps {
  viewYear: number;
  selectedCount: number;
  onSelectYear: () => void;
  onSelectCurrentMonth: () => void;
  onSelectQuarter: (quarter: 1 | 2 | 3 | 4) => void;
  onSelectWeekdays: () => void;
  onClear: () => void;
}

/** Macro filter shortcut bar (year, current month, quarters, weekdays, clear) */
export default function MacroShortcuts({
  viewYear,
  selectedCount,
  onSelectYear,
  onSelectCurrentMonth,
  onSelectQuarter,
  onSelectWeekdays,
  onClear,
}: MacroShortcutsProps) {
  return (
    <MacroBar>
      <MacroButton type="button" onClick={onSelectYear}>
        🎯 Anno {viewYear}
      </MacroButton>
      <MacroButton type="button" onClick={onSelectCurrentMonth}>
        📅 Mese Corrente
      </MacroButton>
      <MacroButton type="button" onClick={() => onSelectQuarter(1)}>
        📊 Q1
      </MacroButton>
      <MacroButton type="button" onClick={() => onSelectQuarter(2)}>
        📊 Q2
      </MacroButton>
      <MacroButton type="button" onClick={() => onSelectQuarter(3)}>
        📊 Q3
      </MacroButton>
      <MacroButton type="button" onClick={() => onSelectQuarter(4)}>
        📊 Q4
      </MacroButton>
      <MacroButton type="button" onClick={onSelectWeekdays}>
        💼 Feriali
      </MacroButton>
      {selectedCount > 0 && (
        <MacroButton type="button" onClick={onClear} style={{ color: '#e74c3c', borderColor: '#f5c6cb' }}>
          ❌ Azzera ({selectedCount})
        </MacroButton>
      )}
    </MacroBar>
  );
}
