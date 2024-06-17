# TicTacToe-with-Flask
### Video anteprima del gioco
[![Link al video](https://i9.ytimg.com/vi_webp/TV5R1-nHoLA/mqdefault.webp?sqp=CNCbwLMG&rs=AOn4CLDk8I_2IyR1cB1tg2ZGTKWxfHGoNg)](https://youtu.be/TV5R1-nHoLA?si=Xm8e_RjTX4Js6RtM)

## Cos'è?
Gioco multiplayer online per approfondire la mia conoscenza di Flask, javascript, css, utilizzo pratico dei cookies e blender per la creazione dell'immagine nello sfondo della home

Tutto il progetto è stato ideato e sviluppato interamente da me, come progetto personale per divertimento e approfondire la mia conoscenza relatica agli argomenti sopra citati.
Naturalmente, questo sito web è stato progettato per essere giocato su dispostivi diversi, in modo che due giocatori in luoghi e dispositivi completamente diversi possano sfidarsi e divertirsi insieme.

Lo scambio di informazioni tra Server e Client avviene grazie a delle richieste POST ai seguenti url
- /api/joinRoom   # per entrare in una stanza già creata come secondo giocatore
- /api/createRoom # per creare una stanza
- /api/makeMove   # per mandare al server una richiesta di effettuare una mossa. Il server effettuerà anche tutti i controlli che la mossa inviata sia effettivamente valida
- /api/updateRoom # richiesta che viene effettuata molteplici volte al secondo, per aggiornare la partita, il numero di vittorie, se il gioco è finito ecc...
- /api/resetGame  # quando un giocatore preme il pulsante "restart" esegue una richiesta POST a questo url, per chiedere il reset della partita

I cookies sono inoltre generati attraverso la funzione crittografica di Hash, rendendo impossibile barare inviando mosse al post dell'avversario.

## Come installare 
Molto semplice, scaricare tutta la repository, installare python 3.9 o superiore, e eseguire i seguenti comandi per installare le varie librerie:
```
pip install Flask
pip install -U flask-cors
```
avviare TrisServer.py e aprire un browser in [http://127.0.0.1:8002](http://127.0.0.1:8002)
