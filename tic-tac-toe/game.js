// Game variables
const cellElements = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const statusText = document.getElementById('status');
let board = ['', '', '', '', '', '', '', '', ''];
const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];
let currentPlayer = 'X';
let gameActive = false;
let gameMode = '2-players'; // Default to 2-player mode

// Menu screen event listeners
document.getElementById('1-plyr').addEventListener("click", function() {
    gameMode = "1-player";
    currentPlayer = 'X'; // Human always starts first
    switchToGameScreen();
});

document.getElementById('2-plyrs').addEventListener("click", function() {
    gameMode = "2-players";
    currentPlayer = 'X'; // Reset to X for 2-player mode
    switchToGameScreen();
});

// Home button functionality
document.getElementById('home-btn').addEventListener('click', function() {
    switchToMenuScreen();
});

function switchToGameScreen() {
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    
    menuScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    startGame();
}

function switchToMenuScreen() {
    const menuScreen = document.getElementById('menu-screen');
    const gameScreen = document.getElementById('game-screen');
    
    gameScreen.classList.add('hidden');
    menuScreen.classList.remove('hidden');
    
    resetGameState();
}

function resetGameState() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = false;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning-cell');
    });
    
    statusText.textContent = `${currentPlayer}'s turn`;
}

// Initialize game
function startGame() {
    resetGameState();
    gameActive = true;
    
    // Remove old event listeners first
    cellElements.forEach(cell => {
        cell.replaceWith(cell.cloneNode(true));
    });
    
    // Get fresh references after clone
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', cellClicked);
    });
    
    restartBtn.addEventListener('click', restartGame);
    
    statusText.textContent = `${currentPlayer}'s turn`;
}

// Cell click handler
function cellClicked() {
    const cellIndex = parseInt(this.getAttribute('data-index'));
    
    if (board[cellIndex] !== '' || !gameActive) return;
    
    updateCell(this, cellIndex);
    checkGameStatus();
    
    // Computer's turn in 1-player mode
    if (gameMode === '1-player' && gameActive && currentPlayer === 'O') {
        setTimeout(computerMove, 800);
    }
}

// Update cell and board
function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

// Check game status
function checkGameStatus() {
    let roundWon = false;
    
    for (let i = 0; i < winningPatterns.length; i++) {
        const [a, b, c] = winningPatterns[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            highlightWinningCells([a, b, c]);
            break;
        }
    }
    
    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }
    
    if (!board.includes('')) {
        statusText.textContent = "Draw!";
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `${currentPlayer}'s turn`;
}

// Computer move logic
function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    
    let move = findWinningMove('O') || 
               findWinningMove('X') || 
               findRandomMove();
    
    if (move !== null) {
        const cellElement = document.querySelector(`[data-index="${move}"]`);
        updateCell(cellElement, move);
        checkGameStatus();
    }
}

// Helper functions for computer moves
function findWinningMove(player) {
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return null;
}

function findRandomMove() {
    const emptyCells = board.map((cell, index) => cell === '' ? index : null)
                           .filter(index => index !== null);
    return emptyCells.length > 0 ? 
           emptyCells[Math.floor(Math.random() * emptyCells.length)] : 
           null;
}

// Restart game
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `${currentPlayer}'s turn`;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning-cell');
    });
    
    if (gameMode === '1-player' && currentPlayer === 'O') {
        setTimeout(computerMove, 300);
    }
}

// Highlight winning cells
function highlightWinningCells(cells) {
    cells.forEach(index => {
        document.querySelector(`[data-index="${index}"]`).classList.add('winning-cell');
    });
}

// Initialize menu screen
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('menu-screen').classList.remove('hidden');
});