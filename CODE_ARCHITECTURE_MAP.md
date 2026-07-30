# 🗺️ CODE ARCHITECTURE & DEVELOPMENT MAP
> **Superset Plugin: Calendar Filter Chart & Native Filter (`superset-plugin-chart-calendar-filter`)**
> 
> *Questo documento è progettato per essere fornito direttamente agli agenti AI e agli sviluppatori per guidare qualsiasi modifica futura al codice (Frontend, Backend, Stili e Integrazione Superset).*

---

## 1. 🏗️ Architettura Generale del Progetto

Il plugin è un componente React/TypeScript progettato per **Apache Superset 6.1.0**. Adotta un'**Architettura Ibrida Duale**:
- **`Behavior.InteractiveChart`**: Funziona come un grafico standard in dashboard con cross-filtering bidirezionale.
- **`Behavior.NativeFilter`**: Funziona come un Native Filter nella barra laterale sinistra dei filtri nativi di Superset.

### Flusso Dati & Iniezione Filtri:
```text
[ Input Utente: Click Cella / Macro / Navigazione ]
                       │
                       ▼
            [ CalendarFilter.tsx ] ──(setDataMask)──► [ Superset Filter Engine ]
                                                             │
                                                             ▼
                                                [ Dashboard Charts SQL Query ]
```

---

## 2. 📂 Mappa Meticolosa dei File e dei Paragrafi di Codice

### 📄 1. `src/index.ts` — Entry Point del Plugin
- **Cosa fa**: Esporta la classe principale `SupersetPluginChartCalendarFilter`.
- **Cosa modificare se**: Vuoi cambiare l'export di livello principale del pacchetto npm.

---

### 📄 2. `src/types.ts` — Interfacce e Contratti TypeScript
- **Paragrafi chiave**:
  - `CalendarFilterStylesProps`: Definisce le prop `height` e `width`.
  - `FilterTypeMode`: `'time_range'` (intervallo nativo) | `'in_clause'` (date discrete `IN`).
  - `DefaultValueMode`: `'none'` | `'today'` | `'current_month'` | `'current_year'` | `'custom'`.
  - `CalendarFilterCustomizeProps`: Definisce tutte le opzioni configurabili dal pannello Superset (`colorScheme`, `showLegend`, `firstDayOfWeek`, `showWeekNumbers`, `showYearDropdown`, `enableOverview`, `cellDensity`, `filterTypeMode`, `defaultValueMode`, `showMacroShortcuts`, etc.).
  - `CalendarFilterProps`: Insieme di tutte le prop inoltrate a `CalendarFilter.tsx` (inclusi `setDataMask`, `filterState`, `dateColumn`, `formData`).
  - `CalendarDay`, `CalendarMonth`, `WeekRow`, `TooltipData`: Contratti per i punti dati e il rendering.
- **Cosa modificare se**:
  - **Aggiungi un nuovo controllo/opzione**: Aggiungi la proprietà a `CalendarFilterCustomizeProps` e a `CalendarFilterProps`.

---

### 📄 3. `src/CalendarFilter.tsx` — Componente React Principale (~1800 righe)

Questo è il cuore dell'applicazione. È suddiviso nelle seguenti sezioni fondamentali:

#### A. Definizione Styled-Components (Linee 50–585)
- **`Styles`**: Contenitore radice. Gestisce `height`, `width`, font-family e la proprietà `padding-bottom: 116px` (per evitare la sovrapposizione grafica con i pulsanti sticky della barra filtri di Superset).
- **`NativeFilterTriggerContainer` & `NativeFilterPillButton`**: Il pulsante pill responsive `[ 📅 Seleziona Date (0) ▼ ]` renderizzato nella Native Filter Bar.
- **`CalendarHeader` / `HeaderLeft` / `HeaderCenter` / `HeaderRight`**: Layout flessibile dell'header (navigazione mese, selettore anno, pulsante oggi, vista toggle, badge selezioni).
- **`NavButton` / `TodayButton` / `ViewToggleButton`**: Pulsanti con bordi sottili, ombre leggere ed effetti hover.
- **`MonthTitle` / `SelectionBadge` / `ClearButton` / `YearSelect`**: Titolo del mese localizzato, badge conteggio selezioni e menu a tendina per l'anno.
- **`CalendarGrid` / `DayHeader` / `WeekNumberCell`**: Griglia del calendario a 7 colonne (o 8 con i numeri di settimana ISO).
- **`DayCell` / `DayNumber`**: La cella del singolo giorno.
  - Sfondo neutro/asettico `#ffffff` con bordo `#e2e8f0`.
  - Quando selezionata: bagliore al neon (`box-shadow: 0 0 12px 4px ${baseColor}80`), testo in grassetto e bordo colorato.
  - Indicatore "Oggi": pallino verde in basso al centro.
