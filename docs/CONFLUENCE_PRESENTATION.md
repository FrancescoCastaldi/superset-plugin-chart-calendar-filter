# Calendar Filter Plugin -- Technical Overview

Technical and functional reference for the Calendar Filter plugin (`superset-plugin-chart-calendar-filter`) targeting Apache Superset 6.1.0.

---

## Architecture and Objectives

The plugin implements a dual hybrid architecture operating in two complementary modes:

1. **Interactive Dashboard Chart**: Integrates as a standard chart widget within the dashboard grid, featuring bidirectional cross-filtering support across all other dashboard widgets.
2. **Native Filter Bar Component**: Injects directly into the native filter bar (left sidebar) for global control over the entire analytical dashboard.

---

## Core Capabilities

| Feature | Description |
|---|---|
| Dual View (Compact Inline + Expanded Modal) | A compact 1-month interface optimized for sidebars or constrained cards, paired with an expansion trigger that opens a panoramic 12-month modal. |
| Dynamic Year Selector | Temporal navigation controls integrated into the modal header for unrestricted exploration of calendar data across any year. |
| Rapid Macro Shortcuts | One-click triggers for immediate temporal selections: entire year, current month, Q1-Q4, weekdays (Mon-Fri), and reset selection. |
| Configurable Emission Format | Supports emitting both native Superset time ranges (`time_range`) and discrete arrays of dates (SQL `IN ('YYYY-MM-DD', ...)` clauses). |
| Minimalist Design | Clean interface for maximum data legibility, with dynamic coordinated graphical highlights for selected dates. |
| Localization | User interface fully localized in Italian (days, months, labels, and tooltips). |

---

## Visual Overview and Integration

### 1. Integration within the Sales Dashboard as a Native Filter
![Sales Dashboard Calendar Filter](./screenshots/sales_dashboard_calendar.png)
*Figure 1: The plugin deployed as a Native Filter within the Sales Dashboard. The trigger button is visible in the lateral filter bar, ready to expand the modal.*

### 2. Expanded Annual View Modal (Initial Layout)
![Calendar Filter Annual View Modal](./screenshots/calendar_filter_screenshot.png)
*Figure 2: The 12-month expanded modal triggered by the Native Filter. The annual grid initializes empty (no selections), showcasing the rectangular panoramic layout, the year selector, and macro shortcuts.*

### 3. Interactive Selection (Q1 Macro Activated)
![Full Overview](./screenshots/screenshot-calendar-full.png)
*Figure 3: User interaction detail. Activating the Q1 shortcut selects the corresponding dates and highlights them across the grid.*

---

## Operational Flow and DataMask

```
[ User Input: Date Selection or Macro Trigger ]
       |
       v
[ CalendarFilter Component ] --> setDataMask() --> [ Superset Filter Engine ]
                                                       |
                                                       v
                                          [ Dashboard SQL Query Update ]
```

1. **Interactive Selection**: Users interact by clicking a single date, selecting a continuous range (drag and drop or shift-click), or executing a macro.
2. **DataMask Propagation**: The plugin broadcasts state mutations using the native `setDataMask` hook.
3. **Synchronous Dashboard Filtering**: The Apache Superset engine intercepts the data mask and dynamically updates the queries for all charts operating within the semantic scope of the filter.

---

## Technical Specifications

- **Package**: `superset-plugin-chart-calendar-filter`
- **Compatibility**: Apache Superset 6.1.0 (Node 18+, React 17, TypeScript 5)
- **Behaviors**: `[Behavior.InteractiveChart, Behavior.NativeFilter]`
- **License**: Apache 2.0
