const scoreKeeper = (function scoreKeeper() {
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let tieCount = 0;

  const scoreContainer = document.createElement('div');
  scoreContainer.classList.add('score-container');

  const playerOneScoreDisplay = document.createElement('div');
  playerOneScoreDisplay.classList.add('score');
  playerOneScoreDisplay.classList.add('player-one');
  playerOneScoreDisplay.textContent = `Player One: ${playerOneScore}`;

  const playerTwoScoreDisplay = document.createElement('div');
  playerTwoScoreDisplay.classList.add('score');
  playerTwoScoreDisplay.classList.add('player-two');
  playerTwoScoreDisplay.textContent = `Player Two: ${playerTwoScore}`;

  const tieDisplay = document.createElement('div');
  tieDisplay.classList.add('score');
  tieDisplay.classList.add('tie');
  tieDisplay.textContent = `Tie: ${tieCount}`;

  scoreContainer.appendChild(playerOneScoreDisplay);
  scoreContainer.appendChild(tieDisplay);
  scoreContainer.appendChild(playerTwoScoreDisplay);

  const content = document.querySelector('content');
  content.appendChild(scoreContainer);

  function getPlayerScore(player) {
    if (player === 0) {
      return tieCount;
    // eslint-disable-next-line no-else-return
    } else if (player === 1) {
      return playerOneScore;
    } else {
      return playerTwoScore;
    }
  }

  function updateScore(winner) {
    if (winner === 0) {
      tieCount += 1;
    } else if (winner === 1) {
      playerOneScore += 1;
    } else {
      playerTwoScore += 1;
    }
    return winner;
    // updateDisplay(winner);
  }

  return {
    updateScore,
    getPlayerScore,
  };
}());

const viewController = (function viewController() {
  const content = document.querySelector('content');

  function createPlayAgainButton() {
    const playAgainButton = document.createElement('div');
    playAgainButton.classList.add('play-again-button');
    playAgainButton.textContent = 'Play again?';
    content.appendChild(playAgainButton);

    return playAgainButton;
  }

  function updateScoreElements(winner) {
    let playerScoreElement;
    if (winner === 1) {
      playerScoreElement = document.querySelector('.player-one');
    } else if (winner === 2) {
      playerScoreElement = document.querySelector('.player-two');
    } else {
      playerScoreElement = document.querySelector('score tie');
    }
    const previousText = playerScoreElement.textContent;
    console.log(previousText);
    const newScore = scoreKeeper.getPlayerScore(winner);
    const newText = `${previousText.substring(0, previousText.length - 1)}${newScore}`;
    console.log(newText);
    playerScoreElement.textContent = newText;
  }
  return { createPlayAgainButton, updateScoreElements };
}());

const gameController = (function gameController() {
  let gameOver = false;
  let turn = 1;
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
    turn = turn === 1 ? 2 : 1;
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

  function checkThreeInARow(square) {
    // need to check three cases: horizontal, vertical, diagonal
    const tempBoard = getBoard();
    const row = Math.floor(square / 3);
    const col = square % 3;
    let horizontal = true;
    let vertical = true;
    let diagonal = true;
    const positiveDiagonalSet = [2, 4, 6];
    const negativeDiagonalSet = [0, 4, 8];

    // horizontal check
    for (let i = 0; i < 3; i += 1) {
      if (tempBoard[row][i] !== turn) {
        horizontal = false;
        break;
      }
    }

    // vertical check
    for (let i = 0; i < 3; i += 1) {
      if (tempBoard[i][col] !== turn) {
        vertical = false;
        break;
      }
    }

    if ((square % 2) === 0) {
      // positive diagonal check
      if (positiveDiagonalSet.includes(square)) {
        for (let r = 2, c = 0; c < 3; c += 1, r -= 0) {
          if (tempBoard[r][c] !== turn) {
            diagonal = false;
          }
        }
      }

      // negative diagonal check
      if (negativeDiagonalSet.includes(square)) {
        for (let i = 0; i < 3; i += 1) {
          if (tempBoard[i][i] !== turn) {
            diagonal = false;
          }
        }
      }
    } else {
      diagonal = false;
    }

    return horizontal || vertical || diagonal;
  }

  const updateBoard = function updateBoard(square) {
    const row = Math.floor(square / 3);
    const col = square % 3;
    board[row][col] = turn;
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
  const turn = gameController.getTurn();

  // check if player can make the move before updating DOM and backend
  if (gameController.checkValidSquare(squareAsNum) && !gameController.getGameState()) {
    gameController.getTurn() === 1 ? squareElement.style.backgroundColor = 'red' : squareElement.style.backgroundColor = 'black';
    gameController.updateBoard(squareAsNum);

    // check if any player has won
    if (gameController.checkThreeInARow(squareAsNum)) {
      gameController.gameFinished();
      console.log(`game is over ${gameController.getTurn()} has won`);
      viewController.createPlayAgainButton();
      scoreKeeper.updateScore(turn);
      viewController.updateScoreElements(turn);
    }
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
  content.appendChild(tictactoeContainer);
};

const generateContent = function generateContent() {
  gameBoard();
};

generateContent();