- **`TooltipContainer`**: Box popover su hover con `z-index: 1000000` (visibile sopra ogni modale).
- **`YearOverviewGrid` / `MiniMonth` / `MiniMonthGrid` / `MiniDayCell`**: Griglia panoramica a 12 mesi con mini-caselle per la vista annuale.
- **`ModalOverlay` / `ModalContent` / `ModalHeader` / `ModalTitle` / `ModalCloseButton`**: Finestra modale espansa a tutto schermo (`padding-top: 210px`, `width: 96%`, `max-width: 1350px`) con sfocatura dello sfondo (`backdrop-filter: blur(4px)`).
- **`MacroBar` / `MacroButton`**: Barra delle scorciatoie rapide per selezioni macro (*Anno*, *Mese*, *Q1-Q4*, *Feriali*, *Azzera*).

#### B. Logica dello Stato e Hook React (Linee 614–1114)
- **`availableYears` (useMemo, riga 860)**: Calcola gli anni disponibili per il `YearSelect` dropdown.
  - Se non ci sono dati (`minDateBound`/`maxDateBound` nulli): mostra 5 anni intorno all'anno corrente (`[oggi-2, oggi-1, oggi, oggi+1, oggi+2]`).
  - Se i dati hanno un range: elenca tutti gli anni da `minY` a `maxY`, dove `maxY` è esteso almeno fino all'anno corrente (`today.getFullYear()`) per garantire che l'anno corrente sia sempre selezionabile anche se il dataset termina prima.
- **`dataMap` (useMemo)**: Mappa i dati grezzi ricevuti da Superset, individua automaticamente la colonna data e la metrica, e calcola i valori min/max per le percentuali del tooltip.
- **`selectedDates` (useMemo)**: Estrae le date attualmente selezionate dallo stato `filterState` di Superset.
- **`emitSelection` (useCallback)**:
  - Riceve un array di stringhe `YYYY-MM-DD`.
  - Se `filterTypeMode === 'time_range'`, emette la stringa `YYYY-MM-DD : YYYY-MM-DD`.
  - Se `filterTypeMode === 'in_clause'`, emette la clausola SQL `col IN ('YYYY-MM-DD', ...)`.
  - Invocato tramite `setDataMask`.
- **`defaultInitialized` (useEffect)**: Applica la selezione di default al primo avvio (*Oggi*, *Mese Corrente*, *Anno Corrente*, o *Custom*).
- **Logica Scorciatoie Macro**:
  - `selectEntireYear()`: Seleziona tutti i giorni dell'anno corrente.
  - `selectCurrentMonth()`: Seleziona tutti i giorni del mese corrente.
  - `selectQuarter(1..4)`: Seleziona i 3 mesi del trimestre scelto.
  - `selectWeekdays()`: Seleziona solo i giorni dal lunedì al venerdì.
- **`handleDayClick` / `handleMiniDayClick`**: Gestisce il click singolo (toggle) e la selezione di range temporali (due click successivi o Shift-Click).

#### C. Rendering Condizionale (Linee 1115–1798)
1. **Riconoscimento Native Filter**:
   ```ts
   const isCompactNativeFilter = Boolean(formData?.inView || (height && height <= 120));
   ```
2. **Modalità Native Filter (`isCompactNativeFilter === true`)**:
   - Renderizza il pulsante pill `NativeFilterPillButton`.
   - Al click apre `ModalOverlay` che contiene **sia la Vista Annuale (12 mesi) che la Vista Mensile (singolo mese)** con il pulsante di switch `ViewToggleButton` nell'header della modale.
3. **Modalità Full Chart (`isCompactNativeFilter === false`)**:
   - Renderizza l'header in-page, la barra delle macro, la griglia mensile/annuale standard e il tooltip al mouseover.

---

### 📄 4. `src/utils/dateUtils.ts` — Utility Temporali Timezone-Safe
- **Paragrafi chiave**:
  - `parseDateValue(val)`: Converte stringhe `YYYY-MM-DD`, timestamp numerici o oggetti Date in oggetti Date impostati alla **mezzanotte locale** (previene lo slittamento fuso orario UTC di 1 giorno).
  - `formatDateKey(d)`: Converte un oggetto Date in stringa `YYYY-MM-DD`.
  - `getFirstDayOfMonth(year, month, firstDayOfWeek)`: Calcola il primo giorno del mese tenendo conto se la settimana inizia di Domenica (0) o Lunedì (1).
  - `getDaysInMonth(year, month)`: Restituisce il numero di giorni del mese (es. 28, 30, 31).
  - `getISOWeekNumber(d)`: Calcola il numero di settimana ISO-8601.
  - `formatDateRangeBadge(dates)`: Formatta il testo delle selezioni (es. `"12-15 Mar 2026"` per date contigue o `"3 selezionati"` per date sparse).
- **Cosa modificare se**:
  - **Vuoi cambiare il formato del testo del badge di selezione**: Modifica `formatDateRangeBadge`.
  - **Vuoi cambiare il parsing delle date**: Modifica `parseDateValue`.

---

