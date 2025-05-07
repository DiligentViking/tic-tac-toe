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
      return 'ERROR';
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

  const checkWinner = () => {
    const detectWinner = (cell1, cell2, cell3) => {
      if (cell1 === cell2 && cell1 === cell3 && cell1 !== 'n') {
        const winner = players.find((player) => player.token === cell1).name;
        return winner;
      }
    }
    const cells = board.getBoard();
    let cell1;
    let cell2;
    let cell3;
    let winner;
    // horizontals
    for (const row of cells) {
      cell1 = row[0].getValue();
      cell2 = row[1].getValue();
      cell3 = row[2].getValue();
      winner = detectWinner(cell1, cell2, cell3);
      if (winner) return winner;
    }
    // verticals
    const cols = cells[0].length;
    for (let i = 0; i < cols; i++) {  // the thing that's changing is the column
      cell1 = cells[0][i].getValue();  // we access one from each row
      cell2 = cells[1][i].getValue();
      cell3 = cells[2][i].getValue();
      winner = detectWinner(cell1, cell2, cell3);
      if (winner) return winner;
    }
    // diagonal downhill
    cell1 = cells[0][0].getValue();
    cell2 = cells[1][1].getValue();
    cell3 = cells[2][2].getValue();  
    winner = detectWinner(cell1, cell2, cell3);
    if (winner) return winner;
    // diagonal uphill
    cell1 = cells[0][2].getValue();
    cell2 = cells[1][1].getValue();
    cell3 = cells[2][0].getValue();  
    winner = detectWinner(cell1, cell2, cell3);
    if (winner) return winner;
  }

  const playRound = (i, j) => {
    const errorCheck = board.placeToken(i, j, activePlayer.token);
    if (errorCheck) return;
    console.log(`${activePlayer.name} moved to ${i}, ${j}...`);
    const potentialWinner = checkWinner();
    if (potentialWinner) return 'THE WINNER IS ' + potentialWinner;  // ture
    switchPlayerTurn();
    printNewRound();
  }

  printNewRound();

  return {
    playRound
  };
}


const game = GameController();

/* game.playRound(0, 0);
game.playRound(1, 0);
game.playRound(0, 1);
game.playRound(1, 1);
console.log(game.playRound(0, 2)); */
