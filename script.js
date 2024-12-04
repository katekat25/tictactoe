

const gameboard = (function () {
    let _array = [];
    const rows = 3;
    const columns = 3;
    let winningCombos = [
        //horizontal coordinates
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        //vertical coordinates
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        //diagonal coordinates
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ];

    //Initialize game board with empty cells
    for (let i = 0; i < rows; i++) {
        _array[i] = [];
        for (let j = 0; j < columns; j++) {
            _array[i].push(Cell());
        }
    }

    const getGameboard = () => _array;

    const printGameboard = () => {
        const filledBoard = _array.map((row) => row.map((cell) => cell.getValue()));
        console.log(filledBoard);
    };

    const getValueAtCoord = (x,y) => _array[x][y].getValue();

    const makeMove = (player, cellRow, cellColumn) => {
        let activeCell = _array[cellRow][cellColumn].getValue();
        if (activeCell === 1 || activeCell === 2) {
            return;
        }
        _array[cellRow][cellColumn].fillCell(player);
    }

    const clearGameboard = () => {
        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
                _array[i][j].clearCell();
            }
        }
    }

    const checkWin = () => {
        function getCoord(x, y) {
            let coord = winningCombos[x][y]
                .toString()
                .split(",");
            coord[0] = Number(coord[0]);
            coord[1] = Number(coord[1]);
            return coord;
        }
        let roundCount = playerController.getRoundCount();
        //if first player has had time to play at least 3 tokens
        if (roundCount >= 4 && roundCount <= 8) {
            let activePlayerValue = playerController.getActivePlayer().playerValue;
            //loop through winningCombos and check if value at each coord equals the current player's value
            for (i = 0; i < winningCombos.length; i++) {
                let coord = getCoord(i, 0);
                if (_array[coord[0]][coord[1]].getValue() == activePlayerValue) {
                    coord = getCoord(i, 1);
                    if (_array[coord[0]][coord[1]].getValue() == activePlayerValue) {
                        coord = getCoord(i, 2);
                        if (_array[coord[0]][coord[1]].getValue() == activePlayerValue) {
                            console.log("Player " + activePlayerValue + " wins!");
                            return;
                        }
                    }
                }
            }
            //if board is filled with no win
            if (roundCount == 8) {
                console.log("It's a tie.");
            }
        }
    }

    return { getGameboard, printGameboard, clearGameboard, makeMove, checkWin };
})();

function Cell() {
    let value = 0;

    const fillCell = (player) => {
        value = player;
    }

    const clearCell = () => {
        value = 0;
    }

    const getValue = () => value;

    return { fillCell, clearCell, getValue };
}

const playerController = (function () {
    let playerOneName = "Player 1";
    let playerTwoName = "Player 2";
    let roundCount = 0;
    const players = [
        {
            name: playerOneName,
            playerValue: 1
        },
        {
            name: playerTwoName,
            playerValue: 2
        }
    ];
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const getRoundCount = () => roundCount;

    const playRound = (row, column) => {
        let board = gameboard.getGameboard();
        console.log(row);
        console.log(column);
        console.log(board);
        console.log(board[row]);
        console.log(board[row][column]);
        if (board[row][column].getValue() == 0) {
            console.log(`${getActivePlayer().name}'s turn.`);
            gameboard.makeMove(activePlayer.playerValue, row, column);
            displayController.drawDisplay();
            console.log(gameboard.printGameboard());
            gameboard.checkWin();
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
            roundCount++;
        } else {
            console.log("A move has already been made at that square. Please try again.");
        }
    }

    const resetGame = () => {
        gameboard.clearGameboard();
        roundcount = 0;
        activePlayer = players[0];
    }

    return { playRound, getRoundCount, getActivePlayer, resetGame }

})();

const displayController = (function () {
    const drawDisplay = () => {
        const container = document.querySelector("#container");
        //clear previous board state, if any
        container.innerHTML = "";
        let board = gameboard.getGameboard();
        //loop through gameboard, getting updated cell values
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board.length; j++) {
                let cell = document.createElement("div");
                //if i don't do this i and j always equal 3
                let cellX = i;
                let cellY = j;
                cell.classList.add("cell");
                cell.textContent = board[i][j].getValue();
                cell.addEventListener("click", () => {
                    playerController.playRound(cellX, cellY);
                });
                container.appendChild(cell);
            }
        }
    }
    
    return { drawDisplay }
})();

displayController.drawDisplay();