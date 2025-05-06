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

  const getBoard = () => board;

  const placeToken = (i, j, token) => {
    const loc = board[i][j];
    if (!loc) {
      console.log('Outta bounds, dude.');  // for console
      return 'ERROR';  // undefined  // consider recursively calling this? right now it just skips
    } else if (!(loc.getValue() === 'n')) {
      console.log("That spot's taken, poke.");
      return 'ERROR'
    }
    board[i][j].addToken(token);
  };

  const printBoard = () => {  // for console game
    const arrToPrint = [];
    board.forEach((row) => {
      arrToPrint.push([row[0].getValue(), row[1].getValue(), row[2].getValue()]);
    })
    console.log(arrToPrint);
  };

  return {
    getBoard,
    placeToken,
    printBoard
  };
}


function Cell() {
  let value = 'n';

  const addToken = (token) => {
    value = token;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}


function GameController() {
  const playerOneName = 'Player1';
  const playterTwoName = 'Player2';
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: 'X'
    },
    {
      name: playterTwoName,
      token: 'O'
    }
  ];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
  };

  const printNewRound = () => {  // for console game
    board.printBoard();
    console.log(`${activePlayer.name}'s turn`);
  };

  const playRound = (i, j) => {
    const errorCheck = board.placeToken(i, j, activePlayer.token);
    if (errorCheck) return;
    console.log(`${activePlayer.name} moved to ${i}, ${j}...`);
    switchPlayerTurn();
    printNewRound();
  }

  printNewRound();

  return {
    playRound
  };
}


const game = GameController();
