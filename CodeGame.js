let attempts = 10; // عدد المحاولات المتبقية للاعب.
let gameLevel; // مستوى اللعبة (يتم تحديده بناءً على اختيار اللاعب من الرابط).
let mineCount = 10; // عدد الألغام الافتراضي.
let treasurePosition; // موقع الكنز (يتم تحديده عشوائيًا).
let minePositions = []; // مصفوفة تحتوي على المواقع التي توجد بها الألغام.
let playerName = ''; // اسم اللاعب.


// تقوم هذه الدالة بجلب معلومات اللاعب (اسمه ومستوى اللعبة)
function getPlayerInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    playerName = urlParams.get('player-name');
    gameLevel = urlParams.get('game-level');
    document.getElementById('player-name-header').textContent = `Player: ${playerName}`;
    if (gameLevel === 'hard') {
        mineCount = 20;
    }
}

// انشاء لوحة اللعبة باستخدام 64 زر

function createGameBoard() {
    const board = document.getElementById('game-board');
    const totalCells = 64;

    treasurePosition = Math.floor(Math.random() * totalCells);
    while (minePositions.length < mineCount) {
        let position = Math.floor(Math.random() * totalCells);
        if (!minePositions.includes(position) && position !== treasurePosition) {
            minePositions.push(position);
        }
    }

    for (let i = 0; i < totalCells; i++) {
        let button = document.createElement('button');
        button.dataset.index = i;
        button.addEventListener('click', () => handleButtonClick(i, button));
        board.appendChild(button);
    }
}

//التفاعل مع نقر الازرار

function handleButtonClick(index, button) {
    if (minePositions.includes(index)) {

        // اظهار رسالة الخسارة 

        button.innerHTML = '<img src="images/bomb.png" alt="Bomb">';
        playSound('lose');
        alert('Boom! You hit a mine.');
        endGame('lose');
    } else if (index === treasurePosition) {

        // اظهار رسالة مع حكمة وانهاء اللعبة 
        button.innerHTML = '<img src="images/treasure.png" alt="Treasure">';
        playSound('win');
        showTreasureText();
        endGame('win');
    } else {

        // تقليل عدد المحاولات , تعطيل الزر وتغيير لونه 
        button.disabled = true;
        button.style.backgroundColor = 'lightgray';
        attempts--;
        document.getElementById('remaining-attempts').textContent = `Remaining Attempts: ${attempts}`;

        if (attempts === 0) {
            endGame('lose');
        }
    }
}


// انهاء اللعبة عن طريق تعطيل جميع الأزرار.

function endGame(result) {
    const buttons = document.querySelectorAll('#game-board button');
    buttons.forEach(button => button.disabled = true);
    if (result === 'lose') {
        alert('You lost! Try again.');
    }
}

// عرض رسالة عشوائية مع حكمة اذا حصل اللاعب الكنز 
function showTreasureText() {
    const wisdomArray = [
        "A smile is a free way to brighten someone’s day.",
        "You are perfect because of your imperfections.",
        "Your story is unique. It can only be forged by you."
    ];
    const wisdom = wisdomArray[Math.floor(Math.random() * wisdomArray.length)];
    alert(`You found the treasure! Here's your wisdom: "${wisdom}"`);
}


function playSound(type) {
    const sound = new Audio(`sounds/${type}.mp3`);
    sound.play();
}


window.onload = () => {
    getPlayerInfo();
    createGameBoard();
};
