let neighboursValues = [];
let bombArray = [];
let bombPlantedAt = new Set();
let flagLeft = 10;
let score = 0;
let bombsFlagged = 0;
let gameUp = false;

function generateBombCells() {
    let i = 0;
    while (i < 10) {
        let bombCellIdx = Math.floor(Math.random() * 100);

        if (!bombArray.includes(bombCellIdx)) {
            bombArray.push(bombCellIdx);
            i++;
        }
    }
}

generateBombCells();

function makeBoard() {
    let baord = [];
    let value = 0;
    for (let i = 0; i < 10; i++) {
        let row = [];
        for (let j = 0; j < 10; j++) {
            row.push(value++);
        }
        baord.push(row);
    }

    return baord;
}

let bombermanBoard = makeBoard();

// Bomb plants
function plantBomb() {
    bombArray.map((bomb) => {
        bombPlantedAt.add(bomb);
    })
}

plantBomb();


// Neighbour cells
function getNeighbours() {
    for (let i = 0; i < bombermanBoard.length; i++) {
        for (let j = 0; j < bombermanBoard[i].length; j++) {
            let neighbour = [];

            // [0][0]
            if (i == 0 && j == 0) {
                neighbour.push(bombermanBoard[i + 1][j])
                neighbour.push(bombermanBoard[i + 1][j + 1])
                neighbour.push(bombermanBoard[i][j + 1])
            } // [0][9]
            else if (i == 0 && j == 9) {
                neighbour.push(bombermanBoard[i][j - 1])
                neighbour.push(bombermanBoard[i + 1][j - 1])
                neighbour.push(bombermanBoard[i + 1][j])
            } // [9][0]
            else if (i == 9 && j == 0) {
                neighbour.push(bombermanBoard[i - 1][j])
                neighbour.push(bombermanBoard[i - 1][j + 1])
                neighbour.push(bombermanBoard[i][j + 1])
            } // [9][9]
            else if (i == 9 && j == 9) {
                neighbour.push(bombermanBoard[i][j - 1])
                neighbour.push(bombermanBoard[i - 1][j - 1])
                neighbour.push(bombermanBoard[i - 1][j])

            } // [0][1]---[0][8]
            else if (i == 0 && j > 0 && j < 9) {
                neighbour.push(bombermanBoard[i][j - 1])
                neighbour.push(bombermanBoard[i + 1][j - 1])
                neighbour.push(bombermanBoard[i + 1][j])
                neighbour.push(bombermanBoard[i + 1][j + 1])
                neighbour.push(bombermanBoard[i][j + 1])
            } // [1][0]---[8][0]
            else if (j == 0 && i > 0 && i < 9) {
                neighbour.push(bombermanBoard[i - 1][j])
                neighbour.push(bombermanBoard[i - 1][j + 1])
                neighbour.push(bombermanBoard[i][j + 1])
                neighbour.push(bombermanBoard[i + 1][j + 1])
                neighbour.push(bombermanBoard[i + 1][j])
            } // [9][1]---[9][8]
            else if (i == 9 && j > 0 && j < 9) {
                neighbour.push(bombermanBoard[i][j - 1])
                neighbour.push(bombermanBoard[i - 1][j - 1])
                neighbour.push(bombermanBoard[i - 1][j])
                neighbour.push(bombermanBoard[i - 1][j + 1])
                neighbour.push(bombermanBoard[i][j + 1])
            } // [1][9]---[8][9]
            else if (j == 9 && i > 0 && i < 9) {
                neighbour.push(bombermanBoard[i - 1][j])
                neighbour.push(bombermanBoard[i - 1][j - 1])
                neighbour.push(bombermanBoard[i][j - 1])
                neighbour.push(bombermanBoard[i + 1][j - 1])
                neighbour.push(bombermanBoard[i + 1][j])
            } else {
                neighbour.push(bombermanBoard[i - 1][j - 1])
                neighbour.push(bombermanBoard[i - 1][j])
                neighbour.push(bombermanBoard[i - 1][j + 1])
                neighbour.push(bombermanBoard[i][j + 1])
                neighbour.push(bombermanBoard[i + 1][j + 1])
                neighbour.push(bombermanBoard[i + 1][j])
                neighbour.push(bombermanBoard[i + 1][j - 1])
                neighbour.push(bombermanBoard[i][j - 1])
            }
            neighboursValues.push(neighbour);
        }
    }
}

