# Superset Plugin: Calendar Filter Chart & Native Filter

> **Documentazione Confluence**: Presentazione e Guida Funzionale del Plugin Calendar Filter per Apache Superset 6.1.0

---

## Architettura e Obiettivi

Il plugin **Calendar Filter** (`superset-plugin-chart-calendar-filter`) è un componente di visualizzazione e filtraggio temporale ad alte prestazioni sviluppato per **Apache Superset 6.1.0**. 

È progettato con un'**Architettura Ibrida Duale** per operare in due modalità complementari:
1. **Interactive Dashboard Chart**: integrabile come grafico standard nella griglia della dashboard con supporto Cross-Filtering bidirezionale su tutti gli altri widget.
2. **Native Filter Bar Component**: inserito direttamente nella barra filtri nativa (pannello laterale) per il controllo globale dell'intero cruscotto analitico.

---

## Funzionalità Principali

| Funzionalità | Descrizione |
|---|---|
| **Vista Duale (Mini Inline + Modal)** | Interfaccia compatta a 1 mese per la barra laterale o card ridotte, affiancata da un pulsante di espansione per l'apertura di un modal panoramico a 12 mesi. |
| **Selettore Anno Dinamico** | Controlli di navigazione temporale integrati nell'header della modale per scorrere ed esplorare liberamente il calendario senza restrizioni. |
| **Scorciatoie Macro Rapide** | Trigger rapidi per selezioni immediate: **Anno**, **Mese Corrente**, **Q1-Q4**, **Feriali (Lun-Ven)** e **Reset selezione**. |
| **Formato Filtro Emesso Configurabile** | Supporto per l'emissione sia di intervalli nativi Superset (`time_range`) che di liste discrete di date (clausola SQL `IN ('YYYY-MM-DD', ...)`). |
| **Design Asettico & Minimalista** | Interfaccia pulita per la massima leggibilità dei dati, con evidenziazione grafica dinamica e coordinata per le date selezionate. |
| **Localizzazione Completa** | Interfaccia utente interamente localizzata in lingua italiana (giorni, mesi, label e tooltip). |

---

## Panoramica Visuale e Integrazione

### 1. Integrazione nella Sales Dashboard come Native Filter
![Sales Dashboard Calendar Filter](./screenshots/sales_dashboard_calendar.png)
> *Figura 1: Il plugin integrato come Native Filter nella Sales Dashboard. È visibile il trigger button ("Seleziona Date Calendario") nella barra dei filtri laterale, pronto per l'espansione della modale.*

---

### 2. Finestra Modale Vista Annuale (Layout Iniziale)
![Calendar Filter Annual View Modal](./screenshots/calendar_filter_screenshot.png)
> *Figura 2: La modale espansa a 12 mesi generata dal Native Filter. La griglia annuale si presenta vuota (nessuna data selezionata), esponendo il layout panoramico rettangolare, il selettore dell'anno e le macro d'uso frequente.*

---

### 3. Selezione Interattiva (Macro Q1 Attivata)
![Full Overview](./screenshots/screenshot-calendar-full.png)
> *Figura 3: Dettaglio dell'interazione utente. Attivando la scorciatoia "Q1" (Primo Trimestre), le date corrispondenti vengono istantaneamente selezionate ed evidenziate dinamicamente sulla griglia.*

---

## Flusso Operativo e DataMask

```text
[ Input Utente: Selezione Date o Macro ]
               │
               ▼
[ CalendarFilter Component ] ───(setDataMask)───► [ Superset Filter Engine ]
                                                          │
                                                          ▼
                                             [ SQL Query Update su Dashboard ]
```

1. **Selezione Interattiva**: L'utente può interagire selezionando una singola data, trascinando un intervallo temporale (drag & drop point-to-point) oppure utilizzando una Macro.
2. **Propagazione DataMask**: Il plugin notifica le variazioni di stato tramite la hook nativa `setDataMask`.
3. **Filtro Sincrono Dashboard**: L'engine di Apache Superset intercetta la maschera dati e aggiorna le query di tutti i grafici inclusi nello scope semantico del filtro.

---

## Specifiche Tecniche

- **Package**: `superset-plugin-chart-calendar-filter`
- **Compatibilità**: Apache Superset **6.1.0** (Node 18+, React 17, TypeScript 5)
- **Behaviors**: `[Behavior.InteractiveChart, Behavior.NativeFilter]`
- **Licenza**: Apache 2.0
