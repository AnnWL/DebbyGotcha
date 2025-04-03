//variables

let state = {
  boredom: 0,
  hunger: 0,
  sleepiness: 0,
};

const imageAssets = {
  dancing: ["./assets/dancing_2.png", "./assets/dancing_3.png"],
  sleeping: ["./assets/sleeping_1.png", "./assets/sleeping_2.png"],
  coffee: ["./assets/coffee_1.png", "./assets/coffee_2.png"],
  shopping: ["./assets/shopping_1.png", "./assets/shopping_2.png"],
  wave: ["./assets/wave_3.png", "./assets/wave_2.png"],
  crochet: ["./assets/crochet_1.png", "./assets/crochet_2.png"],
  exercise: ["./assets/exercise_1.png", "./assets/exercise_2.png"],
  seafood: ["./assets/seafood_1.png", "./assets/seafood_1.png"],
  soup: ["./assets/soup_1.png", "./assets/soup_2.png"],
  rest: ["./assets/wave_1.png", "./assets/at_rest_2.png"],
};

const messageAssets = {
  dancing: "tra lala tra lala",
  shopping: "buy buy buy!",
  crochet: "loop, pull, yarn over~",
  exercise: "feel the burnnnnnnnn🔥",
  coffee: "cold brew is life 🧋",
  seafood: "Ew. Fishes are my friends!🐠",
  soup: "yum yum for the tum tum 😋",
  sleeping: "Good night! 💤",
};

const altAssets = {
  dancing: "a girl dancing and smiling away",
  shopping: "a girl carrying a shopping bag on her way to shopping",
  crochet: "a girl doing knitting",
  exercise: "a girl exercising",
  coffee: "a girl enjoying her cold brew coffee",
  seafood: "a girl eating seafood and displaying an expression of disgust",
  soup: "a girl drinking soup",
  sleeping: "a girl sleeping soundly",
};

let gameOver;
let timer;
let animationInterval;

//cached element references
const friendshipStatEl = document.getElementById("friendship-stat");
const hungerStatEl = document.getElementById("hunger-stat");
const sleepinessStatEl = document.getElementById("sleepiness-stat");

const playBtnEl = document.getElementById("play");
const sleepBtnEl = document.getElementById("sleep");
const feedBtnEl = document.getElementById("feed");

const gameMessageEl = document.getElementById("message");
const gameAnimationEl = document.getElementById("animation");

const resetBtnEl = document.getElementById("restart");

//function
function initTama() {
  resetBtnEl.classList.add("hidden");

  state = {
    boredom: 3,
    hunger: 10,
    sleepiness: 10,
  };

  gameOver = false;

  if (timer) clearInterval(timer);
  timer = setInterval(runGame, 20000);
  gameAnimationEl.src = "./assets/at_rest_1.png";

  renderTama();
}

function generateHearts(points) {
  const fullHearts = Math.floor(points / 2);
  const halfHearts = points % 2;
  const emptyHearts = 5 - fullHearts - halfHearts;

  const hearts = [];

  for (let i = 0; i < fullHearts; i++) {
    hearts.push("./assets/heart_1.png");
  }

  for (let i = 0; i < halfHearts; i++) {
    hearts.push("./assets/heart_3.png");
  }

  for (let i = 0; i < emptyHearts; i++) {
    hearts.push("./assets/heart_2.png");
  }

  return hearts;
}

function updateHeartRow(statId, points) {
  const heartRow = document.getElementById(statId);
  const heartImages = generateHearts(points);
  heartRow.innerHTML = "";

  heartImages.forEach((src) => {
    const img = document.createElement("img");
    img.classList.add("heart");
    img.src = src;
    heartRow.appendChild(img);
  });
}
function renderTama() {
  if (gameOver) {
    clearInterval(timer);
    resetBtnEl.classList.remove("hidden");
    resetBtnEl.style.display = "block";
    gameAnimationEl.src = "./assets/gameOver.png";
    gameMessageEl.innerText =
      "I promise not to be late for our appointments again :(";
  }
  updateHeartRow("friendship-heart-row", state.boredom);
  updateHeartRow("hunger-heart-row", state.hunger);
  updateHeartRow("sleepiness-heart-row", state.sleepiness);
}

