

const gameboard = (function () {
    let _array = [];
    const rows = 3;
    const columns = 3;

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
        // console.log("Invoking makeMove");
        // console.log("Making activeCell the one at " + cellRow +", " + cellColumn);
        // console.log("Console logging gameboard[cellRow] in the next line...");
        // console.log(_array[cellRow][cellColumn]);
        let activeCell = _array[cellRow][cellColumn].getValue();
        if (activeCell === 1 || activeCell === 2) {
            // console.log("activeCell equals 1 or 2, exiting makeMove");
            return;
        }
        _array[cellRow][cellColumn].fillCell(player);
        // console.log("Exiting makeMove after filling cell");
    }

    const checkWin = (player, cellRow, cellColumn) => {
        let cellJustPlayed = _array[cellRow][cellColumn];
    }

    return { getGameboard, printGameboard, makeMove, checkWin };
})();

function Cell() {
    // console.log("Invoking Cell()");
    let value = 0;

    const fillCell = (player) => {
        // console.log("Invoking fillCell");
        value = player;
        // console.log("Value should now be " + player);
        // console.log("Value is actually " + value);
    }

    const getValue = () => {
        // console.log("Invoking getValue");
        return value;
    }

    return { fillCell, getValue };
}

const playerController = (function () {
    let playerOneName = "Player 1";
    let playerTwoName = "Player 2";

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

    function playRound(row, column) {
        console.log(`${getActivePlayer().name}'s turn.`);
        gameboard.makeMove(activePlayer.playerValue, row, column);
        activePlayer = activePlayer === players[0] ? players[1]: players[0];
    }

    return { playRound }

})();
