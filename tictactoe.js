// creates a 1D index mapping
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
  }

  function resetScore() {
    playerOneScore = 0;
    playerTwoScore = 0;
    tieCount = 0;
  }

  return {
    updateScore,
    getPlayerScore,
    resetScore,
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

  const changeGameState = function changeGameState() {
    gameOver = !gameOver;
  };

  const changeTurn = function changeTurn() {
    turn = turn === 1 ? 2 : 1;
  };

  const getBoard = function getBoard() {
    return [...board];
  };

  const checkValidSquare = function checkValidSquare(checkBoard, square) {
    const row = Math.floor(square / 3);
    const col = square % 3;

    return checkBoard[row][col] === 0;
  };

  // returns the 1D index of available positions
  const getValidSquares = function getValidSquares(checkBoard) {
    let squareNumber = 0;
    const validSquares = [];
    for (let i = 0; i < checkBoard.length; i += 1) {
      for (let j = 0; j < checkBoard.length; j += 1) {
        if (checkValidSquare(checkBoard, squareNumber)) validSquares.push(squareNumber);
        squareNumber += 1;
      }
    }
    return validSquares;
  };

  // there are 8 win conditions, returns true if there is a win
  function checkThreeInARow(checkBoard, player) {
    return (
      (checkBoard[0][0] === player && checkBoard[0][1] === player && checkBoard[0][2] === player)
      || (checkBoard[0][0] === player && checkBoard[1][0] === player && checkBoard[2][0] === player)
      || (checkBoard[0][0] === player && checkBoard[1][1] === player && checkBoard[2][2] === player)
      || (checkBoard[0][1] === player && checkBoard[1][1] === player && checkBoard[2][1] === player)
      || (checkBoard[0][2] === player && checkBoard[1][2] === player && checkBoard[2][2] === player)
      || (checkBoard[0][2] === player && checkBoard[1][1] === player && checkBoard[2][0] === player)
      || (checkBoard[1][0] === player && checkBoard[1][1] === player && checkBoard[1][2] === player)
      || (checkBoard[2][0] === player && checkBoard[2][1] === player && checkBoard[2][2] === player)
    );
  }

  // returns true if the game is a tie
  function checkTie(checkBoard) {
    const flattenedBoard = checkBoard.flat();
    const found = flattenedBoard.find((square) => square === 0);
    return found !== 0;
  }

  const updateBoard = function updateBoard(square) {
    const row = Math.floor(square / 3);
    const col = square % 3;
    board[row][col] = turn;
  };

  const resetGameVariables = function resetGameVariables() {
    if (getGameState()) changeGameState();
    turn = 1;

    // fill board with 0s so it can be filled again
    for (let i = 0; i < board.length; i += 1) {
      for (let j = 0; j < board.length; j += 1) {
        board[i][j] = 0;
      }
    }
  };

  // moves can only be made if the game isn't over (gameOver = false) and the square is not occupied
  const canPlay = function canPlay(square) {
    return checkValidSquare(getBoard(), square) && !getGameState();
  };

  return {
    getGameState,
    getTurn,
    changeGameState,
    changeTurn,
    getBoard,
    getValidSquares,
    checkValidSquare,
    checkThreeInARow,
    checkTie,
    updateBoard,
    resetGameVariables,
    canPlay,
  };
}());