### 📄 5. `src/plugin/index.ts` — Registrazione del Plugin Superset
- **Cosa fa**: Inizializza la classe `ChartPlugin` definendo i metadati (`ChartMetadata`):
  - `category`: `Filters and controls`
  - `behaviors`: `[Behavior.InteractiveChart, Behavior.NativeFilter]`
- **Cosa modificare se**:
  - **Vuoi cambiare la categoria nel chart picker**: Modifica `category`.
  - **Vuoi abilitare/disabilitare i comportamenti Native Filter / Interactive Chart**: Modifica l'array `behaviors`.

---

### 📄 6. `src/plugin/buildQuery.ts` — Query Builder per il Backend Flask
- **Cosa fa**: Costruisce il payload di query inviato al backend Python/Flask di Superset.
- **Dettaglio fondamentale**: Rimuove `orderby` dal query context per evitare errori SQL di sottoquery annidate in Superset.
- **Cosa modificare se**: Vuoi aggiungere ordinamenti SQL nativi o modificare le metriche inviate al database backend.

---

### 📄 7. `src/plugin/controlPanel.ts` — Pannello di Controllo (Esplora / Form Controlli)
- **Paragrafi chiave**:
  - `Query`: Sezione contenente `metric`, `groupby` (Date column), `adhoc_filters`.
  - `Calendar Options`: Sezione contenente `color_scheme`, `show_legend`, `show_week_numbers`, `first_day_of_week`, `show_year_dropdown`, `enable_overview`, `cell_density`.
  - `Native Filter Settings`: Sezione contenente `filter_type_mode`, `default_value_mode`, `show_macro_shortcuts`.
- **Cosa modificare se**:
  - **Vuoi aggiungere un nuovo controllo o tendina nel pannello di Superset**: Inserisci un nuovo oggetto in `controlSetRows` dentro `controlPanel.ts`.

---

### 📄 8. `src/plugin/transformProps.ts` — Data Transformation Pipeline
- **Cosa fa**: Riceve i `chartProps` da Superset (dati grezzi, form data, hooks) e li trasforma nelle prop formattate per il componente React `CalendarFilter.tsx`.
- **Dettaglio fondamentale**: Estrae la funzione `setDataMask` dagli `hooks` ed inoltra la prop `formData` (fondamentale per rilevare `formData.inView` nel Native Filter).
- **Cosa modificare se**: Aggiungi un nuovo controllo in `controlPanel.ts` e devi passarlo a `CalendarFilter.tsx`. Devi estrarlo da `formData` dentro `transformProps.ts` e inserirlo nell'oggetto restituito.

---

### 📄 9. `install.py` — Installer Automatico Zero-Touch Python
- **Cosa fa**:
  1. Aggiunge `"superset-plugin-chart-calendar-filter": "file:..."` a `superset-frontend/package.json`.
  2. Registra l'import e l'istanza in `superset-frontend/src/visualizations/presets/MainPreset.ts`.
  3. Applica il fix di compatibilità TypeScript TS2344/TS6133 su `AceEditorProvider.tsx`.
  4. Registra la chiave del plugin nella whitelist `FILTER_SUPPORTED_TYPES` in `constants.ts` (per la modale di configurazione dei Native Filters).
- **Cosa modificare se**: Cambi la chiave del plugin o i percorsi target di installazione in Superset.

---

## 🛠️ Guida Rapida: "Dove Modificare Se Devo Fare X"

| Desiderata Modifica | File da Modificare | Punti / Funzioni Specifiche |
|---|---|---|
| **Cambiare il colore/stile delle caselle** | `src/CalendarFilter.tsx` | Styled-component `DayCell` e `MiniDayCell` |
| **Aggiungere o modificare una scorciatoia Macro** | `src/CalendarFilter.tsx` | Componenti `MacroButton` e funzioni `selectQuarter`, `selectWeekdays`, etc. |
| **Aggiungere un nuovo parametro di configurazione** | `src/types.ts` <br> `src/plugin/controlPanel.ts` <br> `src/plugin/transformProps.ts` <br> `src/CalendarFilter.tsx` | 1. Definisci il tipo in `types.ts`<br>2. Aggiungi il controllo in `controlPanel.ts`<br>3. Inoltra la prop in `transformProps.ts`<br>4. Usala nel componente `CalendarFilter.tsx` |
| **Modificare il formato del filtro inviato alla dashboard** | `src/CalendarFilter.tsx` | Funzione `emitSelection` |
| **Modificare la dimensione o l'altezza del pulsante Pill nella sidebar** | `src/CalendarFilter.tsx` | Styled-component `NativeFilterPillButton` |
| **Modificare le dimensioni/offset della finestra modale** | `src/CalendarFilter.tsx` | Styled-components `ModalOverlay` e `ModalContent` |
| **Modificare il parsing o la formattazione delle date** | `src/utils/dateUtils.ts` | `parseDateValue`, `formatDateKey`, `formatDateRangeBadge` |
| **Attivare/Disattivare la build CJS/ESM/Types** | `package.json` | Sezione `scripts` (`build`, `build-cjs`, `build-esm`) |
