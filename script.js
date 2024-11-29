

const gameboard = (function () {
    const _array = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    const getGameboard = () => _array;

    const printGameboard = () => console.log(_array);

    const makeMove = (player, cellRow, cellColumn) => {
        let activeCell = _array[cellRow][cellColumn];
        if (activeCell === "X" || activeCell === "O") return;
        if (player == 1) {
            activeCell = "X";
        } else if (player == 2) {
            activeCell = "O";
        }
        _array[cellRow][cellColumn] = activeCell;
    }

    return {getGameboard, printGameboard, makeMove};
})();