// viewController is in charge of creating and manipulating the DOM
// it is instantiated once as an IIFE
const viewController = (function viewController() {
  const content = document.querySelector('content');
  let squares = [];

  function getSquares() {
    return squares;
  }

  function setSquares(newSquares) {
    squares = [...newSquares];
  }
  // make all squares empty, set turn to 1
  function resetBoard() {
    for (let i = 0; i < squares.length; i += 1) {
      squares[i].style.backgroundColor = '#98B4D4';
    }
    gameController.resetGameVariables();
    content.removeChild(document.querySelector('.play-again-button'));
  }

  // creates a button with no functionality, functionality is added in the
  // utility version of the same function
  function createPlayAgainButton() {
    const playAgainButton = document.createElement('div');
    playAgainButton.classList.add('play-again-button');
    playAgainButton.textContent = 'Play again?';
    content.appendChild(playAgainButton);
    return playAgainButton;
  }

  function createScores(mode) {
    const scoreContainer = document.createElement('div');
    scoreContainer.classList.add('score-container');

    const playerOneScoreDisplay = document.createElement('div');
    playerOneScoreDisplay.classList.add('score');
    playerOneScoreDisplay.classList.add('player-one');
    playerOneScoreDisplay.textContent = 'Player 1: 0';

    const playerTwoScoreDisplay = document.createElement('div');
    playerTwoScoreDisplay.classList.add('score');
    playerTwoScoreDisplay.classList.add('player-two');
    const playerTwoDisplayText = mode === 2 ? 'Player 2: 0' : 'Player 2(AI) : 0';
    playerTwoScoreDisplay.textContent = playerTwoDisplayText;

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
    const newScore = scoreKeeper.getPlayerScore(winner);
    const newText = `${previousText}: ${newScore}`;
    playerScoreElement.textContent = newText;
  }

  const createSquare = function createSquare(squareNumber) {
    const tictactoeSquare = document.createElement('div');
    tictactoeSquare.classList.add('tictactoe-square');
    tictactoeSquare.classList.add(mapping.squareMappingToText.get(squareNumber));
    return tictactoeSquare;
  };

  // fills square with X, O
  // style changes depending on player, player one is red, player two is black
  // orange for easy AI, purple for impossible AI
  const updateSquare = function updateSquare(squareIndex, player) {
    const elementStyle = new Map();
    elementStyle.set(1, 'red');
    elementStyle.set(2, 'black');
    elementStyle.set(3, 'orange');
    elementStyle.set(4, 'purple');

    const squareText = mapping.squareMappingToText.get(squareIndex);
    const squareElement = document.querySelector(`.${squareText}`);
    squareElement.style.backgroundColor = elementStyle.get(player);
  };

  return {
    createPlayAgainButton,
    createScores,
    updateScoreElements,
    resetBoard,
    getSquares,
    setSquares,
    createSquare,
    updateSquare,
  };
}());

// AI functions return a move
const AI = (function AI() {
  // returns a random corner move
  function cornerMove() {
    const cornerSquares = [0, 2, 6, 8];
    const randomValue = Math.floor(Math.random() * 4);
    return cornerSquares[randomValue];
  }

  // easy AI just makes random moves
  function easyAI() {
    const validSquares = gameController.getValidSquares(gameController.getBoard());
    const randomSquare = validSquares[Math.floor(Math.random() * validSquares.length)];
    return randomSquare;
  }

  // makes the optimal move, so it never loses
  function impossibleAI() {
    function minimax(board, player) {
      const boardCopy = [[], [], []];
      // when the board is too empty, the move space is too large and takes too
      // long to compute, so we place the first move in a random corner, or the centre
      const availablePositions = gameController.getValidSquares(board);
      if (availablePositions.length === 8) {
        if (availablePositions.includes(4)) {
          return { index: 4 };
        } else {
          let cornerIndex = cornerMove();
          while (!availablePositions.includes(cornerIndex)) {
            cornerIndex = cornerMove();
          }

          return { index: cornerIndex };
        }
      }

      for (let i = 0; i < board.length; i += 1) {
        for (let j = 0; j < board.length; j += 1) {
          boardCopy[i][j] = board[i][j];
        }
      }

      if (gameController.checkThreeInARow(boardCopy, 1)) {
        return { score: -10 };
      } else if (gameController.checkThreeInARow(boardCopy, 2)) {
        return { score: 10 };
      } else if (gameController.checkTie(boardCopy)) {
        return { score: 0 };
      }

      const moves = [];

      availablePositions.forEach((position) => {
        const move = {};
        const row = Math.floor(position / 3);
        const col = position % 3;
        move.index = position;

        boardCopy[row][col] = player;

        if (player === 2) {
          const result = minimax(boardCopy, 1);
          move.score = result.score;
        } else {
          const result = minimax(boardCopy, 2);
          move.score = result.score;
        }

        boardCopy[row][col] = 0;
        moves.push(move);
      });

      let bestMove;
      if (player === 2) {
        let bestScore = -1000;
        moves.forEach((move, index) => {
          if (move.score > bestScore) {
            bestScore = move.score;
            bestMove = index;
          }
        });
      } else {
        let bestScore = 1000;
        moves.forEach((move, index) => {
          if (move.score < bestScore) {
            bestScore = move.score;
            bestMove = index;
          }
        });
      }
      return moves[bestMove];
    }

    // const testBoard = [[1, 2, 1], [2, 2, 1], [0, 1, 0]];
    return minimax(gameController.getBoard(), 2).index;
  }

  return { cornerMove, easyAI, impossibleAI };
}());

