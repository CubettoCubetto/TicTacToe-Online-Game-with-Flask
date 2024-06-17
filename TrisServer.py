from flask import *
import time
import secrets

# Lista globale per memorizzare le partite create
listGames = []
# Griglia principale per lo sviluppo
main_grid_for_development = [0, 0, 1, 0, 2, 0, 0, 0, 0]

class TrisGame:
    # Inizializza una nuova partita
    def __init__(self, serverName, serverPassword):
        # tenere conto dei punteggi per sapere chi è in vantaggio
        self.winCerchi = 0
        self.winX = 0
        self.pareggi = 0

        self.ultimoTurnoHaIniziatoX = 1

        self.gameIsEnded = [False, False] # [se il primo giocatore è ancora in schermata restart, se il secondo lo è]
        self.gameIsEndedWithADraw = False
        self.gameIsEndedWithCircleWin = False

        self.serverName = serverName
        self.serverPassword = serverPassword
        # Genera ID unici per i giocatori attraverso la funzione di hash. Questo fa si che inviare le mosse al posto dell'avversario sia impossibile
        self.idPlayer1 = str(hash(serverName+serverPassword+"giocatore1"+"randomString312316%6123"+str(time.time()+secrets.randbelow(10*10*10*10))))
        self.idPlayer2 = str(hash(serverName+serverPassword+"giocatore2"+"ranri1232316ùà#6123"+str(time.time()+secrets.randbelow(10*10*10*10))))

        # Inizializza la griglia di gioco
        self.griglia = [0 for i in range(9)] # griglia in cui 0 è vuota, 1 c'è la x, 2 c'è il cerchio
        self.turno = "1"
        self.login = [False, False] # [se il player 1 è entrato nella room, se il player 2 è entrato nella room]

    # Rappresentazione stringa dell'oggetto
    def __str__(self):
        return f"name: {self.serverName}, psswd:{self.serverPassword}, id1:{self.idPlayer1}, id2:{self.idPlayer2}"

    # Controlla se c'è un vincitore
    def checkWin(self):
        WINNING_COMBINATIONS = [
            # Tre righe orizzontali
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            # Tre colonne
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            # Due diagonali
            [0, 4, 8],
            [2, 4, 6]
        ]
        # Controlla ogni combinazione vincente
        for combinazione in WINNING_COMBINATIONS:
            if self.griglia[combinazione[0]] == self.griglia[combinazione[1]] == self.griglia[combinazione[2]] != 0:
                return self.griglia[combinazione[0]]
        return 0

    # Controlla se c'è un pareggio
    def checkDraw(self):
        # se tutte le celle sono occupate (diverse da 0) e nessuno ha vinto return True
        return all(element != 0 for element in self.griglia) and not self.checkWin()

    # Esegue una mossa sulla griglia
    def faiUnaMossa(self, i):
        if self.griglia[i] == 0:
            self.griglia[i] = int(self.turno)
            win = self.checkWin()
            draw = self.checkDraw()

            # Aggiorna lo stato della partita in base al risultato
            if draw: # c'è stato un pareggio
                self.gameIsEnded = [True, True]
                self.gameIsEndedWithADraw = True
            elif win == 1: # quindi ha vinto X
                self.gameIsEnded = [True, True]
                self.gameIsEndedWithCircleWin = False
                self.gameIsEndedWithADraw = False
            elif win == 2: # quindi ha vinto Cerchio
                self.gameIsEnded = [True, True]
                self.gameIsEndedWithCircleWin = True
                self.gameIsEndedWithADraw = False

            # Cambia il turno del giocatore
            if self.turno == "1":
                self.turno = "2"
            else:
                self.turno = "1"

    # Reset della partita
    def resetGame(self, firstPlayer):
        draw = self.checkDraw()
        win = self.checkWin()

        self.gameIsEnded[0 if firstPlayer else 1] = False # metto a False per il giocatore che ha chiesto il reset

        if draw or win != 0: # se il gioco è finito, questo sarà letto solo per il reset del primo giocatore,
        # mentre il secondo non resetterà di nuovo il game, visto che entrambi premeranno "restart" in due momenti diversi
            self.griglia = [0 for i in range(9)]
            if draw == 1: # se è pareggio, facciamo iniziare chi non ha iniziato nel turno prima
                self.pareggi += 1
                if self.ultimoTurnoHaIniziatoX:
                    self.ultimoTurnoHaIniziatoX = False
                    self.turno = "2"
                else:
                    self.ultimoTurnoHaIniziatoX = True
                    self.turno = "1"

            if win == 1: # se ha vinto x allora facciamo iniziare cerchio
                self.ultimoTurnoHaIniziatoX = False
                self.turno = "2"
                self.winX += 1

            if win == 2: # se ha vinto cerchio facciamo iniziare X
                self.ultimoTurnoHaIniziatoX = False
                self.turno = "1"
                self.winCerchi += 1


