import styled from '@emotion/styled';
import { CalendarFilterStylesProps } from '../types';

export const Styles = styled.div<CalendarFilterStylesProps>`
  height: ${({ height }) => (height && height > 120 ? `${height}px` : 'auto')};
  min-height: ${({ height }) => (height && height > 120 ? `${height}px` : '36px')};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme?.typography?.families?.sansSerif || 'sans-serif'};
  overflow: hidden;
  position: relative;
  padding-bottom: 116px;
`;

export const NativeFilterTriggerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px 0;
`;

export const NativeFilterPillButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  &:hover {
    border-color: #2563eb;
    color: #1d4ed8;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
  }
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 6px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const NavButton = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e2e8f0')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  padding: 6px 12px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => (theme?.colors?.secondary?.light1 ?? '#f8fafc')};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#f1f5f9')};
  }
`;

export const TodayButton = styled.button`
  background: white;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e2e8f0')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  line-height: 1.2;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => (theme?.colors?.secondary?.light1 ?? '#f8fafc')};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const MonthTitle = styled.div`
  font-size: ${({ theme }) => (theme?.typography?.sizes?.l ?? 14)}px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  white-space: nowrap;
`;

export const SelectionBadge = styled.span`
  font-size: 10px;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  background: ${({ theme }) => (theme?.colors?.primary?.light2 ?? '#e0f5e8')};
  padding: 0 8px;
  border-radius: 10px;
  white-space: nowrap;
  line-height: 20px;
`;

export const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 10px;
  color: ${({ theme }) => theme?.colors?.error?.base || '#e74c3c'};
  text-decoration: underline;
  padding: 0;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme?.colors?.error?.dark1 || '#c0392b'};
  }
`;

export const YearSelect = styled.select`
  font-size: 11px;
  padding: 3px 6px;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  cursor: pointer;
`;

export const MonthSelect = styled.select`
  font-size: 11px;
  padding: 3px 6px;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: 4px;
  background: white;
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  cursor: pointer;
`;

export const ViewToggleButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  padding: 4px 8px;
  line-height: 1;
  color: ${({ theme }) => (theme?.colors?.primary?.base ?? '#40c463')};
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => (theme?.colors?.secondary?.light2 ?? '#e8e8e8')};
  }
`;

export const CalendarGrid = styled.div<{ showWeekNumbers: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }) =>
    showWeekNumbers ? '24px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  gap: 1px;
  padding: 0 8px 8px;
  flex: 1;
  align-content: start;
`;

export const DayHeader = styled.div`
  text-align: center;
  font-size: 9px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.base ?? '#666'};
  padding: 4px 0;
  text-transform: uppercase;
`;

export const WeekNumberCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#bbb'};
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
`;

export interface DayCellProps {
  intensity: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  $isToday: boolean;
  baseColor: string;
  $cellHeight: number;
}

export const DayCell = styled.div<DayCellProps>`
  height: ${({ $cellHeight }) => $cellHeight}px;
  width: 100%;
  min-width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 11px;
  cursor: ${({ isCurrentMonth }) => (isCurrentMonth ? 'pointer' : 'default')};
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.3)};
  transition: all 0.2s ease;
  position: relative;
  user-select: none;

  background-color: ${({ isSelected, baseColor }) => {
    if (isSelected) return `${baseColor}35`;
    return '#ffffff';
  }};
  border: 1px solid ${({ isSelected, baseColor }) => (isSelected ? baseColor : '#e2e8f0')};

  ${({ isSelected, baseColor }) =>
    isSelected
      ? `
    box-shadow: 0 0 12px 4px ${baseColor}80, inset 0 0 0 2px ${baseColor};
    font-weight: 800;
    color: ${baseColor};
    z-index: 10;
    `
      : ''}

  ${({ $isToday }) =>
    $isToday
      ? `
    &::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
    }
    `
      : ''}

  &:hover {
    transform: ${({ isCurrentMonth }) => (isCurrentMonth ? 'scale(1.15)' : 'none')};
    z-index: 1;
  }
`;

export const DayNumber = styled.span`
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
  line-height: 1;
  color: #1a1a1a;
`;

export const TooltipContainer = styled.div<{ x: number; y: number }>`
  position: fixed;
  left: ${({ x }) => Math.min(x, window.innerWidth - 200)}px;
  top: ${({ y }) => Math.max(y - 40, 0)}px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 11px;
  pointer-events: none;
  z-index: 1000000;
  white-space: nowrap;
  line-height: 1.5;
  font-family: ${({ theme }) => theme?.typography?.families?.sansSerif || 'sans-serif'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export const TooltipTitle = styled.div`
  font-weight: bold;
  margin-bottom: 2px;
`;

export const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const TooltipLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
`;

export const TooltipValue = styled.span`
  font-weight: 600;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#999'};
  font-size: ${({ theme }) => (theme?.typography?.sizes?.m ?? 12)}px;
  gap: 8px;
`;

export const EmptyIcon = styled.div`
  font-size: 16px;
  line-height: 1;
`;

export const YearOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 8px;
  flex: 1;
  overflow-y: auto;
`;

export const MiniMonth = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MiniMonthTitle = styled.div`
  text-align: center;
  font-size: 10px;
  font-weight: ${({ theme }) => (theme?.typography?.weights?.bold ?? 700)};
  color: ${({ theme }) => theme?.colors?.grayscale?.dark1 ?? '#333'};
  margin-bottom: 4px;
`;

export const MiniMonthGrid = styled.div<{ showWeekNumbers: boolean }>`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }) =>
    showWeekNumbers ? '14px repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  gap: 1px;
`;

export const MiniDayHeader = styled.div`
  text-align: center;
  font-size: 7px;
  font-weight: bold;
  color: ${({ theme }) => theme?.colors?.grayscale?.base ?? '#666'};
  text-transform: uppercase;
`;

export const MiniWeekNum = styled.div`
  font-size: 7px;
  color: ${({ theme }) => theme?.colors?.grayscale?.light1 ?? '#bbb'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export interface MiniDayCellProps {
  intensity: number;
  isSelected: boolean;
  $isToday: boolean;
  baseColor: string;
}

export const MiniDayCell = styled.div<MiniDayCellProps>`
  aspect-ratio: 0.8;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 600;

  background-color: ${({ isSelected, baseColor }) => {
    if (isSelected) return `${baseColor}35`;
    return '#ffffff';
  }};
  border: 1px solid ${({ isSelected, baseColor }) => (isSelected ? baseColor : '#e2e8f0')};

  ${({ isSelected, baseColor }) =>
    isSelected
      ? `
    box-shadow: 0 0 8px 2px ${baseColor}80, inset 0 0 0 1px ${baseColor};
    z-index: 10;
    `
      : ''}

  ${({ $isToday }) =>
    $isToday
      ? `
    &::after {
      content: '';
      position: absolute;
      bottom: 1px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: currentColor;
    }
    `
      : ''}

  &:hover {
    transform: scale(1.3);
    z-index: 1;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 999999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 210px 24px 24px 24px;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 96%;
  max-width: 1350px;
  height: auto;
  max-height: calc(100vh - 240px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
`;

export const ModalCloseButton = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 10px;
  color: #475569;
  transition: all 0.2s ease;
  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

export const MacroBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

export const MacroButton = styled.button`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #e0f5e8;
    border-color: #40c463;
    color: #216e39;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
