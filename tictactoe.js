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

  // const rowCol = function rowCol(square) {
  //   const row = Math.floor(square / 3);
  //   const col = square % 3;

  //   return { row, col };
  // };

  function checkThreeInARow(square, player) {
    // need to check three cases: horizontal, vertical, diagonal
    const tempBoard = getBoard();
    const row = Math.floor(square / 3);
    const col = square % 3;
    const playerNum = player ? 1 : 2;
    let horizontal = true;
    let vertical = true;
    let diagonal = true;
    const positiveDiagonalSet = [2, 4, 6];
    const negativeDiagonalSet = [0, 4, 8];

    // horizontal check
    for (let i = 0; i < 3; i += 1) {
      if (tempBoard[row][i] !== playerNum) {
        horizontal = false;
        break;
      }
    }

    // vertical check
    for (let i = 0; i < 3; i += 1) {
      if (tempBoard[i][col] !== playerNum) {
        vertical = false;
        break;
      }
    }

    if ((square % 2) === 0) {
      // positive diagonal check
      if (positiveDiagonalSet.includes(square)) {
        for (let r = 2, c = 0; c < 3; c += 1, r -= 0) {
          if (tempBoard[r][c] !== playerNum) {
            diagonal = false;
          }
        }
      }

      // negative diagonal check
      if (negativeDiagonalSet.includes(square)) {
        for (let i = 0; i < 3; i += 1) {
          if (tempBoard[i][i] !== playerNum) {
            diagonal = false;
          }
        }
      }
    } else {
      diagonal = false;
    }

    return horizontal || vertical || diagonal;
  }

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
    checkThreeInARow,
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
    console.log(gameController.checkThreeInARow(squareAsNum, gameController.getTurn()));
    gameController.changeTurn();
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
