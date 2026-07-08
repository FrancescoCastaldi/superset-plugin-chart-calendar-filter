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
import {
  ControlPanelConfig,
  sections,
} from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['groupby'],
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
      ],
    },
  ],
  controlOverrides: {
    metric: {
      label: t('Metric'),
      description: t('Metric to display on the calendar heatmap'),
    },
    groupby: {
      label: t('Date column'),
      description: t('The date column to use for calendar aggregation'),
    },
  },
};

export default config;
