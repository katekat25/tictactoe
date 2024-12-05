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
        let roundCount = playerController.getRoundCount();
        //if first player has had time to play at least 3 tokens
        if (roundCount >= 4 && roundCount <= 8) {
            const activePlayer = playerController.getActivePlayer();
            //loop through winningCombos and check if value at each coord equals the current player's value
            for (const combo of winningCombos) {
                if (combo.every(([x, y]) => _array[x][y].getValue() === activePlayer.playerValue)) {
                    return "win";
                }
            }
            //if board is filled with no win
            if (roundCount == 8) return "tie";
        }
    }

    return { getGameboard, clearGameboard, makeMove, checkWin };
})();

function Cell() {
    let value = 0;

    const fillCell = (player) => value = player;
    const clearCell = () => value = 0;
    const getValue = () => value;

    return { fillCell, clearCell, getValue };
}

const playerController = (function () {
    let roundCount = 0;
    const players = [
        {
            name: "Player 1",
            playerValue: "X"
        },
        {
            name: "Player 2",
            playerValue: "O"
        }
    ];
    let activePlayer = players[0];

    const setPlayerName = (index, name) => players[index].name = name;
    const getActivePlayer = () => activePlayer;
    const getRoundCount = () => roundCount;

    const playRound = (row, column) => {
        const board = gameboard.getGameboard();
        const cell = board[row][column];
        if (cell.getValue() === 0) {
            gameboard.makeMove(activePlayer.playerValue, row, column);
            if (gameboard.checkWin() === "win") {
                displayController.setWinModal(activePlayer, "win");
                return;
            } else if (gameboard.checkWin() === "tie") {
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

    return { setPlayerName, playRound, getRoundCount, getActivePlayer, resetGame }

})();

const displayController = (function () {

    const gameboardContainer = document.querySelector("#container");
    const alertContainer = document.querySelector(".alerts");
    const button = document.querySelector("button");
    const modalBackground = document.createElement("div");

    const initializeDisplay = () => {
        // Clear previous board state, if any
        gameboardContainer.innerHTML = "";
        let board = gameboard.getGameboard();

        // Loop through gameboard, getting updated cell values
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                let cellElement = document.createElement("div");

                // Add cell classes and text
                cellElement.classList.add("cell", "empty");
                cellElement.textContent = cell.getValue();

                // Event listener for handling moves
                cellElement.addEventListener("click", () => {
                    playerController.playRound(i, j);
                    cellElement.classList.remove("empty");
                    cellElement.textContent = board[i][j].getValue();
                });

                gameboardContainer.appendChild(cellElement);
            });
        });

        // Event listener for reset button
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
        const container = document.querySelector(".modal");
        container.innerHTML = "";
    
        // Modal background and wrapper
        modalBackground.classList.add("modal-background");
        const wrapper = document.createElement("div");
        wrapper.classList.add("modal-container");
        wrapper.style.backgroundColor = "white";
        container.appendChild(modalBackground);
        modalBackground.appendChild(wrapper);
    
        // Modal content
        const text = document.createElement("div");
        text.classList.add("modal-text");
        text.textContent = "New Game";
    
        const p1Label = document.createElement("label");
        p1Label.htmlFor = "p1Name";
        p1Label.textContent = "Player 1 name:";
    
        const p1Name = document.createElement("input");
        p1Name.id = "p1Name";
        p1Name.type = "text";
        p1Name.classList.add("player-name-input");
    
        const p2Label = document.createElement("label");
        p2Label.htmlFor = "p2Name";
        p2Label.textContent = "Player 2 name:";
    
        const p2Name = document.createElement("input");
        p2Name.id = "p2Name";
        p2Name.type = "text";
        p2Name.classList.add("player-name-input");
    
        // Start button
        const startButton = document.createElement("button");
        startButton.textContent = "Begin";
        startButton.addEventListener("click", (e) => {
            e.preventDefault();
            playerController.setPlayerName(0, p1Name.value);
            playerController.setPlayerName(1, p2Name.value);
            displayController.setAlert(`${playerController.getActivePlayer().name}'s move.`);
            wrapper.style.display = "none";
            modalBackground.style.display = "none";
        });
    
        // Append elements to wrapper
        wrapper.appendChild(text);
        wrapper.appendChild(p1Label);
        wrapper.appendChild(p1Name);
        wrapper.appendChild(p2Label);
        wrapper.appendChild(p2Name);
        wrapper.appendChild(startButton);
    };
    
    const setWinModal = (winningPlayer, tieOrWin) => {
        const container = document.querySelector(".modal");
        container.innerHTML = "";
    
        // Modal background and wrapper
        modalBackground.style.display = "initial";
        modalBackground.classList.add("modal-background");
        const wrapper = document.createElement("div");
        wrapper.classList.add("modal-container");
        wrapper.style.backgroundColor = "white";
        container.appendChild(modalBackground);
        modalBackground.appendChild(wrapper);
    
        // Modal content
        const text = document.createElement("div");
        text.classList.add("modal-text");
        text.textContent = tieOrWin === "win" ? `${winningPlayer.name} wins!` : "It's a tie!";
    
        // Play again button
        const playAgainButton = document.createElement("button");
        playAgainButton.textContent = "Play again";
        playAgainButton.addEventListener("click", (e) => {
            e.preventDefault();
            playerController.resetGame();
            displayController.setAlert(`${playerController.getActivePlayer().name}'s move.`);
            wrapper.style.display = "none";
            modalBackground.style.display = "none";
        });
    
        // Append elements to wrapper
        wrapper.appendChild(text);
        wrapper.appendChild(playAgainButton);
    };    

    return { initializeDisplay, setAlert, setOpeningModal, setWinModal }
})();

displayController.initializeDisplay();
displayController.setOpeningModal();