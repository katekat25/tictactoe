

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
            let activePlayer = playerController.getActivePlayer();
            //loop through winningCombos and check if value at each coord equals the current player's value
            for (i = 0; i < winningCombos.length; i++) {
                let coord = getCoord(i, 0);
                if (_array[coord[0]][coord[1]].getValue() == activePlayer.playerValue) {
                    coord = getCoord(i, 1);
                    if (_array[coord[0]][coord[1]].getValue() == activePlayer.playerValue) {
                        coord = getCoord(i, 2);
                        if (_array[coord[0]][coord[1]].getValue() == activePlayer.playerValue) {
                            return 1;
                        }
                    }
                }
            }
            //if board is filled with no win
            if (roundCount == 8) {
                return 2;
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
            playerValue: "X"
        },
        {
            name: playerTwoName,
            playerValue: "O"
        }
    ];
    let activePlayer = players[0];

    //these could definitely be one function but i simply do not care enough anymore!
    const setPlayerOneName = (name) => {
        players[0].name = name;
    }

    const setPlayerTwoName = (name) => {
        players[1].name = name;
    }

    const getActivePlayer = () => activePlayer;

    const getRoundCount = () => roundCount;

    const playRound = (row, column) => {
        let board = gameboard.getGameboard();
        if (board[row][column].getValue() === 0) {
            gameboard.makeMove(activePlayer.playerValue, row, column);
            console.log(gameboard.printGameboard());
            gameboard.checkWin();
            if (gameboard.checkWin() === 1) {
                displayController.setWinModal(activePlayer, "win");
                return;
            } else if (gameboard.checkWin() === 2) {
                displayController.setWinModal(activePlayer, "tie");
                return;
            }
            activePlayer = activePlayer === players[0] ? players[1] : players[0];
            displayController.setAlert(`${activePlayer.name}'s move.`);
            roundCount++;
        } else {
            displayController.setAlert("A move has already been made at that square. Please try again.");
        }
    }

    const resetGame = () => {
        gameboard.clearGameboard();
        displayController.initializeDisplay();
        displayController.setAlert(`${players[0].name}'s move.`);
        roundCount = 0;
        activePlayer = players[0];
    }

    return { setPlayerOneName, setPlayerTwoName, playRound, getRoundCount, getActivePlayer, resetGame }

})();

const displayController = (function () {

    const gameboardContainer = document.querySelector("#container");
    const alertContainer = document.querySelector(".alerts");
    const button = document.querySelector("button");
    const modalBackground = document.createElement("div");

    const initializeDisplay = () => {
        //clear previous board state, if any
        gameboardContainer.innerHTML = "";
        let board = gameboard.getGameboard();
        //loop through gameboard, getting updated cell values
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board.length; j++) {
                let cell = document.createElement("div");
                //if i don't do this i and j always equal 3
                let cellX = i;
                let cellY = j;
                cell.classList.add("cell", "empty");
                cell.textContent = board[i][j].getValue();
                cell.addEventListener("click", () => {
                    playerController.playRound(cellX, cellY);
                    cell.classList.remove("empty");
                    cell.textContent = board[cellX][cellY].getValue();
                });
                gameboardContainer.appendChild(cell);
            }
        }
        button.addEventListener("click", () => {
            playerController.resetGame();
        });

    }

    const setAlert = (message) => {
        alertContainer.innerHTML = "";
        let messageBox = document.createElement("div");
        messageBox.textContent = message;
        alertContainer.appendChild(messageBox);
    }

    const setOpeningModal = () => {
        //God save us all
        let container = document.querySelector(".modal");
        container.innerHTML = "";
        let wrapper = document.createElement("div");
        modalBackground.classList.add("modal-background");
        wrapper.classList.add("modal-container");
        wrapper.style.backgroundColor = "white";
        container.appendChild(modalBackground);
        modalBackground.appendChild(wrapper);
        let text = document.createElement("div");
        text.classList.add("modal-text");
        text.textContent = "New Game";
        let p1Label = document.createElement("label");
        p1Label.htmlFor = "p1Name";
        p1Label.textContent = "Player 1 name:";
        let p1Name = document.createElement("input");
        p1Name.classList.add("player-name-input");
        p1Name.id = "p1Name";
        p1Name.type = "text";
        let p2Label = document.createElement("label");
        p2Label.htmlFor = "p2Name";
        p2Label.textContent = "Player 2 name:";
        let p2Name = document.createElement("input");
        p2Name.classList.add("player-name-input");
        p2Name.id = "p2Name";
        p2Name.type = "text";
        let startButton = document.createElement("button");
        startButton.textContent = "Begin";
        startButton.addEventListener("click", (e) => {
            e.preventDefault();
            playerController.setPlayerOneName(p1Name.value);
            playerController.setPlayerTwoName(p2Name.value);
            displayController.setAlert(`${playerController.getActivePlayer().name}'s move.`);
            wrapper.style.display = "none";
            modalBackground.style.display = "none";
        })
        wrapper.appendChild(text);
        wrapper.appendChild(p1Label);
        wrapper.appendChild(p1Name);
        wrapper.appendChild(p2Label);
        wrapper.appendChild(p2Name);
        wrapper.appendChild(startButton);
    }

    const setWinModal = (winningPlayer, tieOrWin) => {
        //we're not teaching you jQuery because you dont need it! :D
        let container = document.querySelector(".modal");
        container.innerHTML = "";
        modalBackground.style.display = "initial";
        let wrapper = document.createElement("div");
        modalBackground.classList.add("modal-background");
        wrapper.classList.add("modal-container");
        wrapper.style.backgroundColor = "white";
        container.appendChild(modalBackground);
        modalBackground.appendChild(wrapper);
        let text = document.createElement("div");
        text.classList.add("modal-text");
        if (tieOrWin === "win") {
            text.textContent = `${winningPlayer.name} wins!`;
        } else if (tieOrWin === "tie") {
            text.textContent = "It's a tie!";
        }
        wrapper.appendChild(text);
        let playAgainButton = document.createElement("button");
        playAgainButton.textContent = "Play again";
        playAgainButton.addEventListener("click", (e) => {
            e.preventDefault();
            playerController.resetGame();
            displayController.setAlert(`${playerController.getActivePlayer().name}'s move.`);
            wrapper.style.display = "none";
            modalBackground.style.display = "none";
        });
        wrapper.appendChild(playAgainButton);
    }
    
    return { initializeDisplay, setAlert, setOpeningModal, setWinModal }
})();

displayController.initializeDisplay();
displayController.setOpeningModal();
