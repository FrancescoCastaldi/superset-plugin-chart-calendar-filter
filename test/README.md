# 📂 Testing Suite (`/test`)

> **Functional Verification & Unit Testing for `superset-plugin-chart-calendar-filter` (Apache Superset 6.1.0)**

---

## 🧪 Overview

This directory contains the comprehensive testing suite for the **Calendar Filter Plugin**, ensuring the reliability and functional correctness of the interactive calendar heatmap and its cross-filtering capabilities within Superset dashboards.

The test suite validates:
- Rendering of temporal data on the monthly/annual calendar grids.
- Single-day and continuous date range selection (click & drag/shift-click).
- Automated global cross-filtering dispatching to linked dashboard charts.
- Fluid temporal navigation across months and years.

---

## 🛠️ Chart Configuration Parameters

| Parameter | Value |
|---|---|
| **Chart type** | Calendar Filter |
| **Viz type** | `superset-plugin-chart-calendar-filter` |
| **Metric** | `COUNT(*)` or custom metric |
| **Date column** | The dataset's primary temporal column |
| **Time range** | No filter |

---

## 🔍 Explore View Validation

Once the chart is configured in the Explore view, verify the following:

- The calendar grid renders correctly without DOM overflow.
- Heatmap coloring accurately reflects data density/intensity.
- Month/Year navigation controls (`◀ ▶` and dropdowns) operate flawlessly.
- The "Today" indicator correctly highlights the current local date.
- The gradient legend dynamically displays accurate min/max ranges.

![Calendar Filter in Explore](../docs/screenshots/explore-calendar-filter.png)

---

## 📊 Dashboard Integration (Sales Dashboard)

The Calendar Filter chart is designed to integrate into dashboards (e.g., **Sales Dashboard**) with global cross-filtering enabled, allowing seamless temporal slicing across all analytical widgets.

![Calendar Filter in Dashboard](../docs/screenshots/superset-dashboard-calendar-filter.png)

Linked charts must react synchronously to calendar selections:
- **Big Numbers** (Total Revenue, Total Products Sold)
- **Time Series** (Quarterly Revenue)
- **Tables** (Products Sold By Product Line)
- **Bar Charts** (Quarterly Revenue By Product Line)

---

## ✅ Tested Features Matrix

| Feature | Status | Notes |
|---|---|---|
| Calendar heatmap rendering | ✅ | GitHub-style base styling |
| Month navigation (`◀ ▶`) | ✅ | Compact trigger buttons |
| Year navigation | ✅ | Dynamic `<YearSelect>` dropdown |
| Current day indicator | ✅ | Green dot visual highlight |
| Single day toggle | ✅ | Click to select/deselect |
| Selection badge | ✅ | Renders active day count |
| Year/Month dual view | ✅ | Toggle between 1-month and 12-month grids |
| Dashboard Cross-filtering | ✅ | Global scope `setDataMask` emission |
| Compact density mode | ✅ | Cell Density UI option |
| Multiple color palettes | ✅ | 6 dynamic Superset palettes |

---

## 🖱️ Interactive Cross-Filter Testing Protocol

### Configuration Setup

Ensure the calendar-filter chart is added to the target dashboard (e.g., **Sales Dashboard** id:5):

| Setting | Value |
|---|---|
| **Dashboard** | Sales Dashboard (id:5) |
| **Cross-filter** | Enabled, global scope |
| **Dataset** | Shared dataset among target charts |

### Single Day Selection

Click a specific calendar day to trigger a selection:
- The target day is highlighted with a neon border.
- The selection badge updates to reflect the active selection.
- All target dashboard charts synchronously filter to the selected date.

### Multiple Date Selection (Range)

To define a temporal range:
1. Click the origin date to initiate selection.
2. Click subsequent dates (or use shift-click) to expand the selection.
3. Every selected cell receives the active glow state.
4. The badge displays the aggregate selected days.

### Active Dashboard Cross-Filtering

During active calendar selection:
- Dashboard widgets auto-update in real-time to reflect the temporal slice.
- To clear the filter, utilize the **Clear** macro button or toggle the active day.

### Use Cases

| Scenario | Description |
|---|---|
| **Monthly trend analysis** | Select specific days to identify micro-trends. |
| **Outlier investigation** | Isolate specific days to analyze metric spikes or anomalies. |
| **Period comparison** | Navigate across months/years to benchmark different temporal periods. |
| **Visual filtering** | Leverage the calendar as an intuitive visual filter to explore dataset timeframes. |

---

## ⚠️ Important Notes

- The plugin strictly requires the target date column to be of type `DATE` or `TIMESTAMP`.
- Cross-filtering operates exclusively on charts within the same dashboard utilizing a compatible semantic filter scope.
- To execute tests in a standalone environment (detached from Superset), utilize the local esbuild demo located in the `/demo` directory.
