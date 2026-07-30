# AGENTS.md — Calendar Filter Superset Plugin

## Goal

Interactive, selectable calendar chart plugin for **Apache Superset 6.1.0** that acts as a dashboard cross-filter with rich navigation and selection features.

## Package

- **Name**: `superset-plugin-chart-calendar-filter`
- **Plugin class key**: `superset-plugin-chart-calendar-filter` (Superset registry key)
- **All peer dependencies** use `*` version range — Superset provides them at runtime
- **License**: Apache 2.0

## Project Structure

```
superset-plugin-chart-calendar-filter/
├── src/
│   ├── index.ts                        # Entry point — exports SupersetPluginChartCalendarFilter
│   ├── types.ts                        # TypeScript interfaces (props, calendar day, tooltip, etc.)
│   ├── CalendarFilter.tsx              # Main React component (calendar heatmap + all features)
│   ├── plugin/
│   │   ├── index.ts                    # ChartPlugin registration + ChartMetadata
│   │   ├── buildQuery.ts               # Query builder (groupby, metrics)
│   │   ├── controlPanel.ts             # Form controls definition
│   │   └── transformProps.ts          # Data transformation pipeline
│   └── images/
│       └── thumbnail.png               # 100x100 thumbnail for chart picker
├── test/
│   ├── CalendarFilter.test.tsx         # Component tests (27 tests)
│   ├── index.test.ts                    # Plugin existence test
│   ├── __mocks__/
│   │   ├── superset-ui-core.ts         # Mock for @superset-ui/core (styled, ChartProps, etc.)
│   │   └── emotion-styled.ts           # Mock for @emotion/styled (CSS → style parsing)
│   └── plugin/
│       ├── buildQuery.test.ts          # Query builder tests
│       └── transformProps.test.ts      # Transform props tests
├── demo/                                # Standalone demo (esbuild IIFE + index.html)
│   ├── demo-wrapper.tsx                 # Demo component with mock data
│   ├── demo-bundle.js                   # esbuild bundle (1.2 MB)
│   ├── index.html                       # HTML page for demo
│   └── screenshot*.png                  # Demo screenshots
├── types/
│   └── external.d.ts                    # Module declarations for @apache-superset/core/translation
├── .github/
│   ├── workflows/ci.yml                # GitHub Actions CI
│   └── ISSUE_TEMPLATE/                 # Bug report + feature request templates
├── docs/
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   ├── INSTALL.md
│   └── screenshots/
│       ├── calendar_filter_screenshot.png
│       ├── chart-picker.png
│       ├── demo-calendar.png
│       └── demo-calendar-full.png
├── docker/
│   ├── docker-compose.yml
│   └── Dockerfile
├── package.json
├── tsconfig.json
├── babel.config.js
├── jest.config.js
├── AGENTS.md
├── LICENSE
└── README.md
```

## Build commands

| Command | Action |
|---|---|
| `npm run build` | build-cjs → build-esm → ts-types → postbuild (test) |
| `npm run build-clean` | rimraf → full build |
| `npm run clean` | rimraf {lib,esm,tsconfig.tsbuildinfo} |
| `npm run dev` | watch mode, rebuilds on change |
| `npm test` | jest (27 tests) |

Build outputs:
- `lib/` — CJS (CommonJS)
- `esm/` — ESM (ES Modules)
- `tsconfig.tsbuildinfo` — TypeScript incremental build info

## Session context

- **Date**: 2026-07-28 (Tuesday)
- **Branch**: `master`
- **Superset version**: 6.1.0 (cloned at `../superset-6.1.0/`)
- **Plugin build**: 44 tests pass, CJS + ESM + TypeScript declarations
- **Superset backend**: Flask dev server running on `:8088` (Python 3.11 venv)
- **Superset frontend**: webpack-dev-server on `:9000` (PID 9968), proxies to Flask `:8088`
- **Admin user**: `admin` / `password`
- **Dataset**: `main.events` (id:7) from db id:2, table `events`, columns `date` (TEXT), `value` (REAL), `category` (TEXT), 1095 rows (2025-01-01 to 2027-12-31)
- **Chart**: `Calendar Filter Test` (id:1), viz_type `superset-plugin-chart-calendar-filter`

## 🔄 Resume for next session

### 1. Webpack Build (Superset 6.1.0) — ✅ FIXED (0 ERRORS)
- Webpack-dev-server compila con **0 errori e 0 avvisi di modulo** dopo la creazione degli stub completi per `@deck.gl/widgets`, `@react-spring/web`, e `@fontsource/inter`.

