let player1 = [1, 1];
let player2 = [1, 1];
let currentPlayer = 1;
let cpuDifficulty = 'easy';
let isVsCpu = false;

document.getElementById('attack-btn').addEventListener('click', attack);
document.getElementById('split-btn').addEventListener('click', split);
document.getElementById('attack-two-damage-btn').addEventListener('click', attackTwoDamage);
document.getElementById('double-attack-btn').addEventListener('click', () => doubleAttack(currentPlayer === 1 ? 'player1' : 'player2'));
document.getElementById('play-vs-cpu-btn').addEventListener('click', startVsCpu);
document.getElementById('cpu-difficulty').addEventListener('change', (event) => {
    cpuDifficulty = event.target.value;
    document.getElementById('status').innerText = `CPU difficulty set to ${cpuDifficulty}`;
});

const hands = document.querySelectorAll('.hand');
hands.forEach(hand => {
    hand.addEventListener('dragstart', drag);
    hand.addEventListener('drop', drop);
    hand.addEventListener('dragover', allowDrop);
});

function updateUI() {
    document.getElementById('player1-hand0').innerText = player1[0];
    document.getElementById('player1-hand1').innerText = player1[1];
    document.getElementById('player2-hand0').innerText = player2[0];
    document.getElementById('player2-hand1').innerText = player2[1];
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let attackHandId = event.dataTransfer.getData("text");
    let defendHandId = event.target.id;
    attack(attackHandId, defendHandId);
}

function attack(attackHandId, defendHandId) {
    let attackHand = parseInt(attackHandId.split('-')[2]);
    let defendHand = parseInt(defendHandId.split('-')[2]);
    if (currentPlayer === 1) {
        player2[defendHand] = (player2[defendHand] + player1[attackHand]) % 5;
        if (player2[defendHand] === 0) player2[defendHand] = 0;
        currentPlayer = 2;
    } else {
        player1[defendHand] = (player1[defendHand] + player2[attackHand]) % 5;
        if (player1[defendHand] === 0) player1[defendHand] = 0;
        currentPlayer = 1;
    }
    checkWin();
    updateUI();
    if (isVsCpu && currentPlayer === 2) {
        setTimeout(cpuMove, 1000);
    }
}

function split() {
    if (currentPlayer === 1) {
        let totalFingers = player1[0] + player1[1];
        if (totalFingers % 2 === 0 && totalFingers > 0) {
            player1[0] = player1[1] = totalFingers / 2;
        }
        currentPlayer = 2;
    } else {
        let totalFingers = player2[0] + player2[1];
        if (totalFingers % 2 === 0 && totalFingers > 0) {
            player2[0] = player2[1] = totalFingers / 2;
        }
        currentPlayer = 1;
    }
    updateUI();
    if (isVsCpu && currentPlayer === 2) {
        setTimeout(cpuMove, 1000);
    }
}

function attackTwoDamage() {
    let player2Hand0 = document.getElementById('player2-hand0');
    let player2Hand1 = document.getElementById('player2-hand1');
    player2Hand0.textContent = Math.max(0, parseInt(player2Hand0.textContent) + 1);
    player2Hand1.textContent = Math.max(0, parseInt(player2Hand1.textContent) + 1);
    document.getElementById('status').textContent = 'Player 1 attacked Player 2 with 2 damage!';
    currentPlayer = 2;
    updateUI();
}

function doubleAttack(player) {
    const playerHand0 = document.getElementById(`${player}-hand0`);
    const playerHand1 = document.getElementById(`${player}-hand1`);
    const opponent = player === 'player1' ? 'player2' : 'player1';
    const opponentHand0 = document.getElementById(`${opponent}-hand0`);
    const opponentHand1 = document.getElementById(`${opponent}-hand1`);
    const attackValue = parseInt(playerHand0.textContent) + parseInt(playerHand1.textContent);
    opponentHand0.textContent = (parseInt(opponentHand0.textContent) + attackValue) % 2;
    opponentHand1.textContent = (parseInt(opponentHand1.textContent) + attackValue) % 2;
    updateUI();
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function checkWin() {
    if (player1[0] === 5 && player1[1] === 5) {
        document.getElementById('status').innerText = 'Player 2 wins!';
    } else if (player2[0] === 5 && player2[1] === 5) {
        document.getElementById('status').innerText = 'Player 1 wins!';
    }
}

function startVsCpu() {
    isVsCpu = true;
    document.getElementById('status').innerText = 'Playing vs CPU';
}

function cpuMove() {
    if (cpuDifficulty === 'medium' || cpuDifficulty === 'hard') {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (player2[i] > 0 && player1[j] > 0 && (player1[j] + player2[i]) % 5 === 0) {
                    attack(`player2-hand${i}`, `player1-hand${j}`);
                    return;
                }
            }
        }
    }
    if (cpuDifficulty === 'hard' || cpuDifficulty === 'very hard') {
        let totalFingers = player2[0] + player2[1];
        if (totalFingers % 2 === 0 && totalFingers > 0) {
            player2[0] = player2[1] = totalFingers / 2;
            updateUI();
            currentPlayer = 1;
            return;
        }
    }
    if (cpuDifficulty === 'very hard') {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (player2[i] > 0 && player1[j] > 0 && (player1[j] + player2[i]) % 5 !== 0) {
                    attack(`player2-hand${i}`, `player1-hand${j}`);
                    return;
                }
            }
        }
    }
    const moveType = Math.random() < 0.5 ? 'attack' : 'split';
    if (moveType === 'attack') {
        const cpuHand = Math.floor(Math.random() * 2);
        const playerHand = Math.floor(Math.random() * 2);
        attack(`player2-hand${cpuHand}`, `player1-hand${playerHand}`);
    } else {
        const cpuHand = Math.floor(Math.random() * 2);
        const playerHand = Math.floor(Math.random() * 2);
        attack(`player2-hand${cpuHand}`, `player1-hand${playerHand}`);
    }
}
