# STGraphX: readme

_Luca Mari, versione 4 aprile 2026_

## Contesto

STGraphX è un editor ed esecutore di modelli dinamici a grafo orientato.

È un esperimento di reimplementazione di STGraph, da Java a JavaScript, realizzata interamente in _vibe coding_ con GPT-Codex-5.x.

(si può provare <a href="https://lmari.github.io/STGraphX" target="_blank" rel="noopener noreferrer">qui</a>)

## Stato del progetto

Applicazione JavaScript con doppia shell e logica condivisa:
* web, per accesso da browser via `http:` (e con qualche limitazione anche `file:`);
* desktop, mediante `Electron`.

__Al momento implementati (senza librerie esterne!):__
* editor per grafi orientati, con nodi di forme diverse e tooltip, frecce spline, gestione di ridimensionamento, spostamento, cancellazione dei nodi, anche per selezioni multiple, zoom, griglia, clipboard, undo e redo, ...;
* menu, menu contestuale e pannello di configurazione aggiornato dinamicamente, con tooltip;
* gestione dei testi in italiano e inglese, con scelta via query string nella shell web (`?lang=it|en`) e via parametro `--lang=it|en` nella shell Electron;
* gestione dei nodi algebrici, di stato, parametri e sottomodelli, con funzioni in sintassi javascript (compresa la gestione locale di `this` come stato attuale); controllo sintattico sul nome dei nodi; controllo sui parametri (valore non cambia dopo la prima esecuzione; frecce entranti non ammesse); controllo sullo stato iniziale: solo espressioni locali o riferimenti a parametri; controllo del numero di cifre decimali visualizzate;
* gestione di esecuzione completa, passo-passo, temporizzata, con modello in modalità read-only durante l'esecuzione;
* gestione opzionale di blocco di esecuzione ed evidenziazione per nodi non definiti;
* editor per espressioni, con gestione ed help contestuale e controllo sintattico
* varie funzioni definite; mapping da valori booleani a valori numerici e funzione `if`;
* funzione `integral`, con scelta dell'algoritmo di integrazione, se Eulero o RK4;
* alcune funzioni per distribuzioni di probabilità;
* generazione di vettori con la sintassi `range(inizio, fine, [passo])`; indicizzazione/slicing di vettori e matrici con la sintassi di NumPy, `[inizio:fine]` oppure `[inizio:fine:passo]`, anche con indici opzionali e negativi; gestione di funzioni a valori non scalari, per esempio `sin([1,2,3])`; gestione di operatori con argomenti non scalari;
* funzioni "special form" per operare su vettori e matrici: `array`, `reduce`, `map`, `filter`;
* gestione di proprietà custom per il modello e i singoli nodi e funzioni `getModelProperty`/`getProperty` e `setModelProperty`/`setProperty`;
* gestione di nodi di output e di widget di output: grafici e tabelle; pannello di configurazione aggiornato dinamicamente;
* gestione di nodi di input e di widget di input, anche per parametri: slider; pannello di configurazione aggiornato dinamicamente;
* gestione dei sottomodelli con file JSON separati, con caricamento dalla stessa cartella del modello, binding dei nodi di input e accesso ai nodi di output con notazione `nomeSottomodello.nomeOutput`;
* visualizzazione alternata per il grafo e i widget;
* definizione della base dei tempi e modalità varie di esecuzione; pannello di configurazione aggiornato dinamicamente;
* caricamento e salvataggio di modelli in file JSON;
* editor per funzioni con controllo sintattico interattivo e help;
* menu di help;
* ...

__Al momento non implementati:__
* altri widget e altre opzioni per i widget già presenti, in particolare per la visualizzazione di valori non scalari;
* altre funzioni;
* nodi di stato con output;
* lettura e scrittura di file dati (xls, csv, ...);
* interfaccia a tab per più modelli;
* ...

## Appunti sul progetto

- Comprende le richieste molto bene e la qualità del codice prodotto è quasi sempre eccellente
- Controlla sempre il lavoro svolto e quasi sempre lo corregge da sé se trova degli errori
- Nel caso di estensioni a parti già realizzate, si fa carico automaticamente di mantenere la coerenza
- Le spiegazioni del lavoro compiuto sono chiare e corrette
- A volte prende iniziative implementando estensioni a quanto richiesto
- È in grado di fare refactoring e ottimizzazione
- Si possono chiedere pareri o comunque indicazioni su come si potrebbero risolvere problemi
- Scrive ottima documentazione a partire dal codice, e aggiorna automaticamente la documentazione
- È come un dialogo con uno sviluppatore esperto (inclusi suoi commenti come "Il patch è saltato su un punto di contesto nel CSS. Lo rifaccio in blocchi più piccoli così non rischiamo di lasciare roba a metà.")
- ...

## Documentazione aggiuntiva

Per l'architettura tecnica e per le istruzioni su come sviluppare il progetto, si veda `README-ARCHITECTURE.md`.
