document.addEventListener("DOMContentLoaded", () => {
    const emojis = ["🚀", "🪐", "🌍", "🌌", "🔭", "🌕", "☄️", "🌠"];

    const scoreContainer = document.getElementById('score');
    const timerContainer = document.getElementById("timer");
    const winnerModal = document.getElementById("winnerModal");
    const gameOverModal = document.getElementById("gameOverModal");

    let score = 0; // Initialise score
    let matchedPairs = 0; // Track matched pairs
    let timeLeft = 60; // 60 second timer
    let timerInterval = null;
    let isTimerRunning = false;

    // Create an array of pairs
    let cardsArray = emojis.concat(emojis);

    // Shuffle the array items
    cardsArray.sort(() => Math.random() - 0.5);

    // Selects the element ID gameGrid and store in the grid variable. Game start with both cards holding 'null' values. lockBoard is false allowing players to select cards 
    const grid = document.getElementById("gameGrid");
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    // Creates a new board with a cleared game grid 
    function createBoard() {
        grid.innerHTML = "";
        matchedPairs = 0; // Reset matched pairs to zero
        score = 0; // Reset score to zero
        clearInterval(timerInterval); // Stop previous timer
        timeLeft = 60; // Reset timer to 60 seconds
        timerContainer.innerText = timeLeft;
        isTimerRunning = false; // Ensure timer starts fresh
        scoreContainer.innerText = score;
        winnerModal.style.display = "none"; // Hide the winner modal on game start
        gameOverModal.style.display = "none" // Hide the game over modal on game start
        cardsArray.sort(() => Math.random() - 0.5); // Reshuffle the array items

        // Reset timer and update the timer display
        clearInterval(timerInterval);
        isTimerRunning = false;

        // Creates a card for each emoji for the div element and flips the card when clicked
        cardsArray.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.emoji = emoji;
            card.addEventListener("click", flipCard);
            grid.appendChild(card);
        });
    }

    // Starts the countdown and minuses seconds, if it reaches zero before all the cards are matched, show game over message
    function startTimer() {
        if (!isTimerRunning) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                timerContainer.innerText = timeLeft;

                if (timeLeft <=0) {
                    clearInterval(timerInterval);
                    gameOverModal.style.display = "flex"; // Show Game Over message modal
                }
            }, 1000);
        }
    }

    // Any element in the game that has been clicked will be the first card and will flip displaying an emoji
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        startTimer(); // Start the countdown when the first move is made

        this.textContent = this.dataset.emoji;
        this.classList.add("flipped");

        if (!firstCard) {
            firstCard = this;
            return;
        }

        // Flips the second card and locks the game to prevent a third card being selected
        secondCard = this;
        lockBoard = true;

        //  Check if the cards match
        checkMatch();
    }

    // Define checkMatch function, if both emojis are the same, reset board to restart the process, otherwise unflip the cards and reset board
    function checkMatch() {
        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
            // Match found, increase score
            score++;
            matchedPairs++; // Increase matched pairs
            scoreContainer.innerText = score; // Update the score total
            resetBoard();

            // Check if all pairs are matched 
            checkWin();
        } else {
            // No match, flip the cards back over
            setTimeout(() => {
                firstCard.textContent = "";
                secondCard.textContent = "";
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                resetBoard();
            }, 1000);
        }
    }

    // Check if player has won
    function checkWin() {
        if (matchedPairs === emojis.length) {
            // All pairs matched
            clearInterval(timerInterval); // Stop the timer when the game is won
            setTimeout(() => {
                winnerModal.style.display = "flex"; // Show winner message modal
            }, 500);
        }
    }

    // If first and second card return null values, board is not locked
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    // At the end of the game, winner is announced and player restarts the game board
    window.restartGame = function () {
        createBoard(); 
    };
    
    // Initialise game
    createBoard(); 
})


// Toggle text function - initial state of text is hidden, click once -> text appears, click again -> text hides
function toggleText() {
    const popup = document.getElementById('popupText');
    if (popup.style.display === 'none' || popup.style.display === '') {
        popup.style.display = 'block'; // Show the text
    } else {
        popup.style.display = 'none'; // Hide the text
    }
}

document.getElementById("tryAgainButton").addEventListener("click", restartGame);
document.getElementById("playAgainButton").addEventListener("click", restartGame);