getNeighbours();

// Generate all cells
function makeCell() {
    let newCell = document.getElementById('grid');

    for (let i = 0; i < 100; i++) {
        let cell = document.createElement('div');

        if (bombPlantedAt.has(i)) {
            cell.classList.add('bomb');
            cell.innerText = '.';
        } else {
            cell.classList.add('valid');
        }

        let neighbourBombCount = 0;

        neighboursValues[i].map((bombID) => {
            if (bombPlantedAt.has(bombID)) {
                neighbourBombCount++;
            }
        })

        cell.setAttribute('data', neighbourBombCount);
        cell.setAttribute('id', i);

        newCell.appendChild(cell);
    }
}

makeCell();

// Update Flag Count
function updateFlagCount() {
    let falgs = document.querySelectorAll('.flag');
    flagLeft = 10 - falgs.length;
    document.getElementById('flagsLeft').innerText = flagLeft;
}

// Update Result
function updateResult(win) {
    let resultUpdate = document.getElementById('result');
    if (win) {
        resultUpdate.innerText = "YOU WIN!";
    } else {
        resultUpdate.innerText = "YOU LOSE!";
    }
}

// Check Win Status
function checkWinStatus() {
    if (bombsFlagged == 10 || score == 90) {
        revealAllCells();
        updateResult(true);
        gameUp = true;
    }
}

function zeroBombNeighboursActivate(bombCell) {
    neighboursValues[bombCell].map((cell) => {
        let cellId = `[id='${cell}']`
        let getNeighbourBombCount = document.querySelector(cellId).getAttribute('data');

        if (!document.querySelector(cellId).classList.contains('checked')) {
            document.querySelector(cellId).classList.add('checked');
            document.querySelector(cellId).innerHTML = getNeighbourBombCount;
            score++;
        }
    })


}

// Gameover
function revealAllCells() {
    let allCells = document.getElementsByClassName('grid');

    for (let i = 0; i < allCells[0].children.length; i++) {

        if (allCells[0].children[i].classList.contains('bomb')) {
            allCells[0].children[i].innerHTML = `💣`
            allCells[0].children[i].classList.add('checked');
            gameUp = true;
        }
    }
}

// Activate cells
function activateCell() {
    let allCells = document.getElementsByClassName('grid');

    for (let i = 0; i < allCells[0].children.length; i++) {
        if (!gameUp) {
            allCells[0].children[i].addEventListener('click', (e) => {

                if (allCells[0].children[i].classList.contains('bomb') && !allCells[0].children[i].classList.contains('flag')) {
                    revealAllCells();
                    updateResult(false);
                } else {
                    if (!gameUp && !allCells[0].children[i].classList.contains('checked') && !allCells[0].children[i].classList.contains('flag')) {

                        if (allCells[0].children[i].getAttribute('data') == 0) {
                            zeroBombNeighboursActivate(i);
                            allCells[0].children[i].innerHTML = +allCells[0].children[i].getAttribute('data');
                            allCells[0].children[i].classList.add('checked');

                            score++;
                            checkWinStatus();
                        } else {
                            allCells[0].children[i].innerHTML = +allCells[0].children[i].getAttribute('data');
                            allCells[0].children[i].classList.add('checked');

                            score++;
                            checkWinStatus();
                        }


                    }
                }
                console.log(score);
            })
        }
    }

}

activateCell();

// Flag cell
function flagCell() {
    let allCells = document.getElementsByClassName('grid');

    for (let i = 0; i < allCells[0].children.length; i++) {
        if (!gameUp) {
            allCells[0].children[i].addEventListener('contextmenu', (e) => {
                e.preventDefault();

                if (!gameUp && allCells[0].children[i].classList.contains('flag')) {
                    allCells[0].children[i].classList.remove('flag');
                    allCells[0].children[i].innerHTML = '';
                    updateFlagCount();
                } else if (flagLeft > 0 && !gameUp && !allCells[0].children[i].classList.contains('checked')) {

                    if (allCells[0].children[i].classList.contains('bomb')) {
                        bombsFlagged++;
                    }

                    allCells[0].children[i].classList.add('flag')
                    allCells[0].children[i].innerHTML = `🚩`;
                    updateFlagCount()
                    checkWinStatus();
                }
            })
        }
    }
}

flagCell();