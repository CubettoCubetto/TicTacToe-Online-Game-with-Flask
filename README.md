# TicTacToe-with-Flask
Anteprima del gioco: https://youtu.be/TV5R1-nHoLA?si=3eLLuNFfDXGACRFL

Gioco multiplayer online per approfondire la mia conoscenza di Flask, javascript, css, utilizzo pratico dei cookies e blender per la creazione dell'immagine nello sfondo

Tutto il progetto è stato ideato e sviluppato interamente da me, come progetto personale per divertimento e approfondire la mia conoscenza relatica agli argomenti sopra citati.
Naturalmente, questo sito web è stato progettato per essere giocato su dispostivi diversi, in modo che due giocatori in luoghi e dispositivi completamente diversi possano sfidarsi e divertirsi insieme.

Lo scambio di informazioni tra Server e Client avviene grazie a delle richieste POST ai seguenti url
- /api/joinRoom   # per entrare in una stanza già creata come secondo giocatore
- /api/createRoom # per creare una stanza
- /api/makeMove   # per mandare al server una richiesta di effettuare una mossa. Il server effettuerà anche tutti i controlli che la mossa inviata sia effettivamente valida
- /api/updateRoom # richiesta che viene effettuata molteplici volte al secondo, per aggiornare la partita, il numero di vittorie, se il gioco è finito ecc...
- /api/resetGame  # quando un giocatore preme il pulsante "restart" esegue una richiesta POST a questo url, per chiedere il reset della partita

I cookies sono inoltre generati attraverso la funzione crittografica di Hash, rendendo impossibile barare inviando mosse al post dell'avversario.
