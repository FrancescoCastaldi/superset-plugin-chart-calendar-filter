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
import { t } from '@apache-superset/core/translation';
import { validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        [
          {
            name: 'groupby',
            config: {
              ...sharedControls.groupby,
              label: t('Column'),
              description: t('The column to use for calendar aggregation'),
              multi: false,
              validators: [validateNonEmpty],
            },
          },
        ],
        ['adhoc_filters'],
      ],
    },
    {
      label: t('Calendar Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'color_scheme',
            config: {
              type: 'SelectControl',
              label: t('Color Scheme'),
              default: 'supersetColors',
              choices: [
                ['supersetColors', 'Superset Default'],
                ['greens', 'Greens'],
                ['blues', 'Blues'],
                ['oranges', 'Oranges'],
                ['reds', 'Reds'],
                ['purples', 'Purples'],
              ],
              renderTrigger: true,
              description: t('Color scheme for the calendar heatmap'),
            },
          },
        ],
        [
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Show Legend'),
              renderTrigger: true,
              default: true,
              description: t('Show or hide the color legend'),
            },
          },
        ],
        [
          {
            name: 'show_week_numbers',
            config: {
              type: 'CheckboxControl',
              label: t('Show Week Numbers'),
              renderTrigger: true,
              default: false,
              description: t('Display ISO week numbers on the left side of each row'),
            },
          },
        ],
        [
          {
            name: 'first_day_of_week',
            config: {
              type: 'SelectControl',
              label: t('First Day of Week'),
              default: 0,
              choices: [
                [0, 'Sunday'],
                [1, 'Monday'],
              ],
              renderTrigger: true,
              description: t('Which day to start the week on'),
            },
          },
        ],
        [
          {
            name: 'show_year_dropdown',
            config: {
              type: 'CheckboxControl',
              label: t('Show Year Dropdown'),
              renderTrigger: true,
              default: true,
              description: t('Show a dropdown to jump to any year'),
            },
          },
        ],
        [
          {
            name: 'enable_overview',
            config: {
              type: 'CheckboxControl',
              label: t('Enable Year Overview'),
              renderTrigger: true,
              default: true,
              description: t('Allow switching between single-month and full-year overview'),
            },
          },
        ],
        [
          {
            name: 'cell_density',
            config: {
              type: 'SelectControl',
              label: t('Cell Density'),
              default: 'compact',
              choices: [
                ['compact', 'Compact'],
                ['normal', 'Normal'],
              ],
              renderTrigger: true,
              description: t('Calendar cell size: Compact for tighter fit, Normal for larger cells'),
            },
          },
        ],
      ],
    },
    {
      label: t('Native Filter Settings'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'filter_type_mode',
            config: {
              type: 'SelectControl',
              label: t('Tipo di Filtro Emesso'),
              default: 'in_clause',
              choices: [
                ['in_clause', t('Date Discrete (IN su colonna)')],
                ['time_range', t('Filtro Tempo Nativo (time_range)')],
              ],
              renderTrigger: true,
              description: t('Scegli se emettere un intervallo temporale nativo o una lista di date discrete IN'),
            },
          },
        ],
        [
          {
            name: 'default_value_mode',
            config: {
              type: 'SelectControl',
              label: t('Valore di Default Iniziale'),
              default: 'none',
              choices: [
                ['none', t('Nessun Filtro (Tutte le date)')],
                ['today', t('Oggi')],
                ['current_month', t('Mese Corrente')],
                ['current_year', t('Anno Corrente')],
              ],
              renderTrigger: true,
              description: t('Selezione iniziale da applicare all\'apertura del filtro'),
            },
          },
        ],
        [
          {
            name: 'show_macro_shortcuts',
            config: {
              type: 'CheckboxControl',
              label: t('Mostra Scorciatoie Macro Filtri'),
              renderTrigger: true,
              default: true,
              description: t('Mostra pulsanti di selezione rapida (Anno, Mese, Trimestri Q1-Q4, Feriali)'),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    metric: {
      label: t('Metric'),
      description: t('Metric to display on the calendar heatmap'),
    },
    groupby: {
      ...sharedControls.groupby,
      label: t('Column'),
      description: t('The date column to use for calendar aggregation'),
      multi: false,
      validators: [validateNonEmpty],
    },
  },
};

export default config;