function updateStates() {
  state.boredom -= Math.floor(Math.random() * 2);
  state.hunger -= Math.floor(Math.random() * 2);
  state.sleepiness -= Math.floor(Math.random() * 2);
}

function checkGameOver() {
  if (state.boredom <= 0 || state.hunger <= 0 || state.sleepiness <= 0) {
    gameOver = true;
  }
}

function setAnimations(id, timer_animation = 500) {
  if (animationInterval) clearInterval(animationInterval);

  let current = 0;
  let frames = imageAssets[id];

  gameAnimationEl.src = frames[current];

  animationInterval = setInterval(() => {
    current = (current + 1) % frames.length;
    gameAnimationEl.src = frames[current];
  }, timer_animation);

  setTimeout(() => {
    clearInterval(animationInterval);
    animationInterval = null;
    gameAnimationEl.style.opacity = 0;

    setTimeout(() => {
      gameAnimationEl.src = "./assets/at_rest_1.png";
      gameAnimationEl.style.opacity = 1;
      gameMessageEl.innerText = "";
    }, 500);
  }, 5000);
}

function handlePlay() {
  if (num_points >= 5) {
    const playArr = ["dancing", "crochet", "exercise"];
    const randomizer = Math.floor(Math.random() * playArr.length);
    const chosenActivity = playArr[randomizer];
    setAnimations(chosenActivity);
    gameAnimationEl.alt = altAssets[chosenActivity];
    gameMessageEl.innerText = messageAssets[chosenActivity];
    state.boredom += 2;
    num_points -= 2;
  } else {
    gameAnimationEl.src = "./assets/angry_1.png";
    gameAnimationEl.alt = "an angry girl refusing to do any task";
    gameMessageEl.innerText = "Not enough points. Complete tasks first!";
  }
}

function handleSleep() {
  if (num_points >= 5) {
    const chosenActivity = "sleeping";
    setAnimations(chosenActivity);
    gameMessageEl.innerText = messageAssets[chosenActivity];
    gameAnimationEl.alt = altAssets[chosenActivity];
    state.sleepiness = 10;
    num_points -= 5;
  } else {
    gameAnimationEl.src = "./assets/angry_1.png";
    gameAnimationEl.alt = "an angry girl refusing to do any task";
    gameMessageEl.innerText = "Not enough points. Complete tasks first!";
  }
}

function handleEat() {
  if (num_points >= 2) {
    const foodArr = ["coffee", "seafood", "soup"];
    const randomizer = Math.floor(Math.random() * foodArr.length);
    const chosenActivity = foodArr[randomizer];
    setAnimations(chosenActivity);
    gameAnimationEl.alt = altAssets[chosenActivity];
    gameMessageEl.innerText = messageAssets[chosenActivity];
    state.hunger += 2;
    num_points -= 2;
    if (chosenActivity == "seafood") {
      state.boredom -= 1;
    }
  } else {
    gameAnimationEl.src = "./assets/angry_1.png";
    gameAnimationEl.alt = "an angry girl refusing to do any task";
    gameMessageEl.innerText = "Not enough points. Complete tasks first!";
  }
}

function runGame() {
  updateStates();
  checkGameOver();
  renderTama();
}

// Add event listeners
playBtnEl.addEventListener("click", handlePlay);
feedBtnEl.addEventListener("click", handleEat);
sleepBtnEl.addEventListener("click", handleSleep);
gameAnimationEl.addEventListener("mouseenter", function () {
  const randomizer = Math.floor(Math.random() * imageAssets["rest"].length);
  gameAnimationEl.src = imageAssets["rest"][randomizer];
  gameAnimationEl.alt = "a girl smiling and waving at you";
});

gameAnimationEl.addEventListener("mouseleave", function () {
  gameAnimationEl.src = "./assets/at_rest_1.png";
  gameAnimationEl.alt = "a girl standing and looking back at you";
});

resetBtnEl.addEventListener("click", initTama);

initTama();
