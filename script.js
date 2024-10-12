let player1 = [1, 1];
let player2 = [1, 1];
let currentPlayer = 1;

function updateUI() {
    document.getElementById('player1-hand0').innerText = player1[0];
    document.getElementById('player1-hand1').innerText = player1[1];
    document.getElementById('player2-hand0').innerText = player2[0];
    document.getElementById('player2-hand1').innerText = player2[1];
    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
}

function attack() {
    let attackHand = prompt("Choose attacking hand (0/1):");
    let defendHand = prompt("Choose defending hand (0/1):");
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
}

function checkWin() {
    if (player1[0] === 0 && player1[1] === 0) {
        document.getElementById('status').innerText = "Player 2 wins!";
        disableControls();
    } else if (player2[0] === 0 && player2[1] === 0) {
        document.getElementById('status').innerText = "Player 1 wins!";
        disableControls();
    }
}

function disableControls() {
    document.querySelectorAll('button').forEach(button => button.disabled = true);
}

updateUI();
