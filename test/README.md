# Test del Calendar Filter Plugin

> Verifica funzionale del plugin `superset-plugin-chart-calendar-filter` per Apache Superset 6.1.0

---

## Introduzione

Questa cartella contiene il materiale di test per il **Calendar Filter Plugin**, un chart plugin per Apache Superset che visualizza un calendario interattivo (heatmap) utilizzabile come filtro incrociato (cross-filter) nelle dashboard.

Il plugin permette di:
- Visualizzare dati temporali su una griglia calendario mensile/annuale
- Selezionare singoli giorni o range di date con click e drag
- Filtrare automaticamente tutti gli altri chart della dashboard collegati
- Navigare tra mesi e anni con controlli compatti

---

## Requisiti

| Elemento | Dettaglio |
|---|---|
| **Superset** | 6.1.0 con plugin installato |
| **Database** | `examples` (database di esempio incluso in Superset) |
| **Tabella sorgente** | `birth_names` |
| **Colonne richieste** | `ds` (DATE/TIMESTAMP), `total_births` (DECIMAL) |
| **Metrica** | `COUNT(*)` oppure `SUM(total_births)` |

---

## Setup del Dataset

### 1. Creare il dataset virtuale

1. Aprire **SQL Lab** → **SQL Editor**
2. Eseguire la seguente query:

   ```sql
   SELECT ds, SUM(num) as total_births
   FROM birth_names
   GROUP BY ds
   ```

3. Cliccare **Explore** o **Save as dataset**
4. Assegnare il nome `birth_names_calendar_filter`
5. Verificare i tipi delle colonne:

   | Colonna | Tipo |
   |---|---|
   | `ds` | DATE / TIMESTAMP |
   | `total_births` | DECIMAL / NUMERIC |

### 2. Verificare il dataset

Da **Data** → **Datasets**, cercare `birth_names_calendar_filter` e confermare che le colonne siano riconosciute correttamente.

---

## Configurazione del Chart

Creare un nuovo chart con i seguenti parametri:

| Parametro | Valore |
|---|---|
| **Dataset** | `birth_names_calendar_filter` |
| **Chart type** | Calendar Filter |
| **Viz type** | `superset-plugin-chart-calendar-filter` |
| **Metric** | `COUNT(*)` oppure `SUM(total_births)` |
| **Date column** | `ds` |
| **Time range** | No filter |

---

## Test in Explore

Una volta configurato il chart, verificare che:

- La griglia calendario venga renderizzata correttamente
- I colori della heatmap riflettano l'intensità dei dati
- I controlli di navigazione (mese/anno) siano visibili e funzionanti
- L'indicatore del giorno corrente sia evidenziato

![Calendar Filter in Explore](./explore-calendar-filter.png)

---

## Aggiungere a Dashboard

Per testare il cross-filter:

1. Aprire o creare una dashboard (es. **World Bank's Data**, id:9)
2. Aggiungere il chart Calendar Filter alla dashboard
3. Impostare lo **scope del filtro** su **globale**
4. Salvare la dashboard
5. Cliccare e trascinare sui giorni del calendario per selezionare un range
6. Verificare che gli altri chart della dashboard si aggiornino in base alla selezione

![Calendar Filter in Dashboard](./superset-dashboard-calendar-filter.png)

![Dashboard completa](./dashboard-worldbank-full.png)

---

## Funzionalità Testate

| Funzionalità | Stato | Note |
|---|---|---|
| Rendering calendar heatmap | ✅ | Colori GitHub-style (light/dark) |
| Navigazione mesi (◀ ▶) | ✅ | Pulsanti compatti |
| Navigazione anni | ✅ | Selettore anno con frecce |
| Indicatore giorno corrente | ✅ | Evidenziato con bordo |
| Selezione singolo giorno | ✅ | Click per selezionare |
| Selezione range (drag) | ✅ | Click + drag per range |
| Badge selezione | ✅ | Mostra range selezionato |
| Cross-filter dashboard | ✅ | Scope globale |
| Modalità compact | ✅ | Opzione Cell Density |
| Palette GitHub-style | ✅ | Light + Dark mode |
| Year selector | ✅ | Navigazione rapida per anno |

---

## Note

- Il dataset `birth_names` è incluso nell'installazione di esempio di Superset. Se non disponibile, caricare il dataset di esempio prima di procedere.
- Il plugin richiede che la colonna data sia di tipo DATE o TIMESTAMP. Colonne di tipo TEXT potrebbero non funzionare correttamente.
- Il cross-filter funziona solo con chart nella stessa dashboard e con scope di filtro compatibile.
- Per il test in modalità standalone (senza Superset), utilizzare la demo inclusa nella cartella `demo/` del plugin.
