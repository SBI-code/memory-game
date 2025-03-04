document.addEventListener("DOMContentLoaded", () => {

    const emojis = ["🚀", "🪐", "🌍", "🌌", "🔭", "🌕", "☄️", "🌠"];

    const scoreContainer = document.getElementById('score');
    const timerContainer = document.getElementById("timer");

    // Winner message modal
    const winnerModal = document.getElementById("winnerModal");

    // Game over modal
    const gameOverModal = document.getElementById("gameOverModal");

    // How to play modal and button
    const howToPlayModal = document.getElementById("howToPlayModal");
    const howToPlayButton = document.getElementById("howToPlayButton");
    const closeHowToPlay = document.getElementById("closeHowToPlay");

    // Load game sound files
    const matchSound = new Audio("assets/audio/match.mp3");
    const mismatchSound = new Audio("assets/audio/mismatch.mp3");
    const gameOverSound = new Audio("assets/audio/gameover.mp3");
    const winSound = new Audio("assets/audio/win.mp3");

    let score = 0; // Initialise score
    let matchedPairs = 0; // Track matched pairs
    let timeLeft = 60; // 60 second timer
    let timerInterval = null;
    let isTimerRunning = false;

    // Open the modal when the "How to Play" button is clicked
    howToPlayButton.addEventListener("click", () => {
        howToPlayModal.style.display = "flex";
    });

    // Close the modal if user clicks on the X 
    closeHowToPlay.addEventListener("click", () => {
        howToPlayModal.style.display = "none";
    });

    // Close the modal if user clicks outside of it
    window.addEventListener("click", (event) => {
        if (event.target === howToPlayModal) {
            howToPlayModal.style.display = "none";
        }
    });

    // Create an array of pairs
    const cardsArray = emojis.concat(emojis);

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

    function playSound(sound) {
        sound.currentTime = 0; // Reset sound if it's already playing
        sound.play();
    }

    // Starts the countdown and minuses seconds, if it reaches zero before all the cards are matched, show game over message
    function startTimer() {
        if (!isTimerRunning) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                timerContainer.innerText = timeLeft;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    playSound(gameOverSound); // Play game over sound
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
            playSound(matchSound); // Play match sound
            // Match found, increase score
            score++;
            matchedPairs++; // Increase matched pairs
            scoreContainer.innerText = score; // Update the score total
            resetBoard();

            // Check if all pairs are matched 
            checkWin();
        } else {
            playSound(mismatchSound); // Play mismatch sound
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
                playSound(winSound); // Play win sound
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

    // event listneer for mute toggle 
    let muteButton = document.getElementById('muteButton');
    muteButton.addEventListener('click', muteToggle);
    /**
     * Mutes all audio. If already muted, unmutes all audio.
     */
    function muteToggle() {
        if (matchSound.muted != true) {
            matchSound.muted = true;
            mismatchSound.muted = true;
            gameOverSound.muted = true;
            winSound.muted = true;
            document.getElementById('muteButton').innerHTML = "🔇";
        } else {
            matchSound.muted = false;
            mismatchSound.muted = false;
            gameOverSound.muted = false;
            winSound.muted = false;
            document.getElementById('muteButton').innerHTML = "🔊";
        }
    }
})

document.getElementById("tryAgainButton").addEventListener("click", restartGame);
document.getElementById("playAgainButton").addEventListener("click", restartGame);