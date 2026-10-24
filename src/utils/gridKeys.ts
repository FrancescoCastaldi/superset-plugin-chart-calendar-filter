import type React from 'react';
import { addDays } from './dateUtils';

const STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

/**
 * Keyboard handling shared by the day grids: Enter/Space select the focused day,
 * the arrow keys move the focus by a day or a week. Attach it to the grid element;
 * day cells carry their date in `data-date`.
 */
export function handleGridKeyDown(
  event: React.KeyboardEvent<HTMLElement>,
  onActivate: (date: string) => void,
): void {
  const date = (event.target as HTMLElement | null)?.dataset?.date;
  if (!date) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onActivate(date);
    return;
  }
  const step = STEPS[event.key];
  if (step === undefined) return;
  event.preventDefault();
  event.currentTarget.querySelector<HTMLElement>(`[data-date="${addDays(date, step)}"]`)?.focus();
}

/**
 * The one day of a grid that is reachable with Tab (roving tabindex), so a year
 * of days does not become 365 tab stops: first selected day, else today, else the first day.
 */
export function pickTabStop(dates: string[], selected: Set<string>, today: string): string | undefined {
  const firstSelected = dates.filter(d => selected.has(d)).sort()[0];
  if (firstSelected) return firstSelected;
  return dates.includes(today) ? today : dates[0];
}
