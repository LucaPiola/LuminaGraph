# STGraphX: readme di uso

_Luca Mari, versione 2 aprile 2026_

STGraphX è un editor ed esecutore di modelli dinamici a grafo orientato.

## Vettori e matrici

Il linguaggio delle espressioni di STGraphX supporta valori non scalari:

- scalari
- vettori
- matrici

Molte funzioni matematiche e molti operatori lavorano in modo vettorializzato. Per esempio:

- `sin([1,2,3])`
- `[1,2,3] * 2`
- `[1,2,3] + [4,5,6]`

### Costruzione

- `range(stop)`
- `range(start, stop[, step])`
  - genera un vettore numerico con estremo finale escluso
  - esempi:
    - `range(4)` -> `[0,1,2,3]`
    - `range(1,5)` -> `[1,2,3,4]`
    - `range(0,10,2)` -> `[0,2,4,6,8]`

- `array(dim, expr)`
- `array([d0,d1,...], expr)`
  - costruisce un vettore o una matrice valutando `expr` per ogni elemento
  - dentro `expr`, `$0`, `$1`, ... sono gli indici locali
  - esempi:
    - `array(3, 0)` -> `[0,0,0]`
    - `array(3, $0*2)` -> `[0,2,4]`
    - `array([2,3], $0+$1)` -> `[[0,1,2],[1,2,3]]`

### Accesso e slicing

I vettori possono essere indicizzati con sintassi in stile Python:

- `v[i]`
- `v[start:end]`
- `v[start:end:step]`

Sono supportati anche:

- indici negativi
- estremi opzionali

Esempi:

- `range(5)[2]` -> `2`
- `range(5)[1:4]` -> `[1,2,3]`
- `range(5)[::2]` -> `[0,2,4]`
- `range(5)[-1]` -> `4`

Per le matrici sono supportate entrambe le forme:

- `m[i]` restituisce la riga `i`
- `m[i][j]` restituisce l'elemento in posizione `i,j`
- `m[i, j]` restituisce lo stesso elemento con una sintassi piu compatta
- `m[righe, colonne]` consente slicing di righe e colonne nello stesso accesso, in stile NumPy

Esempi, assumendo:

- `m = [[1,2,3],[4,5,6],[7,8,9]]`

Allora:

- `m[0]` -> `[1,2,3]`
- `m[1][2]` -> `6`
- `m[1, 2]` -> `6`
- `m[0:2]` -> `[[1,2,3],[4,5,6]]`
- `m[:, 1]` -> `[2,5,8]`
- `m[:, 0]` -> `[1,4,7]`
- `m[:, -1]` -> `[3,6,9]`
- `m[0:2, 1:3]` -> `[[2,3],[5,6]]`
- `m[1, :]` -> `[4,5,6]`

La forma con `map(...)` resta comunque valida e puo essere utile quando si vuole essere espliciti:

- `map($value[1], m)` -> `[2,5,8]`

### Trasformazione

- `map(expr, array)`
  - trasforma un vettore o una matrice elemento per elemento
  - dentro `expr`:
    - `$value` è il valore corrente
    - `$0`, `$1`, ... sono gli indici locali
  - esempi:
    - `map($value*2, [1,2,3])`
    - `map($0+$value, [10,20,30])`
    - `map($0+$1, [[1,2],[3,4]])`

- `filter(condizione, array)`
  - filtra un vettore o una matrice
  - dentro `condizione`:
    - `$value` è il valore corrente
    - `$0`, `$1`, ... sono gli indici locali
  - esempi:
    - `filter($value>0, [-2,0,3,4])`
    - `filter($0%2===0, [10,20,30,40])`

### Riduzione

- `reduce(op_o_funzione, vettore[, init])`
- `reduce(op_o_funzione, matrice, asse[, init])`

Riduce progressivamente:

- un vettore a uno scalare
- una matrice lungo un asse

Per le matrici:

- `asse = 0` riduce per colonne
- `asse = 1` riduce per righe

Esempi:

- `reduce(+, [1,2,3])` -> `6`
- `reduce(max, [3,7,2])` -> `7`
- `reduce(+, [[1,2],[3,4]], 0)` -> `[4,6]`
- `reduce(+, [[1,2],[3,4]], 1)` -> `[3,7]`

### Append e concatenazione

- `append(vettore, valore)`
  - aggiunge un elemento in fondo a un vettore

- `append(vettore, vettore2)`
  - concatena due vettori

- `append(matrice, vettoreRiga)`
  - aggiunge una riga a una matrice, se la lunghezza è compatibile

Esempi:

- `append([1,2], 3)` -> `[1,2,3]`
- `append([1,2], [3,4])` -> `[1,2,3,4]`
- `append([[1,2],[3,4]], [5,6])` -> `[[1,2],[3,4],[5,6]]`

### Nota semantica

