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

const scoreKeeper = (function scoreKeeper() {
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let tieCount = 0;

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

  const getValidSquares = function getValidSquares() {
    let squareNumber = 0;
    const validSquares = [];
    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board.length; j += 1) {
        if (checkValidSquare(squareNumber)) validSquares.push(squareNumber);
        squareNumber += 1;
      }
    }
    return validSquares;
  };

  // const rowCol = function rowCol(square) {
  //   const row = Math.floor(square / 3);
  //   const col = square % 3;

  //   return { row, col };
  // };

  // there are 8 win conditions, returns true if there is a win
  function checkThreeInARow() {
    const tempBoard = getBoard();
    const player = getTurn();
    return (
      (tempBoard[0][0] === player && tempBoard[0][1] === player && tempBoard[0][2] === player)
      || (tempBoard[0][0] === player && tempBoard[1][0] === player && tempBoard[2][0] === player)
      || (tempBoard[0][0] === player && tempBoard[1][1] === player && tempBoard[2][2] === player)
      || (tempBoard[0][1] === player && tempBoard[1][1] === player && tempBoard[2][1] === player)
      || (tempBoard[0][2] === player && tempBoard[1][2] === player && tempBoard[2][2] === player)
      || (tempBoard[0][2] === player && tempBoard[1][1] === player && tempBoard[2][0] === player)
      || (tempBoard[1][0] === player && tempBoard[1][1] === player && tempBoard[1][2] === player)
      || (tempBoard[2][0] === player && tempBoard[2][1] === player && tempBoard[2][2] === player)
    );
  }

  // returns true if the game is a tie
  function checkTie() {
    const tempBoard = getBoard();
    const flattenedBoard = tempBoard.flat();
    const found = flattenedBoard.find((square) => square === 0);
    console.log(found);
    return found !== 0;
  }

  const updateBoard = function updateBoard(square) {
    const row = Math.floor(square / 3);
    const col = square % 3;
    board[row][col] = turn;
  };

  const resetGameVariables = function resetGameVariables() {
    gameOver = false;
    turn = 1;

    // fill board with 0s so it can be filled again
    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board.length; j += 1) {
        board[i][j] = 0;
      }
    }
  };

  return {
    getGameState,
    getTurn,
    gameFinished,
    changeTurn,
    getBoard,
    getValidSquares,
    checkValidSquare,
    checkThreeInARow,
    checkTie,
    updateBoard,
    resetGameVariables,
  };
}());

// easy AI just makes random moves
function easyAI() {
  const validSquares = gameController.getValidSquares();
  console.log(validSquares);
  const randomSquare = validSquares[Math.floor(Math.random() * validSquares.length)];
  const squareText = mapping.squareMappingToText.get(randomSquare);
  console.log(squareText);
  const squareElement = document.querySelector(`.${squareText}`);
  squareElement.style.backgroundColor = "orange";
  gameController.updateBoard(randomSquare);
}

// makes the optimal move, so it never loses
function impossibleAI() {

}

