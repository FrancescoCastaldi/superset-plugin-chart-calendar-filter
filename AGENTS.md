# AGENTS.md — Regole, Architettura e Branching Policy Calendar Filter

Questo documento definisce le direttive operative, l'architettura tecnica e la branching policy per tutti gli agenti AI che mantengono o sviluppano il plugin `superset-plugin-chart-calendar-filter`.

---

## 🌿 1. SINGLE BRANCH POLICY: `master` ESCLUSIVO

- **Unico Branch Ammesso**: Il repository adotta una politica a **singolo branch esclusivo (`master`)**.
- **Divieto di Branch Paralleli**: È vietato creare o mantenere branch secondari permanenti (es. `main`, `develop`).
- **Remotes Ufficiali**:
  - **Bitbucket**: `git@bitbucket.org:mapsgroupID/superset-plugin-chart-calendar-filter.git` (`master`)
  - **GitHub**: `https://github.com/FrancescoCastaldi/superset-plugin-chart-calendar-filter.git` (`master`)
- Qualsiasi modifica, bugfix o release deve essere committata e pushata direttamente su `master` verso entrambi i remoti (`bitbucket` e `origin`).

---

## 🛑 2. STANDARD INSTALLER ZERO-FRICTION

In conformità con la direttiva globale in `../AGENTS.md`:
1. Gli script di installazione (`scripts/install.ps1`, `scripts/install-to-superset.ps1`, `installer/install.bat`, `scripts/installer.py`) devono sempre verificare che le dipendenze siano installate prima di tentare compilazioni.
2. L'installazione di file in Apache Superset deve essere idempotente, con backup `.bak` preventivo di `MainPreset.ts`.

---

## 📐 3. ARCHITETTURA DEL PLUGIN

- **Nome Plugin**: `superset-plugin-chart-calendar-filter`
- **Key Registrazione**: `calendar_filter`
- **Scopo**: Widget di filtraggio temporale interattivo a vista calendario / mese / anno per Apache Superset.
- **Funzionalità Core**:
  - Propagazione filtri sia in modalità `TEMPORAL_RANGE` nativa globale per la dashboard, sia su colonne specifiche (`in_clause` / `time_range`).
  - Integrazione multi-tab e cross-filtering dashboard.
  - GUI di installazione rapida standalone (`CalendarFilterInstallerGUI.exe`).

### Struttura Directory
```text
superset-plugin-chart-calendar-filter/
├── src/
│   ├── components/            <- Componenti React del calendario (mese, anno, griglia giorni)
│   ├── hooks/                 <- useCalendarData.ts, useSelectionMask.ts
│   ├── plugin/                <- buildQuery.ts, controlPanel.ts, transformProps.ts, index.ts
│   └── index.ts               <- Entry point pubblico del plugin
├── scripts/                   <- Suite di installazione automatica (.ps1, .py, .sh)
├── demo/                      <- Preview interattiva standalone
├── CalendarFilterInstallerGUI.exe <- Eseguibile Windows per installazione guidata
├── README.md                  <- Documentazione e screenshot
├── CHANGELOG.md               <- Storico versioni e rilasci
└── package.json               <- Manifest dipendenze Superset
```

---

## 📋 4. REGISTRO AGGIORNAMENTI AGENTI

### [2026-09-17 15:15] — Single Branch Policy `master` & Allineamento Bitbucket
- **Agente**: Antigravity
- **Attività svolte**:
  1. Fast-forward del branch `master` alla release `8bda51f` (fix propagazione filtri cross-tab).
  2. Push su Bitbucket `mapsgroupID/superset-plugin-chart-calendar-filter` branch `master`.
  3. Eliminazione del branch ridondante `main` sia localmente che sui remoti (`bitbucket` e `origin`).
  4. Formalizzazione della Single Branch Policy (`master`) in questo file `AGENTS.md`.
