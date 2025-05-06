function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board.push([]);
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  console.log(board);

  const getBoard = () => board;

  const placeToken = (i, j, token) => {
    const loc = board[i][j];
    if (loc < 0 || loc > 2 ) {
      console.log('That is either out of bounds or a cell that is occupied.');
      return;  // undefined
    }
    board[i][j].addToken(token);
    printBoard();
  }

  const printBoard = () => {  // temporary func for console game
    const arrToPrint = [];
    board.forEach((row) => {
      arrToPrint.push([row[0].getValue(), row[1].getValue(), row[2].getValue()]);
    })
    console.log(arrToPrint);
  }

  return {
    getBoard,
    placeToken,
    printBoard
  }
}


function Cell() {
  let value = 'n';

  const addToken = (token) => {
    value = token;
  }

  const getValue = () => value;

  return {
    addToken,
    getValue
  }
}