const viewController = function viewController(mode) {
  const content = document.querySelector('content');
  const squares = [];

  function getSquares() {
    return squares;
  }

  // make all squares empty, set turn to 1
  function resetBoard() {
    for (let i = 0; i < squares.length; i += 1) {
      squares[i].style.backgroundColor = 'white';
    }
    gameController.resetGameVariables();
  }

  function createPlayAgainButton() {
    const playAgainButton = document.createElement('div');
    playAgainButton.classList.add('play-again-button');
    playAgainButton.textContent = 'Play again?';
    content.appendChild(playAgainButton);
    playAgainButton.addEventListener('click', resetBoard);
    return playAgainButton;
  }

  function createScores() {
    const scoreContainer = document.createElement('div');
    scoreContainer.classList.add('score-container');

    const playerOneScoreDisplay = document.createElement('div');
    playerOneScoreDisplay.classList.add('score');
    playerOneScoreDisplay.classList.add('player-one');
    playerOneScoreDisplay.textContent = 'Player One: 0';

    const playerTwoScoreDisplay = document.createElement('div');
    playerTwoScoreDisplay.classList.add('score');
    playerTwoScoreDisplay.classList.add('player-two');
    playerTwoScoreDisplay.textContent = 'Player Two: 0';

    const tieDisplay = document.createElement('div');
    tieDisplay.classList.add('score');
    tieDisplay.classList.add('tie');
    tieDisplay.textContent = 'Tie: 0';

    scoreContainer.appendChild(playerOneScoreDisplay);
    scoreContainer.appendChild(tieDisplay);
    scoreContainer.appendChild(playerTwoScoreDisplay);

    content.appendChild(scoreContainer);
  }

  function updateScoreElements(winner) {
    let playerScoreElement;
    if (winner === 1) {
      playerScoreElement = document.querySelector('.player-one');
    } else if (winner === 2) {
      playerScoreElement = document.querySelector('.player-two');
    } else {
      playerScoreElement = document.querySelector('.tie');
    }
    // extract just the bit before :
    const previousText = (playerScoreElement.textContent).split(':')[0];
    console.log(previousText);

    const newScore = scoreKeeper.getPlayerScore(winner);
    const newText = `${previousText}${newScore}`;
    console.log(newText);
    playerScoreElement.textContent = newText;
  }

  const squareClicked = function squareClicked(e) {
    const squareElement = e.target;
    const square = squareElement.className.split(' ')[1];
    const squareAsNum = mapping.squareMappingToNumber.get(square);
    const turn = gameController.getTurn();
    console.log("turn is", turn);
    // check if player can make the move before updating DOM and backend
    if (gameController.checkValidSquare(squareAsNum) && !gameController.getGameState()) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line no-unused-expressions
      gameController.getTurn() === 1 ? squareElement.style.backgroundColor = 'red' : squareElement.style.backgroundColor = 'black';
      gameController.updateBoard(squareAsNum);
      console.log(gameController.checkThreeInARow());
      // check if player has won
      if (gameController.checkThreeInARow()) {
        gameController.gameFinished();
        console.log(`game is over ${gameController.getTurn()} has won`);
        createPlayAgainButton();
        scoreKeeper.updateScore(turn);
        updateScoreElements(turn);
        return;
      }
      gameController.changeTurn();

      if (gameController.checkTie()) {
        gameController.gameFinished();
        scoreKeeper.updateScore(0);
        updateScoreElements(0);
        createPlayAgainButton();
      }
      const gameOver = gameController.getGameState();

      if (!gameOver) {
        // mode 0 is easy AI, 1 impossible
        if (mode === 0) {
          easyAI();
          if (gameController.checkThreeInARow()) {
            gameController.gameFinished();
            scoreKeeper.updateScore(gameController.getTurn());
            updateScoreElements(gameController.getTurn());
            console.log('AI has won');
            createPlayAgainButton();
          }
          gameController.changeTurn();
        } else if (mode === 1) {
          impossibleAI();
        }
      }
    }
  };

  const createSquare = function createSquare(squareNumber) {
    const tictactoeSquare = document.createElement('div');
    tictactoeSquare.classList.add('tictactoe-square');
    tictactoeSquare.classList.add(mapping.squareMappingToText.get(squareNumber));
    tictactoeSquare.addEventListener('click', squareClicked);
    return tictactoeSquare;
  };

  const createGameBoard = function gameBoard() {
    const tictactoeContainer = document.createElement('div');
    tictactoeContainer.classList.add('tictactoe-grid');

    for (let i = 0; i < 9; i += 1) {
      const square = createSquare(i);
      tictactoeContainer.appendChild(square);
      squares.push(square);
    }

    content.appendChild(tictactoeContainer);
  };

  createGameBoard();
  createScores();
  return {
    createPlayAgainButton, createScores, updateScoreElements, createGameBoard, getSquares,
  };
};

const initializeGame = function initializeGame(mode) {
  viewController(mode);
};

initializeGame(0);
