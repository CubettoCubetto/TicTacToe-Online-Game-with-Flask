const urlServer = "http://127.0.0.1:8002"

let iAmX = false // indica se il giocatore sta usando le X (o, se è false, sta usando i cerchi)
let gameEnded = false // indica se il game è finito e sono nella schermata col pulsante "restart"
const X_CLASS = "x"
const CIRCLE_CLASS = "circle"
const board = document.getElementById('board')
const cellElements = document.querySelectorAll('[data-cell]') // lista con tutte i 9 div riquadri dove posizionare le celle
let circleTurn = false //a chi tocca? al cerchio?
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const homeButton =  document.getElementById('homeButton')
const NUM_PLAYERS = new URLSearchParams(window.location.search).get('num_players');

const WINNING_COMBINATIONS = [
    /* ricordiamo che gli indici delle celle della board sono i seguenti:
    [0,1,2]
    [3,4,5]
    [6,7,8]
    perciò-->*/

    //le tre linee orizzontali
    [0,1,2],
    [3,4,5],
    [6,7,8],

    //le tre colonne
    [0,3,6],
    [1,4,7],
    [2,5,8],

    // le due diagonali
    [0,4,8],
    [2,4,6]
] // se una di queste combinazioni è vera, allora qualcuno ha vinto. 
// Per approfondimenti vedere checkWin()

StartGame() 

homeButton.addEventListener('click', goHome)
restartButton.addEventListener('click', StartGame)
restartButton.addEventListener("mouseover", () => {
  restartButton.classList.add("hovered")
});


function goHome(){ // se clicco il pulsante "Home" in alto a sinistra
  if(window.confirm("vuoi tornare alla home?")){
    window.location.href = urlServer;
  }  // se nell'alert "vuoi tornare alla home" allora spedire il client alla home
}

// dato il div che è stato cliccato, trovare qual è la cella cliccata 
// naturalmente restuisce un intero tra 0 e 8 inclusi
function getNumberCellFromClick(e){ 
  const cell = e.target
  for (let i = 0; i < 9; i++) {
    if (cellElements[i] == cell){
      return i
    }
  }
  return null
}

// quando viene cliccata una delle 9 celle. Il controllo se la mossa è valida lo farà il backend in python
function handleClick(e) {
  fetch(urlServer + "/api/makeMove",
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      "idPlayer1": "id1", //questa informazione non viene più utilizzate nelle nuove versioni, il backend controlla chi siamo attraverso i cookies
      "move": getNumberCellFromClick(e)
    })
  })
  .then(getUpdate())
  
}



function placeMark(cell, class_to_place){
    cell.classList.add(class_to_place)
}

/*data la grid ricevuta dal backend,  che è un array di 9 interi, dove 0 è vuota, 1 è x, 2 è cerchio
il boolean IPlayForX che indica se giochiamo come X 
turno che dice di chi è il turno

aggiungo a ogni cell la classe necessaria per mostrare la pedina giusta (se c'è una X aggiungerò X_Class)
*/
function updateCells(grid, IPlayForX, turno){
  iAmX = IPlayForX

  //aggiorno la variabile globale circleTurn
  if (turno == 1){
    circleTurn = false
  }
  else{
    circleTurn = true
  }
  setBoardHoverClass()
  for (let i = 0; i < 9; i++) {
    cellElements[i].classList.remove(X_CLASS)
    cellElements[i].classList.remove(CIRCLE_CLASS)
    
    cellElements[i].classList.remove("x-turn")
    cellElements[i].classList.remove("circle-turn")
    if(grid[i] == 1){
      cellElements[i].classList.add(X_CLASS)
    }
    else if(grid[i] == 2){
      cellElements[i].classList.add(CIRCLE_CLASS)
    }

    // questo serve per decidere il colore del background (rosso o verde)
    cellElements[i].classList.add(circleTurn ? "circle-turn" : "x-turn")
  } 
}

function swapTurns() {
    circleTurn = !circleTurn
}

// per creare la ombra quando passi col cursore sopra una casella dove puoi giocare
function setBoardHoverClass(){
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)

  if(circleTurn && !iAmX){ // se tocca a te e sei cerchio
    board.classList.add(CIRCLE_CLASS)
  }
  if(!circleTurn && iAmX){ // se tocca a te e sei X
    board.classList.add(X_CLASS)
  }
}

