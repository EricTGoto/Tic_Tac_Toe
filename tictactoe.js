const gameController = (function gameController() {
  let gameOver = false;
  let turn = true; // turn is true if first player's turn (X), false if second player's turn (O)
  const board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // 0 if empty, 1 if P1, 2 if P2

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

  const getBoard = function getBoard() {
    return [...board];
  };

  const checkValidSquare = function checkValidSquare(square) {
    const row = Math.floor(square / 3);
    const col = square % 3;

    return getBoard()[row][col] === 0;
  };

  // function checkThreeInARow() {
  //   // need to check three cases: horizontal, vertical, diagonal
  //   const tempBoard = getBoard();

  //   // horizontal check
  // }

  const updateBoard = function updateBoard(square, player) {
    const row = Math.floor(square / 3);
    const col = square % 3;
    board[row][col] = player ? 1 : 2;
  };

  return {
    getGameState,
    getTurn,
    gameFinished,
    changeTurn,
    getBoard,
    checkValidSquare,
    updateBoard,
  };
}());

const mapping = (function createMapping() {
  const squareMappingToText = new Map();
  squareMappingToText.set(0, 'zero');
  squareMappingToText.set(1, 'one');
  squareMappingToText.set(2, 'two');
  squareMappingToText.set(3, 'three');
  squareMappingToText.set(4, 'four');
  squareMappingToText.set(5, 'five');
  squareMappingToText.set(6, 'six');
  squareMappingToText.set(7, 'seven');
  squareMappingToText.set(8, 'eight');

  const squareMappingToNumber = new Map();
  squareMappingToNumber.set('zero', 0);
  squareMappingToNumber.set('one', 1);
  squareMappingToNumber.set('two', 2);
  squareMappingToNumber.set('three', 3);
  squareMappingToNumber.set('four', 4);
  squareMappingToNumber.set('five', 5);
  squareMappingToNumber.set('six', 6);
  squareMappingToNumber.set('seven', 7);
  squareMappingToNumber.set('eight', 8);

  return { squareMappingToText, squareMappingToNumber };
}());

const squareClicked = function squareClicked(e) {
  const squareElement = e.target;
  const square = squareElement.className.split(' ')[1];
  const squareAsNum = mapping.squareMappingToNumber.get(square);

  // check if player can make the move before updating DOM and backend
  if (gameController.checkValidSquare(squareAsNum)) {
    gameController.getTurn() ? squareElement.style.backgroundColor = 'red' : squareElement.style.backgroundColor = 'black';
    gameController.updateBoard(squareAsNum, gameController.getTurn());
    console.log(gameController.getBoard());
    console.log('previous turn', gameController.getTurn());
    gameController.changeTurn();
    console.log('turn changed', gameController.getTurn());
  }
};

const createSquare = function createSquare(squareNumber) {
  const tictactoeSquare = document.createElement('div');
  tictactoeSquare.classList.add('tictactoe-square');
  tictactoeSquare.classList.add(mapping.squareMappingToText.get(squareNumber));
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
