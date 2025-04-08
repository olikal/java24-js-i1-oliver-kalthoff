let playerName = '';
let totalScore = 0;
let roundScore = 0;
let rounds = 0;
const NUMBER_OF_DICE = 1;
let epilepsiMode = false;

const nameForm = document.querySelector("#name-form");
const wrapper = document.querySelector("#wrapper");
const playerDisplay = document.querySelector("#player-display");
const totalScoreEl = document.querySelector("#total-score");
const roundScoreEl = document.querySelector("#round-score");
const roundsEl = document.querySelector("#rounds");
const diceContainer = document.querySelector("#dice-container");
const message = document.querySelector("#message");
const backgroundColors = ["#f9f871", "#ffe066", "#ffb347", "#ff6666", "#ff85d1", "#c299ff"];
const epilepsiCheckbox = document.querySelector("#epilepsiMode");
const winSound = new Audio("./sounds/win-sound.mp3");

const btnStart = document.querySelector("#btn-start-game");
const btnRoll = document.querySelector("#btn-roll-dice");
const btnHold = document.querySelector("#btn-hold");
const btnRestart = document.querySelector("#btn-restart");


function createDice(number) {
  const dotPositionMatrix = {
    1: [[50, 50]],
    2: [[20, 20], [80, 80]],
    3: [[20, 20], [50, 50], [80, 80]],
    4: [[20, 20], [20, 80], [80, 20], [80, 80]],
    5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
    6: [[20, 20], [20, 80], [50, 20], [50, 80], [80, 20], [80, 80]]
  };

  const dice = document.createElement("div");
  dice.classList.add("dice");

  for (const dotPosition of dotPositionMatrix[number]) {
    const dot = document.createElement("div");
    dot.classList.add("dice-dot");
    dot.style.setProperty("--top", dotPosition[0] + "%");
    dot.style.setProperty("--left", dotPosition[1] + "%");
    dice.appendChild(dot);
  }

  return dice;
}

function randomizeDice(diceContainer, numberOfDice) {
  diceContainer.innerHTML = "";

    const random = Math.floor(Math.random() * 6) + 1;
    const dice = createDice(random);

    dice.classList.add("shake");

    setTimeout(() => {
      dice.classList.remove("shake");
    }, 700);

    diceContainer.append(dice);
    return random;
}

function updateUI() {
  totalScoreEl.textContent = totalScore;
  roundScoreEl.textContent = roundScore;
  roundsEl.textContent = rounds;
};


btnStart.addEventListener("click", () => {
  const nameInput = document.querySelector("#playerName").value;
  if (!nameInput) return alert("Ange namn!");

  epilepsiMode = epilepsiCheckbox.checked;
  playerName = nameInput;
  playerDisplay.textContent = `Spelare: ${playerName}`;
  nameForm.style.display = "none";
  wrapper.classList.remove("hidden");
});

btnRoll.addEventListener("click", () => {
  let roll = 1;
  let colorInterval = null;

  const diceInterval = setInterval(() => {
    roll = randomizeDice(diceContainer, NUMBER_OF_DICE);
  }, 50);

  if (!epilepsiMode) {
    colorInterval = setInterval(() => {
      const randomColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
      wrapper.style.backgroundColor = randomColor;
    }, 100);
  }


  setTimeout(() => {
    clearInterval(diceInterval);
    if (colorInterval) clearInterval(colorInterval);
    wrapper.style.backgroundColor = "";

    if (roll == 1) {
      roundScore = 0;
      rounds++;
      message.textContent = "Du slog en etta :'( Rundan är över."
    } else {
      roundScore += roll;
      message.textContent = "";
    }

    updateUI();
  }, 700);
});

btnHold.addEventListener("click", () => {
  totalScore += roundScore;
  roundScore = 0;
  rounds++;
  updateUI();

  if (totalScore >= 100) {
    message.textContent = `Grattis ${playerName}, du klarade det på ${rounds} rundor!`
    btnRoll.classList.add("hidden");
    btnHold.classList.add("hidden");
    btnRestart.classList.remove("hidden");

    wrapper.classList.add("winner");
    document.getElementById("victory-banner").style.display = "block";
    winSound.play();
    launchConfetti();
  } else {
    message.textContent = "Poäng sparade. Nästa runda!";
  }
});

btnRestart.addEventListener("click", () => {
  totalScore = 0;
  roundScore = 0;
  rounds = 0;
  message.textContent = "";
  btnRoll.classList.remove("hidden");
  btnHold.classList.remove("hidden");
  btnRestart.classList.add("hidden");
  wrapper.classList.remove("winner");
  document.getElementById("victory-banner").style.display = "none";
  document.getElementById("confetti-container").innerHTML = "";

  updateUI();
  diceContainer.innerHTML = "";
})

function launchConfetti(amount = 100) {
  const container = document.getElementById("confetti-container");
  const colors = ["#f94144", "#f3722c", "#f9c74f", "#90be6d", "#43aa8b", "#577590"];

  for (let i = 0; i < amount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
    confetti.style.width = Math.random() * 8 + 4 + "px";
    confetti.style.height = confetti.style.width;

    container.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
}

