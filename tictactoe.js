const gameBoard = function gameBoard() {
    const tictactoeContainer = document.createElement('div');
    tictactoeContainer.classList.add('tictactoe-grid');

    for(var i=0; i < 9; i++){
        const square = createSquare(i);
        tictactoeContainer.appendChild(square);
    }

    const content = document.querySelector('content');
    console.log(content);
    content.appendChild(tictactoeContainer);
}


const createSquare = function createSquare(squareNumber) {
    const tictactoeSquare = document.createElement('div');
    tictactoeSquare.classList.add('tictactoe-square');
    tictactoeSquare.classList.add(mapping.get(squareNumber));
    return tictactoeSquare
}

const mapping = function createMapping() {
    const squareMapping = new Map();
    squareMapping.set(1, "one");
    squareMapping.set(2, "two");
    squareMapping.set(3, "three");
    squareMapping.set(4, "four");
    squareMapping.set(5, "five");
    squareMapping.set(6, "six");
    squareMapping.set(7, "seven");
    squareMapping.set(8, "eight");
    squareMapping.set(9, "nine");
    return squareMapping
}()


gameBoard();