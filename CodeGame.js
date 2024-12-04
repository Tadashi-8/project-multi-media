// Variables
let attempts = 10;
let gameLevel;
let mineCount = 10;
let treasurePosition;
let minePositions = [];
let playerName = '';

// Get player name and level from URL parameters
function getPlayerInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    playerName = urlParams.get('player-name');
    gameLevel = urlParams.get('game-level');
    document.getElementById('player-name-header').textContent = `Player: ${playerName}`;
    if (gameLevel === 'hard') {
        mineCount = 20;
    }
}

// Generate the game board
function createGameBoard() {
    const board = document.getElementById('game-board');
    const totalCells = 64;
    
    // Randomly place mines and treasure
    treasurePosition = Math.floor(Math.random() * totalCells);
    while (minePositions.length < mineCount) {
        let position = Math.floor(Math.random() * totalCells);
        if (!minePositions.includes(position) && position !== treasurePosition) {
            minePositions.push(position);
        }
    }

    // Create buttons
    for (let i = 0; i < totalCells; i++) {
        let button = document.createElement('button');
        button.dataset.index = i;
        button.addEventListener('click', () => handleButtonClick(i, button));
        board.appendChild(button);
    }
}

// Handle button click logic
function handleButtonClick(index, button) {
    if (minePositions.includes(index)) {
        // Player clicked on a mine
        button.innerHTML = '<img src="images/bomb.png" alt="Bomb">';
        playSound('lose');
        alert('Boom! You hit a mine.');
        endGame('lose');
    } else if (index === treasurePosition) {
        // Player clicked on the treasure
        button.innerHTML = '<img src="images/treasure.png" alt="Treasure">';
        playSound('win');
        showTreasureText();
        endGame('win');
    } else {
        // Safe button
        button.disabled = true;
        button.style.backgroundColor = 'lightgray';
        attempts--;
        document.getElementById('remaining-attempts').textContent = `Remaining Attempts: ${attempts}`;

        if (attempts === 0) {
            endGame('lose');
        }
    }
}

// End the game
function endGame(result) {
    const buttons = document.querySelectorAll('#game-board button');
    buttons.forEach(button => button.disabled = true);
    if (result === 'lose') {
        alert('You lost! Try again.');
    }
}

// Show treasure wisdom text
function showTreasureText() {
    const wisdomArray = [
        "A smile is a free way to brighten someone’s day.",
        "You are perfect because of your imperfections.",
        "Your story is unique. It can only be forged by you."
    ];
    const wisdom = wisdomArray[Math.floor(Math.random() * wisdomArray.length)];
    alert(`You found the treasure! Here's your wisdom: "${wisdom}"`);
}

// Play sound effects
function playSound(type) {
    const sound = new Audio(`sounds/${type}.mp3`);
    sound.play();
}

// Initialize game
window.onload = () => {
    getPlayerInfo();
    createGameBoard();
};
