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

  const gameFinished = function gameFinished() {
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

  // const rowCol = function rowCol(square) {
  //   const row = Math.floor(square / 3);
  //   const col = square % 3;

  //   return { row, col };
  // };

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
      squares[i].style.backgroundColor = 'white';
    }
    gameController.resetGameVariables();
    content.removeChild(document.querySelector('.play-again-button'));
  }

  function createPlayAgainButton() {
    const playAgainButton = document.createElement('div');
    playAgainButton.classList.add('play-again-button');
    playAgainButton.textContent = 'Play again?';
    content.appendChild(playAgainButton);
    playAgainButton.addEventListener('click', resetBoard);
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
    console.log(previousText);

    const newScore = scoreKeeper.getPlayerScore(winner);
    const newText = `${previousText}: ${newScore}`;
    console.log(newText);
    playerScoreElement.textContent = newText;
  }

  const createSquare = function createSquare(squareNumber) {
    const tictactoeSquare = document.createElement('div');
    tictactoeSquare.classList.add('tictactoe-square');
    tictactoeSquare.classList.add(mapping.squareMappingToText.get(squareNumber));
    return tictactoeSquare;
  };

  // fills square with X, O
  // style changes depending on player, player one is black, player two is red
  // orange for easy AI, purple for impossible AI
  const updateSquare = function updateSquare(squareIndex, player) {
    const elementStyle = new Map();
    elementStyle.set(0, 'black');
    elementStyle.set(1, 'red');
    elementStyle.set(2, 'orange');
    elementStyle.set(3, 'purple');

    const squareText = mapping.squareMappingToText.get(squareIndex);
    const squareElement = document.querySelector(`.${squareText}`);
    squareElement.style.backgroundColor = elementStyle.get(player);
  };

  return {
    createPlayAgainButton,
    createScores,
    updateScoreElements,
    getSquares,
    setSquares,
    createSquare,
    updateSquare,
  };
}());

// easy AI just makes random moves
const AI = (function AI() {
  function easyAI() {
    const validSquares = gameController.getValidSquares(gameController.getBoard());
    const randomSquare = validSquares[Math.floor(Math.random() * validSquares.length)];
    viewController.updateSquare(randomSquare, 2);
    //const squareText = mapping.squareMappingToText.get(randomSquare);
    //const squareElement = document.querySelector(`.${squareText}`);
    //squareElement.style.backgroundColor = 'orange';
    gameController.updateBoard(randomSquare);
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
          const cornerSquares = [0, 2, 6, 8];
          let randomValue = Math.floor(Math.random() * 4);

          while (!availablePositions.includes(cornerSquares[randomValue])) {
            randomValue = Math.floor(Math.random() * 4);
          }

          return { index: cornerSquares[randomValue] };
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
    const bestMove = minimax(gameController.getBoard(), 2);
    const squareText = mapping.squareMappingToText.get(bestMove.index);
    const squareElement = document.querySelector(`.${squareText}`);
    squareElement.style.backgroundColor = 'purple';
    gameController.updateBoard(bestMove.index);
  }

  return { easyAI, impossibleAI };
}());

// contains the functionality needed to change modes
const initializeGame = function initializeGame(mode) {
  const squareClicked = function squareClicked(e) {
    const squareElement = e.target;
    const square = squareElement.className.split(' ')[1];
    const squareAsNum = mapping.squareMappingToNumber.get(square);
    const turn = gameController.getTurn();
    // check if player can make the move before updating DOM and backend
    const boardCopy = gameController.getBoard();
    if (gameController.checkValidSquare(boardCopy, squareAsNum) && !gameController.getGameState()) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line no-unused-expressions
      gameController.getTurn() === 1 ? squareElement.style.backgroundColor = 'red' : squareElement.style.backgroundColor = 'black';
      gameController.updateBoard(squareAsNum);
      // check if player has won
      if (gameController.checkThreeInARow(gameController.getBoard(), gameController.getTurn())) {
        gameController.gameFinished();
        console.log(`game is over ${gameController.getTurn()} has won`);
        viewController.createPlayAgainButton();
        scoreKeeper.updateScore(turn);
        viewController.updateScoreElements(turn);
        return;
      }
      gameController.changeTurn();

      if (gameController.checkTie(gameController.getBoard())) {
        gameController.gameFinished();
        scoreKeeper.updateScore(0);
        viewController.updateScoreElements(0);
        viewController.createPlayAgainButton();
      }
      const gameOver = gameController.getGameState();

      if (!gameOver) {
        // mode 0 is easy AI, 1 impossible
        if (mode === 0) {
          AI.easyAI();
          if (gameController.checkThreeInARow(gameController.getBoard(), gameController.getTurn())) {
            gameController.gameFinished();
            scoreKeeper.updateScore(gameController.getTurn());
            viewController.updateScoreElements(gameController.getTurn());
            console.log('AI has won');
            viewController.createPlayAgainButton();
          }
          gameController.changeTurn();
        } else if (mode === 1) {
          AI.impossibleAI();
          gameController.changeTurn();
        }
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

  scoreKeeper.resetScore();
  document.querySelector('content').replaceChildren();
  createGameBoard();
  viewController.createScores(mode);
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
