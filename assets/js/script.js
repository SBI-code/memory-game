document.addEventListener("DOMContentLoaded", () => {
    const emojis = ["🚀", "🪐", "🌍", "🌌", "🔭", "🌕", "☄️", "🌠"];

    // Create an array of pairs
    let cardsArray = emojis.concat(emojis);

    // Shuffle the array items
    cardsArray.sort(() => Math.random() - 0.5);

    // Selects the element ID gameGrid and store in the grid variable. Game start with both cards holding 'null' values. lockBoard is false allowing players to select cards. 
    const grid = document.getElementById("gameGrid");
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
});