// si aggiorna la stringa sopra il punteggio "You are plaing with X/O" e gli si cambia il colore (rosso/verde)
function updateStringWhoIAm(){

  // le rimuovo entrambe
  document.getElementById("whoIamPlayingFor").classList.remove("x")
  document.getElementById("whoIamPlayingFor").classList.remove("circle")
  
  if(iAmX){
    document.getElementById("whoIamPlayingFor").classList.add("x")
    document.getElementById("whoIamPlayingFor").innerHTML = "You are playinh with X"
  }
  else{
    document.getElementById("whoIamPlayingFor").classList.add("circle")
    document.getElementById("whoIamPlayingFor").innerHTML = "You are playinh with O"
  }
}

function StartGame(){
  gameEnded = false
  fetch(urlServer + "/api/resetGame")
  getUpdate()

  //ripristino la griglia togliendo ogni pedina
  cellElements.forEach(cell => {
      cell.classList.remove(X_CLASS)
      cell.classList.remove(CIRCLE_CLASS)
      cell.removeEventListener('click', handleClick)
      cell.addEventListener('click', handleClick)
  })

  winningMessageElement.classList.remove("show")
  winningMessageElement.classList.remove(CIRCLE_CLASS)
  winningMessageElement.classList.remove(X_CLASS)
  restartButton.classList.remove("hovered")

  gameEnded = false

}

function getUpdate(){
  if(!gameEnded){
    new_grid = fetch(urlServer + "/api/updateRoom")
    .then(response => response.json())  // convert a json
    .then(json => {
      updateCells(json.griglia, json.id, json.turno);
      updateStringWhoIAm()

      //aggiorno il numero di vittorie e pareggi dei vari giocatori
      document.getElementById('punteggi-x').innerHTML = json.x_win;
      document.getElementById('punteggi-circle').innerHTML = json.circle_win;
      document.getElementById('pareggi').innerHTML = json.pareggi;
      

      if(json.gameEnded){
        if(json.gameEndedInADraw){
          endGame(true)
        }
        else if(json.gameIsEndedWithCircleWin){
          endGame(false, CIRCLE_CLASS)
        }
        else{ //quindi ha vinto X
          endGame(false, X_CLASS)
        }
      }
    })
      
  
  }
  const timeOut = 0.3 //tempo in secondi con cui viene aggiornata la pagina
  setTimeout(getUpdate, timeOut * 1000);
}

function checkWin(grid){
  /* data la constante WINNING_COMBINATIONS con tutte le combinazioni vincenti,
  controlliamo se almeno una di quelle ha vinto, ovvero tutti e tre i valori sono uguali e diversi da 0

  quindi se ad esempio grid[0] == grid[1] == grid[2] != 0 (ovvero che ci sono delle pedine) 
  allora il player che ha la pedina su grid[0] ha vinto!*/

  for(var i = 0; i < WINNING_COMBINATIONS; i++){
    if(grid[WINNING_COMBINATIONS[i][0]] == grid[WINNING_COMBINATIONS[i][1]] 
      && grid[WINNING_COMBINATIONS[i][0]] == grid[WINNING_COMBINATIONS[i][2]]
      && grid[WINNING_COMBINATIONS[i][2]] != 0){
        return grid[WINNING_COMBINATIONS[i][2]]
      }
  } 
  return 0 // se nessuno vince restutisco 0, se vince X restituisco 1 e se vince O restituisco 2
}

function isDraw(grid){
  for(var i = 0; i < 9; i++){
    if(grid[i] == 0){
      return false // se c'è ancora una casella vuota, vuol dire che non è pareggio
    }
  }
  return checkWin(grid) == 0 // se tutte le caselle sono piene, e nessuno ha vinto, allora abbiamo pareggiato
}

//draw è un boolean, mentre class_win può essere "none" se è un pareggio, CIRCLE_CLASS o X_CLASS in base a chi ha vinto
function endGame(draw, class_win="none") {
  gameEnded = true
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
    winningMessageElement.classList.add("draw")
  } else 
  {
    if(class_win == CIRCLE_CLASS){
      winningMessageElement.classList.add(CIRCLE_CLASS)
    }
    else{
      winningMessageElement.classList.add(X_CLASS)
    }

    winningMessageTextElement.innerText = `${circleTurn ? "X's" : "O's"} Wins!`
  }
  winningMessageElement.classList.add('show')

}
  
  
  