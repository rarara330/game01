const playerCar = document.getElementById("player-car");
const gameContainer = document.querySelector(".game-container");
const scoreElement = document.getElementById("score");

let playerX = 180;
let score = 0;
let gameSpeed = 2;
let enemies = [];
let playerSpeed = 40;
let enemyInterval;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && playerX > 0) {
    playerX -= playerSpeed;
  } else if (event.key === "ArrowRight" && playerX < 360) {
    playerX += playerSpeed;
  }
  playerCar.style.left = playerX + "px";
});

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 360) + "px";
  gameContainer.appendChild(enemy);
  enemies.push({ element: enemy, y: -70 });
}

function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.y += gameSpeed;
    enemy.element.style.top = enemy.y + "px";

    if (enemy.y > 600) {
      enemy.y = -70;
      enemy.element.style.left = Math.floor(Math.random() * 360) + "px";
      score++;
      scoreElement.textContent = "Puntaje: " + score;

      if (score % 5 === 0) {
        gameSpeed++;
      }
    }

    const enemyRect = enemy.element.getBoundingClientRect();
    const playerRect = playerCar.getBoundingClientRect();
    if (
      enemyRect.top < playerRect.bottom &&
      enemyRect.bottom > playerRect.top &&
      enemyRect.left < playerRect.right &&
      enemyRect.right > playerRect.left
    ) {
      alert("¡Choque! Tu puntaje final es: " + score);
      saveHighScore(score);
      resetGame();
    }
  });
}

function saveHighScore(score) {
  const savedScores = JSON.parse(localStorage.getItem('highScores')) || [];
  if (savedScores.length < 5 || score > savedScores[savedScores.length - 1].score) {
    savedScores.push({ score });
    savedScores.sort((a, b) => b.score - a.score);
    if (savedScores.length > 5) savedScores.pop();
    localStorage.setItem('highScores', JSON.stringify(savedScores));
    displayHighScores();
  }
}

function resetGame() {
  enemies.forEach((enemy) => {
    gameContainer.removeChild(enemy.element);
  });
  enemies = [];
  score = 0;
  gameSpeed = 2;
  scoreElement.textContent = "Puntaje: 0";
  createEnemy();

  clearInterval(enemyInterval);
  enemyInterval = setInterval(() => {
    createEnemy();
  }, 5000);
}

function displayHighScores() {
  const savedScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoresList = document.getElementById("high-scores-list");
  highScoresList.innerHTML = '';

  savedScores.forEach((scoreData, index) => {
    const scoreItem = document.createElement("li");
    scoreItem.textContent = `#${index + 1} - ${scoreData.score} puntos`;
    highScoresList.appendChild(scoreItem);
  });
}

window.onload = displayHighScores;

function gameLoop() {
  updateEnemies();
  requestAnimationFrame(gameLoop);
}

createEnemy(); // Crear el primer enemigo
gameLoop();

enemyInterval = setInterval(() => {
  createEnemy();
}, 5000);
