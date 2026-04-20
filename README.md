# STGraphX: readme

_Luca Mari, versione 20 aprile 2026_

## Contesto

STGraphX è un editor ed esecutore di modelli dinamici a grafo orientato.

È un esperimento di reimplementazione di STGraph, da Java a JavaScript, realizzata interamente in _vibe coding_ con GPT-Codex-5.x.

(si può provare <a href="https://lmari.github.io/STGraphX" target="_blank" rel="noopener noreferrer">qui</a>)

Ho guardato ma mai toccato il codice generato, che al momento è di circa 500 linee HTML, 2000 linee CSS, e di oltre 15000 linee JS.

## Stato del progetto

Applicazione JavaScript con doppia shell e logica condivisa:

* web, per accesso da browser via `http:` (e con qualche limitazione anche `file:`);
* desktop, mediante `Electron`.

__Al momento implementati (senza librerie esterne!):__

* editor per grafi orientati, con nodi di forme e colori diversi e tooltip, frecce spline, testi, gestione di ridimensionamento, spostamento, cancellazione dei nodi, anche per selezioni multiple, zoom, griglia, clipboard, undo e redo, ...;
* menu, menu contestuale e pannello di configurazione aggiornato dinamicamente, con tooltip;
* gestione dei testi dell'interfaccia utente in italiano e inglese, con scelta via query string nella shell web (`?lang=it|en`) e via parametro `--lang=it|en` nella shell Electron;
* gestione dei nodi algebrici, di stato, parametri e sottomodelli, con funzioni in sintassi javascript (compresa la gestione locale di `this` come stato attuale); controllo sintattico sul nome dei nodi; controllo sui parametri (valore non cambia dopo la prima esecuzione; frecce entranti non ammesse); controllo sullo stato iniziale: solo espressioni locali o riferimenti a parametri; controllo del numero di cifre decimali visualizzate;
* gestione di esecuzione completa, passo-passo, temporizzata, con modello in modalità read-only durante l'esecuzione;
* gestione opzionale di blocco di esecuzione ed evidenziazione per nodi non definiti;
* editor per espressioni, con gestione ed help contestuale e controllo sintattico dinamico;
* varie funzioni definite; mapping da valori booleani a valori numerici e funzione `if`;
* funzione `integral`, con scelta dell'algoritmo di integrazione, se Eulero o RK4;
* alcune funzioni per distribuzioni di probabilità;
* generazione di vettori con la sintassi `range(inizio, fine, [passo])`; indicizzazione/slicing di vettori e matrici con la sintassi di NumPy, `[inizio:fine]` oppure `[inizio:fine:passo]`, anche con indici opzionali e negativi; gestione di funzioni a valori non scalari, per esempio `sin([1,2,3])`; gestione di operatori con argomenti non scalari;
* funzioni "special form" per operare su vettori e matrici: `array`, `reduce`, `map`, `filter`;
* gestione di proprietà custom per il modello e i singoli nodi e funzioni `getModelProperty`/`getProperty` e `setModelProperty`/`setProperty`;
* gestione di nodi di output e di widget di output: grafici, tabelle, matrici, led; pannello di configurazione aggiornato dinamicamente;
* gestione di nodi di input e di widget di input, anche per parametri: slider e pulsante; pannello di configurazione aggiornato dinamicamente;
* gestione dei sottomodelli con file JSON separati, con caricamento dalla stessa cartella del modello, binding dei nodi di input e accesso ai nodi di output con notazione `nomeSottomodello.nomeOutput`; prima gestione in logica ABM dichiarativa / funzionale, mediante variabili di sistema `self` e `$i$`;
* visualizzazione alternata per il grafo e i widget;
* editor per testi;
* definizione della base dei tempi e modalità varie di esecuzione; pannello di configurazione aggiornato dinamicamente;
* caricamento e salvataggio di modelli in file JSON;
* editor per espressioni con controllo sintattico interattivo, visualizzazione dei valori attuali, help;
* menu di help;
* nel menu File, gestione dei modelli aperti di recente;
* ...

__Al momento non implementati (rispetto a STGraph):__

* altri widget e altre opzioni per i widget già presenti, in particolare per la visualizzazione di valori non scalari;
* varie funzioni;
* nodi di stato con output;
* variabili globali;
* playmode e altre modalità di esecuzione;
* lettura e scrittura di file dati (xls, csv, ...);
* interfaccia a tab per più modelli;
* strumenti di monitoraggio e debugging;
* una pagina di esempi;
* ...

## Appunti sul progetto

* Comprende le richieste molto bene e la qualità del codice prodotto è quasi sempre eccellente
* Anche senza che glielo si chieda, fa test sul codice che ha generato, e quasi sempre lo corregge da sé se trova degli errori
* Nel caso di estensioni a parti già realizzate, si fa carico automaticamente di mantenere la coerenza
* Le spiegazioni del lavoro compiuto sono chiare e corrette
* A volte prende iniziative proponendo o anche implementando estensioni a quanto richiesto
* È in grado di fare refactoring e ottimizzazione, e fa refactoring anche autonomamente quando si accorge che è opportuno
* Si possono chiedere pareri o comunque indicazioni su come si potrebbero risolvere problemi
* Una stessa richiesta può includere cose diverse da realizzare
* Quando si chiede di realizzare cose complesse, suggerisce di farlo per passi successivi ("Se vuoi, il prossimo passo utile è...")
* Scrive ottima documentazione a partire dal codice, e aggiorna automaticamente la documentazione
* È come un dialogo con uno sviluppatore esperto (inclusi suoi commenti come "Il patch è saltato su un punto di contesto nel CSS. Lo rifaccio in blocchi più piccoli così non rischiamo di lasciare roba a metà.")
* Sa usare il software che genera: in questo caso, sa creare modelli stg
* ...

## Documentazione aggiuntiva

Per l'architettura tecnica e per le istruzioni su come sviluppare il progetto, si veda `README-ARCHITECTURE.md`.
