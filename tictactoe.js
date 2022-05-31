const gameController = (function gameController() {
  let gameOver = false;
  let turn = true; // turn is true if first player's turn, false if second player's turn

  const getGameState = function getGameState() {
    return gameOver;
  };

  const getTurn = function getTurn() {
    return turn;
  };
  const gameFinished = function gameFinished() {
    gameOver = !gameOver;
  };

  const changeTurn = function changeTurn() {
    turn = !turn;
  };

  return {
    getGameState,
    getTurn,
    gameFinished,
    changeTurn,
  };
}());

const mapping = (function createMapping() {
  const squareMapping = new Map();
  squareMapping.set(1, 'one');
  squareMapping.set(2, 'two');
  squareMapping.set(3, 'three');
  squareMapping.set(4, 'four');
  squareMapping.set(5, 'five');
  squareMapping.set(6, 'six');
  squareMapping.set(7, 'seven');
  squareMapping.set(8, 'eight');
  squareMapping.set(9, 'nine');
  return squareMapping;
}());

const squareClicked = function squareClicked(e) {
  const square = e.target;
  square.style.backgroundColor = 'red';
  console.log('previous turn', gameController.getTurn());
  gameController.changeTurn();
  console.log('turn changed', gameController.getTurn());
};

const createSquare = function createSquare(squareNumber) {
  const tictactoeSquare = document.createElement('div');
  tictactoeSquare.classList.add('tictactoe-square');
  tictactoeSquare.classList.add(mapping.get(squareNumber));
  tictactoeSquare.addEventListener('click', squareClicked);
  return tictactoeSquare;
};

const gameBoard = function gameBoard() {
  const tictactoeContainer = document.createElement('div');
  tictactoeContainer.classList.add('tictactoe-grid');

  for (let i = 0; i < 9; i += 1) {
    const square = createSquare(i);
    tictactoeContainer.appendChild(square);
  }

  const content = document.querySelector('content');
  console.log(content);
  content.appendChild(tictactoeContainer);
};

gameBoard();
