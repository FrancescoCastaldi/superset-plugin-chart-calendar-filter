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

import {
  buildIntensityScale,
  getHeatStyle,
  getPalette,
  parseThresholds,
} from '../../src/utils/colorScale';

describe('colorScale', () => {
  describe('buildIntensityScale', () => {
    it('is linear by default and clamps to [0, 1]', () => {
      const scale = buildIntensityScale(0, 100);
      expect(scale(0)).toBe(0);
      expect(scale(50)).toBe(0.5);
      expect(scale(100)).toBe(1);
      expect(scale(500)).toBe(1);
    });

    it('returns 0 for missing values and flat ranges', () => {
      expect(buildIntensityScale(0, 100)(null)).toBe(0);
      expect(buildIntensityScale(5, 5)(5)).toBe(0);
    });

    it('log lifts small values compared with linear', () => {
      const linear = buildIntensityScale(0, 1000, 'linear')(10);
      const log = buildIntensityScale(0, 1000, 'log')(10);
      expect(log).toBeGreaterThan(linear);
      expect(buildIntensityScale(0, 1000, 'log')(0)).toBe(0);
      expect(buildIntensityScale(0, 1000, 'log')(1000)).toBeCloseTo(1, 10);
    });

    it('sqrt lifts small values too', () => {
      expect(buildIntensityScale(0, 100, 'sqrt')(25)).toBe(0.5);
    });

    it('steps counts the thresholds reached', () => {
      const scale = buildIntensityScale(0, 1000, 'steps', [10, 50, 100]);
      expect(scale(5)).toBe(0);
      expect(scale(10)).toBeCloseTo(1 / 3);
      expect(scale(60)).toBeCloseTo(2 / 3);
      expect(scale(100)).toBe(1);
    });

    it('steps without thresholds behaves like linear', () => {
      expect(buildIntensityScale(0, 100, 'steps', [])(50)).toBe(0.5);
    });

    it('works with negative values', () => {
      expect(buildIntensityScale(-10, 10)(0)).toBe(0.5);
    });
  });

  describe('parseThresholds', () => {
    it('parses and sorts mixed separators', () => {
      expect(parseThresholds('100, 10; 50  5')).toEqual([5, 10, 50, 100]);
    });
    it('ignores junk and empty input', () => {
      expect(parseThresholds('a, ,10')).toEqual([10]);
      expect(parseThresholds('')).toEqual([]);
      expect(parseThresholds(null)).toEqual([]);
    });
  });

  describe('getHeatStyle', () => {
    const palette = getPalette('greens');

    it('is null without data so the cell stays neutral', () => {
      expect(getHeatStyle(palette, 0, false)).toBeNull();
    });

    it('shows a real zero with the first shade', () => {
      expect(getHeatStyle(palette, 0, true)).toEqual({ background: palette[0], dark: false });
    });

    it('uses the strongest shade with light text at full intensity', () => {
      expect(getHeatStyle(palette, 1, true)).toEqual({ background: palette[palette.length - 1], dark: true });
    });

    it('falls back to the default palette for an unknown scheme', () => {
      expect(getPalette('nope')).toEqual(getPalette('supersetColors'));
    });
  });
});
