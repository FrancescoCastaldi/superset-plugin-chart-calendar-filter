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

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '@apache-superset/core/translation' {
  export function t(input: string, ...args: unknown[]): string;
  export function tn(key: string, ...args: unknown[]): string;
  export function configure(config?: unknown): void;
  export function addTranslation(key: string, value: string): void;
  export function addTranslations(translations: Record<string, string>): void;
  export function addLocaleData(data: unknown): void;
  export function resetTranslation(): void;
}
