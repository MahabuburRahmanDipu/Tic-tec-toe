let OriginBoard;
let huPlayer = 'O';
let aiPlayer = 'X';
const winCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const cellS = document.querySelectorAll('.cell');
StartGame();

function selectSym(sym) {
  huPlayer = sym;
  aiPlayer = sym === 'O' ? 'X' : 'O';
  OriginBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cellS.length; i++) {
      cellS[i].addEventListener('click', turnClick, false);
  }
  if (aiPlayer === 'X') {
      turn(bestSpot(), aiPlayer);
  }
  document.querySelector('.selectSym').style.display = "none";
}

function StartGame() {
  document.querySelector('.endgame').style.display = "none";
  document.querySelector('.endgame .text').innertext = "";
  document.querySelector('.selectSym').style.display ="block";
  for (let i = 0; i < cellS.length; i++) {
      cellS[i].innerText = "";
      cellS[i].style.removeProperty('background-color');
  }
}

function turnClick(square) {
  if (typeof OriginBoard[square.target.id] ==='number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(OriginBoard, huPlayer) && !checkTie())  
    turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, Player) {
  OriginBoard[squareId] = Player;
  document.getElementById(squareId).innerHTML = Player;
  let gameWon = checkWin(OriginBoard, Player);
  if (gameWon) gameOver(gameWon);
  checkTie();
}

function checkWin(board, Player) {
  let plays = board.reduce((a, e, i) => ( e === Player) ? a.concat(i) : a, []); 
  let gameWon = null;
  for (let [index, Win] of winCombo.entries()) {
      if (Win.every(elem => plays.indexOf(elem) > -1)) {
          gameWon = {index: index, Player: Player}
          break;
      }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombo[gameWon.index]) {
      document.getElementById(index).style.backgroundColor =gameWon.Player === huPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cellS.length; i++) {
      cellS[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.Player === huPlayer ? "You win" :"You lose!");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return OriginBoard.filter((elm, i) => i === elm);
}

function bestSpot() {
  return minimax(OriginBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0){
    for (cell of cellS) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener('click',turnClick, false);
    }
    declareWinner("Tie game");
    return true;
  } 
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, huPlayer)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 10};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  
  var moves = [];
  for (let i = 0; i < availSpots.length; i ++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    
    if (player === aiPlayer)
      move.score = minimax(newBoard, huPlayer).score;
    else
       move.score =  minimax(newBoard, aiPlayer).score;
    newBoard[availSpots[i]] = move.index;
    if ((player === aiPlayer && move.score === 10) || (player === huPlayer && move.score === -10))
      return move;
    else 
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === aiPlayer) {
    bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