### 2. Modal Vista Annuale — Layout Rettangolare, Selettore Anno & Posizionamento Anti-Overlap
- `ModalOverlay` con `padding-top: 210px` e `align-items: flex-start` (l'origine è posizionata ampiamente al di sotto delle barre superiori/schede della dashboard).
- Selettore anno dinamico (`◀`, `<YearSelect>`, `▶`) integrato nell'header della modale (Native Filter e Chart expand).
- `ModalContent` con `width: 96%`, `max-width: 1350px`, `max-height: calc(100vh - 240px)` (layout rettangolare panoramico).
- Build plugin OK (44/44 test pass).

## 🚦 Current status update

| Task | Status | Date |
|---|---|---|
| Theme null-safety | ✅ COMPLETED | 2026-07-12 |
| Plugin build (27/27 test) | ✅ COMPLETED | 2026-07-18 |
| Compact redesign | ✅ COMPLETED | 2026-07-18 |
| GitHub-style color palettes | ✅ COMPLETED | 2026-07-18 |
| Today indicator | ✅ COMPLETED | 2026-07-18 |
| Smart selection badge | ✅ COMPLETED | 2026-07-18 |
| Cell Density option | ✅ COMPLETED | 2026-07-18 |
| Select Entire Year Macro Filter | ✅ COMPLETED | 2026-07-27 |
| Aseptic Plain Cell Styling | ✅ COMPLETED | 2026-07-27 |
| Italian UI Localization | ✅ COMPLETED | 2026-07-27 |
| OrderBy removal in buildQuery | ✅ COMPLETED | 2026-07-27 |
| Native Filter Evolution & Hybrid Architecture | ✅ COMPLETED | 2026-07-28 |
| Dual View Layout (Mini Inline + Modal 12 Mesi) | ✅ COMPLETED | 2026-07-28 |
| Macro Shortcuts (Anno, Mese, Q1-Q4, Feriali) | ✅ COMPLETED | 2026-07-28 |
| Configurable Default Values (Oggi, Mese, Anno) | ✅ COMPLETED | 2026-07-28 |
| Full build (44/44 test pass) | ✅ COMPLETED | 2026-07-28 |
| Dashboard Native Filter Injection via API | ✅ COMPLETED | 2026-07-28 |
| Superset TS2344/TS6133 AceEditor Type-Check Fix | ✅ COMPLETED | 2026-07-28 |
| Clean Plugin Rebuild (`npm run clean/build/test`) | ✅ COMPLETED | 2026-07-28 |
| Multithread WSGI Gunicorn docker stack startup | ✅ COMPLETED | 2026-07-28 |
| Dashboard Native Filter Injection Verification | ✅ COMPLETED | 2026-07-28 |
| Git Restore superset-frontend (`git checkout 6.1.0`) | ✅ COMPLETED | 2026-07-28 |
| Filters and controls Category Registration | ✅ COMPLETED | 2026-07-28 |
| Attachment to Dashboard ID 8 (Native Filter + Slice 105) | ✅ COMPLETED | 2026-07-28 |
| Zero-Touch Automated Installer (`install.py`) | ✅ COMPLETED | 2026-07-28 |
| Native Filter Pill Trigger Button Rendering (`height <= 120px`) | ✅ COMPLETED | 2026-07-28 |
| FILTER_SUPPORTED_TYPES Superset Constants Registration | ✅ COMPLETED | 2026-07-28 |
| Full build (44/44 test pass) | ✅ COMPLETED | 2026-07-28 |
| COMMESSA & AGENTS update | ✅ COMPLETED | 2026-07-28 |
| Webpack Stub Modules (`@deck.gl/widgets`, `@react-spring/web`, `@fontsource/inter`) | ✅ COMPLETED (0 ERRORS) | 2026-07-28 |
| Modal Vista Annuale — Layout Rettangolare & Posizionamento Anti-Overlap | ✅ COMPLETED | 2026-07-28 |
| Modal Year Selector Controls (◀, YearSelect, ▶) | ✅ COMPLETED | 2026-07-28 |
| Modal Native Filter Month/Year View Switcher Toggle | ✅ COMPLETED | 2026-07-30 |
| AI Architecture & Development Map (`CODE_ARCHITECTURE_MAP.md`) | ✅ COMPLETED | 2026-07-30 |
| Full Rebuild & Jest Suite Pass (44/44 tests) | ✅ COMPLETED | 2026-07-30 |
| Available Years — include current year in dropdown even when dataset ends earlier | ✅ COMPLETED | 2026-07-30 |
| MonthSelect dropdown alongside YearSelect in native filter modal + chart header + expand modal | ✅ COMPLETED | 2026-07-30 |

## 📌 Notes

- The plugin is **pristine, fully tested, cleanly rebuilt, and upgraded to Native Filter + Hybrid Chart**
- All 44 tests pass (5 test suites), build CJS + ESM + TypeScript declarations succeed
- Native Filter Bar card renders a responsive **Trigger Pill Button** (`[ 📅 Seleziona Date (0) ▼ ]`) opening the modal with both Month and Year view toggle
- Category registered under `Filters and controls` in `ChartMetadata` and whitelisted in `FILTER_SUPPORTED_TYPES`
- Integrated on **Dashboard ID 8** (`http://localhost:8088/superset/dashboard/8/`) as both Native Filter and Chart Slice ID 105
- Zero-touch automated CLI installer [`install.py`](install.py) ready for beginners
- Version: `0.1.5`