let savedBest = localStorage.getItem('simonRecord') || 0;
let userStep = 0;
let isCanClick = false;
let gameSequence = [];

const button = document.querySelector("#start-btn");
const currentRoundElement = document.getElementById("current-round");
const bestScoreElement = document.getElementById("best-score");
const statusButton = document.querySelector(".status-box");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const generateNumber = () => 1;

gameSequence.push(generateNumber());

document.addEventListener("DOMContentLoaded", () => {
    bestScoreElement.innerText = savedBest;
});

async function startCountdown() {
    const statusArray = ["GO!"];
    for (const status of statusArray) {
        statusButton.innerText = status;
        await delay(1000);
    }
}

async function showCards() {
    button.disabled = true;
    isCanClick = false;
    
    await startCountdown();
    
    for (let i = 0; i < gameSequence.length; i++) {
        const cardId = gameSequence[i];
        const cardElement = document.getElementById(cardId);
        
        cardElement.classList.add("active");
        await delay(600);
        cardElement.classList.remove("active");
        await delay(200);
    }
    
    isCanClick = true;
}

function restart() {
    gameSequence.length = 0;
    userStep = 0;
    gameSequence.push(generateNumber());
    button.disabled = false;
}

button.addEventListener('click', showCards);

document.querySelectorAll(".game-board div").forEach(card => {
    card.addEventListener('click', async function() {
        if (!isCanClick) return;

        card.classList.add("active");
        await delay(150);
        card.classList.remove("active");

        let cardId = gameSequence[userStep];
        let userCard = parseInt(card.id);

        if (cardId == userCard) {
            userStep++;
            
            if (userStep == gameSequence.length) {
                statusButton.classList.add("right");
                statusButton.innerText = "RIGHT";
                await delay(2000);
                statusButton.classList.remove("right");
                await delay(500);

                currentRoundElement.innerText = gameSequence.length;

                if (gameSequence.length > Number(bestScoreElement.innerText)) {
                    bestScoreElement.innerText = gameSequence.length;
                    localStorage.setItem('simonRecord', gameSequence.length);
                }

                userStep = 0;
                gameSequence.push(generateNumber());
                showCards();
            }
        } else {
            statusButton.classList.add("error");
            statusButton.innerText = "INCORRECT";
            await delay(2000);
            statusButton.classList.remove("error");
            await delay(500);

            statusButton.innerText = "PRESS START";
            currentRoundElement.innerText = 1;
            isCanClick = false;
            restart();
        }
    });
});