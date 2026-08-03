# src/styles/

## Responsibility

Houses Emotion CSS-in-JS styled components (`CalendarFilter.styles.ts`) that define visual design, layouts, theme colors, responsive dimensions, and modal overlays.

## Design

- **CSS-in-JS Framework**: Built with `@emotion/styled`.
- **Adaptive Layout**: Provides adaptive styles for Native Filter sidebar mode (renders `NativeFilterPillButton` when `height <= 120px`) and full chart mode (inline calendar grid).
- **Modal Positioning**: Defines `ModalOverlay` (`padding-top: 210px`) and `ModalContent` (`width: 96%`, `max-width: 1350px`) for a panoramic 12-month rectangular view positioned below Superset top bars/tabs.
- **Clean DOM**: Uses Emotion transient props (`$isToday`, `$cellHeight`, `$isSelected`) to prevent custom styling flags from leaking into rendered DOM attributes.

## Flow

Exports styled React components (`Styles`, `DayCell`, `MiniDayCell`, `CalendarGrid`, `ModalOverlay`, `NativeFilterPillButton`, `MacroButton`, etc.) consumed across `CalendarFilter.tsx` and `src/components/`.

## Integration

Integrates Superset theme tokens and GitHub-inspired color palettes into all plugin components.
