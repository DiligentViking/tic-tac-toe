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

  function getBoard() {
    return board;
  }

  function placeToken(i, j, token) {
    const loc = board[i][j];
    if (!loc) {
      console.log('Outta bounds, dude.');  // for console
      return 'ERROR';
    } else if (!(loc.getValue() === 'n')) {
      console.log("That spot's taken, poke.");
      return 'ERROR';
    }
    board[i][j].addToken(token);
  }

  function printBoard() {  // for console game
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
  };
}


function Cell() {
  let value = 'n';

  function addToken(token) {
    value = token;
  }

  function getValue() {
    return value;
  }

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

  function switchPlayerTurn() {
    activePlayer = (activePlayer === players[0]) ? players[1] : players[0];
  }

  function printNewRound() {  // for console game
    board.printBoard();
    console.log(`${activePlayer.name}'s turn`);
  };

  function checkWinner() {
    const cells = board.getBoard();
    let cell1;
    let cell2;
    let cell3;
    let winner;
    let isCat = true;
    function detectWinner() {
      if (cell1 === cell2 && cell1 === cell3 && cell1 !== 'n') {
        winner = players.find((player) => player.token === cell1).name;
      }
    }
    function detectCat() {  // i call this at the end because the last move may cause a win
      tieCheck:
      for (const row of cells) {
        for (const cell of row) {
          if (cell.getValue() === 'n') {
            isCat = false;
            break tieCheck;
          }
        }
      }
    }
    /* horizontals */
    for (const row of cells) {
      cell1 = row[0].getValue();
      cell2 = row[1].getValue();
      cell3 = row[2].getValue();
      detectWinner(cell1, cell2, cell3);
      if (winner) return winner;
    }
    /* verticals */
    const cols = cells[0].length;
    for (let i = 0; i < cols; i++) {  // the thing that's changing is the column
      cell1 = cells[0][i].getValue();  // we access one from each row
      cell2 = cells[1][i].getValue();
      cell3 = cells[2][i].getValue();
      detectWinner(cell1, cell2, cell3);
      if (winner) return winner;
    }
    /* diagonal downhill */
    cell1 = cells[0][0].getValue();
    cell2 = cells[1][1].getValue();
    cell3 = cells[2][2].getValue();  
    detectWinner(cell1, cell2, cell3);
    if (winner) return winner;
    /* diagonal uphill */
    cell1 = cells[0][2].getValue();
    cell2 = cells[1][1].getValue();
    cell3 = cells[2][0].getValue();  
    detectWinner(cell1, cell2, cell3);
    if (winner) return winner;
    /* Check if board is full */
    detectCat();
    if (isCat) return 'CAT';
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getBoard() {
    return board.getBoard()
  }

  function playRound(i, j) {
    const errorCheck = board.placeToken(i, j, activePlayer.token);
    if (errorCheck) return;
    const gameEnd = checkWinner();
    if (gameEnd) return gameEnd;
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard
  };
}


function ScreenController() {
  const divBoard = document.getElementById('board');
  const divTurn = document.getElementById('turn');
  const divOthermsg = document.getElementById('othermsg');
  const btnNewGame = document.createElement('button');
  let game;
  let gameEnd;

  function startNewGame() {
    game = GameController();
    gameEnd = undefined;
    updateScreen();
  }

  function updateScreen() {
    /* Create board */
    const board = game.getBoard();
    divBoard.textContent = '';
    for (const row of board) {
      for (const cell of row) {
        const btnCell = document.createElement('button');
        btnCell.classList.add('cell');
        const coords = `${board.indexOf(row)}, ${row.indexOf(cell)}`;
        btnCell.dataset.coords = coords;
        btnCell.textContent = cell.getValue();
        divBoard.appendChild(btnCell);
      }
    }
    /* Update turn */
    const activePlayer = game.getActivePlayer().name;
    divTurn.textContent = `${activePlayer}, move.`;
    /* Update other message and btnNewGame */
    if (gameEnd) {
      if (gameEnd === 'CAT') {
        divOthermsg.textContent = "It's a cat. No one wins.";
      } else {
        divOthermsg.textContent = `The winner is ${gameEnd}.`;
      }
      btnNewGame.textContent = 'new game';
      btnNewGame.addEventListener('click', () => startNewGame());  // this button is kind of awkard
      divOthermsg.appendChild(btnNewGame);
    } else {
      divOthermsg.textContent = '';
    }
  }

  divBoard.addEventListener('click', (e) => {
    if (gameEnd) return;
    const coords = e.target.dataset.coords.split(', ');
    gameEnd = game.playRound(coords[0], coords[1]);
    updateScreen();
  });

  startNewGame();
}


ScreenController();
