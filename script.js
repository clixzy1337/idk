const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;

// Initialize deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();
}

// Shuffle deck
function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
}

// Deal a card
function dealCard() {
    return deck.pop();
}

// Get score for a hand
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.value)) {
            score += 10;
        } else if (card.value === 'A') {
            aces++;
            score += 11;
        } else {
            score += parseInt(card.value);
        }
    });

    // Adjust for aces
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Update scores and display cards
function updateDisplay() {
    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerScoreElement = document.getElementById('player-score');
    const dealerScoreElement = document.getElementById('dealer-score');
    const messageElement = document.getElementById('message');

    playerCardsElement.innerHTML = playerHand.map(card => `<div class="card">${card.value}${card.suit}</div>`).join('');
    dealerCardsElement.innerHTML = dealerHand.map(card => `<div class="card">${card.value}${card.suit}</div>`).join('');
    playerScoreElement.textContent = `Score: ${playerScore}`;
    dealerScoreElement.textContent = `Score: ${dealerScore}`;

    if (gameOver) {
        if (playerScore > 21) {
            messageElement.textContent = "You busted! Dealer wins!";
        } else if (dealerScore > 21) {
            messageElement.textContent = "Dealer busted! You win!";
        } else if (playerScore > dealerScore) {
            messageElement.textContent = "You win!";
        } else if (playerScore < dealerScore) {
            messageElement.textContent = "Dealer wins!";
        } else {
            messageElement.textContent = "It's a tie!";
        }
    }
}

// Start a new game
function startNewGame() {
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    gameOver = false;
    createDeck();

    // Deal initial cards
    playerHand.push(dealCard(), dealCard());
    dealerHand.push(dealCard(), dealCard());

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    updateDisplay();
}

// Hit button
document.getElementById('hit').addEventListener('click', () => {
    if (!gameOver) {
        playerHand.push(dealCard());
        playerScore = calculateScore(playerHand);

        if (playerScore > 21) {
            gameOver = true;
        }

        updateDisplay();
    }
});

// Stand button
document.getElementById('stand').addEventListener('click', () => {
    if (!gameOver) {
        // Dealer's turn
        while (dealerScore < 17) {
            dealerHand.push(dealCard());
            dealerScore = calculateScore(dealerHand);
        }

        gameOver = true;
        updateDisplay();
    }
});

// Start new game button
document.getElementById('start-game').addEventListener('click', () => {
    startNewGame();
});

// Start the game initially
startNewGame();
