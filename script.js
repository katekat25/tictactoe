

const gameboard = (function () {
    const _array = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    const getGameboard = () => _array;

    const makeMove = (cellRow, cellColumn) => {
        _array[cellRow][cellColumn] = "X";
    }

    return {getGameboard, makeMove};
})();