// utility contains functions that combine methods from scoreKeeper,
// gameController and viewController
const utility = (function utility() {
  // performTurn updates DOM and board state for player
  function performTurn(index, player) {
    viewController.updateSquare(index, player);
    gameController.updateBoard(index);
  }

  function AIfirstTurn(mode) {
    // By default turn is 1, so must change to 2 for AI move
    gameController.changeTurn();
    const aiMode = mode === 0 ? 3 : 4;
    const move = mode === 0 ? AI.easyAI() : AI.cornerMove();
    performTurn(move, aiMode);
    gameController.changeTurn();
  }

  function playAgainButtonFunctionality(mode) {
    viewController.resetBoard();
    gameController.resetGameVariables();

    if (mode !== 2) {
      if (Math.random() > 0.5) {
        AIfirstTurn(mode);
      }
    }
  }

  function createPlayAgainButton(mode) {
    const button = viewController.createPlayAgainButton();
    button.addEventListener('click', () => playAgainButtonFunctionality(mode));
  }

  // endTurn is called after a move is performed and checks for the game ending
  // scenarios, returns true if game is over, false otherwise
  function endTurn(mode) {
    const boardCopy = gameController.getBoard();
    const turn = gameController.getTurn();
    const isWin = gameController.checkThreeInARow(boardCopy, 1)
                  || gameController.checkThreeInARow(boardCopy, 2);
    const isTie = gameController.checkTie(boardCopy);
    // check if a player has won
    if (isWin || isTie) {
      gameController.changeGameState();
      console.log('Game is over');
      createPlayAgainButton(mode);
      const scoreToUpdate = isWin ? turn : 0;
      scoreKeeper.updateScore(scoreToUpdate);
      viewController.updateScoreElements(scoreToUpdate);
      return true;
    }
    gameController.changeTurn();
    return false;
  }

  return {
    performTurn,
    endTurn,
    AIfirstTurn,
  };
}());

// contains the functionality needed to change modes
const initializeGame = function initializeGame(mode) {
  const squareClicked = function squareClicked(e) {
    const squareElement = e.target;
    const square = squareElement.className.split(' ')[1];
    const squareIndex = mapping.squareMappingToNumber.get(square);
    // check if player can make the move before updating DOM and backend
    if (gameController.canPlay(squareIndex)) {
      const turn = gameController.getTurn();
      utility.performTurn(squareIndex, turn);
      if (utility.endTurn(mode)) return;

      // mode 0 is easy AI, 1 impossible
      if (mode === 0) {
        const move = AI.easyAI();
        utility.performTurn(move, 3);
        utility.endTurn(mode);
      } else if (mode === 1) {
        const move = AI.impossibleAI();
        utility.performTurn(move, 4);
        utility.endTurn(mode);
      }
    }
  };

  const createGameBoard = function gameBoard() {
    const tictactoeContainer = document.createElement('div');
    tictactoeContainer.classList.add('tictactoe-grid');
    const squares = [];
    for (let i = 0; i < 9; i += 1) {
      const square = viewController.createSquare(i);
      tictactoeContainer.appendChild(square);
      square.addEventListener('click', squareClicked);
      squares.push(square);
    }
    viewController.setSquares(squares);
    document.querySelector('content').appendChild(tictactoeContainer);
  };

  const modeButton = document.querySelector('.dropbtn');
  if (mode === 0) {
    modeButton.textContent = 'Easy AI';
  } else if (mode === 1) {
    modeButton.textContent = 'Impossible AI';
  } else {
    modeButton.textContent = '2 Player';
  }

  gameController.resetGameVariables();
  scoreKeeper.resetScore();
  document.querySelector('content').replaceChildren();
  createGameBoard();
  viewController.createScores(mode);

  // random chance for AI to go first
  if (Math.random() > 0.5) {
    utility.AIfirstTurn(mode);
  }
};

function initializeModeButtons() {
  const easyModeButton = document.querySelector('.easy');
  const impossibleModeButton = document.querySelector('.impossible');
  const twoPlayerModeButton = document.querySelector('.two-player');

  easyModeButton.addEventListener('click', () => initializeGame(0));
  impossibleModeButton.addEventListener('click', () => initializeGame(1));
  twoPlayerModeButton.addEventListener('click', () => initializeGame(2));
}

initializeGame(0);
initializeModeButtons();