# Crea una nuova partita
def createNewGame(nome, password):
    # Controlla se una partita con questo nome esiste già
    for game in listGames:
        if game.serverName == nome:
            response_data = {
                "managedError": "There is already a room with this name",
                "idPlayer1": "",
                "id": 1
            }
            return response_data
    g1 = TrisGame(nome, password)
    listGames.append(g1)
    response_data = {
        "managedError": "null",
        "idPlayer1": g1.idPlayer1,
        "id": 1
    }
    g1.login[0] = True
    res = make_response(jsonify(response_data))
    res.set_cookie('idPlayer', g1.idPlayer1, "SameSite", "None")

    return res

# Reset della partita esistenteme)
def resetGame(idPlayer_cookies):
    for g in listGames:
        if g.idPlayer1 == idPlayer_cookies or g.idPlayer2 == idPlayer_cookies:
            g.resetGame(g.idPlayer1 == idPlayer_cookies)
            response_data = {
                "turno": g.turno,
                "griglia": g.griglia,
                "id": g.idPlayer1 == idPlayer_cookies
            }
            return jsonify(response_data)
    # Nel caso il idPlayer non esista più
    response_data = {
        "errore": "Stanza non trovata"
    }
    return jsonify(response_data)

# Aggiorna lo stato della partita
def updateGame(idPlayer_cookies):
    for g in listGames:
        if g.idPlayer1 == idPlayer_cookies or g.idPlayer2 == idPlayer_cookies:
            response_data = {
                "turno": g.turno,
                "griglia": g.griglia,
                "id": g.idPlayer1 == idPlayer_cookies,
                "x_win": g.winX,
                "circle_win": g.winCerchi,
                "pareggi": g.pareggi,
                "gameEnded": g.gameIsEnded[0 if g.idPlayer1 == idPlayer_cookies else 1],
                "gameEndedInADraw": g.gameIsEndedWithADraw,
                "gameIsEndedWithCircleWin": g.gameIsEndedWithCircleWin
            }

            return jsonify(response_data)
    # Nel caso il idPlayer non esista più
    response_data = {
        "errore": "Stanza non trovata"
    }
    return jsonify(response_data)

# Esegue una mossa nella partita. i controlli se la mossa è valida verranno fatti su faiUnaMossa
def makeMove(request):
    idPlayer_cookies = request.cookies.get('idPlayer')
    print(idPlayer_cookies)
    data = request.json
    for g in listGames:
        if g.idPlayer1 == idPlayer_cookies and g.turno == "1":
            g.faiUnaMossa(data["move"])
        elif g.idPlayer2 == idPlayer_cookies and g.turno == "2":
            g.faiUnaMossa(data["move"])
    return jsonify({"managedError": "null"})

# Permette a un giocatore di unirsi a una partita esistente
def joinGame(serverName, serverPassword):
    for g in listGames:
        if serverName == g.serverName:
            if serverPassword == g.serverPassword:
                if not g.login[0]:
                    g.login[0] = True
                    response_data = {
                        "managedError": "null",
                        "idPlayer1": g.idPlayer1,
                        "id": 1
                    }
                    res = make_response(jsonify(response_data))
                    res.set_cookie('idPlayer', g.idPlayer1, "SameSite", "None")
                    return res
                # Login per il giocatore 2
                elif not g.login[1]:
                    response_data = {
                        "managedError": "null",
                        "idPlayer1": g.idPlayer2,
                        "id": 2
                    }
                    res = make_response(jsonify(response_data))
                    res.set_cookie('idPlayer', g.idPlayer2, "SameSite", "None")
                    return res
                else:
                    return jsonify({"managedError": "entrambi i player hanno già fatto l'accesso", "idPlayer1": "none"})
            else:
                return jsonify({"managedError": "password sbagliata", "idPlayer1": "none"})
    else:
        return jsonify({"managedError": "server non trovato", "idPlayer1": "none"})