Le funzioni e gli operatori non scalari sono pensati per lavorare in modo coerente su numeri, vettori e matrici numeriche. In presenza di forme non compatibili, per esempio vettori di lunghezza diversa o matrici non rettangolari, l'espressione fallisce con errore di valutazione.

## Sottomodelli

STGraphX supporta i `sottomodelli` come nodi speciali che referenziano un altro modello salvato in un file JSON separato.

Principi d'uso:
- un `sottomodello` è un nodo del modello padre
- il file del `sottomodello` è esterno, non incorporato inline nel JSON del modello padre
- il file padre e i file figlio devono stare nella stessa cartella
- l'interfaccia del `sottomodello` è definita dai nodi `input` e `output` del modello figlio
- gli input del `sottomodello` possono avere binding espliciti nel modello padre, oppure restare vuoti e usare i default definiti nel modello figlio

Uso pratico:
1. crea o seleziona un nodo di tipo `sottomodello`
2. usa `Apri` per scegliere il file JSON del `sottomodello` oppure per aggiornarlo
3. una volta disponibile, usa `Mostra` per aprire il modello figlio
4. quando carichi un modello padre che contiene `sottomodelli`, l'app può chiedere anche la cartella del modello per risolvere automaticamente i file figlio

Note:
- le uscite del `sottomodello` sono accessibili nel modello padre con la notazione `nomeSottomodello.nomeOutput`
- lo stato interno dei nodi di stato del `sottomodello` resta locale al modello figlio
- padre e figli condividono la stessa base dei tempi: `time`, `t0`, `t1`, `dt`

## Widget grafico x-y

Il widget grafico x-y consente di definire una o più coppie `x -> y`, dove `x` e `y` possono essere il tempo oppure nodi di output.

### Casi supportati

Per ogni coppia `x -> y`, il comportamento attuale è il seguente.

Per ogni coppia `x -> y`, il widget supporta due opzioni indipendenti:

- `Serie nel tempo`
  - e la modalita di default
  - ogni componente genera una serie distinta nel tempo

- `Profilo istantaneo`
  - si applica ai casi in cui `y` e vettoriale
  - a ogni istante, i punti del vettore vengono letti come un unico profilo
  - se l'opzione linea e attiva, il widget collega in quell'istante i punti successivi del profilo
  - esempio: se `x=[0,1]` e `y=[0,1]`, il widget puo visualizzare il segmento da `(0,0)` a `(1,1)`
  - le due opzioni non sono alternative: si possono tenere attive entrambe

- `x` scalare, `y` scalare
  - viene generata una singola serie
  - a ogni passo temporale si aggiunge il punto `(x(t), y(t))`

- `x` scalare, `y` vettore
  - viene generata una serie per ogni componente del vettore `y`
  - a ogni passo temporale si aggiungono i punti:
    - `(x(t), y[0](t))`
    - `(x(t), y[1](t))`
    - ...
  - se e attivo anche `Profilo istantaneo`, il widget puo mostrare anche il profilo corrente costruito dai punti `(x(t), y[i](t))`

- `x` vettore, `y` vettore della stessa dimensione
  - in modalita `Serie nel tempo`
    - viene generata una serie per ogni componente
    - a ogni passo temporale si aggiungono i punti:
      - serie 0: `(x[0](t), y[0](t))`
      - serie 1: `(x[1](t), y[1](t))`
      - ...
  - in modalita `Profilo istantaneo`
    - viene generata una sola serie istantanea
    - a ogni refresh il widget collega i punti:
      - `(x[0](t), y[0](t))`
      - `(x[1](t), y[1](t))`
      - ...

In tutti questi casi la legenda resta semplificata e usa la forma:
- `x -> y`

### Casi non supportati

Attualmente il widget non tratta i seguenti casi:

- `x` vettore, `y` scalare
- matrici come sorgente `x`
- matrici come sorgente `y`
- `x` e `y` vettori di dimensioni diverse

Se una coppia rientra in uno di questi casi, il widget non aggiunge punti per quella coppia.

### Modalita di visualizzazione dei punti

Per ogni coppia si puo scegliere anche come visualizzare i punti:

- `No punti`
  - vengono disegnate solo le linee, se attive

- `Ultimo punto`
  - viene disegnato solo l'ultimo punto di ogni serie
  - nel caso vettoriale questo significa:
    - un ultimo punto per ogni componente / serie
  - questa opzione e particolarmente utile per animazioni
  - in modalita `Profilo istantaneo`, per non perdere il profilo corrente, il widget disegna comunque tutti i punti del profilo istantaneo

- `Punti`
  - vengono disegnati tutti i punti della serie

### Nota pratica

Quando `x` oppure `y` sono vettoriali, una singola coppia `x -> y` puo quindi generare piu serie interne, anche se nel pannello del widget compare come una sola coppia configurata.
