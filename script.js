

const gameboard = (function () {
    let _array = [];
    const rows = 3;
    const columns = 3;
    let winningCombos = [
        //horizontal
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        //vertical
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        //diagonal
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ];

    console.log(winningCombos[0][0].toString().split(","));

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

    function checkWin() {
        function getCoord(x, y) {
            // console.log("in getCoord");
            // console.log("winningCombos[x] is " + winningCombos[x]);
            // console.log("winningCombos[x][y] is " + winningCombos[x][y]);
            let coord = winningCombos[x][y]
                .toString()
                .split(",");
            coord[0] = Number(coord[0]);
            coord[1] = Number(coord[1]);
            // console.log("Returning coord as " + coord);
            return coord;
        }
        let roundCount = playerController.getRoundCount();
        if (roundCount >= 4 && roundCount <= 8) {
            let activePlayerValue = playerController.getActivePlayer().playerValue;
            for (i = 0; i < winningCombos.length; i++) {
                let coord = getCoord(i, 0);
                // console.log("winningCombos[" + i + ",0] is " + winningCombos[i, 0]);
                if (_array[coord[0]][coord[1]].getValue() == activePlayerValue) {
                    // console.log("These first coords match.");
                    coord = getCoord(i, 1);
                    if (_array[coord[0]][coord[1]].getValue() == activePlayerValue) {
                        // console.log("These second coords match.");
                        coord = getCoord(i, 2);
                        if (_array[coord[0]][coord[1]].getValue() == activePlayerValue) {
                            // console.log("These third coords match.");
                            console.log("Player " + activePlayerValue + " wins!");
                            return;
                        }
                    }
                }
            }
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

    function playRound(row, column) {
        console.log(`${getActivePlayer().name}'s turn.`);
        gameboard.makeMove(activePlayer.playerValue, row, column);
        console.log(gameboard.printGameboard());
        gameboard.checkWin();
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        roundCount++;
    }

    const resetGame = () => {
        gameboard.clearGameboard();
        roundcount = 0;
        activePlayer = players[0];
    }

    return { playRound, getRoundCount, getActivePlayer, resetGame }

})();
